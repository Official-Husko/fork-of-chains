/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.dismissConfirm = function (unit) {
  const fragments = []
  fragments.push(html`
    <div>
      Are you sure you want to
      ${setup.DOM.Text.danger('DISMISS')}
      ${unit.rep()}?
      ${setup.Text.replaceUnitMacros(
    `a|They will be gone forever from your company and you will never see a|them ever again.`,
    { a: unit }
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.button(
    `Yes, I want to DISMISS ${unit.rep()}`,
    () => {
      let destination_passage
      if (unit.isSlaver()) {
        destination_passage = `Lodgings`
      } else {
        destination_passage = `Dungeons`
      }
      State.variables.company.player.removeUnit(unit)
      setup.DOM.Nav.goto(destination_passage)
    },
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(cancel)`,
    () => {
      setup.DOM.Nav.gotoreturn()
    }
  )}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.retireConfirm = function (unit) {
  const fragments = []
  fragments.push(html`
    <div>
      Are you sure you want to
      ${setup.DOM.Text.dangerlite('retire')}
      ${unit.rep()}?
      ${setup.Text.replaceUnitMacros(
    `a|They will no longer be one of your slavers, but you will try to maintain contact with a|them
     with the help of your ${setup.buildingtemplate.inn.rep()}.`,
    { a: unit }
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.button(
    `Yes, I want to retire ${unit.rep()}`,
    () => {
      setup.qc.Retire('unit').apply(setup.costUnitHelper(unit))
      State.variables.gUnit_key = unit.key
      setup.DOM.Nav.goto('UnitRetireAftermath')
    },
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(cancel)`,
    () => {
      setup.DOM.Nav.gotoreturn()
    }
  )}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.retireAftermath = function (unit) {
  const fragments = []

  /**
   * @param {string[]} texts 
   * @returns {string}
   */
  function parse(texts) {
    return setup.Text.replaceUnitMacros(texts, { a: unit })
  }

  // dismiss paragraph
  {
    const weeks = unit.getWeeksWithCompany()
    const para = []
    para.push(
      parse([
        `You call a|rep over to your office, and a|they arrives a|adv. `,
        `You summon a|rep into your office, and a|they enters a|adv. `,
        `Per your summons, a|rep enters a|adv into your office, not knowing what this is all about. `,
      ])
    )
    para.push(
      parse([
        `You thank a|them for all a|their services for having work with you for all the ${weeks} weeks so far, before finally letting a|them know that you have decided to retire a|them. `,
        `After thanking a|them for a|their services in the past ${weeks} weeks, you cut straight to the point and tell a|them that it is time for a|them to retire from being a slaver. `,
        `You cut straight to the point, thanking a|them for a|their services in the ${weeks} weeks together with you, asking a|them to retire from being a slaver. `,
      ])
    )

    const friendship = State.variables.friendship.getFriendship(State.variables.unit.player, unit)
    if (friendship >= 300) {
      para.push(
        parse([
          `You do so with a heavy heart, as you still consider a|them your friend, but it has to be done. `,
          `You try to deliver the news as straightforwardly as possible, as a|they a|is your friend.`,
          `a|They considers you a friend, and knows that you are not joking around this time.`,
        ])
      )
    } else if (friendship <= -300) {
      para.push(
        parse([
          `You and a|rep might have been rivals throughout, which might have affected your judgment somewhat. `,
          `You already know that you will be missing your rival in the coming days, but it has to be done. `,
          `Despite being rivals, a|they still consider you an ally, and a|they does not expect this kind of request from you. `,
        ])
      )
    } else {
      para.push(
        parse([
          `Frankly speaking, your relationship with a|them isn't anything special, so you deliver the news with the most professional tone you can muster. `,
          `Despite not knowing much about the a|race, you still consider a|them a valuable ally, and you deliver the news with heavy heard. `,
          `You might not be a|their friend, but a|they a|was your colleague throughout these years, and you can feel a tinge of sadness as you realize what is going to happen. `,
        ])
      )
    }

    para.push([
      parse([
        `Still, you console yourself and also a|them by making sure that both of you will see each other again in the future, and to keep contacts with each other. `,
        `Still, you invite a|them to come and visit your fort anytime a|they happens to be around in the future, which the a|race a|adv agrees to. `,
        `However, you are planning to keep in touch with a|them, so the goodbye isn't for forever, and perhaps you'll see each other again in the future. `,
      ])
    ])

    para.push(
      parse([
        `a|They takes the news a|adv, but understands your decision. `,
        `a|They a|adv takes in the news, and understanding appears on a|their face. `,
        `a|They takes in the news a|adv, and although it took you some time, they finally see the benefits of having the luxury to retire early. `,
      ])
    )

    const bgs = unit.getAllTraitsWithTag('bg')
    const rich = bgs.filter(bg => bg.getTags().includes('rich'))
    const medium = bgs.filter(bg => !bg.getTags().includes('poor'))

    if (rich.length) {
      para.push(
        parse([
          `Still, a|they have another home other than your fort, and a|they looks quite eager to return to a|their old luxurious life of being a ${rich[0].rep()}.`,
          `Still, a|rep is a ${rich[0].rep()}, and this just means a|they could simply return to the luxury where a|they came from.`,
          `Still, a|rep came from a rather well-off past, and this just means a|they could return to the opulence of a|their past.`,
        ])
      )
    } else if (medium.length) {
      para.push(
        parse([
          `Despite not coming from a particularly rich background, having been a ${medium[0].rep()}, a|they has amassed quite a bit of personal wealth working with you, and a|they could use it to build a different future for a|them. `,
          `a|They have accumulated quite a bit of gold from both the wages a|they took from you, as well as a bit of coins a|they found during the missions here and there, much more than what a|they used to make as a ${medium[0].rep()}. It should prove sufficient for whatever a|they a|is planning to do in the future. `,
          `a|They may not have come from a particularly rich background, but having worked with you for some time, by now a|they a|have accumulated quite a bit of money to jumpstart another career, or perhaps simply resuming being a ${medium[0].rep()}. `,
        ])
      )
    } else {
      para.push(
        parse([
          `Despite coming from a poor background, a|they has amassed quite a bit of personal wealth working with you, and a|they could use it to build a different future for a|them. `,
          `a|They a|have turned around from being a poor a|race into having accumulated quite a bit of gold from both the wages a|they took from you, as well as a bit of coins a|they found during the missions here and there. It should prove sufficient for whatever a|they a|is planning to do in the future. `,
          `a|They might come from a poor background, but having worked with you for some time, by now a|they a|have accumulated quite a bit of money to jumpstart another career. `,
        ])
      )
    }

    para.push(
      parse([
        `You both say your goodbyes and soon enough, a|rep walks out of your fort, throwing you a last glance before being gone from your sigh. `,
        `After packing all a|their personal belongings and saying a|their goodbyes to the other slavers, a|they give you a last nod before walking away from your fort. `,
        `a|Rep collects and packs all a|their considerable money and belongings, before packing them on a hired cart and ride off to some unknown future. `,
      ])
    )

    fragments.push(html`
      <p>
        ${para.join(' ')}
      </p>
    `)
  }

  { // what happens in the future paragraph
    const para = []

    para.push(
      parse([
        `Some time later, you receive the news about a|reps new whereabouts. `,
        `After a while, you receive an update from your ex-slaver. `,
        `A few days later, you learn about a|reps new living. `,
      ])
    )

    fragments.push(html`
      <p>
        ${para.join(' ')}
      </p>
    `)
  }

  { // livings info
    fragments.push(html`
      <p>
        ${setup.DOM.Card.livingdescription(unit)}
      </p>
    `)
  }

  setup.DOM.Nav.topLeftNavigation(
    setup.DOM.Nav.move(`Continue`, `Lodgings`)
  )

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.move(`Continue`, `Lodgings`)}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}

