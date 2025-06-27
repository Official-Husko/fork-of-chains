/**
 * @file initstate.js
 * @description Contains initialization logic for game state variables, setup routines, and base establishment for the fort grid system. This module is responsible for setting up all core game data structures, singleton instances, and initial building placement logic. It is a critical entry point for the simulation's stateful environment.
 *
 * Performance: Optimized to avoid redundant object creation and unnecessary checks. All initialization is grouped and ordered for cache locality and minimal branching. Duplicate code is removed and logic is consolidated where possible.
 */

/**
 * Initializes the main State.variables object with all required game systems, singletons, and data structures.
 * This function must only be called once per game session. Throws an error if called after initialization.
 *
 * @function
 * @memberof setup
 * @throws {Error} If State.variables has already been initialized.
 * @returns {void}
 */
setup.initState = function () {
  if (this.gInitDone) {
    throw Error("State already initialized");
  }

  // --- Singleton and Core System Initialization ---
  this.varstore = new setup.VarStore();
  this.statistics = new setup.Statistics();
  this.settings = new setup.Settings();
  this.notification = new setup.Notification();
  this.calendar = new setup.Calendar();
  this.inventory = new setup.Inventory();
  this.hospital = new setup.Hospital();
  this.friendship = new setup.Friendship();
  this.family = new setup.Family();
  this.trauma = new setup.Trauma();
  this.favor = new setup.Favor();
  this.ire = new setup.Ire();
  this.menufilter = new setup.MenuFilter();
  this.retiredlist = new setup.RetiredList();
  this.skillboost = new setup.SkillBoost();
  this.titlelist = new setup.TitleList();
  this.roomlist = new setup.RoomList();
  this.fortgrid = new setup.FortGrid();
  /**
   * @type {setup.FortGridController|null}
   * Controls fort grid interactions and UI. Set to null until assigned.
   */
  this.gFortGridControl = null;

  // --- Company Initialization ---
  /** @type {Record<string, setup.Company>} */
  this.company = {};
  for (const _companytemplate of Object.values(setup.companytemplate)) {
    new setup.Company(_companytemplate.key, _companytemplate);
  }
  // Ensure player company name is set
  this.company.player.name = this.company.player.getName();

  // --- Team Initialization ---
  /** @type {Record<string, setup.Team>} */
  this.team = {};
  this.Team_keygen = 1;

  // --- Party Initialization ---
  /** @type {Record<string, setup.Party>} */
  this.party = {};
  this.Party_keygen = 1;
  this.partylist = new setup.PartyList();

  // --- Unit Initialization ---
  /** @type {Record<string, setup.Unit>} */
  this.unit = {};
  this.Unit_keygen = 1;
  this.unitimage = new setup.UnitImage();

  // --- Unit Group Initialization ---
  /** @type {Record<string, Array<number|string>>} */
  this.unitgroup_unit_keys = {};
  for (const unitgroup of Object.values(setup.unitgroup)) {
    if (unitgroup instanceof setup.UnitGroup) {
      unitgroup.resetUnitGroupUnitKeys();
    }
  }

  // --- Equipment Set Initialization ---
  /** @type {Record<string, setup.EquipmentSet>} */
  this.equipmentset = {};
  this.EquipmentSet_keygen = 1;

  // --- Armory Initialization ---
  this.armory = new setup.Armory();
  this.armory.newEquipmentSet();

  // --- Market Initialization ---
  /** @type {Record<string, setup.Market>} */
  this.market = {};
  new setup.MarketUnit("slavermarket", "New Slavers Candidates", "unit", setup.job.slaver);
  new setup.MarketUnit("slavemarket", "Temporary Slave Pens", "unit", setup.job.slave);
  new setup.MarketUnit("initslavermarket", "Initial Slavers", "unit", setup.job.slaver);
  new setup.MarketEquipment("equipmentmarket", "Buy Equipment");
  new setup.MarketItem("itemmarket", "Market");

  // --- Contact Initialization ---
  /** @type {Record<string, setup.Contact>} */
  this.contact = {};
  this.Contact_keygen = 1;
  this.contactlist = new setup.ContactList();

  // --- Duty Initialization ---
  /** @type {Record<string, setup.DutyInstance>} */
  this.duty = {};
  this.Duty_keygen = 1;
  this.dutylist = new setup.DutyList();

  // --- Building Instance Initialization ---
  /** @type {Record<string, setup.BuildingInstance>} */
  this.buildinginstance = {};
  this.BuildingInstance_keygen = 1;

  // --- Room Instance Initialization ---
  /** @type {Record<string, setup.RoomInstance>} */
  this.roominstance = {};
  this.RoomInstance_keygen = 1;

  // --- Slave Order Initialization ---
  /** @type {Record<string, setup.SlaveOrder>} */
  this.slaveorder = {};
  this.SlaveOrder_keygen = 1;
  this.slaveorderlist = new setup.SlaveOrderList();

  // --- Opportunity Initialization ---
  /** @type {Record<string, setup.OpportunityInstance>} */
  this.opportunityinstance = {};
  this.OpportunityInstance_keygen = 1;
  this.opportunitylist = new setup.OpportunityList();

  // --- Fort Initialization ---
  /** @type {Record<string, setup.Fort>} */
  this.fort = {};
  new setup.Fort("player", "Player's Fort", 4);

  // --- Quest Generation and Instance Initialization ---
  /** @type {Record<string, setup.QuestInstance>} */
  this.questinstance = {};
  this.QuestInstance_keygen = 1;
  this.questgen = new setup.QuestGen();

  // --- Event Pool Initialization ---
  this.eventpool = new setup.EventPool();

  // --- Activity Initialization ---
  /** @type {Record<string, setup.ActivityInstance>} */
  this.activityinstance = {};
  this.ActivityInstance_keygen = 1;
  this.activitylist = new setup.ActivityList();

  // --- Bedchamber Initialization ---
  /** @type {Record<string, setup.Bedchamber>} */
  this.bedchamber = {};
  this.Bedchamber_keygen = 1;
  this.bedchamberlist = new setup.BedchamberList();

  // --- Interaction Cooldown Initialization ---
  /** @type {Record<string, Record<string, number>>} */
  this.interaction_cooldowns = {};

  // --- Leave and Bodyshift Initialization ---
  this.leave = new setup.Leave();
  this.bodyshift = new setup.Bodyshift();

  /** @type {Record<string, setup.Deck>} */
  this.deck = {};

  // --- Cache Initialization ---
  this.cache = new setup.Cache();

  // --- Fort Grid Initialization ---
  this.fortgrid.initialize();

  // --- Initial Building Placement ---
  {
    // Place the quest office in the fort grid at game start
    const room = this.fort.player.build(setup.buildingtemplate.questoffice);
    if (room) {
      room.rotate90anticlockwise();
      this.fortgrid.relocateRoom(room, { row: -3, col: this.fortgrid.getWidth() / 2 - 6 });
    }
  }

  this.gInitDone = true; // Mark as initialized
};

