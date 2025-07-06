// @ts-nocheck

/**
 * Adapted from Lilith's Throne "getDirtyTalk" and "getRoughTalk" functions
 * https://github.com/Innoxia/liliths-throne-public/blob/c863c6d5ad1ed625200b16791c4c707d57aa4e03/src/com/lilithsthrone/game/character/GameCharacter.java
 */

setup.Text.Dirty = {}

/**
 * @typedef {{
 *   unit_dialogue: string,
 *   target_dialogue: string,
 * }} SexDialogue
 */

/**
 * @param {setup.Unit} me 
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @returns {SexDialogue}
 */
function noPenetrationDialogue(me, them, sex) {
  const me_dialogue = []
  const them_dialogue = []

  const me_pace = sex.getPace(me)
  const them_pace = sex.getPace(them)
  const me_speech = me.getSpeech()

  const slut = setup.Text.Greeting.nicknamebad({ unit: me, target: them })

  let want_fuck = false
  let want_fucked = false

  if (me_pace == setup.sexpace.dom) {
    want_fuck = true
    me_dialogue.push(
      `You ready to get fucked, ${slut}?`,
      `I'm going to fuck you senseless!`,
      `You're my bitch now, understand?!`,
      `I'm going to use you however I want, you fucking ${slut}!`,
      `How best to use you, I wonder...`,
      `I bet you can't wait for me to give you a good, hard fuck, can you, you worthless ${slut}?`,
      `All you're good for is being my worthless fuck-toy!`,
      `You're just my pathetic little fuck-toy now, understand?! You belong to me!`,
      `I love fucking a worthless ${slut} like you!`,
    )
  } else if (me_pace == setup.sexpace.normal) {
    want_fuck = true
    want_fucked = true
    me_dialogue.push(
      `This is going to be good!`,
      `Ready for some fun?`,
      `I'll be gentle, don't worry!`,
      `You're going to be a good ${slut} now, aren't you?`,
      `Let's have some fun!`,
      `You're going to love this!`,
      `You're going to be a good ${slut}`,
    )
  } else if (me_pace == setup.sexpace.sub) {
    want_fucked = true
    me_dialogue.push(
      `Come on, fuck me already! Please!`,
      `Fuck me! Please!`,
      `What are you waiting for?! Come on, fuck me!`,
      `I'm so horny! Please, fuck me!`,
      `I'll be a good ${slut}!`,
      `I'll do whatever you want!`,
    )
  } else if (me_pace == setup.sexpace.resist) {
    me_dialogue.push(
      `Go away! Leave me alone!`,
      `Stop it! Just go away!`,
      `Please stop! Don't do this!`,
    )
  } else if (me_pace == setup.sexpace.forced) {
    want_fuck = true
    want_fucked = true
    me_dialogue.push(
      `What is your command?`,
      `I'll be a good slave...`,
      `I will obey...`,
    )
  } else if (me_pace == setup.sexpace.mindbroken) {
    me_dialogue.push(
      `...`,
    )
  }

  // special ones
  if (me_speech == setup.speech.witty) {
    if (me.getLover() == them) {
      me_dialogue.push(
        `Life without you is like a broken pencil: pointless.`,
        `Do you have a map? I keep getting lost in your eyes.`,
        `You must be tired from running through my mind all night.`,
        `We're not socks, but I think we'd make a great pair.`,
      )
    }
    if ([setup.sexpace.dom, setup.sexpace.normal].includes(me_pace) && me.isSlaver() && them.isSlaver()) {
      /*
      Terrible puns from: https://www.rd.com/list/cheesy-pickup-lines/
      */

      const handsome = them.isMale() ? 'handsome' : 'beautiful'
      me_dialogue.push(
        `Know what's on the menu? Me 'n' u.`,
        `Are you a loan? Because you sure have my interest!`,
        `Any chance you have an extra heart? Mine's been stolen!`,
        `If you were a chicken, you'd be impeccable.`,
        `Are you a broom? Because you've swept me off my feet.`,
        `You're so ${handsome} that you made me forget my pickup line.`,
        `Something's wrong with my eyes, because I can't take them off you.`,
      )
      const block = sex.getBlockingEquipment(me, setup.sexbodypart.breasts)
      if (block) {
        let boyfriend
        if (me.isMale()) {
          boyfriend = 'Boyfriend'
        } else {
          boyfriend = 'Girlfriend'
        }
        me_dialogue.push(
          `Feel my shirt. Know what it's made of? ${boyfriend} material.`
        )
      }
    }
  }

  if (them_pace == setup.sexpace.dom) {
    if (want_fucked) {
      them_dialogue.push(
        `Yes! You ready to get fucked, ${slut}?`,
        `Yes, I'm going to fuck you senseless!`,
        `Yeah, you're my bitch now, understand?!`,
        `I'm going to use you however I want, you fucking ${slut}!`,
        `You just can't wait for me to give you a good, hard fuck, can you, you worthless ${slut}?`,
        `Yes! All you're good for is being my worthless fuck-toy!`,
        `Yes! You're just my pathetic little fuck-toy now, understand?! You belong to me!`,
        `Yes! I love fucking a worthless ${slut} like you!`,
      )
    } else {
      them_dialogue.push(
        `Come on, fuck me hard!`,
        `Fuck me hard now!`,
        `Well then, what are you waiting for?! Come on, fuck me!`,
        `I'm so horny! Fuck me now!`,
      )
    }
  } else if (them_pace == setup.sexpace.normal) {
    them_dialogue.push(
      `Yes! This is going to be good!`,
      `Yes! Ready for some fun?`,
      `Yes! Let's have some fun!`,
      `Yes! You're going to love this!`,
    )
  } else if (them_pace == setup.sexpace.sub) {
    if (want_fuck) {
      them_dialogue.push(
        `Yes! I'm your little slut! Take me however you want!`,
        `Yes! I'm yours! Use me! Do what you want with me!`,
        `Yeah! I'm your worthless little bitch! Fuck me!`,
        `Yes, I'm your worthless slut! Use me like your little fuck-toy!`,
      )
    } else {
      them_dialogue.push(
        `Yes! I'm your little slut! Order me however you want!`,
        `Yes! I'm yours! Order me! Command me anything!`,
        `Yeah! I'm your worthless little bitch! Order me around!`,
        `Yes, I'm your worthless slut! Abuse me like your little fuck-toy!`,
      )
    }
  } else if (them_pace == setup.sexpace.resist) {
    them_dialogue.push(
      `No! Go away! Leave me alone!`,
      `No! Stop it! Just go away!`,
      `No! Please stop! Don't do this!`,
    )
  } else if (them_pace == setup.sexpace.forced) {
    want_fuck = true
    want_fucked = true
    them_dialogue.push(
      `Yes, anything you command...`,
      `Yes, I'll be a good slave...`,
      `Yes, I will obey...`,
    )
  } else if (them_pace == setup.sexpace.mindbroken) {
    them_dialogue.push(
      `...`,
    )
  }

  return {
    unit_dialogue: setup.SexUtil.convert(me_dialogue, { a: me, b: them }, sex),
    target_dialogue: setup.SexUtil.convert(them_dialogue, { a: me, b: them }, sex),
  }
}

