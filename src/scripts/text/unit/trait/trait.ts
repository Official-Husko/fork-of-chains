import { Subrace } from "../../../classes/trait/Subrace";
import type { Trait } from "../../../classes/trait/Trait";
import type { Unit } from "../../../classes/unit/Unit";

export const TextUnitTrait_Base = {
  adjectiveGoodRandom(unit: Unit): string {
    let rawtraits = unit.getTraits();
    let possible = rawtraits.filter(
      (trait) => trait.text() && trait.text().adjgood,
    );
    if (!possible.length) {
      let goodneutral = ["impartial", "unbiased", "fair"];
      return setup.rng.choice(goodneutral);
    } else {
      let chosen = setup.rng.choice(possible);
      return setup.rng.choice(chosen.text().adjgood!);
    }
  },

  adjectiveBadRandom(unit: Unit): string {
    let rawtraits = unit.getTraits();
    let possible = rawtraits.filter(
      (trait) => trait.text() && trait.text().adjbad,
    );
    if (!possible.length) {
      let badneutral = ["weak-willed", "suicidal"];
      return setup.rng.choice(badneutral);
    } else {
      let chosen = setup.rng.choice(possible);
      return setup.rng.choice(chosen.text().adjbad!);
    }
  },

  adjectiveRandom(unit: Unit, tag?: string): string {
    let rawtraits = [];
    if (tag) {
      rawtraits = unit.getAllTraitsWithTag(tag);
    } else {
      rawtraits = unit.getTraits();
    }

    let possible = [];
    for (let i = 0; i < rawtraits.length; ++i) {
      let trait = rawtraits[i];
      const adjective = trait.repAdjective();
      if (adjective) possible.push(adjective);
    }

    if (!possible.length) return "";
    return setup.rng.choice(possible);
  },

  noun(unit: Unit, trait: Trait): string {
    if (trait.key.startsWith("subrace_")) {
      const subrace = Subrace.fromTrait(trait);
      return subrace.noun;
    }
    return trait.text()?.noun || "";
  },

  description(unit: Unit, trait: Trait): string {
    const text = trait.text();
    if (!text) return "";
    let res: string | undefined;
    if ("descriptionslave" in text && unit.isSlave()) {
      res = text.descriptionslave;
    } else if ("descriptionslaver" in text && unit.isSlaver()) {
      res = text.descriptionslaver;
    } else {
      res = trait.text().description;
    }
    if (!res) return "";
    return setup.Text.replaceUnitMacros(res, { a: unit });
  },

  flavor(unit: Unit, tag: string) {
    const trait = unit.getTraitWithTag(tag);
    if (!trait) {
      return "";
    }
    const text = trait.getTexts();
    let res;
    if ("flavorslave" in text && unit.isSlave()) {
      res = text.flavorslave;
    } else if ("flavorslaver" in text && unit.isSlaver()) {
      res = text.flavorslaver;
    } else {
      res = trait.getTexts().flavor;
    }
    if (!res) return "";
    return setup.Text.replaceUnitMacros(res, { a: unit });
  },

  skinAdjective(unit: Unit, skin_tag: string) {
    let skin_trait = unit.getTraitWithTag(skin_tag);
    if (skin_trait) return skin_trait.repSizeAdjective();

    // if (skin_tag == 'eyes') return 'normal'
    // if (skin_tag == 'ears') return 'normal'
    // if (skin_tag == 'mouth') return 'normal'
    if (skin_tag == "legs") return "humanoid";
    if (skin_tag == "arms") return "humanoid";
    // if (skin_tag == 'body') return 'human'
    // if (skin_tag == 'dickshape') return 'human-like'
    return "";
  },

  muscular(unit: Unit): string {
    let muscle_trait = unit.getTraitWithTag("muscle");
    if (muscle_trait) return muscle_trait.repSizeAdjective();
    return "";
  },

  race(unit: Unit): string {
    return setup.Text.Unit.Trait.noun(unit, unit.getSubrace()) ?? "";
  },

  homeland(unit: Unit): string {
    return unit.getHomeland();
  },

  /**
   * Describes the ENTIRE unit's traits with a certain tag.
   */
  describeAll(unit: Unit, tag: string): string {
    // first gather the texts.
    let texts = [];
    let pertraits = unit.getAllTraitsWithTag(tag);
    for (let i = 0; i < pertraits.length; ++i) {
      let trait = pertraits[i];
      texts.push(setup.Text.Unit.Trait.description(unit, trait));
    }
    if (!texts.length) {
      return "";
    }

    let connectors = [`a|Rep `, `a|They also `, `In addition, a|they `];

    let text = "";
    for (let i = 0; i < texts.length; ++i) {
      if (i % 3 == 0) {
        if (i) text += ". ";
        text += connectors[Math.floor(i / 3) % 3];
      } else {
        // find the connector
        if (i % 3 == 1 && i + 1 < texts.length) {
          text += ", ";
        } else {
          text += ", and ";
        }
      }
      text += texts[i];
    }
    text += ".";

    return setup.Text.replaceUnitMacros(text, { a: unit });
  },
};
