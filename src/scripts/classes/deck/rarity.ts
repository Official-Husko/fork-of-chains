
import { IMPORTABLE } from "../../constants";

declare const setup: any;
declare const State: any;

// RarityArgs type for constructor
interface RarityArgs {
  key: string;
  name: string;
  description: string;
  frequency?: number;
  is_forced?: boolean;
}

setup.rarity = {};

export class Rarity extends setup.TwineClass {
  key: string;
  name: string;
  description: string;
  frequency?: number;
  is_forced?: boolean;

  constructor({ key, name, description, frequency, is_forced }: RarityArgs) {
    super();
    if (!key) throw new Error(`null key for rarity`);
    this.key = key;
    if (!name) throw new Error(`null name for rarity ${key}`);
    this.name = name;
    this.description = description;
    this.frequency = frequency;
    this.is_forced = is_forced;
  }

  getName(): string { return this.name; }
  getDescription(): string { return this.description; }
  text(): string { return `setup.rarity.${this.key}`; }
  getIconTriangleClass(): string { return `rarity-${this.key}`; }
  getTextColorClass(): string { return `text-rarity-${this.key}`; }
  getBorderColorClass(): string { return `border-rarity-${this.key}`; }
  getImage(): string { return `img/rarity/${this.key}.svg`; }
  getImageRep(): string {
    const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage()))}" />`;
    return `<span class='trait' data-tooltip="${this.getName()}">${img}</span>`;
  }
  rep(): string { return this.getImageRep(); }
  getFrequency(): number { return this.frequency!; }
  isForced(): boolean { return !!this.is_forced; }

  static getRandomRarityOrderWeighted(): Rarity[] {
    const rarities: Rarity[] = Object.values(setup.rarity).filter(
      // @ts-ignore
      (rarity: Rarity) => !rarity.isForced() && rarity.getFrequency()
    );
    rarities.sort((a, b) => b.getFrequency() - a.getFrequency());
    const max_frequency = setup.rarity.rare.getFrequency();
    const rarity_sampled = setup.rng.sampleArray(
      rarities.map(rarity => [rarity, Math.min(max_frequency, rarity.getFrequency())]), true
    );
    rarities.splice(rarities.indexOf(rarity_sampled));
    // @ts-ignore
    return Object.values(setup.rarity).filter((rarity: Rarity) => rarity.isForced()).concat(rarities);
  }

  static RarityCmp(rarity1: Rarity, rarity2: Rarity): number {
    const idx1 = Object.keys(setup.rarity).indexOf(rarity1.key);
    const idx2 = Object.keys(setup.rarity).indexOf(rarity2.key);
    return idx1 - idx2;
  }
}

setup.Rarity = Rarity;

setup.rarity.always = new setup.Rarity({
  key: 'always',
  name: 'Always',
  description: `Will triggered/scouted whenever possible`,
  is_forced: true,
});

setup.rarity.common = new setup.Rarity({
  key: 'common',
  name: 'Common',
  description: `1 every 2 quests/events`,
  frequency: setup.RARITY_COMMON_FREQUENCY
});

setup.rarity.uncommon = new setup.Rarity({
  key: 'uncommon',
  name: 'Uncommon',
  description: `1 every 4 quests/events`,
  frequency: setup.RARITY_UNCOMMON_FREQUENCY
});

setup.rarity.rare = new setup.Rarity({
  key: 'rare',
  name: 'Rare',
  description: `1 every 8 quests/events`,
  frequency: setup.RARITY_RARE_FREQUENCY
});

setup.rarity.epic = new setup.Rarity({
  key: 'epic',
  name: 'Epic',
  description: `1 every 16 quests/events`,
  frequency: setup.RARITY_EPIC_FREQUENCY
});

setup.rarity.legendary = new setup.Rarity({
  key: 'legendary',
  name: 'Legendary',
  description: `1 every 32 quests/events`,
  frequency: setup.RARITY_LEGENDARY_FREQUENCY
});

setup.rarity.never = new setup.Rarity({
  key: 'never',
  name: 'Never',
  description: `Never gets scouted/triggered`,
  frequency: setup.RARITY_NEVER_FREQUENCY
});
