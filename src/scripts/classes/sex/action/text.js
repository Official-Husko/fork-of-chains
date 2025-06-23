/**
 * e.g., rep did not respond, etc.
 * Use: Despite being used and abuse, [xxx].
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexUtil.mindbrokenReactionDespite = function (unit, sex, sentences) {
  const gaze_at = sex.getLocation().repGazeAt(sex)
  const t = [
    `a|rep a|remain completely unresponsive.`,
    `a|reps posture remains completely unchanged.`,
    `the fully mindbroken slave a|remain as unnervingly still as ever.`,
    `a|reps gaze remains completely unfocused.`,
    `a|reps face remains expressionless.`,
    `nothing leave a lasting effect on the mindbroken slave.`,
    `the mindbroken slave remains completely passive.`,
    `it did not have any effect on the fully mindbroken slave.`,
    `a|reps a|eyes remain unfocused throughout, a|their mind completely gone.`,
    `a|rep a|remain unresponsive and unmoving.`,
    `a|reps gaze remains tracked on a|their owner, awaiting further use of a|their a|body.`,
    `no amount of blowjob can awaken whatever intelligence used to inhabit b|reps b|body.`,
    `a|rep dumbly a|remain still, almost like a doll.`,
    `all moaning coming from a|rep is purely physiological response of a|their a|body.`,
    `a|rep a|do not respond, and a|gaze mindlessly into ${gaze_at}.`,
    `no reaction comes out from a|rep, who dumbly gaze into ${gaze_at}.`,
  ]
  const fin = setup.SexUtil.convert(t, { a: unit }, sex)
  return setup.rng.choice(sentences) + ', ' + fin
}

/**
 * e.g., Being a mindbroken slave, unit did not respond towards [xxx]
 * Use: Despite being used and abuse, [xxx].
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @param {string[]} sentences
 * @returns {string}
 */
setup.SexUtil.mindbrokenReactionNoun = function (unit, sex, sentences) {
  const gaze_at = sex.getLocation().repGazeAt(sex)
  const t = [
    `Being a mindbroken slave however means that a|rep a|remain unresponsive towards`,
    `a|Rep a|do not respond to`,
    `a|Rep gaze remains unfocused towards`,
    `a|Reps face remains expressionless even with`,
    `a|Their a|body reflexively twitched from`,
    `a|Rep a|remain completely unresponsive towards`,
    `The mindbroken slave remains still, like a sex toy even with`,
    `a|Reps entire body shivered as a reflexive respond to`,
    `The mindbroken slave a|eyes reflexively lit up for a very short while towards`,
    `a|Rep a|shudder as an automatic bodily response from`,
    `Like a doll, a|they dumbly a|remain still, and without any real interest, continue watching`,
    `With a|their mind completely lost and unresponsive, b|rep blankly b|stare at `,
    `Since a|their mind was already long gone, a|rep a|do not respond to`,
    `There was no response from the mindbroken slave at `,
    `a|Rep continue to gaze at ${gaze_at}, giving no reaction towards`,
    `a|Reps eyes continue to wonder to ${gaze_at}, giving very little interest to`,
  ]

  const pre = setup.SexUtil.convert(t, { a: unit }, sex)
  return pre + ' ' + setup.rng.choice(sentences) + '.'
}


/**
 * Me just finished penetrating them (as a dom). Give their reaction.
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * 
 * [sentences]: (x withdraws my dick, my dick slides out of their tongue, ..)
 * @param {string[]} past_sentences 
 * 
 * What a sub want, e.g., (continue sucking on a|their cock) 
 * @param {string[]} action_sentences
 * @param {setup.SexInstance} sex 
 * @param {boolean} [is_dom]
 * @returns {string}
 */
