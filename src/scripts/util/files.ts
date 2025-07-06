// @ts-nocheck


// Defines functions that deal with local filesystem files

import { MODS_DIR_NAME } from "./modmanager"

setup.FileUtil = {}

setup.FileUtil.supportsDirectoryPicker = function() {
  return (window.location.protocol === "file:" || window.location.hostname === 'localhost')
    && ("showDirectoryPicker" in window)
}

/**
 * Helper function to avoid using "for await (... of ...)"
 * to read a directory entries
 * @template T
 * @param {AsyncIterator<T>} iterator
 * @returns {Promise<T[]>}
 */
export function resolveAsyncIterator(iterator) {
  return new Promise((resolve, reject) => {
    /** @type {T[]} */
    let values = []

    /** @param {IteratorResult<T>} _ */
    function handleNext({ done, value }) {
      if (done) {
        resolve(values)
      } else {
        values.push(value)
        iterator.next().then(handleNext, reject)
      }
    }

    iterator.next().then(handleNext, reject)
  })
}

/**
 * @param {FileSystemDirectoryHandle} dir
 * @param {string[]} path
 * @param {number} index
 * @returns {Promise<FileSystemDirectoryHandle>}
 */
export function resolveParentDir(dir, path, index) {
  if (index >= path.length - 1) {
    return Promise.resolve(dir)
  }
  return dir.getDirectoryHandle(path[index])
    .then(subdir => resolveParentDir(subdir, path, index + 1))
    .catch(err => {
      const errmsg = `Failed to access directory "${path.slice(0, index + 1).join('/')}"`
      console.error(errmsg, err)
      throw new Error(errmsg)
    })
}

/**
 * @param {FileSystemDirectoryHandle} dir_handle
 * @param {string} path
 * @returns {Promise<FileSystemDirectoryHandle>}
 */
export function resolveDir(dir_handle, path) {
  const path_parts = path.split('/')
  return resolveParentDir(dir_handle, path_parts, 0)
    .then(dir => dir.getDirectoryHandle(path_parts[path_parts.length - 1]))
    .catch(err => { throw new Error(`Failed to access directory "${path}"`) })
}

/**
 * @param {FileSystemDirectoryHandle} dir_handle
 * @param {string} path
 * @returns {Promise<FileSystemFileHandle>}
 */
export function resolveFile(dir_handle, path) {
  const path_parts = path.split('/')
  return resolveParentDir(dir_handle, path_parts, 0)
    .then(dir => dir.getFileHandle(path_parts[path_parts.length - 1]))
    .catch(err => { throw new Error(`Failed to access file "${path}"`) })
}

/**
 * list the valid imagepacks in the given folder
 * @param {FileSystemDirectoryHandle} imagepacksdir
 * @returns {Promise<string[]>}
 */
function listImagePacks(imagepacksdir) {
  if (!imagepacksdir)
    return Promise.resolve([])
  
  return new Promise((resolve, reject) => {
    resolveAsyncIterator(imagepacksdir.entries()).then(entries => {
      /** @type {Promise<string | null>[]} */
      let promises = []
      for (const [name, entry] of entries) {
        if (entry.kind === "directory") {
          const dir = /** @type {FileSystemDirectoryHandle} */ (entry)
          promises.push(Promise.allSettled([
            dir.getFileHandle("imagemeta.js"),
            dir.getFileHandle("imagepack.js"),
          ]).then(results => {
            const either_exists = results.some(x => x.status === "fulfilled")
            return either_exists ? name : null
          }))
        }
      }
      Promise.allSettled(promises).then(results => {
        const packpaths = []
        for (const result of results) {
          if (result.status === "fulfilled" && result.value)
            packpaths.push(result.value)
        }
        resolve(packpaths)
      })
    }, () => {
      console.error(`failed to list subfolders of '${setup.UnitImage.IMAGEPACK_DIR_NAME}'`)
      resolve([])
    })
  })
}

/**
 * try to detect "imagepacks" folder from user selected folder
 * @param {FileSystemDirectoryHandle} dir
 * @returns {Promise<FileSystemDirectoryHandle | null | undefined>}
 */
function findImagePacksDir(dir) {
  return new Promise((resolve, reject) => {
    if (dir.name === setup.UnitImage.IMAGEPACK_DIR_NAME)
      return resolve(dir) // found "imagepacks", it is dir
    
    // check if we are in "/dist"
    dir.getFileHandle("precompiled.html").then(file => {
      dir.getDirectoryHandle(setup.UnitImage.IMAGEPACK_DIR_NAME).then(subdir => {
        resolve(subdir) // found "imagepacks", it is a subfolder of dir
      }, () => {
        resolve(null) // we're in /dist, but imagepacks folder does not exist, so fail silently
      })
    }, () => {
      // check if user selected the parent folder
      dir.getDirectoryHandle("dist").then(subdir => {
        findImagePacksDir(subdir).then(resolve, reject)
      }, () => {
        resolve(undefined) // failed to find it, report error
      })
    })
  })
}

/** @type {FileSystemDirectoryHandle|null} */
let imagepacks_dir_handle = null

/**
 * 
 * @returns {Promise<FileSystemDirectoryHandle | null | undefined | void>}
 */
