import { domCardRep } from "../../dom/util/cardnamerep";
import {
  menuItem,
  menuItemAction,
  menuItemExtras,
  menuItemText,
  menuItemTitle,
} from "../../ui/menuitem";
import { TwineClass } from "../_TwineClass";
import { MenuFilter, type MenuKey } from "../filter/_filter";
import type { SkillValuesArray } from "../Skill";
import type { TraitKey } from "../trait/Trait";
import type { UnitKey } from "../unit/Unit";
import type { Equipment, EquipmentKey } from "./Equipment";
import type { EquipmentSlot, EquipmentSlotKey } from "./EquipmentSlot";

export type EquipmentSetKey = BrandedType<number | string, "EquipmentSetKey">;

export class EquipmentSet extends TwineClass {
  key: EquipmentSetKey;

  name: string;
  unit_key: UnitKey | undefined = undefined;

  slot_equipment_key_map: { [k in EquipmentSlotKey]?: EquipmentKey } = {};

  declare is_default?: boolean;

  constructor(
    copy_from?: Partial<EquipmentSet>,
    equipments_to_assign?: Equipment[],
  ) {
    super();

    this.key =
      copy_from?.key ??
      (State.variables.EquipmentSet_keygen++ as EquipmentSetKey);

    this.name = `Equipment Set ${this.key}`;

    if (!copy_from) {
      if (this.key in State.variables.equipmentset)
        throw new Error(`Equipment set ${this.key} already exists`);
      State.variables.equipmentset[this.key] = this;
    } else {
      Object.assign(this, copy_from);
    }

    if (equipments_to_assign) {
      for (const equipment of equipments_to_assign)
        this.replaceEquipment(equipment);
    }
  }

  delete() {
    delete State.variables.equipmentset[this.key];
  }

  getImageRep() {
    return this.getSkillReps();
  }

  getRepMacro() {
    return "equipmentsetcard";
  }

  rep(): string {
    return this.getSkillReps() + setup.repMessage(this);
  }

  getUnit(): Unit | null {
    if (!this.unit_key) return null;
    return State.variables.unit[this.unit_key];
  }

  equip(unit: Unit): void {
    if (this.unit_key) throw new Error(`already equipped`);
    if (unit.equipment_set_key) throw new Error(`already equipped on unit`);

    unit.equipment_set_key = this.key;
    this.unit_key = unit.key;

    unit.resetCache();

    setup.notify(`a|Rep now a|equip ${this.rep()}`, { a: unit });
  }

  unequip() {
    let unit = this.getUnit();
    if (!unit) throw new Error(`Not equipped`);
    if (!unit.equipment_set_key) throw new Error(`Unit not equipping this`);
    if (unit.getEquipmentSet() != this) throw new Error(`Unit wrong equip`);

    this.unit_key = undefined;
    unit.equipment_set_key = undefined;

    unit.resetCache();

    setup.notify(`a|Rep a|unequip ${this.rep()}`, { a: unit });
  }

  getValue() {
    let equipments = this.getEquipmentsList();
    let value = 0;
    for (let i = 0; i < equipments.length; ++i) {
      let equipment = equipments[i][1];
      if (equipment) {
        value += equipment.getValue();
      }
    }
    return value;
  }

  getSluttiness() {
    let equipments = this.getEquipmentsList();
    let sluttiness = 0;
    for (let i = 0; i < equipments.length; ++i) {
      let equipment = equipments[i][1];
      if (equipment) {
        sluttiness += equipment.getSluttiness();
      } else {
        let slot_key = equipments[i][0];
        if (slot_key == setup.equipmentslot.legs) sluttiness += 20;
        if (slot_key == setup.equipmentslot.torso) sluttiness += 10;
      }
    }
    return sluttiness;
  }

  isCanChange(): boolean {
    const unit = this.getUnit();
    if (unit) {
      return unit.isHome();
    }
    return true;
  }

  getEquipmentAtSlot(slot: EquipmentSlot): Equipment | null {
    let equipment_key = this.slot_equipment_key_map[slot.key];
    if (!equipment_key) return null;
    return setup.equipment[equipment_key];
  }

  getEquipmentsMap(): Record<EquipmentSlotKey, Equipment | null> {
    // returns {slot: eq, slot: eq, ...}
    let result: Record<EquipmentSlotKey, Equipment | null> = {} as any;
    for (let [slot_key, equipment_key] of objectEntries(
      this.slot_equipment_key_map,
    )) {
      result[slot_key] = equipment_key ? setup.equipment[equipment_key] : null;
    }
    return result;
  }

