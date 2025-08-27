import { qc, qres } from "../_init/preinit_costrestrictions";
import type { _BuildingTemplateKey } from "../data/buildings/_buildings";
import { RestrictionLib } from "../util/restriction";
import { TwineClass } from "./_TwineClass";
import type { RoomTemplate, RoomTemplateKey } from "./room/RoomTemplate";
import { BUILDING_TAGS, type BuildingTag } from "./tag/tag_building";

export interface BuildingDefinition {
  name: string;
  tags: readonly BuildingTag[];
  description: string;
  costs: ReadonlyArray<Cost[]>;
  restrictions: ReadonlyArray<Restriction[]>;
  on_build?: ReadonlyArray<Cost[]>;
  main_room_template_key: RoomTemplateKey;
  sub_room_template_key?: RoomTemplateKey;
}

//export type BuildingTemplateKey = BrandedType<string, "BuildingTemplateKey">;
export type BuildingTemplateKey = _BuildingTemplateKey;

export class BuildingTemplate extends TwineClass {
  key: BuildingTemplateKey;
  name: string;
  tags: string[];
  description: string;
  costs: ReadonlyArray<Cost[]>;
  prerequisites: ReadonlyArray<Restriction[]>;
  on_build: ReadonlyArray<Cost[]>;
  main_room_template_key: RoomTemplateKey;
  sub_room_template_key?: RoomTemplateKey;

  constructor(key: string, def: Readonly<BuildingDefinition>) {
    super();

    // costs = [buildcost, upgrade to lv2cost, upgrade to lv3cost, ...]
    // prerequisites = [buildprerqe, upgrade to lv2prereq, upgrade to lv3prereq, ...]
    // on_build: optional, these are run right after building is built. E.g., add duty slot, etc.
    this.key = key as BuildingTemplateKey;
    this.name = def.name;
    this.tags = [...def.tags];
    if (!Array.isArray(def.tags)) {
      throw new Error(`${key} building tags must be array`);
    }
    this.tags.sort();

    for (let i = 0; i < this.tags.length; ++i) {
      if (!(this.tags[i] in BUILDING_TAGS))
        throw new Error(`Building ${key} tag ${this.tags[i]} not recognized`);
    }

    // check exactly one type tag
    const type_tags = this.tags.filter(
      (tag) => BUILDING_TAGS[tag as keyof typeof BUILDING_TAGS].type == "type",
    );
    if (type_tags.length != 1) {
      throw new Error(`Building ${key} must have exactly one type tag`);
    }

    this.description = def.description;
    this.costs = def.costs;
    this.prerequisites = def.restrictions;
    if (def.costs.length != def.restrictions.length)
      throw new Error(`Cost and prereq of ${key} differs in length`);

    if (def.on_build) {
      this.on_build = def.on_build;
    } else {
      this.on_build = [];
    }

    this.main_room_template_key = def.main_room_template_key;
    /*
    if (!main_room_template_key) {
      throw new Error(`Buidling template ${key} missing its main room!`)
    }
    */

    this.sub_room_template_key = def.sub_room_template_key;
    /*
    if (this.getMaxLevel() > 1 && !this.sub_room_template_key) {
      throw new Error(`Building template ${key} needs a sub room!`)
    } else if (this.getMaxLevel() == 1 && this.sub_room_template_key) {
      throw new Error(`Building template ${key} should not have a sub room!`)
    }
    */

    for (const room_key of [
      def.main_room_template_key,
      def.sub_room_template_key,
    ]) {
      if (room_key) {
        const room = setup.roomtemplate[room_key];
        if (!room) throw new Error(`Not found room with key ${room}!`);
        room.building_template_key = this.key;
      }
    }

    if (key in setup.buildingtemplate) {
      throw new Error(`Company ${key} already exists`);
    }
    setup.buildingtemplate[key as BuildingTemplateKey] = this;
  }

  getMainRoomTemplate(): RoomTemplate {
    return setup.roomtemplate[this.main_room_template_key];
  }

  getSubRoomTemplate(): RoomTemplate | null {
    if (!this.sub_room_template_key) return null;
    return setup.roomtemplate[this.sub_room_template_key];
  }

  getDescription(): string {
    return this.description;
  }

  getTags(): readonly string[] {
    return this.tags;
  }

  getOnBuildForLevel(level: number): readonly Cost[] {
    if (this.on_build && this.on_build.length > level) {
      return this.on_build[level];
    } else {
      return [];
    }
  }

