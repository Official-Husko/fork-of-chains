import { resolveAsyncIterator } from "./files"
import { globalsettings } from "./globalsettings"
import { createLogger } from "./logger"

export const MODS_DIR_NAME = "mods"

export const MOD_PACKED_EXTENSION = ".focmod.js"
export const MOD_UNPACKED_MANIFEST_FILE = "focmod.js"

/**
 * @typedef {import("../types/modding").FocModDefinition & {
 *   files?: Record<string, string>, // file contents as strings
 * }} ModDefinition
 */

/** @typedef {Partial<ModDefinition> & { errors?: string[], data?: ModData }} InstalledMod */

const logmsg = createLogger('ModManager', 'royalblue')

const MODDED = Symbol.for("FOC-MODDED")

class ModData {

  /** @type {Record<string, any>} */
  setup = {}

  /** @type {Record<string, { tags: string[], content: string }>} */
  passages = {}

}

class ModLoadContext {

  /** @type {Record<string, any>} */
  original_objects = {}

  data = new ModData()

  init() {
    for (const [k, v] of Object.entries(SugarCube.setup)) {
      if (v && (typeof v === 'object' || typeof v === 'function')) {
        this.original_objects[k] = v

        ;(/** @type {any} */ (setup))[k] = this.proxieated(v, `setup.${k}`)
      }
    }
  }

  cleanup() {
    Object.assign(SugarCube.setup, this.original_objects)
  }


  /**
   * @template {object} T
   * @param {T} obj
   * @param {string} prefix
   * @returns {T}
   */
  proxieated(obj, prefix) {
    //let target = obj
    /*if (typeof obj === 'function') {
      target = Object.create(obj, {
        prototype: { configurable: true, value: 0 }
      })
    }*/
    const ctx = this
    return new Proxy(obj, {
      get(target, propKey, receiver) {
        const subprefix = `${prefix}.${String(propKey)}`
        if (subprefix in ctx.data.setup)
          return ctx.data.setup[subprefix]
        //console.log("accessing ", subprefix)
        const descr = Object.getOwnPropertyDescriptor(obj, propKey)
        if (typeof propKey !== 'symbol' && (!descr || (descr.configurable || descr.writable))) {
        //if (propertyKey !== 'prototype') {
          const value = /** @type {any} */ (obj[/** @type {keyof typeof obj} */ (propKey)])
          if (value && (typeof value == 'object' || typeof value === 'function')) {
            // whitelist some classes, because otherwise that would break stuff like "x === setup.jobs.slaver"
            if (!(value instanceof setup.Job || value instanceof setup.UnitCriteria || value instanceof setup.Job)) {
              return ctx.proxieated(value, subprefix)
            }
          }
        }
        return Reflect.get(target, propKey, receiver)
      },
      set(target, propKey, newValue, receiver) {
        const subprefix = `${prefix}.${String(propKey)}`
        //console.log('setting', subprefix, propKey)
        if (typeof propKey === 'string' && subprefix.startsWith('setup.')) {
          ctx.data.setup[subprefix] = newValue
          return true
        }
        return Reflect.set(target, propKey, newValue, receiver)
      },
      construct(target, argArray, newTarget) {
        //console.log("constructing ", newTarget)
        return Reflect.construct(/** @type {any} */ (target), argArray, newTarget)
      },
    })
  }


}

let next_passage_id = 50000

export class ModManagerClass {

  /**
   * The info and data for the loaded mods
   * @type {{ [k in string]?: InstalledMod }} */
  mods = {}

  /** @type {{ [k in string]?: FileSystemDirectoryHandle }} */
  mods_unpacked = {}

  /** @type {Promise<void>|null} */
  reloading_promise = null

  /** @type {Record<string, { data?: {}, resolve: (error: unknown|null) => void }>} */
  script_load_callbacks = {}

  /** @type {Array<InstalledMod>} */
  applied_mods = []

  constructor() {
    /**
     * The function used by mods to register themselves
     */
    (/** @type {any} */ (window)).FocMod = this.registerMod.bind(this)

  
    // initial load
    this.reloading_promise = new Promise((resolve) => {
      setTimeout(() => 
        this._reloadMods()
          .then(() => this.reapplyMods())
          .then(resolve)
      , 1)  
    })
  }

  /**
   * @param {string} mod_path
   * @param {boolean} is_unpacked
   */
  resolveModScriptPath(mod_path, is_unpacked) {
    let path = mod_path
    if (!mod_path.includes('/')) {
      path = `./${MODS_DIR_NAME}/${mod_path}`
    }
    if (is_unpacked) {
      path += '/' + MOD_UNPACKED_MANIFEST_FILE
    }
    return path
  }

  /**
   * @param {any} manifest
   */
  registerMod(manifest) {
    const mod_path = document.currentScript?.getAttribute?.('data-mod-path')
    const entry = mod_path && this.script_load_callbacks[mod_path]
    if (!entry)
      return

    // so that "onload" doesn't report that register func wasn't called
    entry.data = manifest
  }

