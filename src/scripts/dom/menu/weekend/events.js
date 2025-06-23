import { renderDescription } from "../../card/quest"

/**
 * @returns {{node: setup.DOM.Node, notifications: string[]}}
 */
export function showEndweekEvents() {
  const fragments = []
  const notifications = []

  let event_count = 0
  while (true) {
    const event = State.variables.eventpool.getEventInstance()
    if (!event) break

    event_count += 1
    if (event_count >= 500) {
      console.log(`Error: too many quests generated. Last one: ${event.getName()}`)
      break
    }

    const display_object = displayEndweekEvent(event, event_count)
    fragments.push(display_object.node)
    notifications.push(...display_object.notifications)
  }
  return {
    node: setup.DOM.create('div', {}, fragments),
    notifications: notifications,
  }
}

/**
 * @param {setup.EventInstance} event
 * @param {number} event_index
 * @returns {{node: setup.DOM.Node, notifications: string[]}}
 */
function displayEndweekEvent(event, event_index) {
  const outer = []

  let fragments = []
  fragments.push(html`
    An event occurred: ${setup.DOM.Util.namebold(event)}
  `)

  const rendered = renderDescription(event, event.getEvent().getPassage())

  State.variables.eventpool._finalizeEvent(event)

  const notifications = State.variables.notification.popAll()

  // draw the renderer. A bit special because we want to render it and hide it from the player.

  // first show the toggle button

  const div_id = `endweek_event_${event_index}`

  fragments.push(html`
    ${setup.DOM.Nav.link(
    `(toggle full event results)`,
    () => {
      $(`#${div_id}`).toggleClass('hiddendiv')
    }
  )}
  `)

  outer.push(setup.DOM.create('div', {}, fragments))

  fragments = []

  let classes = `card textcard eventcard`
  if (State.variables.settings.hideeventdescription) {
    classes += ` hiddendiv`
  }

  fragments.push(html`
    <div>
      ${rendered}
    </div>
  `)
  if (notifications.length) {
    const notification_render = setup.DOM.Card.notifications(notifications)
    if (State.variables.settings.hidequestoutcome) {
      fragments.push(html`
        <div>
          ${setup.DOM.Util.message(
        `(Outcomes)`,
        notification_render,
      )}
        </div>
      `)
    } else {
      fragments.push(html`
        <div>
          ${notification_render}
        </div>
      `)
    }
  }

  outer.push(setup.DOM.create('div', { class: classes, id: div_id }, fragments))

  return {
    node: setup.DOM.create('div', {}, outer),
    notifications: notifications,
  }
}
