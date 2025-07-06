// @ts-nocheck

/**
 * @param {setup.Unit} unit 
 * @returns {{acceptance: string, dialogue: string}}
 */
function proposeSexSlave(unit) {
  let dialogue
  if (!unit.isCanTalk()) {
    if (unit.isObedient()) {
      dialogue = setup.Text.Gagged.pleasure({ unit: unit })
    } else {
      dialogue = setup.Text.Gagged.discomfort({ unit: unit })
    }
  } else {
    let opts
    let master
    if (State.variables.unit.player.isMale()) {
      master = 'master'
    } else {
      master = 'mistress'
    }
    if (unit.isObedient()) {
      opts = [
        `Yes, ${master}! Please fuck me!`,
        `${setup.capitalize(master)}, please fuck me senseless!`,
        `I am to use as you see fit, ${master}.`,
        `I live to serve, ${master}.`,
        `Anything you desire, ${master}.`,
      ]
    } else if (unit.isCompliant()) {
      opts = [
        `...yes, ${master}.`,
        `...yes, m-${master}.`,
        `...m-${master}...`,
        `Ahh, uhh, yes, m-${master}.`,
      ]
    } else if (unit.isMindbroken()) {
      opts = [
        `...`,
        `...moans`,
      ]
    } else {
      opts = [
        `No! Get away from me!`,
        `No, please, have mercy on me!`,
        `No! I hate you!`,
        `Please, no! No!`,
        `No, please go away!`,
      ]
    }
    dialogue = setup.Text.replaceUnitMacros(opts, { a: unit })
  }
  return {
    acceptance: 'yes',
    dialogue: dialogue,
  }
}

/**
 * @param {setup.Unit} unit 
 * @returns {{acceptance: string, dialogue: string}}
 */
