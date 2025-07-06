// @ts-nocheck


/**
 * 
 * @param {setup.Unit} unit 
 * @returns {setup.EquipmentSet}
 */
setup.Text.Unit.Equipment.getEquipmentSetFallback = function (unit) {
  let equipmentset = unit.getEquipmentSet()
  if (!equipmentset) {
    return setup.EquipmentSet.getDefaultEquipmentSet(unit)
  } else {
    return equipmentset
  }
}

/**
 * 
 * @param {setup.Unit} unit 
 * @param {setup.EquipmentSlot} slot 
 * @returns {setup.Equipment | null}
 */
setup.Text.Unit.Equipment.getEquipmentAt = function (unit, slot) {
  let equipmentset = setup.Text.Unit.Equipment.getEquipmentSetFallback(unit)

  if (State.temporary.gSex && State.temporary.gSex.isParticipant(unit)) {
    const participant = State.temporary.gSex._getParticipant(unit)
    const tmp_equipment = participant.temporary_equipment[slot.key]

    // overridden temporarily
    if (tmp_equipment) {
      return setup.equipment[tmp_equipment]
    }

    // displaced temporarily
    if (participant.displaced_equipment[slot.key]) return null
  }

  // weapon is special case
  const equipment = equipmentset.getEquipmentAtSlot(slot)
  if (!equipment && slot == setup.equipmentslot.weapon) {
    if (unit.isSlave()) return null
    return unit.getDefaultWeapon()
  } else {
    return equipment
  }
}

/**
 * Returns the unit's weapon.
 * @param {setup.Unit} unit 
 * @returns {setup.Equipment | null}
 */
setup.Text.Unit.Equipment.getWeapon = function (unit) {
  return setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.weapon)
}

/**
 * Returns a text representation of the unit's weapon, if any.
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Equipment.getWeaponRep = function (unit) {
  const weapon = setup.Text.Unit.Equipment.getWeapon(unit)
  if (weapon) {
    return weapon.rep()
  } else {
    return ''
  }
}

/**
 * Returns a text representation of the unit's weapon complete with flavor, if any.
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Equipment.getWeaponRepFull = function (unit) {
  const weapon = setup.Text.Unit.Equipment.getWeapon(unit)
  if (weapon) {
    let base = weapon.rep()
    const text = weapon.getTexts()
    if (text?.flavor) base = `${base}. ${text.flavor}`
    return setup.Text.replaceUnitMacros(base, { a: unit })
  } else {
    return ''
  }
}


/**
 * Same with getWeaponRep, but appends an article in the front
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Unit.Equipment.getAWeaponRep = function (unit) {
  const weapon = setup.Text.Unit.Equipment.getWeapon(unit)
  if (weapon) {
    return `${setup.ArticleOnly(weapon.getName())} ${weapon.rep()}`
  } else {
    return ''
  }
}

/**
 * @param {setup.Unit} unit 
 * @returns {boolean}
 */
setup.Text.Unit.Equipment.isNaked = function (unit) {
  return (!setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.torso) &&
    !setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.legs) &&
    (!setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear) ||
      !setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear).getTags().includes('underwear')))
}

/**
 * @param {setup.Unit} unit 
 * @returns {boolean}
 */
setup.Text.Unit.Equipment.isFaceCovered = function (unit) {
  let equipment = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.head)
  return equipment && equipment.getTags().includes('coverface')
}

/**
 * @param {setup.Unit} unit 
 * @returns {boolean}
 */
setup.Text.Unit.Equipment.isChestCovered = function (unit) {
  let equipment = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.torso)
  return equipment && equipment.getSluttiness() < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD
}

/**
 * @param {setup.Unit} unit 
 * @returns {boolean}
 */
setup.Text.Unit.Equipment.isGenitalCovered = function (unit) {
  // outer layer
  let equipment = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.legs)
  if (equipment && equipment.getSluttiness() < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD) return true

  // underwear
  equipment = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear)
  if (equipment && equipment.getSluttiness() < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD) return true

  return false
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.EquipmentSlot} slot
 * @param {setup.Equipment} equipment 
 * @returns {string}
 */
