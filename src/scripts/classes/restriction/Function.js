
setup.qresImpl.Function = class Function extends setup.Restriction {
  /**
   * @param {Function} func 
   * @param {string} display_text
   */
  constructor(func, display_text) {
    super()
    this.func = func
    this.display_text = display_text
  }

  text() {
    let text = this.func.toString()
    return `setup.qres.Function(
      ${text},
      "${this.display_text}",
    )`
  }

  isOk(quest) {
    return this.func(quest)
  }

  explain(quest) {
    if (this.display_text) {
      return this.display_text
    }
    return `Runs a custom function`
  }
}
