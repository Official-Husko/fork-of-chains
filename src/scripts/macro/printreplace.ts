// @ts-nocheck

// v1.0.0
'use strict';

/**
 * Print a text, no wikification going on.
 */
Macro.add('printreplace', {
  handler : function () {
    const node = setup.DOM.Util.replaceUnitInFragment(setup.DOM.Util.twine(this.args[0]))
    this.output.append(node)
  }
});
