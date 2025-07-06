// @ts-nocheck

import { doFinalize } from "../../util/questassign"
import { ContentTemplate } from "../content/ContentTemplate"

setup.QUEST_OUTCOMES = ['crit', 'success', 'failure', 'disaster']

setup.QuestTemplate = class QuestTemplate extends ContentTemplate {
  /**
   * @typedef {{name: string, url: string}} AuthorInfo
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {string | AuthorInfo} author 
   * @param {string[]} tags 
   * @param {number} weeks 
   * @param {number} deadline_weeks 
   * @param {Object<string, any>} unit_criterias 
   * @param {Object<string, any>} actor_unitgroups 
   * @param {setup.Cost[]} costs 
   * @param {string} description_passage 
   * @param {setup.QuestDifficulty} difficulty 
   * @param {Array<Array<any>>} outcomes 
   * @param {Array<Array>} quest_pools 
   * @param {setup.Restriction[]} quest_prerequisites
   * @param {setup.Cost[]} [expired_outcomes]
   */
  constructor(
    key,
    name,
    author,   // who wrote this quest?
    tags,   // list of tags to filter content. See list of available tags at src/scripts/classes/quest/questtags.js
    weeks,
    deadline_weeks,
    unit_criterias,  // {actorname: unit criteria} or {actorname: [unit criteria, weight]} Fitted from team
    actor_unitgroups,  // {actorname: unitgroup.x, actorname: 'x', actorname: [res1, res2]}, unit generated/randomly taken
    // if unitgroup: will be taken from there. if [res1, res2], will be taken from your slavers that satisfy these
    costs,
    description_passage,
    difficulty,
    outcomes,   // [crit, success, disaster, failure]. formtted [[passagecrit, [cost1, cost2]], ...]
    quest_pools,  // list of [quest_pool, rarity]. Rarity is 0-100, where 100 is impossible to generate.
    quest_prerequisites,    // list that governs whether quest can be generated or not, if any. E.g., NeedItem(xxx)
    expired_outcomes,  // what happens if you let the quest expire without doing it?
  ) {
    super(key, name, author, tags, actor_unitgroups, difficulty)

    /**
     * @type {'quest']}
     */
    const type = 'quest'
    this.TYPE = type

    this.weeks = weeks
    this.deadline_weeks = deadline_weeks

    let all_keys = []
    this.unit_criteria_map = {}
    let total_offset = 0
    for (let criteria_key in unit_criterias) {
      if (all_keys.includes(criteria_key)) throw new Error(`Duplicate actor/unit key ${criteria_key}`)
      all_keys.push(criteria_key)
      let unit_criteria = unit_criterias[criteria_key]
      let offsetmod = 1
      if (!unit_criteria) throw new Error(`unit criteria ${criteria_key} undefined`)
      if (Array.isArray(unit_criteria)) {
        offsetmod = unit_criteria[1]
        unit_criteria = unit_criteria[0]
      }

      /**
       * @type {setup.UnitCriteria}
       */
      const criteria = unit_criteria
      const skills = criteria.getSkillMultis().reduce((a, b) => a + b, 0)

      // check job
      if (criteria.getJob() == setup.job.slaver && skills) {
        total_offset += offsetmod
        // check for role fitting-ness
        if (Math.abs(skills - 3.0) > 0.00001 && !State.variables.devtooltype) {
          throw new Error(`Quest ${key}: The skills of unit criteria ${criteria_key} must sum to exactly 3.0, but ${skills} was found instead`)
        }
      }

      this.unit_criteria_map[criteria_key] = { criteria: unit_criteria, offsetmod: offsetmod }
    }

    if (Math.abs(total_offset - 3.0) > 0.00001 && !State.variables.devtooltype) {
      throw new Error(`Quest ${key}: total offset of all criteria must sum exactly to 3.0, but ${total_offset} was found instead`)
    }

    this.costs = costs
    this.description_passage = description_passage

    if (outcomes.length != 4) throw new Error(`Must have exactly four outcomes`)
    // copy this, since we're modifying it
    this.outcomes = setup.deepCopy(outcomes)

    // add exps
    this.outcomes[0][1].push(setup.qc.ExpCrit())
    this.outcomes[1][1].push(setup.qc.ExpNormal())
    this.outcomes[2][1].push(setup.qc.ExpFailure())
    this.outcomes[3][1].push(setup.qc.ExpDisaster())

    for (let i = 0; i < this.outcomes.length; ++i) {
      for (let j = 0; j < this.outcomes[i][1].length; ++j) {
        if (!this.outcomes[i][1][j]) throw new Error(`missing outcome for quest ${key}: ${i} ${j}`)
      }
    }

    if (quest_prerequisites) {
      this.quest_prerequisites = quest_prerequisites
    } else {
      this.quest_prerequisites = []
    }

    if (expired_outcomes) {
      this.expired_outcomes = expired_outcomes
    } else {
      this.expired_outcomes = []
    }

    if (key in setup.questtemplate) throw new Error(`Quest Base ${key} already exists`)
    setup.questtemplate[key] = this

    this.pools = []
    this.rarities = []
    for (let i = 0; i < quest_pools.length; ++i) {
      let quest_pool = quest_pools[i]
      let pool = setup.questpool[quest_pool[0].key]

      this.pools.push(quest_pool[0].key)
      this.rarities.push(quest_pool[1].key)

      let rarity = quest_pool[1]
      if (!(rarity instanceof setup.Rarity)) {
        throw new Error(`Rarity of quest ${this.key} must be of type setup.Rarity! (new since v1.3.3.13)`)
      }
      pool.registerQuest(this, rarity)
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
    weeks,
    deadline_weeks,
    difficulty,
    unit_criterias,  // {actorname: unit criteria} or {actorname: [unit criteria, weight]} Fitted from team
    actor_unitgroups,  // {actorname: unit group}, unit generated/taken from unit group.
    // unitgroup can be null, in which the actor must be manually specified.
    costs,
    outcomes,   // [crit, success, disaster, failure]. formtted [[passagecrit, [cost1, cost2]], ...]
    quest_prerequisites,    // list that governs whether quest can be generated or not, if any. E.g., NeedItem(xxx)
    rarity,
  ) {
    if (!key) return 'Key cannot be empty'
    if (key in setup.questtemplate) return `Key ${key} is duplicated with another quest`
    // if (!key.match('^[a-z_]+$')) return `Key ${key} must only consist of lowercase characters and underscore, e.g., water_well`

    if (!name) return 'Name cannot be null'
    if (weeks <= 0) return 'Quest must take at least 1 week'
    if (deadline_weeks <= 0) return 'Quest must have at least 1 week before expiring'
    if (!difficulty) return `Difficulty cannot be empty`
    if (!Object.keys(unit_criterias).length) return 'Must have at least one role'

    for (let i = 0; i < costs.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(costs[i], unit_criterias, actor_unitgroups)) {
        return `Actor ${costs[i].actor_name} not found in the ${i}-th quest costs`
      }
    }

    for (let i = 0; i < quest_prerequisites.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(quest_prerequisites[i], unit_criterias, actor_unitgroups)) {
        return `Actor ${quest_prerequisites[i].actor_name} not found in the ${i}-th quest restriction`
      }
    }

    for (let j = 0; j < outcomes.length; ++j) {
      for (let i = 0; i < outcomes[j].length; ++i) {
        if (!setup.QuestTemplate.isCostActorIn(outcomes[j][i], unit_criterias, actor_unitgroups)) {
          return `Actor ${outcomes[j][i].actor_name} not found in the ${i}-th outcome of the ${j}-th result`
        }
      }
    }

    if (rarity < 0 || rarity > 100) return 'Rarity must be between 0 and 100'

    return null
  }

  static isCostActorIn(cost, unit_criterias, actor_unitgroups) {
    if ('actor_name' in cost && !(cost.actor_name in unit_criterias || cost.actor_name in actor_unitgroups)) {
      return false
    }
    return true
  }

  rep() { return this.getName() }

  getExpiredOutcomes() { return this.expired_outcomes }

  getWeeks() { return this.weeks }

  getOutcomes() { return this.outcomes }

  getDeadlineWeeks() { return this.deadline_weeks }

  getCosts() { return this.costs }

  getDescriptionPassage() { return this.description_passage }

  getPrerequisites() { return this.quest_prerequisites }

  isCanGenerate() {
    if (State.variables.settings.isBanned(this.getTags())) return false
    let prerequisites = this.getPrerequisites()

    if (!setup.RestrictionLib.isActorUnitGroupViable(this.getActorUnitGroups())) return false

    if (State.variables.calendar.isOnCooldown(this)) return false

    return setup.RestrictionLib.isPrerequisitesSatisfied(this, prerequisites)
  }

  /**
   * @typedef {{criteria: setup.UnitCriteria, offsetmod?: number}} QuestUnitCriteria
   * @returns {Object<string, QuestUnitCriteria>}
   */
  getUnitCriterias() {
    // Returns {actorname: {criteria: criteria, offsetmod: offsetmod}} object
    let result = {}
    for (let criteria_key in this.unit_criteria_map) {
      let oobj = this.unit_criteria_map[criteria_key]
      let tobj = {
        offsetmod: oobj.offsetmod,
        criteria: oobj.criteria,
      }
      result[criteria_key] = tobj
    }
    // @ts-ignore
    return result
  }

  /**
   * @returns {Array.<string>}
   */
  getAllActorNames() {
    return Object.keys(this.getUnitCriterias()).concat(Object.keys(this.getActorUnitGroups()))
  }

  /**
   * @param {boolean} efficient_mode 
   */
  debugMakeInstance(efficient_mode) {
    let template = this

    // generate actors for this
    let actors = setup.DebugActor.getActors(template.getActorUnitGroups(), efficient_mode)

    // instantiate the quest
    let newquest = new setup.QuestInstance(template, actors)
    return newquest
  }

  /**
   * @param {string} outcome 
   * @param {boolean} [efficient_mode]  Will do optimizations for performance. Useful for bulk testing.
   */
  debugMakeFilledInstance(outcome, efficient_mode) {
    const newquest = this.debugMakeInstance(efficient_mode)

    let assignment = null
    if (!efficient_mode) {
      assignment = setup.QuestAssignHelper.computeAutoAssignment(newquest)
    }

    if (!assignment) {
      // force it
      assignment = {}
      const criterias = newquest.getUnitCriteriasList()
      const all_units = State.variables.company.player.getUnits({}).filter(
        unit => !unit.isEngaged() && !State.variables.leave.isOnLeave(unit)
      )
      setup.rng.shuffleArray(all_units)
      const all_slavers = all_units.filter(unit => unit.isSlaver())
      const all_slaves = all_units.filter(unit => unit.isSlave())
      let j_slaver = 0
      let j_slave = 0
      for (let i = 0; i < criterias.length; ++i) {
        const actorname = criterias[i][0]
        let slave = false
        for (const restriction of criterias[i][1].criteria.getRestrictions()) {
          if (restriction instanceof setup.qresImpl.Job && restriction.job_key == setup.job.slave.key) {
            slave = true
            break
          }
        }

        // get a random unit among your units
        let unit
        if (slave && j_slave < all_slaves.length) {
          unit = all_slaves[j_slave]
          j_slave += 1
        } else if (!slave && j_slaver < all_slavers.length) {
          unit = all_slavers[j_slaver]
          j_slaver += 1
        } else {
          // console.log(`generating new unit for quest ${this.key}`)
          unit = setup.unitpool.subrace_humankingdom_male.generateUnit()
          State.variables.company.player.addUnit(unit, slave ? setup.job.slave : setup.job.slaver)
        }

        // @ts-ignore
        assignment[actorname] = unit.key
      }
    }

    // prevent errors:
    // @ts-ignore
    State.variables.gDebugQuestTest = true
    doFinalize(newquest, assignment)

    // stop preventing errors:
    // @ts-ignore
    State.variables.gDebugQuestTest = false

    newquest.outcome = outcome

    return newquest
  }

  /**
   * @param {string} actor_name 
   * @returns {setup.Job | null}
   */
  getActorResultJob(actor_name) {
    let outcomes = this.getOutcomes()
    for (let i = 0; i < outcomes.length; ++i) {
      let costlist = outcomes[i][1]
      for (let j = 0; j < costlist.length; ++j) {
        let cost = costlist[j]
        if (cost.IS_SLAVE && cost.getActorName() == actor_name) return setup.job.slave
        if (cost.IS_SLAVER && cost.getActorName() == actor_name) return setup.job.slaver
      }
    }
    let roles = this.getUnitCriterias()
    if (actor_name in roles) {
      return roles[actor_name].criteria.getJob()
    }
    return null
  }

  getMainSkills() {
    const sumskills = Array(setup.skill.length).fill(0)
    for (const criteriaobj of Object.values(this.getUnitCriterias())) {
      /**
       * @type {setup.UnitCriteria}
       */
      const criteria = criteriaobj.criteria
      const skills = criteria.getSkillMultis()
      for (let i = 0; i < skills.length; ++i) {
        sumskills[i] += skills[i]
      }
    }

    const sumval = sumskills.reduce((a, b) => a + b, 0)

    const skills = []
    while (skills.length < setup.QUEST_SKILL_SUMMARY) {
      const max_index = sumskills.indexOf(Math.max(...sumskills));
      skills.push(setup.skill[max_index])
      sumskills[max_index] -= (sumval / setup.QUEST_SKILL_SUMMARY)
    }
    skills.sort((a, b) => a.key - b.key)
    return skills
  }

  getSkillSummary() {
    const skills = this.getMainSkills()
    return skills.map(a => a.rep()).join('')
  }

  getCardClass() {
    return setup.TagHelper.getQuestCardClass(this.getTags())
  }

  /**
   * @param {string} outcome 
   * @returns {number}
   */
  computeRecommendedReward(outcome) {
    let base = 0
    for (const criteria of Object.values(this.getUnitCriterias())) {
      const job = criteria.criteria.getJob()
      if (job == setup.job.slaver) {
        base += setup.MONEY_PER_SLAVER_WEEK
      } else if (job == setup.job.slave) {
        base += setup.MONEY_PER_SLAVE_WEEK
      }
    }
    base *= this.weeks
    if (outcome == 'crit') {
      return 2 * base
    } else if (outcome == 'success') {
      return base
    } else {
      throw new Error(`Recommended Reward only for crit and success outcomes, not ${outcome}`)
    }
  }

  /**
   * @param {string} result 
   */
  static resultIndex(result) {
    if (result == 'crit') {
      return 0
    } else if (result == 'success') {
      return 1
    } else if (result == 'failure') {
      return 2
    } else if (result == 'disaster') {
      return 3
    } else {
      throw new Error(`Unrecognized result: ${result}`)
    }
  }

  /**
   * @param {string | AuthorInfo} author 
   * @returns {AuthorInfo}
   */
  static parseAuthorInfo(author) {
    if (setup.isString(author)) {
      return {
        // @ts-ignore
        name: author,
        url: '',
      }
    } else {
      // @ts-ignore
      if (!('name' in author)) throw new Error(`Author Info must have a name!`)
      return author
    }
  }
}
