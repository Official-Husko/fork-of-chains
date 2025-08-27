import { Constants } from "../../constants";
import type { _RoomTemplateKey } from "../../data/buildings/_buildings";
import { TwineClass } from "../_TwineClass";
import type {
  BuildingTemplate,
  BuildingTemplateKey,
} from "../BuildingTemplate";
import type { SkillKeyword } from "../Skill";
import { TAG_ROOM } from "../tag/tag_room";

export interface RoomImageObject {
  path: string;
  info: ImageMetadata;
}

export interface RoomDefinition {
  tags: readonly string[];
  width: number;
  height: number;
  name?: string;
  description?: string;
  skill_bonus?: RoomTemplate["raw_skill_bonus"];
  door_column?: number;
  is_fixed?: boolean;
  is_passable?: boolean;
  is_door?: boolean;
  is_optional?: boolean;
  is_outdoors?: boolean;
}

//export type RoomTemplateKey = BrandedType<string, "RoomTemplateKey">;
export type RoomTemplateKey = _RoomTemplateKey;

export class RoomTemplate extends TwineClass {
  static ROOM_IMAGES: Record<string, RoomImageObject> = {};
  static PORTAL_ROOM_TEMPLATE_KEYS: RoomTemplateKey[] = [
    "portalindoors",
    "portaloutdoors",
  ];

  key: RoomTemplateKey;
  tags: string[];
  width: number;
  height: number;
  name: string | undefined;
  description: string | undefined;
  raw_skill_bonus: Array<
    {
      skill_key: SkillKeyword;
      bonus_amount?: number;
    } & (
      | { type: "always" }
      | {
          type: "near" | "adjacent";

          // TODO: find way to avoid circular type reference :/
          //room_keys: RoomTemplateKey[];
          room_keys: string[];
        }
    )
  >;
  skill_bonus: Array<
    {
      skill_key: SkillKeyword;
      bonus: number;
    } & (
      | { type: "always" }
      | {
          type: "near" | "adjacent";

          // TODO: find way to avoid circular type reference :/
          //room_template_key: RoomTemplateKey;
          room_template_key: string;
        }
    )
  >;
  door_column: number | undefined;
  is_fixed: boolean;
  is_passable: boolean;
  is_door: boolean;
  is_optional: boolean;
  is_outdoors: boolean;
  is_hide_name: boolean;
  is_hide_skill: boolean;

  building_template_key: BuildingTemplateKey | null = null;

  /**
   * Will be filled asynchronously
   */
  image_list: ImageObject[] = [];

  cached_rep_tag: string | null = null;
  cached_rep_combined_tag: string | null = null;
  cached_type_tag: string | null = null;
  max_room_count: number | null = null;

  constructor(
    key: string,
    {
      name,
      description,
      tags,
      width,
      height,
      skill_bonus,
      door_column,
      is_fixed,
      is_passable,
      is_door,
      is_optional,
      is_outdoors,
    }: RoomDefinition,
  ) {
    super();

    this.key = key as RoomTemplateKey;
    this.name = name;
    this.description = description;
    this.tags = [...tags];
    if (!Array.isArray(this.tags))
      throw new Error(`${key} room tags must be array`);
    this.tags.sort();

    this.width = width;
    this.height = height;
    this.door_column = door_column;
    if (is_door) {
      if (this.door_column === undefined) {
        throw new Error(
          `Door column must be defined for rooms with door: room ${this.key}`,
        );
      }
      if (this.door_column < 0 || this.door_column >= this.width) {
        throw new Error(
          `Door column of ${this.key} is out of range: must be between 0 and ${this.width - 1}`,
        );
      }
    } else {
      if (this.door_column !== undefined) {
        throw new Error(
          `Room ${this.key} has no door but it has door column defined!`,
        );
      }
    }

    if (is_passable && is_door) {
      throw new Error(`Room ${this.key} is both passable and has a door!`);
    }

    this.raw_skill_bonus = skill_bonus || [];
    if (!Array.isArray(skill_bonus))
      throw new Error(`${key} room skill bonus must be array`);

    this.skill_bonus = [];

    for (const sb of skill_bonus) {
      if (!["always", "near", "adjacent"].includes(sb.type))
        throw new Error(`${key} unrecognized room type: ${sb.type}`);
    }

    this.is_fixed = !!is_fixed;
    this.is_passable = !!is_passable;
    this.is_door = !!is_door;
    this.is_optional = !!is_optional;
    this.is_outdoors = !!is_outdoors;
    this.is_hide_name = this.getTags().includes("hidename");
    this.is_hide_skill = this.getTags().includes("hideskill");

    // extra computed tags
    if (this.is_outdoors) {
      this.tags.push("outdoors");
    } else {
      this.tags.push("indoors");
    }

    if (!this.is_door) {
      this.tags.push("nodoor");
    }

    if (this.is_passable) {
      this.tags.push("passable");
    }

    if (this.is_optional) {
      this.tags.push("optional");
    }

    if (this.is_fixed) {
      this.tags.push("fixed");
    }

    if (key in setup.roomtemplate)
      throw new Error(`Room template ${key} already exists`);
    setup.roomtemplate[key as RoomTemplateKey] = this;
  }

