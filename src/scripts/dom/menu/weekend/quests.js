import { renderDescription } from "../../card/quest"

/**
 * @returns {{node: setup.DOM.Node, notifications: string[]}}
 */
export function showEndweekQuests() {
  const fragments = []
  const notifications = []
  while (true) {
    const quest = State.variables.company.player.getFinishedQuestIfAny()
    if (!quest) break
    const display_object = displayEndweekQuest(quest)
    fragments.push(display_object.node)
    notifications.push(...display_object.notifications)
  }
  return {
    node: setup.DOM.create('div', {}, fragments),
    notifications: notifications,
  }
}

/**
 * @param {setup.QuestInstance} quest 
 * @returns {{node: setup.DOM.Node, notifications: string[]}}
 */
function displayEndweekQuest(quest) {
  const outer = []

  let fragments = []
  quest.rollOutcome()
  fragments.push(html`
    ${quest.getTemplate().getDifficulty().rep()} ${setup.DOM.Util.namebold(quest)}:
    ${setup.DOM.Util.outcome(quest.getOutcome())}
  `)
  if (quest.getOutcome() == 'failure') {
    fragments.push(setup.DOM.Util.help(
      html`
        Failure can be beneficial. Your slavers learn much better from failures, and as a result
        they gain a large amount of experience from failures, which helps them level up faster.
      `
    ))
  } else if (quest.getOutcome() == 'disaster') {
    fragments.push(setup.DOM.Util.help(
      html`
        While disaster outcomes usually entail some bad consequences, it also have its benefits.
        Slavers learn a huge amount from life-threatening experiences, and as a result they gain
        a massive amount of experience from disaster results.
        What does not kill you makes you stronger, after all.
      `
    ))
  }
  fragments.push(html`
    by ${quest.getTeam().rep()}.
  `)

  const outcome_passage = quest.getOutcomeObject()[0]
  const div_id = `endweek_quest_${quest.key}`

  const rendered = renderDescription(quest, outcome_passage)

  quest.finalize()
  const notifications = State.variables.notification.popAll()

  // draw the renderer. A bit special because we want to render it and hide it from the player.

  // first show the toggle button
  fragments.push(html`
    ${setup.DOM.Nav.link(
    `(toggle full quest results)`,
    () => {
      $(`#${div_id}`).toggleClass('hiddendiv')
    }
  )}
  `)

  outer.push(setup.DOM.create('div', {}, fragments))

  fragments = []

  let classes = `card textcard questcard${quest.getOutcome()}`
  if (State.variables.settings.hidequestdescription) {
    classes += ` hiddendiv`
  }
  classes += ` ${quest.getTemplate().getCardClass()}`

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
