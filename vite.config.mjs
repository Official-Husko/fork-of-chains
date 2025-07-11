// @ts-check

/*
 * Environment Variables Supported by this Vite Config:
 *
 *   SKIP_TWEE      - If set (any value), skips compiling .twee files during build and dev server. Useful for JS/CSS-only builds or rapid iteration.
 *   NODE_ENV       - Standard Node.js environment variable, used by Vite for mode selection (e.g., 'development', 'production').
 *   PORT           - If set, overrides the dev server port (default: 3800).
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
//

import fs from 'fs/promises'
import os from 'node:os'
import url from 'node:url'
import path from 'node:path'
import child_process from 'node:child_process'

import { defineConfig } from 'vite'
import solidjsPlugin from 'vite-plugin-solid'
import postcssAutoprefixer from 'autoprefixer'
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
    let js = [
      ...glob.sync(CONFIG.directories["user-js"]),
      ...glob.sync(CONFIG.directories["user-css"]),
    ].map(f => `import "${f.replace("./src", ".")}";`).join('\n')
    return js
  }

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
        if (ws) ws.send({ type: 'error', err: String(err) })
      }
    }
  }

  const assetFileNames = (asset) => {
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
          /**
           * Dev server: serve a modified index.html file, remap assets, and watch .twee files.
           * On .twee change, recompile and trigger a full browser reload.
           *
           * SKIP_TWEE env var: Set to skip compiling .twee files (for JS/CSS-only builds).
           */
          async configureServer(server) {
            await compileTwee('devserver', server.ws)
            const virtualModulePath = VIRTUAL_JS_MODULE.substring(1)
            // Watch .twee and .ts files in dev mode and recompile on change, then reload browser (debounced)
            server.watcher.add(path.join(__dirname, 'project/twee/**/*.twee'))
            server.watcher.add(path.join(__dirname, 'src/scripts/**/*.ts'))
            let rebuildTimeout = null
            server.watcher.on('change', (file) => {
              if (file.endsWith('.twee') || file.endsWith('.ts')) {
                clearTimeout(rebuildTimeout)
                rebuildTimeout = setTimeout(() => {
                  if (file.endsWith('.twee')) {
                    compileTwee('devserver', server.ws)
                      .then(() => server.ws.send({ type: 'full-reload' }))
                  } else if (file.endsWith('.ts')) {
                    // TypeScript: run tsc on the changed file
                    child_process.spawn('npx', ['tsc', file], { stdio: ['ignore', 'inherit', 'inherit'] })
                      .on('exit', code => {
                        if (code === 0) {
                          server.ws.send({ type: 'full-reload' })
                        } else {
                          server.ws.send('error', { err: `TypeScript compile failed for ${file}` })
                        }
                      })
                  }
                }, 200) // 200ms debounce for all watched files
              }
            })
            server.middlewares.use((req, res, next) => {
              if (req.url === '/') {
                return fs.readFile(path.join(__dirname, indexHtmlPath), 'utf8').then(html => (
                  res.setHeader('content-type', 'text/html').end(html
                    .replace(`jQuery((function`, () => 'jQuery((async function')
                    .replace(`Story.init`, () => 'await Story.init')
                    .replace(/domId\}\},init:\{value:function/, m => m.replace('function', 'async function'))
                    .replace(/\)try\{Scripting.evalJavaScript\([^)]+\)/, () => (
                      `)try{await Scripting.evalJavaScript('(() => {`
                      + `Object.assign(window, { setup, storage, importScripts, postrender, clone, setPageElement, Alert, Browser, Config, DebugBar, DebugView, Dialog, Diff, Engine, Fullscreen, Has, History, Lexer, LoadScreen, Macro, MacroContext, Passage, Patterns, Save, Scripting, Setting, SimpleAudio, SimpleStore, State, Story, StyleWrapper, Template, UI, UIBar, Util, Visibility, Wikifier });`
                      + `return import("${VIRTUAL_JS_MODULE}")})()')`
                    )))
                ))
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
