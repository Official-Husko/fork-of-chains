// v1.0.0
'use strict';

Macro.add('nameof', {
  handler: function () {
    this.output.append(setup.DOM.Util.namebold(this.args[0]))
  }
});

Macro.add('name', {
  handler: function () {
    this.output.append(setup.DOM.Util.name(this.args[0]))
  }
});

Macro.add('Name', {
  handler: function () {
    this.output.append(setup.DOM.Util.name(this.args[0]))
  }
});

