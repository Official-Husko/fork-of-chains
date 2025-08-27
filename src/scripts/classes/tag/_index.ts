import { BUILDING_TAGS } from "./tag_building";
import { TAG_LORE } from "./tag_lore";
import { QUESTTAGS } from "./tag_quest";
import { TAG_ROOM } from "./tag_room";
import { TAG_SEXACTION } from "./tag_sexaction";
import { TAG_TRAIT } from "./tag_trait";
import { TAG_UNITACTION } from "./tag_unitaction";
import type { TagMetadata } from "./TagHelper";

export const TAG_KINDS = {
  quest: {
    tags: QUESTTAGS,
    img_folder: "tag_quest",
  },
  opportunity: {
    tags: QUESTTAGS,
    img_folder: "tag_quest",
  },
  buildingtemplate: {
    tags: BUILDING_TAGS,
    img_folder: "tag_building",
  },
  buildinginstance: {
    tags: BUILDING_TAGS,
    img_folder: "tag_building",
  },
  room: {
    tags: TAG_ROOM,
    img_folder: "tag_room",
  },
  room_combined: {
    base: "room",
    tags: { ...BUILDING_TAGS, ...TAG_ROOM },
    img_folder: "tag_building",
  },
  unitaction: {
    tags: TAG_UNITACTION,
    img_folder: "tag_unitaction",
  },
  lore: {
    tags: TAG_LORE,
    img_folder: "tag_lore",
  },
  sexaction: {
    tags: TAG_SEXACTION,
    img_folder: "tag_sexaction",
  },
  trait: {
    tags: TAG_TRAIT,
    img_folder: "tag_trait",
  },
} satisfies Record<
  string,
  { img_folder: string; tags: Record<string, TagMetadata>; base?: string }
>;

export type TagKind = keyof typeof TAG_KINDS;
