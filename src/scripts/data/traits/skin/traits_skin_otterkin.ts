import type { TraitOrGroupDefinitions } from "../../../classes/trait/Trait";

export default {
  eyes_otterkin: {
    name: "eyes (otterkin)",
    description:
      "Pair of small brown eyes, giving greater awareness in low light conditions underwater.",
    slave_value: 0,
    skill_bonuses: {
      intrigue: +0.1,
    },
    tags: ["eyes", "skin", "genderless", "medium", "skin_otterkin"],
  },

  ears_otterkin: {
    name: "ears (otterkin)",
    description:
      "Tiny round ears point up, soft and small, nice to rub.",
    slave_value: 0,
    skill_bonuses: {
    },
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_otterkin",
    ],
  },

  mouth_otterkin: {
    name: "mouth (otterkin)",
    description:
      "Otterkin have a rounded muzzle that is quite small, easily fitting into a werewolf paw. Covered in thick numerous whiskers.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
    },
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "rare",
      "fangs",
      "skin_otterkin",
    ],
  },

  body_otterkin: {
    name: "body (otterkin)",
    description:
      "Their entire body is covered in short thick fur grate for insolation and swimming.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      survival: +0.2,
    },
    tags: ["body", "skin", "genderless", "rare", "furry", "skin_otterkin"],
  },

  arms_otterkin: {
    name: "arms (otterkin)",
    description:
      "Thick short fur covers the entire length of their short arms.",
    slave_value: 0,
    skill_bonuses:{

    },
    tags: ["arms", "skin", "genderless", "medium", "skin_otterkin"],
  },

  legs_otterkin: {
    name: "legs (otterkin)",
    description:
      "Thick short fur ending with flipper like feet are amazing at swimming.",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["legs", "skin", "genderless", "medium", "skin_otterkin"],
  },

  tail_otterkin: {
    name: "tail (otterkin)",
    description:
      "Otterkins have full control of their tail and use it to help shift direction in water.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["tail", "skin", "genderless", "rare", "skin_otterkin"],
  },

  dick_otterkin: {
    name: "dick (otterkin)",
    description:
      "Rather small, the entire length is either tapered or has an equine esque flare on the end with mid ridge where it gets wider.",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
    },
    tags: ["dickshape", "skin", "needdick", "medium", "skin_otterkin"],
  },

  vagina_otterkin: {
    name: "vagina (otterkin)",
    description:
      "Soft and thick clit in the shape of a spade that helps guide the counterpart to the appropriate place.",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
    },
    tags: ["vaginashape", "skin", "needvagina", "medium", "skin_otterkin"],
  },
} satisfies TraitOrGroupDefinitions;