  /**
   * @param {string} mod_path
   * @returns {Promise<void>}
   */
  loadUnpackedMod(mod_path) {
    const mod = (this.mods[mod_path] ??= {})
    const mod_file_contents = (mod.files ??= {})

    const mod_dir_handle = this.mods_unpacked[mod_path]
    if (!mod_dir_handle)
      throw new Error(`Need to load the unpacked mod folder again (missing permissions)`)

    const file_to_ignore = new Set(['focmod.js'])

    /** @type {string[]} */
    const errmsgs = []
    
    const getErrMsg = (/** @type {unknown} */ err) => err instanceof Error ? err.message : String(err)

    /**
     * @param {FileSystemDirectoryHandle} dir_handle 
     * @param {string} dir_path
     * @returns {Promise<unknown>}
     */
    function processDirectory(dir_handle, dir_path) {
      return resolveAsyncIterator(dir_handle.entries())
        .then((files) => {
          return Promise.all(files.map(([name, handle]) => {
            const path = dir_path ? `${dir_path}/${name}` : name
            if (!file_to_ignore.has(path)) {
              if (handle.kind === 'directory') {
                return processDirectory(/** @type {FileSystemDirectoryHandle} */ (handle), path)
              } else if (handle.kind === 'file') {
                const file_handle = /** @type {FileSystemFileHandle} */ (handle)
                return file_handle.getFile()
                  .then(file => file.text())
                  .then(file_content => mod_file_contents[path] = file_content)
                  .catch(err => errmsgs.push(`Failed to load file "${path}": ${getErrMsg(err)}`))
              }
            }
          }))
        })
        .catch(err => errmsgs.push(`Failed to load directory "${dir_path}": ${getErrMsg(err)}`))
    }

    return processDirectory(mod_dir_handle, '').then(() => {
      if (errmsgs.length)
        throw errmsgs
    })
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  _reloadMods() {
    const t = Date.now()

    // clear all mod data
    this.mods = {}

    this.script_load_callbacks = {}
    const script_load_callbacks = this.script_load_callbacks

    const promises = (globalsettings.mods_installed ?? []).map((mod_path) => {
      const is_unpacked = !mod_path.includes('/') && !mod_path.endsWith(MOD_PACKED_EXTENSION)
      const script_path = this.resolveModScriptPath(mod_path, is_unpacked)

      return (new Promise((resolve) => {
        const script = document.createElement('script')
        script.setAttribute('data-mod-path', mod_path)
        script_load_callbacks[mod_path] = { resolve }
        script.onload = () => {
          const entry = script_load_callbacks[mod_path]
          if (!entry.data) { // script crashed or didn't call FocMod(...)
            entry.resolve(new Error(`Mod info failed to load`))
          } else {
            Object.assign((this.mods[mod_path] ??= {}), entry.data)
            entry.resolve(null)
          }
        }
        script.onerror = (err) => resolve(`unable to load the mod`)
        script.src = `${script_path}?t=${t}`
        document.body.appendChild(script)
      }))
        .then(() => is_unpacked ? this.loadUnpackedMod(mod_path) : undefined)
        .then(() => {
          console.info(...logmsg(`Loaded mod info for "${mod_path}"`))
        }, (err) => {
          const moddata = (this.mods[mod_path] ??= {})
          const moddata_errors = (moddata.errors ??= [])
          if (Array.isArray(err)) {
            moddata_errors.push(...err)
          } else {
            const errmsg = (err instanceof Error) ? err.message : String(err)
            moddata_errors.push(errmsg)
          }
          console.info(...logmsg(`Failed to load mod info for "${mod_path}":\n${moddata_errors.join('\n')}`))
        })
    })

    return Promise.all(promises)
      .then(() => {
        this.script_load_callbacks = {}
        return this.reloadModData()
      })
      .then(() => {
        this.reloading_promise = null
      })
  }

  /**
   * @returns {Promise<void>}
   */
  reloadMods() {
    return this.reloading_promise || (this.reloading_promise = this._reloadMods())
  }

  /** @type {{ [k in keyof typeof setup]?: any }} */
  static MODDABLES = {
    ActivityTemplate: '',
    Event: '',
    UnitGroup: '',
    Title: '',
    Interaction: '',
    OpportunityTemplate: '',
    BanterInstance: '',
    UnitCriteria: '',
    QuestTemplate: '',
    QuestPool: '',
  }

  sortMods(/** @type {string[]}*/ mods) {
    mods.sort((a, b) => {
      const pa = this.mods[a]?.priority ?? 0
      const pb = this.mods[b]?.priority ?? 0
      if (pa !== pb)
        return pa - pb
      return (this.mods[a]?.key ?? a).localeCompare(this.mods[b]?.key ?? b)
    })
  }

  reloadModData() {
    console.info(...logmsg('Reloading mod data'))

    const mods = (/*State.variables.mods*/ setup.globalsettings.mods_installed || []).filter(mod_path => {
      if (!this.mods[mod_path]) {
        console.warn(...logmsg(`Skipping mod "${mod_path}"`))
        return false
      }
      return true
    })

    this.sortMods(mods)

    if (mods.length > 0) {
      //new setup\.(?!ActivityTemplate|Event|UnitGroup|Title|interaction|OpportunityTemplate|BanterInstance|UnitCriteria|QuestTemplate|Questpool)

      for (const mod_path of mods) {
        const mod = this.mods[mod_path]
        if (!mod)
          continue

        const mod_context = new ModLoadContext()
      
        try {
          mod_context.init()

          const all_files = Object.entries(mod.files || {}).sort()

          const twee_files = all_files.filter(([filename, content]) => /\.twee$/i.test(filename))
          if (twee_files.length) {
            const fragment = document.createDocumentFragment()
            for (const [filename, filecontent] of twee_files) {
              const passages = filecontent.split(/^(?=::)/mg)
              for (let passage of passages) {
                /** @type {string|undefined} */
                let name
                /** @type {string|undefined} */
                let tags
                const content = passage.replace(/^::\s*(\w+)(?:\s*\[([^\]]+)\])?/, (c0, c1, c2) => (name = c1, tags = c2, ''))
                if (name) {
                  mod_context.data.passages[name] = {
                    tags: tags ? tags.trim().split(/\s+/g) : [],
                    content,
                  }
                }
              }
            }

            const passages_parent = /** @type {HTMLElement} */ (document.querySelector('tw-storydata'))
            for (const [passage_name, passage_data] of Object.entries(mod_context.data.passages)) {
              if (!Story.has(passage_name)) {
                const elem = document.createElement('tw-passagedata')
                elem.setAttribute('name', passage_name)
                elem.setAttribute('pid', String(++next_passage_id))
                if (passage_data.tags.length) {
                  elem.setAttribute('tags', passage_data.tags.join(' '))
                }
                elem.textContent = passage_data.content
                passages_parent.appendChild(elem)
                Story.add(new Passage(passage_name, elem))
              }
              if (passage_data.tags.some(t => setup.CONTENT_CREATOR_TYPES.includes(t))) {
                new Wikifier(fragment, passage_data.content)
                const errors = [...fragment.querySelectorAll('.error-view')]
                if (errors.length > 0) {
                  throw errors.map(err => err.textContent)
                }
              }
            }
          }

          mod.data = mod_context.data
        } catch (err) {
          /** @type {string[]} */
          const errmsgs = Array.isArray(err) ? err : [(err instanceof Error) ? err.message : String(err)]
          ;(mod.errors ??= []).push(...errmsgs)
        } finally {
          mod_context.cleanup()
        }
      }
    }
    console.info(...logmsg(`Finished reloading mod datas (${mods.length})`))
  }

