
setup.qcImpl.VarRemove = class VarRemove extends setup.Cost {
  constructor(key) {
    super()

    this.key = key
  }

  static NAME = 'Remove a variable value'
  static PASSAGE = 'CostVarRemove'

  text() {
    return `setup.qc.VarRemove('${this.key}')`
  }

  apply(quest) {
    State.variables.varstore.remove(this.key)
  }

  explain(quest) {
    if (!State.variables.gDebug) {
      return ''
    }
    return `Variable "${this.key}" is removed.`
  }
}
