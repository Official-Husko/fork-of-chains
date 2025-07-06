// @ts-nocheck

import { domCardRep } from "../../dom/util/cardnamerep"
import { menuItem, menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"

setup.EquipmentSet = class EquipmentSet extends setup.TwineClass {
  constructor(default_fields, equipments_to_assign) {
    super()

    if (!default_fields) {
      this.key = State.variables.EquipmentSet_keygen
      State.variables.EquipmentSet_keygen += 1
    }

    this.name = `Equipment Set ${this.key}`
    this.unit_key = null
    this.is_default = false

    this.slot_equipment_key_map = {}
    for (let slot_key in setup.equipmentslot) {
      this.slot_equipment_key_map[slot_key] = null
    }

    if (!default_fields) {
      if (this.key in State.variables.equipmentset) throw new Error(`Equipment set ${this.key} already exists`)
      State.variables.equipmentset[this.key] = this
    } else {
      Object.assign(this, default_fields)
    }

    if (equipments_to_assign) {
      for (const equipment of equipments_to_assign)
        this.replaceEquipment(equipment)
    }
  }

  delete() { delete State.variables.equipmentset[this.key] }

  rep() {
    return this.getSkillReps() + setup.repMessage(this, 'equipmentsetcardkey')
  }

  getUnit() {
    if (!this.unit_key) return null
    return State.variables.unit[this.unit_key]
  }

  equip(unit) {
    if (this.unit_key) throw new Error(`already equipped`)
    if (unit.equipment_set_key) throw new Error(`already equipped on unit`)

    unit.equipment_set_key = this.key
    this.unit_key = unit.key

    unit.resetCache()

    setup.notify(`a|Rep now a|equip ${this.rep()}`, { a: unit })
  }

  unequip() {
    let unit = this.getUnit()
    if (!unit) throw new Error(`Not equipped`)
    if (!unit.equipment_set_key) throw new Error(`Unit not equipping this`)
    if (unit.getEquipmentSet() != this) throw new Error(`Unit wrong equip`)

    this.unit_key = null
    unit.equipment_set_key = null

    unit.resetCache()

    setup.notify(`a|Rep a|unequip ${this.rep()}`, { a: unit })
  }

  getValue() {
    let equipments = this.getEquipmentsList()
    let value = 0
    for (let i = 0; i < equipments.length; ++i) {
      let equipment = equipments[i][1]
      if (equipment) {
        value += equipment.getValue()
      }
    }
    return value
  }

  getSluttiness() {
    let equipments = this.getEquipmentsList()
    let sluttiness = 0
    for (let i = 0; i < equipments.length; ++i) {
      let equipment = equipments[i][1]
      if (equipment) {
        sluttiness += equipment.getSluttiness()
      } else {
        let slot_key = equipments[i][0]
        if (slot_key == setup.equipmentslot.legs) sluttiness += 20
        if (slot_key == setup.equipmentslot.torso) sluttiness += 10
      }
    }
    return sluttiness
  }

  isCanChange() {
    if (this.getUnit()) {
      return this.getUnit().isHome()
    }
    return true
  }

  getEquipmentAtSlot(slot) {
    let equipment_key = this.slot_equipment_key_map[slot.key]
    if (!equipment_key) return null
    return setup.equipment[equipment_key]
  }

  getEquipmentsMap() {
    // returns {slot: eq, slot: eq, ...}
    let result = {}
    for (let slot_key in this.slot_equipment_key_map) {
      let equipment_key = this.slot_equipment_key_map[slot_key]
      if (equipment_key) {
        result[slot_key] = setup.equipment[equipment_key]
      } else {
        result[slot_key] = null
      }
    }
    return result
  }

  /**
   * @returns {Array<[setup.EquipmentSlot, setup.Equipment]>}
   */
  getEquipmentsList() {
    // returns [[slot, eq], [slot, eq]]
    /** @type {[setup.EquipmentSlot,setup.Equipment][]} */
    let result = []
    for (let slot_key in this.slot_equipment_key_map) {
      let equipment_key = this.slot_equipment_key_map[slot_key]
      let equipment = null
      if (equipment_key) {
        equipment = setup.equipment[equipment_key]
      }
      result.push([setup.equipmentslot[slot_key], equipment])
    }

    return result
  }

  /**
   * Aggregate equipment restrictions from its equipments, filtering out duplicates
   * @returns {setup.Restriction[]}
   */
  getUnitRestrictions() {
    const restrictions = []
    const exists = {}
    for (const [slot, equipment] of this.getEquipmentsList()) {
      if (equipment) {
        for (const restriction of equipment.getUnitRestrictions()) {
          const json = JSON.stringify(restriction)
          if (json in exists) continue
          exists[json] = true
          restrictions.push(restriction)
        }
      }
    }
    return restrictions
  }

  isEligibleOn(unit) {
    // is this equipment eligible for unit? Does not check business etc.
    let sluttiness = this.getSluttiness()

    if (unit.isSlaver() && sluttiness >= unit.getSluttinessLimit()) return false

    let eqmap = this.getEquipmentsMap()
    for (let eqkey in eqmap) {
      let eqval = eqmap[eqkey]
      if (eqval && !eqval.isCanEquip(unit)) return false
    }

    return true
  }

  recheckEligibility() {
    let unit = this.getUnit()
    if (!unit) return
    if (!this.isEligibleOn(unit)) {
      this.unequip()
      setup.notify(`a|Rep a|is no longer eligible to wear ${this.rep()} and it has been unequipped`, { a: unit })
    }
  }

  _removeEquipment(equipment) {
    let slot_key = equipment.getSlot().key
    if (!(slot_key in this.slot_equipment_key_map)) throw new Error(`Unknown key ${slot_key}`)
    if (this.slot_equipment_key_map[slot_key] != equipment.key) throw new Error(`Wrong equipment to unequip?`)
    this.slot_equipment_key_map[slot_key] = null
  }

  removeEquipment(equipment) {
    this._removeEquipment(equipment)
    this.recheckEligibility()
    this.getUnit()?.resetCache()
  }

  replaceEquipment(new_equipment) {
    const old_equipment = this.getEquipmentAtSlot(new_equipment.getSlot())
    if (old_equipment) {
      this._removeEquipment(old_equipment)
    }

    const slot_key = new_equipment.getSlot().key
    if (!(slot_key in this.slot_equipment_key_map)) throw new Error(`Unknown key ${slot_key}`)
    if (this.slot_equipment_key_map[slot_key]) throw new Error(`Already has equipment in slot ${slot_key}`)

    this.slot_equipment_key_map[slot_key] = new_equipment.key

    this.recheckEligibility()
    this.getUnit()?.resetCache()
  }

  getTraitsObj() {
    // {trait1: true, trait2: true, ...} from wearing this armor.
    const equipments = this.getEquipmentsList()

    /** @type {Record<string, number>} */
    const trait_accum = {}

    for (let i = 0; i < equipments.length; ++i) {
      const equipment = equipments[i][1]
      if (equipment) {
        const base_traits = equipment.getTraitMods()
        for (const trait_key in base_traits) {
          if (!(trait_key in trait_accum)) trait_accum[trait_key] = 0.0
          trait_accum[trait_key] += 1.0 / base_traits[trait_key]
        }
      }
    }

    const traits = {}
    for (const trait_key in trait_accum) {
      if (trait_accum[trait_key] >= 0.9999) {
        traits[trait_key] = true
      }
    }

    /* Special: slutty traits depends on sluttiness */
    const sluttiness = this.getSluttiness()
    if (sluttiness >= setup.EQUIPMENT_VERYSLUTTY_THRESHOLD) {
      traits.eq_veryslutty = true
    } else if (sluttiness >= setup.EQUIPMENT_SLUTTY_THRESHOLD) {
      traits.eq_slutty = true
    }

    /* Special: value traits depends on sluttiness */
    let value = this.getValue()
    if (value >= setup.EQUIPMENT_VERYVALUABLE_THRESHOLD) {
      traits.eq_veryvaluable = true
    } else if (value >= setup.EQUIPMENT_VALUABLE_THRESHOLD) {
      traits.eq_valuable = true
    }

    return traits
  }

  getTraits() {
    let trait_obj = this.getTraitsObj()
    let result = []
    for (let trait_key in trait_obj) {
      result.push(setup.trait[trait_key])
    }
    return result
  }

  getName() { return this.name }

  /**
   * Returns the most relevant reps of the skills from this equipment
   * @returns {string}
   */
  getSkillReps() {
    const mods = this.getSkillMods()
    const with_skill = []
    for (let i = 0; i < mods.length; ++i) with_skill.push([setup.skill[i], mods[i]])
    with_skill.sort((a, b) => b[1] - a[1])
    let rep = ''
    for (let i = 0; i < setup.EQUIPMENTSET_SKILL_DISPLAY; ++i) {
      if (with_skill[i][1]) {
        rep += with_skill[i][0].rep()
      }
    }
    return rep
  }

  getSkillMods() {
    let result = Array(setup.skill.length).fill(0)
    let equips = this.getEquipmentsList()
    for (let i = 0; i < equips.length; ++i) {
      if (equips[i][1]) {
        let statmods = equips[i][1].getSkillMods()
        for (let j = 0; j < statmods.length; ++j) result[j] += statmods[j]
      }
    }
    return result
  }

  /**
   * @param {setup.Skill} primary_skill 
   * @param {setup.Skill} secondary_skill 
   */
  getAutoAttachMenuCallback(primary_skill, secondary_skill) {
    return () => {
      const skills = [primary_skill]
      if (secondary_skill) skills.push(secondary_skill)
      State.variables.armory.autoAttach(this, skills)
      setup.runSugarCubeCommand('<<focgoto>>')
    }
  }

  /**
   * @param {setup.Skill} primary_skill 
   */
  getAutoAttachMenuSubChildren(primary_skill) {
    const returned = [
    ]
    for (const secondary_skill of setup.skill) {
      returned.push(menuItemAction({
        text: `${primary_skill.rep()}${secondary_skill.rep()}`,
        callback: this.getAutoAttachMenuCallback(primary_skill, secondary_skill),
      }))
    }
    return returned
  }

  getAutoAttachMenu() {
    return menuItemAction({
      text: `Auto-Attach <i class="sfa sfa-down-dir"></i>`,
      tooltip: `Automatically attach equipments to this set maximizing your chosen skills`,
      clickonly: true,
      children: () => {
        const returned = []
        for (const skill of setup.skill) {
          returned.push(menuItem({
            text: skill.rep(),
            children: this.getAutoAttachMenuSubChildren(skill),
          }))
        }
        return returned
      }
    })
  }

  /**
   * Construct the menu for this equipment set
   * @returns {Array<JQLite>}
   */
  getMenu() {
    const toolbar_items = []

    toolbar_items.push(menuItemTitle({
      text: domCardRep(this),
    }))

    if (this.getUnit()) {
      toolbar_items.push(menuItemText({
        text: `${this.getUnit().rep()}`,
      }))
    }

    if (!this.isCanChange()) {
      toolbar_items.push(
        menuItemText({
          text: 'Cannot be changed right now',
        }),
      )
    } else {
      if (this.getUnit()) {
        toolbar_items.push(menuItemAction({
          text: `Unequip`,
          tooltip: `Unequip this equipment set from the unit`,
          callback: () => {
            this.unequip()
            setup.runSugarCubeCommand('<<focgoto>>')
          },
        }))
      } else {
        toolbar_items.push(menuItemAction({
          text: `Equip`,
          tooltip: `Equip this equipment set to a unit`,
          callback: () => {
            // @ts-ignore
            State.variables.gEquipmentSet_key = this.key
            setup.runSugarCubeCommand('<<focgoto "ArmoryEquip">>')
          },
        }))
      }

      if (State.variables.gPassage != 'EquipmentSetChange') {
        toolbar_items.push(menuItemAction({
          text: `Edit`,
          tooltip: `Attach / unattach equipments to this equipment set`,
          callback: () => {
            // @ts-ignore
            State.variables.gEquipmentSet_key = this.key
            // @ts-ignore
            State.variables.gEquipmentSetChangeReturnPassage = State.variables.gPassage
            setup.runSugarCubeCommand('<<focgoto "EquipmentSetChange">>')
          },
        }))
      }

      toolbar_items.push(this.getAutoAttachMenu())
    }

    const extra = []
    const menu_name = 'equipmentauto'

    for (const menu_key in setup.MenuFilter._MENUS[menu_name]) {
      const menu_obj = setup.MenuFilter._MENUS[menu_name][menu_key]
      extra.push(menuItem({
        text: menu_obj.title,
        checked: !!State.variables.menufilter.get(menu_name, menu_key),
        callback: () => {
          const value = State.variables.menufilter.get(menu_name, menu_key)
          State.variables.menufilter.set(menu_name, menu_key, !value)
          setup.runSugarCubeCommand(`<<focgoto>>`)
        },
      }))
    }

    extra.push(menuItem({
      text: `Change name`,
      tooltip: `Rename this equipment set`,
      callback: () => {
        // @ts-ignore
        State.variables.gEquipmentSet_key = this.key
        setup.runSugarCubeCommand('<<focgoto "EquipmentSetChangeName">>')
      },
    }))

    if (this.isCanChange()) {
      extra.push(menuItem({
        text: `Strip`,
        tooltip: `Unattach all equipments from this set`,
        callback: () => {
          // Unassign all equipment, then assign all basic equipment
          State.variables.armory.unassignAllEquipments(this)

          // Attach basic equipments
          const free_equipments = setup.Armory.getFreeEquipments()
          for (const equipment of free_equipments) {
            State.variables.armory.replaceEquipment(equipment, this)
          }

          this.recheckEligibility()

          setup.runSugarCubeCommand('<<focgoto>>')
        },
      }))
    }

    if (extra.length) {
      toolbar_items.push(menuItemExtras({
        children: extra,
      }))
    }

    return toolbar_items
  }

  /**
   * Whether you can attach this equipment on this set.
   * @param {setup.Equipment} equipment 
   * @returns {boolean}
   */
  isCanAttach(equipment) {
    if (!this.getUnit()) return true

    // create a copy of the equipment set
    const dummy = new setup.EquipmentSet({
      key: 'dummy',
      name: "Default Slave Equipment",
    }, this.getEquipmentsList().map(eqobj => eqobj[1]).filter(eq => eq))

    // unassign and reassign the slot
    const slot = equipment.getSlot()
    dummy.replaceEquipment(equipment)

    const possible = dummy.isEligibleOn(this.getUnit())

    dummy.delete()
    return possible
  }

  static getDefaultEquipmentSet(unit) {
    if (unit.isSlave()) return setup.EQUIPMENT_SET_DEFAULT.SLAVE
    return setup.EQUIPMENT_SET_DEFAULT.SLAVER
  }


  static createDefaultEquipmentSets() {
    return {
      SLAVE: new setup.EquipmentSet({
        key: -1,
        name: "Default Slave Equipment",
      }),
      SLAVER: new setup.EquipmentSet({
        key: -2,
        name: "Default Slaver Equipment",
      }, setup.Armory.getFreeEquipments()),
    }
  }

  static initDefaultEquipmentSets() {
    const sets = setup.EquipmentSet.createDefaultEquipmentSets()
    for (const k of Object.keys(sets)) {
      sets[k].is_default = true
      Object.freeze(sets[k].equipmentset)
      sets[k] = Object.freeze(sets[k]) // prevent accidental modifications
    }
    setup.EQUIPMENT_SET_DEFAULT = sets
  }
}

/** @type {ReturnType<typeof setup.EquipmentSet.createDefaultEquipmentSets>} */
setup.EQUIPMENT_SET_DEFAULT
