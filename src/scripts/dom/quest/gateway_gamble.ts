// @ts-nocheck

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function mindbreak_slaver(slaver, slave, demon, quest) {
  setup.qc.MissingUnitForever('slave').apply(quest)
  setup.qc.Leave('gambler', 'a|is recovering from being "mindbroken" by a demon', 30).apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `You dared to offer a slave in such mental state, mortal? Well then, you shall receive just punishment!`,
  })
    }
    <p>
      A few days later, a large crate was delivered to your fort, from somewhere in the Deepworld.
      Inside was two slaves, or rather, one slave, ${slave.rep()} and also a completely unresponsive ${slaver.rep()}.
      It seems the demon had seen it fit to punish your slaver for trying to offer
      ${setup.Text.replaceUnitMacros(`demon|them a slave in such a state.
      Fortunately for you, gambler|reps mind seems fixable, given enough time to rest...`,
      { gambler: slaver, demon: demon })}
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function doll(slaver, slave, demon, quest) {
  setup.qc.MissingUnitForever('slave').apply(quest)
  setup.qc.BodyswapOneDirection('doll', 'slave').apply(quest)
  setup.qc.ClearMentalTraits('doll').apply(quest)
  setup.qc.Slave('doll').apply(quest)

  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Mmm, take this doll. I'm sure you will find it a fitting counterpart to what you have offered me.`,
  })
    }
    <p>
      From the gateway, ${slave.rep()} was seemingly returned, launched headfirst onto the floor.
      But upon closer inspection, the slave was a completely different person that your original slave.
      They look absolutely similar in physical appearance, but this one is not mindbroken.
      However,
      the slave is completely devoid of any emotion or personality, just like a doll...
      Unnerving.
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function services(slaver, slave, demon, quest) {
  setup.qc.Slaver('demon', 'a|was a demon who maintained a portal deep within the Deeprealm').apply(quest)
  setup.qc.AddTitle('slave', 'quest_tainted_by_demons_0').apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `My, my, what an utterly delightful little slave. Nothing I've ever seen in the demon plane. Mind if I come out and play?`,
  })
    }
    <p>
      From the gateway,
      ${slave.rep()} appeared, crawling on all fours next to a demon.
      Even from afar, ${setup.Text.replaceUnitMacros(`gambler|rep`, { gambler: slaver })} could feel power emanating from the demon -- this must be one
      of the most powerful demons to reside within the plane.
      The demon has offered to join your company, out of pure curiosity
      on how you managed to obtain your hands on such a valuable slave.
      Even before you decide whether to accept or refuse, the demon has already marked
      ${slave.rep()} permanently, tainting the slave with a demonic brand marking
      ${slave.rep()} as the demon's property for all eternity.
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function nothing(slaver, slave, demon, quest) {
  setup.qc.MissingUnitForever('slave').apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Hmph, what a worthless slave. Worths nothing, and that's exactly what you're going to get.`,
  })
    }
    <p>
      Even after a few more days of waiting, nothing else came out from the portal.
      Perhaps offering such a low-valued slave was not such a bright idea...
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function curse(slaver, slave, demon, quest) {
  setup.qc.Blessing('gambler', 1, null, true).apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Is this an insult?! You will pay for your insolence.`,
  })
    }
    <p>
      The next few moments came out in a chaos. ${slave.rep()} was thrown out from the portal,
      followed by numerous balls of dark energy. Some hit ${setup.Text.replaceUnitMacros(`gambler|rep`, { gambler: slaver })},
      cursing the slaver...
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function money(slaver, slave, demon, quest) {
  setup.qc.MissingUnitForever('slave').apply(quest)
  const worth = slave.getSlaveValue()
  setup.qc.Money(Math.round(worth * 1.1)).apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Well well, this is a delightful little slave. I'm a fair demon, you will get your slave's worth back.`,
  })
    }
    <p>
      Coin started to stream out of the portal.
      ${setup.Text.replaceUnitMacros(`gambler|Rep`, { gambler: slaver })} scrambled to find whatever nearby ancient vase
      and jugs to contain the coins.
      In the end, your slaver ended with quite a bit of gold, a very fair amount considering the value of the
      slave.
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function title(slaver, slave, demon, quest) {
  setup.qc.AddTitle('slave', 'quest_filled_by_demons_1').apply(quest)
  return html`
    ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Today is your lucky day, mortal, for I have no need for such a slave. They will be returned, with compliments.`,
  })
    }
    <p>
      A completely unresponsive ${slave.rep()} fell from the portal with a thud.
      ${setup.Text.replaceUnitMacros(`After verifying that the slave is still alive, gambler|rep noted something has changed.
      Despite looking the same as before, something in the slave now draws people's attention to them.
      But whenever gambler|rep tried to point out the reason, gambler|they gambler|was at a loss.
      Either way, this will surely increase the slave's price in the right markets...`, { gambler: slaver })}
    </p>
    `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function personality_reverse(slaver, slave, demon, quest) {
  setup.qc.PerkChaoticPersonality('slave').apply(quest)
  return html`
  ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `You will have your slave back, mortal, and rejoice that I did not damage the worthless slut.`,
  })
    }
  <p>
    A completely unresponsive ${slave.rep()} fell from the portal with a thud.
      There seems to be no change at all, and your slavers took it at face value.
      But when the slave regained consciousness, it was apparent that mentally,
      the slave is a completely different person.
      It's as if the slave's entire personality has been shattered and remade opposite...
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function used_body(slaver, slave, demon, quest) {
  const original_value = slave.getSlaveValue()

  setup.qc.Mindbreak('slave').apply(quest)
  setup.qc.TraitReplaceExisting('slave', setup.trait.anus_gape).apply(quest)
  setup.qc.TraitReplaceExisting('slave', setup.trait.vagina_gape).apply(quest)
  setup.qc.Corrupt('slave')

  const new_value = slave.getSlaveValue()
  const diff = Math.max(original_value - new_value, 1000)

  setup.qc.Money(Math.round(diff * 1.5)).apply(quest)

  return html`
  ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `Amusing entertainment. It was a pleasant distraction from my usual group of toys, but I am finished now. You can have your slave back, as well as some money for the damages.`,
  })
    }
  <p>
    With a flash of dark light, ${slave.rep()} reappeared from the portal,
      as well as a dark ominous chest.
      The slave looks quite different.
      In particular, the slave's gaze that was once relatively alert, now completely fazed,
      looking at nothing in particular.
      How the demon managed to break such a slave within just a few minutes of use, you would never know...
    </p>
  `
}

