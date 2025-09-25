import type { Unit } from "./Unit";

/**
 * Create a level 1 copy of the unit. Used in New Game Plus
 */
export function createLevelOneUnitCopy(unit: Unit): Unit {
  const created = setup.generateAnyUnit();

  const replace_over: (keyof Unit)[] = [
    "first_name",
    "surname",
    "custom_image_name",
    "nickname",
    "trait_key_map",
    "innate_trait_key_map",
    "speech_key",
    "base_skills",
    "origin",
    "skill_focus_keys",
    "seed",
    "history",
  ];
  for (const attribute_name of replace_over) {
    (created as any)[attribute_name] = (unit as any)[attribute_name];
  }

  // special case, copy over base skills to skills
  created.skills = created.base_skills;

  return created;
}
