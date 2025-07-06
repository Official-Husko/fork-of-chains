// @ts-nocheck



export interface FocModDefinition {
  /** Unique identifier for the mod (e.g. "my_mod") */
  key: string

  /** Display name for the mod (e.g. "My Mod") */
  name?: string

  /** Version number for the mod, in semver syntax (e.g. "1.0.0") */
  version?: string

  /** Author or authors of the mod */
  author?: string

  /** Brief summary of what the mod does */
  description?: string

  /**
   * Priority during the mods loading order, higher priority mods load before
   * Use it if you mod depends on another mod, so it loads after it
   * Default is 0
   */
  priority?: number

  onEnable?: () => void
  onDisable?: () => void
  
}

declare global {

  /**
   * Called by FoC mods to register themselves
   * @param definition
   */
  function FocMod(definition: FocModDefinition): void

}