function describeEquipment(unit, slot, equipment) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = `<<Their "${unit.key}">>`
  let they = `<<they "${unit.key}">>`
  let They = `<<They "${unit.key}">>`
  let them = `<<them "${unit.key}">>`

  let eqrep = equipment.rep()

  // special things
  let tags = equipment.getTags()

  /* Head */
  if (tags.includes('hat')) {
    return ` on which ${they} wear ${eqrep}`
  } else if (tags.includes('tiara')) {
    return ` above which ${they} wear a beautiful ${eqrep}`
  } else if (tags.includes('helmet')) {
    if (tags.includes('coverface')) {
      return `. It is entirely protected with ${eqrep}`
    } else {
      return ` on which ${they} wear ${eqrep}`
    }
  } else if (tags.includes('hood')) {
    return ` which is shrouded by ${eqrep}`
  } else if (tags.includes('headcover')) {
    let base = ` which is entirely covered by ${eqrep}`
    if (tags.includes('pet')) base += ` complete with leather pet ears and muzzle`
    if (tags.includes('pony')) base += ` complete with leather pony ears and muzzle`
    return base
  } else if (slot == setup.equipmentslot.head) {
    return ` on which ${they} wear ${eqrep}`
  }

  /* Neck */
  if (tags.includes('cape')) {
    return ` which is adorned by a ${eqrep} which flutters in the wind like some hero of legend`
  } else if (tags.includes('necklace')) {
    return ` which is adorned by ${their} ${eqrep}`
  } else if (tags.includes('choker')) {
    return `. ${They} wear the ${eqrep} around ${their} neck`
  } else if (tags.includes('bellcollar')) {
    return ` around which is attached a collar complete with a cow-bell, indicating them as nothing more than just livestock`
  } else if (tags.includes('collar')) {
    return `. ${They} wear ${eqrep} around ${their} neck signifying ${them} as the property and pet of ${their} betters`
  } else if (slot == setup.equipmentslot.neck) {
    return ` around which ${they} wear ${eqrep}`
  }

  /* Weapon does NOT have extra description */
  if (slot == setup.equipmentslot.weapon) {
    return ``
  }

  /* Torso, Legs, Arms is done last because they are "fallback" */

  /* Feet */
  if (slot == setup.equipmentslot.feet && tags.includes('hooves')) {
    return `. Their feet are equipped with ${eqrep} making it difficult if not impossible for ${them} to use ${their} feet to walk`
  } else if (slot == setup.equipmentslot.feet) {
    return ` wearing ${eqrep}`
  }

  /* Eyes */
  if (tags.includes('spectacles')) {
    return ` with a pair of ${eqrep}`
  } else if (tags.includes('eyemask')) {
    return ` which is obscured by ${their} ${eqrep}`
  } else if (tags.includes('ponyeyecover')) {
    return `. On both sides of ${their} eyes a piece of ${eqrep} jutted out, forcing ${them} to only be able to see forward`
  } else if (tags.includes('blindfold')) {
    return ` which is entirely covered by ${eqrep}, rendering ${them} effectively blind`
  } else if (slot == setup.equipmentslot.eyes) {
    return ` with a ${eqrep}`
  }

  /* Mouth */
  if (tags.includes('mouthcover')) {
    return ` which is covered by ${their} ${eqrep}`
  } else if (tags.includes('plaguemask')) {
    return ` which is hidden by ${their} ${eqrep}`
  } else if (tags.includes('bitgag')) {
    return ` which is gagged uncomfortably by ${eqrep} in the backs of ${their} mouth, preventing ${them} from using ${their} mouth for anything but drooling`
  } else if (tags.includes('dildogag')) {
    return ` which is forced open by ${eqrep} which is inserted deep reaching into ${their} throat`
  } else if (tags.includes('gag')) {
    return ` in which ${eqrep} was shoved in preventing ${them} from emitting any sound besides guttural moans`
  }
  // otherwise use default

  /* Nipple */
  if (tags.includes('nippleclamps')) {
    return `. ${Their} nipples are painfully clamped with ${eqrep}`
  } else if (tags.includes('nipplechains')) {
    return `. ${Their} nipples are painfully clamped with ${eqrep} which are connected with a length of chain`
  } else if (slot == setup.equipmentslot.nipple) {
    return ` which is adorned by ${eqrep}`
  }

  /* Rear */
  if (tags.includes('tailplug')) {
    if (tags.includes('pony')) {
      return ` which is stuffed with ${eqrep}. A pony-like tail jutted out of ${their} rear from the toy, which shakes and sways with ${their} every move`
    } else if (tags.includes('pet')) {
      return ` which is stuffed with ${eqrep}. A pet-like tail jutted out of ${their} rear from the toy, which shakes and sways with ${their} every move`
    } else if (slot == setup.equipmentslot.rear && tags.includes('dildo') && tags.includes('vegetable')) {
      return ` which is stuffed with ${eqrep}, its cold and fresh exterior intensely stimulating ${them}`
    } else if (slot == setup.equipmentslot.rear && tags.includes('dildo')) {
      return ` which is stuffed with ${eqrep}, giving ${them} constant stimulation`
    }
    // use the buttplug one
  }
  if (tags.includes('buttplug')) {
    return ` which is stuffed with ${eqrep}, giving constant pressure to ${their} anus`
  }

  /* Dick */
  if (slot == setup.equipmentslot.genital && tags.includes('dick') && tags.includes('chastity')) {
    return `. A ${eqrep} is installed on ${their} dick, preventing it from ever becoming erect`
  } else if (tags.includes('dickplug')) {
    return `. ${eqrep} is painfully inserted into the urethra plugging ${their} dick and preventing the cum from ever coming out`
  }

  /* Vagina */
  if (slot == setup.equipmentslot.genital && tags.includes('vagina') && tags.includes('chastity')) {
    return `. A ${eqrep} is installed covering their vagina, preventing ${them} from climaxing`
  } else if (slot == setup.equipmentslot.genital && tags.includes('dildo') && tags.includes('vegetable')) {
    return ` which is stuffed with ${eqrep}, its cold and fresh exterior stimulating ${their} vagina`
  } else if (slot == setup.equipmentslot.genital && tags.includes('dildo')) {
    return ` which is stuffed with ${eqrep}, giving constant stimulation to ${their} vagina`
  }

  /* special ones */
  if (tags.includes('mitts')) {
    return `. ${Their} fists are forced into a ball inside ${eqrep}`
  }
  if (tags.includes('hooves')) {
    return `. Their fists are equipped with ${eqrep} making it impossible for ${them} to use ${their} hands for anything`
  }
  if (tags.includes('harness')) {
    return ` which is covered with ${eqrep} which doubles as handles for fucking ${them}`
  }
  if (tags.includes('ring')) {
    return `. ${They} wear the ${eqrep} in one of ${their} fingers`
  }
  if (tags.includes('fake_clothes')) {
    return `, which is supposedly "covered" by ${their} "invisible" ${eqrep}`
  }

  /* generic ones */
  let sluttiness = equipment.getSluttiness()
  let verb = ''
  let afterword = ''

  // generic equipment
  if (tags.includes('armor')) {
    if (sluttiness < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD) {
      verb = 'protected'
    } else if (sluttiness < setup.EQUIPMENT_SLUTTY_THRESHOLD) {
      verb = 'protected'
      afterword = 'despite being somewhat slutty-looking'
    } else {
      verb = 'protected'
      afterword = 'although its questionable how much protection it gives given the amount of skin it actually cover'
    }
  } else if (tags.includes('restraints')) {
    if (sluttiness < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD) {
      verb = 'restrained'
    } else if (sluttiness < setup.EQUIPMENT_SLUTTY_THRESHOLD) {
      verb = 'restrained'
      afterword = `which does little to hide ${their} genitals`
    } else {
      verb = 'restrained'
      afterword = `which is designed to reveal as much as ${their} body as possible`
    }
  } else {
    if (sluttiness < setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD) {
      verb = 'covered'
    } else if (sluttiness < setup.EQUIPMENT_SLUTTY_THRESHOLD) {
      verb = 'barely covered'
      afterword = `which still reveal much of ${their} body`
    } else {
      verb = '"covered"'
      afterword = 'which leave very little to the imagination'
    }
  }

  let base = ` which is ${verb} by ${their} ${eqrep}`
  if (afterword) base += ` ${afterword}`

  if (slot == setup.equipmentslot.torso && unit.isHasTrait(setup.trait.muscle_verystrong) && equipment.isCovering()) {
    base += `. ${Their} clothes is straining to contain ${unit.getName()}'s bulging muscles and looks like it's going to rip any time soon`
  }

  return base
}