/**
 * Unit says something rough. Return the unit as well as target's dialogues.
 * 
 * @param {{
 * unit: setup.Unit,
 * target: setup.Unit,
 * sex?: setup.SexInstance,
 * unit_bodypart?: setup.SexBodypart,
 * target_bodypart?: setup.SexBodypart,
 * unit_pace?: setup.SexPace,
 * target_pace?: setup.SexPace,
 * strip?: boolean,
 * }} args
 * @returns {SexDialogue}
 */
setup.Text.Dirty.talk = function ({
  unit,
  target,
  sex,
  unit_bodypart,
  target_bodypart,
  unit_pace,
  target_pace,
  strip,
}) {
  const old_gSex = State.temporary.gSex
  if (!sex) {
    // create a new temporary sex instance
    const participants = setup.SexInstance.initParticipants([unit, target])
    sex = new setup.SexInstance(setup.sexlocation.dungeonsfloor, participants)
    State.temporary.gSex = sex
    if (unit_bodypart.isCanPenetrate(target_bodypart)) {
      sex.setOngoing(unit, unit_bodypart, target, target_bodypart)
    } else if (target_bodypart.isCanPenetrate(unit_bodypart)) {
      sex.setOngoing(target, target_bodypart, unit, unit_bodypart)
    } else {
      throw new Error(`${unit_bodypart.key} cannot interact with ${target_bodypart.key}`)
    }
    if (unit_pace) {
      sex.setPace(unit, unit_pace)
    }
    if (target_pace) {
      sex.setPace(target, target_pace)
    }
    if (strip) {
      sex.displaceAllEquipments()
    }
    if (unit_bodypart == setup.sexbodypart.penis && !unit.isHasDick()) {
      sex.equipTemporarily(unit, setup.equipment.strapon)
    }
    if (target_bodypart == setup.sexbodypart.penis && !target.isHasDick()) {
      sex.equipTemporarily(target, setup.equipment.strapon)
    }
  }


  // get a random penetration, if any
  const penetrations = sex.getAllOngoing(unit)
  let penetration = null
  if (penetrations.length) {
    penetration = setup.rng.choice(penetrations)
  }

  unit_pace = sex.getPace(unit)
  target_pace = sex.getPace(target)

  // base no penetration dialogues
  if (!penetration) {
    return noPenetrationDialogue(unit, target, sex)
  }

  const unit_text = yesPenetrationDialogue(unit, target, penetration, sex)

  let target_text
  if (target.isCanTalk()) {
    target_text = yesPenetrationDialogue(target, unit, penetration, sex)
  } else {
    if ([setup.sexpace.resist, setup.sexpace.forced, setup.sexpace.dom].includes(target_pace)) {
      target_text = setup.Text.Gagged.discomfort({ unit: target })
    } else {
      target_text = setup.Text.Gagged.pleasure({ unit: target })
    }
  }

  if (old_gSex) {
    State.temporary.gSex = old_gSex
  } else {
    delete State.temporary.gSex
  }

  return {
    unit_dialogue: unit_text,
    target_dialogue: target_text,
  }
}


