// @ts-nocheck

import { renderDescription } from "../../../card/quest"
import { IMPORTABLE } from "../settings"
import { debug_do_one_finalize, debug_do_one_title, debug_frontpage_title } from "./common"

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.interaction = function () {
  const fragments = []
  fragments.push(
    debug_frontpage_title('interaction', 'InteractionDebugAll'),
  )

  fragments.push(setup.DOM.Util.filterAll({
    menu: 'interaction',
    filter_objects: Object.values(setup.interaction),
    display_callback: (template) => html`
      <div>
        ${setup.DOM.Util.namebold(template)}
        ${setup.DOM.Nav.link(
      `(test this)`,
      () => {
        // @ts-ignore
        State.variables.qDebugInteractionTemplate_key = template.key
        setup.runSugarCubeCommand(`<<goto InteractionDebugDo>>`)
      },
    )}
    </div>`
  }))

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @param {setup.Interaction} template
 * @param {boolean} [is_debug_all]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.interaction_debug_one = function (template, is_debug_all) {
  const interaction = template.debugMakeInstance(is_debug_all)

  const fragments = []
  fragments.push(
    debug_do_one_title(interaction, is_debug_all)
  )

  fragments.push(html`
    <div class='textcard interactioncard card'>
      ${renderDescription(interaction, interaction.getInteraction().getPassage())}
    </div>
  `)

  try {
    interaction.applyRewards()
  } catch (ex) {
    fragments.push(setup.DOM.Util.exception(ex))
  }

  fragments.push(
    debug_do_one_finalize(interaction, is_debug_all)
  )

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.interaction_debug_all = function () {
  const fragments = []
  for (const template of Object.values(setup.interaction)) {
    try {
      fragments.push(setup.DOM.Menu.Settings.Debug.interaction_debug_one(template, /* is debug all = */ true))
    } catch (ex) {
      fragments.push(setup.DOM.Util.exception(ex))
    }
    fragments.push(setup.DOM.Card.notifications())
  }
  return setup.DOM.create('div', {}, fragments)
}
