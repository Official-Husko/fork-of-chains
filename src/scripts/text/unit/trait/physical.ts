// @ts-nocheck


setup.Text.Unit.Trait._EquipmentHelper = function (unit, base, is_with_equipment, slot) {
  if (!is_with_equipment) return base
  return `${base}${setup.Text.Unit.Equipment.slot(unit, slot)}`
}

/**
 * @returns {string}
 */
function strapOnText() {
  return setup.rng.choice([
    `strap-on`,
    `fake dick`,
    `rubber dick`,
    `phallus`,
  ])
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 * @returns {string}
 */
setup.Text.Unit.Trait.dick = function (unit, is_with_equipment) {
  const genital_eq = unit.getEquipmentAt(setup.equipmentslot.genital)
  if (genital_eq && genital_eq.getTags().includes('strapon')) {
    // special case. Only happen during sex.
    return strapOnText()
  }
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'dickshape')
  let dick = unit.getTraitWithTag('dick')
  if (!dick) return ''

  const dickname = setup.sexbodypart.penis.repSimple(unit)

  let base = `${setup.sexbodypart.penis.repSizeAdjective(unit)} ${skin} ${dickname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.genital)
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 * @returns {string}
 */
setup.Text.Unit.Trait.dickhead = function (unit, is_with_equipment) {
  return setup.sexbodypart.penis.repTip(unit)
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 * @returns {string}
 */
setup.Text.Unit.Trait.dickorstrap = function (unit, is_with_equipment) {
  if (!unit.isHasDick()) {
    return strapOnText()
  } else {
    return setup.Text.Unit.Trait.dick(unit, is_with_equipment)
  }
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 * @returns {string}
 */
setup.Text.Unit.Trait.cum = function (unit, is_with_equipment) {
  if (unit.isHasDick()) {
    return setup.rng.choice([
      `cum`,
      `cum`,
      `cum`,
      `ejaculate`,
      `cockmilk`,
    ])
  } else {
    return setup.rng.choice([
      `pussyjuice`,
      `girlcum`,
    ])
  }
}

setup.Text.Unit.Trait.balls = function (unit, is_with_equipment) {
  let balls = unit.getTraitWithTag('balls')
  if (!balls) return ''
  let base = `${balls.repSizeAdjective()} balls`
  return base
}

setup.Text.Unit.Trait.vagina = function (unit, is_with_equipment) {
  let vagina = unit.getTraitWithTag('vagina')
  if (!vagina) return ''

  const vaginaname = setup.sexbodypart.vagina.repSimple(unit)
  let base = `${setup.sexbodypart.vagina.repSizeAdjective(unit)} ${vaginaname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.genital)
}

