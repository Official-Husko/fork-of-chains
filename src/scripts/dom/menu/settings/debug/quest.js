import { renderDescription } from "../../../card/quest"
import { IMPORTABLE } from "../settings"
import { debug_do_one_finalize, debug_do_one_title, debug_frontpage_title } from "./common"

/**
 * @param {setup.QuestTemplate | setup.Event | setup.OpportunityTemplate} template 
 * @returns {setup.DOM.Node}
 */
export function scoutable_content(template) {
  const reason = []
  if (State.variables.settings.isBanned(template.getTags())) {
    reason.push(html`<div>
        Contains some ${setup.DOM.Text.danger('banned')} fetish tags.
      </div>`)
  }
  let prereq
  if (template instanceof setup.Event) {
    prereq = template.getRequirements()
  } else {
    prereq = template.getPrerequisites()
  }
  for (const req of prereq) {
    if (!req.isOk(template)) {
      reason.push(html`<div>
          Restriction ${setup.DOM.Text.danger('missing')}: ${req.explain(template)}
        </div>`)
    } else {
      reason.push(html`<div>
          Restriction satisfied: ${req.explain(template)}
        </div>`)
    }
  }
  if (State.variables.calendar.isOnCooldown(template)) {
    reason.push(html`
        <div>
          ${setup.DOM.Text.danger('On cooldown')} for ${State.variables.calendar.getCooldown(template)} more weeks.
        </div>
      `)
  }
  if (template.isCanGenerate()) {
    reason.push(html`
        <div>
          ${setup.DOM.Text.success('YES')}
        </div>
      `)
  } else {
    reason.push(html`
        <div>
          ${setup.DOM.Text.danger('NO')}
        </div>
      `)
  }
  return setup.DOM.create('div', {}, reason)
}

/**
 * @param {setup.QuestTemplate | setup.OpportunityTemplate | setup.Event} template 
 * @returns {setup.DOM.Node}
 */
export function is_scoutable_link(template) {
  return setup.DOM.Util.message(
    (template instanceof setup.Event) ? "(is trigger-able)" : "(is scout-able)", () => scoutable_content(template),
  )
}


/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.quest = function () {
  const fragments = []
  fragments.push(
    debug_frontpage_title('quest', 'QuestDebugAll'),
  )

  fragments.push(setup.DOM.Util.filterAll({
    menu: 'questtemplate',
    filter_objects: Object.values(setup.questtemplate),
    display_callback: (template) => {
      const inner = []
      inner.push(html`
        ${setup.DOM.Util.namebold(template)}
        ${is_scoutable_link(template)}
        ${setup.DOM.Nav.link(
        `(make instance)`,
        () => {
          const result = setup.QuestPool.instantiateQuest(template)
          if (!result) {
            alert('No valid instantiation found')
          } else {
            State.variables.gPassage = 'QuestHub'
            setup.runSugarCubeCommand(`<<goto "QuestHub">>`)
          }
        })}
        ${setup.DOM.Nav.link(
          `(force make instance)`,
          () => {
            const quest = template.debugMakeInstance()
            State.variables.company.player.addQuest(quest)
            State.variables.gPassage = 'QuestHub'
            setup.runSugarCubeCommand(`<<goto "QuestHub">>`)
          })}
        ${setup.DOM.Nav.link(
            `(test this)`,
            () => {
              // @ts-ignore
              State.variables.qDebugQuestTemplate_key = template.key
              // @ts-ignore
              delete State.variables.qDebugQuestResult
              setup.runSugarCubeCommand(`<<goto QuestDebugDo>>`)
            },
          )}

        ${setup.DOM.Nav.link(
            `(test description)`,
            () => {
              // @ts-ignore
              State.variables.qDebugQuestTemplate_key = template.key
              setup.runSugarCubeCommand(`<<goto QuestDebugDoDescription>>`)
            },
          )}
      `)

      for (const outcome of setup.QUEST_OUTCOMES) {
        inner.push(html`
        ${setup.DOM.Nav.link(
          `(test ${outcome})`,
          () => {
            // @ts-ignore
            State.variables.qDebugQuestTemplate_key = template.key
            // @ts-ignore
            State.variables.qDebugQuestResult = outcome
            setup.runSugarCubeCommand(`<<goto QuestDebugDo>>`)
          },
        )}
        `)
      }

      return setup.DOM.create('div', {}, inner)
    }
  }))

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @param {setup.QuestTemplate} template
 * @param {string} outcome
 * @param {boolean} [is_debug_all]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.quest_debug_outcome = function (template, outcome, is_debug_all) {
  const quest = template.debugMakeFilledInstance(outcome, is_debug_all)

  const fragments = []
  fragments.push(
    debug_do_one_title(quest, is_debug_all)
  )

  fragments.push(html`<div> <b>${outcome}</b></div>`)

  const cardclass = quest.getTemplate().getCardClass()
  const classname = `textcard questcard${quest.outcome} ${cardclass} card`

  fragments.push(html`
      <div class='${classname}'>
      ${renderDescription(quest, quest.getOutcomeObject()[0])
    }
    </div>
    `)

  try {
    quest.finalize()
  } catch (ex) {
    fragments.push(setup.DOM.Util.exception(ex))
  }
  fragments.push(setup.DOM.Card.notifications())

  fragments.push(
    debug_do_one_finalize(quest, is_debug_all)
  )

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.QuestTemplate} template
 * @param {boolean} [is_debug_all]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.quest_debug_description = function (template, is_debug_all) {
  const quest = template.debugMakeInstance(is_debug_all)

  const fragments = []
  fragments.push(
    debug_do_one_title(quest, is_debug_all)
  )

  const cardclass = quest.getTemplate().getCardClass()
  const classname = `textcard ${cardclass} card`

  fragments.push(html`
    <div class='${classname}'>
      ${renderDescription(quest, quest.getDescriptionPassage())}
    </div>
  `)

  fragments.push(
    debug_do_one_finalize(quest, is_debug_all)
  )

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.QuestTemplate} template
 * @param {boolean} [is_debug_all]
 * @param {string} [forced_outcome]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.quest_debug_one = function (template, is_debug_all, forced_outcome) {
  const fragments = [
    setup.DOM.Menu.Settings.Debug.quest_debug_description(template, is_debug_all)
  ]
  fragments.push(scoutable_content(template))
  for (const outcome of setup.QUEST_OUTCOMES) {
    if (forced_outcome && outcome != forced_outcome) continue
    fragments.push(setup.DOM.Menu.Settings.Debug.quest_debug_outcome(template, outcome, is_debug_all))
  }

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.quest_debug_all = function () {
  const fragments = []
  for (const template of Object.values(setup.questtemplate)) {
    try {
      fragments.push(setup.DOM.Menu.Settings.Debug.quest_debug_one(template, /* is debug all = */ true))
    } catch (ex) {
      fragments.push(setup.DOM.Util.exception(ex))
    }
    fragments.push(setup.DOM.Card.notifications())
  }
  return setup.DOM.create('div', {}, fragments)
}
