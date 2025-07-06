// @ts-nocheck


import { doFinalize } from "../../util/questassign"
import { ContentTemplate } from "../content/ContentTemplate"

/**
 * @type {Registry<typeof setup.ActivityTemplate>}
 */
setup.activitytemplate = {}

setup.ActivityTemplate = class ActivityTemplate extends ContentTemplate {
  /**
   * @typedef {{name: string, url: string}} AuthorInfo
   * 
   * @param {{
   * key: string,
   * name: string,
   * author: AuthorInfo,
   * tags: string[],
   * critical_traits: setup.Trait[],
   * disaster_traits: setup.Trait[],
   * actor_unitgroups: Object<string, any>,
   * restrictions: setup.Restriction[],
   * rarity: setup.Rarity,
   * dialogues: Array<DialogueRaw>,
   * room_templates: setup.RoomTemplate[],
   * devtool?: boolean,
   * }} args
   */
  constructor({
    key,
    name,
    author,   // who wrote this quest?
    tags,   // list of tags to filter content. See list of available tags at src/scripts/classes/quest/questtags.js
    actor_unitgroups,  // {actorname: unitgroup.x, actorname: 'x', actorname: [res1, res2]}, unit generated/randomly taken
    // if unitgroup: will be taken from there. if [res1, res2], will be taken from your slavers that satisfy these
    // the first one will be considered the primary actor
    critical_traits,  // units with this traits would prefer this activity, increasing chance
    disaster_traits,  // units with this traits would not prefer this activity, reducing chance
    restrictions,    // list that governs whether quest can be generated or not, if any. E.g., NeedItem(xxx)
    rarity,
    dialogues,
    room_templates,  // list of room templates this can take place in
    devtool,
  }) {
    super(key, name, author, tags, actor_unitgroups, setup.qdiff.normal40)

    // append not on activity on the unit groups
    for (const group of Object.values(this.actor_unitgroup_key_map)) {
      if (group.type == 'companyunit') {
        if (!devtool) {
          group.val.push(
            setup.qres.NotYou(),
            setup.qres.NotOnActivity(),
          )
          if (!setup.Living.isRestrictionsAllowRetired(group.val) &&
            group.val.filter(res => res instanceof setup.qresImpl.IsInjured).length == 0
          ) {
            group.val.push(
              setup.qres.Available(),
            )
          }
        } else {
          group.val = group.val.filter(res =>
            !(res instanceof setup.qresImpl.Home) &&
            !(res instanceof setup.qresImpl.NotYou) &&
            !(res instanceof setup.qresImpl.NotOnActivity) &&
            !(res instanceof setup.qresImpl.Available)
          )
        }
      }
    }

    if (!Array.isArray(this.getPrimaryActorRestrictions())) {
      throw new Error(`First actor for activity ${this.key} must be a company unit!`)
    }

    if (!Object.keys(actor_unitgroups).length) {
      throw new Error(`Activity ${this.key} missing actor!`)
    }
    if (!Array.isArray(Object.values(actor_unitgroups)[0])) {
      throw new Error(`Primary actor for ${this.key} must be a slaver!`)
    }

    /**
     * @type {"activity"}
     */
    const type = "activity"
    this.TYPE = type

    if (!Array.isArray(critical_traits)) {
      throw new Error(`Critical Traits must be an array for Activity ${this.key}`)
    }
    if (!Array.isArray(disaster_traits)) {
      throw new Error(`Critical Traits must be an array for Activity ${this.key}`)
    }
    this.critical_trait_keys = critical_traits.map(trait => trait.key)
    if (this.critical_trait_keys.filter(key => !key).length) {
      throw new Error(`Undefined critical trait for Activity ${this.key}`)
    }
    this.disaster_trait_keys = disaster_traits.map(trait => trait.key)
    if (this.disaster_trait_keys.filter(key => !key).length) {
      throw new Error(`Undefined disaster trait for Activity ${this.key}`)
    }

    this.restrictions = restrictions
    if (!Array.isArray(restrictions)) {
      throw new Error(`Restrictions must be an array for Activity ${this.key}`)
    }

    for (const restriction of restrictions) {
      if (!(restriction instanceof setup.Restriction)) {
        throw new Error(`Restriction ${restriction} isnt' a restriction`)
      }
    }

    this.rarity = rarity
    if (!(rarity instanceof setup.Rarity)) {
      throw new Error(`Rarity for ${this.key} must be a Rarity`)
    }

    this.dialogues = dialogues
    if (!Array.isArray(dialogues)) {
      throw new Error(`Dialogue must be an array`)
    }
    for (let i = 0; i < dialogues.length; ++i) {
      const dialogue = dialogues[i]
      if (Array.isArray(dialogue.texts)) {
        // same text for all.
        const texts_base = dialogue.texts
        dialogue.texts = {
          friendly: texts_base,
          bold: texts_base,
          cool: texts_base,
          witty: texts_base,
          debauched: texts_base,
        }
      } else {
        if (Object.values(dialogue.texts).length != Object.values(setup.speech).length) {
          throw new Error(`Missing speech type in dialogue!`)
        }
        for (const text of Object.keys(dialogue.texts)) {
          if (!(text in setup.speech)) {
            throw new Error(`Missing speech type ${text} in dialogue for Activity ${this.key}`)
          }
        }
        if (!(dialogue.actor in this.actor_unitgroup_key_map)) {
          throw new Error(`Missing dialogue actor ${dialogue.actor} from Activity ${this.key}`)
        }
      }
    }

    if (!Array.isArray(room_templates)) {
      throw new Error(`Room Templates must be an array`)
    }
    for (const room_template of room_templates) {
      if (!(room_template instanceof setup.RoomTemplate)) {
        throw new Error(`Room template ${room_template} isnt' a room_template`)
      }
    }
    this.room_template_keys = room_templates.map(template => template.key)

    if (key in setup.activitytemplate) throw new Error(`Activity Base ${key} already exists`)
    setup.activitytemplate[key] = this
  }

  sanityCheck() {
    if (!this.name) return 'Name cannot be null'

    for (let i = 0; i < this.restrictions.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(this.restrictions[i], { 'a': '' }, this.actor_unitgroup_key_map)) {
        // @ts-ignore
        return `Actor ${this.restrictions[i].actor_name} not found in the ${i}-th quest restriction`
      }
    }

    if (!(Object.keys(this.actor_unitgroup_key_map).length)) {
      return `Must have at least one actor!`
    }
    if (!Array.isArray(Object.values(this.actor_unitgroup_key_map)[0])) {
      return `Primary actor must be a slaver!`
    }
    if (!this.dialogues.length) {
      return `Must have at least one line of dialogue!`
    }

    return null
  }

  rep() { return this.getName() }

  /**
   * @returns {Dialogue[]}
   */
  getDialogues() {
    // @ts-ignore
    return this.dialogues
  }

  /**
   * @returns {Dialogue[]}
   */
  getDialoguesDevTool() {
    const dialogues = setup.deepCopy(this.getDialogues())
    for (const dialogue of dialogues) {
      const texts = dialogue.texts
      const frend_string = JSON.stringify(texts.friendly)
      if (
        (JSON.stringify(texts.bold) == frend_string) &&
        (JSON.stringify(texts.cool) == frend_string) &&
        (JSON.stringify(texts.witty) == frend_string) &&
        (JSON.stringify(texts.debauched) == frend_string)
      ) {
        texts.bold = ['']
        texts.cool = ['']
        texts.witty = ['']
        texts.debauched = ['']
      }
    }
    return dialogues
  }

  makeProperFromDevTool() {
    for (const dialogue of this.getDialogues()) {
      for (const speech of Object.values(setup.speech)) {
        const texts = dialogue.texts[speech.key]
        if (texts.length == 1 && texts[0] == "") {
          dialogue.texts[speech.key] = dialogue.texts.friendly
        }
      }
    }
  }

  getRoomTemplates() {
    return this.room_template_keys.map(key => setup.roomtemplate[key])
  }

  /**
   * @returns {setup.Rarity}
   */
  getRarity() { return this.rarity }

  /**
   * @returns {setup.Restriction[]}
   */
  getPrerequisites() { return this.restrictions }

  /**
   * @returns {setup.Restriction[]}
   */
  getPrimaryActorRestrictions() {
    // @ts-ignore
    return Object.values(this.getActorUnitGroups())[0]
  }

  /**
   * @returns {string}
   */
  getPrimaryActorName() {
    return Object.keys(this.getActorUnitGroups())[0]
  }

  /**
   * @param {setup.Unit} [unit]
   * @return {setup.RoomInstance | null}
   */
  getAvailableRoomIfAny(unit) {
    const room_templates = this.getRoomTemplates()
    for (const template of room_templates) {
      const avail = State.variables.roomlist.getRoomInstances({ template: template })
      setup.rng.shuffleArray(avail)
      for (const test of avail) {
        if (!State.variables.activitylist.getActivityAt(test)) {
          return test
        }
      }
    }
    return null
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanGenerateFor(unit) {
    if (State.variables.settings.isBanned(this.getTags())) return false

    if (State.variables.calendar.isOnCooldown(this)) return false

    const primary_restrictions = this.getPrimaryActorRestrictions()
    if (!setup.RestrictionLib.isUnitSatisfy(unit, primary_restrictions)) {
      return false
    }

    const actor_unit_groups = this.getActorUnitGroups()
    if (!setup.RestrictionLib.isActorUnitGroupViable(actor_unit_groups)) return false

    const restrictions = this.getPrerequisites()
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, restrictions)) {
      return false
    }

    if (!this.getAvailableRoomIfAny(unit)) {
      return false
    }

    return true
  }

  /**
   * @returns {setup.Trait[]}
   */
  getCriticalTraits() {
    return this.critical_trait_keys.map(key => setup.trait[key])
  }

  /**
   * @returns {setup.Trait[]}
   */
  getDisasterTraits() {
    return this.disaster_trait_keys.map(key => setup.trait[key])
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  computeWeight(unit) {
    const crits = this.getCriticalTraits().filter(trait => unit.isHasTraitExact(trait)).length
    const disasters = this.getDisasterTraits().filter(trait => unit.isHasTraitExact(trait)).length
    const crit_mult = setup.ACTIVITY_CHANCE_MULTIPLIER_CRIT_TRAITS
    const disaster_mult = setup.ACTIVITY_CHANCE_MULTIPLIER_DISASTER_TRAITS
    return (crit_mult[Math.min(crits, crit_mult.length - 1)] *
      disaster_mult[Math.min(disasters, disaster_mult.length - 1)])
  }

  /**
   * @returns {Array.<string>}
   */
  getAllActorNames() {
    return Object.keys(this.getActorUnitGroups())
  }

  /**
   * @param {setup.Unit} [unit]
   * @return {setup.ActivityInstance | null}
   */
  makeInstance(unit) {
    const room = this.getAvailableRoomIfAny(unit)
    if (!room) {
      // no room
      return null
    }

    // generate actors for this
    const actor_name_primary = this.getPrimaryActorName()
    /**
     * @type {Object<string, setup.Unit>}
     */
    const default_actors = {}
    if (unit) {
      default_actors[actor_name_primary] = unit
    }

    const actors = setup.QuestPool.instantiateActors(
      this, default_actors)
    if (!actors) {
      // not found
      return null
    }

    return new setup.ActivityInstance(
      this, actors, room
    )
  }

  /**
   * @param {boolean} efficient_mode 
   */
  debugMakeInstance(efficient_mode) {
    State.variables.activitylist.deleteAllActivities()

    // try to make instance normally first
    const instance = this.makeInstance(null)
    if (instance) {
      return instance
    }

    let room = this.getAvailableRoomIfAny(null)
    if (!room) {
      // force it
      room = setup.rng.choice(State.variables.roomlist.getRoomInstances())
    }

    // generate actors for this
    const actors = setup.DebugActor.getActors(this.getActorUnitGroups(), efficient_mode)

    // instantiate the activity
    return new setup.ActivityInstance(
      this, actors, room
    )
  }
}
