// @ts-nocheck

import { reload } from "../dom/nav/AAA_nav.js"

Macro.add(['focmove', 'focreturn', ], {
  handler : function () {
    // sanity check
    if (this.name == 'focreturn') {
      if (this.args.length != 1) throw new Error(`Incorrect length of arguments for <<focreturn>>: must have exactly 1 element but ${this.args.length} found`)
    } else {
      if (this.args.length != 2) throw new Error(`<<focmove>> must have 2 arguments but 1 found`)
      if (!Story.has(this.args[1])) {
        throw new Error(`Passage ${this.args[1]} not found for <<focreturn>>`)
      }
    }

    let $elem = jQuery(document.createElement('a'))

    const this_name = this.name
    const this_args = this.args
    $elem.on("click", this.createShadowWrapper(() => {
      if (this_name == 'focreturn') {
        [State.variables.gOldPassage, State.variables.gPassage] = [State.variables.gPassage, State.variables.gOldPassage]
      } else {
        State.variables.gOldPassage = State.variables.gPassage
        State.variables.gPassage = this_args[1]
      }

      reload(/* passage switch = */ false, /* scroll top = */ State.variables.gPassage != State.variables.gOldPassage)
    }))

    $elem.wiki(this.args[0])

    $elem.appendTo(this.output)
  }
})


Macro.add(['focgoto', 'focsavestategoto'], {
  handler : function () {
    // sanity check
    if (this.args.length == 1 && !Story.has(this.args[0])) {
      throw new Error(`Passage ${this.args[0]} not found for <<${this.name}>>`)
    }

    const next = this.args[0]
    if (next) {
      State.variables.gOldPassage = State.variables.gPassage
      State.variables.gPassage = next
    }

    let scroll_top = false
    if (this.args.length == 1 && State.variables.gPassage != State.variables.gOldPassage) scroll_top = true
    reload(/* force_passage_switch = */ this.name == 'focsavestategoto', scroll_top)
  }
})


Macro.add(['foclink', 'focbutton'], {
  tags: null,
  handler : function () {
    // sanity check
    if (this.args.length < 1 || this.args.length > 2) throw new Error(`Incorrect length of arguments for <<${this.name}>>: must have 1-2 elements but ${this.args.length} found`)
    if (this.args.length == 2 && !Story.has(this.args[1])) {
      throw new Error(`Passage ${this.args[1]} not found for <<${this.name}>>`)
    }

    let containername = 'a'
    if (this.name == 'focbutton') containername = 'button'
    let $elem = jQuery(document.createElement(containername))

    const this_payload = this.payload
    const this_args = this.args
    $elem.on("click", this.createShadowWrapper(() => {
      setup.runSugarCubeCommand(this_payload[0].contents)

      // <<foclink>> with only one parameter does not switch passage
      if (this_args.length == 1) return

      State.variables.gOldPassage = State.variables.gPassage
      State.variables.gPassage = this_args[1]

      reload(/* passage switch = */ false, /* scroll top = */ State.variables.gPassage != State.variables.gOldPassage)
    }))

    $elem.wiki(this.args[0])

    $elem.appendTo(this.output)
  }
})

