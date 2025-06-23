// v1.0.0
'use strict';

Macro.add('dangertext', {
  handler : function () {
    this.output.append(setup.DOM.Text.danger(this.args[0]))
  }
});


Macro.add('dangertextlite', {
  handler : function () {
    this.output.append(setup.DOM.Text.dangerlite(this.args[0]))
  }
});
