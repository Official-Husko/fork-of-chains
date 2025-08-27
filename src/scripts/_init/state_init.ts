import type { SugarCubeStoryVariables } from "twine-sugarcube";
import type { ActivityInstance } from "../classes/activity/ActivityInstance";
import { ActivityList } from "../classes/activity/ActivityList";
import type { Bedchamber } from "../classes/bedchamber/BedChamber";
import { BedchamberList } from "../classes/bedchamber/BedChamberList";
import { Bodyshift } from "../classes/Bodyshift";
import type { BuildingInstance } from "../classes/BuildingInstance";
import { Cache } from "../classes/cache";
import { Calendar } from "../classes/Calendar";
import { Company } from "../classes/Company";
import type { CompanyTemplate } from "../classes/CompanyTemplate";
import type { Contact } from "../classes/contact/Contact";
import { ContactList } from "../classes/contact/ContactList";
import { ContentImage } from "../classes/content/ContentImage";
import type { Deck } from "../classes/deck/Deck";
import type { DutyInstance } from "../classes/duty/DutyInstance";
import { DutyList } from "../classes/duty/DutyList";
import { Armory } from "../classes/equipment/Armory";
import type { EquipmentSet } from "../classes/equipment/EquipmentSet";
import { EventPool } from "../classes/event/EventPool";
import { Family } from "../classes/family/Family";
import { Favor } from "../classes/Favor";
import { MenuFilter } from "../classes/filter/_filter";
import { Fort } from "../classes/Fort";
import { Friendship } from "../classes/Friendship";
import { Hospital } from "../classes/Hospital";
import { Inventory } from "../classes/inventory/Inventory";
import { Ire } from "../classes/Ire";
import { Leave } from "../classes/Leave";
import { MarketEquipment } from "../classes/market/subtypes/MarketEquipment";
import { MarketItem } from "../classes/market/subtypes/MarketItem";
import { MarketUnit } from "../classes/market/subtypes/MarketUnit";
import { Notification } from "../classes/Notification";
import type { OpportunityInstance } from "../classes/opportunity/OpportunityInstance";
import { OpportunityList } from "../classes/opportunity/OpportunityList";
import type { Party } from "../classes/party/Party";
import { PartyList } from "../classes/party/PartyList";
import { QuestGen } from "../classes/quest/QuestGen";
import type { QuestInstance } from "../classes/quest/QuestInstance";
import { RetiredList } from "../classes/retire/RetiredList";
import { FortGrid } from "../classes/room/FortGrid";
import type { RoomInstance } from "../classes/room/RoomInstance";
import { RoomList } from "../classes/room/RoomList";
import { Settings } from "../classes/Settings";
import * as SexActionClass from "../classes/sex/action/_index";
import { sexSanityChecks } from "../classes/sex/sexaction_sanity_check";
import { SkillBoost } from "../classes/SkillBoost";
import type { SlaveOrder } from "../classes/slaveorder/SlaveOrder";
import { SlaveOrderList } from "../classes/slaveorder/SlaveOrderList";
import { Statistics } from "../classes/Statistics";
import type { Team } from "../classes/Team";
import { TitleList } from "../classes/title/TitleList";
import { Trauma } from "../classes/Trauma";
import type { Unit } from "../classes/unit/Unit";
import type { UnitGroupKey } from "../classes/unit/UnitGroup";
import { UnitImage } from "../classes/unit/UnitImage";
import { VarStore } from "../classes/VarStore";

// Types declared by State.variables "constructor"
export type StateVariablesBase = ReturnType<typeof createEmptyState>;

function createEmptyState() {
  return {
    gInitDone: false,

    // Init singleton classes
    varstore: new VarStore(),
    statistics: new Statistics(),
    settings: new Settings(),
    notification: new Notification(),
    calendar: new Calendar(),
    inventory: new Inventory(),
    hospital: new Hospital(),
    friendship: new Friendship(),
    family: new Family(),
    trauma: new Trauma(),
    favor: new Favor(),
    ire: new Ire(),
    menufilter: new MenuFilter(),
    retiredlist: new RetiredList(),
    skillboost: new SkillBoost(),
    titlelist: new TitleList(),
    roomlist: new RoomList(),
    fortgrid: new FortGrid(),

    // Init Companies
    company: {} as Registry<Company>,

    // Init Teams
    team: {} as Registry<Team>,
    Team_keygen: 1,

    // Init Party
    party: {} as Registry<Party>,
    Party_keygen: 1,

    partylist: new PartyList(),

    // Init Units
    unit: {} as Registry<Unit> & { player: Unit },
    Unit_keygen: 1,
    unitimage: new UnitImage(),

    // Init Unit Groups
    unitgroup_unit_keys: (() => {
      const unitgroup_unit_keys = {} as Record<UnitGroupKey, UnitKey[]>;

      // Initialize 'unitgroup_unit_keys' to empty arrays
      for (const unitgroup of Object.values(setup.unitgroup)) {
        if (unitgroup && "resetUnitGroupUnitKeys" in unitgroup)
          unitgroup.resetUnitGroupUnitKeys(unitgroup_unit_keys);
      }

      return unitgroup_unit_keys;
    })(),

    // Init Equipment Set
    equipmentset: {} as Registry<EquipmentSet>,
    EquipmentSet_keygen: 1,

    // Init Armory
    armory: new Armory(),

    // Init Markets
    market: {} as ReturnType<typeof createMarkets>,

    // Init contacts
    contact: {} as Registry<Contact>,
    Contact_keygen: 1,
    contactlist: new ContactList(),

    // Init duties
    duty: {} as Registry<DutyInstance>,
    Duty_keygen: 1,
    dutylist: new DutyList(),

    // Init building instances
    buildinginstance: {} as Registry<BuildingInstance>,
    BuildingInstance_keygen: 1,

    // Init RoomInstance
    roominstance: {} as Registry<RoomInstance>,
    RoomInstance_keygen: 1,

    // Init slave orders
    slaveorder: {} as Registry<SlaveOrder>,
    SlaveOrder_keygen: 1,
    slaveorderlist: new SlaveOrderList(),

    // Init opportunities
    opportunityinstance: {} as Registry<OpportunityInstance>,
    OpportunityInstance_keygen: 1,
    opportunitylist: new OpportunityList(),

    // Init Fort
    fort: {} as Registry<Fort>,

    // Init QuestGen and instances
    questinstance: {} as Registry<QuestInstance>,
    QuestInstance_keygen: 1,
    questgen: new QuestGen(),

    // Init events
    eventpool: new EventPool(),

    // Init activities
    activityinstance: {} as Registry<ActivityInstance>,
    ActivityInstance_keygen: 1,
    activitylist: new ActivityList(),

    // Init bedchamges
    bedchamber: {} as Registry<Bedchamber>,
    Bedchamber_keygen: 1,
    bedchamberlist: new BedchamberList(),

    // Init interactions
    interaction_cooldowns: {} as Record<string, Record<string, number>>,

    // Init leave
    leave: new Leave(),

    // Init bodyshift
    bodyshift: new Bodyshift(),

    deck: {} as Record<string, Deck>,

    // Init cache
    cache: new Cache(),
  };
}

