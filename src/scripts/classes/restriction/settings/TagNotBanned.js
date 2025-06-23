setup.qresImpl.TagNotBanned = class TagNotBanned extends setup.Restriction {
  /**
   * @param {string} tag
   */
  constructor(tag) {
    super()
    this.tag = tag
  }

  text() {
    return `setup.qres.TagNotBanned('${this.tag}')`
  }

  explain() {
    return `${this.tag} is NOT banned`
  }

  isOk(quest) {
    return !State.variables.settings.bannedtags[this.tag]
  }
}
