// @ts-nocheck

setup.Text.Gagged = {}

/**
 * Gagged muffling noises from being in discomfort
 * 
 * @param {{
 * unit: setup.Unit,
 * }} args
 * @returns {string}
 */
setup.Text.Gagged.discomfort = function ({
  unit
}) {
  const dialogues = [
    `Mmph!! Mmmph!!`,
    `Mmm-mmph!`,
    `Mmmpphh!`,
    'Hmmmpff!!',
    'Mmmmrrrff!!',
    'Mmm-mmgh!',
  ]
  return setup.rng.choice(dialogues)
}

/**
 * Gagged muffling noises from being in pleasure
 * 
 * @param {{
 * unit: setup.Unit,
 * }} args
 * @returns {string}
 */
setup.Text.Gagged.pleasure = function ({
  unit
}) {
  const dialogues = [
    `Mmmphh~~~`,
    `Mmmph... mmmph...`,
    `Mmmph~`,
    'mmmMMMmmphh...',
    'Mmmph?! Mmmphh...',
    'Mmmghh... mmghh~',
  ]
  return setup.rng.choice(dialogues)
}
