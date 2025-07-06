// @ts-nocheck

// v1.0.0
'use strict';

Macro.add('money', {
  handler : function () {
    this.output.append(setup.DOM.Util.money(Number(this.args[0])))
  }
})


Macro.add('moneyloss', {
  handler : function () {
    this.output.append(setup.DOM.Util.moneyloss(Number(this.args[0])))
  }
})
