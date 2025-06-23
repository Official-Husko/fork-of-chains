setup.DebugInit = {}

setup.DebugInit.playerUnit = function () {
  const sv = State.variables
  /* Create player character */
  console.log('creating player')
  sv.unit.player = new setup.Unit(
    ["PlayerName", "PlayerLastName"],
    [setup.trait.gender_male,
    setup.trait.subrace_werewolf,
    setup.trait.bg_mercenary,
    setup.trait.dick_medium,
    setup.trait.balls_medium,
    setup.trait.anus_tight,
    setup.trait.per_brave,
    setup.trait.per_curious,
    setup.trait.tail_dragonkin,
    setup.trait.body_werewolf,
    setup.trait.arms_werewolf,
    setup.trait.legs_werewolf,
    setup.trait.mouth_werewolf,
    setup.trait.ears_werewolf,
    ],
    Array(setup.skill.length).fill(12),
    'player'
  )
  sv.company.player.addUnit(sv.unit.player, setup.job.slaver)
  sv.titlelist.addTitle(sv.unit.player, setup.title.leader)
}


setup.DebugInit.initCommon = function () {
  const sv = State.variables
  setup.DebugInit.playerUnit()
  sv.gDebug = true
}


/**
 * Initialize many variables for easier debug time.
 * This is the "lite" version, used for content creator.
 */
/**
 * @param {boolean} [is_fast]
 */
setup.DebugInit.initBuildings = function (is_fast) {
  const sv = State.variables
  /* Construct buildings */
  let buildings
  if (is_fast) {
    buildings = [
      'constructionoffice',
      'lodgings',
      'dungeons',
      'marketingoffice',
      'relationsoffice',
      'damagecontroloffice',
      'dutyroom',
      'missioncontrol',
      'warehouse',
      'prospectshall',
      'slavepens',
      'armory',
      'messengerpost',
      'hospital',
      'trainingchamber',
      'biolab',
      'greathall',
      'mailroom',
      'scouthut',
      'scouttower',
      'scoutoffice',
      'scoutcarriage',
      'scoutharbor',
      'recreationwing',
      'surgery',
      'ritualchamber',
      'temple',
      'market',
      'moraleoffice',
      'treatmentroom',
      'bazaar',
      'traumacenter',
      'veteranhall',
      'bedchamberwing',
      'library',
      'convincingroom',
      'alchemistshop',
      'classroom',
      'warroom',
      'inn',
      'landscapingoffice',
      'renovationoffice',
    ]
  } else {
    buildings = [
      'constructionoffice',
      'lodgings',
      'dungeons',
      'marketingoffice',
      'relationsoffice',
      'damagecontroloffice',
      'dutyroom',
      'missioncontrol',
      'warehouse',
      'prospectshall',
      'slavepens',
      'armory',
      'messengerpost',
      'hospital',
      'doctoroffice',
      'trainingchamber',
      'biolab',
      'greathall',
      'mailroom',
      'mysticoffice',
      'scouthut',
      'scouttower',
      'scoutoffice',
      'scoutcarriage',
      'scoutharbor',
      'scouttunnel',
      'recreationwing',
      'analfuckhole',
      'sissybooth',
      'bath',
      'cleaning',
      'courtyard',
      'gym',
      'kennel',
      'museum',
      'oralfuckhole',
      'stables',
      'stage',
      'theatre',
      'forge',
      'sexshop',
      'torturechamber',
      'fetishtrainingroom',
      'trainingbedroom',
      'trainingfield',
      'traininggrounds',
      'pasture',
      'tavern',
      'surgery',
      'surgerydick',
      'surgeryballs',
      'surgerybreast',
      'ritualchamber',
      'poolofmist',
      'deepritualchamber',
      'deeppoolofmist',
      'temple',
      'prayerroom',
      'market',
      'moraleoffice',
      'treatmentroom',
      'treatmentroomblank',
      'treatmentroomresetlevel',
      'bazaar',
      'traumacenter',
      'veteranhall',
      'bedchamberwing',
      'library',
      'convincingroom',
      'alchemistshop',
      'classroom',
      'viceleaderoffice',
      'specialistoffice',
      'warroom',
      'workshop',
      'booths',
      'inn',
      'recreationwingservice',
      'recreationwingsex',
      'landscapingoffice',
      'renovationoffice',
      'portalindoors',
      'portaloutdoors',
      'garden',
    ]
  }

  for (const building of buildings) {
    sv.fort.player.build(setup.buildingtemplate[building])
  }

  sv.company.player.addMoney(100000000)
  sv.settings.autosave_interval = 0
  sv.settings.inline_font = true
}