/**
 * me says something 
 * 
 * @param {setup.Unit} me 
 * @param {setup.Unit} them
 * @param {PenetrationInfo} penetration
 * @param {setup.SexInstance} sex
 * @returns {string}
 */
function yesPenetrationDialogue(me, them, penetration, sex) {
  if (penetration.unit != me) {
    penetration = sex.getBodypartOther(penetration.unit, penetration.bodypart)
  }
  if (penetration.unit != me) throw new Error(`??? penetration unit is not me?`)
  const me_bodypart = penetration.bodypart
  const them_bodypart = sex.getBodypartOther(penetration.unit, penetration.bodypart).bodypart

  let is_penetrated
  let fuck
  if (sex.getBodypartPenetrationTarget(penetration.unit, penetration.bodypart)) {
    // i am penetrating
    is_penetrated = false
    fuck = me_bodypart.repFuck(me, sex)
  } else {
    is_penetrated = true
    fuck = them_bodypart.repFuck(them, sex)
  }

  /* setup various keywords */
  const slut = setup.Text.Greeting.nicknamebad({ unit: me, target: them })

  const me_pace = sex.getPace(me)
  let texts = []

  if (is_penetrated) {

    /* being penetrated keywords */
    const dick = them_bodypart.rep(them, sex)
    const dick_simple = them_bodypart.repSimple(them)
    const hole = me_bodypart.rep(me, sex)
    const hole_simple = me_bodypart.repSimple(me)

    if (me_pace == setup.sexpace.normal) {
      texts.push(
        `That's right, be a good ${slut} now and push your ${dick} in deeper!`,
        `Good ${slut}! Keep that ${dick} of yours busy!`,
        `Good ${slut}! Push your ${dick} in deep!`,
        `What a good ${slut}! My ${hole_simple} loves the feeling of your ${dick}!`,
        `What a good ${slut}! Enjoy my ${hole_simple} as your reward now!`,
        `That's right, push your ${dick} in deep!`,
        `Good ${slut}! Get those ${dick} in deep!`,
      )
      if (them_bodypart == setup.sexbodypart.penis) {
        texts.push(
          `Good ${slut}! Keep sliding that delicious ${dick} of yours in and out of me!`,
          `You like feeling my ${hole_simple} gripping down on your ${dick}?!`,
          `Keep going! Get that ${dick} in deep like a good ${slut}!`,
        )
      }
    } else if (me_pace == setup.sexpace.dom) {
      texts.push(
        `Come on ${slut}, you can get your ${dick} in deeper than that!`,
        `Keep it up ${slut}! Get those ${dick} in deep!`,
        `Keep going ${slut}! Put in a little more effort and insert it all in!`,
        `That's right ${slut}, you're my little fuck toy now!`,
        `Come on ${slut}! You can get your worthless ${dick_simple} in deeper than that!`,
        `Fucking ${slut}, put some more effort in! My ${hole_simple} deserves better than your worthless ${dick_simple}!`,
      )

    } else if (me_pace == setup.sexpace.sub) {
      texts.push(
        `Yes! Keep ${fuck}ing me!`,
        `Keep going! My ${hole_simple} loves your attention!`,
        `Oh yes! I love being ${fuck}ed!`,
        `Yes! Fuck me! Fuck me harder! Don't stop!`,
        `Don't stop! Harder! Fuck me! Yes, yes, yes!`,
        `Oh yes! Fuck me! I love your ${dick_simple}!`,
      )
    } else if (me_pace == setup.sexpace.resist) {
      texts.push(
        `Get your ${dick_simple} out of me! Stop! Please!`,
        `Stop ${fuck}ing me! Please, no more!`,
        `Stop it! Stop! Please!`,
        `Get out of me! Stop! Please!`,
        `Please, no more! Take your ${dick_simple} out!`,
        `Get out of me! Stop! Please!`,
      )
    } else if (me_pace == setup.sexpace.forced) {
      texts.push(
        `Ugh... agh...`,
        `Oooh... I will obey...`,
        `Ugh... as you ordered...`,
      )
    } else if (me_pace == setup.sexpace.mindbroken) {
      texts.push(
        `...gasp!`,
        `...mmmm!`,
        `...!`,
      )
    }

    // special case for mouth
    if (them_bodypart == setup.sexbodypart.mouth) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `That's right ${slut}, keep eating me out like the worthless little fuck toy you are!`,
          `Come on ${slut}! Get that tongue of yours in deeper!`,
          `Fucking ${slut}, put some more effort in! You know how lucky you are, being allowed to taste my ${hole_simple} like this?!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `That's right, keep eating me out!`,
          `Good ${slut}! Keep that tongue of yours busy!`,
          `What a good ${slut}! You love the taste of my ${hole_simple}, don't you?!`,
          `Oh yes! Get that tongue in deep!`,
          `Good ${slut}! Get that tongue of yours in deep!`,
          `Keep going! My ${hole_simple} loves your ${dick_simple}!`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Yes! I love your ${dick}! Don't stop!`,
          `Don't stop! Deeper! Eat me out! Yes, yes, yes!`,
          `Oh yes! Taste my ${hole_simple}! I love your ${dick_simple}! Get it deeper!`,
        ]
      }
    }

    // special case for breasts
    if (me_bodypart == setup.sexbodypart.breasts) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `That's right slut, my ${hole_simple} could use some attention from a little fuck toy like you!`,
          `Come on ${slut}! You can get your worthless ${dick_simple} deeper between my ${hole_simple} than that!`,
          `Fucking ${slut}, put some more effort in! My ${hole_simple} deserve better than your worthless ${dick_simple}!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `My ${hole_simple} love your ${dick}!`,
          `Good ${slut}! Keep sliding that delicious ${dick_simple} of yours between my ${hole_simple}!`,
          `What a good ${slut}! Enjoy my ${hole_simple} as your reward now!`,
          `You like feeling my ${hole_simple} gripping down around your ${dick_simple}?!`,
          `Good ${slut}! Push your ${dick} deep between my ${hole_simple}!`,
          `Keep going! Get that ${dick} between my ${hole_simple} like a good ${slut}!`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Yes! Fuck my ${hole_simple}! Fuck them harder! Don't stop!`,
          `Don't stop! Harder! Fuck my ${hole_simple}! Yes, yes, yes!`,
          `Oh yes! Fuck my tits! I love your ${dick}!`,
        ]
      }
    }

    // special case for mouth part 2
    if (me_bodypart == setup.sexbodypart.mouth) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `Hold still ${slut}, be a good little fuck toy and just be thankful that I love sucking cock!`,
          `Stay still ${slut}! You'd better be happy that your worthless ${dick_simple} is the only thing for me to suck right now!`,
          `Fucking ${slut}, hold still! I need to practice my oral skills on your worthless ${dick_simple}!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `I love your ${dick}!`,
          `Good ${slut}! Your delicious ${dick_simple} deserves this nice reward!`,
          `What a good ${slut}! I hope you're enjoying your reward!`,
          `Your ${dick} tastes so good!`,
          `I love sucking your ${dick_simple}!`,
          `Oh yes! Your ${dick_simple} tastes so good!`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Oh yes! I love your ${dick_simple}! I need it! Use my throat!`,
          `Don't stop! Harder! Fuck my throat! Yes, yes, yes!`,
          `Oh yes! I love your ${dick}! You taste so good!`,
        ]
      }
    }
  } else {

    /* penetrating keywords */
    const dick = me_bodypart.rep(me, sex)
    const dick_simple = me_bodypart.repSimple(me)
    const hole = them_bodypart.rep(them, sex)
    const hole_simple = them_bodypart.repSimple(them)

    if (me_pace == setup.sexpace.normal) {
      texts.push(
        `Good ${slut}! Feel my ${dick_simple} slide deep into your ass!`,
        `That's right, be a good ${slut} and moan for me! Feel my ${dick} sliding deep into your ${hole_simple}!`,
        `Your ${hole_simple} feels so good squeezing down around my ${dick_simple}!`,
        `Fuck! Your ${hole_simple} feels so good!`,
        `Oh yes! Take my ${dick_simple}! Take it deep!`,
        `Your ${hole_simple} was made for my ${dick_simple}!`,
      )

      if (me_bodypart == setup.sexbodypart.penis) {
        texts.push(
          `Take my entire length! Take it all in!`,
        )
      }

    } else if (me_pace == setup.sexpace.dom) {
      texts.push(
        `That's right ${slut}, take my ${dick_simple}! Your ${hole} belongs to me!`,
        `What a horny ${slut}! Take my ${dick_simple} you filthy little ${slut}!`,
        `You feel that, fuck toy?! Do you feel my ${dick_simple} sinking deep into your slutty little ${hole_simple}?!`,
      )

      if (me_bodypart == setup.sexbodypart.penis) {
        texts.push(
          `I'm going to insert my entire length, so get ready you ${slut}!`,
        )
      }
    } else if (me_pace == setup.sexpace.sub) {
      texts.push(
        `Yes! Use my ${dick_simple}! I love your ${hole_simple}!`,
        `Don't stop! Harder! Use my ${dick_simple}! Yes, yes, yes!`,
        `Oh yes! Use me! I love your ${hole_simple}!`,
      )
    } else if (me_pace == setup.sexpace.resist) {
      texts.push(
        `I don't want to do this! Please let me stop!`,
        `Let me go! I don't want to do this!`,
        `Please! Stop! I don't want this!`,
      )
    } else if (me_pace == setup.sexpace.forced) {
      texts.push(
        `Ohh, it feels good...`,
        `As you command...`,
        `Anything you ask for...`,
      )
    } else if (me_pace == setup.sexpace.mindbroken) {
      texts.push(
        `...`,
      )
    }

    // special case for breasts
    if (them_bodypart == setup.sexbodypart.breasts) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `That's right slut, pleasure my cock! Push your ${hole_simple} together and make this good for me!`,
          `What a horny ${slut}! Using your ${hole_simple} to please my ${dick_simple} like a desperate ${slut}!`,
          `You like this, fuck toy?! Squeezing your ${hole_simple} around my ${dick_simple} and pleasing me like the ${slut} you are?!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `Good ${slut}! Feel my cock slide up between your ${hole_simple}!`,
          `That's right, be a good ${slut} and moan for me! Feel my ${dick_simple} sliding up between your ${hole_simple}!`,
          `Your ${hole_simple} feel so good squeezing down around my ${dick_simple}!`,
          `Fuck! Your ${hole_simple} feel so good to fuck!`,
          `Oh yes! Wrap your ${hole_simple} around my cock!`,
          `Your ${hole_simple} were made for my cock!`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Yes! Use my cock! I love your ${hole_simple}!`,
          `Don't stop! Harder! Fuck me! Yes, yes, yes!`,
          `Oh yes! Use me! I love your ${hole_simple}!`,
        ]
      }
    }

    // special case for mouth
    if (them_bodypart == setup.sexbodypart.mouth) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `Come on you ${slut}! You can suck cock better than that!`,
          `That's right ${slut}! Take my ${dick_simple} deep down your throat!`,
          `Put some effort into it ${slut}! You can suck cock better than that!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `Good ${slut}, keep sucking my ${dick_simple}!`,
          `That's right, use your tongue as well! You're good at sucking ${dick_simple}!`,
          `What a good ${slut}! You love sucking my ${dick_simple}, don't you?`,
          `You're good at sucking cock!`,
          `Oh yeah! Keep sucking my ${dick_simple}!`,
          `Use your tongue as well! Yeah, like that!`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Yes! Keep sucking my ${dick_simple}! Just like that!`,
          `Oh yes! Wrap those lips of yours around my ${dick_simple}! Keep going!`,
          `Keep sucking my ${dick_simple}! Yes! Just like that!`,
        ]
      }
    }

    // special case for mouth 2
    if (me_bodypart == setup.sexbodypart.mouth) {
      if (me_pace == setup.sexpace.dom) {
        texts = [
          `Keep still ${slut}, I need to practice my oral skills on your worthless ${hole_simple}!`,
          `Stay still ${slut}! Just keep moaning and enjoying this while it lasts!`,
          `You'd better appreciate this ${slut}! You know how lucky you are, being used as oral practice?!`,
        ]
      } else if (me_pace == setup.sexpace.normal) {
        texts = [
          `That's right, moan for me as I pleasure your ${hole_simple}!`,
          `Good ${slut}! I love licking cute little ${hole_simple} like yours!`,
          `What a good ${slut}! You love my tongue in your ${hole_simple}, don't you?`,
          `That's right, moan for me as I lick your ${hole_simple}!`,
          `Feel my tongue deep in your ${hole_simple}! Moan for me!`,
          `You love my tongue in your ${hole_simple}, don't you?`,
        ]
      } else if (me_pace == setup.sexpace.sub) {
        texts = [
          `Yes! I love your ${hole_simple}! Feel my tongue pushing deep!`,
          `Oh yes! Let me lick your ${hole_simple}! Yes, yes, yes!`,
          `Oh yes! I love licking ${hole_simple}! Let me get my tongue nice and deep!`,
        ]
      }
    }
  }

  return setup.SexUtil.convert(texts, { a: me, b: them }, sex)
}
