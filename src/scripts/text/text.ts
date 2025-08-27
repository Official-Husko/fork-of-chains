import type { Trait, TraitTexts } from "../classes/trait/Trait";
import type { Unit } from "../classes/unit/Unit";
import { DOM } from "../dom/DOM";
import { TextDuty } from "./duty";
import { TextRace } from "./race";
import { TOPIC_NOUN } from "./raw/banter/topic";
import { TextBanter } from "./sentence/banter";
import { TextBuilding } from "./sentence/building";
import { TextDirty } from "./sentence/dirty";
import { TextGagged } from "./sentence/gagged";
import { TextGreeting } from "./sentence/greeting";
import { TextHobby } from "./sentence/hobby";
import { TextInsult } from "./sentence/insult";
import { TextPet } from "./sentence/pet";
import { TextPraise } from "./sentence/praise";
import { TextPunish } from "./sentence/punish";
import { TextRescue } from "./sentence/rescue";
import { TextSlave } from "./sentence/slave";
import { TextStrip } from "./sentence/strip";
import { TextUnit_background } from "./unit/background";
import { TextUnitEquipment } from "./unit/equipment/equipment";
import { TextUnitBodyswap } from "./unit/trait/bodyswap";
import { TextUnitTrait_Furniture } from "./unit/trait/furniture";
import { TextUnitTrait_Physical } from "./unit/trait/physical";
import { TextUnitTrait_Base } from "./unit/trait/trait";
import { TextUnit_genital } from "./unit/unit";

export namespace Text {
  export namespace Unit {
    export const Trait = {
      ...TextUnitTrait_Base,
      ...TextUnitTrait_Furniture,
      ...TextUnitTrait_Physical,
    };
    export const Bodyswap = TextUnitBodyswap;
    export const Equipment = TextUnitEquipment;
    export const background = TextUnit_background;
    export const genital = TextUnit_genital;
  }

  export const Race = TextRace;
  export const Banter = TextBanter;
  export const Dirty = TextDirty;
  export const Gagged = TextGagged;
  export const Greeting = TextGreeting;
  export const Hobby = TextHobby;
  export const Insult = TextInsult;
  export const Pet = TextPet;
  export const Praise = TextPraise;
  export const Punish = TextPunish;
  export const Rescue = TextRescue;
  export const Slave = TextSlave;
  export const Strip = TextStrip;
  export const Duty = TextDuty;
  export const Building = TextBuilding;

  /** @depracted kept for backwards compatibility */
  export const genital = TextUnit_genital;

  /** Get a random noun */
  export function topicnoun() {
    return setup.rng.choice(TOPIC_NOUN);
  }

  /**
   * Replaces a macro with the units variant. E.g., a|their with {a: unit} becomes <<their "unit.key">>
   * BE CAREFUL NOT TO INCLUDE LARGE THINGS LIKE IMAGE GLOB (especially on itch.io build)
   *
   * @param unit_map if not provided, will use the variables in `$g`
   */
  export function replaceUnitMacros(
    raw_text: string | string[] | null | undefined,
    unit_map?: ActorUnitMap,
  ): string {
    if (!raw_text) return "";

    let text: string;
    if (Array.isArray(raw_text)) {
      if (!raw_text.length) return "";
      text = setup.rng.choice(raw_text);
    } else {
      text = raw_text;
    }
    return text.replace(
      /([\w]{1,20})\|([\w]{1,20})/g,
      (match: any, unitname: string, unitverb: string) => {
        let unit = null;
        if (unit_map) {
          unit = unit_map[unitname];
        } else if (State.variables.g) {
          // U is a special case
          if (unitname == "U") {
            unit = State.variables.unit.player;
          } else {
            unit = State.variables.g[unitname];
          }
        }
        if (!unit || !(unit instanceof setup.Unit)) {
          console.warn(`Missing unit ${unitname}`);
          return `${unitname}|${unitverb}`;
        }

        if (unitverb == "Rep" || unitverb == "rep") {
          if (unit.isYou()) {
            if (unitverb == "Rep") {
              return "You";
            } else {
              return "you";
            }
          }
          return unit.rep();
        }

        if (unitverb == "name") {
          return unit.getName();
        }

        if (unitverb == "Reps" || unitverb == "reps") {
          if (unit.isYou()) {
            if (unitverb == "Reps") {
              return "Your";
            } else {
              return "your";
            }
          }
          return `${unit.rep()}'s`;
        }

        if (unitverb in DOM.PronounYou) {
          return DOM.PronounYou[unitverb](unit);
        }

        if (unitverb in REPLACE_MACROS) {
          let idx = 0;
          if (!unit.isYou()) {
            idx = 1;
          }
          return REPLACE_MACROS[unitverb as keyof typeof REPLACE_MACROS][idx];
        }

        const uverb = `u${unitverb}`;
        if (Macro.has(uverb)) {
          // it's a bodypart macro, yikes.
          return setup.runSugarCubeCommandAndGetOutput(
            `<<${uverb} "${unit.key}">>`,
          );
        }

        if (unit.isYou()) return unitverb;
        if (unitverb.length == 1) return unitverb;

        const lowcase = unitverb.toLowerCase();

        // otherwise convert to present tense
        if (lowcase.endsWith("y")) {
          const lp = lowcase[unitverb.length - 2];
          if (!["a", "e", "i", "o", "u"].includes(lp)) {
            // sigh, special form time.
            const trm = unitverb[unitverb.length - 1];
            let base = unitverb.substr(0, unitverb.length - 1);
            if (trm.toLowerCase() == trm) {
              base += "ies";
            } else {
              base += "IES";
            }
            return base;
          }
        }

        for (const ending of Object.keys(END_REPLACE) as Array<
          keyof typeof END_REPLACE
        >) {
          if (unitverb.endsWith(ending)) {
            return unitverb + END_REPLACE[ending];
          }
        }

        if (
          unitverb[unitverb.length - 1].toLowerCase() ==
          unitverb[unitverb.length - 1]
        ) {
          return unitverb + "s";
        } else {
          return unitverb + "S";
        }
      },
    );
  }

