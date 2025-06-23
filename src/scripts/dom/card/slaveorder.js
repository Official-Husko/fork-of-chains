import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.SlaveOrder} slave_order
 * @returns {setup.DOM.Node}
 */
function slaveOrderNameFragment(slave_order) {
  return html`${domCardRep(slave_order)}`
}

/**
 * @param {setup.SlaveOrder} slave_order
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function slaveOrderNameActionMenu(slave_order, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: slaveOrderNameFragment(slave_order),
  }))

  if (slave_order.isIgnored()) {
    menus.push(menuItemText({
      text: `Ignored`
    }))
  }

  if (!hide_actions) {
    menus.push(menuItemAction({
      text: `Fulfill`,
      tooltip: `Fulfill this slave order with a unit`,
      callback: () => {
        // @ts-ignore
        State.variables.gSlaveOrder_key = slave_order.key
        setup.DOM.Nav.goto('SlaveOrderFulfill')
      },
    }))
  }

  const source = slave_order.getSourceCompany()
  if (source) {
    menus.push(menuItemText({
      text: html`from ${source.rep()}`
    }))
  }

  if (slave_order.isCannotExpire()) {
    menus.push(menuItemText({
      text: `Cannot expire`,
    }))
  } else {
    const expiration = slave_order.getExpiresIn()
    menus.push(menuItemText({
      text: setup.DOM.create(
        `span`,
        {
          'data-tooltip': "Weeks before this slave order expires",
        },
        `${expiration} week${expiration > 1 ? 's' : ''}`
      )
    }))
  }

  const ignore_args = {
    text: `Ignored`,
    checked: slave_order.isIgnored(),
  }
  if (hide_actions) {
    extras.push(menuItemText(ignore_args))
  } else {
    ignore_args.callback = () => {
      slave_order.toggleIsIgnored()
      setup.DOM.Nav.goto()
    }
    extras.push(menuItemAction(ignore_args))
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}


/**
 * @param {setup.SlaveOrder} slave_order
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.slaveorder = function (slave_order, hide_actions) {
  const fragments = []

  fragments.push(
    setup.DOM.Util.menuItemToolbar(slaveOrderNameActionMenu(slave_order, hide_actions))
  )

  {
    const criteria = slave_order.getCriteria()
    if (criteria) {
      fragments.push(setup.DOM.create('div', {}, setup.DOM.Card.criteria(criteria)))
    }
  }

  {
    const explain_fulfilled = slave_order.explainFulfilled()
    if (explain_fulfilled) {
      fragments.push(html`
        <div>
          Rewards: ${explain_fulfilled}
        </div>
      `)
    }

    if (slave_order instanceof setup.SlaveOrderItem) {
      fragments.push(html`
        <div>
          Rewards ${slave_order.getItem().rep()} instead of money
          (one item per ${setup.DOM.Util.money(slave_order.getItem().getValue())}, up to
          ${slave_order.getMaximum()} copies)
        </div>
      `)
    }

    const unfulfilled = slave_order.getUnfulfilledOutcomes()
    if (unfulfilled.length) {
      fragments.push(html`
        <div>
          If expires: ${setup.DOM.Card.cost(unfulfilled, slave_order)}
        </div>
      `)
    }
  }

  const divclass = `slaveordercard card`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}


/**
 * @param {setup.SlaveOrder} slave_order
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.slaveordercompact = function (slave_order, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(slaveOrderNameActionMenu(slave_order, hide_actions))
}

