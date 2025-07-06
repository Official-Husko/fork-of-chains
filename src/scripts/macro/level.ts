// @ts-nocheck

// v1.0.0
'use strict';

Macro.add('levelof', {
  handler : function () {
    this.output.append(setup.DOM.Util.level(this.args[0].getLevel()))
  }
});