setup.Text.Unit.Equipment.slot = function (unit, slot) {
  // unit has a tall muscular body{return_value}.
  // unit has an average-sized dick{return_value}.
  // for example, if unit is wearing nothing you can return ' which is covered by nothing'
  let equipment = setup.Text.Unit.Equipment.getEquipmentAt(unit, slot)
  let their = `<<their "${unit.key}">>`
  let Their = `<<Their "${unit.key}">>`
  let they = `<<they "${unit.key}">>`
  let They = `<<They "${unit.key}">>`
  let them = `<<them "${unit.key}">>`

  if (!equipment) {
    if ([
      setup.equipmentslot.head,
      setup.equipmentslot.neck,
      setup.equipmentslot.eyes,
      setup.equipmentslot.mouth,
      setup.equipmentslot.weapon,
      setup.equipmentslot.nipple,
      setup.equipmentslot.rear,
      setup.equipmentslot.genital,
    ].includes(slot)) {
      // no comment for these
      return ''
    }
    if (slot == setup.equipmentslot.neck) {
      return ' which remains bare'
    }
    if (slot == setup.equipmentslot.torso) {
      return `. ${Their} torso is entirely uncovered revealing ${their} ${setup.Text.Unit.Trait.breast(unit, /* eq = */ true)}`
    }
    if (slot == setup.equipmentslot.arms) {
      return ` which remains bare-fisted`
    }
    if (slot == setup.equipmentslot.legs) {
      if (setup.Text.Unit.Equipment.isGenitalCovered(unit)) {
        return `. While ${they} wear no pants, ${unit.getName()}'s genitals are covered by ${their} underwear`
      } else {
        return `. Nothing is covering the legs revealing ${their} ${setup.Text.Unit.Trait.genital(unit, /* eq = */ false)}`
      }
    }
    if (slot == setup.equipmentslot.feet) {
      return ` and ${they} remain bare-footed`
    }
    throw new Error(`Unknown slot ${slot.key}`)
  }

  let base = describeEquipment(unit, slot, equipment)
  const texts = equipment.getTexts()
  if (texts.flavor) {
    base = `${base}. ${texts.flavor}`
  }
  return setup.Text.replaceUnitMacros(base, { a: unit })
}

