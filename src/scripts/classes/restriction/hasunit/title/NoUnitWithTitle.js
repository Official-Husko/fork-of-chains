
setup.qresImpl.NoUnitWithTitle = class NoUnitWithTitle extends setup.Restriction {
  constructor(title, params) {
    super()

    if (setup.isString(title)) {
      this.title_key = title
    } else {
      this.title_key = title.key
    }
  
    if (params) {
      this.params = params
    } else {
      this.params = {}
    }
  }

  text() {
    let paramtext = `{\n`
    for (let paramkey in this.params) {
      let paramval = this.params[paramkey]
      paramtext += `${paramkey}: `
      if (setup.isString(paramval)) {
        paramtext += `"${paramval}",\n`
      } else {
        paramtext += `${paramval},\n`
      }
    }
    paramtext += `}`
    return `setup.qres.NoUnitWithTitle('${this.title_key}', ${paramtext})`
  }

  explain() {
    let title = setup.title[this.title_key]
  
    let paramtext = []
    for (let paramkey in this.params) {
      let paramval = this.params[paramkey]
      paramtext.push(`${paramkey}: ${paramval}`)
    }
  
    return `Must NOT exists any unit that has "${title.rep()}" and also ${paramtext.join(', ')}`
  }

  isOk() {
    let title = setup.title[this.title_key]
    let params = this.params
  
    let base = Object.values(State.variables.unit)
    if ('job_key' in params) {
      base = State.variables.company.player.getUnits({job: setup.job[params.job_key]})
    }
  
    for (let i = 0; i < base.length; ++i) {
      let unit = base[i]
      if (State.variables.titlelist.isHasTitle(unit, title)) return false
    }
    return true
  }
}
