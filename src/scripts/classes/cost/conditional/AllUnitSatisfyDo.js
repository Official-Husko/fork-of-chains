setup.qcImpl.AllUnitSatisfyDo = class AllUnitSatisfyDo extends setup.Cost {
  /**
   * @param {setup.Restriction[]} requirement 
   * @param {setup.Cost[]} dowhat 
   */
  constructor(requirement, dowhat) {
    super()

    this.requirement = requirement
    this.dowhat = dowhat
  }

  text() {
    return `setup.qc.AllUnitSatisfyDo([${this.requirement.map(res => res.text()).join(', ')}],\n[${this.dowhat.map(cost => cost.text()).join(', ')}],\n)`
  }

  apply(quest) {
    for (const unit of Object.values(State.variables.unit)) {
      if (setup.RestrictionLib.isUnitSatisfy(unit, this.requirement)) {
        let name = null
        if (quest && 'getName' in quest) {
          name = quest.getName()
        }
        setup.RestrictionLib.applyAll(this.dowhat, setup.costUnitHelperDict({
          unit: unit
        }, name))
      }
    }
  }

  explain(quest) {
    return `<div class='card livingcard'>For all units that satisfy: ${this.requirement.map(r => r.explain()).join(', ')} <br/> do:
      <br/>
      ${this.dowhat.map(
      cost => `${cost.explain()}<br/>`
    ).join('')}
    </div>`
  }

  getLayout() {
    return {
      css_class: "card livingcard",
      blocks: [
        {
          passage: "CostAllUnitSatisfyDo_IfHeader",
          addpassage: "QGAddRestrictionUnit",
          listpath: ".requirement", // one item instead of a list
        },
        {
          passage: "CostAllUnitSatisfyDo_ThenHeader",
          addpassage: "QGAddCostUnit",
          listpath: ".dowhat"
        },
      ]
    }
  }
}
