import { TwineClass } from "../classes/_TwineClass.js";
import { ActivityInstance } from "../classes/activity/ActivityInstance.js";
import { ActivityList } from "../classes/activity/ActivityList.js";
import { ActivityTemplate } from "../classes/activity/ActivityTemplate.js";
import { DialogueHelper } from "../classes/activity/DialogueHelper.js";
import { ActivityTemplateInitFuck } from "../classes/activity/init.js";
import { BanterHelper } from "../classes/banter/BanterHelper.js";
import { BanterInstance } from "../classes/banter/BanterInstance.js";
import {
  Bedchamber,
  BEDCHAMBER_OPTION_CHANCES,
  BEDCHAMBER_OPTIONS,
} from "../classes/bedchamber/BedChamber.js";
import { BedchamberList } from "../classes/bedchamber/BedChamberList.js";
import { Bodyshift } from "../classes/Bodyshift.js";
import { BuildingInstance } from "../classes/BuildingInstance.js";
import { BuildingTemplate } from "../classes/BuildingTemplate.js";
import { Cache } from "../classes/cache.js";
import { Calendar } from "../classes/Calendar.js";
import { Company } from "../classes/Company.js";
import { CompanyTemplate } from "../classes/CompanyTemplate.js";
import { Contact } from "../classes/contact/Contact.js";
import { ContactList } from "../classes/contact/ContactList.js";
import { ContactTemplate } from "../classes/contact/ContactTemplate.js";
import { ContentImage } from "../classes/content/ContentImage.js";
import { Cost, SexCost } from "../classes/cost/_Cost.js";
import { qcImpl } from "../classes/cost/_index.js";
import { SlaveOrderAddon } from "../classes/cost/slaveorder/addon/_index.js";
import { SlaveOrderAddonBase } from "../classes/cost/slaveorder/addon/_SlaveOrderAddonBase.js";
import { CriteriaHelper } from "../classes/criteria/CriteriaHelper.js";
import { QuestUnitCriteriaRapeFetishist } from "../classes/criteria/special/QuestUnitCriteriaRapeFetishist.js";
import {
  UnitCriteria,
  type UnitCriteriaKey,
} from "../classes/criteria/UnitCriteria.js";
import { Deck } from "../classes/deck/Deck.js";
import { rarity, Rarity } from "../classes/deck/Rarity.js";
import { DutyInstance } from "../classes/duty/DutyInstance.js";
import { DutyList } from "../classes/duty/DutyList.js";
import { DutyTemplate } from "../classes/duty/DutyTemplate.js";
import * as DUTY_TEMPLATE_SUBCLASSES from "../classes/duty/subtypes/_index.js";
import { DutyInstanceBedchamberSlave } from "../classes/duty/subtypes/BedchamberSlave.js";
import { DutyInstancePrestigeSlave } from "../classes/duty/subtypes/PrestigeSlave.js";
import { Armory } from "../classes/equipment/Armory.js";
import { Equipment } from "../classes/equipment/Equipment.js";
import { EquipmentPool } from "../classes/equipment/EquipmentPool.js";
import { EquipmentPoolGroup } from "../classes/equipment/EquipmentPoolGroup.js";
import { EquipmentSet } from "../classes/equipment/EquipmentSet.js";
import { EquipmentSlot } from "../classes/equipment/EquipmentSlot.js";
import { EventInstance } from "../classes/event/EventInstance.js";
import { EventPool } from "../classes/event/EventPool.js";
import { EventTemplate } from "../classes/event/EventTemplate.js";
import { Family } from "../classes/family/Family.js";
import { FamilyRelation } from "../classes/family/FamilyRelation.js";
import { Favor } from "../classes/Favor.js";
import { MenuFilter } from "../classes/filter/_filter.js";
import { FilterHelper } from "../classes/filter/filterhelper.js";
import { Fort } from "../classes/Fort.js";
import { Friendship, FriendshipConstants } from "../classes/Friendship.js";
import { Furniture } from "../classes/furniture/Furniture.js";
import { FurnitureSlot } from "../classes/furniture/FurnitureSlot.js";
import { Hospital } from "../classes/Hospital.js";
import { InteractionInstance } from "../classes/interaction/InteractionInstance.js";
import { InteractionPool } from "../classes/interaction/InteractionPool.js";
import { InteractionTemplate } from "../classes/interaction/InteractionTemplate.js";
import { Inventory } from "../classes/inventory/Inventory.js";
import { Item } from "../classes/inventory/Item.js";
import { ItemClass } from "../classes/inventory/ItemClass.js";
import { ItemPool } from "../classes/inventory/ItemPool.js";
import { ItemLorebook } from "../classes/inventory/subtypes/ItemLorebook.js";
import { ItemNotUsable } from "../classes/inventory/subtypes/ItemNotUsable.js";
import { ItemQuest } from "../classes/inventory/subtypes/ItemQuest.js";
import { ItemSexManual } from "../classes/inventory/subtypes/ItemSexManual.js";
import { ItemTechnology } from "../classes/inventory/subtypes/ItemTechnology.js";
import { ItemUnitUsable } from "../classes/inventory/subtypes/ItemUnitUsable.js";
import { ItemUsable } from "../classes/inventory/subtypes/ItemUsable.js";
import { Ire } from "../classes/Ire.js";
import { Job } from "../classes/job/Job.js";
import { Leave } from "../classes/Leave.js";
import { Lore } from "../classes/Lore.js";
import { Market } from "../classes/market/Market.js";
import { MarketObject } from "../classes/market/MarketObject.js";
import { MarketEquipment } from "../classes/market/subtypes/MarketEquipment.js";
import { MarketItem } from "../classes/market/subtypes/MarketItem.js";
import { MarketUnit } from "../classes/market/subtypes/MarketUnit.js";
import { Notification, notify, queueDelete } from "../classes/Notification.js";
import { OpportunityInstance } from "../classes/opportunity/OpportunityInstance.js";
import { OpportunityList } from "../classes/opportunity/OpportunityList.js";
import { OpportunityTemplate } from "../classes/opportunity/OpportunityTemplate.js";
import { Party } from "../classes/party/Party.js";
import { PartyList } from "../classes/party/PartyList.js";
import { QuestDifficulty } from "../classes/quest/QuestDifficulty.js";
import { QuestGen } from "../classes/quest/QuestGen.js";
import { QuestInstance } from "../classes/quest/QuestInstance.js";
import { QuestInstanceUnitAction } from "../classes/quest/QuestInstanceUnitAction.js";
import { QuestInstanceUnitActionRepeatSelf } from "../classes/quest/QuestInstanceUnitActionRepeatSelf.js";
import { QuestPool } from "../classes/quest/QuestPool.js";
import {
  QUEST_OUTCOMES,
  QuestTemplate,
} from "../classes/quest/QuestTemplate.js";
import { qresImpl } from "../classes/restriction/_index.js";
import {
  Restriction,
  SexRestriction,
} from "../classes/restriction/_Restriction.js";
import { Living } from "../classes/retire/Living.js";
import { RetiredList } from "../classes/retire/RetiredList.js";
import { FortGrid } from "../classes/room/FortGrid.js";
import { RoomInstance } from "../classes/room/RoomInstance.js";
import { RoomList } from "../classes/room/RoomList.js";
import { RoomTemplate } from "../classes/room/RoomTemplate.js";
import { initializeRoomImageTable } from "../classes/room/RoomTemplate_initimages.js";
import { Tile } from "../classes/room/Tile.js";
import { Settings, SETTINGS_GENDER_PREFERENCE } from "../classes/Settings.js";
import { SexClasses } from "../classes/sex/_SexClasses.js";
import * as SexActionClass from "../classes/sex/action/_index.js";
import { SexAction } from "../classes/sex/action/SexAction.js";
import { SexPlanClass } from "../classes/sex/ai/plan/_index.js";
import { SexPlan } from "../classes/sex/ai/plan/SexPlan.js";
import { SexPlannerClass } from "../classes/sex/ai/planner/_index.js";
import { SexPlanner } from "../classes/sex/ai/planner/SexPlanner.js";
import { SexAI } from "../classes/sex/ai/SexAI.js";
import { sexbodypart } from "../classes/sex/bodypart/_index.js";
import { SexBodypart } from "../classes/sex/bodypart/SexBodypart.js";
import { SexInstance } from "../classes/sex/engine/SexInstance.js";
import { SexScene } from "../classes/sex/engine/SexScene.js";
import { sexfacing } from "../classes/sex/facing/_index.js";
import { SexFacing } from "../classes/sex/facing/SexFacing.js";
import { sexgoal } from "../classes/sex/goal/_index.js";
import { SexGoal } from "../classes/sex/goal/SexGoal.js";
import { sexheight } from "../classes/sex/height/_index.js";
import { SexHeight } from "../classes/sex/height/SexHeight.js";
import { sexlocation } from "../classes/sex/location/_index.js";
import { SexLocation } from "../classes/sex/location/SexLocation.js";
import { sexpace } from "../classes/sex/pace/_index.js";
import { SexPace } from "../classes/sex/pace/SexPace.js";
import { sexpermission } from "../classes/sex/permission/_index.js";
import { SexPermission } from "../classes/sex/permission/SexPermission.js";
import { sexpose } from "../classes/sex/pose/_index.js";
import { SexPose } from "../classes/sex/pose/SexPose.js";
import { sexposition } from "../classes/sex/position/_index.js";
import { SexPosition } from "../classes/sex/position/SexPosition.js";
import { SexConstants } from "../classes/sex/SexConstants.js";
import { SexUtil } from "../classes/sex/SexUtil.js";
import { SexText } from "../classes/sex/text/_init.js";
import {
  Skill,
  SkillHelper,
  type SkillKey,
  type SkillKeyword,
} from "../classes/Skill.js";
import { SkillBoost } from "../classes/SkillBoost.js";
import { SlaveOrder } from "../classes/slaveorder/SlaveOrder.js";
import { SlaveOrderItem } from "../classes/slaveorder/SlaveOrderItem.js";
import { SlaveOrderList } from "../classes/slaveorder/SlaveOrderList.js";
import { Speech } from "../classes/Speech.js";
import { Statistics } from "../classes/Statistics.js";
import { BUILDING_TAGS } from "../classes/tag/tag_building.js";
import { TAG_LORE } from "../classes/tag/tag_lore.js";
import {
  QUESTTAGS,
  QUESTTAGS_BORDER,
  QUESTTAGS_DEFAULT_PANORAMA,
  QUESTTAGS_PANORAMA,
} from "../classes/tag/tag_quest.js";
import { TAG_ROOM } from "../classes/tag/tag_room.js";
import { TAG_SEXACTION } from "../classes/tag/tag_sexaction.js";
import { TAG_TRAIT } from "../classes/tag/tag_trait.js";
import { TAG_UNITACTION } from "../classes/tag/tag_unitaction.js";
import { TagHelper } from "../classes/tag/TagHelper.js";
import { Team } from "../classes/Team.js";
import { Title } from "../classes/title/Title.js";
import { TitleHelper } from "../classes/title/TitleHelper.js";
import { TITLE_MAX_ASSIGNED, TitleList } from "../classes/title/TitleList.js";
import { Perk } from "../classes/trait/Perk.js";
import { Subrace } from "../classes/trait/Subrace.js";
import { Trait, TraitHelper } from "../classes/trait/Trait.js";
import { TraitGroup } from "../classes/trait/TraitGroup.js";
import { Trauma } from "../classes/Trauma.js";
import { UnitPool } from "../classes/unit/pool/UnitPool.js";
import { UnitPoolHelper } from "../classes/unit/pool/UnitPoolHelper.js";
import { UnitPoolTraitAlloc } from "../classes/unit/pool/UnitPoolTraitAlloc.js";
import { Unit } from "../classes/unit/Unit.js";
import {
  getAnySlaver,
  getDutySlaver,
  getUnit,
  getUnitOrAny,
  getUnitRandom,
  selectUnit,
} from "../classes/unit/Unit_helpers.js";
import {
  Unit_CmpDefault,
  Unit_CmpJob,
  Unit_CmpName,
} from "../classes/unit/Unit_static.js";
import { UnitTitleHelper } from "../classes/unit/Unit_TitleHelper.js";
import { UnitBirth } from "../classes/unit/UnitBirth.js";
import { UnitGroup } from "../classes/unit/UnitGroup.js";
import { UnitGroup_SoldSlaves } from "../classes/unit/UnitGroup_SoldSlaves.js";
import { UnitImage } from "../classes/unit/UnitImage.js";
import { UnitAction } from "../classes/unitaction/UnitAction.js";
import { UnitAction_RepeatSelf } from "../classes/unitaction/UnitAction_RepeatSelf.js";
import { UnitActionHelper } from "../classes/unitaction/UnitActionHelper.js";
import { VarStore } from "../classes/VarStore.js";
import { Constants } from "../constants.js";
import { SEXGENDERS } from "../data/sexgenders.js";
import { renderDescription } from "../dom/card/quest.js";
import { DOM } from "../dom/DOM.js";
import { FortGridController } from "../dom/menu/fortgrid.js";
import { Article, ArticleOnly, articles } from "../lib/articles.js";
import { ArgType, MacroUtil } from "../macro/_metadata.js";
import { generateUnitName } from "../names/namegen.js";
import { Text } from "../text/text.js";
import { Dialogs } from "../ui/ux/Dialogs.js";
import { ActorHelper, DebugActor } from "../util/actor.js";
import { BackwardsCompat, updatePostProcess } from "../util/backwardscompat.js";
import { beautifyTwine } from "../util/code_beautifier.js";
import { getAuthorCredits } from "../util/credits.js";
import {
  debugCrash,
  debugPrintRoomLocations,
  generateAnyUnit,
} from "../util/debug_util.js";
import { DebugInit } from "../util/debuginit.js";
import { DevToolHelper } from "../util/devtool.js";
import { FileUtil } from "../util/files.js";
import { globalsettings } from "../util/globalsettings.js";
import { ModManager } from "../util/modmanager.js";
import { PermuteHelper } from "../util/permute.js";
import { QuestAssignHelper } from "../util/questassign.js";
import { RestrictionLib } from "../util/restriction.js";
import { rng } from "../util/rng.js";
import { SaveGlobalFunctions, SaveUtil } from "../util/save.js";
import { SetupUtil } from "../util/SetupUtil.js";
import "./preinit_base.js";
import { qc, qres } from "./preinit_costrestrictions.js";
import { initEstablishBase, initSetup, initState } from "./state_init.js";

