// @ts-nocheck

// v1.0.0
'use strict';

/**
 * Print a text, no wikification going on.
 */
Macro.add('printtext', {
  handler : function () {
    let textnode = $(document.createTextNode(this.args[0]))
    textnode.appendTo(this.output)
  }
});
