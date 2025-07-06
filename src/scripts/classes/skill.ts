// @ts-nocheck

setup.SkillHelper = {}

setup.Skill = class Skill extends setup.TwineClass {
  /**
   * @param {string} keyword
   * @param {string} name
   * @param {string} description
   */
  constructor(keyword, name, description) {
    super()

    this.key = setup.skill.length
    this.keyword = keyword
    this.name = name
    this.description = description

    if (keyword in setup.skill) throw new Error(`Duplicate role ${keyword}`)
    setup.skill[keyword] = this
    setup.skill.push(this)
  }

  getName() { return this.name }

  getDescription() { return this.description }

  getImage() {
    // Apparently ad-block does not like social.png, so this had to be renamed.
    if (this.keyword == 'social') {
      return `img/role/sc.svg`
    } else {
      return `img/role/${this.keyword}.svg`
    }
  }

  getImageRep() {
    return setup.repImgIcon(this.getImage())
  }

  rep() {
    return setup.repImgIcon(this.getImage(), `<<tooltipskill '${this.key}'>>`)
  }

  repPositive() {
    return `<span class='skillcardglow'>${this.rep()}</span>`
  }

  /**
   * @param {array | object} array_or_obj
   * @returns {number[]}
   */
  static translate(array_or_obj) {
    // translates array or object skill into array
    // e.g., [1, 2, 3, 4, 5, ...] or {'brawn': 1}
    if (Array.isArray(array_or_obj)) {
      if (array_or_obj.length != setup.skill.length) throw new Error(`${array_or_obj} length not correct`)
      return array_or_obj
    }
    let result = Array(setup.skill.length).fill(0)
    for (let key in array_or_obj) {
      if (!(key in setup.skill)) throw new Error(`Unrecognized skill: ${key}`)
      let skill = setup.skill[key]
      result[skill.key] = array_or_obj[key]
    }
    return result
  }

  /**
   * @return {Skills}
   */
  static makeEmptySkills() {
    return Array(setup.skill.length).fill(0)
  }
}


setup.SkillHelper.explainSkillMods = function (skill_mod_array_raw, is_hide_skills, is_no_mult) { // given [0, 1, 2, 4, ...] explain it.
  let skill_array = setup.Skill.translate(skill_mod_array_raw)
  let texts = []
  let mid = ' x '
  if (is_no_mult) mid = ' '
  for (let i = 0; i < skill_array.length; ++i) {
    if (skill_array[i]) {
      let image_rep = setup.skill[i].rep()
      if (is_hide_skills) {
        image_rep = setup.skill[i].getName()
      }
      let sign = ''
      if (skill_array[i] > 0) sign = '+'
      let percent = Math.round(skill_array[i] * 100)
      let fixed = 1
      if (percent % 10) fixed = 2
      let vtext = `${sign}${(percent / 100).toFixed(fixed)}`
      if (!is_hide_skills) {
        if (sign == '+') {
          vtext = setup.DOM.toString(setup.DOM.Text.successlite(vtext))
        } else if (vtext.startsWith('-')) {
          vtext = setup.DOM.toString(setup.DOM.Text.dangerlite(vtext))
        }
      }
      texts.push(
        `${vtext}${mid}${image_rep}`
      )
    }
  }
  return texts.join('║')
}

setup.SkillHelper.explainSkillModsShort = function (skill_mod_array_raw, is_hide_skills, unit) {
  // given [0, 1, 2, 4, ...] explain it.
  let skill_array = setup.Skill.translate(skill_mod_array_raw)
  let texts = []
  for (let i = 0; i < skill_array.length; ++i) {
    if (skill_array[i]) {
      let image_rep = setup.skill[i].rep()
      if (is_hide_skills) {
        image_rep = setup.skill[i].getName()
      }
      if (unit && unit.getSkillFocuses().includes(setup.skill[i])) {
        image_rep = `${setup.skill[i].repPositive()}`
      }
      texts.push(
        `${image_rep}`
      )
      for (let j = 2; j <= skill_array[i] + 0.0000001; ++j) {
        texts.push(
          `${image_rep}`
        )
      }
    }
  }
  return texts.join('')
}


/**
 * @param {setup.Unit} unit
 * @param {setup.Skill} skill
 * @returns {string}
 */
