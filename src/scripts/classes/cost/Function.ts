// @ts-nocheck


setup.qcImpl.Function = class Function extends setup.Cost {
  constructor(func, display_text) {
    super()

    this.func = func
    this.display_text = display_text
  }

  text() {
    let text = this.func.toString()
    return `setup.qc.Function(
      ${text},
      "${this.display_text}",
    )`
  }

  apply(quest) {
    this.func(quest)
  }

  explain(quest) {
    if (this.display_text) {
      return this.display_text
    }
    return `Runs a custom function`
  }
}
