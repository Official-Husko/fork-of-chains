// All unit generation related constants for the Twine SugarCube project.
// This module attaches values to the global `setup` object.

export function registerUnitGenerationConstants(setup: any) {
  /* average number of personality traits of each rarity */
  setup.UNIT_POOL_PER_TRAITS_AVERAGE_COMMON = 3.0;
  setup.UNIT_POOL_PER_TRAITS_AVERAGE_MEDIUM = 0.18;
  setup.UNIT_POOL_PER_TRAITS_AVERAGE_RARE = 0.02;
  setup.UNIT_POOL_PER_TRAITS_AVERAGE_UNICORN = 0.002;

  /* minimum and maximum number of personality traits on generated units */
  setup.UNIT_POOL_PER_TRAITS_MIN = 1;
  setup.UNIT_POOL_PER_TRAITS_MAX = 5;

  /* average number of personality traits of each rarity */
  setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_COMMON = 0.075;
  setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_MEDIUM = 0.075;
  setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_RARE = 0.015;
  setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_UNICORN = 0.0015;

  /* minimum and maximum number of personality traits on generated units */
  setup.UNIT_POOL_SKILL_TRAITS_MIN = 0;
  setup.UNIT_POOL_SKILL_TRAITS_MAX = setup.TRAIT_MAX_HAVE.skill;

  setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_COMMON = 0.25;
  setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_MEDIUM = 0.05;
  setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_RARE = 0.01;
  setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_UNICORN = 0.001;

  setup.POOL_BG_COMMON_1 = 1;
  setup.POOL_BG_UNCOMMON_2 = 0.5;
  setup.POOL_BG_RARE_3 = 0.2;
  setup.POOL_BG_EPIC_4 = 0.1;
  setup.POOL_BG_LEGENDARY_5 = 0.05;
  setup.POOL_BG_MYTHIC_6 = 0.01;
  setup.POOL_BG_ULTRA_7 = 0.001;
  setup.POOL_BG_FINAL_8 = 0.0001;
  setup.POOL_BG_IMPOSSIBLE_9 = 0.00001;

  setup.POOL_PER_COMMON_1 = 0.5;
  setup.POOL_PER_UNCOMMON_2 = 0.2;
  setup.POOL_PER_RARE_3 = 0.1;
  setup.POOL_PER_EPIC_4 = 0.05;
  setup.POOL_PER_LEGENDARY_5 = 0.01;
}
