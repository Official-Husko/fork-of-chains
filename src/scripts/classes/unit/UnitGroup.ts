import type { UNIT_GROUP_DEFINITIONS } from "../../data/unitgroups/_index";
import { isDefinitionArgs } from "../../util/TypeUtil";
import { TwineClass } from "../_TwineClass";
import type { SubraceKey } from "../trait/Subrace";
import type { TraitKey } from "../trait/Trait";
import {
  UnitPoolKey,
  type GenerateUnitOptions,
  type UnitPool,
} from "./pool/UnitPool";
import type { Unit } from "./Unit";

export interface UnitGroupDefinition {
  name: string;
  chances: ChanceArray<UnitPool | UnitPoolKey> | string;
  reuse_chance: number;
  unit_post_process: Cost[];
  gender_traits?: TraitKey[];

  /**
   * If true, defines additional UnitGroups for each gender.
   * For example if you define a group "city_all" with this set to true,
   * it will also create "city_allmale" and "city_allfemale".
   */
  make_gender_variants?: boolean;
}

interface GetUnitOptions extends GenerateUnitOptions {
  /** Override the unit pool to use to generate an unit (when needed) */
  unit_pool?: UnitPool | UnitPoolKey;
}

//export type UnitGroupKey = BrandedType<string, "UnitGroupKey">;
export type UnitGroupKey =
  | keyof typeof UNIT_GROUP_DEFINITIONS
  | keyof CustomUnitGroups
  | {
      // Unit groups created by setting "make_gender_variants = true"
      [k in keyof typeof UNIT_GROUP_DEFINITIONS]: true extends (typeof UNIT_GROUP_DEFINITIONS)[k]["make_gender_variants"]
        ? `${k}male` | `${k}female`
        : never;
    }[keyof typeof UNIT_GROUP_DEFINITIONS]
  | {
      // Unit groups created by subraces
      [k in SubraceKey]:
        | `subrace_${k}`
        | `subrace_${k}_male`
        | `subrace_${k}_female`;
    }[SubraceKey];

// Represents a group of people. E.g.,
// farmers in citizens,
// slaves in docks, etc.
// A quest may request one of these units as actor
// A quest may also offer some unit back to this pool.
// unitpools: [[unitpool1, weight], ...]
export class UnitGroup extends TwineClass {
  key: UnitGroupKey;
  name: string;
  reuse_chance: number;

  unitpool_keys: ChanceArray<UnitPoolKey> = [];
  unit_post_process: Cost[];

  gender_traits: TraitKey[] | undefined;

  /**
   * Whether this unit group is a "base" unit group, and not a quest-made unit group.
   */
  is_base = false;

  temporary_unit_key = null;

  static keygen = 1; // only used in dev tool

  constructor(
    key: string,
    ...args:
      | [Readonly<UnitGroupDefinition>]
      | [
          name: string,
          unitpoolsOrUnitGroupKey: ChanceArray<UnitPool> | string,
          reuse_chance: number,
          unit_post_process: Cost[],
          gender_traits?: TraitKey[],
        ]
  ) {
    super();

    let def: Readonly<UnitGroupDefinition>;
    if (isDefinitionArgs(args)) {
      def = args[0];
    } else {
      // prettier-ignore
      const [ name, chances, reuse_chance, unit_post_process, gender_traits ] = args;
      // prettier-ignore
      def = { name, chances, reuse_chance, unit_post_process, gender_traits };
    }

    // unit_post_process: a series of cost objects. Actor name is
    // "unit". So e.g., setup.qc.Trait('unit', 'bg_farmer') to give them farmer background.
    if (!key) {
      this.key = String(setup.UnitGroup.keygen++) as UnitGroupKey;
    } else {
      this.key = key as UnitGroupKey;
    }

    this.name = def.name;

    let unitpools: ChanceArray<UnitPool | UnitPoolKey>;
    if (typeof def.chances === "string") {
      unitpools = setup.unitgroup[def.chances as UnitGroupKey].getUnitPools();
    } else {
      unitpools = def.chances;
    }

    this.unitpool_keys = unitpools.map(([unitpool_or_key, chance]) => {
      return [resolveKey(unitpool_or_key), chance];
    });
    if (this.unitpool_keys.length) {
      setup.rng.normalizeChanceArray(this.unitpool_keys);
    }

    this.reuse_chance = def.reuse_chance;
    this.gender_traits = def.gender_traits as TraitKey[];

    this.unit_post_process = def.unit_post_process || [];
    for (let i = 0; i < def.unit_post_process.length; ++i) {
      let k = def.unit_post_process[i];
      if (!k) {
        throw new Error(`unit group ${key} missing unit post process ${i}`);
      }
      if ("actor_name" in k && k.actor_name != "unit") {
        throw new Error(
          `unit group ${key} post process ${i} actor name must be "unit"`,
        );
      }
    }

    // behavior different for backwards compatibility:
    if (this.key in setup.unitgroup) {
      // do nothing
    } else {
      setup.unitgroup[this.key] = this;
    }

    if (def.make_gender_variants) {
      new UnitGroup(`${key}male`, {
        ...def,
        make_gender_variants: false,
        gender_traits: ["gender_male"],
      });
      new UnitGroup(`${key}female`, {
        ...def,
        make_gender_variants: false,
        gender_traits: ["gender_female"],
      });
    }
  }

