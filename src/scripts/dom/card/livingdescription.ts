// @ts-nocheck

/**
 * @param {setup.Unit} unit 
 * @param {setup.Living} living 
 * @returns {string}
 */
setup.DOM.Card.livingvisitdescription = function (unit, living) {
  // bonus texts
  const business = living.repBusiness(unit)
  const hobby = setup.Text.Hobby.verb(unit)

  const options = [
    `When a|they is not too busy ${business}, a|they would occasionally visit the fort, enjoying ${hobby} with the rest of your current slavers.`,
    `Occasionally, a|they would pop by at your fort and a|adv greet you as well as some of the new hires.`,
    `a|They a|spend most of a|their days ${business}, although every now and then a|they would visit your fort and enjoy some of the offered slaves.`,
    `a|They a|remain friends with some of the slavers under your employ, and a|they would occasionally visit your fort in between ${business}.`,
    `Despite a|their new occupation, a|they would still drop by at your fort every now and then and ${hobby}.`
  ]

  const traits = unit.getTraits()

  if (traits.includes(setup.trait.per_brave)) {
    options.push(`a|They would occasionally visit your fort alone, braving the dangers of the land all by a|themself.`)
  }

  if (traits.includes(setup.trait.per_cautious)) {
    options.push(`During a|their free time, a|they would sometimes go and visit your fort, sometimes even with a full entourage of hired mercenaries to keep a|them safe from the dangers of the land.`)
  }

  if (traits.includes(setup.trait.per_aggressive)) {
    options.push(`a|They sometimes would visit your fort, challenging the newcomers to a drinking contest or two.`)
  }

  if (traits.includes(setup.trait.per_calm)) {
    options.push(`a|They sometimes would visit your fort, patiently giving advise to the new faces around.`)
  }

  if (traits.includes(setup.trait.per_proud)) {
    options.push(`a|They would sometimes come and visit your fort, admiring the magnificant company a|they once belonged to.`)
  }

  if (traits.includes(setup.trait.per_humble)) {
    options.push(`a|They would sometimes come and visit your fort, reflecting at how far a|they had come in a|their life.`)
  }

  if (traits.includes(setup.trait.per_direct)) {
    options.push(`Sometimes, a|they could be seen in the taverns of your fort trading insults with other patrons.`)
  }

  if (traits.includes(setup.trait.per_sly)) {
    options.push(`Sometimes, a|they could be seen in the taverns of your fort swindling customers as well as some of your slavers out of their hard-earned money.`)
  }

  if (traits.includes(setup.trait.per_studious)) {
    options.push(`Sometimes, a|they would come and browse the many books stored within your fort.`)
  }

  if (traits.includes(setup.trait.per_active)) {
    options.push(`Sometimes, a|they would come and run around the vast fields surrounding your fort.`)
  }

  if (traits.includes(setup.trait.per_loner)) {
    options.push(`a|They rarely visit your fort, the loner preferring a|their own company.`)
  }

  if (traits.includes(setup.trait.per_gregarious)) {
    options.push(`a|They often visit your fort, enjoying the company of a|their old friends.`)
  }

  if (traits.includes(setup.trait.per_frugal)) {
    options.push(`a|They sometimes could be seen in your fort markets, looking for bargains.`)
  }

  if (traits.includes(setup.trait.per_lavish)) {
    options.push(`a|They sometimes could be seen in your fort markets, buying the most expensive rug a|they lay a|their eyes on.`)
  }

  if (traits.includes(setup.trait.per_loyal)) {
    options.push(`Despite not being part of your company anymore, a|they would still visit often out of pure loyalty.`)
  }

  if (traits.includes(setup.trait.per_independent)) {
    options.push(`a|They would occasionally drop by to visit your fort, but also enjoys a|their newly found freedom working away from the fort.`)
  }

  if (traits.includes(setup.trait.per_attentive)) {
    options.push(`a|They would occasionally be invited to help drill new slavers, as you know how attentive the ex-slaver is to details.`)
  }

  if (traits.includes(setup.trait.per_dreamy)) {
    options.push(`Sometimes, you could find a|them inside your fort, snoozing away under a leafy tree.`)
  }

  if (traits.includes(setup.trait.per_stubborn)) {
    options.push(`You sometimes could spot a|them stubbornly haggling with one of the merchants in your fort.`)
  }

  if (traits.includes(setup.trait.per_curious)) {
    options.push(`a|They would still explore the surrounding lands often out of pure curiosity, and when a|they happen to be nearby, a|they would drop by your fort for a friendly visit.`)
  }

  if (traits.includes(setup.trait.per_kind)) {
    options.push(`a|They would still come to your fort every now and then, sometimes even descending into the dungeons to take care of some of the slaves.`)
  }

  if (unit.isHasTrait(setup.trait.per_cruel)) {
    options.push(`a|They would still come to your fort every now and then, and the slave dungeons remains as one of a|their favorite facilities in your fort.`)
  }

  if (traits.includes(setup.trait.per_serious)) {
    options.push(`a|They would sometimes come to your fort, and before anyone informs you, would already be knocking stoically at your office door.`)
  }

  if (traits.includes(setup.trait.per_playful)) {
    options.push(`a|They would come to your fort often, enjoying the many fun activities inside as a visitor.`)
  }

  if (traits.includes(setup.trait.per_logical)) {
    options.push(`Sometimes, a|they would come over to your fort and help you plan the future of your fort.`)
  }

  if (traits.includes(setup.trait.per_empath)) {
    options.push(`Sometimes, a|they would come over to your fort to share and gossip with you about the new recruits.`)
  }

  if (traits.includes(setup.trait.per_chaste)) {
    options.push(`a|They went back relatively chaste once a|their slaving duties are over, and would sometimes revisit your fort to experience the non-carnal side of the establishment.`)
  }

  if (unit.isHasTrait(setup.trait.per_lustful)) {
    options.push(`Whenever a|they comes to visit your fort, the lusty a|race would use a slave or two without fail.`)
  }

  if (traits.includes(setup.trait.per_dominant)) {
    options.push(`a|They sometimes would come to your fort to use a slave or two, satisfying a|their dominant tendencies.`)
  }

  if (traits.includes(setup.trait.per_submissive)) {
    options.push(`a|They would sometimes come to your fort, and secretly go into the dungeons alone to role-play being a proper submissive slave`)
  }

  if (traits.includes(setup.trait.per_masochistic)) {
    options.push(`a|They sometimes would come to your fort, and you can sense a|their jealousy each time a slave was inflicted with pain.`)
  }

  if (traits.includes(setup.trait.per_lunatic)) {
    options.push(`a|They never announces whenever a|they decides to come and pay you a visit, the lunatic preferring to keep every visit a surprise.`)
  }

  if (traits.includes(setup.trait.per_honorable)) {
    options.push(`a|They would sometimes come over to your fort, a|their chin always held up high.`)
  }

  if (traits.includes(setup.trait.per_evil)) {
    options.push(`a|They would sometimes come over to your fort to discuss a|their malicious plans and ask for your opinions on them.`)
  }

  if (traits.includes(setup.trait.muscle_verystrong)) {
    options.push(`a|They always attracts attention from your new slavers each time the muscle-bound monster of a slaver pays you a cordial visit.`)
  }

  if (traits.includes(setup.trait.height_giant)) {
    options.push(`a|They always attracts attention from your new slavers each time the giant of a slaver pays you a cordial visit.`)
  }

  return setup.Text.replaceUnitMacros(options, { a: unit })
}


/**
 * @param {setup.Unit} unit 
 * @param {setup.Living} living 
 * @returns {setup.DOM.Node}
 */
export function livingPassage(unit, living) {
  State.variables.g = { a: unit }
  if (!living) {
    living = unit.getLiving()
  }
  return setup.DOM.Util.include_replace(living.getDescriptionPassage())
}


/**
 * @param {setup.Unit} unit
 * @param {setup.Living} [living]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.livingdescription = function (unit, living) {
  const fragments = []
  if (!living) {
    living = unit.getLiving()
  }

  fragments.push(livingPassage(unit, living))
  fragments.push(html`
    <p>
      ${setup.DOM.Card.livingvisitdescription(unit, living)}
    </p>
  `)

  return setup.DOM.create('div', {}, fragments)
}
