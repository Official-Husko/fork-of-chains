/**
 * @param {number} value 
 * @return {setup.DOM.Node}
 */
function format_skill(value) {
  if (value > 0) {
    return setup.DOM.Text.successlite(`+${value}`)
  } else if (value < 0) {
    return setup.DOM.Text.dangerlite(value)
  } else {
    return html`${value}`
  }
}

/**
 * @param {setup.DOM.Node[]} fragments 
 * @returns {setup.DOM.Node}
 */
function delineate_fragments(fragments) {
  const frags = []
  for (let i = 0; i < fragments.length; ++i) {
    if (i) frags.push(html` | `)
    frags.push(fragments[i])
  }
  return setup.DOM.create(
    'div',
    {},
    frags,
  )
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Skill} skill
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.unitskill = function (unit, skill) {
  const fragments = []

  fragments.push(html`
    <div>
      ${unit.rep()}'s ${skill.rep()}: ${unit.getSkill(skill)}
    </div>
    <hr/>
  `)

  const skill_key = skill.key

  const skill_base = unit.getSkillsBase()[skill_key]
  fragments.push(html`
    <div>
      Base: ${format_skill(skill_base)}
    </div>
  `)

  const base_breakdown = unit.getSkillsBaseBreakdown()[skill_key]
  fragments.push(
    delineate_fragments(
      base_breakdown.map(breakdown => html`${breakdown.title}: ${format_skill(breakdown.value)}`)
    )
  )
  fragments.push(html`<hr/>`)

  const mods = unit.getSkillModifiers()[skill_key]
  fragments.push(html`
    <div>
      Mods: ${setup.DOM.Text.percentage(mods)}
    </div>
  `)

  const mod_breakdown = unit.getSkillModifiersBreakdown()[skill_key]
  mod_breakdown.sort((a, b) => b.value - a.value)
  fragments.push(
    delineate_fragments(
      mod_breakdown.map(breakdown => html`${breakdown.title}: ${setup.DOM.Text.percentage(breakdown.value)}`)
    )
  )
  fragments.push(html`<hr/>`)

  const adds = unit.getSkillAdditives()[skill_key]
  fragments.push(html`
    <div>
      Add: ${format_skill(adds)}
    </div>
  `)

  const add_breakdown = unit.getSkillAdditivesBreakdown()[skill_key]
  add_breakdown.sort((a, b) => b.value - a.value)
  fragments.push(
    delineate_fragments(
      add_breakdown.map(breakdown => html`${breakdown.title}: ${format_skill(breakdown.value)}`)
    )
  )

  return setup.DOM.create('div', {}, fragments)
}
