/**
 * Create a level 1 copy of the unit. Used in New Game Plus
 * @param {setup.Unit} unit 
 * @returns {setup.Unit}
 */
export function createLevelOneUnitCopy(unit) {
  const created = setup.generateAnyUnit()
  const replace_over = [
    'first_name',
    'surname',
    'name',
    'custom_image_name',
    'nickname',
    'trait_key_map',
    'innate_trait_key_map',
    'speech_key',
    'base_skills',
    'origin',
    'skill_focus_keys',
    'seed',
    'history',
  ]
  for (const attribute_name of replace_over) {
    created[attribute_name] = unit[attribute_name]
  }

  // special case, copy over base skills to skills
  created.skills = created.base_skills

  return created
}
