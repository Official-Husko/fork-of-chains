import { createComponent, render } from "solid-js/web"

setup.DOM = {}

/**
 * stores cards and tooltips
 */
setup.DOM.Card = {}

/**
 * stores menu renderers
 */
setup.DOM.Menu = {}

/**
 * stores roster / unit list displays
 */
setup.DOM.Roster = {}

/**
 * stores util functions that returns another dom object
 */
setup.DOM.Util = {}

/**
 * Stores quest-specific code
 */
setup.DOM.Quest = {}


/**
 * Renderable reactive JSX components
 * 
 * To render them in twee code, or inside DOM functions not in JSX, use:
 * ```
 *   setup.DOM.renderComponent(setup.DOM.Components.MyComponent, { myProp1: 0, ... })
 * ```
 */
setup.DOM.Components = {}


/**
 * Converts a value to a DOM node (mostly for internal use)
 * Depending on the type of arg, returns:
 *  - if falsy (null, false, undefined, ""): an empty fragment
 *  - if a DOM node already: returns self
 *  - if function: assumes it is a Component, and renders it with setup.DOM.renderComponent (without props)
 *  - if array: fragment with the elements as children
 *  - otherwise: fragment containing the value as a string
 * 
 * @param {setup.DOM.Attachable} arg The input value/object
 * @returns {setup.DOM.Node}
 */
export function toDOM(arg) {
  if (!arg)
    return document.createDocumentFragment()

  if (arg instanceof Node) {
    return /** @type {setup.DOM.Node} */ (arg)
  }

  if (arg instanceof Function) {
    return setup.DOM.renderComponent(/** @type {any} */ (arg))
  }

  if (Array.isArray(arg)) {
    const fragment = document.createDocumentFragment()
    for (const item of arg)
      fragment.appendChild(toDOM(item))
    return fragment
  }

  //return document.createTextNode(String(arg))
  const template = document.createElement("template")
  template.innerHTML = String(arg)
  return template.content
}
setup.DOM.toDOM = toDOM


/**
 * Helper function to create an html DOM element
 * 
 * @template {keyof HTMLElementTagNameMap} T
 * 
 * @param {T} tag
 *  The tag name (e.g. "div")
 * 
 * @param {setup.DOM.Attributes<T>} [attrs]
 *  An optional object containing the element attributes (e.g. `{ id: "my-id" }`).
 *  Can also contain event listeners (e.g. `{ click() { do_whatever; } }`)
 * 
 * @param {setup.DOM.Attachable} [children]
 *  Optional array of elements to be appended as its children
 * 
 * @returns {setup.DOM.Node}
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
setup.DOM.create = function (tag, attrs, children) {
  const elem = document.createElement(tag)

  if (attrs) {
    for (const k of Object.keys(attrs)) {
      let value = (/** @type {Record<string, any>} */ (attrs))[k]
      if (value === undefined)
        continue

      if (value instanceof Function) {
        elem.addEventListener(k, value, false)
      } else {
        if (Array.isArray(value)) {
          value = value.join(' ')
        } else if (typeof value === "object") {
          value = Object.entries(value).map(kv => kv.join(': ')).join('; ')
        }

        elem.setAttribute(k, String(value))
      }
    }
  }

  if (children) {
    elem.appendChild(setup.DOM.toDOM(children))
  }

  return elem
}

/**
 * Similar to setup.DOM.create, but sets up a render callback so it can be later
 * refreshed via `setup.DOM.refresh`
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag The tag name (e.g. "div")
 * @param {setup.DOM.Attributes<T>} attrs An optional object with its attributes (e.g. { id: "my-id" })
 * @param {() => Parameters<typeof setup.DOM.create>[2]} callback The render callback. Must return any of the values allowed for `setup.DOM.refresh` "children" parameter
 * @param {boolean} [is_async] Whether first rendering is done asynchronously for performance
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
setup.DOM.createRefreshable = function (tag, attrs, callback, is_async) {
  const elem = setup.DOM.create(tag, attrs)

  // @ts-ignore
  elem._render_callback = callback

  if (is_async) {
    setTimeout(() => setup.DOM.refresh(elem), 1)
  } else {
    setup.DOM.refresh(elem)
  }
  return elem
}

/**
 * @template {{}} T
 * 
 * @overload
 * @param {(props: { [k in keyof T]: never }) => import('solid-js').JSX.Element} component
 * @returns {HTMLElement}
 * 
 * @overload
 * @param {(props: T) => import('solid-js').JSX.Element} component
 * @param {T} values
 * @returns {HTMLElement}
 * 
 * @param {(props: {}) => import('solid-js').JSX.Element} component
 * @param {{}=} values
 */
