// @ts-nocheck

/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.injury = function(unit) {
  if (!State.variables.hospital.isInjured(unit)) return null

  const duration = State.variables.hospital.getInjury(unit)

  const tooltip = `Injured for ${duration} week${duration > 1 ? 's' : ''}`

  // due to legacy code, don't make this into multiple lines. Otherwise sugarcube will put <br/>
  return html`<span data-tooltip="${tooltip}" class="injurycard">${setup.repImgIcon(setup.Unit.INJURY_IMAGE_URL)} ${duration}</span>`
}