export type MarketKey_ = keyof ReturnType<typeof createMarkets>;

export function createMarkets() {
  return {
    slavermarket: new MarketUnit(
      "slavermarket",
      "New Slavers Candidates",
      "unit",
      "slaver",
    ),
    slavemarket: new MarketUnit(
      "slavemarket",
      "Temporary Slave Pens",
      "unit",
      "slave",
    ),
    initslavermarket: new MarketUnit(
      "initslavermarket",
      "Initial Slavers",
      "unit",
      "slaver",
    ),

    equipmentmarket: new MarketEquipment("equipmentmarket", "Buy Equipment"),
    itemmarket: new MarketItem("itemmarket", "Market"),
  };
}

/**
 * Initializes the State.variables
 * Will be called with "this" set to State.variables
 */
export function initState(this: SugarCubeStoryVariables): void {
  if (this.gInitDone) {
    // already initialized
    // (if in vite devmode, just ignore this error)
    if (!import.meta.env.DEV) {
      throw Error("State already initialized");
    }
    return;
  }
  Notification.disable();

  //
  // Create a blank state
  //
  Object.assign(this, createEmptyState());

  //
  // Init default entities
  //

  // Init companies
  {
    for (const _companytemplate of Object.values(setup.companytemplate)) {
      const companytemplate = _companytemplate as CompanyTemplate;
      this.company[companytemplate.key] = new Company(
        companytemplate.key,
        companytemplate,
      );
    }

    // special case for player company name
    // FIXME
    this.company.player.name = this.company.player.getName();
  }

  // Init player fort
  this.fort.player = new Fort("player", "Player's Fort", 4);

  // Init markets
  createMarkets();

  // Init default equipment set
  this.armory.newEquipmentSet();

  // Initialize fort grid
  this.fortgrid.initialize();
  {
    // initialize fort grid buildings and rooms
    const room = this.fort.player.build(setup.buildingtemplate.questoffice)!;
    room.rotate90anticlockwise();
    this.fortgrid.relocateRoom(room, {
      row: -3,
      col: this.fortgrid.getWidth() / 2 - 6,
    });
  }

  Notification.enable();
  this.gInitDone = true; // mark as initialized
}

export function initEstablishBase() {
  const grid = State.variables.fortgrid;
  // build construction office
  {
    if (
      State.variables.gDebug &&
      State.variables.fort.player.isHasBuilding(
        setup.buildingtemplate.constructionoffice,
      )
    ) {
      // this can happen during testing phase.
    } else {
      const room = State.variables.fort.player.build(
        setup.buildingtemplate.constructionoffice,
      )!;
      room.rotate90anticlockwise();
      grid.relocateRoom(room, { row: 1, col: 0 });
    }
  }

  // build lodgings
  {
    if (
      State.variables.gDebug &&
      State.variables.fort.player.isHasBuilding(setup.buildingtemplate.lodgings)
    ) {
      // this can happen during testing phase.
    } else {
      const room = State.variables.fort.player.build(
        setup.buildingtemplate.lodgings,
      )!;
      room.rotate180();
      grid.relocateRoom(room, {
        row: -2,
        col: State.variables.fortgrid.getWidth() / 2 + 2,
      });

      // upgrade it twice
      const building = State.variables.fort.player.getBuilding(
        setup.buildingtemplate.lodgings,
      )!;
      const room_upgr1 = building.upgrade()!;
      grid.relocateRoom(room_upgr1, {
        row: -3,
        col: grid.getWidth() / 2 - 9,
      });
      const room_upgr2 = building.upgrade()!;
      room_upgr2.rotate180();
      grid.relocateRoom(room_upgr2, {
        row: -2,
        col: State.variables.fortgrid.getWidth() / 2 + 8,
      });
    }
  }
}

/**
 * Initializes some part of this.setup
 * Will be called with "this" set to setup
 */
export function initSetup(this: typeof setup) {
  // Init content images
  {
    ContentImage.initalize();
  }

  // Init Sex Action protos and sanity check
  {
    sexSanityChecks();

    let i = 0;
    for (const sexactionclass of Object.values(SexActionClass)) {
      const proto_object = Object.create(sexactionclass.prototype);
      i += 1;
      proto_object.key = i;
      (this.sexaction as SexAction[]).push(proto_object);
    }
  }
}
