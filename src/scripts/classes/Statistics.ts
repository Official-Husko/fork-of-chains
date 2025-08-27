import { TwineClass } from "./_TwineClass";
import type { Item, ItemKey } from "./inventory/Item";
import type { QuestPool, QuestPoolKey } from "./quest/QuestPool";
import type {
  QuestOutcome,
  QuestTemplate,
  QuestTemplateKey,
} from "./quest/QuestTemplate";

type NumericStatisticName = {
  [k in keyof Statistics]: Statistics[k] extends number ? k : never;
}[keyof Statistics];

/**
 * Will be set to $statistics.
 */
export class Statistics extends TwineClass {
  /* ============= */
  /* Money */
  /* ============= */

  /** max money ever owned */
  money_max = 0;

  /** max money ever gained at once */
  money_max_gain = 0;

  /** max money ever lost at once (positive value) */
  money_max_lose = 0;

  /* ============= */
  /* Prestige */
  /* ============= */

  prestige_max = 0;

  /* ============= */
  /* Quests */
  /* ============= */

  /** total number of quests ever scouted */
  quest_obtained = 0;

  /** total number of veteran quests ever scouted */
  quest_obtained_veteran = 0;

  /** total number of veteran quests ever done */
  quest_done_veteran = 0;

  /** max total number of quests you have simultaenously at once */
  quest_max_simultaneous_have = 0;

  /** total number of quests ended up in: crit/success/failure/disaster */
  quest_crit = 0;
  quest_success = 0;
  quest_failure = 0;
  quest_disaster = 0;

  /** highest level of quest ever get and took, respectively */
  quest_max_get_level = 0;
  quest_max_took_level = 0;

  /* ============= */
  /* Opportunities */
  /* ============= */

  /** total number of opporutnities ever obtained */
  opportunity_obtained = 0;

  /** number of opportunities you or your vice-leader answer */
  opportunity_answered = 0;

  /* ============= */
  /* Units */
  /* ============= */

  /** # slavers hired ever */
  slavers_hired = 0;

  /** # max slavers you have at one point */
  slavers_max = 0;

  /** # lost/missing slavers */
  slavers_lost = 0;

  /** # total slavers in prospect hall */
  slavers_offered = 0;

  /** # slaves got ever */
  slaves_hired = 0;

  /** # max slaves you have at one point */
  slaves_max = 0;

  /** # slaves lost */
  slaves_lost = 0;

  /** # total slaves in slave pens */
  slaves_offered = 0;

  /* ============= */
  /* Interaction and banters */
  /* ============= */

  /** # banters ever done */
  banters = 0;

  /** # interactions with slaver */
  interactions_slaver = 0;

  /** # interactions with slave */
  interactions_slave = 0;

  /* ============= */
  /* Corruption and Purification */
  /* ============= */

  /** # of corruptions on slaver/slave */
  corruptions_slaver = 0;
  corruptions_slave = 0;

  /** # of purifications on slaver/slave */
  purifications_slaver = 0;
  purifications_slave = 0;

  /* ============= */
  /* Equipment and Items */
  /* ============= */

  /** how man items have you... */
  items_obtained = 0;
  items_bought = 0;
  items_lost = 0;
  items_sold = 0;
  /** been offered in the markets */
  items_offered = 0;

  /** how man equipments have you... */
  equipment_bought = 0;
  /** been offered in the markets */
  equipment_offered = 0;
  /** NOTE: Equipment does not have obtained and lost, because it is indistinguishable from when they are attached/unattached */

  /* ============= */
  /* Buildings */
  /* ============= */

  buildings_built = 0;
  buildings_upgraded = 0;

  /* ============= */
  /* Slave Order */
  /* ============= */

  /** # of slave orders ever obtained */
  slave_order_obtained = 0;

  /** # fulfilled */
  slave_order_fulfilled = 0;

  /** # max money obtained from ONE slave order */
  slave_order_money_max = 0;

  /** # total money obtained from slave orders */
  slave_order_money_sum = 0;

  /** # max slave value sold in a slave order */
  slave_order_slave_value_max = 0;

  /* ============= */
  /* Contacts */
  /* ============= */

  /** how many contacts you ever obtained? */
  contact_obtained = 0;

