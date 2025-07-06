// @ts-nocheck

setup.Text.Greeting = {}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Unit} target 
 * @returns {string}
 */
export function getMasterNickname(unit, target) {
  if (target.isMale()) {
    return `master`
  } else {
    return `mistress`
  }
}

/**
 * Gives a nickname a unit uses for target. E.g., "boss" for player.
 * 
 * @param {{
 * unit: setup.Unit,
 * target?: setup.Unit,
 * }} args
 * @returns {string}
 */
setup.Text.Greeting.nickname = function ({
  unit, target
}) {
  if (!target) target = State.variables.unit.player

  if (unit.isSlave() && !target.isSlave()) {
    return getMasterNickname(unit, target)
  }

  const speech = unit.getSpeech()
  let names = [
    `b|name`,
  ]

  if ([setup.speech.bold, setup.speech.friendly, setup.speech.witty, setup.speech.debauched].includes(speech)) {
    if (target.isYou()) {
      names.push(
        `boss`,
        `chief`,
      )
    }

    let guy
    if (target.isMale()) {
      guy = 'guy'
    } else {
      guy = 'girl'
    }

    // extra friendly ones. Cool slavers won't use these
    if (target.isHasTrait(setup.trait.muscle_strong)) {
      if (target.isMale()) {
        names.push(
          `hunk`,
        )
      }
      names.push(
        `strong ${guy}`,
      )
    }
    if (target.isHasTrait(setup.trait.tough_tough)) {
      names.push(
        `tough ${guy}`,
      )
    }
    if (target.isHasTrait(setup.trait.height_tall)) {
      names.push(
        `big ${guy}`,
      )
    }
  }

  if ([setup.speech.bold, setup.speech.witty, setup.speech.debauched].includes(speech)) {
    if (target.isYou()) {
      if (target.isMale()) {
        names.push(`bossman`)
      } else {
        names.push(`bosswoman`)
      }
    }
    if (target.isHasTrait('face_attractive')) {
      if (target.isMale()) {
        names.push(
          `handsome`,
        )
      } else {
        names.push(
          `gorgeous`,
        )
      }
    }
    if (target.isHasTrait('breast_large') || target.isHasTrait('dick_large')) {
      names.push(
        `sexy`,
      )
    }
    if (target.isHasTrait('skill_hypnotic')) {
      names.push(
        `charming`,
      )
    }
  }

  if ([setup.speech.witty, setup.speech.debauched].includes(speech)) {
    if (target.isHasTrait('height_short')) {
      names.push(
        `dwarfy`,
      )
    }
    if (target.isHasTrait('anus_gape') || target.isHasTrait('anus_loose')) {
      names.push(
        `gapey`,
      )
    }
    if (target.isHasTrait('corrupted')) {
      names.push(
        `corruptey`,
      )
    }
    if (target.isHasTrait('per_slow')) {
      names.push(
        `dumby`,
      )
    }
    if (target.isHasTrait('face_scary')) {
      names.push(
        `ugly`,
      )
    }
  }

  if (State.variables.friendship.getFriendship(unit, target) >= 500) {
    names.push(
      `friend`,
    )
  }

  // override for relationship
  const relation = State.variables.family.getRelation(target, unit)
  if (relation) {
    names = relation.getNicknames()[speech.key]
  }

  // override for lovers
  if (unit.getLover() == target) {
    names = [
      `love`,
    ]
    if (speech == setup.speech.friendly) {
      names.push(
        `honey`,
        `darling`,
        `sugar`,
        `dearest`,
      )
    } else if (speech == setup.speech.bold) {
      names.push(
        `baby`,
        `hun`,
        `bunny`,
        `angel`,
      )
    } else if (speech == setup.speech.cool) {
    } else if (speech == setup.speech.witty) {
      names.push(
        `charming`,
      )
      if (target.isMale()) {
        names.push(
          `princey`,
        )
      } else {
        names.push(
          `princess`,
        )
      }
    } else if (speech == setup.speech.debauched) {
      names.push(
        `hottie`,
        `sexy`,
        `tasty`,
        `delicious`,
      )
      if (target.isMale()) {
        names.push(
          `hunk`,
          `handsome`,
        )
      } else {
        names.push(
          `your sexiness`,
          `gorgeous`,
        )
      }
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  }

  const seed = unit.Seed(`nicknamefor${target.key}`)
  return setup.Text.replaceUnitMacros(
    names[seed % names.length],
    { a: unit, b: target },
  )
}

/**
 * Gives a leading incomplete sentence of a unit greeting target.
 * E.g., "Hi boss,"
 * 
 * @param {{
 * unit: setup.Unit,
 * target?: setup.Unit,
 * }} args
 * @returns 
 */
setup.Text.Greeting.short = function ({
  unit, target,
}) {
  const greeting_templates = []
  if (!target) target = State.variables.unit.player

  let tnick = setup.Text.Greeting.nickname({ unit: unit, target: target })

  // base greetings based on speech
  const speech = unit.getSpeech()
  if (speech == setup.speech.friendly) {
    greeting_templates.push(
      `Hey ${tnick},`,
      `Heya ${tnick},`,
      `Hi ${tnick},`,
      `How's it going ${tnick},`,
      `Hey there ${tnick},`,
      `Oh hey, ${tnick},`,
    )
  } else if (speech == setup.speech.bold) {
    greeting_templates.push(
      `Oh ${tnick},`,
      `Hey ${tnick}, `,
      `Hey ${tnick},`,
      `Heh ${tnick},`,
      `Hello to you ${tnick},`,
      `Heya ${tnick},`,
      `Ahoy ${tnick},`,
    )
  } else if (speech == setup.speech.cool) {
    greeting_templates.push(
      `Hey ${tnick}, `,
      `...${tnick},`,
      `...,`,
    )
  } else if (speech == setup.speech.witty) {
    greeting_templates.push(
      `Well if it isn't ${tnick},`,
      `Why hello there ${tnick},`,
      `Welcome ${tnick},`,
      `Heh heh it's ${tnick},`,
      `Perfect timing ${tnick},`,
      `Oh, it's just ${tnick},`,
    )
  } else if (speech == setup.speech.debauched) {
    greeting_templates.push(
      `Ah, it's ${tnick},`,
      `Oho, it's ${tnick},`,
      `Hmm, hi ${tnick},`,
      `Well well ${tnick},`,
      `Hey there ${tnick},`,
      `Hi ${tnick},`,
    )
    if (unit.isFemale()) {
      greeting_templates.push(
        `Ara, it's ${tnick},`,
      )
    }
  } else {
    throw new Error(`Unrecognized speech pattern: ${speech.key}`)
  }

  if (unit.isHasTrait('bg_priest')) {
    if (speech != setup.speech.debauched) {
      greeting_templates.push(
        `Blessings upon you ${tnick},`,
        `Good tidings on you ${tnick},`,
      )
    }
  }

  if (unit.isHasTrait('bg_farmer')) {
    if (speech != setup.speech.debauched) {
      greeting_templates.push(
        `Howdy partner,`,
        `Howdy pardner,`,
      )
    }
  }

  if (unit.isHasAnyTraitExact(['bg_pirate', 'bg_seaman'])) {
    greeting_templates.push(
      `Arr, it's ${tnick},`,
      `Y'arr ${tnick},`,
      `Ahoy ${tnick},`,
    )
  }

  const chosen = setup.rng.choice(greeting_templates)
  return setup.Text.replaceUnitMacros(
    chosen,
    { a: unit, b: target },
  )
}


/**
 * Gives a full greeting sentence.
 * E.g., "Hi boss, how are you?"
 * 
 * @param {{
 * unit: setup.Unit,
 * target?: setup.Unit,
 * }} args
 * @returns 
 */
setup.Text.Greeting.full = function ({
  unit, target,
}) {
  if (!target) target = State.variables.unit.player
  const greeting_templates = []

  let tnick = setup.Text.Greeting.nickname({ unit: unit, target: target })

  const fron = setup.Text.Greeting.short({ unit: unit, target: target })

  // base greetings based on speech
  const speech = unit.getSpeech()
  if (speech == setup.speech.friendly) {
    greeting_templates.push(
      `${fron} how are ya?`,
      `${fron} how's it going?`,
      `${fron} glad to see you.`,
      `${fron} happy to see you.`,
      `${fron} always glad to see you.`,
      `${fron} need me for something?`,
    )
  } else if (speech == setup.speech.bold) {
    greeting_templates.push(
      `${fron} something on your mind?`,
      `${fron} came to admire me?`,
      `${fron} come nearer!`,
      `${fron} come around!`,
      `${fron} nice to see ya!`,
    )
  } else if (speech == setup.speech.cool) {
    greeting_templates.push(
      `b|name.`,
      `...`,
      `Hmm?`,
      `${fron} do you need me?`,
      `${fron} hmm?`,
    )
  } else if (speech == setup.speech.witty) {
    greeting_templates.push(
      `${fron} miss me?`,
      `${fron} miss me already?`,
      `Would you look at that, it's ${tnick}!`,
      `Ooo, ${tnick} welcome!`,
      `Why, it's ${tnick}!`
    )
  } else if (speech == setup.speech.debauched) {
    greeting_templates.push(
      `${fron} come to stare at my magnificence or just here to talk?`,
      `${fron} come to admire me haven't you?`,
      `${fron} come don't be shy!`,
      `${fron} need something from little old me hmm?`,
      `${fron} welcome, welcome!`,
    )
  } else {
    throw new Error(`Unrecognized speech pattern: ${speech.key}`)
  }

  const chosen = setup.rng.choice(greeting_templates)
  return setup.Text.replaceUnitMacros(
    chosen,
    { a: unit, b: target },
  )
}


/**
 * Gives a leading incomplete sentence of a unit greeting target indicating busy.
 * E.g., "Hey boss, sorry a little busy right now"
 * 
 * @param {{
 * unit: setup.Unit,
 * target?: setup.Unit,
 * }} args
 * @returns 
 */
setup.Text.Greeting.busyshort = function ({
  unit, target,
}) {
  const greeting_templates = []
  if (!target) target = State.variables.unit.player

  let tnick = setup.Text.Greeting.nickname({ unit: unit, target: target })
  const fron = setup.Text.Greeting.short({ unit: unit, target: target })

  // base greetings based on speech
  const speech = unit.getSpeech()
  if (speech == setup.speech.friendly) {
    greeting_templates.push(
      `${fron} sorry a little busy right now`,
      `Sorry ${tnick} I'm a bit busy right now`,
      `${fron} but I'm a bit busy right now`,
      `${fron} sorry I really have work to do right now`,
      `Uh ${tnick}? Sorry I'm a bit busy right now`,
      `${fron} talk later? I really have some work to do right now`,
    )
  } else if (speech == setup.speech.bold) {
    greeting_templates.push(
      `Hey ${tnick}, can't you see I'm busy right now? I have work to do`,
      `${fron} I'm busy right now`,
      `${fron} but I'm busy right now`,
      `${fron} not now, I'm busy`,
      `${fron} catch up with you later, I'm busy`,
    )
  } else if (speech == setup.speech.cool) {
    greeting_templates.push(
      `${fron} I'm busy`,
      `Urgh..., I'm busy`,
      `${fron} sorry got work to do`,
      `...Busy right now`,
      `${fron} not now, I'm busy`,
    )
  } else if (speech == setup.speech.witty) {
    greeting_templates.push(
      `${fron} as much as I'd love to spend more time with you, I'm busy for once`,
      `${fron} unlike a certain someone, I have work to do`,
      `${fron} must be nice being you, but I'm busy right now`,
      `${fron} come here to help with my work? Believe it or not, I really have a lot of work to do today`,
      `${fron} I'm not drinking on the job I swear. I'm actually busy`,
    )
  } else if (speech == setup.speech.debauched) {
    greeting_templates.push(
      `${fron} but why don't you come back tomorrow. I'm a bit busy`,
      `${fron} but the door's over there. I'm busy`,
      `${fron} sorry, are you lost? I'm busy`,
      `${fron} heh heh come to substitute me at my job? I could use some slaves why you're busy`,
      `${fron} as much as I'd love to go into the dungeons with you together, I'm actually busy`,
    )
  } else {
    throw new Error(`Unrecognized speech pattern: ${speech.key}`)
  }

  const chosen = setup.rng.choice(greeting_templates)
  return setup.Text.replaceUnitMacros(
    chosen,
    { a: unit, b: target },
  )
}

/**
 * Gives a bad nickname a unit uses for target. E.g., "slave", "bitch", "fatty",...
 * 
 * @param {{
 * unit: setup.Unit,
 * target?: setup.Unit,
 * }} args
 * @returns {string}
 */
setup.Text.Greeting.nicknamebad = function ({
  unit, target
}) {
  if (!target) target = State.variables.unit.player
  const speech = unit.getSpeech()
  let names = [
    'slut',
  ]

  if (target.isSlave()) {
    names.push('slave')
  }

  if (target.isMale()) {
    names.push('bitch')
  }

  const insult_adj = setup.Text.Unit.Trait.adjectiveBadRandom(target)
  const bitch = setup.rng.choice(names)
  names.push(
    `${insult_adj} ${bitch}`,
  )

  if ([setup.speech.bold, setup.speech.witty, setup.speech.debauched].includes(speech)) {
    if (target.isHasTrait('height_short')) {
      names.push(
        `dwarfey`,
      )
    }
    if (target.isHasTrait('anus_gape') || target.isHasTrait('anus_loose')) {
      names.push(
        `gapey`,
      )
    }
    if (target.isHasTrait('face_scary')) {
      names.push(
        `ugly`,
      )
    }
  }

  const seed = unit.Seed(`nicknamebadfor${target.key}`)
  return setup.Text.replaceUnitMacros(
    names[seed % names.length],
    { a: unit, b: target },
  )
}


