setup.qresImpl.VarNull = class VarNull extends setup.Restriction {
  constructor(key) {
    super()

    this.key = key
  }

  text() {
    return `setup.qres.VarNull('${this.key}')`
  }

  explain() {
    return `Variable "${this.key}" must be null (unset)`
  }

  isOk() {
    return State.variables.varstore.get(this.key) == null
  }
}
