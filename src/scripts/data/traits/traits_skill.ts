import type { TraitOrGroupDefinitions } from "../../classes/trait/Trait";

export default {
  //
  // NON-MAGIC
  //

  skill_ambidextrous: {
    name: "ambidextrous",
    description: "Capable of using both left and right arms equally well",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { combat: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_intimidating: {
    name: "intimidating",
    description: "Has an intimidating presence",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { brawn: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_flight: {
    name: "flight",
    description: "Is able to soar through the sky",
    slave_value: 0,
    skill_bonuses: { survival: 0.25 },
    tags: ["skill", "impossible", "computed", "nonmagic"],
  },

  skill_connected: {
    name: "connected",
    description: "Has connections to many important people",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { intrigue: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_hypnotic: {
    name: "hypnotic",
    description: "Knows how to hypnotize people under the right conditions",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { slaving: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_creative: {
    name: "creative",
    description:
      "Has a clockwork-like mind that keeps coming up with creative ideas",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { knowledge: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_entertain: {
    name: "entertainer",
    description: "Is skilled in entertaining people with a song and a dance",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { social: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_alchemy: {
    name: "alchemy",
    description: "Knows how mix herbs and make potions",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { aid: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_animal: {
    name: "animal whisperer",
    description: "Has strong bond with animals",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { sex: 0.25 },
    tags: ["skill", "medium", "nonmagic"],
  },

  skill_seductive: {
    name: "seductive",
    description:
      "Is skilled at seducing and enticing others, using charm, body language, and allure.",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: { social: 0.125, sex: 0.125 },
    tags: ["skill", "medium", "nonmagic"],
  },

  //
  // MAGIC
  //

  "group:magicfire": {
    add_tags: [],
    sequence: {
      magic_fire: {
        name: "magic: fire",
        description:
          "Has some control over the fire domain. See also <<lore magic_fire>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.16, combat: 0.02, knowledge: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_fire_master: {
        name: "magic: fire (master)",
        description:
          "Masters the use of the fire domain and can summon purifying flames. See also <<lore magic_fire>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.19, combat: 0.03, knowledge: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
  "group:magicwater": {
    add_tags: [],
    sequence: {
      magic_water: {
        name: "magic: water",
        description:
          "Has some control over the water domain. See also <<lore magic_water>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.18, brawn: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_water_master: {
        name: "magic: water (master)",
        description:
          "Masters the use of the water domain and can employ its power to shape flesh, with the right equipment. See also <<lore magic_water>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.22, brawn: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
  "group:magicwind": {
    add_tags: [],
    sequence: {
      magic_wind: {
        name: "magic: wind",
        description:
          "Has some control over the wind domain. See also <<lore magic_wind>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.16, slaving: 0.02, social: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_wind_master: {
        name: "magic: wind (master)",
        description:
          "Masters the use of the wind domain and can employ its power to summon lighnings. See also <<lore magic_wind>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.19, slaving: 0.03, social: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
  "group:magicearth": {
    add_tags: [],
    sequence: {
      magic_earth: {
        name: "magic: earth",
        description:
          "Has some control over the earth domain. See also <<lore magic_earth>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.16, sex: 0.02, survival: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_earth_master: {
        name: "magic: earth (master)",
        description:
          "Masters the use of the earth domain and can employ its power to create tentacle aberrations. See also <<lore magic_earth>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.19, sex: 0.03, survival: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
  "group:magiclight": {
    add_tags: [],
    sequence: {
      magic_light: {
        name: "magic: light",
        description:
          "Has some control over the light domain. See also <<lore magic_light>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.18, aid: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_light_master: {
        name: "magic: light (master)",
        description:
          "Masters the use of the light domain and can employ its power to heal, with the right equipment. See also <<lore magic_light>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.22, aid: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
  "group:magicdark": {
    add_tags: [],
    sequence: {
      magic_dark: {
        name: "magic: dark",
        description:
          "Has some control over the dark domain. See also <<lore magic_dark>>",
        slave_value: "MONEY_TRAIT_MEDIUM",
        skill_bonuses: { arcane: 0.18, intrigue: 0.02 },
        tags: ["skill", "magic", "rare", "magicbasic"],
      },
      magic_dark_master: {
        name: "magic: dark (master)",
        description:
          "Masters the use of the dark domain and can employ its power to corrupt others, with the right equipment. See also <<lore magic_dark>>",
        slave_value: "MONEY_TRAIT_RARE",
        skill_bonuses: { arcane: 0.22, intrigue: 0.03 },
        tags: ["skill", "magic", "unicorn", "magicmaster"],
      },
    },
  },
} satisfies TraitOrGroupDefinitions;
