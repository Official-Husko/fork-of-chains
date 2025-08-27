import { createComponent, render } from "solid-js/web";
import { DOM_Card } from "./card/_index";
import Components_ from "./components/_index";
import { DOM_Helper } from "./helper/_index";
import { DOM_Menu } from "./menu/_index";
import { DOM_Nav } from "./nav/nav";
import { DOM_Quest } from "./quest/_index";
import { DOM_Roster } from "./roster/_index";
import {
  Pronoun as Pronoun_,
  pronounload as pronounload_,
  PronounYou as PronounYou_,
} from "./text/pronoun";
import { DOM_Text } from "./text/text";
import { DOM_Util } from "./util/_index";

export namespace DOM {
  //
  // Reexport types from the global "DOM" namespace into the
  // importable "DOM" namespace (so they are not shadowed off)
  //
  export type Node = DOM_Types._.Node;
  export type Attachable = DOM_Types._.Attachable;

  /**
   * Contains functions for misc text, and styled text
   */
  export const Text = DOM_Text;

  /**
   * Contains functions that render tooltips
   */
  export const Card = DOM_Card;

  /**
   * Contains menu renderers
   */
  export const Menu = DOM_Menu;

  /**
   * Contains roster / unit list displays
   */
  export const Roster = DOM_Roster;

  /**
   * Contains util functions that returns another dom object
   */
  export const Util = DOM_Util;

  /**
   * Contains all DOM util that DOES NOT return a setup.DOM.Node
   */
  export const Helper = DOM_Helper;

  /**
   * Contains navigation primitives such as buttons, links, etc.
   */
  export const Nav = DOM_Nav;

  /**
   * Contains quest-specific components and code
   */
  export const Quest = DOM_Quest;

  /**
   * Renderable reactive JSX components
   *
   * To render them in twee code, or inside DOM functions not in JSX, use:
   * ```
   *   setup.DOM.renderComponent(setup.DOM.Component.MyComponent, { myProp1: 0, ... })
   * ```
   */
  export const Component = Components_;

  //
  // Misc functions
  //

  export const Pronoun = Pronoun_;
  export const PronounYou = PronounYou_;
  export const pronounload = pronounload_;

  /**
   * Converts a value to a DOM node (mostly for internal use)
   * Depending on the type of arg, returns:
   *  - if falsy (null, false, undefined, ""): an empty fragment
   *  - if a DOM node already: returns self
   *  - if function: assumes it is a Component, and renders it with setup.DOM.renderComponent (without props)
   *  - if array: fragment with the elements as children
   *  - otherwise: fragment containing the value as a string
   *
   * @param arg The input value/object
   */
  export function toDOM(arg: DOM.Attachable): DOM.Node {
    if (!arg) return document.createDocumentFragment();

    if (arg instanceof Node) {
      return arg as DOM.Node;
    }

    if (arg instanceof Function) {
      return setup.DOM.renderComponent(arg as any);
    }

    if (Array.isArray(arg)) {
      const fragment = document.createDocumentFragment();
      for (const item of arg) fragment.appendChild(toDOM(item));
      return fragment;
    }

    //return document.createTextNode(String(arg))
    const template = document.createElement("template");
    template.innerHTML = String(arg);
    return template.content;
  }

