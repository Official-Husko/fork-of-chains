
// special. Will be assigned to State.variables.armory
setup.Armory = class Armory extends setup.TwineClass {
  constructor() {
    super()

    this.equipment_set_keys = []

    // this represent equipments that are not in a set.
    // E.g., {'apple': 3}
    this.equipmentkey_quantity_map = {}
  }

  /**
   * @returns {setup.EquipmentSet}
   */
  newEquipmentSet() {
    let eqset = new setup.EquipmentSet()
    this.equipment_set_keys.push(eqset.key)

    // attach basic equipments
    const free_equipments = setup.Armory.getFreeEquipments()

    for (const equipment of free_equipments) {
      eqset.replaceEquipment(equipment)
    }
    return eqset
  }

  removeEquipmentSet(equipment_set) {
    let equipment_set_key = equipment_set.key
    // its ok if not found.
    this.equipment_set_keys = this.equipment_set_keys.filter(item => item != equipment_set_key)
    setup.queueDelete(equipment_set, 'equipmentset')
  }

  isCanAddNewEquipmentSet() {
    return this.equipment_set_keys.length < this.getMaxEquipmentSets()
  }

  getMaxEquipmentSets() {
    let armory = State.variables.fort.player.countBuildings(setup.buildingtemplate.armory)
    let armorystorage = 0
    if (armory) {
      armorystorage = State.variables.fort.player.getBuilding(setup.buildingtemplate.armory).getLevel() - 1
    }
    return armory * setup.EQUIPMENTSET_ARMORY_DEFAULT_STORAGE + armorystorage * setup.EQUIPMENTSET_PER_STORAGE
  }

  /**
   * @returns {setup.EquipmentSet[]}
   */
  getEquipmentSets() {
    return this.equipment_set_keys.map(key => State.variables.equipmentset[key])
  }

  /**
   * @param {object} filter_dict 
   * @returns {Array<[setup.Equipment, number]>}
   */
  getEquipments(filter_dict) {
    /**
     * @type {Array<[setup.Equipment, number]>}
     */
    let result = []
    for (let equip_key in this.equipmentkey_quantity_map) {
      let equipment = setup.equipment[equip_key]
      if (
        filter_dict &&
        ('equipment_slot' in filter_dict) &&
        filter_dict['equipment_slot'] != equipment.getSlot()
      ) {
        continue
      }
      result.push([
        equipment,
        this.equipmentkey_quantity_map[equip_key],
      ])
    }

    result.sort((a, b) => setup.Equipment.Cmp(a[0], b[0]))
    return result
  }

  getEquipmentCount(equipment) {
    if (!(equipment.key in this.equipmentkey_quantity_map)) return 0
    return this.equipmentkey_quantity_map[equipment.key]
  }

  addEquipment(equipment) {
    let eqkey = equipment.key
    if (!(eqkey in this.equipmentkey_quantity_map)) {
      this.equipmentkey_quantity_map[eqkey] = 0
    }
    this.equipmentkey_quantity_map[eqkey] += 1
    setup.notify(`Gained ${equipment.rep()}`)
  }

  removeEquipment(equipment, quantity) {
    if (quantity === undefined) quantity = 1
    let eqkey = equipment.key
    if (!(eqkey in this.equipmentkey_quantity_map)) throw new Error(`Equipment ${eqkey} not found`)
    this.equipmentkey_quantity_map[eqkey] -= quantity
    if (this.equipmentkey_quantity_map[eqkey] < 0) throw new Error(`Negative quantity?`)

    if (this.equipmentkey_quantity_map[eqkey] == 0) {
      delete this.equipmentkey_quantity_map[eqkey]
    }
  }

  /**
   * @param {setup.Equipment} equipment
   * @param {setup.EquipmentSet} equipment_set 
   */
  unassignEquipment(equipment, equipment_set) {
    equipment_set.removeEquipment(equipment)
    this.addEquipment(equipment)
  }

  /**
   * @param {setup.Equipment} equipment
   * @param {setup.EquipmentSet} equipment_set 
   */
  replaceEquipment(equipment, equipment_set) {
    const old_equipment = equipment_set.getEquipmentAtSlot(equipment.getSlot())
    State.variables.notification.disable()
    this.removeEquipment(equipment)
    equipment_set.replaceEquipment(equipment)
    if (old_equipment) {
      this.addEquipment(old_equipment)
    }
    State.variables.notification.enable()
  }

  /**
   * @param {setup.EquipmentSet} equipment_set 
   */
  unassignAllEquipments(equipment_set) {
    for (const [slot, equipment] of equipment_set.getEquipmentsList()) {
      if (equipment) {
        this.unassignEquipment(equipment, equipment_set)
      }
    }
  }

  /**
   * Try to auto-attach equipments to this set
   * @param {setup.EquipmentSet} equipment_set 
   * @param {Array<setup.Skill>} skill_priorities 
   */
  autoAttach(equipment_set, skill_priorities) {
    // Save the unit, if any
    const unit = equipment_set.getUnit()

    // First strip naked
    this.unassignAllEquipments(equipment_set)

    const max = State.variables.menufilter.get('equipmentauto', 'max')
    const special = State.variables.menufilter.get('equipmentauto', 'special')
    const slutty = State.variables.menufilter.get('equipmentauto', 'slutty')

    let todo = skill_priorities
    if (max) {
      todo = todo.concat([null])
    }

    // tracked separately due to nakedness mechanics
    let total_slutty = 0

    for (const skill of todo) {
      for (const slot of Object.values(setup.equipmentslot)) {
        // if already assigned from previous, do nothing
        if (equipment_set.getEquipmentAtSlot(slot)) continue

        let candidates = this.getEquipments({
          equipment_slot: slot
        }).map(x => x[0])

        candidates = candidates.filter(equipment => {
          if (unit) {
            if (total_slutty + equipment.getSluttiness() >= unit.getSluttinessLimit()) {
              // too slutty
              return false
            }
            if (!equipment.isCanEquip(unit)) {
              // can't equip
              return false
            }
          } else {
            if (!slutty && total_slutty + equipment.getSluttiness() >= setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL) {
              // too slutty
              return false
            }
          }

          if (!special && equipment.isSpecial()) return false

          if (skill && equipment.getSkillMods()[skill.key] <= 0) return false

          return true
        })

        if (candidates.length) {
          if (skill) {
            candidates.sort((a, b) => b.getSkillMods()[skill.key] - a.getSkillMods()[skill.key])
          } else {
            setup.rng.shuffleArray(candidates)
          }
          this.replaceEquipment(candidates[0], equipment_set)
          total_slutty += candidates[0].getSluttiness()
        }
      }
    }

    // Equip default clothes
    for (const equipment of setup.Armory.getFreeEquipments()) {
      if (!equipment_set.getEquipmentAtSlot(equipment.getSlot())) {
        this.replaceEquipment(equipment, equipment_set)
      }
    }

    // Finally, attach back to the unit, if it's possible.
    if (!equipment_set.getUnit() && unit && equipment_set.isEligibleOn(unit)) {
      equipment_set.equip(unit)
    }
  }

  /**
   * @returns {Array<setup.Equipment>}
   */
  static getFreeEquipments() {
    return [
      setup.equipment.shirt,
      setup.equipment.pants,
      setup.equipment.shoes,
    ]
  }
}