function afterPenetrationReaction(me, them, past_sentences, action_sentences, sex, is_dom) {
  const theirpace = sex.getPace(them)
  const s = setup.rng.choice(past_sentences)
  const a = setup.rng.choice(action_sentences)

  let t
  if (theirpace == setup.sexpace.resist) {
    t = [
      `b|Rep b|let out b|a_sob, struggling in desperation as b|they b|plead for a|rep to let b|them go.`,

      `b|Rep b|feel tears streaming down b|their cheeks as b|they b|try to struggle out of a|reps grip, letting out b|a_sob before begging for a|them to let b|them go.`,

      `b|Rep b|continue to struggle against a|rep, sobbing and squirming in discomfort as b|they realise that a|rep isn't completely finished with b|them just yet.`,

      ` b|Rep b|let out b|a_sob as b|they b|continue struggling against a|rep, begging for a|them to let b|them go.`,

      `Realising that a|they hasn't completely finished with b|them just yet, b|rep b|continue struggling and sobbing, tears streaming down b|their b|face as b|they b|plead for a|rep to let b|them go.`,

      `b|Reps relief as ${s} is short-lived, as a|rep a|is not entirely finished with b|them yet.`,

      `As b|rep b|beg for a|rep to release b|them, but is silenced when a|they a|threaten to make b|them ${a}.`,

      ` With tears streaming down b|their b|face, b|rep b|let out b|a_sob as b|they realises that a|rep a|isn't finished with b|them just yet.`,

      ` b|Rep can't b|help but b|let out sob as ${s}, and b|they b|continue crying and protesting as b|they b|carry on weakly struggling against a|them.`,

      ` With b|a_sob, b|rep b|continue to struggle and protest, tears streaming down b|their b|face as ${s}.`,

      ` b|Rep b|let out a relieved sigh, which soon turns into b|a_sob as b|they realises that a|rep a|isn't finished with b|them just yet.`,
    ]
  } else if (theirpace == setup.sexpace.forced) {
    const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
    t = [
      `b|Rep b|let out a silent sigh, desperate to know when a|rep will be tired.`,
      `b|Rep wordlessly awaited for b|their next order, unsure if a|rep still have something in mind.`,
      `b|Rep b|remain silent as ${s}, hoping that b|their performance has pleased a|rep.`,
      `b|Rep b|release an involuntary b|moan as ${s}, increasing b|their confusion at the situation.`,
      `b|Rep silently b|hope b|they b|do not have to ${a}, but a|rep may a|have other plans.`,
      `b|Rep ${h} await b|the next use of b|their b|body.`,
    ]

    if (is_dom) {
      t = t.concat([
        `It took b|rep a lof ot b|their willpower to withstand all the abuses b|they b|is forced to endure.`,
      ])
    } else {
      t = t.concat([
        `Deep down, b|rep b|is horrified that b|they b|is starting to enjoy the unwanted attention.`,
      ])
    }

  } else if (theirpace == setup.sexpace.mindbroken) {
    t = [
      ` the attention`,
      ` everything, including when ${s}`,
    ]

    if (is_dom) {
      t = t.concat([
        `the abuse `,
      ])
    } else {
      t = t.concat([
        `the pleasuring`,
      ])
    }

    t = [
      setup.SexUtil.mindbrokenReactionNoun(them, sex, t)
    ]

  } else if (theirpace == setup.sexpace.sub) {
    if (is_dom) {
      t = [
        ` b|Rep b|let out b|a_moan, revealing b|their desire to ${a}.`,
        ` b|Rep b|moan as ${s}, betraying b|their desperate desire to ${a}.`,
        ` b|Reps little submissive mind can't help but crave to be allowed to ${a}.`,
        ` b|A_moan bursts out from between b|reps lips, betraying b|their desire to ${a}.`,
        ` b|Rep b|let out b|a_moan as ${s}, eager for more of a|their attention.`,
        ` b|A_moan escapes from between b|reps lips, betraying b|their desperate desire for more of a|reps attention.`,
      ]
    } else {
      t = [
        ` The action over, b|rep secretly b|hope b|they can instead bottom for the rest of the actions.`,
        ` Despite b|their submissive tendencies, b|they can't help but still crave to ${a}.`,
        ` b|Rep b|let out b|a_moan as ${s}.`,
        ` b|A_moan drifts out from between b|reps lips as ${s},
          betraying b|their desire for more of a|reps attention.`,
      ]
    }
  } else if (theirpace == setup.sexpace.normal) {
    t = [
      ` b|Rep b|let out b|a_moan as ${s}.`,
      ` b|A_moan drifts out from between b|reps lips as ${s}.`,
      ` b|Rep b|is eager to try something else for the rest of this intercourse.`,
      ` b|Rep reflexively b|moan as ${s}.`,
      ` b|Rep b|is looking forward to a different, new sex.`,
    ]
  } else {
    if (is_dom) {
      t = [
        `With a loud growl, b|rep immediately a|attempt to seize control of the sex.`,
        `b|Rep b|is looking forward for a|their turn to be on top now.`,
        `b|Rep b|look glad that b|they b|do not have to ${a}.`,
      ]
    } else {
      t = [
        `As ${s}, b|rep already b|have in mind how to next dominate a|rep.`,
        `b|Rep b|consider continue forcing a|rep to ${a}, but b|have other ideas for now.`,
        `As ${s}, b|rep dominantly b|continue to assert control of the entire sex.`,
      ]
    }
  }
  return setup.SexUtil.convert(t, { a: me, b: them, }, sex)
}