/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.retiredDismissConfirm = function (unit) {
  const fragments = []
  fragments.push(html`
    <div>
      Are you sure you want to
      ${setup.DOM.Text.danger('REMOVE')}
      ${unit.rep()} permanently?
      ${setup.Text.replaceUnitMacros(
    `a|They will be gone forever and you will never see a|them ever again.`,
    { a: unit }
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.button(
    `Yes, I want to REMOVE ${unit.rep()} permanently`,
    () => {
      State.variables.retiredlist.unretire(unit)
      setup.notify(
        `a|Rep a|have been removed from the game`,
        { a: unit }
      )
      setup.DOM.Nav.gotoreturn()
    },
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(cancel)`,
    () => {
      setup.DOM.Nav.gotoreturn()
    }
  )}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.rehireRetiredConfirm = function (unit) {
  const cost = setup.RETIRE_RERECRUIT_COST_MONEY
  const weeks = setup.RETIRE_RERECRUIT_AFK_WEEKS

  const fragments = []
  fragments.push(html`
    <div>
      Are you sure you want to
      ${setup.DOM.Text.successlite('re-hire')}
      ${unit.rep()} for ${setup.DOM.Util.money(cost)}?
      ${setup.Text.replaceUnitMacros(
    `a|They will need ${weeks} weeks to wrap up things on a|their end first before a|they will become available again.`,
    { a: unit }
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.button(
    `Yes, I want to re-hire ${unit.rep()}`,
    () => {
      State.variables.company.player.substractMoney(cost)
      State.variables.notification.disable()
      State.variables.retiredlist.unretire(unit)
      State.variables.company.player.addUnit(unit, setup.job.slaver)
      State.variables.leave.leave(
        unit,
        `a|is wrapping up ends in order to rejoin your company as a slaver proper`,
        weeks,
      )
      State.variables.notification.enable()
      setup.notify(
        `a|Rep a|have rejoined your company! a|They will need ${weeks} weeks in order to wrap up things on a|their end first, however`,
        { a: unit }
      )
      setup.DOM.Nav.gotoreturn()
    },
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(cancel)`,
    () => {
      setup.DOM.Nav.gotoreturn()
    }
  )}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}
