// @ts-nocheck


setup.qresImpl.VarEqual = class VarEqual extends setup.Restriction {
  constructor(key, value) {
    super()

    this.key = key
    this.value = value
  }

  static NAME = 'Variable equals something'
  static PASSAGE = 'RestrictionVarEqual'

  text() {
    if (setup.isString(this.value)) {
      return `setup.qres.VarEqual('${this.key}', '${this.value}')`
    } else {
      return `setup.qres.VarEqual('${this.key}', ${this.value})`
    }
  }

  explain() {
    return `Variable "${this.key}" must equals "${this.value}"`
  }

  isOk() {
    return State.variables.varstore.get(this.key) == this.value
  }
}
