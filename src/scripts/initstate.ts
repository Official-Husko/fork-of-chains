// @ts-nocheck

/**
 * Initializes the State.variables
 * Will be called with "this" set to State.variables
 */
setup.initState = function () {
  if (this.gInitDone) // already initialized
    throw Error('State already initialized')

  // Init singleton classes
  this.varstore = new setup.VarStore()
  this.statistics = new setup.Statistics()
  this.settings = new setup.Settings()
  this.notification = new setup.Notification()
  this.calendar = new setup.Calendar()
  this.inventory = new setup.Inventory()
  this.hospital = new setup.Hospital()
  this.friendship = new setup.Friendship()
  this.family = new setup.Family()
  this.trauma = new setup.Trauma()
  this.favor = new setup.Favor()
  this.ire = new setup.Ire()
  this.menufilter = new setup.MenuFilter()
  this.retiredlist = new setup.RetiredList()
  this.skillboost = new setup.SkillBoost()
  this.titlelist = new setup.TitleList()
  this.roomlist = new setup.RoomList()
  this.fortgrid = new setup.FortGrid()

  /**
   * @type {setup.FortGridController}
   */
  this.gFortGridControl = null

  // Init Companies
  {
    /** @type {Record<string, setup.Company>} */
    this.company = {}
    for (const _companytemplate of Object.values(setup.companytemplate))
      new setup.Company(_companytemplate.key, _companytemplate)

    // special case for player company name
    this.company.player.name = this.company.player.getName()
  }


  // Init Teams
  {
    /** @type {Record<string, setup.Team>} */
    this.team = {}
    this.Team_keygen = 1
  }


  // Init Party
  {
    /** @type {Record<string, setup.Party>} */
    this.party = {}
    this.Party_keygen = 1

    this.partylist = new setup.PartyList()
  }


  // Init Units
  {
    /** @type {Record<string, setup.Unit>} */
    this.unit = {}
    this.Unit_keygen = 1
    this.unitimage = new setup.UnitImage()
  }

  // Init Unit Groups
  {
    /** @type {Record<string, Array<number|string>>} */
    this.unitgroup_unit_keys = {}

    // Initialize 'unitgroup_unit_keys' to empty arrays
    for (const unitgroup of Object.values(setup.unitgroup)) {
      if (unitgroup instanceof setup.UnitGroup)
        unitgroup.resetUnitGroupUnitKeys()
    }
  }

  // Init Equipment Set
  {
    /** @type {Record<string, setup.EquipmentSet>} */
    this.equipmentset = {}
    this.EquipmentSet_keygen = 1
  }

  // Init Armory
  {
    this.armory = new setup.Armory()
    this.armory.newEquipmentSet()
  }

  // Init Markets
  {
    /** @type {Record<string, setup.Market>} */
    this.market = {}

    new setup.MarketUnit('slavermarket', 'New Slavers Candidates', 'unit', setup.job.slaver)
    new setup.MarketUnit('slavemarket', 'Temporary Slave Pens', 'unit', setup.job.slave)
    new setup.MarketUnit('initslavermarket', 'Initial Slavers', 'unit', setup.job.slaver)

    new setup.MarketEquipment('equipmentmarket', 'Buy Equipment')
    new setup.MarketItem('itemmarket', 'Market')
  }

  // Init contacts
  {
    /** @type {Record<string, setup.Contact>} */
    this.contact = {}
    this.Contact_keygen = 1
    this.contactlist = new setup.ContactList()
  }

  // Init duties
  {
    /** @type {Record<string, setup.DutyInstance>} */
    this.duty = {}
    this.Duty_keygen = 1
    this.dutylist = new setup.DutyList()
  }

  // Init building instances
  {
    /** @type {Record<string, setup.BuildingInstance>} */
    this.buildinginstance = {}
    this.BuildingInstance_keygen = 1
  }

  // Init RoomInstance
  {
    /** @type {Record<string, setup.RoomInstance>} */
    this.roominstance = {}
    this.RoomInstance_keygen = 1
  }

  // Init slave orders
  {
    /** @type {Record<string, setup.SlaveOrder>} */
    this.slaveorder = {}
    this.SlaveOrder_keygen = 1
    this.slaveorderlist = new setup.SlaveOrderList()
  }

  // Init opportunities
  {
    /** @type {Record<string, setup.OpportunityInstance>} */
    this.opportunityinstance = {}
    this.OpportunityInstance_keygen = 1
    this.opportunitylist = new setup.OpportunityList()
  }


  // Init Fort
  {
    /** @type {Record<string, setup.Fort>} */
    this.fort = {}
    new setup.Fort('player', "Player's Fort", 4)
  }

  // Init QuestGen and instances
  {
    /** @type {Record<string, setup.QuestInstance>} */
    this.questinstance = {}
    this.QuestInstance_keygen = 1
    this.questgen = new setup.QuestGen()
  }

  // Init events
  this.eventpool = new setup.EventPool()

  // Init activities
  {
    /** @type {Record<string, setup.ActivityInstance>} */
    this.activityinstance = {}
    this.ActivityInstance_keygen = 1
    this.activitylist = new setup.ActivityList()
  }

  // Init bedchamges
  {
    /** @type {Record<string, setup.Bedchamber>} */
    this.bedchamber = {}
    this.Bedchamber_keygen = 1
    this.bedchamberlist = new setup.BedchamberList()
  }

  // Init interactions
  {
    /** @type {Record<string, Record<string, number>>} */
    this.interaction_cooldowns = {}
  }

  // Init leave
  this.leave = new setup.Leave()

  // Init bodyshift
  this.bodyshift = new setup.Bodyshift()

  /** @type {Record<string, setup.Deck>} */
  this.deck = {}

  // Init cache
  this.cache = new setup.Cache()

  // Initialize fort grid
  this.fortgrid.initialize()

  {
    // initialize buildings and rooms
    const room = this.fort.player.build(setup.buildingtemplate.questoffice)
    room.rotate90anticlockwise()
    this.fortgrid.relocateRoom(room, { row: -3, col: this.fortgrid.getWidth() / 2 - 6 })
  }

  this.gInitDone = true // mark as initialized
}


