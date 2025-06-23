// Either: "in your building" or "once you build a building"
/**
 * 
 * @param {setup.BuildingTemplate | string} building_template
 * @returns {string}
 */
setup.Text.Building.inYourBuilding = function(building_template) {
  let t
  const rep = setup.selfOrObject(building_template, setup.buildingtemplate).rep()
  if (State.variables.fort.player.isHasBuilding(building_template)) {
    t = [
      `in your ${rep}`,
      `via your ${rep}`,
    ]
  } else {
    t = [
      `once you build the ${rep}`,
      `after you build the ${rep}`,
    ]
  }
  return setup.rng.choice(t)
}