// summary of the unit's equipment.
setup.Text.Unit.Equipment.equipmentSummary = function (unit) {
  let pertraits = unit.getAllTraitsWithTag('equipment')
  let adjectives = []
  if (pertraits.includes(setup.trait.eq_valuable)) {
    adjectives.push('valuable')
  }
  if (pertraits.includes(setup.trait.eq_veryvaluable)) {
    adjectives.push('very valuable')
  }
  if (pertraits.includes(setup.trait.eq_slutty)) {
    adjectives.push('slutty')
  }
  if (pertraits.includes(setup.trait.eq_veryslutty)) {
    adjectives.push('very slutty')
  }
  let props = []
  if (pertraits.includes(setup.trait.eq_chastity)) {
    props.push('chastity')
  }
  if (pertraits.includes(setup.trait.eq_restrained) || pertraits.includes(setup.trait.eq_blind)) {
    props.push('bondage')
  }
  if (pertraits.includes(setup.trait.eq_pony)) {
    if (pertraits.includes(setup.trait.eq_pet)) {
      props.push('pony-pet')
    } else {
      props.push('pony')
    }
  } else if (pertraits.includes(setup.trait.eq_pet)) {
    props.push('pet')
  }

  if (!props.length && !adjectives.length) {
    if (setup.Text.Unit.Equipment.isNaked(unit)) return 'nothing at all'
    props.push('basic')
  }

  let subject = null

  // determine what kind of gear they wear
  if (setup.Text.Unit.Equipment.isNaked(unit)) {
    subject = 'naked gear'
  } else {
    let torso = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.torso)
    if (!torso) {
      subject = 'topless gear'
    } else {
      let torsotags = torso.getTags()
      if (torsotags.includes('armor')) {
        subject = 'armor'
      } else if (torsotags.includes('harness')) {
        subject = 'gear'
      } else if (torsotags.includes('restraints')) {
        subject = 'restraints'
      } else if (torsotags.includes('clothes')) {
        subject = 'clothes'
      } else if (torsotags.includes('fake_clothes')) {
        subject = '"clothes"'
      } else {
        subject = 'gear'
      }
    }
  }

  return `${adjectives.join(' and ')} ${props.join(' ')} ${subject}`
}

