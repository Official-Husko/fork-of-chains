/**
 * <<dialogue $g.a>>
 * <<ugreetingshort $g.a>>, have time to chat?
 * <</dialogue>>
 */

Macro.add('dialogue', {
  tags: null,

  handler() {
    if (this.args.length === 0) {
      return this.error('no actor specified')
    }

    const actor = this.args[0]
    if (!(actor instanceof setup.Unit)) {
      return this.error(`First argument of <<dialogue>> must be a unit`)
    }

    const contents = this.payload[0].contents
    const elem = setup.DOM.Card.dialogue({
      unit: actor,
      dialogue: contents,
      content_image: this.args[1],
    })
    this.output.append(elem)
  }
})