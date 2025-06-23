import { unit_trait_texts } from "../aaa_text"

setup.Text.Hobby = {}

/* Return a hobby, e.g., "exercising in the courtyard". */
/**
 * @param {setup.Unit} unit 
 * @param {setup.Trait} [trait]  // if supplied, used this trait's hobby instead.
 * @returns {string}
 */
setup.Text.Hobby.verb = function (unit, trait) {
  return unit_trait_texts({ unit: unit, field: 'hobby', trait: trait })
}
