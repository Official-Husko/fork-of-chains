// @ts-nocheck

setup.Party = class Party extends setup.TwineClass {
  constructor() {
    super()

    this.key = State.variables.Party_keygen
    State.variables.Party_keygen += 1

    /**
     * @type {string}
     */
    this.name = `Party ${this.key}`

    /**
     * @type {Array<string | number>}
     */
    this.unit_keys = []

    this.is_cannot_go_on_quests_auto = false

    if (this.key in State.variables.party) throw new Error(`Party ${this.key} duplicated`)
    State.variables.party[this.key] = this
  }

  delete() {
    delete State.variables.party[this.key]
  }

  rep() {
    return setup.repMessage(this, 'partycardkey')
  }

  /**
   * @returns {string]}
   */
  getName() {
    return this.name
  }

  /**
   * @param {string} name 
   */
  setName(name) {
    this.name = name
  }

  /**
   * @param {setup.Unit} unit 
   */
  addUnit(unit) {
    if (unit.getParty()) throw new Error(`${unit.name} already in party ${unit.party_key}`)
    this.unit_keys.push(unit.key)
    unit.party_key = this.key
    setup.notify(`${unit.rep()} is added to ${this.rep()}`)
  }

  /**
   * @param {setup.Unit} unit 
   */
  removeUnit(unit) {
    if (!this.unit_keys.includes(unit.key)) throw new Error(`${unit.name} not in this party`)
    if (unit.party_key != this.key) throw new Error(`${unit.name} party key is incorrect and cannot be removed`)
    this.unit_keys = this.unit_keys.filter(unit_key => unit_key != unit.key)
    unit.party_key = null
    setup.notify(`${unit.rep()} is removed from ${this.rep()}`)
  }

  /**
   * @returns {Array.<setup.Unit>}
   */
  getUnits() {
    return this.unit_keys.map(key => State.variables.unit[key])
  }

  /**
   * @returns {boolean}
   */
  isCanDisband() {
    return !(this.getUnits().length)
  }

  /**
   * @returns {boolean}
   */
  isCanGoOnQuestsAuto() {
    return !this.is_cannot_go_on_quests_auto
  }

  toggleIsCanGoOnQuestsAuto() {
    this.is_cannot_go_on_quests_auto = !this.is_cannot_go_on_quests_auto
  }

  /**
   * @param {setup.Party | null} party1 
   * @param {setup.Party | null} party2 
   */
  static Cmp(party1, party2) {
    if (party1 == party2) return 0
    if (!party1) return 1
    if (!party2) return -1
    return party1.getName().localeCompare(party2.getName())
  }
}