  /** returns [[slot, eq], [slot, eq]] */
  getEquipmentsList(): Array<[EquipmentSlot, Equipment | null]> {
    let result: Array<[EquipmentSlot, Equipment | null]> = [];
    for (let [slot_key, equipment_key] of objectEntries(
      this.slot_equipment_key_map,
    )) {
      let equipment: Equipment | null = null;
      if (equipment_key) {
        equipment = setup.equipment[equipment_key];
      }
      result.push([setup.equipmentslot[slot_key], equipment]);
    }
    return result;
  }

  /**
   * Aggregate equipment restrictions from its equipments, filtering out duplicates
   */
  getUnitRestrictions(): Restriction[] {
    const restrictions: Restriction[] = [];
    const dedup: Record<string, boolean> = {};
    for (const [slot, equipment] of this.getEquipmentsList()) {
      if (equipment) {
        for (const restriction of equipment.getUnitRestrictions()) {
          const json = JSON.stringify(restriction);
          if (json in dedup) continue;
          dedup[json] = true;
          restrictions.push(restriction);
        }
      }
    }
    return restrictions;
  }

  isEligibleOn(unit: Unit): boolean {
    // is this equipment eligible for unit? Does not check business etc.
    let sluttiness = this.getSluttiness();

    if (unit.isSlaver() && sluttiness >= unit.getSluttinessLimit())
      return false;

    let eqmap = this.getEquipmentsMap();
    for (let [eqkey, eqval] of objectEntries(eqmap)) {
      if (eqval && !eqval.isCanEquip(unit)) {
        return false;
      }
    }

    return true;
  }

  recheckEligibility(): void {
    let unit = this.getUnit();
    if (!unit) return;
    if (!this.isEligibleOn(unit)) {
      this.unequip();
      setup.notify(
        `a|Rep a|is no longer eligible to wear ${this.rep()} and it has been unequipped`,
        { a: unit },
      );
    }
  }

  _removeEquipment(equipment: Equipment): void {
    let slot_key = equipment.getSlot().key;
    if (!(slot_key in setup.equipmentslot))
      throw new Error(`Unknown equipment slot ${slot_key}`);
    if (this.slot_equipment_key_map[slot_key] != equipment.key)
      throw new Error(`Wrong equipment to unequip?`);
    delete this.slot_equipment_key_map[slot_key];
  }

  removeEquipment(equipment: Equipment): void {
    this._removeEquipment(equipment);
    this.recheckEligibility();
    this.getUnit()?.resetCache();
  }

  replaceEquipment(new_equipment: Equipment): void {
    const old_equipment = this.getEquipmentAtSlot(new_equipment.getSlot());
    if (old_equipment) {
      this._removeEquipment(old_equipment);
    }

    const slot_key = new_equipment.getSlot().key;
    if (!(slot_key in setup.equipmentslot))
      throw new Error(`Unknown equipment slot ${slot_key}`);
    if (this.slot_equipment_key_map[slot_key])
      throw new Error(`Already has equipment in slot ${slot_key}`);

    this.slot_equipment_key_map[slot_key] = new_equipment.key;

    this.recheckEligibility();
    this.getUnit()?.resetCache();
  }

  /**
   * @returns A mapping like {trait1: true, trait2: true, ...} from wearing this armor.
   */
  getTraitsObj(): { [k in TraitKey]?: boolean } {
    const equipments = this.getEquipmentsList();

    const trait_accum: { [k in TraitKey]?: number } = {};

    for (let i = 0; i < equipments.length; ++i) {
      const equipment = equipments[i][1];
      if (equipment) {
        const base_traits = equipment.getTraitMods();
        for (const trait_key of objectKeys(base_traits)) {
          trait_accum[trait_key] =
            (trait_accum[trait_key] ?? 0) + 1.0 / base_traits[trait_key];
        }
      }
    }

    const traits: { [k in TraitKey]?: boolean } = {};
    for (const trait_key of objectKeys(trait_accum)) {
      if (trait_accum[trait_key]! >= 0.9999) {
        traits[trait_key] = true;
      }
    }

    /* Special: slutty traits depends on sluttiness */
    const sluttiness = this.getSluttiness();
    if (sluttiness >= setup.EQUIPMENT_VERYSLUTTY_THRESHOLD) {
      traits.eq_veryslutty = true;
    } else if (sluttiness >= setup.EQUIPMENT_SLUTTY_THRESHOLD) {
      traits.eq_slutty = true;
    }

    /* Special: value traits depends on sluttiness */
    let value = this.getValue();
    if (value >= setup.EQUIPMENT_VERYVALUABLE_THRESHOLD) {
      traits.eq_veryvaluable = true;
    } else if (value >= setup.EQUIPMENT_VALUABLE_THRESHOLD) {
      traits.eq_valuable = true;
    }

    return traits;
  }

