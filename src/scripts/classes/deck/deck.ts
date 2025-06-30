
// Types for Twine SugarCube v2 global objects (minimal, for this file)
// @ts-ignore
declare const setup: any;
// @ts-ignore
declare const State: any;

// Type for rarity, assuming it has isForced() and getFrequency() methods
// @ts-ignore
interface Rarity {
  isForced(): boolean;
  getFrequency(): number;
}

// Type for DeckCardInfo
interface DeckCardInfo {
  rarity: Rarity;
  object: any;
}

// Deck class definition
// @ts-ignore
setup.Deck = class Deck extends setup.TwineClass {
  cards: any[];

  constructor() {
    super();
    this.cards = [];
  }

  isEmpty(): boolean {
    return !this.cards.length;
  }

  regenerateDeck(objects: DeckCardInfo[]): void {
    const subdecks: any[][] = [];
    // @ts-ignore
    for (let i = 0; i < setup.DECK_SUBDECKS; ++i) subdecks.push([]);

    for (const card of objects) {
      // @ts-ignore
      setup.rng.shuffleArray(subdecks);
      const rarity = card.rarity;
      // @ts-ignore
      if (rarity.isForced()) throw new Error(`Forced rarities cannot be made into deck cards!`);
      // @ts-ignore
      for (let j = 0; j < rarity.getFrequency(); ++j) {
        // @ts-ignore
        subdecks[j % setup.DECK_SUBDECKS].push(card.object);
      }
    }

    for (const subdeck of subdecks) {
      // @ts-ignore
      setup.rng.shuffleArray(subdeck);
    }
    // @ts-ignore
    setup.rng.shuffleArray(subdecks);
    this.cards = ([] as any[]).concat.apply([], subdecks);
  }

  drawCard(): any {
    if (this.isEmpty()) throw new Error(`Cannot draw from an empty deck!`);
    return this.cards.pop();
  }

  static get(key: string): Deck {
    if (!(key in State.variables.deck)) {
      // @ts-ignore
      State.variables.deck[key] = new setup.Deck();
    }
    return State.variables.deck[key];
  }
};
