// @ts-nocheck

// special variable $cache set to this.
setup.Cache = class Cache extends setup.TwineClass {
  constructor() {
    super()
    this.cache = {}
  }

  /**
   * Caches a value.
   * 
   * @param {string} menu 
   * @param {any} key 
   * @param {any} value 
   */
  set(menu, key, value) {
    if (!(menu in this.cache)) this.cache[menu] = {}
    this.cache[menu][key] = value
  }

  /**
   * @param {string} menu 
   * @param {*} key 
   * @returns {boolean}
   */
  has(menu, key) {
    return (menu in this.cache && key in this.cache[menu])
  }

  /**
   * Gets a cached value
   * @param {string} menu 
   * @param {any} key 
   * @returns {any}
   */
  get(menu, key) {
    if (!this.has(menu, key)) return null
    return this.cache[menu][key]
  }

  /**
   * Clear a cached value
   * @param {string} menu
   * @param {any} key
   */
  clear(menu, key) {
    if (!(menu in this.cache)) return null
    if (!(key in this.cache[menu])) return null
    delete this.cache[menu][key]
  }

  /**
   * Clear all values from the cache.
   */
  clearAll() {
    this.cache = {}
  }
}