setup.initEstablishBase = function () {
  const grid = State.variables.fortgrid
  // build construction office
  {
    if (State.variables.gDebug && State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate.constructionoffice)) {
      // this can happen during testing phase.
    } else {
      const room = State.variables.fort.player.build(setup.buildingtemplate.constructionoffice)
      room.rotate90anticlockwise()
      grid.relocateRoom(room, { row: 1, col: 0 })
    }
  }

  // build lodgings
  {
    if (State.variables.gDebug && State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate.lodgings)) {
      // this can happen during testing phase.
    } else {
      const room = State.variables.fort.player.build(setup.buildingtemplate.lodgings)
      room.rotate180()
      grid.relocateRoom(room,
        { row: -2, col: State.variables.fortgrid.getWidth() / 2 + 2 })

      // upgrade it twice
      const building = State.variables.fort.player.getBuilding(setup.buildingtemplate.lodgings)
      const room_upgr1 = building.upgrade()
      grid.relocateRoom(room_upgr1,
        {
          row: -3, col: grid.getWidth() / 2 - 9
        })
      const room_upgr2 = building.upgrade()
      room_upgr2.rotate180()
      grid.relocateRoom(room_upgr2,
        {
          row: -2, col: State.variables.fortgrid.getWidth() / 2 + 8
        }
      )
    }
  }
}


/**
 * Initializes some part of this.setup
 * Will be called with "this" set to setup
 */
setup.initSetup = function () {
  // Init content images
  {
    setup.ContentImage.initalize()
  }

  // Init Sex Action protos and sanity check
  {
    setup.SexUtil.SexSanityChecks()
    this.sexaction = []
    let i = 0
    for (const sexactionclass of setup.SexAction.getAllSexActions()) {
      const proto_object = Object.create(sexactionclass.prototype)
      i += 1
      proto_object.key = i
      this.sexaction.push(proto_object)
    }
  }
}