  const END_REPLACE = {
    ch: "es",
    CH: "ES",
    sh: "es",
    SH: "ES",
    s: "es",
    S: "ES",
    x: "es",
    X: "es",
    z: "es",
    Z: "ES",
  };

  const REPLACE_MACROS = {
    is: ["are", "is"],
    are: ["are", "is"],
    am: ["are", "is"],
    was: ["were", "was"],
    were: ["were", "was"],
    do: ["do", "does"],
    go: ["go", "goes"],
    have: ["have", "has"],
    has: ["have", "has"],
  };

  /**
   * Given strings, make it into: "a, b, and c"
   */
  export function addCommas(strings: string[]): string {
    let result = "";
    const n = strings.length;
    for (let i = 0; i < n; ++i) {
      result += strings[i];
      if (i == 0 && n == 2) {
        result += " and ";
      } else {
        if (n >= 3 && i < n - 1) {
          result += ", ";
        }
        if (i == n - 2) {
          result += "and ";
        }
      }
    }
    return result;
  }

  /**
   * Replaces a macro with the rep variant. E.g., a|rep with {a: furniture} becomes <<rep furniture>>.
   */
  export function replaceRepMacros(
    raw_text: string | string[],
    object_map: Record<string, any>,
  ): string {
    if (!raw_text) return "";

    let text: string;
    if (Array.isArray(raw_text)) {
      if (!raw_text.length) return "";
      text = setup.rng.choice(raw_text);
    } else {
      text = raw_text;
    }

    return text.replace(
      /([\w]{1,20})\|([\w]{1,20})/g,
      (match, unitname: string, unitverb: string) => {
        const obj = object_map[unitname];
        if (!obj) {
          console.warn(`Missing object ${unitname}`);
          return `${unitname}|${unitverb}`;
        }

        if (unitverb == "Rep" || unitverb == "rep") {
          return obj.rep();
        }

        return `${unitname}|${unitverb}`;
      },
    );
  }

  /**
   * Fix all occurrences of articles to the proper form in a sentence.
   * The ending is the next sentence after this.
   */
  export function fixArticles(text: string, ending: string): string {
    const splitted = text.match(/\b(\w+\W*)/g);
    if (!splitted) return text;

    for (let i = splitted.length - 1; i >= 0; --i) {
      const word_raw = splitted[i];
      const word_parsed = word_raw.match(/\b(\w+)\b/g)![0];
      if (["a", "A", "an", "An"].includes(word_parsed)) {
        let next;
        if (i == splitted.length - 1) {
          next = ending || "";
          const next_raw_match = next.match(/\b(\w+)\b/g);
          if (next_raw_match) {
            next = next_raw_match[0] || "";
          } else {
            next = "";
          }
        } else {
          next = splitted[i + 1].match(/\b(\w+)\b/g)?.[0] || "";
        }
        let article = setup.ArticleOnly(next) || "a";
        if (word_parsed[0] == "A") {
          article = article.toUpperFirst();
        }
        splitted[i] = word_raw.replace(/\b(\w+)\b/g, article);
      }
    }

    let i = 0;
    return text.replace(/\b(\w+\W+)/g, () => {
      i += 1;
      return splitted[i - 1];
    });
  }
}

type TraitTextsStringArrayKey = Exclude<
  {
    [k in keyof TraitTexts]: TraitTexts[k] extends string[] | undefined
      ? k
      : never;
  }[keyof TraitTexts],
  undefined
>;

export function unit_trait_texts({
  unit,
  field,
  trait,
}: {
  unit: Unit;
  field: TraitTextsStringArrayKey;
  trait?: Trait;
}): string {
  let candidates: string[] | undefined;
  if (trait) {
    candidates = trait.getTexts()[field];
    if (!candidates || !candidates.length)
      throw new Error(
        `Trait ${trait.key} does not have a ${field} associated with it!`,
      );
  } else {
    candidates = setup.TRAIT_TEXTS_DEFAULT[field] || [];
    const traits = unit.getTraits();
    for (const trait of traits) {
      const text = trait.getTexts();
      if (text) {
        candidates = candidates.concat(text[field] || []);
      }
    }
  }
  return Text.replaceUnitMacros(candidates, { a: unit });
}