setup.Text.Unit.Equipment.stripTorso = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let torso = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.torso)
  if (!torso) return ''   // nothing to strip

  if (torso.getTags().includes('harness')) {
    return `${Their} hands fumble desperately with the bindings of \
    ${their} ${torso.rep()} and ${they} hyperventilates within \
    its embrace as ${they} strips.`
  } else if (torso.getTags().includes('armor')) {
    return `${They} hurriedly attempted to get out of ${their} protective ${torso.rep()}, ` +
      `during which ${they} tripped over and fell flat.`
  } else if (torso.getTags().includes('restraints')) {
    return `You unlocks ${their} ${torso.rep()} to allow them to strip it, still with great difficulty.`
  } else if (torso.getTags().includes('fake_clothes')) {
    return `${They} tried to get out of ${their} "invisible" ${torso.rep()}, but you are not convinced the clothes exist at all.`
  } else {
    return `${They} pulls ${their} ${torso.rep()} over ${their} head revealing ${their} ${setup.Text.Unit.Trait.torso(unit)}.`
  }
}

setup.Text.Unit.Equipment.stripLegs = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let legs = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.legs)
  let underwear = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear)

  let text = ''

  if (legs) {
    if (unit == State.variables.unit.player) {
      return `You take off your ${legs.rep()}.`
    }
    if (legs.getTags().includes('harness')) {
      text += `${They} scrambles to unfasten the bindings on ${their} \
      ${legs.rep()} as fast as ${they} can,`
    } else if (legs.getTags().includes('armor')) {
      text += `${They} struggles to get their legs of ${their} protective ${legs.rep()},`
    } else if (legs.getTags().includes('fake_clothes')) {
      text += `${They} "gets out" of ${their} "invisible" ${legs.rep()},`
    } else if (legs.getTags().includes('restraints')) {
      text += `Using an iron key, you unlocks ${their} ${legs.rep()}, `
    } else {
      text += `${They} hastily pulls ${their} ${legs.rep()} down `
    }
    if (underwear) {
      text += ` revealing ${their} ${underwear.rep()}.`
    } else {
      text += ` revealing ${their} ${setup.Text.Unit.Trait.genital(unit, true)}.`
    }
  }

  if (underwear) {
    if (unit == State.variables.unit.player) {
      return `You take off your ${underwear.rep()}.`
    }
    let found = false
    if (underwear.getTags().includes('harness')) {
      text += `One by one, ${they} unbind the fastenings on ${their} ${underwear.rep()},`
      found = true
    } else if (underwear.getTags().includes('armor')) {
      text += `${They} gave up what little protection ${their} ${underwear.rep()} offered,`
      found = true
    } else if (underwear.getTags().includes('restraints')) {
      text += `You free them out of ${their} ${underwear.rep()},`
      found = true
    } else if (underwear.getTags().includes('fake_clothes')) {
      text += `${They} "strips out" of ${their} "invisible" ${legs.rep()}, before making a gesture throwing it away,`
    } else if (underwear.getTags().includes('clothes')) {
      text += `Unceremoniously ${their} ${underwear.rep()} are thrown aside,`
      found = true
    }
    if (found) {
      text += ` revealing ${their} ${setup.Text.Unit.Trait.genital(unit)}.`
    }
  }
  return text
}

setup.Text.Unit.Equipment.stripVagina = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let vagina = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.genital)
  if (!vagina) return ''   // nothing to strip
  let tags = vagina.getTags()

  if (tags.includes('vegetable')) {
    return `You grab the cold and fresh ${vagina.rep()} stuck deep inside ${their} vagina and pull the poor vegetable out.`
  } else if (tags.includes('dildo')) {
    return `You removed the ${vagina.rep()} plugged deep inside ${their} vagina, eliciting a moan.`
  } else {
    return `You removed ${their} ${vagina.rep()} from their vagina`
  }
}

setup.Text.Unit.Equipment.stripDick = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)
  let them = setup.DOM.PronounYou.them(unit)

  let dick = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.genital)
  if (!dick) return ''   // nothing to strip
  let tags = dick.getTags()

  if (tags.includes('chastity')) {
    return `With a glistening key you unlocked ${their} ${dick.rep()}, freeing their cock for the time being`
  } else if (tags.includes('dickplug')) {
    return `${dick.rep()} is painfully inserted into ${their} urethra, which you order ${them} to remove`
  } else {
    return `${Their} dick is adorned with ${dick.rep()}`
  }
}

