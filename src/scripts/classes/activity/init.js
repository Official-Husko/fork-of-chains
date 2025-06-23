// create a bunch of fucking-related activities.
setup.ActivityTemplateInitFuck = function () {
  const rarity_default = setup.rarity.rare
  const veryrare = setup.rarity.epic

  const authordata = {
    name: 'Innoxia',
    url: 'https://lilithsthrone.blogspot.com/',
  }

  const horny_c = ['per_lustful', 'per_sexaddict']
  const horny_d = []
  const cruel_c = ['per_cruel']
  const cruel_d = ['per_kind', 'per_honorable']
  const weird_c = ['per_lunatic', 'per_playful']
  const weird_d = ['per_stubborn',]

  const default_horny_abuse_crit = horny_c.concat(cruel_c)
  const default_horny_abuse_disaster = horny_d.concat(cruel_d)

  const slave_rooms = ['dungeons']
  const slaver_rooms = ['lodgings']

  const fucks = [
    {
      name: 'Fuck a slave',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.vagina,
    },
    {
      name: 'Buttfuck a slave',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_anus)],
    },
    {
      name: 'Tailfuck a slave',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit.concat(weird_c),
      disaster: default_horny_abuse_disaster.concat(weird_d),
      type: 'slave',
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.vagina,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_tail)],
    },
    {
      name: 'Anal Tailfuck a slave',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit.concat(weird_c),
      disaster: default_horny_abuse_disaster.concat(weird_d),
      type: 'slave',
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
        setup.qres.HasItem(setup.item.sexmanual_bodypart_anus),
      ],
    },
    {
      name: 'Facefuck a slave',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.mouth,
    },
    {
      name: 'Have a slave eat you out',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.mouth,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_penetration_mouthhole)],
    },
    {
      name: 'Have a slave fuck you',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.penis,
    },
    {
      name: 'Have a slave tailfuck you',
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: 'slave',
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.tail,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_tail)],
    },
    {
      name: 'Consensual vaginal',
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: 'slaver',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.vagina,
    },
    {
      name: 'Consensual anal',
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: 'slaver',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_anus)],
    },
    {
      name: 'Consensual anal tailfuck',
      rooms: slaver_rooms,
      crits: horny_c.concat(weird_c),
      disaster: horny_d.concat(weird_d),
      type: 'slaver',
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
        setup.qres.HasItem(setup.item.sexmanual_bodypart_anus),
      ],
    },
    {
      name: 'Consensual tailfuck',
      rooms: slaver_rooms,
      crits: horny_c.concat(weird_c),
      disaster: horny_d.concat(weird_d),
      type: 'slaver',
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.vagina,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
      ],
    },
    {
      name: 'Consensual oral',
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: 'slaver',
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.mouth,
    },
    {
      name: 'Consensual cunnilingus',
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: 'slaver',
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.mouth,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_penetration_mouthhole)],
    },
  ]

  for (const fuckdata of fucks) {
    let bres = []

    if (fuckdata.type == 'slave') {
      bres = [
        setup.qres.Job(setup.job.slave),
        setup.qres.CanBeUsedByRememberedUnit()
      ]
      if (fuckdata.target_bodypart == setup.sexbodypart.penis) {
        bres.push(
          setup.qres.AnyTrait([
            setup.trait.dick_tiny,
            setup.trait.dick_small,
            setup.trait.dick_medium,
            setup.trait.dick_large,
            setup.trait.dick_huge,
            setup.trait.dick_titanic], true),
        )
      }
    } else if (fuckdata.type == 'slaver') {
      bres = [
        setup.qres.Job(setup.job.slaver),
        setup.qres.NoTrait(setup.trait.per_chaste),
      ]
    }
    bres = bres.concat(fuckdata.target_bodypart.getHasRestrictions())

    /**
     * @type {Dialogue}
     */
    const dialogue_a = {
      actor: 'a',
      // @ts-ignore
      texts: [
        `<<set _dialogue = setup.Text.Dirty.talk({strip: true, unit: $g.a, target: $g.b, unit_bodypart: setup.sexbodypart.${fuckdata.unit_bodypart.key}, target_bodypart: setup.sexbodypart.${fuckdata.target_bodypart.key}})>> <<= _dialogue.unit_dialogue >>`,
      ],
    }
    /**
     * @type {Dialogue}
     */
    const dialogue_b = {
      actor: 'b',
      // @ts-ignore
      texts: [
        `<<set _dialogue = setup.Text.Dirty.talk({strip: true, unit: $g.a, target: $g.b, unit_bodypart: setup.sexbodypart.${fuckdata.unit_bodypart.key}, target_bodypart: setup.sexbodypart.${fuckdata.target_bodypart.key}})>> <<= _dialogue.target_dialogue >>`,
      ],
    }

    new setup.ActivityTemplate({
      key: setup.getKeyFromName(fuckdata.name, setup.activitytemplate),
      name: fuckdata.name,
      author: authordata,
      tags: [],
      actor_unitgroups: {
        'a': [
          setup.qres.Job(setup.job.slaver),
          setup.qres.NoTrait(setup.trait.per_chaste),
          setup.qres.RememberUnit(),
        ].concat(fuckdata.unit_bodypart.getHasRestrictions()),
        'b': bres,
      },
      // @ts-ignore
      critical_traits: fuckdata.crits.map(key => setup.selfOrObject(key, setup.trait)),
      // @ts-ignore
      disaster_traits: fuckdata.disaster.map(key => setup.selfOrObject(key, setup.trait)),
      restrictions: fuckdata.restriction || [],
      rarity: fuckdata.rarity ? fuckdata.rarity : rarity_default,
      dialogues: [
        dialogue_a,
        dialogue_b,
      ],
      // @ts-ignore
      room_templates: fuckdata.rooms.map(key => setup.selfOrObject(key, setup.roomtemplate)),
    })
  }
}