  getTraits(): Trait[] {
    let trait_obj = this.getTraitsObj();
    return objectKeys(trait_obj).map((k) => setup.trait[k]);
  }

  getName(): string {
    return this.name;
  }

  /**
   * Returns the most relevant reps of the skills from this equipment
   */
  getSkillReps(): string {
    const mods = this.getSkillMods();
    const with_skill: Array<[Skill, number]> = [];
    for (let i = 0; i < mods.length; ++i)
      with_skill.push([setup.skill[i], mods[i]]);
    with_skill.sort((a, b) => b[1] - a[1]);
    let rep = `<div class="icongrid equipmentset-icongrid${!with_skill[0]?.[1] ? " empty" : ""}">`;
    for (let i = 0; i < setup.EQUIPMENTSET_SKILL_DISPLAY; ++i) {
      if (with_skill[i][1]) {
        rep += with_skill[i][0].rep();
      }
    }
    return rep + "</div>";
  }

  getSkillMods(): SkillValuesArray {
    let result: SkillValuesArray = Array(setup.skill.length).fill(0);
    let equips = this.getEquipmentsList();
    for (let i = 0; i < equips.length; ++i) {
      const equipment = equips[i][1];
      if (equipment) {
        let statmods = equipment.getSkillMods();
        for (let j = 0; j < statmods.length; ++j) {
          result[j] += statmods[j];
        }
      }
    }
    return result;
  }

  getAutoAttachMenuCallback(primary_skill: Skill, secondary_skill: Skill) {
    return () => {
      const skills = [primary_skill];
      if (secondary_skill) skills.push(secondary_skill);
      State.variables.armory.autoAttach(this, skills);
      setup.runSugarCubeCommand("<<focgoto>>");
    };
  }

  getAutoAttachMenuSubChildren(primary_skill: Skill) {
    const returned = [];
    for (const secondary_skill of setup.skill) {
      returned.push(
        menuItemAction({
          text: `${primary_skill.rep()}${secondary_skill.rep()}`,
          callback: this.getAutoAttachMenuCallback(
            primary_skill,
            secondary_skill,
          ),
        }),
      );
    }
    return returned;
  }

  getAutoAttachMenu() {
    return menuItemAction({
      text: `Auto-Attach <i class="sfa sfa-caret-down"></i>`,
      tooltip: `Automatically attach equipments to this set maximizing your chosen skills`,
      clickonly: true,
      children: () => {
        const returned = [];
        for (const skill of setup.skill) {
          returned.push(
            menuItem({
              text: skill.rep(),
              children: this.getAutoAttachMenuSubChildren(skill),
            }),
          );
        }
        return returned;
      },
    });
  }