setup.Text.Unit.Equipment.stripNipple = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let nipple = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.nipple)
  if (!nipple) return ''   // nothing to strip
  let tags = nipple.getTags()

  if (tags.includes('nippleclamps')) {
    return `${Their} nipples are constantly pinched with ${nipple.rep()}, \
    which keeps them hard even after you took it off.`
  } else if (tags.includes('nipplechains')) {
    return `${Their} nipples are constantly pinched with ${nipple.rep()}, \
    which keeps them hard even after you took it off.`
  } else {
    return `${Their} nipples are adorned with ${nipple.rep()}`
  }
}


setup.Text.Unit.Equipment.stripGenital = function (unit) {
  if (unit.isHasDick()) {
    return setup.Text.Unit.Equipment.stripDick(unit)
  } else {
    return setup.Text.Unit.Equipment.stripVagina(unit)
  }
}


setup.Text.Unit.Equipment.stripAnus = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let anus = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear)
  if (!anus) return ''   // nothing to strip
  let tags = anus.getTags()

  if (tags.includes('vegetable')) {
    return `You grab the cold and fresh ${anus.rep()} stuck deep inside ${their} vagina and pull the poor vegetable out.`
  } else if (tags.includes('buttplug') || tags.includes('dildo')) {
    return `${Their} ${anus.rep()} pressed against ${their} inner walls as ${they} struggle to remove it.`
  } else {
    return `${They} removed their ${anus.getTags()} from ${their} ${setup.Text.Unit.Trait.anus(unit)}.`
  }
}


setup.Text.Unit.Equipment.youStripAnus = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)
  let them = setup.DOM.PronounYou.them(unit)

  let anus = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.rear)
  if (!anus) return ''   // nothing to strip
  let tags = anus.getTags()

  if (tags.includes('buttplug') || tags.includes('dildo')) {
    return `You slowly removed ${their} ${anus.rep()} making sure the bulge presses against ${their} inner walls, eliciting moans from ${them}.`
  } else {
    return `You removed ${their} ${anus.getTags()} from their ${setup.Text.Unit.Trait.anus(unit)}.`
  }
}


setup.Text.Unit.Equipment.stripMouth = function (unit) {
  let their = setup.DOM.PronounYou.their(unit)
  let Their = setup.DOM.PronounYou.Their(unit)
  let they = setup.DOM.PronounYou.they(unit)
  let They = setup.DOM.PronounYou.They(unit)

  let mouth = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot.mouth)
  if (!mouth) return ''   // nothing to strip
  let tags = mouth.getTags()

  if (tags.includes('mouthcover')) {
    return `${They} pulled down ${their} ${mouth.rep()} and throw it aside.`
  } else if (tags.includes('plaguemask')) {
    return `${They} unmasked and place ${their} ${mouth.rep()} aside.`
  } else if (tags.includes('dildogag')) {
    return `${They} removes the dildo from ${their} throat, leaving the ring gag in place. \
    Able to breathe through ${their} ${setup.Text.Unit.Trait.mouth(unit)} \
    for the first time in a while, \
    ${they} gasps gratefully, knowing the respite will be brief.`
  } else if (tags.includes('gag')) {
    return `You unfastens the ${mouth.rep()} from ${their} ${setup.Text.Unit.Trait.mouth(unit)}. \
    Able to breathe through ${their} ${setup.Text.Unit.Trait.mouth(unit)} \
    for the first time in a while, \
    ${they} gasps gratefully, knowing the respite will be brief.`
  } else {
    return `${They} removes the ${mouth.rep()} covering ${their} ${setup.Text.Unit.Trait.mouth(unit)}.`
  }
}


setup.Text.Unit.Equipment.slaverStripAll = function (unit) {
  if (setup.Text.Unit.Equipment.isNaked(unit)) return ''
  let eq = setup.Text.Unit.Equipment.equipmentSummary(unit)
  return `Your slavers stripped the ${eq} from ${unit.getName()}, leaving <<them "${unit.key}">> entirely naked.`
}
