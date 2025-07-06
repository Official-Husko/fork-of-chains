// @ts-nocheck

import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { getRosterListMenuItems } from "../roster/rosterlist"
import { domCardNameBold } from "../util/cardnamerep"

/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.skillFocus = function (unit) {
  const focuses = unit.getSkillFocuses(State.variables.settings.unsortedskills)
  return setup.DOM.create('span', {}, focuses.map(skill => skill.rep()))
}


/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.leave = function (unit) {
  if (!State.variables.leave.isOnLeave(unit)) return null
  const duration_unknown = State.variables.leave.isLeaveDurationUnknown(unit)
  return html`
    ${setup.DOM.PronounYou.They(unit)} ${State.variables.leave.getLeaveReason(unit)}.
    ${duration_unknown ? '' : `(${State.variables.leave.getRemainingLeaveDuration(unit)} wk left)`}
  `
}


/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
function unitNameFragment(unit) {
  const fragments = []

  fragments.push(html`
      ${unit.repBusyState(/* show duty icon = */ true)}
      ${setup.DOM.Card.job(unit.getJob(), /* hide actions = */ true)}
      <span data-tooltip="Full name: <b>${setup.escapeJsString(unit.getFullName())}</b>">
        ${domCardNameBold(unit)}
      </span>
    `)

  const party = unit.getParty()
  if (party) {
    fragments.push(html`
        of ${party.rep()}
      `)
  }

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.Unit} unit
 * @returns {JQLite[]}
 */
function unitNameActionMenus(unit) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: unitNameFragment(unit),
  }))

  if (unit.isYou()) {
    menus.push(menuItemText({
      text: `This is you`
    }))
  }

  const title_help = `This is the unit's current title, which is determined mostly by their traits or skills. As the unit improves over time, their title may also change. This title is purely cosmetics.`
  if (unit.isRetired()) {
    menus.push(menuItemText({
      text: html`${unit.getLiving().rep()} (ex-${unit.getTitle()})`,
    }))
  } else {
    let focus = html``
    if (unit.isSlaver()) {
      focus = html`${setup.DOM.Card.skillFocus(unit)} `
    }

    let lv_text = null
    if (unit.isSlaver()) {
      lv_text = html`
          <span data-tooltip="Wage: <<money ${unit.getWage()}>>, Exp: ${unit.getExp()} / ${unit.getExpForNextLevel()}">
            ${setup.DOM.Util.level(unit.getLevel())}
          </span>
        `
    } else if (!unit.isSlaveOrInSlaveMarket()) {
      lv_text = setup.DOM.Util.level(unit.getLevel())
    }

    menus.push(menuItemText({
      text: html`<span data-tooltip="${title_help}">${focus}${lv_text}${unit.getTitle()}</span>`
    }))
  }

  menus.push(menuItemAction({
    text: html`${setup.DOM.Util.money(unit.getSlaveValue())}`,
    tooltip: `This is the unit's value. Click for more information`,
    is_no_close: true,
    callback: () => {
      setup.Dialogs.open({
        title: "Unit value",
        content: setup.DOM.Card.unitvalue(unit, /* hide actions = */ true),
      })
    }
  }))

  if (State.variables.gMenuVisible) {
    menus.push(menuItemExtras({
      children: getRosterListMenuItems({ unit: unit, as_extras_only: true })
    }))
  }

  return menus
}



