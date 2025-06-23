
/**
 * Listen on the specified even for its first element child,
 * and runs a certain callback when that event is triggered
 * Example:
 *   <<onevent 'change' '<<some_callback>>'>><<textbox ...>><</onchanged>>
 * 
 * If the target element has a 'value' field, will set the temporary
 * variable '_value' to the current value
 */ 

Macro.add('onevent', {
  //isAsync : true,
  tags: ['onevent-callback'],

  handler() {
    const numchildrenbefore = this.output.children.length

    new Wikifier(this.output, this.payload[0].contents.trim())

    if (this.output.children.length - numchildrenbefore > 1)
      throw new Error(`<<onevent>> macro expects a single element as its child`)

    const target = this.output.children[numchildrenbefore]
    const event_type = this.args[0]
    const callback = this.payload.length > 1 ? this.payload[1].contents : null
    
    if (event_type && callback && target) {
      $(target).on(event_type + '.refreshable', this.createShadowWrapper(function(ev) {
        // @ts-ignore
        if (ev.currentTarget && 'value' in ev.currentTarget) {
          // @ts-ignore
          State.temporary.value = ev.currentTarget.value
        }

        new Wikifier(null, callback)
      }))
    }
  }
})
