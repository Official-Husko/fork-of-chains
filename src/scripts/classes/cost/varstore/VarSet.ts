// @ts-nocheck


setup.qcImpl.VarSet = class VarSet extends setup.Cost {
  constructor(key, value, expires) {
    super()

    this.key = key
    this.value = value
    if (expires == undefined) {
      this.expires = -1
    } else {
      this.expires = expires
    }
  }

  text() {
    if (setup.isString(this.value)) {
      return `setup.qc.VarSet('${this.key}', '${this.value}', ${this.expires})`
    } else {
      return `setup.qc.VarSet('${this.key}', ${this.value}, ${this.expires})`
    }
  }

  apply(quest) {
    State.variables.varstore.set(this.key, this.value, this.expires)
  }

  explain(quest) {
    if (quest) return ''
    return `Variable "${this.key}" is set to "${this.value}" for ${this.expires} weeks.`
  }
}
