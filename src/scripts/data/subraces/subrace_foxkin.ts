export const DEFINITION_SUBRACE_FOXKIN: SubraceDefinition = {
  key: "subrace_foxkin",
  name: "Foxkin",
  noun: "foxkin",
  homeland_region: setup.Text.Race.REGIONS.vale,
  company_key: "foxkin",
  description:
    "A submissive, breedable subrace of <<rep setup.trait.race_wolfkin>> found near settlements or within werewolf packs. Naturally obedient, social, and attuned to emotional magic. Often kept as pets or breeding stock.",
  slave_value: 2500,
  rarity: "rare",
  race: "race_wolfkin",
  trait_preferences: {
    /* =========== */
    /* RACE */
    /* =========== */
    subrace_foxkin: 1,

    /* =========== */
    /* BACKGROUNDS */
    /* =========== */
    bg_entertainer: "POOL_BG_COMMON_1",
    bg_maid: "POOL_BG_COMMON_1",
    bg_slave: "POOL_BG_COMMON_1",
    bg_courtesan: "POOL_BG_UNCOMMON_2",
    bg_whore: "POOL_BG_UNCOMMON_2",
    bg_pet: "POOL_BG_RARE_3",
    bg_companion: "POOL_BG_RARE_3",
    bg_laborer: "POOL_BG_UNCOMMON_2",
    bg_unemployed: "POOL_BG_UNCOMMON_2",
    bg_nomad: "POOL_BG_RARE_3",
    bg_farmer: "POOL_BG_RARE_3",
    bg_mystic: "POOL_BG_EPIC_4",
    bg_priest: "POOL_BG_EPIC_4",
    bg_merchant: "POOL_BG_EPIC_4",
    bg_noble: "POOL_BG_ULTRA_7",

    /* =========== */
    /* PERSONALITY */
    /* =========== */
    per_submissive: "POOL_PER_COMMON_1",
    per_loyal: "POOL_PER_COMMON_1",
    per_affectionate: "POOL_PER_COMMON_1",
    per_social: "POOL_PER_UNCOMMON_2",
    per_chaste: "POOL_PER_UNCOMMON_2",
    per_sexaddict: "POOL_PER_RARE_3",
    per_calm: "POOL_PER_UNCOMMON_2",
    per_loner: 0.05,
    per_dominant: 0.01,

    /* =========== */
    /* MAGIC */
    /* =========== */
    magic_emotion: 0.5,
    skill_seductive: 0.5,
    skill_domestic: 0.5,
    skill_breeding: 0.5,
    magic_water: 0.1,

    /* =========== */
    /* PHYSICAL */
    /* =========== */
    androgynous: 0.3,
    soft_body: 0.5,
    high_libido: 0.5,
    fertile: 0.5,
    muscle_weak: 0.3,
    muscle_average: 0.5,
    muscle_strong: 0.05,
    breast_small: 0.2,
    breast_medium: 0.2,
    breast_large: 0.05,
    dick_small: 0.2,
    dick_medium: 0.2,
    dick_foxkin: 0.9,
    balls_small: 0.2,
    balls_medium: 0.2,
    tail_foxkin: 1.0,
    ears_foxkin: 1.0,
    mouth_foxkin: 1.0,
    body_foxkin: 1.0,
    arms_foxkin: 1.0,
    legs_foxkin: 1.0,
  },
  trait_dispreferences: {
    per_dominant: 5.0,
    muscle_verystrong: 5.0,
    muscle_extremelystrong: 5.0,
    magic_fire: 5.0,
    magic_fire_master: 5.0,
  },
};
