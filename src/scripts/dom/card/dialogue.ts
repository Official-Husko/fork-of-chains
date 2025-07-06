// @ts-nocheck

/**
 * Renders a unit saying a dialogue.
 * 
 * @param {{
 *   unit: setup.Unit
 *   dialogue: string
 *   position?: "left" | "right"
 *   content_image?: string
 * }} args
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.dialogue = function ({
  unit,
  dialogue,
  position,
  content_image,
}) {
  if (!position) {
    position = 'left'
  }

  const fragments = []

  let image_object = null
  if (content_image) {
    image_object = setup.ContentImage.getImageObjectIfAny(content_image)
  }
  if (!image_object) {
    image_object = setup.UnitImage.getImageObject(unit.getImage())
  }

  fragments.push(setup.DOM.create(
    'div',
    {
      class: `dialogue-card-unit dialogue-card-unit-${position}`,
    },
    setup.DOM.Util.onEvent(
      'click',
      setup.DOM.Util.Image.load({ image_name: image_object.path }),
      () => {
        if (content_image) {
          setup.Dialogs.openImage(image_object, image_object.info.title ?? 'Unknown Title')
        } else {
          setup.Dialogs.openUnitImage(unit)
        }
      },
    )
  ))

  fragments.push(setup.DOM.create(
    'div',
    {},
    html`${unit.repLong()}:`
  ))
  fragments.push(setup.DOM.create(
    'div',
    {
      class: `dialogue-card-text dialogue-card-text-${unit.getGender().key} dialogue-card-text-${position}`,
    },
    html`<div>"${twee`${setup.DevToolHelper.stripNewLine(dialogue.trim())}`}"</div>`,
  ))

  return setup.DOM.create('div', { class: 'dialogue-card-container' }, fragments)
}

