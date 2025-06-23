
setup.qresImpl.And = class And extends setup.Restriction {
  constructor(requirements) {
    super()

    // true if all requirements are true

    if (!Array.isArray(requirements)) throw new Error(`First element of setup.qres.And must be array, not ${requirements}`)
    this.requirements = requirements
  }

  text() {
    return `setup.qres.And([\n${this.requirements.map(a => a.text()).join(',\n')}\n])`
  }

  isOk(quest) {
    for (let i = 0; i < this.requirements.length; ++i) {
      if (!this.requirements[i].isOk(quest)) return false
    }
    return true
  }

  explain(quest) {
    let texts = []
    for (let i = 0; i < this.requirements.length; ++i) texts.push(this.requirements[i].explain(quest))
    return `AND(${texts.join(', ')})`
  }

  getLayout() {
    return {
      css_class: "companycard",
      blocks: [
        {
          passage: "RestrictionAndHeader",
          //addpassage: "", // inherit
          listpath: ".requirements"
        }
      ]
    }
  }
}
