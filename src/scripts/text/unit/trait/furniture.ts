// @ts-nocheck

/**
 * 
 * @param {setup.Unit} unit 
 * @param {setup.FurnitureSlot} slot 
 * @returns {string}
 */
function bedchamberEquipment(unit, slot) {
  let bedchamber = unit.getBedchamber()

  let furniture
  if (!bedchamber) {
    furniture = slot.getBasicFurniture()
  } else {
    furniture = bedchamber.getFurniture(slot)
  }
  return furniture.rep()
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.slaverbed = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.slaverbed)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.slavebed = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.slavebed)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.foodtray = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.foodtray)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.drinktray = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.drinktray)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.punishment = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.punishment)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.lighting = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.lighting)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.tile = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.tile)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.object = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.object)
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Trait.wall = function(unit) {
  return bedchamberEquipment(unit, setup.furnitureslot.wall)
}
