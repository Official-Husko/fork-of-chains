// @ts-nocheck


/**
 * Attach a DOM HTML element to output
 */
Macro.add('attach', {
  skipArgs: true,

  /** @this {SugarcubeMacroContext} */
  handler() {
    if (this.args.full.length === 0) {
      return this.error('no expression specified')
    }

    /** @type {setup.DOM.Attachable} */
    let node
    try {
      node = Scripting.evalJavaScript(this.args.full)
    } catch (ex) {
      console.error(`Bad evaluation of <<attach ${this.args.full}>>`, ex)
      return this.error(`bad evaluation: ${ex instanceof Error ? ex.message : ex}`)
    }

    // Custom debug view setup
    //if (Config.debug) {
    //  this.debugView.modes({ hidden: true })
    //}

    if (node) {
      this.output.append(setup.DOM.toDOM(node))
    }
  }
})
