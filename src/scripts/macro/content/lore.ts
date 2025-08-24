Macro.add("lore", {
  handler() {
    const text = setup.Lore.repLore(this.args[0], true);
    this.output.appendChild(setup.DOM.Util.twee(text));
  },
});

Macro.add("Lore", {
  handler() {
    const text = setup.Lore.repLore(this.args[0], true);
    this.output.appendChild(setup.DOM.Util.twee(text));
  },
});