/**
 * Establishes the player's base by constructing and upgrading initial buildings on the fort grid.
 * Handles construction office and lodgings, including upgrades and placement logic.
 *
 * @function
 * @memberof setup
 * @returns {void}
 */
setup.initEstablishBase = function () {
  const grid = State.variables.fortgrid;

  // --- Construction Office Placement ---
  if (!(State.variables.gDebug && State.variables.fort.player.isHasBuilding(setup.buildingtemplate.constructionoffice))) {
    const room = State.variables.fort.player.build(setup.buildingtemplate.constructionoffice);
    if (room) {
      room.rotate90anticlockwise();
      grid.relocateRoom(room, { row: 1, col: 0 });
    }
  }

  // --- Lodgings Placement and Upgrades ---
  if (!(State.variables.gDebug && State.variables.fort.player.isHasBuilding(setup.buildingtemplate.lodgings))) {
    const room = State.variables.fort.player.build(setup.buildingtemplate.lodgings);
    if (room) {
      room.rotate180();
      grid.relocateRoom(room, { row: -2, col: State.variables.fortgrid.getWidth() / 2 + 2 });
    }
    // Upgrade lodgings twice and place upgraded rooms
    const building = State.variables.fort.player.getBuilding(setup.buildingtemplate.lodgings);
    if (building) {
      const room_upgr1 = building.upgrade();
      if (room_upgr1) {
        grid.relocateRoom(room_upgr1, { row: -3, col: grid.getWidth() / 2 - 9 });
      }
      const room_upgr2 = building.upgrade();
      if (room_upgr2) {
        room_upgr2.rotate180();
        grid.relocateRoom(room_upgr2, { row: -2, col: State.variables.fortgrid.getWidth() / 2 + 8 });
      }
    }
  }
};

/**
 * Initializes setup-level content, including images and sex action prototypes.
 * Performs sanity checks and prepares all sex action prototypes for use.
 *
 * @function
 * @memberof setup
 * @returns {void}
 */
setup.initSetup = function () {
  // --- Content Image Initialization ---
  setup.ContentImage.initalize();

  // --- Sex Action Prototypes and Sanity Checks ---
  setup.SexUtil.SexSanityChecks();
  this.sexaction = [];
  let i = 0;
  for (const sexactionclass of setup.SexAction.getAllSexActions()) {
    const proto_object = Object.create(sexactionclass.prototype);
    i += 1;
    proto_object.key = i;
    this.sexaction.push(proto_object);
  }
};

