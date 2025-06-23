import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"

/**
 * @param {setup.SexAction} action 
 * @returns {setup.DOM.Node}
 */
function sexActionNameFragment(action) {
  return html`
    ${setup.TagHelper.getTagsRep('sexaction', action.getTags())}
    ${action.desc()}
    ${State.variables.settings.isSexActionDisabled(action) ?
      setup.DOM.Text.danger('[DISABLED]') :
      ''
    }
  `
}

/**
 * @param {setup.SexAction} sex_action
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function sexActionNameActionMenu(sex_action, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: sexActionNameFragment(sex_action),
  }))

  const disabled_args = {
  }
  if (!hide_actions) {
    extras.push(menuItemAction({
      callback: () => {
        State.variables.settings.toggleSexActionDisabled(sex_action)
        setup.DOM.Nav.goto()
      },
      text: 'Disabled',
      tooltip: "If disabled, sex actions will not be selected during Interactive Sex",
      checked: State.variables.settings.isSexActionDisabled(sex_action),
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
 * @param {setup.SexAction} action
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.sexactioncompact = function (action, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(sexActionNameActionMenu(action, hide_actions))
}

/**
 * @param {setup.SexAction} action
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.sexaction = function (action, hide_actions) {
  const fragments = []

  // title stuffs
  fragments.push(
    setup.DOM.Util.menuItemToolbar(sexActionNameActionMenu(action, hide_actions))
  )

  // general restrictions
  const general_restrictions = action.getRestrictions()
  if (general_restrictions.length) {
    fragments.push(html`
      <div>
        ${setup.DOM.Card.cost(general_restrictions)}
      </div>
    `)
  }

  // actor restrictions
  let i = 0
  for (const actor_desc of action.getActorDescriptions()) {
    i += 1
    const restrictions = actor_desc.restrictions || []
    if (restrictions.length) {
      fragments.push(html`
        <div>
          Actor ${i}: ${setup.DOM.Card.cost(restrictions)}
        </div>
      `)
    }
  }

  const divclass = `card interactive-sex-action-card`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}
