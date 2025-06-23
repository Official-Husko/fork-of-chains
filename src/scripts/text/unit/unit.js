
setup.Text.genital = function(unit) {
  if (unit.isHasTrait(setup.trait.dick_huge)) {
    return 'gigantic dick'
  }
  if (unit.isHasTrait(setup.trait.dick_small)) {
    return 'dick'
  }
  if (unit.isHasTrait(setup.trait.dick_tiny)) {
    return 'tiny dick'
  }
  if (unit.isHasTrait(setup.trait.breast_huge)) {
    return 'gigantic breasts'
  }
  if (unit.isHasTrait(setup.trait.breast_small)) {
    return 'breasts'
  }
  if (unit.isHasTrait(setup.trait.breast_tiny)) {
    return 'tiny breasts'
  }
  if (unit.isHasTrait(setup.trait.vagina_tight)) {
    return 'vagina'
  }
  return 'anus'
}