/**
 * Me just finished penetrating them (as a dom). Give their reaction.
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * 
 * [sentences]: (withdraws my dick, my dick slides out of their tongue, ..)
 * @param {string[]} past_sentences 
 * 
 * What a sub want, e.g., (continue sucking on a|their cock) 
 * @param {string[]} action_sentences
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexUtil.afterPenetrationReactionDom = function (me, them, past_sentences, action_sentences, sex) {
  return afterPenetrationReaction(me, them, past_sentences, action_sentences, sex, /* is dom = */ true)
}


/**
 * Me just finished penetrating them (as a sub). Give their reaction.
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * 
 * [sentences]: (withdraws their tongue, ..)
 * @param {string[]} past_sentences 
 * 
 * What a sub/dom want, e.g., (continue having their tongue in their vagina) 
 * @param {string[]} action_sentences
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexUtil.afterPenetrationReactionSub = function (me, them, past_sentences, action_sentences, sex) {
  return afterPenetrationReaction(me, them, past_sentences, action_sentences, sex, /* is dom = */ true)
}

// only for forced units
/**
 * 
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 */
setup.SexUtil.hesitatesBeforeForcingThemselfTo = function (unit, sex) {

  const topic = setup.Text.Banter._getTopic()
  const pre = [
    `a|hesitate for a short moment`,
    `trying to find the mercy that is never there`,
    `a|try a|their best to think about ${topic} instead`,
    `a|shut a|their a|eyes`,
    `a|whimper quietly`,

    `silently a|beg for forgiveness`,
    `a|let a hesitant sigh`,
    `a|look at a|their betters`,
    `a|hesitate`,
    `a|pause for a short moment`,

    `a|pause, obviously considering whether to resist`,
    `a|have to be threatened`,
    `a|struggle with a considerable uneasiness in a|themself`,
    `a|struggle with a mixture of resistance, obedience, and even devotion forced to the forefront of a|their mind`,
    `a|plead for mercy`,

    `a|have doubts about the current situation`,
  ]

  const mid = [
    `before forcing a|themself to`,
    `until a|they a|muster the courage to`,
    `until a|they a|force a|themself to`,
    `until a|they a|is reminded of punishment and a|choose to`,
    `before deciding to choose the lesser of two evils and a|get to`,

    `before giving up and forcing a|themself to`,
    `before surrending and force a|themself to`,
    `but eventually a|decide to`,
    `but eventually a|decide to save a|their strength and a|give in to`,
    `although a|rep a|have no choice but to`,

    `before reminding a|themself that a|they a|is a slave and a|proceed to`,
    `before giving up on finding mercy and force a|themself to`,
    `but a|decide that it would be easier for them to`,
  ]

  let story = setup.rng.choice(pre) + ', ' + setup.rng.choice(mid)

  return setup.SexUtil.convert(
    story,
    { a: unit },
    sex
  )
}


/**
 * Me abusing b, who is a masochist.
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * 
 * [actions]: (being spanked, being spit on their face, ...)
 * @param {string[]} actions
 * 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexUtil.masochistReaction = function (me, them, actions, sex) {
  const action = `###ACTION###`
  let t = [
    ` A clearly aroused yelp escapes from b|reps b|mouth at ${action},
      letting a|rep know that b|they a|is deriving masochistic pleasure from being abused in such a fashion.`,
    ` The horny squeal that escapes b|reps b|mouth is enough to let anyone realise that b|they a|is
      getting turned on from being treated in such a degrading manner.`,
    ` Instead of a painful cry, b|rep b|let out a horny moan,
      letting a|rep know that b|they a|is a masochist who's getting turned on by being abused like this.`,
    ` A a|let out an obviously aroused moan from ${action}, a|their masochistic urges winning out and deriving
      pleasure from the rough treatment.`,
    ` An obviously horny scream escapes from b|reps b|mouth, the masochist deriving pleasure from ${action}.`,
  ]

  const text = setup.SexUtil.convert(t, { a: me, b: them }, sex)
  const rep_action = setup.rng.choice(actions)
  return text.replaceAll(/###ACTION###/g, rep_action)
}