  /**
   * Construct the menu for this equipment set
   */
  getMenu(): JQuery[] {
    const toolbar_items = [];

    toolbar_items.push(
      menuItemTitle({
        text: domCardRep(this),
      }),
    );

    const unit = this.getUnit();
    if (unit) {
      toolbar_items.push(
        menuItemText({
          text: `${unit.rep()}`,
        }),
      );
    }

    if (!this.isCanChange()) {
      toolbar_items.push(
        menuItemText({
          text: "Cannot be changed right now",
        }),
      );
    } else {
      if (this.getUnit()) {
        toolbar_items.push(
          menuItemAction({
            text: `Unequip`,
            tooltip: `Unequip this equipment set from the unit`,
            callback: () => {
              this.unequip();
              setup.runSugarCubeCommand("<<focgoto>>");
            },
          }),
        );
      } else {
        toolbar_items.push(
          menuItemAction({
            text: `Equip`,
            tooltip: `Equip this equipment set to a unit`,
            callback: () => {
              State.variables.gEquipmentSet_key = this.key;
              setup.runSugarCubeCommand('<<focgoto "ArmoryEquip">>');
            },
          }),
        );
      }

      if (State.variables.gPassage != "EquipmentSetChange") {
        toolbar_items.push(
          menuItemAction({
            text: `Edit`,
            tooltip: `Attach / unattach equipments to this equipment set`,
            callback: () => {
              State.variables.gEquipmentSet_key = this.key;
              State.variables.gEquipmentSetChangeReturnPassage =
                State.variables.gPassage;
              setup.runSugarCubeCommand('<<focgoto "EquipmentSetChange">>');
            },
          }),
        );
      }

      toolbar_items.push(this.getAutoAttachMenu());
    }

    const extra = [];
    const menu_name: MenuKey = "equipmentauto";

    for (const menu_key in MenuFilter._MENUS[menu_name]) {
      const menu_obj = MenuFilter._MENUS[menu_name][menu_key];
      extra.push(
        menuItem({
          text: menu_obj.title,
          checked: !!State.variables.menufilter.get(menu_name, menu_key),
          callback: () => {
            const value = State.variables.menufilter.get(menu_name, menu_key);
            State.variables.menufilter.set(menu_name, menu_key, !value);
            setup.runSugarCubeCommand(`<<focgoto>>`);
          },
        }),
      );
    }

    extra.push(
      menuItem({
        text: `Change name`,
        tooltip: `Rename this equipment set`,
        callback: () => {
          State.variables.gEquipmentSet_key = this.key;
          setup.runSugarCubeCommand('<<focgoto "EquipmentSetChangeName">>');
        },
      }),
    );

    if (this.isCanChange()) {
      extra.push(
        menuItem({
          text: `Strip`,
          tooltip: `Unattach all equipments from this set`,
          callback: () => {
            // Unassign all equipment, then assign all basic equipment
            State.variables.armory.unassignAllEquipments(this);

            // Attach basic equipments
            const free_equipments = setup.Armory.getFreeEquipments();
            for (const equipment of free_equipments) {
              State.variables.armory.replaceEquipment(equipment, this);
            }

            this.recheckEligibility();

            setup.runSugarCubeCommand("<<focgoto>>");
          },
        }),
      );
    }

    if (extra.length) {
      toolbar_items.push(
        menuItemExtras({
          children: extra,
        }),
      );
    }

    return toolbar_items;
  }

  /**
   * Whether you can attach this equipment on this set.
   */
  isCanAttach(equipment: Equipment): boolean {
    const unit = this.getUnit();
    if (!unit) return true;

    // create a copy of the equipment set
    const dummy = new setup.EquipmentSet(
      {
        key: "dummy" as EquipmentSetKey,
        name: "Default Slave Equipment",
      },
      this.getEquipmentsList()
        .map((eqobj) => eqobj[1])
        .filter((eq) => !!eq),
    );

    // unassign and reassign the slot
    const slot = equipment.getSlot();
    dummy.replaceEquipment(equipment);

    const possible = dummy.isEligibleOn(unit);

    dummy.delete();
    return possible;
  }

  static getDefaultEquipmentSet(unit: Unit): EquipmentSet {
    if (unit.isSlave()) return EQUIPMENT_SET_DEFAULT.SLAVE;
    return EQUIPMENT_SET_DEFAULT.SLAVER;
  }

  static createDefaultEquipmentSets() {
    return {
      SLAVE: new setup.EquipmentSet({
        key: -1 as EquipmentSetKey,
        name: "Default Slave Equipment",
      }),
      SLAVER: new setup.EquipmentSet(
        {
          key: -2 as EquipmentSetKey,
          name: "Default Slaver Equipment",
        },
        setup.Armory.getFreeEquipments(),
      ),
    };
  }

  static initDefaultEquipmentSets() {
    const sets = setup.EquipmentSet.createDefaultEquipmentSets();
    for (const set of Object.values(sets)) {
      set.is_default = true;
      Object.freeze(set.slot_equipment_key_map);
      Object.freeze(set); // prevent accidental modifications
    }
    EQUIPMENT_SET_DEFAULT = sets;
  }
}

let EQUIPMENT_SET_DEFAULT: ReturnType<
  typeof setup.EquipmentSet.createDefaultEquipmentSets
> = {} as any;
