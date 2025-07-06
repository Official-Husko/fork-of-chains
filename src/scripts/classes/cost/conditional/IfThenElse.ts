// @ts-nocheck


setup.qcImpl.IfThenElse = class IfThenElse extends setup.Cost {
  constructor(requirement, thenwhat, elsewhat) {
    super()

    this.requirement = requirement
    this.thenwhat = thenwhat
    this.elsewhat = elsewhat
  }

  text() {
    if (this.elsewhat) {
      return `setup.qc.IfThenElse(\n${this.requirement.text()},\n${this.thenwhat.text()},\n${this.elsewhat.text()})`
    } else {
      return `setup.qc.IfThenElse(${this.requirement.text()},\n${this.thenwhat.text()},\nnull)`
    }
  }

  isOk(quest) {
    if (this.requirement.isOk(quest)) {
      return this.thenwhat.isOk(quest)
    } else {
      if (!this.elsewhat) return true
      return this.elsewhat.isOk(quest)
    }
  }

  apply(quest) {
    if (this.requirement.isOk(quest)) {
      return this.thenwhat.apply(quest)
    } else {
      if (!this.elsewhat) return
      return this.elsewhat.apply(quest)
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    if (this.elsewhat) {
      return `<div class='card livingcard'> If ${this.requirement.explain()} <br/> then: ${this.thenwhat.explain()} <br/> else: ${this.elsewhat.explain()}</div>`
    } else {
      return `<div class='card livingcard'> If ${this.requirement.explain()} <br/> then: ${this.thenwhat.explain()}</div>`
    }
  }

  getLayout() {
    return {
      css_class: "card livingcard",
      blocks: [
        {
          passage: "CostIfThenElse_IfHeader",
          addpassage: "QGAddRestriction",
          entrypath: ".requirement", // one item instead of a list
          sameline: true
        },
        {
          passage: "CostIfThenElse_ThenHeader",
          entrypath: ".thenwhat"
        },
        {
          passage: "CostIfThenElse_ElseHeader",
          entrypath: ".elsewhat"
        }
      ]
    }
  }
}
