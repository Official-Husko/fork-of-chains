setup.Text.Strip = {}

const RESTRAINT_VERB = [
  `a|free a|themself of`,
  `a|unlock and a|free themself of`,
]

const PLUG_VERB = [
  `a|remove`,
  `a|take off`,
  `a|take out`,
  `a|unplug`,
]

const GENERIC = [
  `a|remove`,
  `a|displace`,
]

const HARNESS = [
  `a|undo the bindings and a|get out of`,
  `a|unlatch the straps and a|strip out of`,
]

const ARMOR = [
  `a|unbuckle the fastenings and a|get out of`,
  `a|get out of the protective embrace of`,
  `a|unfasten the straps and a|strip out of`,
  `a|undo the buckles to get out of`,
]

/**
 * Return a verb for stripping out of the equipment.
 * E.g., "take off", "strip", ...
 * 
 * @param {setup.Unit} unit 
 * @param {setup.Equipment} equipment 
 * @returns {string}
 */
setup.Text.Strip.verb = function (unit, equipment) {
  const slot = equipment.getSlot()
  const eq = equipment

  let t
  if (slot == setup.equipmentslot.torso) {
    if (eq.getTags().includes('fake_clothes')) {
      t = [
        `a|pretend to take off`,
        `a|mime taking off`,
        `"a|take off`,
      ]
    } else if (eq.getTags().includes('harness')) {
      t = HARNESS
    } else if (eq.getTags().includes('armor')) {
      t = ARMOR
    } else if (eq.getTags().includes('restraints')) {
      t = RESTRAINT_VERB
    } else {
      t = [
        `a|strip out of`,
        `a|remove`,
        `a|pull off`,
        `a|slip out of`,
        `a|strip out of`,
      ]
    }
  } else if (slot == setup.equipmentslot.legs) {
    if (eq.getTags().includes('harness')) {
      t = HARNESS
    } else if (eq.getTags().includes('armor')) {
      t = ARMOR
    } else if (eq.getTags().includes('restraints')) {
      t = RESTRAINT_VERB
    } else if (eq.getTags().includes('fake_clothes')) {
      t = [
        `a|pretend to strip down`,
        `"a|pull down"`,
      ]
    } else {
      t = [
        `a|pull down`,
        `a|get out of`,
      ]
    }
  } else if (slot == setup.equipmentslot.rear) {
    if (eq.getTags().includes('armor')) {
      t = [
        `a|give up the little protection offered and a|take off`,
        `a|take off`,
      ]
    } else if (eq.getTags().includes('restraints')) {
      t = RESTRAINT_VERB
    } else if (eq.getTags().includes('clothes')) {
      t = [
        `a|slip off`,
        `a|take down`,
      ]
    } else if (eq.getTags().includes('fake_clothes')) {
      t = [
        `a|pretend to strip out of`,
        `"a|slip off"`,
      ]
    } else if (eq.getTags().includes('buttplug')) {
      t = PLUG_VERB
    } else if (eq.getTags().includes('dildo')) {
      t = PLUG_VERB
    } else {
      t = [
        `a|slip off`,
        `a|strip out of`,
      ]
    }
  } else if (slot == setup.equipmentslot.genital) {
    if (unit.isHasVagina()) {
      if (eq.getTags().includes('dildo')) {
        t = PLUG_VERB
      } else {
        t = GENERIC
      }
    } else {
      if (eq.getTags().includes('chastity')) {
        t = RESTRAINT_VERB
      } else if (eq.getTags().includes('dickplug')) {
        t = PLUG_VERB
      } else {
        t = GENERIC
      }
    }

  } else if (slot == setup.equipmentslot.nipple) {
    if (eq.getTags().includes('nippleclamps')) {
      t = [
        `unclamp`,
        `remove`,
      ]
    } else if (eq.getTags().includes('nipplechains')) {
      t = [
        `unclamp`,
        `remove`,
      ]
    } else {
      t = GENERIC
    }

  } else if (slot == setup.equipmentslot.mouth) {
    if (eq.getTags().includes('mouthcover')) {
      t = [
        `a|take off`,
        `a|pull down`,
        `a|throw aside`,
      ]
    } else if (eq.getTags().includes('plaguemask')) {
      t = [
        `a|unmask from`,
        `a|discard`,
      ]
    } else if (eq.getTags().includes('dildogag')) {
      t = [
        `a|remove`,
        `a|take out the dildo from a|their throat and a|remove`,
      ]
    } else if (eq.getTags().includes('gag')) {
      t = GENERIC
    } else {
      t = GENERIC
    }

  } else if (slot == setup.equipmentslot.arms) {
    if (eq.getTags().includes('mitts') || eq.getTags().includes('hooves')) {
      t = [
        `a|unlock`,
        `somehow a|remove`,
      ]
    } else if (eq.getTags().includes('harness')) {
      t = HARNESS
    } else if (eq.getTags().includes('armor')) {
      t = ARMOR
    } else if (eq.getTags().includes('fake_clothes')) {
      t = [
        `"a|remove"`,
        `a|pretend to remove`,
        `a|mimic removing`,
      ]
    } else if (eq.getTags().includes('restraints')) {
      t = RESTRAINT_VERB
    } else {
      t = GENERIC
    }

  } else if (slot == setup.equipmentslot.feet) {
    if (eq.getTags().includes('hooves')) {
      t = [
        `a|get a|their a|feet out of`,
        `a|take a|their a|feet out of`,
      ]
    } else {
      t = [
        `a|get out`,
        `a|take off`,
      ]
    }

  } else {
    t = GENERIC
  }

  return setup.Text.replaceUnitMacros(t, { a: unit })
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Equipment} cover 
 */
function take_off_helper(unit, cover) {
  if (!cover) return ''
  if (!cover.isMakeBodypartUseless()) return ''
  const verb = setup.Text.Strip.verb(unit, cover)
  const base = `${verb} a|their ${cover} and`
  return setup.Text.replaceUnitMacros(
    base,
    {
      a: unit,
    }
  )
}

// "take off his pants and"
// "" (if no pants)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffpantsand = function (unit) {
  return take_off_helper(unit, unit.getGenitalCovering())
}

// "take off his shirt and"
// "" (if no shirt)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffshirtand = function (unit) {
  return take_off_helper(unit, unit.getChestCovering())
}


// "take off his clothes and"
// "" (if no clothes)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffequipmentand = function (unit) {
  if (unit.isNaked()) {
    return ''
  }

  const rep = setup.Text.Unit.Equipment.equipmentSummary(unit)

  return setup.Text.replaceUnitMacros([
    `a|take off a|their ${rep} and`,
    `a|strip out of a|their ${rep} and`,
    `a|get out of a|their ${rep} and`,
  ], { a: unit })
}


// "unfasten his ballgag and"
// "" (if no gag)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffmouthand = function (unit) {
  return take_off_helper(unit, unit.getEquipmentAt(setup.equipmentslot.mouth))
}


// "remove his blindfold and"
// "" (if no eye covering)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffeyesand = function (unit) {
  return take_off_helper(unit, unit.getEquipmentAt(setup.equipmentslot.eyes))
}


// "take out his buttplug and"
// "" (if no gag)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffanusand = function (unit) {
  return take_off_helper(unit, unit.getEquipmentAt(setup.equipmentslot.rear))
}


// "take out her dildo and"
// "remove their chastity and"
// "" (if no genital covering)
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Strip.takeoffgenitaland = function (unit) {
  return take_off_helper(unit, unit.getEquipmentAt(setup.equipmentslot.genital))
}