function proposeSexSlaver(unit) {
  const speech = unit.getSpeech()

  const sugar = setup.Text.Greeting.nickname({ unit: unit, target: State.variables.unit.player })
  const heyboss = setup.Text.Greeting.short({ unit: unit })
  let question = []

  if (speech == setup.speech.friendly) {
    question = [
      `${heyboss} you want to have sex with me?`,
      `${heyboss} you're proposing some fun times?`,
      `${heyboss} you're asking for a swing?`,
    ]
  } else if (speech == setup.speech.bold) {
    question = [
      `${heyboss} you're asking if I want to have sex?`,
      `Do I want to have sex with you?`,
      `Do I want to have some fun time with you?`,
    ]
  } else if (speech == setup.speech.cool) {
    question = [
      `Sex? With you?`,
      `${heyboss} sex?`,
      `${heyboss} fun times?`,
    ]
  } else if (speech == setup.speech.witty) {
    question = [
      `${heyboss} did I hear that correctly? You want to engage in some kind of animalistic ritual behavior with me?`,
      `${heyboss} am I up to get it going with you?`,
      `${heyboss} are you proposing we go to some shady corner and, you know?`,
    ]
  } else if (speech == setup.speech.debauched) {
    question = [
      `${heyboss} are you asking me for sex? Well I do it all the time, but if it's with you...`,
      `${heyboss} you're proposing sex so brazenly during the day? Reminds me of myself really, but well...`,
      `${heyboss} do I want some action? If you are thinking what I am thinking, then, well...`,
    ]
  } else {
    throw new Error(`Unrecognized speech pattern: ${speech.key}`)
  }

  let response = null
  let acceptance

  if (unit.getLover() == State.variables.unit.player) {
    acceptance = 'yes'
    if (speech == setup.speech.friendly) {
      response = [
        `Of course! Anytime my ${sugar} asks.`,
        `But of course! You're my ${sugar}, after all.`,
      ]
    } else if (speech == setup.speech.bold) {
      response = [
        `Glad you asked, ${sugar}! I've been pent up all day.`,
        `Of course, ${sugar}! I've been fantasizing about you all day, in fact, so you better get ready.`,
        `I've been waiting for you all day, actually. It's rude to keep me waiting, you now.`,
      ]
    } else if (speech == setup.speech.cool) {
      response = [
        `Sure, ${sugar}.`,
        `Of course, .`,
      ]
    } else if (speech == setup.speech.witty) {
      response = [
        `Who am I kidding, of course I want to ${sugar}!`,
        `Yes, of course I want to, ${sugar}! Prepare your body...`,
      ]
    } else if (speech == setup.speech.debauched) {
      response = [
        `That's all I've been thinking today, in fact. So yes, let's do it!`,
        `Of course, ${sugar}! In fact, I'll do it anytime, anywhere.`,
        `Yes! Yes! I hope your schedule is empty today...`,
        `Yes, ${sugar}! Now, talk dirty to me...`,
      ]
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  } else if (unit.isHasTrait('per_lustful')) {
    acceptance = 'yes'
  } else if (unit.isHasTrait('per_chaste')) {
    acceptance = 'no'
    if (speech == setup.speech.friendly) {
      response = [
        `Sorry ${sugar}, but I really don't feel comfortable doing sex with just anyone like this...`,
        `Sorry ${sugar}, this may sound strange, but I'm really not comfortable with a swing...`,
      ]
    } else if (speech == setup.speech.bold) {
      response = [
        `Let's not. I only have sex with someone I consider my lifetime partner.`,
        `Seems like you don't know me well enough if you think I'd just accept a swing offer like this.`,
      ]
    } else if (speech == setup.speech.cool) {
      response = [
        `I don't have sex with just anyone.`,
        `No, please. I'm not comfortable with casual sex.`,
      ]
    } else if (speech == setup.speech.witty) {
      response = [
        `Heh, you got me. I'm really not comfortable with casual sex, you see. Sorry.`,
        `Well, sorry to disappoint you, but more of a swan kind of a|race and less of a rabbit one.`,
      ]
    } else if (speech == setup.speech.debauched) {
      response = [
        `Well, despite my usual persona, I'm actually not that into casual sex. Weird, I know.`,
        `Well, this is going to be a bit awkward. I love sex, I really do. Just... only with the right partners, sorry.`,
      ]
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  } else if (unit.isHasTrait('join_junior')) {
    acceptance = 'no'
    if (speech == setup.speech.friendly) {
      response = [
        `Sorry ${sugar}, but I really don't know you anywhere near well enough to get it going.`,
        `Sorry ${sugar}, maybe when we know each other a bit more?`,
      ]
    } else if (speech == setup.speech.bold) {
      response = [
        `You haven't earned the priviledge of having sex with me yet, ${sugar}. But maybe in a few months or so.`,
        `Try again when you know me better, ${sugar}.`,
      ]
    } else if (speech == setup.speech.cool) {
      response = [
        `I don't know you.`,
        `I don't have sex with strangers.`,
      ]
    } else if (speech == setup.speech.witty) {
      response = [
        `I'm still waiting for the punchline. No? Well, maybe when we get to know each other better.`,
        `As much as I approve of your... curiosity, let's not do it until we know each other better.`,
      ]
    } else if (speech == setup.speech.debauched) {
      response = [
        `I never refused sex, but I'll make an exception this time. I don't know you well enough.`,
        `I love sex, but I have my principles to not do sex with strangers. Let's get acquintanced better first, hmm?`,
      ]
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  } else if (unit.getLover() && !unit.isHasTrait('join_senior')) {
    acceptance = 'no'
    if (speech == setup.speech.friendly) {
      response = [
        `Sorry ${sugar}, but I don't want to cheat on my lover, especially when I haven't known you for that long...`,
        `Sorry ${sugar}, but I don't know you well enough to cheat on my lover.`,
      ]
    } else if (speech == setup.speech.bold) {
      response = [
        `Nope, not today ${sugar}. My lover will have all my attention for today.`,
        `Nope, got enough sex today from my lover. Perhaps when we know each other better...`,
      ]
    } else if (speech == setup.speech.cool) {
      response = [
        `No. Don't know what my lover would say.`,
        `No. I like my lover more.`,
      ]
    } else if (speech == setup.speech.witty) {
      response = [
        `My horoscope today said that I would have unsuspecting challenges. Guess this is it -- having to choose between you and my lover. That's a no, by the way.`,
        `Would you like me to invite my lovers too? Just kidding, let's not do it until I get to know you more.`,
        `Well, this is awkward. But I'm not going to risk being known as a cheater with my lover.`,
      ]
    } else if (speech == setup.speech.debauched) {
      response = [
        `Never thought I'd live long enough to see the day I have to refuse sex from you. But can't risk my lover's ire.`,
        `Sorry ${sugar}, my lover had me exhausted already today.`,
      ]
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  } else {
    acceptance = 'yes'
  }

  if (acceptance == 'yes' && !response) {
    if (speech == setup.speech.friendly) {
      response = [
        `Do you even need to ask? Of course!`,
        `Yes! Finally a chance for some good ol' relief.`,
        `Yes, can't wait to see what you can show me in the bedroom!`,
      ]
    } else if (speech == setup.speech.bold) {
      response = [
        `Yes! Hope you're ready for me!`,
        `Sure, just prepare your body for me...`,
        `You don't know how much I've been dreaming about you asking me for sex, ${sugar}.`
      ]
    } else if (speech == setup.speech.cool) {
      response = [
        `...why not.`,
        `Fine, let's go.`,
        `Sure.`,
      ]
    } else if (speech == setup.speech.witty) {
      response = [
        `Glad you ask, ${sugar}! There's this new pose I've been wanting to try out...`,
        `Sure, sounds like harmless fun!`,
        `I was just about to ask you, actually! Great minds to think alike.`,
      ]
    } else if (speech == setup.speech.debauched) {
      response = [
        `Well, sex occupies like half of my thoughts for the day already so let's make it 100% instead!`,
        `No, wait, yes! I mean yes! I wouldn't dream of refusing sex from such a b|adjgood b|race like you.`,
        `Yes! Now work my body like you work your slavers...`,
      ]
    } else {
      throw new Error(`Unrecognized speech pattern: ${speech.key}`)
    }
  }

  const pre = setup.Text.replaceUnitMacros(
    question,
    {
      a: unit,
      b: State.variables.unit.player,
    }
  )
  const post = setup.Text.replaceUnitMacros(
    response,
    {
      a: unit,
      b: State.variables.unit.player,
    }
  )
  return {
    acceptance: acceptance,
    dialogue: pre + ' ' + post,
  }
}

/**
 * You proposes another unit for sex.
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.proposeSex = function (unit) {
  const fragments = []

  let response
  if (unit.isSlave()) {
    response = proposeSexSlave(unit)
  } else {
    response = proposeSexSlaver(unit)
  }

  fragments.push(
    setup.DOM.Card.dialogue({
      unit: unit,
      dialogue: response.dialogue,
    })
  )

  if (response.acceptance == 'yes') {
    // @ts-ignore
    State.variables.gInteractiveSexUnitIds = [State.variables.unit.player.key, unit.key]
    // @ts-ignore
    delete State.variables.gInteractiveSexLocation_key
    fragments.push(setup.DOM.Util.include('SexSetup'))
  } else if (response.acceptance == 'no') {
    setup.DOM.Nav.topLeftNavigation(
      setup.DOM.Nav.return('Return')
    )
    fragments.push(html`
      <div>
        ${setup.DOM.Nav.return('(return)')}
      </div>
    `)
  } else {
    throw new Error(`Unrecognized acceptance: ${response.acceptance}`)
  }

  return setup.DOM.create('div', {}, fragments)
}

