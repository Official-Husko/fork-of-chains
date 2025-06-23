
setup.qresImpl.Or = class Or extends setup.Restriction {
  constructor(requirements) {
    super()

    // true as long as one of the requirements is true.

    if (!Array.isArray(requirements)) throw new Error(`First element of setup.qres.Or must be array, not ${requirements}`)
    this.requirements = requirements
  }

  text() {
    return `setup.qres.Or([\n${this.requirements.map(a => a.text()).join(',\n')}\n])`
  }

  isOk(quest) {
    for (let i = 0; i < this.requirements.length; ++i) {
      if (this.requirements[i].isOk(quest)) return true
    }
    return false
  }

  explain(quest) {
    let texts = []
    for (let i = 0; i < this.requirements.length; ++i) texts.push(this.requirements[i].explain(quest))
    return `OR(${texts.join(', ')})`
  }

  getLayout() {
    return {
      css_class: "card lorecard",
      blocks: [
        {
          passage: "RestrictionOrHeader",
          //addpassage: "", // inherit
          listpath: ".requirements"
        }
      ]
    }
  }
}
