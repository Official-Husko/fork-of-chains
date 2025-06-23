import { menuItemAction, menuItemText } from "../../ui/menu"

/**
 * @param {setup.DutyInstance} duty
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.dutyassign = function (duty) {
  const units = State.variables.company.player.getUnits().filter(
    unit => duty.isCanUnitAssign(unit)
  )
  return setup.DOM.Roster.show({
    menu: 'unitduty',
    units: units,
    is_menu_generated_async: true,
    actions_callback: (unit) => {
      const menus = []

      menus.push(
        menuItemAction({
          text: `Select`,
          callback: () => {
            // @ts-ignore
            State.variables.gUnitSelected_key = unit.key
            duty.assignUnit(unit)
            setup.notify(`a|Rep a|is now assigned for ${duty.rep()}.`, { a: unit })
            setup.DOM.Nav.gotoreturn()
          },
        })
      )

      const fragments = []
      const skills = duty.getTemplate().getRelevantSkills()
      for (const skill_key in skills) {
        const skill = setup.skill[skill_key]
        if (unit.getSkillFocuses().includes(skill)) {
          fragments.push(html`${skill.rep()}`)
        }
      }

      const traits = duty.getTemplate().getRelevantTraits()

      for (const trait_key in traits) {
        const trait = setup.trait[trait_key]
        if (unit.isHasTraitExact(trait)) {
          if (traits[trait_key] > 0) {
            fragments.push(html`${trait.rep()}`)
          } else {
            fragments.push(html`${trait.repNegative()}`)
          }
        }
      }

      if (duty.getTemplate().isHasTriggerChance()) {
        fragments.push(html`
          Trigger chance: ${(duty.getTemplate().computeChanceForUnit(unit) * 100).toFixed(2)}%
        `)
      } else if (duty.getTemplate().isHasPrestigeAmount()) {
        fragments.push(html`
          ${setup.DOM.Util.prestige(duty.getTemplate().computeChanceForUnit(unit))}
        `)
      }

      menus.push(menuItemText({
        text: setup.DOM.create('div', {}, fragments),
      }))
      return menus
    },
  })
}

