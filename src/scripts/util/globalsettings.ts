// @ts-nocheck


// setup.globalsettings:
//  stores persistent global settings, which exist outside the saves (affects all)

const STORAGE_GLOBALSETTINGS_KEY = "globalsettings"

// internal object containing the settings data
const globalsettings_obj = (() => {
  // at page load, attempt to retrieve them from storage
  const existing = storage.get(STORAGE_GLOBALSETTINGS_KEY)
  return existing && typeof existing === "object" ? existing : {}
})()

const saveGlobalSettings = () => {
  storage.set(STORAGE_GLOBALSETTINGS_KEY, globalsettings_obj)
}

/** @type {GlobalSettings} */
export const globalsettings = new Proxy(globalsettings_obj, {
  // intercept the action of changing a value in the settings to in addition
  // of changing it, the settings are also persisted to the storage
  set: function (target, prop, value) {
    globalsettings_obj[prop] = value

    saveGlobalSettings()

    return true // report value changed successfully
  },
  deleteProperty(target, prop) {
    if (prop in globalsettings_obj) {
      delete globalsettings_obj[prop]

      saveGlobalSettings()

      return true // report deleted successfully
    }
    return false
  }
})
setup.globalsettings = globalsettings
