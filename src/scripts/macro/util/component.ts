import type { JSX } from "solid-js/jsx-runtime";

/**
 * Render and attach a JSX/TSX Component to output
 * Example usages:
 * ```html
 *   <<component setup.DOM.Component.MyComponent>>
 *
 *   <<component setup.DOM.Component.MyComponent prop1 _value1 prop2 _value2 ...>>
 *
 *   <<set _props = { value: 1 }>>
 *   <<component setup.DOM.Component.MyComponent _props>>
 * ```
 */
Macro.add("component", {
  handler() {
    let component = this.args[0] as ((props: {}) => JSX.Element) | string;

    let props: Record<string, any> = {};
    if (this.args.length >= 3) {
      for (let i = 1; i < this.args.length; i += 2) {
        props[this.args[i]] = this.args[i + 1];
      }
    } else if (this.args.length === 2) {
      props = this.args[1];
    }

    if (typeof component === "string") {
      component =
        setup.DOM.Component[component as keyof typeof setup.DOM.Component];
    }

    if (!component || !(typeof component === "function")) {
      return this.error("No component specified or it is not a function");
    }

    let rendered_element: JSX.Element;
    try {
      rendered_element = setup.DOM.renderComponent(component, props);
    } catch (ex) {
      console.error(`Error rendering <<component ${this.args.full}>>`, ex);
      return this.error(
        `Error rendering <<component ${this.args.full}>>: ${ex instanceof Error ? ex.message : ex}`,
      );
    }

    // Custom debug view setup
    //if (Config.debug) {
    //  this.debugView.modes({ hidden: true })
    //}

    if (rendered_element) {
      this.output.append(rendered_element);
    }
  },
});