setup.Text.Unit.Trait.anus = function (unit, is_with_equipment) {
  let anus = unit.getTraitWithTag('anus')
  if (!anus) return ''

  const anusname = setup.sexbodypart.anus.repSimple(unit)
  let base = `${setup.sexbodypart.vagina.repSizeAdjective(unit)} ${anusname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.rear)
}

setup.Text.Unit.Trait.hole = function (unit, is_with_equipment) {
  if (unit.isHasVagina()) {
    return setup.Text.Unit.Trait.vagina(unit, is_with_equipment)
  } else {
    return setup.Text.Unit.Trait.anus(unit, is_with_equipment)
  }
}

setup.Text.Unit.Trait.tongue = function (unit, is_with_equipment) {
  if (unit.isHasTrait('mouth_demon')) {
    return `elongated tongue`
  } else {
    return `tongue`
  }
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 */
setup.Text.Unit.Trait.genital = function (unit, is_with_equipment) {
  if (unit.isHasStrapOn()) {
    return `strapon`
  }
  let dick = unit.getTraitWithTag('dick')
  let balls = unit.getTraitWithTag('balls')
  let vagina = unit.getTraitWithTag('vagina')
  let base = null
  if (dick) {
    base = setup.Text.Unit.Trait.dick(unit, is_with_equipment)
    /*
    if (balls) {
      if (is_with_equipment) {
        base = `${base}. Under <<their "${unit.key}">> dick hangs a ${setup.Text.Unit.Trait.balls(unit, is_with_equipment)}`
      } else {
        base = `${base} and ${setup.Text.Unit.Trait.balls(unit, is_with_equipment)}`
      }
    } else {
      if (is_with_equipment) {
        base = `${base}. There are nothing but smooth skin under <<their "${unit.key}">> dick`
      } else {
        base = `balls-less ${base}`
      }
    }
    */
  } else if (vagina) {
    base = setup.Text.Unit.Trait.vagina(unit, is_with_equipment)
  } else {
    base = `smooth genital area`
  }
  return base
}

setup.Text.Unit.Trait.breast = function (unit, is_with_equipment) {
  let breast = unit.getTraitWithTag('breast')
  let base = null

  const breastname = setup.sexbodypart.breasts.repSimple(unit)
  if (breast) {
    base = `${setup.sexbodypart.breasts.repSizeAdjective(unit)} \
    ${setup.Text.Unit.Trait.skinAdjective(unit, 'body')} \
    ${breastname}`
  } else {
    let muscular = ''
    if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
      muscular = 'extremely ripped'
    } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
      muscular = 'ripped'
    } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
      muscular = 'well-defined'
    } else {
      muscular = 'manly'
    }
    base = `${muscular} \
    ${setup.Text.Unit.Trait.skinAdjective(unit, 'body')} \
    ${breastname}`
  }
  if (!is_with_equipment) return base
  return `${base}${setup.Text.Unit.Equipment.slot(unit, setup.equipmentslot.nipple)}`
}


setup.Text.Unit.Trait.cleavage = function (unit, is_with_equipment) {
  let t
  if (unit.isHasTrait('breast_huge')) {
    t = [
      `cleavage`,
      `deep valleys`,
    ]
  } else if (unit.isHasTrait('breast_large')) {
    t = [
      `cleavage`,
    ]
  } else if (unit.isHasTrait('breast_small')) {
    t = [
      `cleavage`,
      `modest cleavage`,
      `small cleavage`,
    ]
  } else if (unit.isHasTrait('muscle_verystrong')) {
    t = [
      `pec cleavage`,
    ]
  } else {
    t = [
      `non-existent cleavage`,
      `flat cleavage`,
    ]
  }
  return setup.rng.choice(t)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cbreast = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.torso)
  if (clothes?.isCovering()) return clothes.rep()
  return setup.Text.Unit.Trait.breast(unit)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cfeet = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.feet)
  if (clothes?.isCovering()) return clothes.rep()
  return setup.Text.Unit.Trait.feet(unit)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cgenital = function (unit) {
  const legs = unit.getEquipmentAt(setup.equipmentslot.legs)
  let eq = null
  if (legs?.isCovering()) eq = legs

  const underwear = unit.getEquipmentAt(setup.equipmentslot.rear)
  if (!eq && underwear?.isCovering()) eq = underwear

  if (!eq) return setup.Text.Unit.Trait.genital(unit)

  // bulge description
  let bulge = ''
  if (unit.isHasTrait('dick_titanic')) {
    bulge = 'enormous bulge'
  } else if (unit.isHasTrait('dick_huge')) {
    bulge = 'massive bulge'
  } else if (unit.isHasTrait('dick_large')) {
    bulge = 'large bulge'
  } else if (unit.isHasTrait('dick_medium')) {
    bulge = 'bulge'
  } else if (unit.isHasTrait('dick_small')) {
    bulge = 'small bulge'
  } else if (unit.isHasTrait('dick_tiny')) {
    bulge = 'tiny bulge'
  }
  if (bulge) {
    return bulge
  }
  return `covered ${setup.Text.Unit.Trait.genital(unit)}`
}

/**
 * @param {setup.Unit} unit 
 * @param {*} is_with_equipment 
 */
setup.Text.Unit.Trait.face = function (unit, is_with_equipment) {
  let face_trait = unit.getTraitWithTag('face')

  let t
  if (face_trait) {
    t = [
      face_trait.repSizeAdjective()
    ]
  } else {
    t = [
      ``,
      `average-looking`,
    ]
  }

  if (face_trait == setup.trait.face_attractive) {
    if (unit.isSissy()) {
      t = t.concat([
        'androginously beautiful',
      ])
    } else if (unit.isFemale()) {
      t = t.concat([
        'beautiful',
      ])
    } else {
      t = t.concat([
        'handsome',
      ])
    }
  } else if (face_trait == setup.trait.face_beautiful) {
    if (unit.isSissy()) {
      t = t.concat([
        'androgynously beautiful'
      ])
    } else if (unit.isFemale()) {
      t = t.concat([
        'exquisitely beautiful'
      ])
    } else {
      t = t.concat([
        'ruggedly handsome'
      ])
    }
  } else if (unit.isSissy()) {
    t = t.concat([
      'androgynous'
    ])
  }

  let base = `${setup.rng.choice(t)} face`
  if (is_with_equipment) {
    if (setup.Text.Unit.Equipment.isFaceCovered(unit)) {
      base += ` (which is not visible since <<their "${unit.key}">> face is covered by <<their "${unit.key}">> equipment)`
    }
  }
  return base
}

setup.Text.Unit.Trait.head = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'body')
  let base = `${skin} head`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.head)
}

setup.Text.Unit.Trait.eyes = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'eyes')
  let base = `${skin} eyes`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.eyes)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.ceyes = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.eyes)
  if (clothes?.isCovering()) return clothes.rep()
  return setup.Text.Unit.Trait.eyes(unit)
}

setup.Text.Unit.Trait.mouth = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'mouth')
  let trait = unit.getTraitWithTag('mouth')
  let base = setup.sexbodypart.mouth.repSimple(unit)
  base = `${skin} ${base}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.mouth)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cmouth = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.mouth)
  if (clothes) return clothes.rep()
  return setup.Text.Unit.Trait.mouth(unit)
}