  reapplyMods() {
    { // cleanup of currently applied mods
      for (const mod of this.applied_mods) {
        try {
          mod.onDisable?.()
        } catch (err) {
          console.error(...logmsg(`Failed to disable mod "${mod.key}"`))
          continue
        }
      }
      // restore umodded objects
      for (const [k, v] of Object.entries(setup)) {
        if (v && typeof v === 'object' && MODDED in v) {
          (/** @type {any} */ (setup))[k] = v[MODDED]
        }
      }

      // remove mod passages
      //for (const node of [...document.querySelectorAll('tw-passagedata[mod]')]) {
      //  const name = node.getAttribute('name')
      //  node.parentNode?.removeChild?.(node)
      //}
    }

    this.applied_mods = []

    const mods = (State.variables.mods || []).filter(mod_path => {
      if (!this.mods[mod_path]) {
        console.warn(...logmsg(`Missing mod "${mod_path}"`))
        return false
      }
      return true
    })

    this.sortMods(mods)

    for (const mod_path of mods) {
      const mod = this.mods[mod_path]
      if (!mod?.data)
        continue

      try {
        mod.onEnable?.()
      } catch (err) {
        console.error(...logmsg(`Failed to enable mod "${mod.key}"`))
        continue
      }

      this.applied_mods.push(mod)

      for (const [path_str, val] of Object.entries(mod.data.setup)) {
        const path = path_str.split('.')

        /** @type {any} */
        let container = setup
        for (let i = 1; i < path.length - 1; ++i) {
          let obj = container[path[i]]
          if (!(MODDED in obj)) {
            let original_obj = obj
            //modded_obj = Object.create(obj, { [MODDED]: { value: original_obj } })
            obj = Object.assign({ [MODDED]: original_obj }, original_obj)
            container[path[i]] = obj
          }
          container = obj
        }

        container[path[path.length - 1]] = val
      }
    }
  
  }

}

export const ModManager = new ModManagerClass()
setup.ModManager = ModManager

