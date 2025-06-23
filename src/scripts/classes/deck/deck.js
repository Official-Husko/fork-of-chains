setup.Deck = class Deck extends setup.TwineClass {
  constructor() {
    super()
    
    /**
     * @type {Array}
     */
    this.cards = []
  }

  /**
   * @returns {boolean}
   */
  isEmpty() { return !this.cards.length }

  /**
   * @typedef {{rarity: setup.Rarity, object: any}} DeckCardInfo
   * 
   * @param {DeckCardInfo[]} objects
   */
  regenerateDeck(objects) {
    const subdecks = []
    for (let i = 0; i < setup.DECK_SUBDECKS; ++i) subdecks.push([])

    for (const card of objects) {
      setup.rng.shuffleArray(subdecks)
      const rarity = card.rarity
      if (rarity.isForced()) throw new Error(`Forced rarities cannot be made into deck cards!`)
      for (let j = 0; j < rarity.getFrequency(); ++j) {
        subdecks[j % setup.DECK_SUBDECKS].push(card.object)
      }
    }

    for (const subdeck of subdecks) {
      setup.rng.shuffleArray(subdeck)
    }
    setup.rng.shuffleArray(subdecks)
    this.cards = [].concat.apply([], subdecks)
  }

  /**
   * @returns {any}
   */
  drawCard() {
    if (this.isEmpty()) throw new Error(`Cannot draw from an empty deck!`)
    return this.cards.pop()
  }

  /**
   * @param {string} key 
   * @returns {setup.Deck}
   */
  static get(key) {
    if (!(key in State.variables.deck)) {
      State.variables.deck[key] = new Deck()
    }
    return State.variables.deck[key]
  }
}
