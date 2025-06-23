
setup.qresImpl.VarLte = class VarLte extends setup.Restriction {
  constructor(key, value) {
    super()

    this.key = key
    this.value = value
  }

  static NAME = 'Variable <= something'
  static PASSAGE = 'RestrictionVarLte'

  text() {
    return `setup.qres.VarLte('${this.key}', ${this.value})`
  }

  explain() {
    return `Variable "${this.key}" must <= ${this.value}`
  }

  isOk() {
    return (State.variables.varstore.get(this.key) || 0) <= this.value
  }
}
