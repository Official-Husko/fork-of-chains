export {}

declare global {

  namespace setup {
    namespace DOM {

      type AttributeTypesOverrides = {
        style: string | Record<string, string>,
        class: string,
        className: never,
      }

      type ValueAttributes<T extends keyof HTMLElementTagNameMap> = {
        [k in keyof HTMLElementTagNameMap[T]]:
          HTMLElementTagNameMap[T][k] extends ((...args: any[]) => any)
            ? never
            : (k extends keyof AttributeTypesOverrides ? AttributeTypesOverrides[k] : HTMLElementTagNameMap[T][k])
      } & {
        [k in keyof AttributeTypesOverrides]: AttributeTypesOverrides[k]
      }

      type EventAttributes<T extends keyof HTMLElementTagNameMap> = {
        [k in keyof GlobalEventHandlersEventMap]:
          (this: HTMLElement, ev: GlobalEventHandlersEventMap[k] & { target: HTMLElementTagNameMap[T] }) => void
      }

      type Attributes<T extends keyof HTMLElementTagNameMap> = {
        [k in (keyof ValueAttributes<T> | keyof EventAttributes<T> | `data-${string}`)]?:
          (k extends keyof ValueAttributes<T> ? ValueAttributes<T>[k] : undefined) |
          (k extends keyof EventAttributes<T> ? EventAttributes<T>[k] : undefined) |
          (k extends `data-${string}` ? string : undefined)
      }

      type test2 = HTMLElementTagNameMap['button']['click'] extends ((...args: any[]) => any) ? true : false;
      type test = Attributes<'button'>['click']

      type Node = HTMLElement | DocumentFragment

      type Attachable = Attachable[] | DocumentFragment | globalThis.Node | Function | string | number | boolean | null | undefined

      type JSXElement = import('solid-js').JSXElement
    }
  }

  type Component<P extends {} = {}> = import('solid-js').Component<P>
  type ParentProps<P extends {} = {}> = import('solid-js').ParentProps<P>

  //
  // Declared in the global scope
  //

  /**
   * Tag function for JS tagged templates.
   * Inflates an HTML string with optional content
   * 
   * Usage example: (combined with helper functions in setup.DOM namespace)
   * ```
      // Value of content will be a DOM node (either an Element or a DocumentFragment)
      const content = html`
        <div class="some-class" style="${some_string_variable}">

          <p>Raw html here</p>

          ${twee`<<message 'here comes a twee macro (mostly for backwards compat / temporary')>>`}

          ${some_array.map(value => html`<span>value inside a loop: ${value}</span>`)}

          ${setup.DOM.createRefreshable("div", { id: 'my_refreshable_id' }, () => {
            // callback that re-renders the content when the div is refreshed via setup.DOM.refresh
            return html`<span>some refreshable html, timestamp: ${Date.now()}</span>`
          })}

          ${setup.DOM.create('button', { // this allows setting event listeners
            click() { setup.DOM.refresh('#my_refreshable_id') }
          }, "I'm a button, click me to refresh the div above")}
        </div>
      `;

  * ```
  */
  function html(strings: TemplateStringsArray, ...values: any[]): setup.DOM.Node

  /**
   * Tag function for JS tagged templates.  
   * Same as `html` tag function, but instead parses the string code as TWEE instead of HTML (i.e. it runs twee widget/macros)  
   * It is slower, prefer to use `html` when possible. Should only be used for backwards compatibility / transitioning code  
   */
  function twee(strings: TemplateStringsArray, ...values: any[]): setup.DOM.Node

}