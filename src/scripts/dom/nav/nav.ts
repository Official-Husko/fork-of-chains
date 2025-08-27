/**
 * The main thing that switches passages.
 *
 * @param force_passage_switch whether should force a Passage switch
 * @param scroll_top whether should scroll to the top
 */
export function reload(force_passage_switch?: boolean, scroll_top?: boolean) {
  const container = document.getElementById("allcontainer");

  if (!container || force_passage_switch) {
    // Actually switch to a new passage, so sugarcube saves all the state and variables and allow undo
    // Should only be called when the END WEEK button is pressed.
    if (!container) State.variables.gOldPassage = State.passage;
    setTimeout(() => Engine.play("MainLoop"), Engine.minDomActionDelay);
  } else {
    // "Shadow switch" passage, using replace.

    // First, save the current state so that when you undo you reach here.
    State.history[State.activeIndex].variables = State.variables;

    // Next, replace container with $gPassage
    const next_passage = State.variables.gPassage!;

    // setup.runSugarCubeCommand(`<<replace "#allcontainer">><<include "${next_passage}">><</replace>>`)
    const passage = Story.get(next_passage);
    const $container = $(container);
    $container.empty(); // remove previous contents
    if (passage) {
      $container.wiki(passage.processText());
    } else {
      throw new Error(`Passage "${passage}" does not exist`);
    }

    // Refresh the sidebar
    setup.runSugarCubeCommand(`<<refreshmenu>>`);

    if (scroll_top) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
}

function makeLink(
  container_name: keyof HTMLElementTagNameMap,
  children: DOM.Attachable,
  callback: Function,
  destination_passage?: string,
) {
  return setup.DOM.create(
    container_name,
    {
      click: () => {
        callback();
        if (destination_passage) {
          State.variables.gOldPassage = State.variables.gPassage;
          State.variables.gPassage = destination_passage;
          reload(
            /* passage switch = */ false,
            /* scroll top = */ State.variables.gPassage !=
              State.variables.gOldPassage,
          );
        }
      },
    },
    children,
  );
}

/**
 * Contains navigation primitives such as buttons, links, etc.
 */
export const DOM_Nav = {
  /**
   * Behaves like: <<link "children" "destination_passage">> <<run callback()>> <</link>>
   * Available as <<foclink>>
   */
  link(
    children: DOM.Attachable,
    callback: Function,
    destination_passage?: string,
  ) {
    if (destination_passage && !Story.has(destination_passage)) {
      throw new Error(
        `Passage ${destination_passage} not found for <<foclink>>`,
      );
    }
    return makeLink("a", children, callback, destination_passage);
  },

  /**
   * Behaves like: <<button "children" "destination_passage">> <<run callback()>> <</button>>
   * Available as <<focbutton>>
   */
  button(
    children: DOM.Attachable,
    callback: Function,
    destination_passage?: string,
  ) {
    if (destination_passage && !Story.has(destination_passage)) {
      throw new Error(
        `Passage ${destination_passage} not found for <<focbutton>>`,
      );
    }
    return makeLink("button", children, callback, destination_passage);
  },

  /**
   * Behaves like: <<focmove "hi" "passage">>
   * Available as <<focmove>>
   */
  move(children: DOM.Attachable, passage: string) {
    if (!Story.has(passage)) {
      throw new Error(`Passage ${passage} not found for <<focreturn>>`);
    }

    return setup.DOM.create(
      "a",
      {
        click(): void {
          State.variables.gOldPassage = State.variables.gPassage;
          State.variables.gPassage = passage;
          reload(
            /* passage switch = */ false,
            /* scroll top = */ State.variables.gPassage !=
              State.variables.gOldPassage,
          );
        },
      },
      children,
    );
  },

  /**
   * Behaves like: <<focreturn "hi">>
   * Available as <<focreturn>>
   */
  return(children: DOM.Attachable) {
    return setup.DOM.create(
      "a",
      {
        click() {
          setup.DOM.Nav.gotoreturn();
        },
      },
      children,
    );
  },

  /**
   * Behaves like: <<focgoto "passage">>
   * Available as <<focgoto>>
   *
   * @param passage If left empty, will refresh passage
   * @param save_state If true wil switch passage and save state
   */
  goto(passage?: string, save_state?: boolean) {
    if (passage && !Story.has(passage)) {
      throw new Error(`Passage ${passage} not found for <<focreturn>>`);
    }

    if (passage) {
      State.variables.gOldPassage = State.variables.gPassage;
      State.variables.gPassage = passage;
    }

    let scroll_top = false;
    if (passage && State.variables.gPassage != State.variables.gOldPassage)
      scroll_top = true;

    reload(save_state, scroll_top);
  },

  /**
   * Behaves like goto, but returns to previous passage
   */
  gotoreturn() {
    [State.variables.gOldPassage, State.variables.gPassage] = [
      State.variables.gPassage,
      State.variables.gOldPassage,
    ];
    reload(
      /* passage switch = */ false,
      /* scroll top = */ State.variables.gPassage !=
        State.variables.gOldPassage,
    );
  },

  /**
   * Link to an external URL
   */
  linkExternal(children: DOM.Attachable, url: string) {
    return html`<a href="${setup.escapeHtml(url)}" target="_blank"
      >${children}</a
    >`;
  },

  /**
   * Attach this to the op left navigation screen.
   */
  topLeftNavigation(children: DOM.Attachable) {
    if (State.variables.gMenuVisible) {
      throw new Error(
        `Cannot have top left navigation when gMenuVisible is turned on.`,
      );
    }

    setTimeout(() => {
      setup.DOM.Helper.replace(
        `#topleftnavigation`,
        setup.DOM.create("span", { class: "press_on_space" }, children),
      );
    }, 1);
  },

  /**
   * Behaves like: [[text|url]] but for external url
   */
  url(children: DOM.Attachable, url: string) {
    return setup.DOM.create(
      "a",
      {
        target: "_blank",
        class: "link-external",
        href: url,
        tabindex: "0",
      },
      children,
    );
  },
};
