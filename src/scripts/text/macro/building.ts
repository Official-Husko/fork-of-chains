/*
  <<inyourbuilding 'bazaar'>>: "in your bazaar", or "once you build a bazaar"
*/

Macro.add("inyourbuilding", {
  handler() {
    this.output.append(
      setup.DOM.Util.twee(setup.Text.Building.inYourBuilding(this.args[0])),
    );
  },
});
