// @ts-check

/*
 * Environment Variables Supported by this Vite Config:
 *
 *   SKIP_TWEE      - If set (any value), skips compiling .twee files during build and dev server. Useful for JS/CSS-only builds or rapid iteration.
 *   NODE_ENV       - Standard Node.js environment variable, used by Vite for mode selection (e.g., 'development', 'production').
 *   PORT           - If set, overrides the dev server port (default: 3800).
 *   HOT_RELOAD     - EXPERIMENTAL. If set to 1/true, will try to hot-reload the changed .ts/.tsx files only, instead of doing a full page reload.
 *   (add more here as needed)
 *
 * Example usage:
 *   SKIP_TWEE=1 npx vite build --mode development
 *   NODE_ENV=production npx vite build --mode production
 *   PORT=4000 npx vite dev
 */

//
// To run a build:
//   npx vite build --mode {mode}
//
// Available build modes:
//   production: build the deploy public release build
//   itch: generate special production build for itch.io (it has a limit of 1000 files, so we have to do some tweaks)
//   development: build without minifying and with source maps
//   watch: same as development, but automatically retrigger build when js or twee file changes are detected
//
//
// To run the interactive dev server [WIP]:
//   npx vite dev
//   HOT_RELOAD=1 npx vite dev
//

import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as url from 'node:url'
import * as path from 'node:path'
import * as child_process from 'node:child_process'

