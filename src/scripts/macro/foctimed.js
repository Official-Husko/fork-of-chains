// <<timed 0s t8n>>
//   like <<timed>>, but works for tooltips
//   if _foctimed_is_tooltip is set to true, will render immediately

Macro.add('foctimed', {
  tags: null,

  handler() {
    const contents = this.payload[0].contents
    const $elem = $(document.createElement('span'))

    let towiki = contents
    if (!State.temporary.foctimed_is_tooltip) {
      towiki = `<<timed ${this.args.raw}>>${contents}<</timed>>`
    }
    $elem.wiki(towiki)

    $elem.appendTo(this.output)
  }
})