/**
 * 
 * @param {setup.Unit} unit 
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.unit = function (unit, hide_actions) {
  const now_fragments = []

  now_fragments.push(html`
  <span class='unitimage'>
    ${setup.DOM.Util.onEvent(
    'click',
    setup.DOM.Util.Image.load({ image_name: unit.getImage(), fallback: setup.UnitImage.DEFAULT_IMAGE.path }),
    () => {
      setup.Dialogs.openUnitImage(unit)
    },
  )}
  </span>
  `)

  now_fragments.push(setup.DOM.Util.async(() => {
    const fragments = []

    fragments.push(setup.DOM.Util.menuItemToolbar(unitNameActionMenus(unit)))

    /* Titles */
    {
      const titles = SugarCube.State.variables.titlelist.getAssignedTitles(unit)
      const title_fragments = titles.map(title => html`${title.rep()}`)

      const all_titles = SugarCube.State.variables.titlelist.getAllTitles(unit)
      if (all_titles.length > titles.length) {
        title_fragments.push(html`
          ${setup.DOM.Util.message(
          `(+${all_titles.length - titles.length})`,
          () => {
            return html`
                <div class='helpcard'>
                  ${setup.Text.replaceUnitMacros(
              `a|Rep also a|have the following titles, but these titles are inactive`,
              { a: unit }
            )}
                  ${setup.DOM.Util.help(
              html`
                      A unit can only have at most three active titles.
                      Active titles will grant their skill bonuses to the unit,
                      while inactive titles will not. You can change the set of active titles
                      from the Slaver or Slave menu.
                    `
            )}:
                  ${all_titles.filter(title => !titles.includes(title)).map(title => title.rep())}
                </div>
              `
          }
        )}
        `)
      }

      fragments.push(setup.DOM.create(
        'div',
        {},
        title_fragments
      ))
    }

    /* Traits */
    {
      let traits = unit.getTraits()
      if (State.variables.settings.hideskintraits) {
        traits = traits.filter(trait => !trait.getTags().includes('skin'))
      }
      const trait_fragments = traits.map(trait => html`${trait.rep()}`)

      // extra traits
      const extra_traits = unit.getExtraTraits()
      if (extra_traits.length) {
        trait_fragments.push(html`
          + ${extra_traits.map(trait => html`${trait.rep()}`)}
          ${setup.DOM.Util.help(
          html`
              These are extra traits that the unit possess.
              While these traits will affect the unit's skills and the critical/disaster
              traits on missions, the units themselves are ${setup.DOM.Text.danger('not')}
              counted as having these traits for satisfying requirements or for story purposes.
            `
        )}
        `)
      }

      fragments.push(setup.DOM.create(
        'div',
        {},
        trait_fragments
      ))
    }

    { /* skills */
      if (!unit.isSlaveOrInSlaveMarket()) {
        const skill_fragments = []
        skill_fragments.push(html`
          ${setup.SkillHelper.explainSkillsWithAdditives(unit)}
        `)
        skill_fragments.push(
          setup.DOM.Util.help(html`
            These are the unit's skills. It is displayed as [base_amount] + [amount from modifiers].
            For example, a unit can have 48${setup.DOM.Text.successlite("+10")} ${setup.skill.combat.rep()},
            which means that the unit has 48 base ${setup.skill.combat.rep()}, while their traits,
            equipments, and modifiers add another
            10 ${setup.skill.combat.rep()} on top of it, for a total of 58 ${setup.skill.combat.rep()}.
          `)
        )
        fragments.push(setup.DOM.create('div', {}, skill_fragments))
      }
    }

    { /* Miscelianous */

      /**
       * This code is slightly duplicated with setup.DOM.Card.tooltipunitstatus, because here we want it inline,
       * while there we want it verbose.
       */

      const market = unit.getMarket()
      const misc_fragments = []

      if (unit.getContact()) {
        misc_fragments.push(html`${unit.getContact().rep()}`)
      }
      if (unit.getDuty()) {
        misc_fragments.push(html`${unit.getDuty().rep()}`)
      }
      if (unit.getEquipmentSet()) {
        misc_fragments.push(html`${unit.getEquipmentSet().rep()}`)
      }
      if (unit.getQuest()) {
        const quest = unit.getQuest()
        let questrep = quest.rep()
        if (quest.getTeam()) {
          questrep = `${questrep} (${quest.getRemainingWeeks()} wk left)`
        }
        misc_fragments.push(questrep)
      }
      if (unit.getOpportunity()) {
        misc_fragments.push(html`${unit.getOpportunity().rep()}`)
      }
      if (market) {
        misc_fragments.push(market.rep())
      }
      if (State.variables.leave.isOnLeave(unit)) {
        misc_fragments.push(setup.DOM.Card.leave(unit))
      }

      if (unit.isSlaver() && State.variables.fort.player.isHasBuilding('moraleoffice')) {
        const bestfriend = State.variables.friendship.getBestFriend(unit)
        const tooltip = `<<friendcard ${unit.key}>>`
        let friendship_fragment
        if (bestfriend) {
          const friendship = State.variables.friendship.getFriendship(unit, bestfriend)
          friendship_fragment = html`
            ${setup.DOM.Util.name(bestfriend)}
            ${unit.getLover() == bestfriend ?
              setup.Friendship.loversIcon() :
              (setup.DOM.Util.friendship(friendship))}
          `
        } else {
          friendship_fragment = `No friend`
        }
        misc_fragments.push(html`
          <span data-tooltip="${tooltip}">
            ${friendship_fragment}
          </span>
        `)
      }

      const misc_fragments_with_separator = []
      for (const fragment of misc_fragments) {
        if (misc_fragments_with_separator.length) {
          misc_fragments_with_separator.push(html` | `)
        }
        misc_fragments_with_separator.push(fragment)
      }

      fragments.push(setup.DOM.create(
        'div',
        {},
        misc_fragments_with_separator
      ))
    }
    return setup.DOM.create('span', {}, fragments)
  }, /* transition = */ true))

  let divclass = `${unit.getJob().key}card ${unit.isMale() ? 'male-card' : 'female-card'}`
  return setup.DOM.create('div', { class: divclass }, now_fragments)
}