import { defineConfig } from 'vite'
import solidjsPlugin from 'vite-plugin-solid'
import postcssAutoprefixer from 'autoprefixer'
// @ts-ignore
import postcssNesting from 'postcss-nesting'
import glob from 'fast-glob'
import CONFIG from './src/config.json'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDebug = (mode === 'development')
  const isDevServer = (command === 'serve')
  const isWatchMode = process.argv.includes('--watch')
  const outDir = path.join(__dirname, isDebug ? 'generated/debug' : 'generated/dist')

  const indexHtmlPath = isDevServer ? "./dist/devserver.html" : "./dist/index.html"

  const DYNAMIC_MODULES = ['devtool']

  // A virtual (in-memory) module will be used as the entry point to the FOC bundle
  // That virtual module will include all other .js files (so non-imported files are included),
  // and in itch.io builds will also include the embed image index
  const VIRTUAL_JS_MODULE = './src/index.virtual.js'
  const VIRTUAL_JS_MODULE_RESOLVED_ID = /*'\0' +*/ VIRTUAL_JS_MODULE
  function generateVirtualModuleCode() {
    // Dynamically generate an index with all .js files (so non-imported modules get compiled)
    let js = [
      ...glob.sync(CONFIG.directories["user-js"]),
      ...glob.sync(CONFIG.directories["user-css"]),
    ].map(f => `import "${f.replace("./src", ".")}";`).join('\n')
    return js
  }

  /**
   * @param {string} mode
   * @param {import('vite').WebSocketServer} [ws]
   */
  async function compileTwee(mode, ws) {
    if (!process.env.SKIP_TWEE) {
      const scriptFile = (os.platform() === 'win32' ? 'compile.bat' : 'compile.sh')
      try {
        await new Promise((resolve, reject) => {
          child_process.spawn(path.join(__dirname, scriptFile), [ mode, "", indexHtmlPath ], {
            stdio: ['ignore', 'inherit', 'inherit']
          }).on('exit', code => code ? reject(code) : resolve(code))
        })
        console.info("Rebuild finished")
      } catch (err) {
        console.error('Twee compile failed:', err)
        if (ws) ws.send({ type: 'error', err: /** @type {any} */ (err) })
      }
    }
  }

  const assetFileNames = (/** @type {import('rollup').PreRenderedAsset} */ asset) => {
    const ext = (asset.name ?? '').split('.').pop()
    switch (ext) {
      case 'css':
        return 'styles/user.min.[ext]'
      case 'png':
      case 'svg':
        return 'assets/[name].[ext]'
      default:
        return 'assets/[name].[ext]'
    }
  }


  return {
    //target: 'modules',
    plugins: [
      solidjsPlugin(),
      (function () {
        /** @type {import('vite').ResolvedConfig} */
        let config;
        return {
          name: 'foc-vite-plugin',
          resolveId(id) { // inject the virtual es6 module
            if (id === VIRTUAL_JS_MODULE) {
              return VIRTUAL_JS_MODULE_RESOLVED_ID
            }
          },
          load(id) { // inject the virtual es6 module
            if (id === VIRTUAL_JS_MODULE_RESOLVED_ID) {
              return generateVirtualModuleCode()
            }
          },
          configResolved(config_) {
            config = config_;
          },
          /**
           * Dev server: serve a modified index.html file, remap assets, and watch .twee files.
           * On .twee change, recompile and trigger a full browser reload.
           *
           * SKIP_TWEE env var: Set to skip compiling .twee files (for JS/CSS-only builds).
           */
          async configureServer(server) {
            const enableHotReload = (server.config.env['HOT_RELOAD'] ?? '0') !== '0';
            if (enableHotReload) {
              config.logger.warn('\x1b[35m' + 'Enabled EXPERIMENTAL hot-reload mode' + '\x1b[0m');
            }

            await compileTwee('devserver', server.ws)
            const virtualModulePath = VIRTUAL_JS_MODULE.substring(1)
            // Watch .twee and .ts files in dev mode and recompile on change, then reload browser (debounced)
            server.watcher.add(path.join(__dirname, 'project/twee/**/*.twee'))
            server.watcher.add(path.join(__dirname, 'src/**/*.{ts,tsx,css}'))

            /** @type {ReturnType<typeof setTimeout>|undefined} */
            let fullReloadTimeout = undefined
            /** @type {Record<string, ReturnType<typeof setTimeout>|undefined>} */
            let tsHotReloadTimeouts = {}
            let hasTweeChanges = false

            server.watcher.on('change', (file) => {
              const isCodeFile = /\.(ts|tsx|css)$/.test(file);
              if (enableHotReload && isCodeFile) {
                // Apply individual debounce for each file
                clearTimeout(tsHotReloadTimeouts[file])
                tsHotReloadTimeouts[file] = setTimeout(() => {
                  // Compile only the changed file to JS using tsc
                  const tsc = child_process.spawn('npx', ['tsc', file, '--outDir', path.dirname(file), '--target', 'ESNext', '--module', 'ESNext', '--moduleResolution', 'node', '--esModuleInterop', '--skipLibCheck', '--noEmit', 'false', '--pretty', 'false'], {
                    stdio: ['ignore', 'inherit', 'inherit']
                  })
                  tsc.on('exit', (code) => {
                    if (code === 0) {
                      server.ws.send({ type: 'full-reload' })
                    } else {
                      console.error('TypeScript compile failed for', file)
                    }
                  })
                }, 200) // 200ms debounce
              } else {
                const isTweeFile = file.endsWith('.twee')
                if (isTweeFile || isCodeFile) {
                  hasTweeChanges ||= isTweeFile
                  clearTimeout(fullReloadTimeout)
                  fullReloadTimeout = setTimeout(async () => {
                    if (hasTweeChanges) {
                      hasTweeChanges = false
                      await compileTwee('devserver', server.ws)
                    }
                    server.ws.send({ type: 'full-reload' })
                  }, 200) // 200ms debounce
                }
              }
            })
            server.middlewares.use((req, res, next) => {
              if (req.url === '/') {
                // Hotpatch the SugarCube JS so that it loads the initial userscript from devserver.
                // Most of these replaces are required in order to make SugarCube code support awaiting the async promise
                const replacements = /** @type {const} */ ([
                  [/new Promise\(\(function\s*\(resolve\)\s*{\s*Story.init\(\)/, () => 'new Promise((async function (resolve) { Story.init()'],
                  [/,\s*Engine.runUserScripts\(\),/, () => `; await Engine.runUserScripts();`],
                  [/runUserScripts:\s*\{\s*value:\s*function\s*\(\)/, () => `runUserScripts: { value: async function ()`],
                  [/,\s*Story.getScripts\(\).forEach\((?:[\s\S\n])*?(?=Story\.getWidgets)/, () => (
                      `); if (_state === States.Init) {`
                        + `await Scripting.evalJavaScript(\`(() => {`
                        + `Object.assign(window, { setup, storage, importScripts, postrender, clone, setPageElement, Alert, Browser, Config, DebugBar, DebugView, Dialog, Diff, Engine, Fullscreen, Has, History, Lexer, LoadScreen, Macro, MacroContext, Passage, Patterns, Save, Scripting, Setting, SimpleAudio, SimpleStore, Serial, State, Story, StyleWrapper, Template, UI, UIBar, Util, Visibility, Wikifier });`
                        + `return import("${VIRTUAL_JS_MODULE}")})()\`); `
                      + `}; _state === States.Init && (`
                    )]
                ]);

                return fs.readFile(path.join(__dirname, indexHtmlPath), 'utf8').then(html => {
                  for (const [regexp, getReplacedValue] of replacements) {
                    let replaced = false;
                    html = html.replace(regexp, (...args) => (replaced = true, getReplacedValue.apply(undefined, /** @type {any} */ (args))));
                    if (!replaced) {
                      console.error(`Error serving the devmode html: failed to find \`${regexp}\` for hotpatching. Devmode won't work. If you updated the SugarCube storyformat, the patterns will need to be changed.`);
                    }
                  }
                  res.setHeader('content-type', 'text/html').end(html);
                });
              } else if (req.url === virtualModulePath) {
                return res.setHeader('content-type', 'text/javascript').end(generateVirtualModuleCode())
              }
              next()
            })
          },
          /**
           * Vite 4+ only: configurePreviewServer for preview-specific logic
           */
          async configurePreviewServer(server) {
            // You can add preview-specific middleware or logic here if needed
            // Example: serve a custom preview index.html
            server.middlewares.use((req, res, next) => {
              if (req.url === '/') {
                return fs.readFile(path.join(__dirname, indexHtmlPath), 'utf8').then(html => (
                  res.setHeader('content-type', 'text/html').end(html)
                ))
              }
              next()
            })
          },
          renderDynamicImport() {
            return { left: '(new Promise((resolve, reject) => require([', right: '], (d) => resolve(d[0]))))' }
          },
          buildStart() {
            if (isWatchMode) { // in watch mode, trigger a rebuild of the twee files to rebuild the index.html
              const tweeFiles = glob.sync(path.join(__dirname, "project/twee/**/*.twee"))
              for (const file of tweeFiles) {
                this.addWatchFile(file)
              }
            }
          },
          async writeBundle(options, bundle) {
            await compileTwee(isDebug ? 'debug' : 'dist')
          },
        }
      })(),
    ],
    clearScreen: false,
    publicDir: isDevServer ? path.join(__dirname, 'dist') : false,
    base: './',
    resolve: {
      alias: {
        'assets': path.resolve(__dirname, 'dist/assets'),
        'img': path.resolve(__dirname, 'dist/img'),
        ...Object.fromEntries(DYNAMIC_MODULES.map(id => [
          `@dynamic-module:${id}`,
          isDevServer ? path.join(__dirname, `src/dynamic-modules/${id}/index.js`) : `./js${isDebug ? '-debug' : ''}/${id}.js`
        ])),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      lib: isDevServer ? undefined : {
        entry: [],
        formats: [ /** @type {any} */ ('amd') ], // cannot use ES modules because loading from "file://" URLs doesn't work due to CORS...
      },
      rollupOptions: {
        preserveEntrySignatures: 'allow-extension',
        input: {
          'user.min': VIRTUAL_JS_MODULE,
          ...Object.fromEntries(DYNAMIC_MODULES.map(id => [id, `./src/dynamic-modules/${id}/index.js`]))
        },
        external: [
          ...DYNAMIC_MODULES.map(id => `@dynamic-module:${id}`),
        ],
        output: {
          format: 'amd',
          amd: {
            autoId: true,
          },
          entryFileNames: (chunk) => (chunk.name === 'user.min') ? 'scripts/[name].js' : 'dynamic-modules/[name].js',
          chunkFileNames: 'scripts/[name].js',
          assetFileNames,
          //manualChunks: undefined,
          inlineDynamicImports: false,
          paths: {
            ...Object.fromEntries(DYNAMIC_MODULES.map(id => [`@dynamic-module:${id}`, `./js${isDebug ? '-debug' : ''}/${id}.js`])),
          },
          footer: (chunk) => (chunk.name !== 'user.min') ? '' : '' /*(
            `require('scripts/user.min')`
          )*/,
        },
      },
      outDir: outDir,
      emptyOutDir: false,
      chunkSizeWarningLimit: 1E10,
      reportCompressedSize: false,
      cssCodeSplit: isDevServer ? true : false,
      assetsInlineLimit: 1E10,
      sourcemap: isDebug ? 'inline' : false,
      minify: isDebug ? false : 'esbuild',
      //terserOptions: {
      //    keep_classnames: true, // preserve class names, needed to support deserialization
      //}
    },
    esbuild: {
      keepNames: true, // preserve class names, needed to support deserialization
    },
    css: {
      postcss: {
        plugins: [
          postcssNesting(),
          postcssAutoprefixer(),
        ],
      }
    },
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 3800,
    },
  }
})
