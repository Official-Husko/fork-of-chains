// v1.0.1
'use strict';

Macro.add('friendship', {
  handler : function () {
    this.output.append(setup.DOM.Util.friendship(Number(this.args[0]), this.args[1]))
  }
});
