// @ts-nocheck

setup.SexAction.UnequipOther = class UnequipOther extends setup.SexAction {
  getTags() { return super.getTags().concat(['equipmentother', 'dom']) }

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
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub], 
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
        ],
      },
      {
        energy: setup.Sex.ENERGY_TINY,
        restrictions: [
          setup.qres.SexCanUnequip(this.getEquipmentSlot()),
        ],
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.resist, setup.sexpace.forced, setup.sexpace.mindbroken], 
      },
    ]
  }

  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexUnequip('b', this.getEquipmentSlot()),
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    const eq = this.getActorUnit('b').getEquipmentAt(this.getEquipmentSlot())
    return `Unequip ${eq.rep()}`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `b|Rep b|unequip b|their ${this.getEquipmentSlot().rep()} equipment`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    const unit = this.getActorUnit('b')
    const eq = unit.getEquipmentAt(this.getEquipmentSlot())

    if (!eq) return ''

    return setup.SexUtil.convert(
      setup.SexText.stripDescription(unit, this.getEquipmentSlot(), sex),
      {a: unit},
      sex)
  }
}


setup.SexActionClass.UnequipOtherTorso = class UnequipOtherTorso extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.torso }
}

setup.SexActionClass.UnequipOtherArms = class UnequipOtherArms extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.arms }
}

setup.SexActionClass.UnequipOtherLegs = class UnequipOtherLegs extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.legs }
}

setup.SexActionClass.UnequipOtherFeet = class UnequipOtherFeet extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.feet }
}

setup.SexActionClass.UnequipOtherMouth = class UnequipOtherMouth extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.mouth }
}

setup.SexActionClass.UnequipOtherNipple = class UnequipOtherNipple extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.nipple }
}

setup.SexActionClass.UnequipOtherRear = class UnequipOtherRear extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.rear }
}

setup.SexActionClass.UnequipOtherGenital = class UnequipOtherGenital extends setup.SexAction.UnequipOther {
  getEquipmentSlot() { return setup.equipmentslot.genital }
}




