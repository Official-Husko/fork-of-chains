
// will be set to $statistics.
setup.Statistics = class Statistics extends setup.TwineClass {
  constructor() {
    super()

    /* ============= */
    /* Money */
    /* ============= */

    // max money ever owned
    this.money_max = 0

    // max money ever gained at once
    this.money_max_gain = 0

    // max money ever lost at once (positive value)
    this.money_max_lose = 0

    /* ============= */
    /* Prestige */
    /* ============= */

    this.prestige_max = 0

    /* ============= */
    /* Quests */
    /* ============= */

    // total number of quests ever scouted
    this.quest_obtained = 0

    // total number of veteran quests ever scouted
    this.quest_obtained_veteran = 0

    // total number of veteran quests ever done
    this.quest_done_veteran = 0

    // max total number of quests you have simultaenously at once
    this.quest_max_simultaneous_have = 0

    // total number of quests ended up in: crit/success/failure/disaster
    this.quest_crit = 0
    this.quest_success = 0
    this.quest_failure = 0
    this.quest_disaster = 0

    // highest level of quest ever get and took, respectively
    this.quest_max_get_level = 0
    this.quest_max_took_level = 0

    /* ============= */
    /* Opportunities */
    /* ============= */

    // total number of opporutnities ever obtained
    this.opportunity_obtained = 0

    // number of opportunities you or your vice-leader answer
    this.opportunity_answered = 0

    /* ============= */
    /* Units */
    /* ============= */

    // # slavers hired ever
    this.slavers_hired = 0

    // # max slavers you have at one point
    this.slavers_max = 0

    // # lost/missing slavers
    this.slavers_lost = 0

    // # total slavers in prospect hall
    this.slavers_offered = 0

    // # slaves got ever
    this.slaves_hired = 0

    // # max slaves you have at one point
    this.slaves_max = 0

    // # slaves lost
    this.slaves_lost = 0

    // # total slaves in slave pens
    this.slaves_offered = 0

    /* ============= */
    /* Interaction and banters */
    /* ============= */

    // # banters ever done
    this.banters = 0

    // # interactions with slaver
    this.interactions_slaver = 0

    // # interactions with slave
    this.interactions_slave = 0

    /* ============= */
    /* Corruption and Purification */
    /* ============= */

    // # of corruptions on slaver/slave
    this.corruptions_slaver = 0
    this.corruptions_slave = 0

    // # of purifications on slaver/slave
    this.purifications_slaver = 0
    this.purifications_slave = 0

    /* ============= */
    /* Equipment and Items */
    /* ============= */

    // how man items have you...
    this.items_obtained = 0
    this.items_bought = 0
    this.items_lost = 0
    this.items_sold = 0
    // been offered in the markets
    this.items_offered = 0

    // how man equipments have you...
    this.equipment_bought = 0
    // been offered in the markets
    this.equipment_offered = 0
    // NOTE: Equipment does not have obtained and lost, because it is indistinguishable from when they are attached/unattached

    /* ============= */
    /* Buildings */
    /* ============= */

    this.buildings_built = 0
    this.buildings_upgraded = 0

    /* ============= */
    /* Slave Order */
    /* ============= */

    // # of slave orders ever obtained
    this.slave_order_obtained = 0

    // # fulfilled
    this.slave_order_fulfilled = 0

    // # max money obtained from ONE slave order
    this.slave_order_money_max = 0

    // # total money obtained from slave orders
    this.slave_order_money_sum = 0

    // # max slave value sold in a slave order
    this.slave_order_slave_value_max = 0

    /* ============= */
    /* Contacts */
    /* ============= */

    // how many contacts you ever obtained?
    this.contact_obtained = 0

    /* ============= */
    /* Injuries */
    /* ============= */

    // how many slaver/slave ever got injured?
    this.injury_slaver_count = 0
    this.injury_slave_count = 0

    // total number of injury weeks on your slavers/slave
    this.injury_slaver_week_sum = 0
    this.injury_slave_week_sum = 0

    // maximum injured week on your slaver/slave
    this.injury_slaver_week_max = 0
    this.injury_slave_week_max = 0

    // maximum number of slavers/slaves that are simultaenously injured
    this.injury_slaver_simultaneous = 0
    this.injury_slave_simultaneous = 0

    /* ============= */
    /* Trauma and boon */
    /* ============= */

    // same with injuries above
    this.trauma_count = 0
    this.trauma_week_max = 0
    this.trauma_week_sum = 0

    this.boon_count = 0
    this.boon_week_max = 0
    this.boon_week_sum = 0

    /* ============= */
    /* Events */
    /* ============= */

    // how many events have procced?
    this.events = 0

    /* ============= */
    /* New Game Plus */
    /* ============= */

    // how many times have you do a new game plus?
    this.new_game_plus_count = 0

    /* ============= */
    /* Quests */
    /* ============= */

    // all quests and their correpsonding outcomes that have ever been done.
    // e.g., {'quest_a': {'crit': true, 'failure': true}}
    this.quest_history = {}

    // If regalixir quest has been completed before NG+ by the same player.
    // TODO: Generalize this to enable tracking other quests across NG+
    this.regalixir_completed_previous_games = false

    /**
     * Number of times you have scouted from each of these quest pools
     * pool_key: number
     * @type {Object<string, number>}
     */
    this.questpool_scouted = {}

    /**
     * All items that you have ever acquired.
     * item_key: boolean
     * @type {Object<string, boolean>}
     */
    this.acquired_item_keys = {}

    /**
     * All items that are already in the alchemist shop
     * item_key: boolean
     * @type {Object<string, boolean>}
     */
    this.alchemist_item_keys = {}
  }

  /**
   * @param {setup.Item} item 
   */
  acquireItem(item) {
    this.acquired_item_keys[item.key] = true
  }

  /**
   * @param {setup.Item} item 
   */
  putInAlchemistShop(item) {
    this.alchemist_item_keys[item.key] = true
  }

  /**
   * @param {setup.Item} item 
   */
  isItemAcquired(item) {
    return this.acquired_item_keys[item.key]
  }

  /**
   * @param {setup.Item} item 
   */
  isItemInAlchemistShop(item) {
    return this.alchemist_item_keys[item.key]
  }

  /**
   * @param {setup.QuestTemplate} quest_template
   * @returns {boolean}
   */
  isHasSuccess(quest_template) {
    if (quest_template.key in this.quest_history) {
      const obj = this.quest_history[quest_template.key]
      return 'crit' in obj || 'success' in obj
    }
    return false
  }

  /**
   * Adds that one quest was scouted from this quest pool.
   * @param {setup.QuestPool} quest_pool 
   */
  addScoutedQuest(quest_pool) {
    if (!(quest_pool.key in this.questpool_scouted)) {
      this.questpool_scouted[quest_pool.key] = 0
    }
    this.questpool_scouted[quest_pool.key] += 1
  }

  /**
   * How many quests have ever been scouted from this pool?
   * @param {setup.QuestPool} quest_pool 
   * @returns {number}
   */
  getScoutedQuestsCount(quest_pool) {
    return this.questpool_scouted[quest_pool.key] || 0
  }

  /**
   * 
   * @param {setup.QuestTemplate} quest_template 
   * @param {string} result 
   */
  setQuestResult(quest_template, result) {
    if (!(quest_template.key in this.quest_history)) {
      this.quest_history[quest_template.key] = {}
    }
    this.quest_history[quest_template.key][result] = true
  }

  get(attribute_name) {
    if (!(attribute_name in this)) return `Missing ${attribute_name} for get`
    return this[attribute_name]
  }

  add(attribute_name, amt) {
    if (!(attribute_name in this)) return `Missing ${attribute_name} for add`
    if (amt == null || amt == undefined) return `Missing amt for add`
    this[attribute_name] += amt
  }

  setMax(attribute_name, amt) {
    if (!(attribute_name in this)) return `Missing ${attribute_name} for setmax`
    this[attribute_name] = Math.max(this[attribute_name], amt)
  }

}
