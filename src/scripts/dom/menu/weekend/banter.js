/**
 * @returns {setup.DOM.Node}
 */
export function showWeekendBanters() {
  const banters = []

  // perform the random banters
  for (const unit of State.variables.company.player.getUnits({ job: setup.job.slaver })) {
    const banter = setup.BanterHelper.doBanter(unit)

    // sometimes no banter is done, so check if a banter was actually done
    if (banter) {
      banters.push(banter)
    }
  }

  let return_value

  // show the banters if you have built the morale office
  if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.moraleoffice)) {
    const banter_div_id = 'endweek-banter-div'
    return_value = setup.DOM.createRefreshable(
      'div',
      { id: banter_div_id },
      () => {
        const fragments = []
        // @ts-ignore
        const show_banters = !setup.globalsettings.endweek_hide_banters

        fragments.push(html`
          <div>
            ${setup.DOM.Nav.link(
          show_banters ? `Hide Banters` : `Show Banters`,
          () => {
            // @ts-ignore
            setup.globalsettings.endweek_hide_banters = !setup.globalsettings.endweek_hide_banters
            setup.DOM.refresh(`#${banter_div_id}`)
          }
        )}
          </div>
        `)

        if (show_banters && banters.length) {
          for (const banter of banters) {
            fragments.push(setup.DOM.create('div', {}, setup.DOM.Card.banter(banter)))
          }
          fragments.push(html`<hr/>`)
        }
        return setup.DOM.create('div', {}, fragments)
      },
    )
  } else {
    return_value = null
  }

  State.variables.friendship.advanceWeek()
  return return_value
}
