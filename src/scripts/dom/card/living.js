import { domCardName } from "../util/cardnamerep"

/**
 * @param {setup.Living} living
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.living = function (living) {
  const fragments = []

  fragments.push(html`
    <span class='toprightspan'>
      <div>
        Default preference: ${living.default_preference}
      </div>
    </span>
  `)

  const positive = []
  const negative = []
  const preferences = living.getTraitPreferences()
  for (const trait_key in preferences) {
    const pref = preferences[trait_key]
    const trait = setup.trait[trait_key]
    if (pref > 0) {
      positive.push(trait)
    } else {
      negative.push(trait)
    }
  }

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(test)`,
    () => {
      State.variables.gUnit_key = setup.rng.choice(
        State.variables.company.player.getUnits({ job: setup.job.slaver })).key
      // @ts-ignore
      State.variables.gDebugLiving_key = living.key
    },
    'LivingDebugDo',
  )}
      ${domCardName(living)}
    </div>
    <div>
      ${setup.DOM.Card.restriction(living.getUnitRestrictions(), null, /* show all = */ true)}
    </div>
    <div>
      ${positive.map(trait => trait.rep()).join('')}
      ${negative.map(trait => trait.repNegative()).join('')}
    </div>
  `)

  return setup.DOM.create('div', { class: 'livingcard card' }, fragments)
}
