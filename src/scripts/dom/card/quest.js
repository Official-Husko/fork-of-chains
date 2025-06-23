import { ContentTemplate } from "../../classes/content/ContentTemplate"
import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardNameBold, domCardRep } from "../util/cardnamerep"

/**
 * Prints the quest author
 * 
 * @param {ContentTemplate} quest_template 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.questauthor = function (quest_template) {
  if (quest_template.getAuthor().name) {
    return setup.DOM.Card.author(quest_template.getAuthor())
  }
  return null
}


/**
 * @param {setup.QuestInstance} quest 
 * @returns {string}
 */
function getCompactDivId(quest) {
  return `questhubquestdiv${quest.key}`
}


/**
 * @param {Array} actor_obj
 * @returns {setup.DOM.Node}
 */
function getQuestUnitRoleFragment(actor_obj) {
  const criteria = actor_obj[1].criteria
  const offsetmod = actor_obj[1].offsetmod
  const unit = actor_obj[2]

  return html`
    <div class='actorcard'>
      ${setup.DOM.Util.namebold(criteria)}
      ${offsetmod == 1 ? '' : `(Important: ${offsetmod}x)`}
      ${setup.DOM.Card.criteria(criteria, unit)}
    </div>
  `
}

function getQuestUnitRolesFragment(quest) {
  return setup.DOM.create(
    'span',
    {},
    Object.values(quest.getUnitCriteriasList()).map(actor_obj => getQuestUnitRoleFragment(actor_obj))
  )
}

/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
function getQuestTitleFragment(quest) {
  const template = quest.getTemplate()
  return html`
    ${setup.TagHelper.getTagsRep('quest', template.getTags())}
    ${State.variables.statistics.isHasSuccess(template) ?
      '' :
      setup.DOM.Text.successlite('NEW')}
    ${template.getDifficulty().rep()}
    ${domCardRep(quest)}
  `
}


/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
export function getQuestExpiresFragment(quest) {
  const team = quest.getTeam()
  const template = quest.getTemplate()
  if (team) {
    return html`
      ${quest.getRemainingWeeks()} wks left
    `
  }

  let expires
  if (template.getDeadlineWeeks() < setup.INFINITY) expires = quest.getWeeksUntilExpired()

  return html`
    <span data-tooltip="Quest duration">
      ${template.getWeeks()} wks
    </span>
    ${template.getDeadlineWeeks() >= setup.INFINITY ?
      '' :
      html`
        | <span data-tooltip="Quest expiration">
          ${expires == 1 ? setup.DOM.Text.danger(expires) : `${expires}`}
          wks left
        </span>
      `
    }
  `
}


/**
 * @param {setup.QuestInstance} quest
 * @param {boolean} hide_actions 
 * @param {boolean} [show_open_button]
 * @param {boolean} [show_hide_button]
 * @returns {JQLite[]}
 */
function questNameActionMenu(quest, hide_actions, show_open_button, show_hide_button) {
  const template = quest.getTemplate()

  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  if (show_hide_button) {
    menus.push(menuItemAction({
      text: `Close`,
      callback: () => {
        const selector = `#${getCompactDivId(quest)} `
        setup.DOM.Helper.replace(selector,
          questCardCompactInternal(quest, hide_actions)
        )
      },
    }))
  }

  if (show_open_button) {
    menus.push(menuItemAction({
      text: `View`,
      callback: () => {
        const selector = `#${getCompactDivId(quest)}`
        setup.DOM.Helper.replace(
          selector,
          setup.DOM.Card.quest(quest, hide_actions)
        )
      },
    }))
  }

  menus.push(menuItemTitle({
    text: getQuestTitleFragment(quest),
  }))

  menus.push(menuItemAction({
    text: html`${template.getSkillSummary()} <span data-tooltip="Number of units">(${Object.values(template.getUnitCriterias()).length})</span>`,
    callback: () => {
      setup.Dialogs.open({
        title: `Full quest roles`,
        content: html`
          <div>Quest roles for ${quest.rep()}:</div>
          <div>${getQuestUnitRolesFragment(quest)}</div>
        `
      }).then(() => {
        setup.DOM.Nav.goto()
      })
    },
  }))

  // cost
  const costs = template.getCosts()
  if (costs.length) {
    menus.push(menuItemText({
      text: html`Costs: ${setup.DOM.Card.cost(costs, quest)}`,
    }))
  }

  menus.push(menuItemText({
    text: getQuestExpiresFragment(quest)
  }))

  if (State.variables.gDebug) {
    extras.push(menuItemDanger({
      text: 'Debug remove',
      callback: () => {
        quest.cleanup()
        State.variables.company.player.archiveQuest(quest)
        setup.DOM.Nav.goto()
      }
    }))
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras
    }))
  }

  return menus
}



/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
function getQuestToolbar(quest) {
  if (quest.isCanChangeTeam()) {
    if (!quest.getTeam() && !State.variables.company.player.isCanDeployTeam()) {
      return html`
    <div>
    You cannot send more teams concurrently on a quest
        ${setup.DOM.Util.help(
        html`You are limited to sending at most
          ${setup.DOM.Text.success(State.variables.company.player.getMaxActiveTeams())}
          teams concurrently on a quest.
          You can increase this limit by building and upgrading the
          ${setup.buildingtemplate.missioncontrol.rep()}.`
      )
        }
        </div>
      `
    } else {
      const menu = setup.QuestAssignHelper.getAssignMenu(quest)
      return setup.DOM.Util.menuItemToolbar(menu)
    }
  } else {
    return html`
      <div>
      ${setup.QuestDifficulty.explainChance(quest.getScoreObj())}
      </div>
      `
  }
}

