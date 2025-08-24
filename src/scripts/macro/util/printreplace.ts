// v1.0.0

/**
 * Print a text, no wikification going on.
 */
Macro.add("printreplace", {
  handler() {
    const node = setup.DOM.Util.replaceUnitInFragment(
      setup.DOM.Util.twee(this.args[0]),
    );
    this.output.append(node);
  },
});
