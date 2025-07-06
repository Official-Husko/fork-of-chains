// @ts-nocheck


// crash the game. for Debugging.
setup.debugCrash = function () {
  throw new Error('Test crash from debugCrash')
}

setup.debugPrintRoomLocations = function () {
  for (const room of Object.values(State.variables.roominstance)) {
    if (room.getLocation() && !room.getTemplate().isFixed()) {
      console.log(`'${room.getTemplate().key}': [${room.getClockwiseRotations()}, ${room.getLocation().row}, ${room.getLocation().col}],`)
    }
  }
}

/**
 * @returns {setup.Unit}
 */
setup.generateAnyUnit = function () {
  return setup.unitgroup.all.getUnit()
}
