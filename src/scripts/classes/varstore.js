
// special. Will be assigned to State.variables.varstore
setup.VarStore = class VarStore extends setup.TwineClass {
  constructor() {
    super()

    // key: value
    this.vars = {}

    // key: deadline
    this.vars_deadline = {}
  }

  set(key, value, deadline) {
    // if deadline is 0 or negative, will never expires.
    this.vars[key] = value
    this.vars_deadline[key] = deadline
    if (State.variables.gDebug) {
      setup.notify(`DEBUG: variable ${key} is set to ${value}${deadline != -1 ? ` for ${deadline} weeks` : ''}`)
    }
  }

  get(key) {
    if (!(key in this.vars)) return null
    return this.vars[key]
  }

  remove(key) {
    if (key in this.vars) {
      delete this.vars[key]
      if (!(key in this.vars_deadline)) throw new Error(`${key} not found in vars deadline`)
      delete this.vars_deadline[key]
      if (State.variables.gDebug) {
        setup.notify(`DEBUG: variable ${key} is unset`)
      }
    } else {
      if (State.variables.gDebug) {
        setup.notify(`DEBUG: variable ${key} was attempted to be unset, but it's already unset`)
      }
    }
  }

  advanceWeek() {
    let keys = Object.keys(this.vars_deadline)
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i]
      this.vars_deadline[key] -= 1
      if (!this.vars_deadline[key]) {
        this.remove(key)
      }
    }
  }

}