setup.SkillHelper.explainSkillWithAdditive = function (unit, skill) {
  const image_rep = skill.rep()
  const innate_add = State.variables.skillboost.getBoosts(unit)[skill.key]
  const val = unit.getSkillsBase()[skill.key]
  const add = unit.getSkillsAdd()[skill.key]

  let val_text
  if (innate_add) {
    val_text = setup.DOM.toString(setup.DOM.Text.infolite(`${val}`))
  } else {
    val_text = `${val}`
  }

  let add_text = ''
  if (add > 0) {
    add_text += setup.DOM.toString(setup.DOM.Text.successlite(`+${add}`))
  } else if (add < 0) {
    add_text += setup.DOM.toString(setup.DOM.Text.dangerlite(`-${-add}`))
  }

  const tooltip = `<<unitskillcardkey "${unit.key}" ${skill.key}>>`
  if (!State.variables.settings.summarizeunitskills) {
    return `<span data-tooltip='${tooltip}'>${val_text}${add_text}</span> ${image_rep}`
  } else {
    let base = `${unit.getSkill(skill)}`
    if (innate_add > 0 && add >= 0) {
      base = setup.DOM.toString(setup.DOM.Text.infolite(base))
    } else if (add > 0) {
      base = setup.DOM.toString(setup.DOM.Text.successlite(base))
    } else if (add < 0) {
      base = setup.DOM.toString(setup.DOM.Text.dangerlite(base))
    } else {
    }
    return `<span data-tooltip='${tooltip}'>${base}</span> ${image_rep}`
  }
}

/**
 * @param {setup.Unit} unit 
 */
setup.SkillHelper.explainSkillsWithAdditives = function (unit) {
  const skill_array = unit.getSkillsBase(/* ignore skill boosts = */ true)
  let texts = []
  for (let i = 0; i < skill_array.length; ++i) {
    if (skill_array[i]) {
      texts.push(setup.SkillHelper.explainSkillWithAdditive(unit, setup.skill[i]))
    }
  }
  return texts.join('║')
}

setup.SkillHelper.explainSkills = function (skill_array_raw, is_hide_skills, is_to_fixed) {
  // given [0, 1, 2, 4, ...] explain it.
  const skill_array = setup.Skill.translate(skill_array_raw)
  const texts = []
  for (let i = 0; i < skill_array.length; ++i) {
    if (skill_array[i]) {
      let image_rep = setup.skill[i].rep()
      if (is_hide_skills) {
        image_rep = setup.skill[i].getName()
      }
      let val
      if (is_to_fixed) {
        val = skill_array[i].toFixed(1)
      } else {
        val = Math.round(skill_array[i])
      }
      texts.push(
        `${val} ${image_rep}`
      )
    }
  }
  return texts.join('║')
}


setup.SkillHelper.explainSkillsCopy = function (skill_array_raw) {
  // given [1, 0, 2, 1], output [brawn][surv][surv][intrigue]
  // must be integers
  let skill_array = setup.Skill.translate(skill_array_raw)
  let text = ''
  for (let i = 0; i < skill_array.length; ++i) {
    if (skill_array[i]) {
      let skill = setup.skill[i]
      for (let j = 0; j < skill_array[i]; ++j) {
        text += skill.rep()
      }
    }
  }
  return text
}



setup.Skill_Cmp = function (skill1, skill2) {
  if (skill1.key < skill2.key) return -1
  if (skill1.key > skill2.key) return 1
  return 0
}


// gives a score check between unit a and unit b in skill c.
// return 2 for crit win for a, 1 for win for a, -1, for lose for a, -2 for crit lose for a
// cannot draw
setup.Skill.skillCheckCompare = function (unit1, unit2, skill) {
  let skill1 = unit1.getSkill(skill)
  let skill2 = unit2.getSkill(skill)
  let rolls = 3
  let wins = 0
  for (let i = 0; i < rolls; ++i) {
    let score1 = skill1 / 2 + Math.random() * (skill1 / 2)
    let score2 = skill2 / 2 + Math.random() * (skill2 / 2)
    if (score1 > score2) wins += 1
  }
  if (wins == 3) return 2
  if (wins == 2) return 1
  if (wins == 1) return -1
  return -2
}
