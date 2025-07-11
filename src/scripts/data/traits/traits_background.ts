import type { TraitOrGroupDefinitions } from "../../classes/trait/Trait";
import { Constants } from "../../constants";

export default {
  /* ####################### */
  /* UNICORN    TOTAL: 0.25  */
  /* ####################### */

  /* COMBAT */
  bg_royal: {
    name: "royal",
    description: "Born to rule",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {
      combat: 0.12,
      aid: 0.12,
      social: 0.12,
      intrigue: 0.12,
      arcane: -0.23,
    },
    tags: ["bg", "unicorn", "rich"],
  },

  /* INTRIGUE */
  bg_boss: {
    name: "boss",
    description: "A royalty in the criminal underworld",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {
      survival: 0.12,
      intrigue: 0.12,
      slaving: 0.12,
      knowledge: 0.12,
      social: -0.23,
    },
    tags: ["bg", "unicorn", "rich"],
  },

  /* KNOWLEDGE */
  bg_mythical: {
    name: "mythical",
    description: "Revered as god by some",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {
      arcane: 0.12,
      knowledge: 0.12,
      aid: 0.12,
      social: 0.12,
      sex: -0.23,
    },
    tags: ["bg", "unicorn", "rich"],
  },

  /* SPECIAL */
  bg_mist: {
    name: "mistwalker",
    description: "Travel frequently between this world and the next",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {
      arcane: 0.12,
      slaving: 0.12,
      sex: 0.12,
      brawn: 0.12,
      aid: -0.23,
    },
    tags: ["bg", "unicorn", "rich"],
  },

  /* ################################## */
  /* RARE    Sums to 0.15 but minmaxed  */
  /* ################################## */

  /* COMBAT */
  bg_knight: {
    name: "knight",
    description: "In service to a lord",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { combat: 0.3, aid: 0.1, sex: -0.25 },
    tags: ["bg", "rare"],
  },

  bg_adventurer: {
    name: "adventurer",
    description: "Travels the land seeking greater adventure",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      combat: 0.1,
      knowledge: 0.1,
      aid: 0.1,
      survival: 0.1,
      slaving: -0.25,
    },
    tags: ["bg", "rare"],
  },

  /* BRAWN */
  bg_metalworker: {
    name: "metalworker",
    description: "Temper metal for a living",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { brawn: 0.3, slaving: 0.1, intrigue: -0.25 },
    tags: ["bg", "rare"],
  },

  /* SURVIVAL */
  bg_wildman: {
    name: "wildman",
    description: "Living off the bounty of nature",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { survival: 0.3, brawn: 0.1, social: -0.25 },
    tags: ["bg", "rare"],
  },

  /* INTRIGUE */
  bg_assassin: {
    name: "assassin",
    description: "Preys on the weakness of other men",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { intrigue: 0.3, combat: 0.1, aid: -0.25 },
    tags: ["bg", "rare"],
  },

  /* SLAVING*/
  bg_engineer: {
    name: "engineer",
    description: "Invents and familiar with the workings of machineries",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { slaving: 0.3, knowledge: 0.1, arcane: -0.25 },
    tags: ["bg", "rare"],
  },

  /* KNOWLEDGE */
  bg_scholar: {
    name: "scholar",
    description: "A walking encyclopedia",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { knowledge: 0.3, aid: 0.1, brawn: -0.25 },
    tags: ["bg", "rare"],
  },

  /* SOCIAL */
  bg_noble: {
    name: "noble",
    description:
      "Nobles receive the best educations on the land as well as some martial training",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { social: 0.3, combat: 0.1, slaving: -0.25 },
    tags: ["bg", "rare", "rich"],
  },

  /* AID */
  bg_healer: {
    name: "healer",
    description: "Heals the wounds of others",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { aid: 0.3, arcane: 0.1, combat: -0.25 },
    tags: ["bg", "rare"],
  },

  /* ARCANE */
  bg_mystic: {
    name: "mystic",
    description: "Studies subjects of this world and beyond",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { arcane: 0.3, knowledge: 0.1, survival: -0.25 },
    tags: ["bg", "rare"],
  },

  /* SEX */
  bg_courtesan: {
    name: "courtesan",
    description: "Master of the bedroom arts",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: { sex: 0.3, arcane: 0.1, knowledge: -0.25 },
    tags: ["bg", "rare"],
  },

  /* ############################# */
  /* UNCOMMON: 0.15 sum            */
  /* ############################# */

  /* COMBAT */
  bg_mercenary: {
    name: "mercenary",
    description: "Mercenaries travel the land in search of bloody work",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { combat: 0.15 },
    tags: ["bg", "medium"],
  },

  /* BRAWN */
  bg_monk: {
    name: "monk",
    description: "Hones the body and the mind... but mostly the body",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { brawn: 0.15 },
    tags: ["bg", "medium"],
  },

  /* SURVIVAL */
  bg_hunter: {
    name: "hunter",
    description: "Hunting game for a living",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { survival: 0.15 },
    tags: ["bg", "medium"],
  },

  /* INTRIGUE */
  bg_informer: {
    name: "informer",
    description: "Information has a price",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { intrigue: 0.15 },
    tags: ["bg", "medium"],
  },

  /* SLAVING */
  bg_slaver: {
    name: "slaver",
    description: "Handles the right side of the whip",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { slaving: 0.15 },
    tags: ["bg", "medium"],
  },

  /* KNOWLEDGE */
  bg_artisan: {
    name: "crafter",
    description: "Have a dextrous set of hands",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { knowledge: 0.15 },
    tags: ["bg", "medium"],
  },

  /* SOCIAL */
  bg_wiseman: {
    name: "wiseman",
    description: "Advises the less wise",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { social: 0.15 },
    tags: ["bg", "medium"],
  },

  /* AID */
  bg_priest: {
    name: "priest",
    description: "Devout to the gods",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { aid: 0.15 },
    tags: ["bg", "medium"],
  },

  /* ARCANE */
  bg_apprentice: {
    name: "apprentice",
    description: "May master the magical arts one day",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { arcane: 0.15 },
    tags: ["bg", "medium"],
  },

  /* SEX */
  bg_artist: {
    name: "artist",
    description: "For what is a world without art?",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { sex: 0.15 },
    tags: ["bg", "medium"],
  },

  /* ################## */
  /* COMMON: 0.1 sum    */
  /* ################## */

  /* COMBAT */
  bg_soldier: {
    name: "soldier",
    description: "Part of a standing army",
    slave_value: 0,
    skill_bonuses: { combat: 0.1 },
    tags: ["bg", "common"],
  },

  bg_pirate: {
    name: "pirate",
    description: "Plunder and booty",
    slave_value: 0,
    skill_bonuses: { combat: 0.05, sex: 0.05 },
    tags: ["bg", "common"],
  },

  /* BRAWN */
  bg_laborer: {
    name: "laborer",
    description: "Used to hard physical labor",
    slave_value: 0,
    skill_bonuses: { brawn: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  bg_woodsman: {
    name: "woodsman",
    description: "Lives from the bounty of the forests",
    slave_value: 0,
    skill_bonuses: { brawn: 0.05, survival: 0.05 },
    tags: ["bg", "common"],
  },

  bg_thug: {
    name: "thug",
    description: "Roughs up people",
    slave_value: 0,
    skill_bonuses: { brawn: 0.05, slaving: 0.05 },
    tags: ["bg", "common", "poor"],
  },

  bg_seaman: {
    name: "seaman",
    description: "Lives off the bounties of the sea",
    slave_value: 0,
    skill_bonuses: { brawn: 0.05, sex: 0.05 },
    tags: ["bg", "common"],
  },

  /* SURVIVAL */
  bg_nomad: {
    name: "nomad",
    description: "No place to call a home",
    slave_value: 0,
    skill_bonuses: { survival: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  /* INTRIGUE */
  bg_thief: {
    name: "thief",
    description: "Lightens the load without anybody noticing",
    slave_value: 0,
    skill_bonuses: { intrigue: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  bg_maid: {
    name: "housekeeper",
    description: "The heart of the house",
    slave_value: 0,
    skill_bonuses: { intrigue: 0.05, aid: 0.05 },
    tags: ["bg", "common"],
  },

  /* SLAVING */
  bg_raider: {
    name: "raider",
    description: "Profits off the misery of others",
    slave_value: 0,
    skill_bonuses: { slaving: 0.1 },
    tags: ["bg", "common"],
  },

  /* KNOWLEDGE */
  bg_clerk: {
    name: "clerk",
    description: "Dealing with red tape since ancient times",
    slave_value: 0,
    skill_bonuses: { knowledge: 0.1 },
    tags: ["bg", "common"],
  },

  bg_merchant: {
    name: "trader",
    description: "Maximizing profit",
    slave_value: 0,
    skill_bonuses: { social: 0.05, knowledge: 0.05 },
    tags: ["bg", "common"],
  },

  bg_farmer: {
    name: "farmer",
    description:
      "Growing up on the fields and accustomed to both hard work and animal breeding",
    slave_value: 0,
    skill_bonuses: { knowledge: 0.05, sex: 0.05 },
    tags: ["bg", "common", "poor"],
  },

  /* SOCIAL */
  bg_entertainer: {
    name: "entertainer",
    description: "Giving others joy",
    slave_value: 0,
    skill_bonuses: { social: 0.1 },
    tags: ["bg", "common"],
  },

  /* AID */
  bg_foodworker: {
    name: "food worker",
    description: "Feeds the world",
    slave_value: 0,
    skill_bonuses: { aid: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  /* ARCANE */

  /* SEX */
  bg_whore: {
    name: "whore",
    description: "Sells their body for a living",
    slave_value: 0,
    skill_bonuses: { sex: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  /* #################################### */
  /* NEGATIVE Sums to 0.0 but minmaxed    */
  /* #################################### */

  bg_unemployed: {
    name: "unemployed",
    description: "Does not have a living",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: { intrigue: 0.1, survival: 0.1, brawn: -0.1, combat: -0.1 },
    tags: ["bg", "common", "poor"],
  },

  bg_slave: {
    name: "slave",
    description:
      "Grow up as a slave and dangerously familiar with the workings of the whip",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: { knowledge: -0.1, social: -0.1, brawn: 0.1, slaving: 0.1 },
    tags: ["bg", "common", "poor"],
  },

  bg_pet: {
    name: "pet",
    description:
      "Pampered and trained as a companion or plaything, especially for dominant races.",
    slave_value: Constants.MONEY_TRAIT_RARE,
    skill_bonuses: { social: 0.1, sex: 0.1, aid: 0.05, combat: -0.2 },
    tags: ["bg", "rare", "foxkin", "pet"],
  },
} satisfies TraitOrGroupDefinitions;