/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
function getQuestExtraActorsFragment(quest) {
  const actors = Object.values(quest.getExtraActors()).filter(unit => unit.isYourCompany())
  if (!actors.length) return null
  return setup.DOM.create(
    'div',
    {},
    [html`Involved: `].concat(actors.map(unit => unit.repLong())),
  )
}


/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
function questCardCompactInternal(quest, hide_actions) {
  const is_short = (State.variables.menufilter.get('quest', 'display') == 'short')
  const team = quest.getTeam()
  const template = quest.getTemplate()

  let divclass = ''
  if (is_short) {
    divclass = template.getCardClass()
  }

  const fragments = []
  fragments.push(
    setup.DOM.Util.menuItemToolbar(
      questNameActionMenu(
        quest,
        hide_actions,
        /* show open button = */ true,
      )
    )
  )

  if (is_short) {
    fragments.push(
      getQuestToolbar(quest)
    )
  }

  return setup.DOM.create(
    `div`,
    { class: divclass },
    fragments,
  )
}


/**
 * 
 * @param {setup.QuestInstance | setup.OpportunityInstance | setup.EventInstance | setup.ActivityInstance | setup.InteractionInstance} quest 
 * @param {string} passage 
 * @returns {setup.DOM.Node}
 */
export function renderDescription(quest, passage) {
  setup.DOM.Helper.loadQuestVars(quest)
  State.temporary.quest = quest
  State.temporary.outcome_passage = passage
  const rendered = setup.DOM.Util.include_replace('WeekendRenderQuestEvent')
  delete State.temporary.quest
  delete State.temporary.outcome_passage
  return html`
    <div class='description-render'>
      ${rendered}
      ${setup.DOM.Card.questauthor(quest.getTemplate())}
    </div>
  `
}

setup.renderDescription = renderDescription


/**
 * @param {setup.QuestInstance} quest 
 * @returns {setup.DOM.Node}
 */
function getQuestDescriptionFragment(quest) {
  const template = quest.getTemplate()
  const description_display = State.variables.menufilter.get('quest', 'text')
  if (description_display == 'hidden' ||
    (description_display == 'new' && State.variables.statistics.isHasSuccess(template))) {
    return html`
  ${setup.DOM.Util.message(
      '(description)',
      () => renderDescription(quest, quest.getDescriptionPassage()))}`
  } else {
    return renderDescription(quest, quest.getDescriptionPassage())
  }
}


function getQuestCardAsyncFragment(quest, hide_actions) {
  const fragments = []
  const template = quest.getTemplate()
  const team = quest.getTeam()
  const criterias = quest.getUnitCriteriasList()

  if (!hide_actions) {
    fragments.push(getQuestToolbar(quest))
  }

  // team
  if (team) {
    for (const actorobj of Object.values(criterias)) {
      const criteria = actorobj[1].criteria
      const unit = actorobj[2]
      fragments.push(html`
    <div>
    ${setup.DOM.Util.namebold(criteria)}
  ${setup.DOM.Util.message(
        '(+)',
        () => {
          return getQuestUnitRoleFragment(actorobj)
        }
      )
        }:
  ${unit.repLong()} ${criteria.repActor(unit, template.getDifficulty())}
        </div>
    `)
    }
  }

  // description
  if (!State.variables.devtooltype) {
    fragments.push(html`
    <div class='textcard'>
    ${getQuestDescriptionFragment(quest)}
      </div>
    `)
  }

  return setup.DOM.create(
    'span',
    {},
    fragments
  )
}


/**
 * 
 * @param {setup.QuestInstance} quest
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.questcompact = function (quest, hide_actions) {
  return html`
    <div id="${getCompactDivId(quest)}">
      ${questCardCompactInternal(quest, hide_actions)}
    </div>
    `
}


/**
 * 
 * @param {setup.QuestInstance} quest
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.quest = function (quest, hide_actions) {
  const template = quest.getTemplate()

  const fragments = []

  const show_close_button = (!hide_actions && ['short', 'compact'].includes(State.variables.menufilter.get('quest', 'display')))

  fragments.push(
    setup.DOM.Util.menuItemToolbar(questNameActionMenu(
      quest,
      hide_actions,
      /* show open button = */ false,
      /* show close button = */ show_close_button,
    ))
  )

  // units for trainings etc
  fragments.push(getQuestExtraActorsFragment(quest))

  // async loading
  fragments.push(setup.DOM.Util.async(
    () => { return getQuestCardAsyncFragment(quest, hide_actions) }
  ))

  // debug actions
  if (State.variables.gDebug) {
    fragments.push(html`
    <div>
    ${setup.DOM.Util.message(
      '(DEBUG: show actors)',
      () => {
        const actors = quest.getActorsList()
        // @ts-ignore
        return actors.map(actor => `<div>${actor[0]}: ${actor[1].repLong()}</div>`)
      }
    )
      }
      </div>
    `)
  }

  const divclass = `${template.getCardClass()} card`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}
