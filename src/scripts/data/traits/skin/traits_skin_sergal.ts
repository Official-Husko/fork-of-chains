import type { TraitOrGroupDefinitions } from "../../../classes/trait/Trait";

export default {
  eyes_sergal: {
    name: "eyes (sergal)",
    description:
      "Two intimidating piercing eyes on the sides of the pointed muzzle, both able to look forward but only with a limited overlap. This allows for limited hunting and greater awareness of surroundings.",
    slave_value: 0,
    skill_bonuses: {
      slaving: +0.1,
    },
    tags: ["eyes", "skin", "genderless", "medium", "skin_sergal"],
  },

  ears_sergal: {
    name: "ears (sergal)",
    description:
      "Sergals have two ears that mostly point backwards, following the angle of their muzzle. However, except for nice things to hold on to during sex, there is little to no advantage to this.",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.04,
    },
    tags: [
      "ears",
      "skin",
      "genderless",
      "skin_demon",
      "medium",
      "skin_sergal",
    ],
  },

  mouth_sergal: {
    name: "mouth (sergal)",
    description:
      "The profile of a sergals muzzle is that of a large cheese wedge cut out of a wheel of cheese. Their mouth hides carnivore sharp teeth, accompanied with a wood pecker-like long tongue that can be split at the end. This tongue is flexible, strong and useful for picking up objects and using them with the mouth. Allowing for them to use keys on shackled paws or mind shattering oral sex.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      sex: +0.2,
      intrigue: +0.1,
    },
    tags: [
      "mouth",
      "skin",
      "genderless",
      "skin_demon",
      "rare",
      "fangs",
      "skin_sergal",
    ],
  },

  body_sergal: {
    name: "body (sergal)",
    description:
      "The sergal's body is long and very flexible, allowing for unique climbing ability and thin enough to slide in very small vents. Their chests are normally flat even for females, however can change due to pregnancy.",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      intrigue: +0.1,
    },
    tags: ["body", "skin", "genderless", "rare", "furry", "skin_sergal"],
  },

  arms_sergal: {
    name: "arms (sergal)",
    description:
      "Sergal's arms are thin, not good for hand to hand brawn related fighting. However, their ability to use their paws and arms to climb up almost anything allows for great survivability. ",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.2,
      brawn: -0.15,
    },
    tags: ["arms", "skin", "genderless", "medium", "skin_sergal"],
  },

  legs_sergal: {
    name: "legs (sergal)",
    description:
      "Digitigrade legs, thin with sleek short hair are very fast at running, flexible with feet that resemble more like extra hands makes climbing and hanging on to branches a lot easier. ",
    slave_value: 0,
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["legs", "skin", "genderless", "medium", "skin_sergal"],
  },

  tail_sergal: {
    name: "tail (sergal)",
    description:
      "Flexible sergal tail, long and heavy, is used mostly to maintain balance with the normally lightweight build of a sergal, allowing them to lean more into running or balance whilst balancing on trees. ",
    slave_value: "MONEY_TRAIT_RARE",
    skill_bonuses: {
      survival: +0.1,
    },
    tags: ["tail", "skin", "genderless", "rare", "skin_sergal"],
  },

  dick_sergal: {
    name: "dick (sergal)",
    description:
      "Sergals sheath is rather fuzzy, thick but short fur covers the balls and sheath. The unusual pointed cock tip with slightly ribbed shaft feels nice in the fingers. Normally aesthetically pleasing without drawing the eyes, a sergal can maintain nudity with little issue, attracting those who look into a conversation. Even when clothed, the nice plump bulge padded out with the thick short fur makes friends and enemies blush, giving the sergal an advantage in conversation. ",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
      social: +0.2,
    },
    tags: ["dickshape", "skin", "needdick", "medium", "skin_sergal"],
  },

  vagina_sergal: {
    name: "vagina (sergal)",
    description:
      "Sergals vagina is different from almost any other species in the land. Covered with a prehensile clitoral hood it covers the sensitive clit with protection in battle, but also is used in sex. Attracted to warmth it naturally wraps around anything warm that brushes against it. Covering it in the natural lubrication allows for easy insertion. It also has the side effect of wrapping around the partners balls, or fist/arm. Making pulling out much difficult especially when the female sergal is closer to climax. This suits a female femdom ability to control the partner's orgasm until they're ready to let them. ",
    slave_value: 0,
    skill_bonuses: {
      sex: +0.1,
      slaving: +0.2,
    },
    tags: ["vaginashape", "skin", "needvagina", "medium", "skin_sergal"],
  },
} satisfies TraitOrGroupDefinitions;