  static initialize() {
    // compute max room count for each building
    let total_tiles_in = 0;
    let total_tiles_out = 0;
    for (const template of Object.values(setup.roomtemplate)) {
      const building = template.getBuildingTemplate();
      if (building) {
        if (
          template == building.getMainRoomTemplate() &&
          template == building.getSubRoomTemplate()
        ) {
          template.max_room_count = building.getMaxLevel();
        } else if (template == building.getMainRoomTemplate()) {
          template.max_room_count = 1;
        } else if (template == building.getSubRoomTemplate()) {
          template.max_room_count = building.getMaxLevel() - 1;
        } else {
          template.max_room_count = 0;
        }
      } else {
        template.max_room_count = 0;
      }
      if (template.isOutdoors()) {
        total_tiles_out +=
          template.getWidth() * template.getHeight() * template.max_room_count;
      } else {
        total_tiles_in +=
          template.getWidth() * template.getHeight() * template.max_room_count;
      }
    }
    const width = setup.FORTGRID_WIDTH;
    console.info(
      `Total tiles: ${total_tiles_in} in (${total_tiles_in / width} rows), ${total_tiles_out} out (${total_tiles_out / width} rows)`,
    );

    setup.MAX_TILE_INSIDE = Constants.MAX_TILE_INSIDE = Math.round(
      Constants.FORTGRID_EXTRA_TILE_MULTIPLIER * total_tiles_in,
    );
    setup.MAX_TILE_OUTSIDE = Constants.MAX_TILE_OUTSIDE = Math.round(
      Constants.FORTGRID_EXTRA_TILE_MULTIPLIER * total_tiles_out,
    );

    // compute how many bonus granted per skill
    const skill_found = Array(setup.skill.length).fill(0);
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (sb.bonus_amount) continue;
        skill_found[setup.skill[sb.skill_key].key] += 1;
      }
    }

    // fill in the actual bonus values
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (!sb.bonus_amount) {
          let base =
            setup.ROOM_BONUS_SKILL_BONUS_DEFAULT /
            skill_found[setup.skill[sb.skill_key].key];
          if (sb.type == "adjacent" || sb.type == "near") {
            let neighbors = 0;
            for (const room_template_key of sb.room_keys as RoomTemplateKey[]) {
              if (!(room_template_key in setup.roomtemplate)) {
                throw new Error(
                  `Missing room template key ${room_template_key} in ${template.key}`,
                );
              }
              const template_neighbor = setup.roomtemplate[room_template_key];
              neighbors += template_neighbor.max_room_count!;
            }
            base /= neighbors * template.max_room_count!;
          }
          sb.bonus_amount = base;
        }
      }
    }

    // outgoing edges
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (sb.type == "always") {
          template.skill_bonus.push({
            type: "always",
            skill_key: sb.skill_key,
            bonus: sb.bonus_amount!,
          });
        } else {
          for (const room_template_key of sb.room_keys as RoomTemplateKey[]) {
            const bonus = {
              type: sb.type,
              skill_key: sb.skill_key,
              bonus: sb.bonus_amount! / 2,
              room_template_key: room_template_key,
            };
            if (room_template_key == template.key) {
              bonus.bonus *= 2;
            }
            template.skill_bonus.push(bonus);
            if (room_template_key != template.key) {
              if (!(room_template_key in setup.roomtemplate)) {
                throw new Error(
                  `Missing room template key ${room_template_key} in ${template.key}!`,
                );
              }
              setup.roomtemplate[room_template_key].skill_bonus.push({
                type: bonus.type,
                skill_key: bonus.skill_key,
                bonus: bonus.bonus,
                room_template_key: template.key,
              });
            }
          }
        }
      }
    }
  }

  getTypeTag() {
    if (!this.cached_type_tag) {
      const type_tags = this.getTags().filter(
        (tag) => TAG_ROOM[tag as keyof typeof TAG_ROOM].type == "type",
      );
      if (!type_tags.length)
        throw new Error(`Room ${this.key} missing type tag!`);
      if (type_tags.length != 1)
        throw new Error(`Room ${this.key} has duplicated type tags!`);
      this.cached_type_tag = type_tags[0];
    }
    return this.cached_type_tag;
  }

  repTags(): string {
    return (this.cached_rep_tag ??= setup.TagHelper.getTagsRep(
      "room",
      this.getTags(),
    ));
  }

  /** Same as repTags but using the combined room & building tags */
  repCombinedTags(): string {
    if (!this.cached_rep_combined_tag) {
      let tags = this.getTags();
      const b = this.getBuildingTemplate();
      if (b && b.key === this.key) {
        tags = tags.concatUnique(b.tags).sort();
      }
      this.cached_rep_combined_tag = setup.TagHelper.getTagsRep(
        "room_combined",
        tags,
      );
    }
    return this.cached_rep_combined_tag;
  }

  getRepMacro() {
    return "roomtemplatecard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  repFull(): string {
    return (
      this.repTags() +
      setup.repMessage(this) +
      ` (${this.getWidth()} x ${this.getHeight()})`
    );
  }

  getImageList(): ImageObject[] {
    return this.image_list;
  }

  getBuildingTemplate(): BuildingTemplate | null {
    if (!this.building_template_key) return null;
    return setup.buildingtemplate[this.building_template_key];
  }

  getDoorColumn(): number | undefined {
    return this.door_column;
  }

  isMainRoom(): boolean {
    const template = this.getBuildingTemplate();
    return !!template && template.getMainRoomTemplate() == this;
  }

  getName(): string {
    if (!this.name && !this.getBuildingTemplate())
      throw new Error(`Unknown name for room ${this.key}`);
    return this.name || this.getBuildingTemplate()!.getName();
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getTags(): string[] {
    // combine my tags with my building tags, if any
    const tags = this.tags;
    const building = this.getBuildingTemplate();
    if (building) {
      const all_tags = setup.TagHelper.getTagsMap("room");
      return tags.concatUnique(
        building.getTags().filter((tag) => tag in all_tags),
      );
    }
    return tags;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getSkillBonus(): RoomTemplate["skill_bonus"] {
    return this.skill_bonus;
  }

  isHasSkillBonusOn(skill: Skill): boolean {
    return (
      this.getSkillBonus().filter(
        (bonus) => bonus.skill_key === skill.keyword && bonus.bonus > 0,
      ).length > 0
    );
  }

  isFixed(): boolean {
    return this.is_fixed;
  }

  isPassable(): boolean {
    return this.is_passable;
  }

  isHasDoor(): boolean {
    return this.is_door;
  }

  isOptional(): boolean {
    return this.is_optional;
  }

  isOutdoors(): boolean {
    return this.is_outdoors;
  }

  isHideName(): boolean {
    return this.is_hide_name;
  }

  isHideSkill(): boolean {
    return this.is_hide_skill;
  }

  isPortal(): boolean {
    return setup.RoomTemplate.PORTAL_ROOM_TEMPLATE_KEYS.includes(this.key);
  }

  static getAllWithTags(tags: string[]): RoomTemplate[] {
    return Object.values(setup.roomtemplate).filter((template) => {
      const template_tags = template.getTags();
      return tags.every((tag) => template_tags.includes(tag));
    });
  }

  static getCreditsByArtist() {
    const result: Record<string, ImageObject[]> = {};

    for (const template of Object.values(setup.roomtemplate)) {
      const images = template.getImageList();
      for (const image of images) {
        if (image.info?.artist) {
          (result[image.info.artist] ??= []).push(image);
        }
      }
    }
    return result;
  }
}
