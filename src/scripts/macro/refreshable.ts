// @ts-nocheck

/**
 * Define a refreshable region, optionally adding raw HTML attributes to it
 *   <<refreshable>> ... <<refreshable>>
 *   <<refreshable [...html_attributes]>> ... <<refreshable>>
 * 
 *   Examples:
 *     <<refreshable>> ... <</refreshable>>
 *     <<refreshable id="my_id">> ... <<refreshable>>
 *     <<refreshable @some_attr="_myvar">> ... <<refreshable>>  (works like a regular HTML element)
 * 
 *  (note: this macro is added to the HTML document as a <div>, with the given attributes, as well as an extra
 *    "refreshable" CSS class that can be used in the <<refreshable-refresh>> target path, e.g. "< .refreshable")
 * 
 * 
 * Refresh a refreshable region:
 *   <<refreshable-refresh>>
 *   <<refreshable-refresh 'target_path'>>
 * 
 *   Examples:
 *     <<refreshable-refresh>>                  (refreshed its closest parent refreshable)
 *     <<refreshable-refresh '#some_id'>>       (refreshes a <<refreshable id="some_id">>)
 *     <<refreshable-refresh '<<.some_class'>>  (navigate to the parent of the parent, then find a node with that class under it)
 * 
 *   See setup.queryRelativeSelector for more info on target_path syntax
 */ 

Macro.add('refreshable', {
  //isAsync : true,
  tags: null,

  handler() {
    const wikifier = new Wikifier(null, `<div ${this.args.full}></div>`)

    const $elem = $(wikifier.output.firstElementChild)
    $elem.addClass("refreshable")

    const template = this.payload[0].contents
    if (template) {
      // store renderer function as jquery data associated to this element
      $elem.data("refreshable-renderer", this.createShadowWrapper(function() {
        $elem.empty()
        $elem.wiki(template)
      }))
      $elem.wiki(template) // do the first render
    }
    
    $elem.appendTo(this.output)
  }
})

Macro.add('refreshable-refresh', {
  handler() {
    let path = this.args[0]
    if (!path) {
      path = ".refreshable"
    }

    // @ts-ignore
    const base_element = this.parent?.output
    const target = setup.querySelectorRelative(base_element, path)
    if (!target)
      return
    
    const $target = $(target)
    const callback = $target.data("refreshable-renderer")
    if (callback)
      callback()
  }
})
