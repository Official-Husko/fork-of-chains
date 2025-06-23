setup.SexAction.UnequipSelf = class UnequipSelf extends setup.SexAction {
  getTags() { return super.getTags().concat(['equipmentself', 'normal']) }

  /**
   * Unequips an equipment for the duration of this sex scene
   * @returns {setup.EquipmentSlot}
   */
  getEquipmentSlot() {
    return setup.equipmentslot.weapon
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        restrictions: [
          setup.qres.SexCanUnequip(this.getEquipmentSlot()),
          setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
        ],
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced], 
      },
    ]
  }

  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexUnequip('a', this.getEquipmentSlot()),
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    const eq = this.getActorUnit('a').getEquipmentAt(this.getEquipmentSlot())
    return `Unequip ${eq.rep()}`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `a|Rep a|unequip a|their ${this.getEquipmentSlot().rep()} equipment`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    const unit = this.getActorUnit('a')
    const eq = unit.getEquipmentAt(this.getEquipmentSlot())

    if (!eq) return ''

    return setup.SexText.stripDescription(unit, this.getEquipmentSlot(), sex)
  }
}


setup.SexActionClass.UnequipSelfTorso = class UnequipSelfTorso extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.torso }

  // doms don't take off their clothes
  getActorDescriptions() {
    const desc = super.getActorDescriptions()
    desc[0].paces = [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced]
    return desc
  }
}

setup.SexActionClass.UnequipSelfArms = class UnequipSelfArms extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.arms }
}

setup.SexActionClass.UnequipSelfLegs = class UnequipSelfLegs extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.legs }
}

setup.SexActionClass.UnequipSelfFeet = class UnequipSelfFeet extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.feet }

  // doms don't take off their shoes
  getActorDescriptions() {
    const desc = super.getActorDescriptions()
    desc[0].paces = [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced]
    return desc
  }
}

setup.SexActionClass.UnequipSelfMouth = class UnequipSelfMouth extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.mouth }
}

setup.SexActionClass.UnequipSelfNipple = class UnequipSelfNipple extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.nipple }
}

setup.SexActionClass.UnequipSelfRear = class UnequipSelfRear extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.rear }
}

setup.SexActionClass.UnequipSelfGenital = class UnequipSelfGenital extends setup.SexAction.UnequipSelf {
  getEquipmentSlot() { return setup.equipmentslot.genital }
}




