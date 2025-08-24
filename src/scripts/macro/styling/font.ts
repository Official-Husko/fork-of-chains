// <<font "Merienda One">>
// TEXT
// <</font>>

Macro.add("font", {
  tags: null,

  handler() {
    if (this.args.length != 1) {
      throw new Error(
        `<<font>> takes exactly one argument, but ${this.args.length} found`,
      );
    }
    if (this.payload.length != 1) {
      throw new Error(`<<font>> takes exactly one payload`);
    }

    const font_name = this.args[0];
    let css_add;
    if (font_name in setup.trait) {
      css_add = `class="text-${font_name}"`;
    } else {
      css_add = `style="font-family: '${font_name}', cursive;"`;
    }

    const payload = this.payload[0].contents;
    this.output.append(
      html`<span ${css_add}>${setup.DOM.Util.twee(payload)}</span>`,
    );
  },
});

Macro.add("fontsize", {
  tags: null,

  handler() {
    if (this.args.length != 1) {
      throw new Error(
        `<<fontsize>> takes exactly one argument, but ${this.args.length} found`,
      );
    }
    if (this.payload.length != 1) {
      throw new Error(`<<fontsize>> takes exactly one payload`);
    }

    const size = this.args[0];
    const css_add = `style="font-size: ${size}px;"`;

    const payload = this.payload[0].contents;
    this.output.append(
      html`<span ${css_add}>${setup.DOM.Util.twee(payload)}</span>`,
    );
  },
});