  getOnBuild(): readonly Cost[][] {
    return this.on_build;
  }

  getMaxLevel(): number {
    return this.costs.length;
  }

  getName(): string {
    return this.name;
  }

  getCost(current_level: number): readonly Cost[] {
    if (current_level) return this.costs[current_level];
    return this.costs[0];
  }

  getPrerequisite(current_level: number): readonly Restriction[] {
    if (current_level) return this.prerequisites[current_level];
    return this.prerequisites[0];
  }

  getRepMacro(): string {
    return "buildingtemplatecard";
  }

  rep(): string {
    // return setup.repMessage(this, undefined, this.getImageRep())
    return setup.repMessage(this);
  }

  isBuildable(current_level: number = 0): boolean {
    if (!current_level && State.variables.fort.player.countBuildings(this) >= 1)
      return false;
    if (current_level < 0 || current_level >= this.costs.length)
      throw new Error(`weird current level`);

    // check both costs and prerequisites
    let to_check: (Cost | Restriction)[] = [
      ...this.getCost(current_level),
      ...this.getPrerequisite(current_level),
    ];
    for (let i = 0; i < to_check.length; ++i) {
      if (!to_check[i].isOk(undefined)) return false;
    }

    return true;
  }

  payCosts(current_level: number): void {
    if (current_level < 0 || current_level >= this.costs.length)
      throw new Error(`weird level`);
    let to_pay = this.getCost(current_level);
    RestrictionLib.applyAll(to_pay, undefined as any);
  }

  // Whether this building's existence should be hidden from the player
  isHidden(): boolean {
    // if already built, hide it
    if (State.variables.fort.player.isHasBuilding(this)) return true;

    // great hall is always shown
    if (this.key == setup.buildingtemplate.greathall.key) return false;

    // veteran hall is always shown after great hall is built
    if (
      this.key == setup.buildingtemplate.veteranhall.key &&
      State.variables.fort.player.isHasBuilding("greathall")
    )
      return false;

    const restrictions = this.getPrerequisite(0);
    for (const restriction of restrictions) {
      if (
        restriction instanceof setup.qresImpl.Building &&
        !restriction.isOk()
      ) {
        // Building prerequisite is not satisfied
        return true;
      }
      if (
        restriction instanceof setup.qresImpl.HasItem &&
        !restriction.isOk()
      ) {
        // Technology prerequisite is not satisfied
        return true;
      }
    }

    // show otherwise
    return false;
  }

  static getLodgingsCost(init_price: number): Cost[][] {
    const base = [
      [qc.Money(-init_price)],
      [qc.Money(-300)],
      [qc.Money(-400)],
      [qc.Money(-500)],
      [qc.Money(-800)],

      /* 10 people */

      [qc.Money(-1000)],
      [qc.Money(-2000)],
      [qc.Money(-5000)],
      [qc.Money(-10000)],

      /* 18 people */

      [qc.Money(-50000)],

      /* 20 people, softcap starts */

      [qc.Money(-500000)],
      [qc.Money(-5000000)],
      [qc.Money(-20000000)],
      [qc.Money(-50000000)],
      [qc.Money(-120000000)],
    ];

    if (init_price == 0) {
      base[0] = [];
      base[1] = [];
      base[2] = [];
    }

    return base;
  }

  static getLodgingsRestrictions(): Restriction[][] {
    return [
      [],
      [],
      [],
      /* 10 people */
      [qres.Building("greathall")],
      [],

      [],
      [],
      /* 18 people */
      [qres.Building("veteranhall")],
      [],
      [],

      [],
      [],
      [],

      /* 30 people */
      [],
      [],
    ];
  }

  static getDecorationCosts(): Cost[][] {
    return [
      [qc.Money(-500)],
      [qc.Money(-1000)],
      [qc.Money(-2000)],
      [qc.Money(-4000)],
      [qc.Money(-8000)],

      [qc.Money(-16000)],
      [qc.Money(-32000)],
      [qc.Money(-64000)],
      [qc.Money(-128000)],
      [qc.Money(-256000)],
    ];
  }

  static getDecorationRestrictions(): Restriction[][] {
    return [
      [qres.Building("landscapingoffice")],
      [],
      [],
      [],
      [],

      [],
      [],
      [],
      [],
      [],
    ];
  }
}
