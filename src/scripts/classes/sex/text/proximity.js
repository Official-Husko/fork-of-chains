/**
 * E.g., "Target's mouth is now conveniently located in front of unit's penis, ready for a blowjob"
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @return {string}
 */
setup.SexText.proximityDescription = function(unit, sex) {
  const sentences = []

  const my_position = sex.getPosition(unit)

  for (const target of sex.getUnits()) {
    if (target == unit) continue
    const their_position = sex.getPosition(target)
    for (const my_bodypart of setup.SexBodypart.getAllBodyparts()) {
      for (const their_bodypart of setup.SexBodypart.getAllBodyparts()) {
        if (!my_bodypart.isHasBodypart(unit, sex) || !their_bodypart.isHasBodypart(target, sex)) continue
        const res1 = _getProximityDescriptionInternal(
          unit,
          my_bodypart,
          my_position,
          target,
          their_bodypart,
          their_position,
          sex
        )
        if (res1) sentences.push(res1)

        const res2 = _getProximityDescriptionInternal(
          target,
          their_bodypart,
          their_position,
          unit,
          my_bodypart,
          my_position,
          sex
        )
        if (res2) sentences.push(res2)
      }
    }
  }

  if (sentences.length) return setup.rng.choice(sentences)

  return ''
}

/**
 * 
 * @param {setup.Unit} my_unit 
 * @param {setup.SexBodypart} my_bodypart 
 * @param {setup.SexPosition} my_position
 * @param {setup.Unit} their_unit 
 * @param {setup.SexBodypart} their_bodypart 
 * @param {setup.SexPosition} their_position
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
function _getProximityDescriptionInternal(
    my_unit, my_bodypart, my_position, their_unit, their_bodypart, their_position, sex) {
  if (my_bodypart.isCanInteractWith(
    sex.getPosition(my_unit),
    sex.getPose(my_unit).getFacingHeight(my_bodypart, my_position, sex),
    their_bodypart,
    sex.getPosition(their_unit),
    sex.getPose(their_unit).getFacingHeight(their_bodypart, their_position, sex),
  )) {
    return my_bodypart.describeTease(my_unit, their_unit, their_bodypart, sex)
  } else {
    return ''
  }
}
