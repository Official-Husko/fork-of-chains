import type { TraitOrGroupDefinitions } from "../../classes/trait/Trait";
import { Constants } from "../../constants";

/** List of tags that represent body parts */
setup.TRAIT_SKIN_TAGS = [
  "eyes",
  "ears",
  "mouth",
  "body",
  "wings",
  "arms",
  "legs",
  "tail",
  "dickshape",
  "vaginashape",
];

/* rarity here is "corruption rarity". That's why demonic are most common */

export default {
  //
  // EYES
  //

  eyes_neko: {
    name: "eyes (cat)",
    description: "Posses cat-like eyes that can see in the dark",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "eyes",
      "skin",
      "genderless",
      "medium",
      "skin_neko",
      "skin_tigerkin",
    ],
  },
  eyes_dragonkin: {
    name: "eyes (draconic)",
    description: "Posses intimidating pair of draconic eyes.",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "eyes",
      "skin",
      "genderless",
      "rare",
      "skin_dragonkin",
      "skin_lizardkin",
    ],
  },
  eyes_demon: {
    name: "eyes (demonic)",
    description: "Posses pitch-black demonic eyes.",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      knowledge: -0.35,
    },
    tags: ["eyes", "skin", "genderless", "common", "corruption", "skin_demon"],
  },
  eyes_foxkin: {
    name: "eyes (fox)",
    description:
      "Possess playful amber eyes with sharp slitted pupils. Good at reading emotions.",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["medium", "skin_foxkin"],
  },

  //
  // EARS
  //

  ears_werewolf: {
    name: "ears (werewolf)",
    description: "Posses dog-like ears sticking out of their head",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_werewolf",
    ],
  },
  ears_neko: {
    name: "ears (cat)",
    description: "Posses cat-like ears sticking out of their head",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_neko",
      "skin_tigerkin",
    ],
  },
  ears_elf: {
    name: "ears (pointy)",
    description: "Posses sharp pointy ears",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_elf",
      "skin_orc",
      "skin_fairy",
    ],
  },
  ears_dragonkin: {
    name: "ears (draconic)",
    description: "Possess fin-like ears",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_dragonkin",
      "skin_lizardkin",
    ],
  },
  ears_demon: {
    name: "ears (demonic)",
    description: "Posses pointy ears and a pair of horns",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      survival: -0.35,
    },
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "common",
      "corruption",
      "horns",
      "skin_demon",
      "skin_demonkin",
    ],
  },
  ears_foxkin: {
    name: "ears (fox)",
    description:
      "Possess large perky fox-like ears, sensitive to sound and praise.",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["medium", "skin_foxkin"],
  },

  //
  // MOUTH
  //

  mouth_werewolf: {
    name: "mouth (werewolf)",
    description: "Posses a muzzle in place of mouth",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "fangs",
      "skin_werewolf",
    ],
  },
  mouth_neko: {
    name: "mouth (neko)",
    description: "Several sensitive whiskers grow from their cheeks",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {},
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "rare",
      "fangs",
      "skin_tigerkin",
    ],
  },
  mouth_orc: {
    name: "mouth (orc)",
    description: "Sharp tusks jut out of their mouth",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_orce",
      "skin_orc",
    ],
  },
  mouth_dragonkin: {
    name: "mouth (dragonkin)",
    description: "Posses scaley muzzle filled with sharp teeth",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "rare",
      "fangs",
      "skin_dragonkin",
      "skin_lizardkin",
    ],
  },
  mouth_demon: {
    name: "mouth (demonic)",
    description: "Posses elongated tongue clearly beyond what is normal",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      social: -0.35,
    },
    tags: ["mouth", "skin", "genderless", "skin_demon", "common", "corruption"],
  },
  mouth_foxkin: {
    name: "mouth (fox)",
    description:
      "Possess a soft narrow muzzle with sensitive lips and thin fangs.",
    slave_value: Constants.MONEY_TRAIT_RARE,
    skill_bonuses: {},
    tags: ["rare", "fangs", "skin_foxkin"],
  },

  //
  // BODY
  //

  body_drow: {
    name: "body (drow)",
    description:
      "Posses dark-purple-tined skin of drow origin accompanied with pale, almost white hair",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["body", "skin", "genderless", "medium", "skin_drow"],
  },
  body_werewolf: {
    name: "body (werewolf)",
    description: "Posses a furry body of a werewolf",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["body", "skin", "genderless", "medium", "furry", "skin_werewolf"],
  },
  body_neko: {
    name: "body (cat)",
    description: "Tiger-like black stripes cover their entire body",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {},
    tags: ["body", "skin", "genderless", "rare", "furry", "skin_tigerkin"],
  },
  body_orc: {
    name: "body (orc)",
    description: "Posses green-colored skin of orcish origin",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["body", "skin", "genderless", "medium", "skin_orc"],
  },
  body_dragonkin: {
    name: "body (dragonkin)",
    description: "Posses a body covered with protective scales",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "body",
      "skin",
      "genderless",
      "rare",
      "skin_dragonkin",
      "skin_lizardkin",
    ],
  },
  body_demon: {
    name: "body (demonic)",
    description: "Posses a reddish body covered in tough skin",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      brawn: -0.35,
    },
    tags: [
      "body",
      "skin",
      "genderless",
      "common",
      "corruption",
      "skin_demon",
      "skin_demonkin",
    ],
  },

  body_foxkin: {
    name: "body (fox)",
    description:
      "Possess a slim and soft-furred body made for pleasure and attention.",
    slave_value: Constants.MONEY_TRAIT_RARE,
    skill_bonuses: {},
    tags: ["rare", "furry", "skin_foxkin"],
  },

  //
  // WINGS
  //

  wings_elf: {
    name: "wings (elven)",
    description:
      "Possess a beautiful pair of transluscent butterfly-like wings",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {},
    tags: ["wings", "skin", "genderless", "skin_angel", "rare", "skin_fairy"],
  },
  wings_dragonkin: {
    name: "wings (dragonkin)",
    description: "Posses a pair of scaley wings",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {},
    tags: [
      "wings",
      "skin",
      "genderless",
      "skin_angel",
      "rare",
      "skin_dragonkin",
    ],
  },
  wings_demon: {
    name: "wings (demonic)",
    description: "Posses a pair of bat-like wings",
    slave_value: "MONEY_TRAIT_MEDIUM",
    skill_bonuses: {
      aid: -0.35,
      slaving: -0.35,
    },
    tags: [
      "wings",
      "skin",
      "genderless",
      "skin_angel",
      "common",
      "corruption",
      "skin_demon",
    ],
  },
  wings_angel: {
    name: "wings (angelic)",
    description: "Posses a pair of angel-like wings",
    slave_value: "MONEY_TRAIT_EPIC",
    skill_bonuses: {},
    tags: ["wings", "skin", "genderless", "skin_angel", "rare"],
  },

  //
  // ARMS
  //

  arms_werewolf: {
    name: "arms (werewolf)",
    description: "Posses a furry pair of arms with claws",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["arms", "skin", "genderless", "medium", "skin_werewolf"],
  },
  arms_neko: {
    name: "arms (cat)",
    description: "Tiger-like black stripes cover their clawed arms",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {},
    tags: ["arms", "skin", "genderless", "rare", "skin_tigerkin"],
  },
  arms_dragonkin: {
    name: "arms (dragonkin)",
    description: "Posses a scaley pair of arms ending in sharp claws",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "arms",
      "skin",
      "genderless",
      "rare",
      "skin_lizardkin",
      "skin_dragonkin",
    ],
  },
  arms_demon: {
    name: "arms (demonic)",
    description: "Posses a pair of arms ending in deadly lethal claws",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      combat: -0.35,
    },
    tags: ["arms", "skin", "genderless", "common", "corruption", "skin_demon"],
  },
  arms_foxkin: {
    name: "arms (fox)",
    description: "Possess a delicate pair of furred arms with soft claws.",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["medium", "skin_foxkin"],
  },

  //
  // LEGS
  //

  legs_werewolf: {
    name: "legs (werewolf)",
    description: "Posses a furry pair of legs with digitigrade legs",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["legs", "skin", "medium", "skin_werewolf"],
  },
  legs_neko: {
    name: "legs (cat)",
    description: "Legs covered in black stripes akin to tigers",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {},
    tags: ["legs", "skin", "genderless", "rare", "skin_tigerkin"],
  },
  legs_dragonkin: {
    name: "legs (dragonkin)",
    description: "Posses a scaley pair of legs",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "legs",
      "skin",
      "genderless",
      "rare",
      "skin_lizardkin",
      "skin_dragonkin",
    ],
  },
  legs_demon: {
    name: "legs (demonic)",
    description:
      "Posses a pair of legs with sharp spikes protruding out of the skins",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      intrigue: -0.35,
    },
    tags: ["legs", "skin", "genderless", "common", "corruption", "skin_demon"],
  },
  legs_foxkin: {
    name: "legs (fox)",
    description: "Possess digitigrade legs with soft fur and dainty paws.",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["medium", "skin_foxkin"],
  },

  //
  // TAIL
  //

  tail_werewolf: {
    name: "tail (werewolf)",
    description: "Posses a fluffy dog-like tail",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["tail", "skin", "genderless", "medium", "skin_werewolf"],
  },
  tail_neko: {
    name: "tail (neko)",
    description: "Posses a long thin cat-like tail",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "tail",
      "skin",
      "genderless",
      "medium",
      "skin_neko",
      "skin_tigerkin",
    ],
  },
  tail_dragonkin: {
    name: "tail (dragonkin)",
    description: "Posses a sturdy and strong draconic tail",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "tail",
      "skin",
      "genderless",
      "rare",
      "skin_lizardkin",
      "skin_dragonkin",
    ],
  },
  tail_demon: {
    name: "tail (demonic)",
    description: "Posses a thin elongated tail ending in sharp arrow",
    slave_value: -Constants.MONEY_TRAIT_MEDIUM,
    skill_bonuses: {
      sex: -0.35,
    },
    tags: [
      "tail",
      "skin",
      "genderless",
      "common",
      "corruption",
      "skin_demon",
      "skin_demonkin",
    ],
  },
  tail_foxkin: {
    name: "tail (fox)",
    description:
      "Possess a long bushy tail that twitches with emotion — often used for teasing.",
    slave_value: Constants.MONEY_TRAIT_RARE,
    skill_bonuses: {
      sex: +0.15,
    },
    tags: ["rare", "skin_foxkin"],
  },

  //
  // DICKSHAPE
  //

  dick_werewolf: {
    name: "dick (werewolf)",
    description: "Posses a dick complete with a knot",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["dickshape", "skin", "needdick", "medium", "skin_werewolf"],
  },
  dick_dragonkin: {
    name: "dick (dragonkin)",
    description: "Posses an odd looking lizard-ish dick",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "dickshape",
      "skin",
      "needdick",
      "rare",
      "skin_dragonkin",
      "skin_lizardkin",
    ],
  },
  dick_demon: {
    name: "dick (demonic)",
    description:
      "Posses a dick with jagged protrusions covering the entire length",
    slave_value: 0,
    skill_bonuses: {},
    tags: [
      "dickshape",
      "skin",
      "needdick",
      "common",
      "corruption",
      "skin_demon",
      "skin_demonkin",
    ],
  },
  dick_foxkin: {
    name: "dick (fox)",
    description:
      "Possess a slim, lightly knotted cock. Easily aroused and quick to breed.",
    slave_value: 0,
    skill_bonuses: {},
    tags: ["medium", "skin_foxkin"],
  },

  //
  // VAGINA_SHAPE
  //

  // TODO
} satisfies TraitOrGroupDefinitions;
