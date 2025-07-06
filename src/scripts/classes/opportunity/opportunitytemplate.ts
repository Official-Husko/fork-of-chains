// @ts-nocheck

import { ContentTemplate } from "../content/ContentTemplate"
setup.OpportunityTemplate = class OpportunityTemplate extends ContentTemplate {
  /**
   * @typedef {{name: string, url: string}} AuthorInfo
   * @typedef {{
   * description_passage: string,
   * outcome_passage: string | null,
   * costs: setup.Cost[],
   * restrictions: setup.Restriction[],
   * outcomes: setup.Cost[],
   * visibility_restrictions: setup.Restriction[],
   * }} Option
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {string | AuthorInfo} author 
   * @param {Array.<string>} tags 
   * @param {number} deadline_weeks 
   * @param {string} description_passage 
   * @param {setup.QuestDifficulty} difficulty 
   * @param {Array<Array | Option>} options
   * @param {Array.<Array>} quest_pools 
   * @param {Array=} prerequisites 
   * @param {object=} actor_unitgroups 
   * @param {Array=} expired_outcomes 
   * @param {boolean=} is_must_be_answered 
   */
  constructor(
    key,
    name,
    author,   // who wrote this?
    tags,   // list of tags to filter content. See list of available tags at src/scripts/classes/quest/questtags.js
    deadline_weeks,
    description_passage,
    difficulty,
    options,  // see below
    quest_pools,  // list of [quest_pool, rarity]. Rarity is 0-100, where 100 is impossible to generate.
    prerequisites,    // list that governs whether quest can be generated or not, if any. E.g., NeedItem(xxx)
    actor_unitgroups,  // (OPTIONAL): null OR {actorname: unitgroup.x, actorname: 'x', actorname: [res1, res2]}, unit generated/randomly taken
    // if unitgroup: will be taken from there. if [res1, res2], will be taken from your slavers that satisfy these
    expired_outcomes,  // what happens when opportunity expires without being used?
    is_must_be_answered,  // whether this opportunity has to be answered before the week ends.
  ) {
    super(key, name, author, tags, actor_unitgroups, difficulty)

    /**
     * @type {'opportunity'}
     */
    const type = 'opportunity'
    this.TYPE = type

    /* options:
      [
        ['option_desc_passage_name', 'outcome_passage', [cost1, cost2], [prereq1, prereq2], [outcome1, outcome2]],
        [...],
      ]
    */
    this.deadline_weeks = deadline_weeks

    /**
     * @type {Array<Option>}
     */
    this.options = []

    if (!Array.isArray(options)) throw new Error(`Unknown array for ${key}`)

    for (const option of options) {
      if (Array.isArray(option)) {
        // legacy option
        this.options.push({
          description_passage: option[0],
          outcome_passage: option[1],
          costs: option[2],
          restrictions: option[3],
          outcomes: option[4],
          visibility_restrictions: option[5] || [],
        })
      } else {
        this.options.push(option)
      }
    }

    if (!description_passage) throw new Error(`Unknown description passage for ${key}`)
    this.description_passage = description_passage

    if (prerequisites) {
      this.prerequisites = prerequisites
    } else {
      this.prerequisites = []
    }

    if (expired_outcomes) {
      this.expired_outcomes = expired_outcomes
    } else {
      this.expired_outcomes = []
    }

    this.is_must_be_answered = is_must_be_answered

    if (key in setup.opportunitytemplate) throw new Error(`OpportunityTemplate ${key} already exists`)
    setup.opportunitytemplate[key] = this

    this.pools = []
    this.rarities = []
    for (let i = 0; i < quest_pools.length; ++i) {
      let quest_pool = quest_pools[i]
      let rarity = quest_pool[1]
      if (!(rarity instanceof setup.Rarity)) throw new Error(`Opportunity rarity of ${key} must be of type setup.Rarity!`)
      quest_pool[0].registerOpportunity(this, rarity)
      this.pools.push(quest_pool[0].key)
      this.rarities.push(rarity.key)
    }
  };

  /**
   * @returns {{pool: setup.QuestPool, rarity: setup.Rarity}}
   */
  getAnyQuestPoolRarity() {
    if (this.pools.length) {
      return {
        pool: setup.questpool[this.pools[0]],
        rarity: setup.rarity[this.rarities[0]]
      }
    } else {
      return null
    }
  }

  static sanityCheck(
    key,
    name,
    deadline_weeks,
    difficulty,
    description,
    options,  // see below
    rarity,  // list of [quest_pool, rarity]. Rarity is 0-100, where 100 is impossible to generate.
  ) {
    if (!key) return 'Key cannot be empty'
    if (key in setup.opportunitytemplate) return `Key ${key} is duplicated with another opportunity`
    // if (!key.match('^[a-z_]+$')) return `Key ${key} must only consist of lowercase characters and underscore, e.g., water_well`

    if (!name) return 'Name cannot be null'

    if (deadline_weeks <= 0) return 'Opportunity must have at least 1 week before expiring'

    if (!difficulty) return 'Difficulty cannot be empty'

    if (!description) return 'Description must not be empty'

    if (rarity < 0 || rarity > 100) return 'Rarity must be between 0 and 100'

    if (!options.length) return 'Must have at least one option.'

    for (let i = 0; i < options.length; ++i) {
      let option = options[i]
      if (!option.title) return `${i}-th option must have a title`
    }

    return null
  }

  rep() { return this.getName() }

  /**
   * @returns {Option[]}
   */
  getOptions() {
    return this.options
  }

  /**
   * Return only the options that are visible to the player
   * @returns {Option[]}
   */
  getVisibleOptions() {
    return this.getOptions().filter(
      option => setup.RestrictionLib.isPrerequisitesSatisfied(null, option.visibility_restrictions))
  }

  /* useful for money making generations */
  getWeeks() { return 1 }

  getDeadlineWeeks() { return this.deadline_weeks }

  getDescriptionPassage() { return this.description_passage }

  getPrerequisites() { return this.prerequisites }

  getExpiredOutcomes() { return this.expired_outcomes }

  /**
   * @returns {boolean}
   */
  isMustBeAnswered() { return this.is_must_be_answered }

  /**
   * @returns {Array.<string>}
   */
  getAllActorNames() {
    return Object.keys(this.getActorUnitGroups())
  }

  isCanGenerate() {
    let tags = this.getTags()
    let bannedtags = State.variables.settings.getBannedTags()
    for (let i = 0; i < tags.length; ++i) {
      if (bannedtags.includes(tags[i])) return false
    }

    if (!setup.RestrictionLib.isActorUnitGroupViable(this.getActorUnitGroups())) return false

    if (State.variables.calendar.isOnCooldown(this)) return false

    let prerequisites = this.getPrerequisites()
    return setup.RestrictionLib.isPrerequisitesSatisfied(this, prerequisites)
  }

  /**
   * @param {boolean} is_efficient 
   * @returns {setup.OpportunityInstance}
   */
  debugMakeInstance(is_efficient) {
    let template = this

    // generate actors for this
    let actors = setup.DebugActor.getActors(template.getActorUnitGroups(), is_efficient)

    // instantiate the opportunity
    let newopportunity = new setup.OpportunityInstance(template, actors)
    return newopportunity
  }

  /**
   * @param {string} actor_name 
   * @returns {setup.Job | null}
   */
  getActorResultJob(actor_name) {
    let outcomes = this.getOptions()
    for (let i = 0; i < outcomes.length; ++i) {
      let costlist = outcomes[i].outcomes
      for (let j = 0; j < costlist.length; ++j) {
        let cost = costlist[j]
        // @ts-ignore
        if (cost.IS_SLAVE && cost.getActorName() == actor_name) return setup.job.slave
        // @ts-ignore
        if (cost.IS_SLAVER && cost.getActorName() == actor_name) return setup.job.slaver
      }
    }
    return null
  }

  getCardClass() {
    return setup.TagHelper.getQuestCardClass(this.getTags())
  }
}
