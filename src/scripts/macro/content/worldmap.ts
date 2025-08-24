/*
 * Show an interactive world map of the region.
 */
Macro.add("worldmap", {
  handler() {
    const text =
      '<div class="worldmap">' + setup.Lore.WORLDMAP_REGIONS_SVG + "</div>";
    this.output.appendChild(setup.DOM.Util.twee(text));
  },
});
