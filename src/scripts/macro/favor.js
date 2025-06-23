// v1.0.1
'use strict';

Macro.add('favor', {
  handler : function () {
    this.output.append(setup.DOM.Util.favor(Number(this.args[0])))
  }
});