const setup_ = {
  //
  // Classes
  //

  TwineClass,

  Bodyshift,
  BuildingInstance,
  BuildingTemplate,
  Cache,
  Calendar,
  CompanyTemplate,
  Company,
  Favor,
  Fort,
  Hospital,
  Ire,
  Leave,
  Lore,
  Notification,
  Settings,
  Skill,
  SkillBoost,
  Speech,
  Statistics,
  Team,
  Trauma,
  VarStore,
  Friendship,
  ActivityInstance,
  ActivityTemplate,
  ActivityList,
  DialogueHelper,
  BanterInstance,
  Bedchamber,
  BedchamberList,
  Contact,
  ContactList,
  ContactTemplate,
  ContentImage,
  Cost,
  SexCost,
  UnitCriteria,
  Deck,
  Rarity,
  DutyInstance,
  DutyList,
  Armory,
  Equipment,
  EquipmentPool,
  EquipmentSlot,
  EquipmentSet,
  EquipmentPoolGroup,
  /** @deprecated Alias for backwards compatibility */
  Event: EventTemplate,
  EventTemplate,
  EventInstance,
  EventPool,
  FamilyRelation,
  Family,
  MenuFilter,
  Furniture,
  FurnitureSlot,
  /** @deprecated Alias for backwards compatibility */
  Interaction: InteractionTemplate,
  InteractionTemplate,
  InteractionInstance,
  InteractionPool,
  Inventory,
  Job,
  Party,
  PartyList,
  Restriction,
  SexRestriction,
  TitleList,

  OpportunityInstance,
  OpportunityList,
  OpportunityTemplate,
  QuestGen,
  QuestInstance,
  QuestInstanceUnitAction,
  QuestInstanceUnitActionRepeatSelf,
  QuestUnitCriteriaRapeFetishist,
  QuestPool,
  QuestTemplate,
  QuestDifficulty,
  Living,
  RetiredList,
  FortGrid,
  FortGridController,
  Tile,
  SlaveOrder,
  SlaveOrderItem,
  SlaveOrderList,
  SlaveOrderAddonBase,
  TagHelper,
  Title,
  Perk,
  Trait,
  TraitGroup,
  Subrace,
  Unit,
  UnitGroup,
  UnitGroup_SoldSlaves,
  UnitImage,
  UnitAction,
  UnitPool,
  UnitPoolTraitAlloc,
  UnitAction_RepeatSelf,

  SexInstance,
  SexScene,

  SexAction,
  SexAI,
  SexPlan,
  SexPlanner,

  SexBodypart,
  SexFacing,
  SexGoal,
  SexHeight,
  SexLocation,
  SexPace,
  SexPermission,
  SexPose,
  SexPosition,

  RoomInstance,
  RoomTemplate,
  RoomList,

  Item,
  ItemPool,
  ItemClass,
  ItemLorebook,
  ItemUsable,
  ItemNotUsable,
  ItemQuest,
  ItemSexManual,
  ItemTechnology,
  ItemUnitUsable,

  Market,
  MarketEquipment,
  MarketItem,
  MarketObject,
  MarketUnit,

  DutyTemplate,
  DutyInstanceBedchamberSlave,
  DutyInstancePrestigeSlave,
  ...Object.values(DUTY_TEMPLATE_SUBCLASSES),

  //
  // Static data containers/registries
  //

  skill: [] as unknown as Record<SkillKey | SkillKeyword, Skill> &
    Array<InstanceType<typeof Skill>>,
  activitytemplate: {} as Registry<ActivityTemplate>,
  // TODO: fix circular type references
  //buildingtemplate: {} as Registry<BuildingTemplate>,
  buildingtemplate: {} as Record<string, BuildingTemplate>,
  companytemplate: {} as Registry<CompanyTemplate>,
  contacttemplate: {} as Registry<ContactTemplate>,
  qu: {} as { [k in UnitCriteriaKey]: UnitCriteria },
  equipment: {} as Registry<Equipment>,
  equipmentpool: {} as Registry<EquipmentPool>,
  event: {} as Registry<EventTemplate>,
  familyrelation: {} as Registry<FamilyRelation>,
  qdiff: {} as Registry<QuestDifficulty>,
  title: {} as RegistryWithBuiltins<Title, BuiltinTitleKey>,
  interaction: {} as Registry<InteractionTemplate>,
  interactionpool: {} as Registry<InteractionPool>,
  item: {} as Registry<Item>,
  itempool: {} as Registry<ItemPool>,
  itemclass: {} as Registry<ItemClass>,
  lore: {} as Registry<Lore>,
  subrace: {} as Registry<Subrace>,
  opportunitytemplate: {} as RegistryWithBuiltins<
    OpportunityTemplate,
    BuiltinOpportunityTemplateKey
  >,
  questpool: {} as Registry<QuestPool>,
  questtemplate: {} as RegistryWithBuiltins<
    QuestTemplate,
    BuiltinQuestTemplateKey
  >,
  roomtemplate: {} as Registry<RoomTemplate>,
  speech: {} as Registry<Speech>,
  trait: {} as Registry<Trait>,
  traitgroup: {} as Registry<TraitGroup>,
  unitaction: {} as Registry<UnitAction>,
  unitgroup: {} as Registry<UnitGroup>,
  unitpool: {} as Registry<UnitPool>,
  living: {} as Registry<Living>,

  qc,
  qcImpl,

  qres,
  qresImpl,

  rarity,

  /** Holds singleton instances of DutyTemplate subclasses */
  dutytemplate: {} as unknown as Registry<DutyTemplate>,

  equipmentslot: {} as unknown as Registry<EquipmentSlot>,
  furnitureslot: {} as unknown as Registry<FurnitureSlot>,
  job: {} as unknown as Registry<Job>,

  SexActionClass,
  //SexBodypartClass,
  //SexFacingClass,
  //SexGoalClass,
  //SexHeightClass,
  //SexLocationClass,
  //SexPaceClass,
  //SexPermissionClass,
  //SexPoseClass,
  //SexPositionClass,

  SexPlannerClass,
  SexPlanClass,

  SexClasses,

  sexaction: [] as readonly SexAction[],
  sexbodypart,
  sexfacing,
  sexheight,
  sexgoal,
  sexlocation,
  sexpace,
  sexpermission,
  sexpose,
  sexposition,

  //
  // Global functions
  //
  ...SetupUtil,
  ...SaveGlobalFunctions,

  initState,
  initEstablishBase,
  initSetup,
  notify,
  queueDelete,
  initializeRoomImageTable,
  getUnit,
  getUnitOrAny,
  getUnitRandom,
  getDutySlaver,
  getAnySlaver,
  selectUnit,
  renderDescription,

  //
  // Namespaces containing util/helper functions
  //

  DOM,
  Dialogs,
  Text,
  FilterHelper,
  SkillHelper,
  BanterHelper,
  SexUtil,
  SexText,
  TitleHelper,
  UnitTitle: UnitTitleHelper,
  UnitBirth,
  UnitPoolHelper,
  UnitActionHelper,
  QuestAssignHelper,
  ActorHelper,
  DebugActor,
  DebugInit,
  SaveUtil,
  FileUtil,
  RestrictionLib,
  PermuteHelper,
  rng,
  DevToolHelper,
  BackwardsCompat,
  TraitHelper,

  //
  // Constants
  //

  ...Constants,
  ...FriendshipConstants,
  SexConstants,

  IS_DEV_BUILD: !import.meta.env.PROD,

  QUEST_OUTCOMES,
  BEDCHAMBER_OPTIONS,
  BEDCHAMBER_OPTION_CHANCES,
  BUILDING_TAGS,
  TAG_LORE,
  QUESTTAGS,
  QUESTTAGS_DEFAULT_PANORAMA,
  QUESTTAGS_PANORAMA,
  QUESTTAGS_BORDER,
  TAG_ROOM,
  TAG_SEXACTION,
  TAG_TRAIT,
  TAG_UNITACTION,
  TITLE_MAX_ASSIGNED,
  SEXGENDERS,
  SETTINGS_GENDER_PREFERENCE,

  //
  // Misc
  //

  Unit_CmpDefault,
  Unit_CmpName,
  Unit_CmpJob,

  ActivityTemplateInitFuck,
  SlaveOrderAddon,
  CriteriaHelper,
  DutyTemplateClass: DUTY_TEMPLATE_SUBCLASSES,

  Article,
  ArticleOnly,
  articles,

  globalsettings,
  ModManager,

  debugCrash,
  debugPrintRoomLocations,
  generateAnyUnit,

  beautifyTwine,

  getAuthorCredits,
  updatePostProcess,
  generateUnitName,

  MacroUtil,
  ArgType,

  gFortGridControl: undefined as FortGridController | undefined,
};

export type SetupType = typeof setup_;

Object.assign(setup, setup_);

Object.assign(globalThis, {
  _DE: setup.deserializeClass,
});