  isBase(): boolean {
    return this.is_base;
  }

  toJs(): string {
    let base = `new setup.UnitGroup(\n`;
    base += `"${this.key}",\n`;
    base += `"${setup.escapeJsString(this.name)}",\n`;

    // for pools, check if some existing unitgroup has the exact same pools.
    let exist = null;
    for (const unit_group of Object.values(setup.unitgroup)) {
      if (unit_group instanceof setup.UnitGroup && unit_group.isBase()) {
        // check if the unit pools are the same
        const up1 = unit_group.unitpool_keys;
        const up2 = this.unitpool_keys;
        if (up1.length == up2.length) {
          let same = true;
          for (let i = 0; i < up1.length; ++i) {
            if (
              up1[i][0] != up2[i][0] ||
              Math.abs(up1[i][1] - up2[i][1]) > 0.000001
            ) {
              same = false;
            }
          }
          if (same) {
            exist = unit_group;
            break;
          }
        }
      }
    }

    if (exist) {
      base += `'${exist.key}', """ /* pools */ """\n`;
    } else {
      base += `[ """ /* pools */ """\n`;
      for (const [pool, weight] of this.getUnitPools()) {
        base += `&nbsp; [setup.unitpool.${resolveKey(pool)}, ${weight}],\n`;
      }
      base += "],\n";
    }

    base += `${this.reuse_chance},  """ /* reuse chance */ """\n`;
    base += `[ """ /* unit post process */ """\n`;
    for (const postprocess of this.unit_post_process) {
      base += `&nbsp; ${postprocess.text()},\n`;
    }
    base += `],\n`;
    if (this.gender_traits) {
      base += `${this.gender_traits}`;
    }
    base += `)`;
    return base;
  }

  getRepMacro() {
    return "unitgroupcard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  getUnitPools(): Array<[UnitPool, number]> {
    let result: Array<[UnitPool, number]> = [];
    for (let i = 0; i < this.unitpool_keys.length; ++i) {
      let up = this.unitpool_keys[i];
      result.push([setup.unitpool[up[0]], up[1]]);
    }
    return result;
  }

  getActorUnit(actor_name: string): Unit {
    if (actor_name != "unit")
      throw new Error(`Unknown actor name ${actor_name}`);
    if (!this.temporary_unit_key) throw new Error(`temporary unit not set`);
    return State.variables.unit[this.temporary_unit_key];
  }

  resetUnitGroupUnitKeys(targetMap?: Record<UnitGroupKey, UnitKey[]>) {
    if (this.reuse_chance) {
      let map = targetMap ?? State.variables.unitgroup_unit_keys;
      if (!(this.key in map)) {
        map[this.key] = [];
      }
    }
  }

