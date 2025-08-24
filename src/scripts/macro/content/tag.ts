Macro.add("tagcard", {
  handler() {
    this.output.appendChild(setup.DOM.Util.twee(this.args[0]));
  },
});
