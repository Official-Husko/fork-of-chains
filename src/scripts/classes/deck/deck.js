setup.Deck = class Deck extends setup.TwineClass {
  constructor() {
    super()
    /**
     * @type {Array<any>}
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
   * @param {DeckCardInfo[]} objects - Array of objects with rarity and card object.
   * Regenerates the deck by distributing cards into shuffled subdecks based on rarity frequency.
   * Ensures forced rarities are not included and shuffles all subdecks for randomness.
   */
  regenerateDeck(objects) {
    // Use a fixed array for subdecks for performance
    /** @type {any[][]} */
    const subdecks = Array.from({ length: setup.DECK_SUBDECKS }, () => [])
    for (const card of objects) {
      setup.rng.shuffleArray(subdecks)
      const rarity = card.rarity
      if (rarity.isForced()) throw new Error("Forced rarities cannot be made into deck cards!")
      const freq = rarity.getFrequency()
      for (let j = 0; j < freq; ++j) {
        subdecks[j % setup.DECK_SUBDECKS].push(card.object)
      }
    }
    for (const subdeck of subdecks) {
      setup.rng.shuffleArray(subdeck)
    }
    setup.rng.shuffleArray(subdecks)
    // Use reduce for flattening to avoid type issues
    this.cards = subdecks.reduce((acc, val) => acc.concat(val), [])
  }

  /**
   * Draws a card from the deck, removing it from the deck.
   * Throws if the deck is empty.
   * @returns {any} The drawn card object.
   */
  drawCard() {
    if (this.isEmpty()) throw new Error("Cannot draw from an empty deck!")
    return this.cards.pop()
  }

  /**
   * Retrieves a deck by key, creating it if it does not exist.
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
