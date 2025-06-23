
setup.Text = {}
setup.Text.Unit = {}

setup.Text.Unit.Trait = {}
setup.Text.Unit.Equipment = {}

setup.Text.Trait = {}
setup.Text.Race = {}
setup.Text.Banter = {}
setup.Text.Duty = {}
setup.Text.Building = {}

/**
 * @param {{
 *   unit: setup.Unit
 *   field: string
 *   trait?: setup.Trait
 * }} args
 * @returns 
 */
export function unit_trait_texts({ unit, field, trait }) {
  let candidates
  if (trait) {
    candidates = trait.getTexts()[field]
    if (!candidates || !candidates.length) throw new Error(`Trait ${trait.key} does not have a ${field} associated with it!`)
  } else {
    candidates = setup.TRAIT_TEXTS_DEFAULT[field] || []
    const traits = unit.getTraits()
    for (const trait of traits) {
      const text = trait.getTexts()
      if (text) {
        candidates = candidates.concat(text[field] || [])
      }
    }
  }
  return setup.Text.replaceUnitMacros(candidates, { a: unit })
}
