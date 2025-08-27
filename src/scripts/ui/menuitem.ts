export interface MenuItemArgs {
  /** Text label for the item */
  text: string | DOM.Node;
  /** Callback executed when item is clicked */
  callback?: () => unknown;
  /** Additional CSS class(es) to add to this menu item */
  cssclass?: string;
  /** If not undefined, will render a checkbox, checked or unchecked depending on the truthiness of the value  */
  checked?: boolean;
  /** If true, will open on click instead of on hover */
  clickonly?: boolean;
  children?: JQuery<HTMLElement>[] | (() => JQuery<HTMLElement>[]);
  tooltip?: string;
  is_no_close?: boolean;
}

/**
 * Helper function to generate the DOM structure for a menu
 * using the CSS classes at "menu.css"
 */
export function menuItem({
  text,
  cssclass,
  checked,
  clickonly,
  callback,
  children,
  tooltip,
  is_no_close,
}: MenuItemArgs): JQuery {
  let checked_html = "";
  if (checked != undefined) {
    if (checked)
      checked_html = '<i class="icon-checkbox checked sfa sfa-check"></i> ';
    else checked_html = '<i class="icon-checkbox"></i> ';
  }

  let is_open = false;

  const tooltip_text = tooltip
    ? `data-tooltip="${setup.escapeHtml(tooltip)}"`
    : "";

  let wrapper = $(document.createElement("span"));
  if (typeof text === "string") {
    wrapper.wiki(setup.DevToolHelper.stripNewLine(text));
  } else {
    (wrapper.get(0) as HTMLElement).append(text);
  }

  const menuitem = $(
    `<div><span ${tooltip_text} class='menu-span'>${checked_html}<span>${wrapper.html()}</span></span></div>`,
  );
  menuitem.on("mouseenter", function (ev) {
    if (is_open) return;

    if ((this as any)._generatemenuitems) {
      // dynamically generate children
      const $container = $(this.lastElementChild!);
      $container.empty();
      const menuitems = (this as any)._generatemenuitems();
      for (const child of menuitems) child.appendTo($container);
    }

    const nav = this.children[1];
    if (nav instanceof HTMLElement) {
      // if submenu would overflow the window right border, open it to the left
      const div_bounds = menuitem.get(0)!.getBoundingClientRect();
      const nav_bounds = nav.getBoundingClientRect();
      if (div_bounds.right + nav_bounds.width > 0.95 * window.innerWidth)
        menuitem.addClass("menu-left");
      else menuitem.removeClass("menu-left");

      // if menu was closed (an item was clicked, reopen it)
      if (!clickonly && nav.style.display) nav.style.display = "";
    }
  });

  if (clickonly) menuitem.addClass("menu-clickonly");

  if (cssclass) menuitem.addClass(cssclass);

  if (children) {
    const container = $(`<nav></nav>`);
    if (children instanceof Function) {
      (menuitem.get(0) as any)._generatemenuitems = children;
      container.appendTo(menuitem);
    } else if (children.length) {
      for (const child of children) child.appendTo(container);
      container.appendTo(menuitem);
    }
  }

  const $span = menuitem.children().first();

  $span.on("mousedown", (ev) => {
    // prevent from gaining focus
    ev.preventDefault();
  });

  $span.on("click", (ev) => {
    ev.preventDefault();

    if (clickonly) {
      if (is_open)
        // the $(window).one("click", ...) will handle the click
        return;

      const parent = ev.target.closest(".menu-clickonly");
      const nav = parent && parent.children[1];
      if (nav instanceof HTMLElement) {
        nav.style.display = "block";
        is_open = true;
        setTimeout(function () {
          $(window).one("click", function (ev) {
            nav.style.display = "";
            is_open = false;
          });
        }, 1);
      }
    }

    if (callback) {
      if (!is_no_close) {
        // force-close the menu
        let elem = ev.target;
        while (elem.parentElement) {
          if (elem.parentElement.classList.contains("menu")) {
            (elem.lastElementChild as HTMLElement).style.display = "none";
            break;
          }
          elem = elem.parentElement;
        }
      }

      callback();
    }
  });
  return menuitem;
}

export function menuItemTitle(args: MenuItemArgs) {
  args["cssclass"] = "submenu-filter-title";
  return menuItem(args);
}

export function menuItemText(args: MenuItemArgs) {
  args["cssclass"] = "submenu-filter-text";
  return menuItem(args);
}

export function menuItemDanger(args: MenuItemArgs) {
  args["cssclass"] = "submenu-danger";
  return menuItem(args);
}

export function menuItemDebug(args: MenuItemArgs) {
  args["cssclass"] = "submenu-debug";
  return menuItem(args);
}

export function menuItemAction(args: MenuItemArgs) {
  args["cssclass"] = "submenu-action";
  return menuItem(args);
}

export function menuItemValue(args: MenuItemArgs) {
  args["cssclass"] = "submenu-value";
  return menuItem(args);
}

export function menuItemExtras(args: Omit<MenuItemArgs, "text">) {
  return menuItem({
    ...args,
    clickonly: true,
    text: '<i class="sfa sfa-ellipsis-v"></i>',
  });
}
