import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { repFavor } from "../util/favor"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Company} company
 * @returns {setup.DOM.Node}
 */
function companyFavorStatusFragment(company) {
  if (company.isFavorActive()) {
    const favor = State.variables.favor.getFavor(company)
    let base
    if (favor >= setup.FAVOR_EFFECT_THRESHOLDS[2]) {
      base = setup.DOM.Text.success('[Ally]')
    } else if (favor >= setup.FAVOR_EFFECT_THRESHOLDS[1]) {
      base = setup.DOM.Text.successlite('[Trusting]')
    } else if (favor >= setup.FAVOR_EFFECT_THRESHOLDS[0]) {
      base = setup.DOM.Text.successlite('[Friendly]')
    } else {
      base = html`[Neutral]`
    }
    return setup.DOM.create(
      'span',
      {
        'data-tooltip': `When you have at least ${repFavor(setup.FAVOR_EFFECT_THRESHOLDS[0])} favor with this company, you will get certain bonuses. This bonus increases at ${repFavor(setup.FAVOR_EFFECT_THRESHOLDS[1])} and ${repFavor(setup.FAVOR_EFFECT_THRESHOLDS[2])} favor.`
      },
      base,
    )
  } else {
    return setup.DOM.Text.danger('[Disabled]')
  }
}

/**
 * @param {setup.Company} company
 * @returns {setup.DOM.Node}
 */
function companyIreFragment(company) {
  const fragments = []
  if (State.variables.favor.getManagedCompanies().includes(company)) {
    fragments.push(html`
      <span data-tooltip="Your relationship manager is managing the favor of this company right now">
        ${setup.DOM.Text.success('[Managed]')}
      </span>
    `)
  }

  fragments.push(html`
    ${State.variables.ire.getIreDisplay(company)}
  `)

  return setup.DOM.create('span', {
    'data-tooltip':
      "This represents how annoyed certain members of this company is against your company. " +
      "When their annoyance hits a breaking point, you should be wary of retaliation " +
      "against your company. " +
      "It is possible that you have a high favor and a high level of ire at the same time, because " +
      "the favor and the ire came from two different group of people from the same company."
  }, fragments)
}


/**
 * @param {setup.Company} company
 * @returns {setup.DOM.Node}
 */
function companyFavorDecayInfoFragment(company) {
  const decay = State.variables.favor.getDecay(company)
  return html`
    Favor: ${setup.DOM.Util.favor(State.variables.favor.getFavor(company))}
    ${decay ? setup.DOM.create('span', {
    'data-tooltip':
      "Favor will tend to decay over time. This can be mitigated " +
      "by building the Relations Office and hiring a Relationship Manager, " +
      " who can reduce or eliminate favor decay from some chosen companies.",
  }, html`(${setup.DOM.Util.favor(-decay)})`) : ''
    }
`
}


/**
 * @param {setup.Company} company
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function companyNameActionMenu(company, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: domCardRep(company),
  }))
  menus.push(menuItemText({
    text: companyFavorStatusFragment(company),
  }))
  menus.push(menuItemText({
    text: companyFavorDecayInfoFragment(company),
  }))
  menus.push(menuItemText({
    text: companyIreFragment(company)
  }))

  const extras = []

  if (!hide_actions) {
    extras.push(menuItemAction({
      text: `Favor bonus active`,
      tooltip: `If unchecked, you will stop receiving bonuses from being allied with this company`,
      checked: company.isFavorActive(),
      callback: () => {
        company.toggleIsFavorActive()
        setup.DOM.Nav.goto()
      },
    }))
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }
  return menus
}


/**
 * @param {setup.Company} company
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.company = function (company, hide_actions) {
  const fragments = []

  fragments.push(html`
${setup.DOM.Util.menuItemToolbar(
    companyNameActionMenu(company, hide_actions)
  )
    }
<div>
  ${setup.DOM.Util.include(company.getTemplate().getDescriptionPassage())}
</div>
`)

  return setup.DOM.create('div', { class: 'companycard' }, fragments,)
}


/**
 * @param {setup.Company} company
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.companycompact = function (company, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(
    companyNameActionMenu(company, hide_actions)
  )
}