/**
 * @param {setup.Unit} slaver 
 * @param {setup.Unit} slave 
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
function mirror_copy(slaver, slave, demon, quest) {
  setup.qc.MissingUnitForever('slave').apply(quest)
  setup.qc.BodyswapOneDirection('doll', 'slave').apply(quest)

  const doll = quest.getActorUnit('doll')
  const price_diff = slave.getSlaveValue() - doll.getSlaveValue()
  setup.qc.AddValueTitles('doll', Math.round(price_diff / 2)).apply(quest)
  setup.qc.Slave('doll').apply(quest)

  return html`
  ${setup.DOM.Card.dialogue({
    unit: demon,
    dialogue: `I think I'll keep this slave. Ahah, you shall receive your reward -- a perfect copy, so you won't miss them.`,
  })
    }
  <p>
    The portal warps and fizzles, until a slave much like ${slave.rep()} appeared daze from the
      portal.
      But while they may look alike, it is a completely different person, with different personalities
      to boot...
    </p>
  `
}

/**
 * @param {setup.Unit} slaver
 * @param {setup.Unit} slave
 * @param {setup.Unit} demon
 * @param {setup.QuestInstance} quest
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Quest.gateway_gamble = function (slaver, slave, demon, quest) {
  const options = []
  if (slave.isMindbroken()) {
    options.push(
      mindbreak_slaver,
      doll,
    )
  } else if (slave.isHasTrait(setup.trait.value_high7)) {
    options.push(
      services,
    )
  } else if (slave.isHasTrait(setup.trait.value_low)) {
    options.push(
      nothing,
      curse,
    )
  } else {
    options.push(
      money,
      personality_reverse,
      used_body,
      mirror_copy,
    )
    if (!slave.isHasTitle('quest_filled_by_demons_1')) {
      options.push(title)
    }
  }

  const effect = options[quest.getSeed() % options.length]
  return effect(slaver, slave, demon, quest)
}
