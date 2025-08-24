import type { MacroContext } from "twine-sugarcube";

function replaceContainerContentCallback(
  $container: JQuery,
  content: string,
  macro_context: MacroContext,
  g_copy: ActorUnitMap,
) {
  return macro_context.shadowHandler(() => {
    $container.empty();
    $container.wiki(setup.Text.replaceUnitMacros(content, g_copy));
    const element = setup.DOM.Card.notifications();
    if (element) {
      $container.append(element);
    }
  });
}

/**
 * Present a list of choices. When one is chosen, replace self with the chosen content.
 * This in particular means only one of these choices can be made.
 *
 * <<choose>>
 *   This text will be replaced when you selected a choice.
 * <<opt 'Choice 1'>>
 *   You have chosen the first option
 * <<opt 'Choice 2'>>
 *   You have chosen the second option
 * <<optif _unit.isFemale()>>
 * <<opt 'Choice 3'>>
 *   You have chosen the third option, which is only available if _unit is female.
 * <</choose>>
 */
Macro.add("choose", {
  skipArgs: ["optif"],
  tags: ["opt", "optif"],

  handler() {
    const len = this.payload.length;

    // if (len === 1 || !this.payload.some(p => p.name === 'case')) {
    if (len === 1) {
      return this.error("no choices specified");
    }

    if (this.payload[0].args.length) {
      throw new Error(`<<choose>> takes no arguments`);
    }

    const fragments: DOM.Attachable[] = [];
    const $container = jQuery(document.createElement("div"));

    const $init_text = jQuery(document.createElement("div"));
    $init_text.wiki(setup.Text.replaceUnitMacros(this.payload[0].contents));

    $container.append($init_text);

    // create a copy of variables and temporary variables, due to async issues.
    // const variables_copy =

    // save copy of g in case needed
    const g_copy = State.variables.g;

    // Create the choices.
    let skip = false;
    for (let i = 1; i < len; ++i) {
      if (this.payload[i].name == "opt" && this.payload[i].args.length != 1) {
        throw new Error(
          `<<opt>> within <<choose>> must take exactly one argument`,
        );
      }

      if (skip) {
        if (this.payload[i].name == "optif") {
          throw new Error(`<<optif>> cannot be consecutive`);
        }
        skip = false;
        continue;
      }

      if (this.payload[i].name == "optif") {
        if (!Scripting.evalJavaScript(this.payload[i].args.full)) {
          skip = true;
        }
      } else {
        const fragment = html`
          <div>
            ${setup.DOM.Nav.button(
              setup.DOM.Util.twee(this.payload[i].args[0]),
              replaceContainerContentCallback(
                $container,
                this.payload[i].contents,
                this,
                g_copy,
              ),
            )}
          </div>
        `;
        $container.append($(fragment));
      }
    }

    fragments.push($container.get(0));

    this.output.append(setup.DOM.create("div", {}, fragments));
  },
});
