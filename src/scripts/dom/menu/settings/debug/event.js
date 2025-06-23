import { renderDescription } from "../../../card/quest"
import { IMPORTABLE } from "../settings"
import { debug_do_one_finalize, debug_do_one_title, debug_frontpage_title } from "./common"
import { is_scoutable_link, scoutable_content } from "./quest"

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.event = function () {
  const fragments = []
  fragments.push(
    debug_frontpage_title('event', 'EventDebugAll'),
  )

  fragments.push(setup.DOM.Util.filterAll({
    menu: 'event',
    filter_objects: Object.values(setup.event),
    display_callback: (template) => html`
      <div>
        ${setup.DOM.Util.namebold(template)}
        ${is_scoutable_link(template)}
        ${setup.DOM.Nav.link(
      `(test this)`,
      () => {
        // @ts-ignore
        State.variables.qDebugEventTemplate_key = template.key
        setup.runSugarCubeCommand(`<<goto EventDebugDo>>`)
      },
    )}
    </div>`
  }))

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @param {setup.Event} template
 * @param {boolean} [is_debug_all]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.event_debug_one = function (template, is_debug_all) {
  const event = template.debugMakeInstance(is_debug_all)

  const fragments = []
  fragments.push(
    debug_do_one_title(event, is_debug_all)
  )
  fragments.push(scoutable_content(template))

  fragments.push(html`
    <div class='textcard eventcard card'>
      ${renderDescription(event, event.getEvent().getPassage())}
    </div>
  `)

  try {
    State.variables.eventpool._finalizeEvent(event)
  } catch (ex) {
    fragments.push(setup.DOM.Util.exception(ex))
  }

  fragments.push(
    debug_do_one_finalize(event, is_debug_all)
  )

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.event_debug_all = function () {
  const fragments = []
  for (const template of Object.values(setup.event)) {
    try {
      fragments.push(setup.DOM.Menu.Settings.Debug.event_debug_one(template, /* is debug all = */ true))
    } catch (ex) {
      fragments.push(setup.DOM.Util.exception(ex))
    }
    fragments.push(setup.DOM.Card.notifications())
  }
  return setup.DOM.create('div', {}, fragments)
}