  /**
   * Helper function to create an html DOM element
   *
   * @param tag
   *  The tag name (e.g. "div")
   *
   * @param attrs
   *  An optional object containing the element attributes (e.g. `{ id: "my-id" }`).
   *  Can also contain event listeners (e.g. `{ click() { do_whatever; } }`)
   *
   * @param children
   *  Optional array of elements to be appended as its children
   *
   * Examples:
       ```
        // Create a div with attributes: (equivalent, different attrib syntax showcase)
        setup.DOM.create("div", { class: 'class1 class2', style: 'color: red' }, "Some text")
        setup.DOM.create("div", { class: ['class1', 'class2'], style: { color: 'red' } }, "Some text")

        // Create a button with an event listener:
        setup.DOM.create("button", { id: 'my-id', click: () => { do_something; } }, "Click me!")

        // Create a div with children:
        setup.DOM.create("div", {}, [
            setup.DOM.create("div", {}),
            'Multiple',
            html`<b>children</b>`,
            document.createElement('hr'),
        ])
  *   ```
  */
  export function create<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    attrs?: DOM_Types._.Attributes<T>,
    children?: DOM.Attachable,
  ): DOM.Node {
    const elem = document.createElement(tag);

    if (attrs) {
      for (const k of Object.keys(attrs)) {
        let value = (attrs as any)[k];
        if (value === undefined) continue;

        if (value instanceof Function) {
          elem.addEventListener(k, value, false);
        } else {
          if (Array.isArray(value)) {
            value = value.join(" ");
          } else if (typeof value === "object") {
            value = Object.entries(value)
              .map((kv) => kv.join(": "))
              .join("; ");
          }

          elem.setAttribute(k, String(value));
        }
      }
    }

    if (children) {
      elem.appendChild(setup.DOM.toDOM(children));
    }

    return elem;
  }

  /**
   * Similar to setup.DOM.create, but sets up a render callback so it can be later
   * refreshed via `setup.DOM.refresh`
   * @param tag The tag name (e.g. "div")
   * @param attrs An optional object with its attributes (e.g. { id: "my-id" })
   * @param callback The render callback. Must return any of the values allowed for `setup.DOM.refresh` "children" parameter
   * @param is_async Whether first rendering is done asynchronously for performance
   *
   * Examples:
     ```
      setup.DOM.createRefreshable("div", { id: 'my-id' }, () => "some text")
      setup.DOM.createRefreshable("div", { id: 'my-id2' }, () => setup.DOM.create(...))

      // And to refresh element with `my-id`, call:
      setup.DOM.refresh("#my-id")`
    ```
  *
  */
  export function createRefreshable<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    attrs?: DOM_Types._.Attributes<T>,
    callback?: () => Parameters<typeof setup.DOM.create>[2],
    is_async?: boolean,
  ) {
    const elem = setup.DOM.create(tag, attrs);

    (elem as any)._render_callback = callback;

    if (is_async) {
      setTimeout(() => setup.DOM.refresh(elem), 1);
    } else {
      setup.DOM.refresh(elem);
    }
    return elem;
  }

  type JSX_Element = import("solid-js").JSX.Element;

  //
  // Overloads for "renderComponent"
  //
  export function renderComponent<T extends {}>(
    component: Component<{ [k in keyof T]: never }>,
  ): HTMLElement;
  export function renderComponent<T extends {}>(
    component: Component<T>,
    values: T,
  ): HTMLElement;

  export function renderComponent(
    component: Component<any>,
    values?: {},
  ): HTMLElement {
    let componentName = component.name || "unknown";
    if (import.meta.hot && componentName.startsWith("[")) {
      componentName = componentName.replace(/\[[^\]]+\]/g, "");
    }

    const div = document.createElement("div");
    div.setAttribute("data-component", componentName);
    render(() => createComponent(component, values || {}), div);
    return div;
  }

  //
  // Overloads for "renderComponentInto"
  //
  export function renderComponentInto<T extends {}>(
    container: HTMLElement | DocumentFragment,
    component: (props: { [k in keyof T]: never }) => JSX_Element,
  ): void;
  export function renderComponentInto<T extends {}>(
    container: HTMLElement | DocumentFragment,
    component: (props: T) => JSX_Element,
    values: T,
  ): void;
  export function renderComponentInto<T extends {}>(
    container: HTMLElement | DocumentFragment,
    component: (props: {}) => JSX_Element,
    values?: {},
  ): void;

  /**
   * NOTE: rendering into a fragment or containers with other children can cause issues in some cases,
   * specially if the renderer component returns a variable number of arguments as child
   *
   * Consider using instead "renderComponent" which is safer in most cases
   */
  export function renderComponentInto(
    container: HTMLElement | DocumentFragment,
    component: (props: {}) => JSX_Element,
    values?: {},
  ) {
    render(() => createComponent(component, values || {}), container);
  }

  /**
   * Re-renders the specified elements. Targets **must** be created via `setup.createRefreshable`
   * @param arg Either a query selector, a node, or an array of nodes
   *
   * See `setup.DOM.createRefreshable` for an example of usage
   */
  export function refresh(arg: DOM.Node | DOM.Node[] | string) {
    let elements;
    if (Array.isArray(arg)) {
      elements = arg;
    } else if (typeof arg === "string") {
      elements = document.querySelectorAll(arg);
    } else {
      elements = [arg];
    }

    for (const elem of elements) {
      const callback = (elem as any)._render_callback;
      if (callback) {
        elem.textContent = ""; // remove current children nodes

        const content = setup.DOM.toDOM(callback());
        elem.appendChild(content);
      }
    }
  }

  /**
   * Called by tag functions, for tagged template string (internal use)
   * @param is_twee True to parse as twee, false to parse as html
   */
  function inflate(
    is_twee: boolean,
    strings: TemplateStringsArray,
    ...values: any[]
  ) {
    let has_placeholders = false;

    let html = strings[0] || "";
    for (let i = 1; i < strings.length; ++i) {
      if (
        typeof values[i - 1] === "string" ||
        typeof values[i - 1] === "number"
      ) {
        html += values[i - 1].toString();
      } else {
        html += `<div data--tbd="${i - 1}"></div>`;
        has_placeholders = true;
      }
      html += strings[i];
    }

    let fragment;
    if (is_twee) {
      fragment = document.createDocumentFragment();
      new Wikifier(fragment, setup.DevToolHelper.stripNewLine(html));
    } else {
      fragment = setup.DOM.toDOM(html);
    }

    if (has_placeholders) {
      const placeholders = fragment.querySelectorAll("[data--tbd]");
      for (const placeholder of placeholders) {
        const index = +placeholder.getAttribute("data--tbd")!;
        placeholder.parentNode!.replaceChild(
          setup.DOM.toDOM(values[index]),
          placeholder,
        );
      }
    }

    return fragment;
  }

  //
  // See docs and example for `html` & `twee` in dom-utils.d.ts
  //

  export const html = (
    strings: TemplateStringsArray,
    ...values: any[]
  ): DOM.Node => inflate(false, strings, ...values);

  export const twee = (
    strings: TemplateStringsArray,
    ...values: any[]
  ): DOM.Node => inflate(true, strings, ...values);

  window.html = html;
  window.twee = twee;

  /**
   * WARNING: converting to string will kill all listener
   * Mostly used for very simple stuffs like setup.DOM.Text.success
   */
  export function toString(node: DOM.Node | null | undefined): string {
    if (!node) return "";
    if (setup.isString(node) || typeof node === "number")
      return node.toString();
    if ("outerHTML" in node) return node.outerHTML;

    // fragment
    let div = document.createElement("span");
    div.appendChild(node);
    return div.innerHTML;
  }
}

export const toDOM = DOM.toDOM;