  /* ============= */
  /* Injuries */
  /* ============= */

  /** how many slaver/slave ever got injured? */
  injury_slaver_count = 0;
  injury_slave_count = 0;

  /** total number of injury weeks on your slavers/slave */
  injury_slaver_week_sum = 0;
  injury_slave_week_sum = 0;

  /** maximum injured week on your slaver/slave */
  injury_slaver_week_max = 0;
  injury_slave_week_max = 0;

  /** maximum number of slavers/slaves that are simultaenously injured */
  injury_slaver_simultaneous = 0;
  injury_slave_simultaneous = 0;

  /* ============= */
  /* Trauma and boon */
  /* ============= */

  /** same with injuries above */
  trauma_count = 0;
  trauma_week_max = 0;
  trauma_week_sum = 0;

  boon_count = 0;
  boon_week_max = 0;
  boon_week_sum = 0;

  /* ============= */
  /* Events */
  /* ============= */

  /** how many events have procced? */
  events = 0;

  /* ============= */
  /* New Game Plus */
  /* ============= */

  /** how many times have you do a new game plus? */
  new_game_plus_count = 0;

  /* ============= */
  /* Quests */
  /* ============= */

  /** all quests and their correpsonding outcomes that have ever been done. */
  /** e.g., {'quest_a': {'crit': true, 'failure': true}} */
  quest_history: {
    [k in QuestTemplateKey]?: {
      [outcome in QuestOutcome]?: boolean;
    };
  } = {};

  /** If regalixir quest has been completed before NG+ by the same player. */
  /** TODO: Generalize this to enable tracking other quests across NG+ */
  regalixir_completed_previous_games = 0;

  /**
   * Number of times you have scouted from each of these quest pools
   * pool_key: number
   */
  questpool_scouted: {
    [k in QuestPoolKey]?: number;
  } = {};

  /**
   * All items that you have ever acquired.
   * item_key: 1
   */
  acquired_item_keys: {
    [k in ItemKey]?: 1;
  } = {};

  /**
   * All items that are already in the alchemist shop
   * item_key: 1
   */
  alchemist_item_keys: {
    [k in ItemKey]?: 1;
  } = {};

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  constructor() {
    super();
  }

  acquireItem(item: Item) {
    this.acquired_item_keys[item.key] = 1;
  }

  putInAlchemistShop(item: Item) {
    this.alchemist_item_keys[item.key] = 1;
  }

  isItemAcquired(item: Item) {
    return this.acquired_item_keys[item.key];
  }

  isItemInAlchemistShop(item: Item) {
    return this.alchemist_item_keys[item.key];
  }

  isHasSuccess(quest_template: QuestTemplate): boolean {
    const obj = this.quest_history[quest_template.key];
    if (obj) {
      return "crit" in obj || "success" in obj;
    }
    return false;
  }

  /**
   * Adds that one quest was scouted from this quest pool.
   */
  addScoutedQuest(quest_pool: QuestPool) {
    const old_value = this.questpool_scouted[quest_pool.key] ?? 0;
    this.questpool_scouted[quest_pool.key] = old_value + 1;
  }

  /**
   * How many quests have ever been scouted from this pool?
   */
  getScoutedQuestsCount(quest_pool: QuestPool): number {
    return this.questpool_scouted[quest_pool.key] || 0;
  }

  setQuestResult(quest_template: QuestTemplate, result: QuestOutcome) {
    const outcome_stats = (this.quest_history[quest_template.key] ??= {});
    outcome_stats[result] = true;
  }

  get(attribute_name: NumericStatisticName) {
    if (!(attribute_name in this)) return `Missing ${attribute_name} for get`;
    return this[attribute_name];
  }

  add(attribute_name: NumericStatisticName, amt: number) {
    if (!(attribute_name in this)) return `Missing ${attribute_name} for add`;
    if (amt == null || amt == undefined) return `Missing amt for add`;
    this[attribute_name] += amt;
  }

  setMax(attribute_name: NumericStatisticName, amt: number) {
    if (!(attribute_name in this))
      return `Missing ${attribute_name} for setmax`;
    this[attribute_name] = Math.max(this[attribute_name], amt);
  }
}
