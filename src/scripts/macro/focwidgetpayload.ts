// @ts-nocheck

/**
 * Same as "focwidget", but the widget it generates takes a payload,
 * which can be accessed by $args.payload
 *
 * (Based on SugarCube's "widget" macro code)
 */

Macro.add('focwidgetpayload', {
  tags : null,

  handler() {
    if (this.args.length === 0) {
      return this.error('no widget name specified')
    }

    const widgetName = this.args[0]

    if (Macro.has(widgetName)) {
      if (!Macro.get(widgetName).isWidget) {
        return this.error(`cannot clobber existing macro "${widgetName}"`)
      }

      // Delete the existing widget.
      Macro.delete(widgetName)
    }

    try {
      Macro.add(widgetName, {
        tags: null,
        isWidget : true,
        handler  : (function (contents) {
          return function () {
            let argsCache

            try {
              // Cache the existing value of the `$args` variable, if necessary.
              if (State.variables.hasOwnProperty('args')) {
                argsCache = State.variables.args
              }

              // Set up the widget `$args` variable and add a shadow.
              State.variables.args = [...this.args]
              State.variables.args.raw = this.args.raw
              State.variables.args.full = this.args.full
              State.variables.args.payload = this.payload[0].contents
              this.addShadow('$args')

              // Set up the error trapping variables.
              const resFrag = document.createDocumentFragment()

              // Wikify the widget contents.
              new Wikifier(resFrag, contents)
              this.output.appendChild(resFrag)
            }
            catch (ex) {
              return this.error(`cannot execute widget: ${ex.message}`)
            }
            finally {
              // Revert the `$args` variable shadowing.
              if (typeof argsCache !== 'undefined') {
                State.variables.args = argsCache
              }
              else {
                delete State.variables.args
              }
            }
          }
        })(this.payload[0].contents)
      })

      // Custom debug view setup.
      //if (Config.debug) {
        //this.debugView.modes({ hidden : true })
      //}
    }
    catch (ex) {
      return this.error(`cannot create widget macro "${widgetName}": ${ex.message}`)
    }
  }
})