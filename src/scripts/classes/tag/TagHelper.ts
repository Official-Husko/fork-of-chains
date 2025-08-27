import { TAG_KINDS, type TagKind } from "./_index";

export interface TagMetadata {
  type: string;
  title?: string;
  description: string;
  hide?: true;
}

/**
 * Static class to help tag related stuffs
 */
export class TagHelper {
  static getTagsMap(tag_kind: TagKind): Record<string, TagMetadata> {
    if (!(tag_kind in TAG_KINDS))
      throw new Error(`Unrecognized tag kind: ${tag_kind}`);
    return TAG_KINDS[tag_kind].tags;
  }

  static getAllTagsOfType(tag_kind: TagKind, tag_type: string): string[] {
    const result = [];
    const all_tags = TagHelper.getTagsMap(tag_kind);
    for (const tag in all_tags) {
      if (all_tags[tag].type == tag_type) result.push(tag);
    }
    return result;
  }

  static tagRep(tag_kind: TagKind, tag: string, force?: boolean): string {
    const tag_map = TagHelper.getTagsMap(tag_kind);
    if (!(tag in tag_map)) throw new Error(`Unknown ${tag_kind} tag: ${tag}`);

    const tagobj = tag_map[tag];
    if (!force && tagobj.hide) return "";

    const info = TAG_KINDS[tag_kind];
    let folder = info.img_folder;
    if ("base" in info && tag in TAG_KINDS[info.base as TagKind].tags) {
      folder = TAG_KINDS[info.base as TagKind].img_folder;
    }

    return setup.repImg({
      imagepath: `img/${folder}/${tag}.svg`,
      tooltip_content: tagobj.description,
      extra_class: `trait tag-${tagobj.type}`,
    });
  }

  static tagRepLong(tag_kind: TagKind, tag: string): string {
    const tag_map = TagHelper.getTagsMap(tag_kind);
    if (!(tag in tag_map)) throw new Error(`Unknown ${tag_kind} tag: ${tag}`);

    const tagobj = tag_map[tag];
    return `${TagHelper.tagRep(tag_kind, tag)}<span data-tooltip="${tagobj.description}">${tagobj.title}</span>`;
  }

  static getTagsRep(tag_kind: TagKind, tags: readonly string[]): string {
    const tag_map = TagHelper.getTagsMap(tag_kind);
    const taglist = Object.keys(tag_map);
    const tag_copy = [...tags];
    tag_copy.sort((tag1, tag2) => {
      const idx1 = taglist.indexOf(tag1);
      const idx2 = taglist.indexOf(tag2);
      return idx1 - idx2;
    });
    return tag_copy.map((tag) => TagHelper.tagRep(tag_kind, tag)).join("");
  }

  static getQuestCardClass(tags: readonly string[]): string {
    let panorama = setup.QUESTTAGS_DEFAULT_PANORAMA;
    let border = "";
    for (const tag of tags) {
      if (tag in setup.QUESTTAGS_PANORAMA) {
        panorama =
          setup.QUESTTAGS_PANORAMA[
            tag as keyof typeof setup.QUESTTAGS_PANORAMA
          ];
      }
      if (tag in setup.QUESTTAGS_BORDER) {
        border =
          setup.QUESTTAGS_BORDER[tag as keyof typeof setup.QUESTTAGS_BORDER];
      }
    }
    return "questcardbase " + panorama + " " + border;
  }
}
