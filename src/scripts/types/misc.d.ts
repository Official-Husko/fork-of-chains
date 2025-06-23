// augment "window" global object type
interface Window {
  // Used by "/classes/unit/unitimage.js"
  UNITIMAGE_CREDITS?: Record<string, ImageMetadata> | undefined
  UNITIMAGE_NOBACK?: boolean | undefined
  UNITIMAGE_LOAD_FURTHER?: string[] | undefined
  IMAGEPACK?: ImagePackNode & Pick<ImagePackMetadata, "title" | "description" | "author"> | undefined

  // Embedded images (might be present or not)
  IMAGES?: Record<string, string>
}

// augment String class
interface String {
  hashCode(): number
}

interface ImageObject {
  path: string
  depth?: number
  info: ImageMetadata
}

interface ImageMetadata {
  title?: string
  artist?: string
  url?: string
  imagepack?: string
  license?: string
  directional?: boolean
  norotate?: boolean
  nowalls?: boolean
  extra?: string
}

interface ImagePackNode {
  is_back_allowed?: boolean
  further?: Record<string, ImagePackNode>
  images?: ImageObject[]
}

interface ImagePackMetadata {
  title?: string
  description?: string
  author?: string

  url: string
  numimages: number
}

// Helper type, to define a Map with strings as keys, and class T instances as values
type Registry<T extends new (...args: any) => any> = Record<string, InstanceType<T>>

declare interface GlobalSettings {
  imagepacks?: readonly string[],

  /**
   * Paths of all the installed mods (regardless of if they are enabled)
   * Each entry can be in the form:
   *  - "mymod.focmod.js" (a packed mod in "mods/")
   *  - "mymod" (an unpacked mod folder in "mods/")
   *  - "https://.../mymod.focmod.js" (a packed mod hosted not locally)
   */
  mods_installed?: readonly string[],
}

type Rarity = "legendary" | "epic" | "rare" | "uncommon" | "common" | "negative"

interface DialogueText {
  friendly: string[]
  bold: string[]
  cool: string[]
  witty: string[]
  debauched: string[]
}

interface Dialogue {
  actor: string
  texts: DialogueText
}

interface DialogueRaw {
  actor: string
  texts: DialogueText | string[]
}

interface ScheduledEventInfo {
  event_key: string
  default_assignment_keys: Record<string, string>
  is_visible_in_calendar?: boolean
}

interface ScheduledEventInfoRealized {
  occur_week: number,
  events: Array<{
    event: setup.Event,
    is_visible_in_calendar: boolean
  }>,
}

interface Skills extends Array<number> { }
