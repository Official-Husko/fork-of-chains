
setup.ContactTemplate = class ContactTemplate extends setup.TwineClass {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string[]} tags 
   * @param {string} description_passage 
   * @param {setup.Cost[]} apply_objs 
   * @param {number} [expires_in]
   */
  constructor(key, name, tags, description_passage, apply_objs, expires_in) {
    super()

    if (!key) throw new Error(`Missing ${key}`)
    this.key = key

    if (!name) throw new Error(`Missing ${name}`)
    this.name = name

    this.tags = tags

    // can be null
    this.description_passage = description_passage

    this.apply_objs = apply_objs

    for (let i = 0; i < this.apply_objs.length; ++i) {
      if (!this.apply_objs[i]) throw new Error(`${i}-th applyobj for contact ${key} missing`)
    }

    this.expires_in = expires_in

    if (this.key in setup.contacttemplate) throw new Error(`Duplicate key ${this.key} for contact template`)
    setup.contacttemplate[this.key] = this
  }

  /**
   * @returns {boolean}
   */
  isCanDeactivate() { return !this.getTags().includes('alwaysactive') }

  getTags() { return this.tags }

  getDescriptionPassage() { return this.description_passage }

  getName() { return this.name }

  getApplyObjs() { return this.apply_objs }

  getExpiresIn() { return this.expires_in }

  rep() { return this.getName() }
}
