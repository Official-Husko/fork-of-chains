// v1.0.0
'use strict';

Macro.add('successtext', {
  handler : function () {
    this.output.append(setup.DOM.Text.success(this.args[0]))
  }
});


Macro.add('successtextlite', {
  handler : function () {
    this.output.append(setup.DOM.Text.successlite(this.args[0]))
  }
});
