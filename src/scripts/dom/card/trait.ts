import { menuItemExtras, menuItemTitle } from "../../ui/menuitem";

function traitNameActionMenu(trait: Trait, show_actions?: boolean): JQuery[] {
  const menus: JQuery[] = [];
  const extras: JQuery[] = [];

  menus.push(
    menuItemTitle({
      text: `${trait.repFull()} ${State.variables.gDebug ? `<span class="debug-info">(${trait.key})</span>` : ""}`,
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

export function getTraitEtcFragment(trait: Trait): DOM.Node {
  const fragments: DOM.Attachable[] = [];
  fragments.push(html`
    <div>${setup.DOM.Util.twee(trait.getDescription())}</div>
  `);

  if (trait.isHasSkillBonuses()) {
    fragments.push(html`
      <div>${setup.SkillHelper.explainSkillMods(trait.getSkillBonuses())}</div>
    `);
  }
  const value = trait.getSlaveValue();
  if (value) {
    fragments.push(html` <div>Worth: ${setup.DOM.Util.money(value)}</div> `);
  }
  return setup.DOM.create("div", {}, fragments);
}

export default {
  trait(trait_or_key: Trait | TraitKey, show_actions?: boolean): DOM.Node {
    const trait = resolveObject(trait_or_key, setup.trait);

    const fragments: DOM.Attachable[] = [];

    fragments.push(html`
      ${setup.DOM.Util.menuItemToolbar(
        traitNameActionMenu(trait, show_actions),
      )}
      ${getTraitEtcFragment(trait)}
    `);

    return setup.DOM.create("div", {}, fragments);
  },
};
