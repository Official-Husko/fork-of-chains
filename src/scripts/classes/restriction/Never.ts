// @ts-nocheck


setup.qresImpl.Never = class Never extends setup.Restriction {
  constructor(keytext) {
    super()

    this.keytext = keytext || 'Never'
  }

  static NAME = 'Never'
  static PASSAGE = 'RestrictionNever'

  text() {
    return `setup.qres.Never('${this.keytext}')`
  }

  explain() {
    return this.keytext
  }

  isOk() {
    return false
  }
}