setup.FileUtil.autodetectImagePacks = function() {
  if (!imagepacks_dir_handle) { // if not picked during this session, prompt to pick it
    return window.showDirectoryPicker({ id: 'foc-imagepacks', mode: 'read' }).then((picked_dir) => {
      if (!picked_dir) // Cancelled by user, or failed to open
        return

      return findImagePacksDir(picked_dir).then(detected_dir => {
        imagepacks_dir_handle = detected_dir || null

        if (detected_dir === undefined)
          return alert("The selected folder is not the game folder!")
          
        if (imagepacks_dir_handle)
          return setup.FileUtil.autodetectImagePacks()
      })
    })
  }

  return listImagePacks(imagepacks_dir_handle).then(detectedpacks => {
    const packlist = [...(setup.globalsettings.imagepacks || [])]
    //.filter(x => x && setup.isAbsoluteUrl(x)) // leave entries with absolute path intact

    for (const detectedpack of detectedpacks) {
      if (!packlist.includes(detectedpack))
        packlist.push(detectedpack)
    }

    setup.globalsettings.imagepacks = packlist
  })
}

const DirHandles = {
  mods: {
    id: 'foc-mods',
    expected_dir_name: MODS_DIR_NAME,
  },
  unit_custom_images: {
    id: 'foc-unit-custom-images',
    expected_dir_name: 'customunit',
  },
}

/** @type {{ [k: string]: FileSystemDirectoryHandle | null | undefined }} */
const dir_handles = {}

export const IndexedDB = {
  Store: {
    FilesystemHandles: "filesystem_handles",
  },

  /** @returns {Promise<IDBDatabase|null>} */
  open() {
    if (!window.indexedDB)
      return Promise.resolve(null)

    return new Promise((resolve) => {
      const idbRequest = window.indexedDB.open('FOC', 1)
      idbRequest.onupgradeneeded = (event) => {
        const db = (/** @type {IDBRequest} */ (event.target)).result
        db.createObjectStore(IndexedDB.Store.FilesystemHandles, { keyPath: 'id' })
      }
      idbRequest.onerror = () => resolve(null)
      idbRequest.onsuccess = (event) => {
        const db = (/** @type {IDBOpenDBRequest} */ (event.target)).result
        resolve(db)
      }
    })
  },
    
  /**
   * @param {string} id
   * @returns {Promise<FileSystemHandle | null>}
   */
  readFilesystemHandle(id) {
    return IndexedDB.open().then(db => {
      if (!db) return Promise.resolve(null)
      const transaction = db.transaction([IndexedDB.Store.FilesystemHandles], "readonly")
      return new Promise(resolve => {
        const request = transaction.objectStore(IndexedDB.Store.FilesystemHandles).get(id)
        request.onsuccess = (ev) => resolve((/** @type {IDBRequest} */ (ev.target)).result?.handle ?? null)
        transaction.onerror = (e) => (console.error(e), resolve(null))
      })
    })
  },

  /**
   * @param {string} id
   * @param {FileSystemHandle} handle
   * @returns {Promise<boolean>}
   */
  saveFilesystemHandle(id, handle) {
    return IndexedDB.open().then((db) => {
      if (!db) return Promise.resolve(false)
      const transaction = db.transaction([IndexedDB.Store.FilesystemHandles], "readwrite")
      return new Promise(resolve => {
        const request = transaction.objectStore(IndexedDB.Store.FilesystemHandles).put({
          id: id,
          handle: handle,
        })
        transaction.oncomplete = () => resolve(true)
        transaction.onerror = (e) => (console.error(e), resolve(false))
      })
    })
  },

}

/**
 * @param {typeof DirHandles[keyof typeof DirHandles]} options
 * @param {boolean=} silently If true, don't open a dialog if missing the handle
 * @param {boolean=} force_pick If true, just open the dialog
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export function openDir(options, silently, force_pick) {

  const pickDirectory = () => {
    return window.showDirectoryPicker({ id: options.id, mode: 'read' }).then((dir_handle) => {
      if (options.expected_dir_name && dir_handle.name !== options.expected_dir_name) {
        alert(`The selected directory "${dir_handle.name}" is not the FoC "${options.expected_dir_name}" folder!`)
        return null
      }
      dir_handles[options.id] = dir_handle
      IndexedDB.saveFilesystemHandle(options.id, dir_handle)
      return dir_handle
    }, (err) => {
      console.error('Filed to open directory', err)
    })
  }

  if (force_pick)
    return pickDirectory()

  let dir_handle = dir_handles[options.id]
  if (dir_handle)
    return Promise.resolve(dir_handle)

  // if first access in this session, try to recover handle from persistent browser storage
  return IndexedDB.readFilesystemHandle(options.id).then(handleFromIDB => {
    if (handleFromIDB && handleFromIDB.kind === 'directory') {
      dir_handle = /** @type {FileSystemDirectoryHandle} */ (handleFromIDB)
      dir_handles[options.id] = dir_handle
      return dir_handle
    }

    if (silently) {
      dir_handles[options.id] = null
      return null
    }

    return pickDirectory()
  })
}

/**
 * @param {boolean=} silently
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export function openUnitCustomImagesDir(silently) {
  return openDir(DirHandles.unit_custom_images, silently)
}

/**
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export function openModsDir() {
  return openDir(DirHandles.mods)
}

/**
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export function openUnpackedModDir() {
  return window.showDirectoryPicker({ id: 'foc-mod-unpacked', mode: 'read' })
    .then((dir_handle) => dir_handle, () => null)
}

/**
 * @param {string} filename
 * @param {string} contents
 * @returns {Promise<true|null>}
 */
export function savePackedModFile(filename, contents) {
  return window.showSaveFilePicker({
    id: 'foc-mod-packed',
    suggestedName: filename,
    //types: [ // somehow this seems to hang up some browsers...
    //  {
    //    description: 'Fort of Chains mod file',
    //    accept: { 'text/javascript': ['.focmod.js'] }
    //  }
    //]
  }).then((file_handle) => {
    return file_handle.createWritable()
      .then(writable => (writable.write(contents), writable))
      .then(writable => writable.close())
      .then(() => /** @type {const} */ (true))
  }, () => null)
}