setup.Text.Unit.Trait.teeth = function (unit, is_with_equipment) {
  const trait = unit.getTraitWithTag('mouth')
  if (trait && trait.getTags().includes('fangs')) {
    return `fangs`
  } else {
    return `teeth`
  }
}

setup.Text.Unit.Trait.ears = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'ears')
  let base = `${skin} ears`
  // no ear equipment
  return base
}

setup.Text.Unit.Trait.horns = function (unit, is_with_equipment) {
  let skin = unit.getTraitWithTag('ears')
  if (skin == setup.trait.ears_demon) {
    const adj = setup.rng.choice([``, `demonic`, `curved`])
    return `${adj} horns`
  } else {
    return ''
  }
}

setup.Text.Unit.Trait.ass = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'body')
  const assname = setup.rng.choice(['ass', 'butts',])
  let base = `${skin} ${assname}`
  // no ass equipment
  return base
}

setup.Text.Unit.Trait.nipple = function (unit, is_with_equipment) {
  return 'nipple'
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cnipple = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.nipple)
  if (clothes?.getTags().includes('nipples')) return clothes
  return setup.Text.Unit.Trait.nipple(unit)
}

setup.Text.Unit.Trait.nipples = function (unit, is_with_equipment) {
  return 'nipples'
}

setup.Text.Unit.Trait.torso = function (unit, is_with_equipment) {
  let texts = []

  let height_trait = unit.getTraitWithTag('height')
  if (height_trait) texts.push(height_trait.repSizeAdjective())

  let muscular_text = setup.Text.Unit.Trait.muscular(unit)
  if (muscular_text) texts.push(muscular_text)

  let body_text = setup.Text.Unit.Trait.skinAdjective(unit, 'body')

  const bodyname = setup.rng.choice(['body', 'bod', 'torso', 'figure',])

  let base = `${texts.join(' and ')} ${body_text} ${bodyname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.torso)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.ctorso = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.torso)
  if (clothes) return clothes.rep()
  return setup.Text.Unit.Trait.torso(unit)
}

setup.Text.Unit.Trait.back = function (unit, is_with_equipment) {
  let muscular_text = setup.Text.Unit.Trait.muscular(unit)
  let body_text = setup.Text.Unit.Trait.skinAdjective(unit, 'body')
  return `${muscular_text} ${body_text} back`
}

setup.Text.Unit.Trait.waist = function (unit, is_with_equipment) {
  let t
  if (unit.isHasTrait('muscle_extremelystrong')) {
    t = [
      `freakishly muscular waist`,
      `waist`,
    ]
  } else if (unit.isHasTrait('muscle_verystrong')) {
    t = [
      `muscular waist`,
      `waist`,
    ]
  } else if (unit.isHasTrait('muscle_strong')) {
    t = [
      `toned waist`,
      `waist`,
    ]
  } else if (unit.isHasTrait('muscle_extremelythin')) {
    t = [
      `unnaturally narrow waist`,
      `waist`,
    ]
  } else if (unit.isHasTrait('muscle_verythin')) {
    t = [
      `very narrow waist`,
      `waist`,
    ]
  } else if (unit.isHasTrait('muscle_thin')) {
    t = [
      `narrow waist`,
      `waist`,
    ]
  } else {
    t = [
      `waist`,
    ]
  }
  return setup.rng.choice(t)
}

setup.Text.Unit.Trait.belly = function (unit, is_with_equipment) {
  let t
  if (unit.isHasTrait('muscle_extremelystrong')) {
    t = [
      `eight-packs`,
      `freakishly ripped abs`,
    ]
  } else if (unit.isHasTrait('muscle_verystrong')) {
    t = [
      `six-packs`,
      `ripped abs`,
      `shredded abs`,
    ]
  } else if (unit.isHasTrait('muscle_strong')) {
    t = [
      `well-defined abs`,
      `defined abs`,
      `toned abs`,
    ]
  } else if (unit.isHasTrait('muscle_extremelythin')) {
    t = [
      `extremely thin stomach`,
      `unnaturally skinny belly`,
    ]
  } else if (unit.isHasTrait('muscle_verythin')) {
    t = [
      `very thin stomach`,
      `thin belly`,
      `skinny belly`,
    ]
  } else if (unit.isHasTrait('muscle_thin')) {
    t = [
      `thin stomach`,
      `belly`,
    ]
  } else {
    t = [
      `belly`,
      `abs`,
      `stomach`,
    ]
  }
  return setup.rng.choice(t)
}

setup.Text.Unit.Trait.neck = function (unit, is_with_equipment) {
  let adjective = ''
  if (unit.isHasTrait(setup.trait.muscle_strong)) {
    if (unit.isFemale()) {
      adjective = 'strong'
    } else {
      adjective = 'broad shoulders and thick'
    }
  } else {
    adjective = ''
  }
  return setup.Text.Unit.Trait._EquipmentHelper(
    unit,
    `${adjective} neck`,
    is_with_equipment,
    setup.equipmentslot.neck,
  )
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.cneck = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.neck)
  if (clothes) return clothes.rep()
  return setup.Text.Unit.Trait.neck(unit)
}

setup.Text.Unit.Trait.wings = function (unit, is_with_equipment) {
  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'wings')
  if (!skin) return ''
  let restraintext = ''
  if (unit.isHasTrait(setup.trait.eq_restrained)) {
    restraintext = ', which are rendered useless by their restraints'
  }
  return `${skin} wings${restraintext}`
}

setup.Text.Unit.Trait.arms = function (unit, is_with_equipment) {
  let muscular = ''
  if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
    muscular = 'extremely muscular'
  } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
    muscular = 'rock-hard'
  } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
    muscular = 'powerful'
  } else if (unit.isHasTrait(setup.trait.muscle_extremelythin)) {
    muscular = 'skinny'
  } else if (unit.isHasTrait(setup.trait.muscle_verythin)) {
    muscular = 'skinny'
  } else if (unit.isHasTrait(setup.trait.muscle_thin)) {
    muscular = 'slim'
  }

  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'arms')
  const armname = setup.sexbodypart.arms.repSimple(unit)
  let base = `${muscular} ${skin} ${armname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.arms)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.carms = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.arms)
  if (clothes) return clothes.rep()
  return setup.Text.Unit.Trait.arms(unit)
}

