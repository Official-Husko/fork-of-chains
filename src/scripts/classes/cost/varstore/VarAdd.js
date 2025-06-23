
setup.qcImpl.VarAdd = class VarAdd extends setup.Cost {
  constructor(key, value, expires) {
    super()

    this.key = key
    this.value = value
    if (expires == undefined) {
      this.expires = expires
    } else {
      this.expires = -1
    }
  }

  text() {
    return `setup.qc.VarAdd('${this.key}', ${this.value}, ${this.expires})`
  }

  apply(quest) {
    const existing = State.variables.varstore.get(this.key) || 0
    State.variables.varstore.set(this.key, parseInt(existing) + this.value, this.expires)
  }

  explain(quest) {
    if (quest) return ''
    return `Variable "${this.key}" is added by "${this.value}" and reset expiration to ${this.expires} weeks.`
  }
}
