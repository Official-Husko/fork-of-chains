import type { Lore, LoreKey } from "../../classes/Lore";
import { menuItemExtras, menuItemTitle } from "../../ui/menuitem";
import { domCardRep } from "../util/cardnamerep";

function loreNameFragment(lore: Lore) {
  return html`
    ${setup.TagHelper.getTagsRep("lore", lore.getTags())} ${domCardRep(lore)}
  `;
}

function loreNameActionMenu(lore: Lore, show_actions?: boolean): JQuery[] {
  const menus: JQuery[] = [];
  const extras: JQuery[] = [];

  menus.push(
    menuItemTitle({
      text: loreNameFragment(lore),
    }),
  );

  if (extras.length) {
    menus.push(
      menuItemExtras({
        children: extras,
      }),
    );
  }

  return menus;
}

export default {
  lore(lore_or_key: Lore | LoreKey, show_actions?: boolean): DOM.Node {
    const lore = resolveObject(lore_or_key, setup.lore);

    return html`
      <div class="lorecard">
        <div>
          ${setup.DOM.Util.menuItemToolbar(
            loreNameActionMenu(lore, show_actions),
          )}
          <div>
            ${setup.DOM.Card.restriction(
              lore.getRestrictions(),
              /* obj = */ null,
              /* show all = */ true,
            )}
          </div>
          <div>${setup.DOM.Util.twee(lore.getLoreText())}</div>
        </div>
      </div>
    `;
  },

  lorecompact(lore: Lore, show_actions?: boolean): DOM.Node {
    return setup.DOM.Util.menuItemToolbar(
      loreNameActionMenu(lore, show_actions),
    );
  },
};
