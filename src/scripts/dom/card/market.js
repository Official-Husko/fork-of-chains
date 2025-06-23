import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Market} market
 * @param {setup.MarketObject} market_object
 * @param {Function} market_refresh_callback
 * @param {boolean} hide_actions 
 * @param {boolean} is_can_delete
 * @returns {JQLite[]}
 */
function marketObjectNameActionMenu(market, market_object, market_refresh_callback, hide_actions, is_can_delete) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: market_object.getRarity().rep(),
  }))

  if ('rep' in market_object.getObject()) {
    menus.push(menuItemTitle({
      text: domCardRep(market_object.getObject()),
    }))
  }

  const price = market_object.getPrice()
  if (!hide_actions) {
    if (market.isCanBuyObject(market_object)) {
      menus.push(menuItemAction({
        text: price ? html`Buy for ${setup.DOM.Util.money(price)}` :
          html`Get for ${setup.DOM.Text.successlite('Free')}`,
        callback: () => {
          setup.DevToolHelper.saveScrollPos()
          market.buyObject(market_object)
          market_refresh_callback()
        }
      }))
    } else {
      menus.push(menuItemText({
        text: html`Cannot get (${price ? setup.DOM.Util.money(price) : setup.DOM.Text.successlite('Free')})`,
      }))
    }
  }

  if (market_object.isInfinite()) {
    menus.push(menuItemText({
      text: setup.DOM.create(
        'span',
        {
          'data-tooltip': 'There are no limit how many times you can purchase this object',
        },
        html`Infinite`,
      )
    }))
  } else {
    if (is_can_delete && !hide_actions) {
      extras.push(menuItemDanger({
        text: `Remove`,
        callback: () => {
          market.removeObjectAndCheckDelete(market_object)
          market_refresh_callback()
        },
      }))
    }

    const expires_in = market_object.getExpiresIn()
    if (expires_in) {
      menus.push(menuItemText({
        text: setup.DOM.create(
          'span',
          {
            'data-tooltip': 'This market object will expire in this many weeks',
          },
          html`${expires_in} week${expires_in > 1 ? 's' : ''} `,
        )
      }))
    } else {
      menus.push(menuItemText({
        text: `Never expires`,
      }))
    }
  }

  const rep_source = market_object.repSource()
  if (rep_source) {
    menus.push(menuItemText({
      text: `From: ${rep_source}`
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
 * @param {setup.Market} market
 * @param {setup.MarketObject} market_object
 * @param {Function} market_refresh_callback
 * @param {Function} market_object_display_callback
 * @param {boolean} hide_actions
 * @param {boolean} is_can_delete
 * @returns {setup.DOM.Node}
 */
function marketObjectFragment(
  market, market_object, market_refresh_callback, market_object_display_callback, hide_actions, is_can_delete) {
  return html`
      <div class='marketobjectcard ${market_object.getRarity().getBorderColorClass()}'>
        ${setup.DOM.Util.menuItemToolbar(
    marketObjectNameActionMenu(
      market, market_object, market_refresh_callback, hide_actions, is_can_delete,
    )
  )
    }
    <div>
      ${market_object_display_callback(market_object.getObject())}
    </div>
    </div>
      `
}


/**
 * @param {setup.Market} market
 * @param {setup.MarketObject} market_object
 * @param {Function} market_refresh_callback
 * @param {boolean} hide_actions
 * @param {boolean} is_can_delete
 * @returns {setup.DOM.Node}
 */
function marketObjectCompactFragment(market, market_object, market_refresh_callback, hide_actions, is_can_delete) {
  return setup.DOM.Util.menuItemToolbar(
    marketObjectNameActionMenu(
      market, market_object, market_refresh_callback, hide_actions, is_can_delete,
    )
  )
}


/**
 * @typedef {Object} MarketCardArgs
 * @property {setup.Market} market
 * @property {boolean} [is_can_delete]
 * 
 * // if return True, then won't refresh market.
 * @property {Function} [on_buy_callback]
 * 
 * @param {MarketCardArgs} args
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.market = function ({ market, on_buy_callback, is_can_delete }) {
  const market_refresh_callback = () => {
    if (on_buy_callback && on_buy_callback()) return
    setup.DOM.Nav.goto()
  }

  let menu
  let display_callback
  if (market instanceof setup.MarketEquipment) {
    menu = 'equipmentmarket'
    display_callback = (equipment => setup.DOM.Card.equipment(equipment, /* hide actions = */ true))
  } else if (market instanceof setup.MarketItem) {
    menu = 'itemmarket'
    display_callback = (item => setup.DOM.Card.item(item, /* hide actions = */ true))
  } else if (market instanceof setup.MarketUnit) {
    menu = 'unitmarket'
    display_callback = (unit => setup.DOM.Card.unit(unit, /* hide actions = */ true))
  } else {
    throw new Error(`Unknown market: ${market.key} `)
  }

  const market_objects = market.getMarketObjects()

  let display_objects = market.getMarketObjects()
  if (market instanceof setup.MarketItem) {
    const availability = State.variables.menufilter.get(menu, 'availability')
    if (availability == 'limited') {
      display_objects = display_objects.filter(item => !item.isInfinite())
    } else if (availability == 'unlimited') {
      display_objects = display_objects.filter(item => item.isInfinite())
    }
  }

  const for_filter = display_objects.map(market_object => market_object.getObject())
  const market_display_settings = State.variables.menufilter.get(menu, 'display')
  const hide_actions = false

  return setup.DOM.Util.async(() => {
    const res = setup.DOM.Util.filterAll({
      menu: menu,
      filter_objects: for_filter,
      display_objects: display_objects,
      display_callback: (display_obj) => {
        if (market_display_settings == 'compact') {
          return marketObjectCompactFragment(market, display_obj, market_refresh_callback, hide_actions, is_can_delete)
        } else {
          return marketObjectFragment(market, display_obj, market_refresh_callback, display_callback, hide_actions, is_can_delete)
        }
      },
    })
    setup.DevToolHelper.restoreScrollPos()
    return res
  })
}
