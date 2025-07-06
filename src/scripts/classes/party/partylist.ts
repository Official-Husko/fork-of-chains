// @ts-nocheck

// assigned to $partylist
setup.PartyList = class PartyList extends setup.TwineClass {
  constructor() {
    super()
      
    this.party_keys = []
  }

  /**
   * @returns {setup.Party}
   */
  newParty() {
    const party = new setup.Party()
    this.party_keys.push(party.key)
    return party
  }

  /**
   * @param {setup.Party} party 
   */
  removeParty(party) {
    if (!this.party_keys.includes(party.key)) throw new Error(`Party ${party.getName()} not in partylist`)
    this.party_keys = this.party_keys.filter(party_key => party_key != party.key)
    party.delete()
  }

  /**
   * @returns {setup.Party[]}
   */
  getParties() {
    return this.party_keys.map(key => State.variables.party[key])
  }

  isCanAddNewParty() {
    return this.getParties().length < setup.PARTY_MAX
  }
}