setup.Text.Unit.Trait.hand = function (unit, is_with_equipment) {
  let armstrait = unit.getTraitWithTag('arms')
  let skin = 'hand'

  if (armstrait) {
    if (armstrait == setup.trait.arms_werewolf ||
      armstrait == setup.trait.arms_neko) {
      skin = 'paw'
    }
  }
  return skin
}

setup.Text.Unit.Trait.hands = function (unit, is_with_equipment) {
  return `${setup.Text.Unit.Trait.hand(unit, is_with_equipment)}s`
}

setup.Text.Unit.Trait.legs = function (unit, is_with_equipment) {
  let muscular = ''
  if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
    muscular = 'swole'
  } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
    muscular = 'muscly'
  } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
    muscular = 'toned'
  } else if (unit.isHasTrait(setup.trait.muscle_extremelythin)) {
    muscular = 'extremely skinny'
  } else if (unit.isHasTrait(setup.trait.muscle_verythin)) {
    muscular = 'skinny'
  } else if (unit.isHasTrait(setup.trait.muscle_thin)) {
    muscular = 'slim'
  }

  let skin = setup.Text.Unit.Trait.skinAdjective(unit, 'legs')
  const legname = setup.sexbodypart.legs.repSimple(unit)
  let base = `${muscular} ${skin} ${legname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.legs)
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.clegs = function (unit) {
  const clothes = unit.getEquipmentAt(setup.equipmentslot.legs)
  if (clothes?.isCovering()) return clothes.rep()
  return setup.Text.Unit.Trait.legs(unit)
}

setup.Text.Unit.Trait.feet = function (unit, is_with_equipment, is_singular) {
  // feet skin is a special case of skin, based on the legs
  let legtrait = unit.getTraitWithTag('legs')
  let skin = ''

  if (legtrait) {
    if (legtrait == setup.trait.legs_werewolf) {
      skin = 'digitrade'
    } else if (legtrait == setup.trait.legs_dragonkin || legtrait == setup.trait.legs_neko) {
      skin = 'clawed'
    } else if (legtrait == setup.trait.legs_demon) {
      skin = 'hooved'
    } else {
      throw new Error(`Unknown legs: ${legtrait.key}`)
    }
  }

  let feetname = `feet`
  if (is_singular) {
    feetname = 'foot'
  }
  let base = `${skin} ${feetname}`
  return setup.Text.Unit.Trait._EquipmentHelper(unit, base, is_with_equipment, setup.equipmentslot.feet)
}

setup.Text.Unit.Trait.foot = function (unit, is_with_equipment) {
  return setup.Text.Unit.Trait.feet(unit, is_with_equipment, /* singular = */ true)
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} [is_with_equipment]
 * @param {boolean} [is_with_adjective]
 */
setup.Text.Unit.Trait.skin = function (unit, is_with_equipment, is_with_adjective) {
  const body = unit.getTraitWithTag('body')
  if (body) {
    const text = body.text()
    let adj = ''
    if (is_with_adjective && text.adj_extra) {
      adj = setup.rng.choice(text.adj_extra) + ' '
    }
    if (text && text.noun_extra) {
      return `${adj}${setup.rng.choice(text.noun_extra)}`
    }
  }
  let adj = ''
  if (is_with_adjective) {
    adj = setup.rng.choice([
      'tender', 'soft',
    ])
  }
  if (adj) adj = adj + ' '
  return `${adj}skin`
}

setup.Text.Unit.Trait.tail = function (unit, is_with_equipment) {
  if (!unit.getTail()) return ''
  const base = setup.sexbodypart.tail.repSimple(unit)
  if (Math.random() < 0.7) return base
  let tail = unit.getTraitWithTag('tail')
  if (tail == setup.trait.tail_werewolf) {
    return `fully wolf-like ${base}`
  } else if (tail == setup.trait.tail_neko) {
    return `long and slender cat-like ${base}`
  } else if (tail == setup.trait.tail_dragonkin) {
    return `thick and powerful dragon ${base}`
  } else if (tail == setup.trait.tail_demon) {
    return `sharp demonic ${base}`
  } else {
    throw new Error(`Unrecognizable tail: ${tail.key}`)
  }
}

/**
 * @param {setup.Unit} unit 
 * @param {*} [is_with_equipment]
 */
setup.Text.Unit.Trait.ctail = function (unit, is_with_equipment) {
  const tail = unit.getTail()
  const plug = unit.getTailPlug()

  let t
  if (tail && !plug) {
    t = [
      setup.Text.Unit.Trait.tail(unit, is_with_equipment)
    ]
  } else if (plug && !tail) {
    t = [
      plug.rep()
    ]
  } else if (plug && tail) {
    t = [
      `real and fake tail`,
      `real tail and tailplug`,
      `tails both real and fake`,
      `tails both real and rubbery`,
    ]
  } else {
    return ``
  }

  return setup.Text.replaceUnitMacros(t, { a: unit })
}

setup.Text.Unit.Trait.tailtip = function (unit, is_with_equipment) {
  return setup.sexbodypart.tail.repTip(unit)
}

setup.Text.Unit.Trait.scent = function (unit, is_with_equipment) {
  if (unit.isMale()) return `musk`
  return 'scent'
}