function initRooms() {
  for (let i = 0; i < 25; ++i) {
    State.variables.fortgrid.expandIndoors()
  }
  while (State.variables.fortgrid.isCanExpandOutdoor()) {
    State.variables.fortgrid.expandOutdoors()
  }

  const upgrades = [
    'lodgings',
    'dungeons',
    'missioncontrol',
    'armory',
    'bedchamberwing',
    'inn',
  ]
  for (const to_upgrade of upgrades) {
    State.variables.fort.player.getBuilding(setup.buildingtemplate[to_upgrade]).upgrade()
  }
  const room_locations = {
    'questoffice': [3, -2, 0],
    'constructionoffice': [0, 10, 0],
    'lodgings': [3, -14, 0],
    'dungeons': [1, -17, 22],
    'marketingoffice': [3, -8, 0],
    'relationsoffice': [3, -10, 0],
    'damagecontroloffice': [3, -4, 0],
    'dutyroom': [3, -6, 0],
    'missioncontrol': [1, -16, 15],
    'warehouse': [2, 19, 20],
    'prospectshall': [2, 2, 13],
    'slavepens': [2, 2, 15],
    'armory': [3, -28, 0],
    'messengerpost': [3, 1, 6],
    'hospital': [0, -14, 4],
    'doctoroffice': [1, -7, 4],
    'trainingchamber': [0, -28, 10],
    'biolab': [0, -28, 19],
    'greathall': [0, -6, 9],
    'mailroom': [0, -17, 12],
    'mysticoffice': [1, -9, 4],
    'scouthut': [0, 14, 6],
    'scouttower': [2, 17, 9],
    'scoutoffice': [2, 17, 7],
    'scoutcarriage': [0, 13, 8],
    'scouttunnel': [3, 23, 13],
    'shipyard': [3, 14, 0],
    'recreationwing': [0, 38, 0],
    'analfuckhole': [2, 39, 8],
    'sissybooth': [0, 35, 8],
    'bath': [2, 32, 8],
    'cleaning': [2, 31, 4],
    'courtyard': [0, 10, 8],
    'gym': [0, 28, 8],
    'kennel': [0, 27, 4],
    'museum': [3, 27, 0],
    'oralfuckhole': [3, 24, 0],
    'stables': [1, 25, 8],
    'stage': [0, 28, 13],
    'forge': [0, 28, 16],
    'trainingfield': [0, 28, 19],
    'theatre': [0, 35, 13],
    'sexshop': [1, 12, 21],
    'torturechamber': [2, -24, 6],
    'fetishtrainingroom': [0, -28, 7],
    'trainingbedroom': [2, -3, 21],
    'traininggrounds': [2, 6, 13],
    'pasture': [1, 24, 4],
    'tavern': [2, 39, 13],
    'surgery': [3, -21, 15],
    'surgerydick': [3, -9, 15],
    'surgeryballs': [0, -16, 17],
    'surgerybreast': [3, -12, 15],
    'ritualchamber': [2, 5, 0],
    'poolofmist': [0, 1, 3],
    'deepritualchamber': [2, 5, 5],
    'deeppoolofmist': [0, 1, 0],
    'temple': [3, 18, 0],
    'prayerroom': [3, 20, 13],
    'market': [0, 6, 17],
    'moraleoffice': [2, -3, 7],
    'treatmentroom': [0, -21, 9],
    'treatmentroomblank': [0, -17, 8],
    'treatmentroomresetlevel': [2, -17, 4],
    'bazaar': [0, 12, 13],
    'traumacenter': [0, -20, 3],
    'veteranhall': [0, -14, 9],
    'bedchamberwing': [0, -25, 0],
    'library': [1, -11, 20],
    'convincingroom': [0, -28, 15],
    'alchemistshop': [3, 12, 17],
    'classroom': [1, -7, 20],
    'viceleaderoffice': [1, -4, 4],
    'specialistoffice': [1, -2, 4],
    'warroom': [2, -5, 15],
    'workshop': [1, 15, 21],
    'booths': [0, 16, 13],
    'inn': [1, 1, 20],
    'recreationwingservice': [0, 38, 4],
    'recreationwingsex': [0, 34, 0],
    'landscapingoffice': [0, 10, 2],
    'renovationoffice': [3, 10, 5],
    'portalindoors': [0, -5, 7],
    'portaloutdoors': [0, 3, 18],
    'slaverroom': [3, -16, 0],
    'dungeonscell': [1, -19, 22],
    'lockerroom': [0, -8, 7],
    'armorystorage': [3, -23, 9],
    'bedchambersuite': [3, -3, 17],
    'innroom': [1, 5, 22],
    'garden': [0, 21, 8],
  }

  for (const room of Object.values(State.variables.roominstance)) {
    if (room.getTemplate().key in room_locations) {
      const loc = room_locations[room.getTemplate().key]
      room.setRotation(loc[0])
      State.variables.fortgrid.relocateRoom(
        room,
        { row: loc[1], col: loc[2] }
      )
    }
  }
}

