//
// File that defines custom types to override some of SugarCube
//   Base on SugarCube's offical types "userdata.d.ts" file
//   See: https://www.motoslave.net/sugarcube/2/docs/#guide-typescript
//
// Modifications applied to files from "twine-sugarcube":
//   - globals.d.ts: comment out "const setup: SugarCubeSetupObject"
//   - sugarcube.d.ts: comment out "readonly setup: SugarCubeSetupObject"
//   - userdata.d.ts: replace all the content of the file by:
//       export * from "../sugarcube-custom"
//   - macro.d.ts: append at the end inside of block "export interface MacroContext {":
//       createShadowWrapper<P, R>(callback: (...args: P) => R): ((...args: P) => R)
//

import { SimpleAudioAPI } from "twine-sugarcube/audio"
import { ConfigAPI } from "twine-sugarcube/config"
import { EngineAPI } from "twine-sugarcube/engine"
import { MacroAPI, MacroContext } from "twine-sugarcube/macro"
import { Passage } from "twine-sugarcube/passage"
import { SaveAPI } from "twine-sugarcube/save"
import { ScriptingAPI } from "twine-sugarcube/scripting"
import { SettingsAPI } from "twine-sugarcube/settings"
import { StateAPI } from "twine-sugarcube/state"
import { StoryAPI } from "twine-sugarcube/story"
import { SugarCubeObject } from "twine-sugarcube/sugarcube"
import { TemplateAPI } from "twine-sugarcube/template"
import { DialogAPI, FullscreenAPI, LoadScreenAPI, UIAPI, UIBarAPI } from "twine-sugarcube/ui"
import { SugarCubeSettingVariables } from "twine-sugarcube/userdata"
import { OutputDestination, WikifierAPI, WikifierOptions } from "twine-sugarcube/wiki"

declare global {

  const SugarCube: Omit<SugarCubeObject, 'setup'|'Engine'|'State'|'Macro'> & {
    readonly setup: typeof setup
    readonly Engine: typeof Engine
    readonly State: typeof State
    readonly Macro: typeof Macro
  }

  /**
   * Configuration API.
   * @since 2.0.0
   */
  const Config: ConfigAPI

  /**
   * Dialog API.
   * @since 2.0.0
   */
  const Dialog: DialogAPI

  /**
   * Engine API.
   */
  const Engine: EngineAPI & {
    minDomActionDelay: number
  }

  /**
   * Macro API.
   * @since 2.0.0
   */
  const Macro: MacroAPI & {
    add(name: string, alias: string): void
  }

  /**
   *
   * @since 2.28.0
   */
  const SimpleAudio: SimpleAudioAPI

  /**
   * Template API.
   * @since 2.29.0
   */
  const Template: TemplateAPI

  /**
   * Strings localization object.
   * @since 2.10.0
   */
  const l10nStrings: {[x: string]: string}

  /**
   * Object that authors/developers may use to set up various bits of static data. Generally, you would use this for data that
   * does not change and should not be stored within story variables, which would make it part of the history.
   * @since 2.0.0
   */
  //const setup: SugarCubeSetupObject

  /**
   * A prototype-less generic object whose properties and values are defined by the Setting.addToggle(),
   * Setting.addList(), and Setting.addRange() methods.
   *
   * Normally, the values of its properties are automatically managed by their associated Settings dialog
   * control. If necessary, however, you may manually change their values—n.b. you'll need to call the
   * Setting.save() after having done so.
   * @since 2.0.0
   */
  const settings: SugarCubeSettingVariables

  const Fullscreen: FullscreenAPI

  const LoadScreen: LoadScreenAPI

  const Save: SaveAPI

  const Scripting: ScriptingAPI

  const Setting: SettingsAPI

  const State: StateAPI & {
    variables: StateVariables
    readonly history: any[]
    readonly activeIndex: number
  }

  const Story: StoryAPI & {
    add(passage: Passage): void
  }

  const UI: UIAPI

  const UIBar: UIBarAPI

  const Passage: {
    new (title: string, element: HTMLElement): Passage
  }

  class WikifierInstance {
    output: ParentNode|null
  }
  const Wikifier: WikifierAPI & {
    new(destination: OutputDestination | null, source: string, options?: WikifierOptions): WikifierInstance
  }

  type SugarcubeMacroContext = MacroContext

  const storage: {
    has(key: string): boolean
    get(key: string): any|null
    set(key: string, value: any): boolean
    delete(key: string): boolean
  }

  function importScripts(...urls: string[]): Promise<void>

  interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    wiki(code: string): void
  }

}
