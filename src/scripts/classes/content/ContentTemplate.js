export class ContentTemplate extends setup.TwineClass {
  /**
   * @typedef {{name: string, url: string}} AuthorInfo
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {string | AuthorInfo} author 
   * @param {string[]} tags 
   * @param {Object<string, any>} actor_unitgroups 
   * @param {setup.QuestDifficulty} difficulty 
   */
  constructor(
    key,
    name,
    author,   // who wrote this quest?
    tags,   // list of tags to filter content. See list of available tags at src/scripts/classes/quest/questtags.js
    actor_unitgroups,  // {actorname: unitgroup.x, actorname: 'x', actorname: [res1, res2]}, unit generated/randomly taken
    // if unitgroup: will be taken from there. if [res1, res2], will be taken from your slavers that satisfy these
    difficulty,
  ) {
    super()

    /**
     * @type {'event' | 'quest' | 'opportunity' | 'activity' | 'interaction'}
     */
    this.TYPE = null  // will be filled by its child

    if (!key) throw new Error(`quest key cannot be null`)
    this.key = key

    if (name === null || name === undefined) throw new Error(`Name of quest ${key} cannot be null`)
    this.name = name

    this.author = setup.QuestTemplate.parseAuthorInfo(author)

    if (!Array.isArray(tags)) throw new Error(`Tags of quest ${key} must be an array. E.g., ['transformation']. Put [] for no tags.`)
    this.tags = tags

    this.tags.sort((a, b) => {
      const idxa = Object.keys(setup.QUESTTAGS).indexOf(a)
      const idxb = Object.keys(setup.QUESTTAGS).indexOf(b)
      return idxa - idxb
    })

    for (let i = 0; i < tags.length; ++i) {
      if (!(tags[i] in setup.QUESTTAGS)) {
        throw new Error(`${i}-th tag (${tags[i]}) of quest ${key} not recognized. Please check spelling and compare with the tags in src/scripts/classes/quest/questtags.js`)
      }
    }

    /**
     * @type {Object<string, {type: string, val?: *, key?: string}>}
     */
    this.actor_unitgroup_key_map
    if (actor_unitgroups) {
      this.actor_unitgroup_key_map = setup.ActorHelper.parseMap(actor_unitgroups)
    } else {
      this.actor_unitgroup_key_map = {}
    }

    this.difficulty = difficulty
  }

  // will be over-ridden
  getTemplate() { return null }
  getAuthor() { return this.author }
  getTags() { return this.tags }

  /**
   * @returns {setup.QuestDifficulty}
   */
  getDifficulty() {
    return this.difficulty
  }

  getName() { return this.name }

  /**
   * @returns {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]>}
   */
  getActorUnitGroups() {
    return setup.ActorHelper.parseUnitGroups(this.actor_unitgroup_key_map)
  }

  /**
   * Return the subraces that are directly involved in this quest.
   * @returns {setup.Trait[]}
   */
  getActorSubraces() {
    const subraces = setup.TraitHelper.getAllTraitsOfTags(['subrace'])
    const unit_groups = this.getActorUnitGroups()
    const found = {}
    for (const group of Object.values(unit_groups)) {
      if (group instanceof setup.UnitGroup) {
        const pools_objs = group.getUnitPools()
        const races = {}
        for (const pool_obj of pools_objs) {
          /**
           * @type {setup.UnitPool}
           */
          const pool = pool_obj[0]
          // figure out the race.
          let subrace = null
          for (const subrace_test of subraces) {
            if (pool.key.startsWith(subrace_test.key)) {
              subrace = subrace_test
              break
            }
          }
          if (subrace) {
            races[subrace.key] = true
          }
        }
        if (Object.keys(races).length == 1) {
          found[Object.keys(races)[0]] = true
        }
      }
    }

    return Object.keys(found).map(key => setup.trait[key])
  }

  /**
   * @param {string} actor_name 
   * @returns {setup.Job | null}
   */
  getActorResultJob(actor_name) {
    // to be implemented in each subclass
    return null
  }

}