setup.DOM.renderComponent = function(component, values) {
  const div = document.createElement('div')
  render(() => createComponent(component, values || {}), div)
  return div
}

/**
 * NOTE: rendering into a fragment or containers with other children can cause issues in some cases,
 * specially if the renderer component returns a variable number of arguments as child
 * 
 * Consider using instead "renderComponent" which is safer in most cases
 * 
 * @template T
 * 
 * @overload
 * @param {HTMLElement | DocumentFragment} container
 * @param {() => import('solid-js').JSX.Element} component
 * @returns {DocumentFragment}
 * 
 * @overload
 * @param {HTMLElement | DocumentFragment} container
 * @param {(props: T) => import('solid-js').JSX.Element} component
 * @param {T} values
 * @returns {DocumentFragment}
 * 
 * @param {HTMLElement | DocumentFragment} container
 * @param {(props: {}) => import('solid-js').JSX.Element} component
 * @param {{}=} values
 */
setup.DOM.renderComponentInto = function(container, component, values) {
  render(() => createComponent(component, values || {}), container)
}

/**
 * Re-renders the specified elements. Targets **must** be created via `setup.createRefreshable`
 * @param {Node|Node[]|string} arg Either a query selector, a node, or an array of nodes
 * 
 * See `setup.DOM.createRefreshable` for an example of usage
 */
setup.DOM.refresh = function (arg) {
  let elements
  if (Array.isArray(arg)) {
    elements = arg
  } else if (typeof arg === "string") {
    elements = document.querySelectorAll(arg)
  } else {
    elements = [arg]
  }

  for (const elem of elements) {
    // @ts-ignore
    const callback = elem._render_callback
    if (callback) {
      elem.textContent = '' // remove current children nodes

      const content = setup.DOM.toDOM(callback())
      elem.appendChild(content)
    }
  }
}



/**
 * Called by tag functions, for tagged template string (internal use)
 * @param {boolean} is_twee True to parse as twee, false to parse as html
 * @param {TemplateStringsArray} strings 
 * @param {any[]} values 
 */
function inflate(is_twee, strings, ...values) {
  let has_placeholders = false

  let html = strings[0] || ''
  for (let i = 1; i < strings.length; ++i) {
    if (typeof values[i - 1] === "string" || typeof values[i - 1] === "number") {
      html += values[i - 1].toString()
    } else {
      html += `<div data--tbd="${i - 1}"></div>`
      has_placeholders = true
    }
    html += strings[i]
  }

  let fragment
  if (is_twee) {
    fragment = document.createDocumentFragment()
    new Wikifier(fragment, setup.DevToolHelper.stripNewLine(html))
  } else {
    fragment = setup.DOM.toDOM(html)
  }

  if (has_placeholders) {
    const placeholders = fragment.querySelectorAll("[data--tbd]")
    for (const placeholder of placeholders) {
      const index = +(/** @type {any} */ (placeholder.getAttribute("data--tbd")))
      ;(/** @type {HTMLElement} */ (placeholder.parentNode)).replaceChild(setup.DOM.toDOM(values[index]), placeholder)
    }
  }

  return fragment
}

// See docs and example in dom-utils.d.ts
/** @type {(strings: TemplateStringsArray, ...values: any[]) => setup.DOM.Node} */
window.html = setup.DOM.html = (strings, ...values) => inflate(false, strings, ...values)
/** @type {(strings: TemplateStringsArray, ...values: any[]) => setup.DOM.Node} */
window.twee = setup.DOM.twee = (strings, ...values) => inflate(true, strings, ...values)


/**
 * WARNING: converting to string will kill all listener
 * Mostly used for very simple stuffs like setup.DOM.Text.success
 * @param {setup.DOM.Node} node
 */
setup.DOM.toString = function (node) {
  if (!node) return ''
  if (setup.isString(node) || typeof node === 'number') return node.toString()
  if ('outerHTML' in node) return node.outerHTML

  // fragment
  let div = document.createElement('span')
  div.appendChild(node)
  return div.innerHTML
}
