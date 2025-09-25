import type { TraitOrGroupDefinitions } from "../../../classes/trait/Trait";

export default {
  eyes_woodmousekin: {
    name: "eyes (woodmousekin)",
    description:
      "Pair of normally round hazel eyes that glint in the light, giving greater awareness of surroundings.",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["eyes", "skin", "genderless", "medium", "skin_woodmousekin"],
  },

  ears_woodmousekin: {
    name: "ears (woodmousekin)",
    description:
      "Large round ears that stand up like dishes, good for hearing small sounds.",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.05,
    },
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_woodmousekin",
    ],
  },

  mouth_woodmousekin: {
    name: "mouth (woodmousekin)",
    description:
      "Long whiskers growing from their cheeks behind their pink nose, located above a short pointed muzzle.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      sex: +0.2,
    },
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "rare",
      "fangs",
      "skin_woodmousekin",
    ],
  },

  body_woodmousekin: {
    name: "body (woodmousekin)",
    description:
      "Their entire body is coated in short, thick brown fur, blending easily with the dead leaves and twigs of winter. White belly standing out, mimicking the clouds on a bright summers day, to those beneath.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["body", "skin", "genderless", "rare", "furry", "skin_woodmousekin"],
  },

  arms_woodmousekin: {
    name: "arms (woodmousekin)",
    description:
      "Thick short fur covers the entire length of their thin arms.",
    slave_value: 0,
    skill_bonuses:{
    },
    tags: ["arms", "skin", "genderless", "medium", "skin_woodmousekin"],
  },

  legs_woodmousekin: {
    name: "legs (woodmousekin)",
    description:
      "Pair of slim legs covered in thick short fluffy fur.",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["legs", "skin", "genderless", "medium", "skin_woodmousekin"],
  },

  tail_woodmousekin: {
    name: "tail (woodmousekin)",
    description:
      "Their tail seems to have a mind but actually is great for keeping the mouse nimble with superior balance.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["tail", "skin", "genderless", "rare", "skin_woodmousekin"],
  },

  dick_woodmousekin: {
    name: "dick (woodmousekin)",
    description:
      "The entire length of the shaft is pink, the shaft starting thick at the base slowly thins as it reaches the pointed tip. Normally hidden inside a thick brown or white sheath with nice furry balls hanging underneath.",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
    },
    tags: ["dickshape", "skin", "needdick", "medium", "skin_woodmousekin"],
  },

  vagina_woodmousekin: {
    name: "vagina (woodmousekin)",
    description:
      "Wood Mousekins vagina is small round and extra tight but flexable.",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
    },
    tags: ["vaginashape", "skin", "needvagina", "medium", "skin_woodmousekin"],
  },
} satisfies TraitOrGroupDefinitions;