/**
 * 
 * @param {Array<Array<string>>} units 
 */
setup.DebugInit.createUnits = function (units) {
  const sv = State.variables
  for (const [pool_key, job_key] of units) {
    const pool = setup.unitpool[pool_key]
    const unit = pool.generateUnit()
    sv.company.player.addUnit(unit, setup.job[job_key])
  }
}


setup.DebugInit.levelUp = function () {
  const sv = State.variables
  const units = sv.company.player.getUnits({ job: setup.job.slaver }, 'name')
  for (const unit of units) {
    for (let i = 0; i < 39; ++i) {
      unit.levelUp()
    }
  }
}

setup.DebugInit.initSlavesCommon = function () {
  const sv = State.variables

  /* Make several slaves for easier testing */
  sv.company.player.addUnit(setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_female' }), setup.job.slave)
  sv.company.player.addUnit(setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_male' }), setup.job.slave)

  const to_train = [
    setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_male' }),
    setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_female' }),
  ]

  for (const unit of to_train) {
    sv.company.player.addUnit(unit, setup.job.slave)
    for (const trait of setup.TraitHelper.getAllTraitsOfTags(['training', 'tradvanced'])) {
      if (unit.isTraitCompatible(trait)) {
        unit.addTrait(trait, /* group = */ null, /* replace = */ true)
      }
    }
  }

  const to_mindbreak = [
    setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_male' }),
    setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_female' }),
  ]

  for (const unit of to_mindbreak) {
    sv.company.player.addUnit(unit, setup.job.slave)
    unit.addTrait(setup.trait.training_mindbreak)
  }
}

setup.DebugInit.contentCreatorInit = function () {
  setup.DebugInit.initCommon()
  setup.DebugInit.initBuildings(true)

  const sv = State.variables

  const units = [
    ['subrace_humankingdom_female', 'slaver',],
    ['subrace_humanvale_male', 'slaver',],
    ['subrace_humansea_female', 'slaver',],
    ['subrace_humandesert_male', 'slaver',],
    ['subrace_angel_female', 'slaver',],
    ['subrace_elf_female', 'slaver',],
    ['subrace_drow_female', 'slaver',],
    ['subrace_fairy_female', 'slaver',],
    ['subrace_werewolf_male', 'slaver',],
    ['subrace_neko_female', 'slaver',],
    ['subrace_tigerkin_male', 'slaver',],
    ['subrace_kobold_male', 'slaver',],
    ['subrace_lizardkin_male', 'slaver',],
    ['subrace_dragonkin_male', 'slaver',],
    ['subrace_demon_female', 'slaver',],
    ['subrace_demonkin_female', 'slaver',],
    ['subrace_orc_male', 'slaver',],
  ]
  setup.DebugInit.createUnits(units)

  setup.DebugInit.initSlavesCommon()

  sv.notification.popAll()
}


/**
 * 
 * @param {Array.<setup.Equipment>} equipments 
 */
setup.DebugInit.getEquipmentSet = function (equipments) {
  const sv = State.variables
  const eq1 = sv.armory.newEquipmentSet()
  for (const eq of equipments) {
    sv.armory.addEquipment(eq)
    sv.armory.replaceEquipment(eq, eq1)
  }
  return eq1
}


setup.DebugInit.debugModeInit = function () {
  setup.DebugInit.initCommon()
  setup.DebugInit.initBuildings()
  initRooms()
  const sv = State.variables

  const units = [
    ['subrace_humankingdom_male', 'slaver',],
    ['subrace_humankingdom_female', 'slaver',],
    ['subrace_humanvale_male', 'slaver',],
    ['subrace_humanvale_female', 'slaver',],
    ['subrace_humansea_male', 'slaver',],
    ['subrace_humansea_female', 'slaver',],
    ['subrace_humandesert_male', 'slaver',],
    ['subrace_humandesert_female', 'slaver',],
    ['subrace_elf_male', 'slaver',],
    ['subrace_elf_female', 'slaver',],
    ['subrace_drow_male', 'slaver',],
    ['subrace_drow_female', 'slaver',],
    ['subrace_werewolf_male', 'slaver',],
    ['subrace_werewolf_female', 'slaver',],
    ['subrace_neko_male', 'slaver',],
    ['subrace_neko_female', 'slaver',],
    ['subrace_kobold_male', 'slaver',],
    ['subrace_kobold_female', 'slaver',],
    ['subrace_lizardkin_male', 'slaver',],
    ['subrace_lizardkin_female', 'slaver',],
    ['subrace_demon_male', 'slaver',],
    ['subrace_demon_female', 'slaver',],
    ['subrace_orc_male', 'slaver',],
    ['subrace_orc_female', 'slaver',],
    ['subrace_tigerkin_male', 'slaver',],
    ['subrace_tigerkin_female', 'slaver',],
    ['subrace_angel_male', 'slaver',],
    ['subrace_angel_female', 'slaver',],
    ['subrace_fairy_male', 'slaver',],
    ['subrace_fairy_female', 'slaver',],
    ['subrace_dragonkin_male', 'slaver',],
    ['subrace_dragonkin_female', 'slaver',],
    ['subrace_demonkin_male', 'slaver',],
    ['subrace_demonkin_female', 'slaver',],
  ]
  setup.DebugInit.createUnits(units)

  setup.DebugInit.initSlavesCommon()

  /* Special units */
  {
    const units = sv.company.player.getUnits({ job: setup.job.slaver }, 'name')
    const slaves = sv.company.player.getUnits({ job: setup.job.slave }, 'name')

    /* Traumatized slaver */
    console.log('traumatizing slavers')
    sv.trauma.traumatize(units[0], 10)
    sv.trauma.traumatize(units[0], 10)

    /* Boonize slaver */
    console.log('boonizing slavers')
    sv.trauma.boonize(units[1], 10)
    sv.trauma.boonize(units[1], 10)

    /* Best friends and arch rivals */
    console.log('friendship / rivalry slavers')
    sv.friendship.adjustFriendship(units[2], units[3], 1000)
    sv.friendship.adjustFriendship(units[4], units[5], -1000)

    sv.friendship.adjustFriendship(units[6], slaves[0], -1000)
    sv.friendship.adjustFriendship(units[7], slaves[1], 1000)

    /* Lovers stable and unstable */
    console.log('lovers')
    sv.friendship.adjustFriendship(units[8], units[9], 1000)
    sv.friendship.hookup(units[8], units[9])
    sv.friendship.hookup(units[10], units[11])

    /* Veteran slaver */
    units[12].weeks_with_you = 500

    // assign on duty
    console.log('duty unit')
    sv.dutylist.getDuty('doctor').assignUnit(units[8])

    const slave_entertain = setup.generateAnyUnit()
    sv.company.player.addUnit(slave_entertain, setup.job.slave)
    slave_entertain.addTrait(setup.trait.training_obedience_master, null, true)
    sv.dutylist.getDuty('entertainmentslave').assignUnit(slave_entertain)

    /* Injure slaver and slave */
    console.log('injuries')
    const injured_slaver = setup.generateAnyUnit()
    sv.company.player.addUnit(injured_slaver, setup.job.slaver)
    sv.hospital.injureUnit(injured_slaver, 3)

    const injured_slave = setup.generateAnyUnit()
    sv.company.player.addUnit(injured_slave, setup.job.slave)
    sv.hospital.injureUnit(injured_slave, 1)

    /* Missing units */
    /* Lovers with a missing unit */
    console.log('missing units')
    const missing_slaver = setup.generateAnyUnit()
    sv.company.player.addUnit(missing_slaver, setup.job.slaver)
    sv.friendship.adjustFriendship(missing_slaver, units[12], 1000)
    sv.friendship.hookup(missing_slaver, units[12])
    setup.qc.MissingUnit('unit').apply(setup.costUnitHelper(missing_slaver))

    const missing_slave = setup.generateAnyUnit()
    sv.company.player.addUnit(missing_slave, setup.job.slave)
    setup.qc.MissingUnit('unit').apply(setup.costUnitHelper(missing_slave))

    /* Retired slaver */
    console.log('retired slaver')
    units[13].weeks_with_you = setup.TRAIT_SENIOR_THRESHOLD + 3
    State.variables.retiredlist.retire(units[13])
  }

  /* Create market units */
  {
    console.log('market units')
    new setup.MarketObject(
      setup.generateAnyUnit(),
      0,  /* price */
      4,  /* expires in */
      State.variables.market.slavermarket,
      'debug',
    )
    new setup.MarketObject(
      setup.generateAnyUnit(),
      5000,  /* price */
      1,  /* expires in */
      State.variables.market.slavermarket,
      'debug',
    )
    new setup.MarketObject(
      setup.generateAnyUnit(),
      0,  /* price */
      1,  /* expires in */
      State.variables.market.slavemarket,
      'debug',
    )
    new setup.MarketObject(
      setup.generateAnyUnit(),
      5000,  /* price */
      4,  /* expires in */
      State.variables.market.slavemarket,
      'debug',
    )
  }

  /* Create market objects */
  {
    console.log('market objects')
    setup.qc.EquipmentForSale(
      setup.equipmentpool.all_combat,
      /* amount = */ 8,
    ).apply(setup.costUnitHelper(null, 'debug'))
    setup.qc.EquipmentForSale(
      setup.equipmentpool.all_sex,
      /* amount = */ 8,
    ).apply(setup.costUnitHelper(null, 'debug'))
    setup.qc.ItemForSale(
      'itemmarket',
      setup.itempool.all,
      /* amount = */ 8,
    ).apply(setup.costUnitHelper(null, 'debug'))
    setup.qc.ItemForSale(
      'itemmarket',
      setup.itempool.furniture_normal,
      /* amount = */ 8,
    ).apply(setup.costUnitHelper(null, 'debug'))
  }

  /* Quests */
  {
    console.log('quests')
    const templates = [
      setup.questtemplate.bounty_hunt_wolf,
      setup.questtemplate.healing_grove,
      setup.questtemplate.the_noble_games,
      setup.questtemplate.orcish_festival,
      setup.questtemplate.journey_to_atlantis,
      setup.questtemplate.trading_mission__southern_seas,
    ]
    for (const template of templates) {
      setup.qc.QuestDirect(template).apply()
    }
  }

  /* Mails */
  {
    console.log('mails')
    const templates = [
      setup.opportunitytemplate.capital_of_slaves,
      setup.opportunitytemplate.choose_your_own_adventure_,
    ]
    for (const template of templates) {
      setup.qc.Opportunity(template).apply()
    }
  }

  /* Equipment */
  {
    console.log('equipments')
    const eqlistslaver = [
      setup.equipment.combat_torso,
      setup.equipment.combat_legs_good,
      setup.equipment.combat_head,
      setup.equipment.brawn_neck,
      setup.equipment.brawn_rear_good,
      setup.equipment.brawn_arms,
      // setup.equipment.aid_nipple,   // caused too much sluttiness
      setup.equipment.brawn_mouth,
      setup.equipment.brawn_feet,
      setup.equipment.intrigue_eyes,
      setup.equipment.weapon_rapier,
    ]
    // unassign equipment set
    setup.DebugInit.getEquipmentSet(eqlistslaver)

    const eqs = setup.DebugInit.getEquipmentSet(eqlistslaver)
    const units = sv.company.player.getUnits({ job: setup.job.slaver }, 'name')
    eqs.equip(units[0])

    const eqlistslave = [
      setup.equipment.manacles_up,
      setup.equipment.manacles_down,
      setup.equipment.blindfold,
      setup.equipment.ballgag,
      setup.equipment.metal_collar,
      setup.equipment.tailplug_dog,
      setup.equipment.hood_dog,
      setup.equipment.harness_dog,
      setup.equipment.nipplechains,
      setup.equipment.sex_legs,
    ]

    const male = eqlistslave.concat([setup.equipment.chastity_dick])
    const eqslavemale = setup.DebugInit.getEquipmentSet(male)
    const maleslave = setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_male' })
    sv.company.player.addUnit(maleslave, setup.job.slave)
    eqslavemale.equip(maleslave)

    const female = eqlistslave.concat([setup.equipment.dildo])
    const eqslavefemale = setup.DebugInit.getEquipmentSet(female)
    const femaleslave = setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_female' })
    sv.company.player.addUnit(femaleslave, setup.job.slave)
    eqslavefemale.equip(femaleslave)
  }

  /* A bunch of equipments and items */
  {
    console.log('equipments initializations')
    //... just get all items.
    for (const item of Object.values(setup.item)) {
      setup.qc.Item(item).apply()
    }

    //... and all equipments.
    for (const equipment of Object.values(setup.equipment)) {
      if (!equipment.isBasic()) {
        setup.qc.EquipmentDirect(equipment).apply()
      }
    }
  }

  /* Bedchambers */
  {
    console.log('bedchambers')
    const units = sv.company.player.getUnits({ job: setup.job.slaver }, 'name')
    sv.bedchamberlist.newBedchamber()

    const [bc1, bc2] = sv.bedchamberlist.getBedchambers()
    bc2.setSlaver(units[0])

    for (const bc of [bc1, bc2]) {
      const maleslave = setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_male' })
      sv.company.player.addUnit(maleslave, setup.job.slave)
      bc.getDuties()[0].assignUnit(maleslave)

      const femaleslave = setup.unitgroup.all.getUnit({ retries: 20, trait_key: 'gender_female' })
      sv.company.player.addUnit(femaleslave, setup.job.slave)
      bc.getDuties()[1].assignUnit(femaleslave)

      let totrain = maleslave
      if (bc == bc2) totrain = femaleslave

      totrain.addTrait(setup.trait.training_obedience_advanced, null, true)
      if (bc == bc1) sv.friendship.adjustFriendship(totrain, bc.getSlaver(), 1000)
      if (bc == bc1) State.variables.family.setTwin(maleslave, femaleslave)
      if (bc == bc1) State.variables.family.setSibling(bc.getSlaver(), femaleslave)
    }

    // Decorate bedchamber
    const decorations = [
      setup.item.f_slaverbed_good,
      setup.item.f_slavebed_good,
      setup.item.f_foodtray_good,
      setup.item.f_drinktray_good,
      setup.item.f_reward_good,
      setup.item.f_punishment_good,
      setup.item.f_lighting_good,
      setup.item.f_tile_good,
      setup.item.f_object_good,
      setup.item.f_wall_good,
    ]
    for (const decoration of decorations) {
      // @ts-ignore
      bc1.setFurniture(decoration.getSlot(), decoration)
    }
  }

  /* slave orders */
  {
    console.log('slave orders')
    setup.qc.SlaveOrderCapitalOfSlaves().apply()
  }

  /* Favor, ire */
  {
    console.log('favor / ire')
    setup.qc.Favor('neko', 600).apply()
    setup.qc.Ire('bank', 10).apply()
  }

  /* Level up units */
  console.log('level up units')
  setup.DebugInit.levelUp()

  console.log('pop all')
  sv.notification.popAll()

  console.log('end of debug init')

  /* Check if any quest is missing location tag */
  {
    const to_checks = [setup.questtemplate, setup.opportunitytemplate]
    const locations = ['vale', 'forest', 'city', 'deep', 'desert', 'sea', 'fort']
    for (const to_check of to_checks) {
      for (const obj of Object.values(to_check)) {
        if (!obj.getTags().filter(tag => locations.includes(tag)).length) {
          console.log(`${obj.key} is missing a location tag.`)
        }
      }
    }
  }
}
