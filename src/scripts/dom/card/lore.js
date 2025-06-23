import { menuItemExtras, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Lore} lore 
 */
function loreNameFragment(lore) {
  return html`
    ${setup.TagHelper.getTagsRep('lore', lore.getTags())}
    ${domCardRep(lore)}
  `
}

/**
 * @param {setup.Lore} lore
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function loreNameActionMenu(lore, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: loreNameFragment(lore),
  }))

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}


/**
 * @param {setup.Lore} lore
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.lore = function (lore, hide_actions) {
  return html`
  <div class='lorecard'>
    <div>${setup.DOM.Util.menuItemToolbar(loreNameActionMenu(lore, hide_actions))}
    <div>
      ${setup.DOM.Card.restriction(
    lore.getRestrictions(),
        /* obj = */ null,
        /* show all = */ true,
  )}
    </div>
    <div>
      ${setup.DOM.Util.include(lore.getDescriptionPassage())}
    </div>
  </div>
  `
}


/**
 * @param {setup.Lore} lore
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.lorecompact = function (lore, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(loreNameActionMenu(lore, hide_actions))
}