  /**
   * Return the only unit in this group, if any. Ignores busy status.
   */
  getOnlyUnit(): Unit | null {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance)
      throw new Error(`GetOnlyUnit only usable when reuse chance is non zero`);
    let unit_keys = State.variables.unitgroup_unit_keys[this.key];
    if (!unit_keys.length) return null;
    return State.variables.unit[unit_keys[0]];
  }

  /**
   * Get all units of this unit group, regardless of where they are
   */
  getAllUnits(): Unit[] {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance)
      throw new Error(`getAllUnits only usable when reuse chance is non zero`);
    const unit_keys = State.variables.unitgroup_unit_keys[this.key];
    if (!unit_keys) return [];
    return unit_keys.map((key) => State.variables.unit[key]);
  }

  /**
   * Generate a new unit
   */
  _generateUnit(options?: GetUnitOptions): Unit | null {
    let unitpool_key: UnitPoolKey;
    if (options?.unit_pool) {
      // if an override was provided, use that
      unitpool_key = resolveKey(options.unit_pool);
    } else {
      unitpool_key = setup.rng.sampleArray(this.unitpool_keys)!;
    }
    const unitpool = setup.unitpool[unitpool_key];
    if (!unitpool) {
      throw new Error(`Missing unit pool for ${this.key} unit group?`);
    }

    const unit = unitpool.generateUnit(options)!;

    setup.RestrictionLib.applyAll(
      this.unit_post_process,
      setup.costUnitHelperDict({ unit: unit }),
    );
    return unit;
  }

  /**
   * Generates a new unit in the group.
   * If `this.reuse_chance` is > 0, might return an existing unit instead of generating a new one.
   */
  getUnit(options?: GetUnitOptions): Unit {
    this.resetUnitGroupUnitKeys();
    // cleanup first so that it doesnt get returned then cleaned.
    this.cleanUnits();

    // find a free unit (i.e., unit.quest_key = null)
    if (Math.random() < this.reuse_chance) {
      // try to reuse if possible
      let possible_units = [];
      let unit_keys = State.variables.unitgroup_unit_keys[this.key];
      for (let i = 0; i < unit_keys.length; ++i) {
        let unit_key = unit_keys[i];
        let unit = State.variables.unit[unit_key];
        if (unit.isEngaged()) continue;
        possible_units.push(unit);
      }
      if (possible_units.length) {
        return possible_units[
          Math.floor(Math.random() * possible_units.length)
        ];
      }
    }

    const unit = this._generateUnit(options)!;

    // only give unit a group if it's going to be reused, otherwise will be garbage collected.
    if (this.reuse_chance) {
      this.resetUnitGroupUnitKeys();
      unit.unit_group_key = this.key;
      State.variables.unitgroup_unit_keys[this.key].push(unit.key);
    }

    return unit;
  }

  /**
   * Remove the unit from the group. E.g., because its taken, killed, etc.
   */
  removeUnit(unit: Unit) {
    this.resetUnitGroupUnitKeys();
    if (unit.unit_group_key != this.key) throw new Error(`invalid unit`);
    if (this.reuse_chance) {
      let unit_keys = State.variables.unitgroup_unit_keys[this.key];
      if (!unit_keys.includes(unit.key)) throw new Error(`invalid array`);
      State.variables.unitgroup_unit_keys[this.key] = unit_keys.filter(
        (item) => item != unit.key,
      );
    }
    unit.unit_group_key = undefined;
    unit.checkDelete();
  }

  isEmpty() {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance) return true;
    let unit_keys = State.variables.unitgroup_unit_keys[this.key];
    return unit_keys.length == 0;
  }

  isBusy() {
    for (const unit of this.getAllUnits()) {
      if (unit.isEngaged()) {
        return true;
      }
    }
    return false;
  }

  hasUnbusyUnit() {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance) return false;
    let unit_keys = State.variables.unitgroup_unit_keys[this.key];
    if (!unit_keys) throw new Error(`Unit keys not found for ${this.key}`);
    for (let i = 0; i < unit_keys.length; ++i) {
      let unit = State.variables.unit[unit_keys[i]];
      if (!unit.isEngaged()) return true;
    }
    return false;
  }

  addUnit(unit: Unit) {
    if (unit.unit_group_key) throw new Error(`Already in a group`);
    if (unit.company_key) throw new Error(`Already in a company`);
    if (!this.reuse_chance) {
      // just garbage collect in this case.
      unit.checkDelete();
    } else {
      this.resetUnitGroupUnitKeys();
      let unit_keys = State.variables.unitgroup_unit_keys[this.key];
      unit_keys.push(unit.key);
      unit.unit_group_key = this.key;
    }
    this.cleanUnits();
  }

  /** Remove unit if too many */
  cleanUnits() {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance) return;
    if (this.reuse_chance == 2) return; // special case for reserved unit
    let unit_keys = State.variables.unitgroup_unit_keys[this.key];
    while (unit_keys.length > setup.UNIT_GROUP_MAX_UNITS) {
      let rmkey = setup.rng.choice(unit_keys);
      let unit = State.variables.unit[rmkey];
      this.removeUnit(unit);
      unit_keys = State.variables.unitgroup_unit_keys[this.key];
    }
  }

  /** Remove all units from this group */
  removeAllUnits() {
    this.resetUnitGroupUnitKeys();
    if (!this.reuse_chance) return;
    let unit_keys = State.variables.unitgroup_unit_keys[this.key];
    while (unit_keys.length > 0) {
      let rmkey = unit_keys[0];
      let unit = State.variables.unit[rmkey];
      this.removeUnit(unit);
      unit_keys = State.variables.unitgroup_unit_keys[this.key];
    }
  }

  getName(): string {
    return this.name;
  }

  _appendUnitPool(unitpool_key: UnitPoolKey, chance: number) {
    this.unitpool_keys.push([unitpool_key, chance]);
  }

  computeStatistics(): { mean: number; min: number; max: number } {
    try {
      let sumval = 0;
      let min = setup.INFINITY;
      let max = 0;
      for (let i = 0; i < setup.COMPUTE_APPROXIMATE_VALUE_REPS; ++i) {
        const unit = this._generateUnit()!;
        sumval += unit.getSlaveValue();
        min = Math.min(min, unit.getSlaveValue());
        max = Math.max(max, unit.getSlaveValue());
        unit.delete();
      }
      State.variables.notification.popAll();
      const mean = Math.round(
        (sumval / setup.COMPUTE_APPROXIMATE_VALUE_REPS) *
          setup.COMPUTE_APPROXIMATE_VALUE_MULTIPLIER,
      );
      return {
        min: min,
        max: max,
        mean: mean,
      };
    } catch (ex) {
      // the unit group is a special one that cannot generate units
      return {
        min: 0,
        max: 0,
        mean: 0,
      };
    }
  }
}
