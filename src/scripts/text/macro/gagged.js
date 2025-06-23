Macro.add('ugaggeddiscomfort', {
  handler() {
    this.output.append(setup.Text.Gagged.discomfort(this.args[0]))
  }
});

Macro.add('ugaggedpleasure', {
  handler() {
    this.output.append(setup.Text.Gagged.pleasure(this.args[0]))
  }
});

