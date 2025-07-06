// @ts-nocheck

/**
 * @param {boolean} is_base_only 
 * @returns {Array<SkillBreakdown[]>}
 */
setup.Unit.prototype.getSkillModifiersBreakdown = function (is_base_only) {
  let traits
  if (is_base_only) {
    traits = this.getBaseTraits()
  } else {
    traits = this.getAllTraits()
  }

  /**
   * @type {Array<SkillBreakdown[]>}
   */
  const breakdown = []
  for (let i = 0; i < setup.skill.length; ++i) {
    breakdown.push([])
  }

  const isdemon = this.isHasTrait(setup.trait.race_demon)
  const is_perk_reduce_trauma = this.isHasTrait(setup.trait.perk_reduce_trauma)
  const is_perk_reduce_corruption = this.isHasTrait(setup.trait.perk_reduce_corruption)
  const is_perk_increase_boon = this.isHasTrait(setup.trait.perk_increase_boon)
  const is_perk_needy_bottom = this.isHasTrait(setup.trait.perk_needy_bottom)

  for (const trait of traits) {
    // demons ignore demonic bodypart penalty
    if (isdemon && trait.isCorruption()) {
      continue
    }

    const traitmod = trait.getSkillBonuses()

    let modifier = 1.0

    // check for needy bottom
    if (is_perk_needy_bottom && [setup.trait.anus_gape, setup.trait.vagina_gape].includes(trait)) {
      modifier *= -1
    }

    // check for reduce trauma, corruption or increase boon effects
    if (is_perk_reduce_trauma && trait.getTags().includes('trauma')) {
      modifier *= (1.0 - setup.PERK_TRAUMA_PENALTY_REDUCTION)
    }

    if (is_perk_reduce_corruption && trait.isCorruption()) {
      modifier *= (1.0 - setup.PERK_CORRUPTION_PENALTY_REDUCTION)
    }

    if (is_perk_increase_boon && trait.getTags().includes('boon')) {
      modifier *= (1.0 + setup.PERK_BOON_BONUS_INCREASE)
    }

    for (let j = 0; j < traitmod.length; ++j) {
      const total = traitmod[j] * modifier
      if (Math.abs(total * modifier) > Number.EPSILON) {
        breakdown[j].push({
          value: total,
          title: trait.rep(),
        })
      }
    }
  }

  if (!is_base_only) {
    const equipmentset = this.getEquipmentSet()
    if (equipmentset) {
      const eqmod = equipmentset.getSkillMods()
      for (let j = 0; j < eqmod.length; ++j) {
        if (eqmod[j]) {
          breakdown[j].push({
            value: eqmod[j],
            title: equipmentset.rep()
          })
        }
      }
    }
  }
  return breakdown
}

/**
 * @param {boolean} [ignore_skill_boost]
 * @returns {Array<SkillBreakdown[]>}
 */
setup.Unit.prototype.getSkillsBaseBreakdown = function (ignore_skill_boost) {
  /**
   * @type {Array<SkillBreakdown[]>}
   */
  const result = []
  for (let i = 0; i < setup.skill.length; ++i) {
    result.push([])
  }

  const base = this.skills
  const initial = this.base_skills
  for (let i = 0; i < setup.skill.length; ++i) {
    result[i].push({
      value: initial[i],
      title: 'Base',
    })
    const level_up = base[i] - initial[i]
    if (level_up) {
      result[i].push({
        value: level_up,
        title: 'Level up',
      })
    }
  }

  if (!ignore_skill_boost && State.variables.skillboost.isHasAnyBoost(this)) {
    const boosts = State.variables.skillboost.getBoosts(this)
    for (let i = 0; i < boosts.length; ++i) {
      if (boosts[i]) {
        result[i].push({
          value: boosts[i],
          title: 'Boost',
        })
      }
    }
  }
  return result
}


/**
 * @param {boolean} is_base_only 
 * @returns {Array<SkillBreakdown[]>}
 */
setup.Unit.prototype.getSkillAdditivesBreakdown = function (is_base_only) {
  /**
   * @type {Array<SkillBreakdown[]>}
   */
  const result = []
  for (let i = 0; i < setup.skill.length; ++i) {
    result.push([])
  }

  if (!is_base_only) {
    // vice leader effect
    if (this == State.variables.unit.player) {
      const viceleader = State.variables.dutylist.getDuty('viceleader')
      if (viceleader && viceleader.getAssignedUnit()) {
        const viceleader_unit = viceleader.getAssignedUnit()
        const vicestats = viceleader_unit.getSkills(/* is base only = */ true)
        for (let i = 0; i < vicestats.length; ++i) {
          const bonus = Math.floor(vicestats[i] * setup.VICELEADER_SKILL_MULTI)
          if (bonus) {
            result[i].push({
              value: bonus,
              title: `Vice leader ${viceleader_unit.rep()}`
            })
          }
        }
      }
    }

    // get friendship/rivalry bonuses
    const best_friend = State.variables.friendship.getBestFriend(this)
    if (best_friend) {
      let boost = false
      if (this.isSlaver() && best_friend.isSlaver()) {
        boost = true
      }
      if (boost) {
        const friendship = State.variables.friendship.getFriendship(this, best_friend)
        const friendskill = best_friend.getSkills(/* is base only = */ true)
        const myskill = this.getSkills(/* is base only = */ true)
        const is_lovers = State.variables.friendship.isLoversWithBestFriend(this)

        if (friendship > 0 || is_lovers) {
          // friendship bonus
          const boost_amount = setup.FRIENDSHIP_MAX_SKILL_GAIN * Math.abs(friendship) / 1000
          for (let i = 0; i < friendskill.length; ++i) {
            if (friendskill[i] > myskill[i]) {
              const boost_amt = Math.floor(boost_amount * (friendskill[i] - myskill[i]))
              if (boost_amt) {
                result[i].push({
                  value: boost_amt,
                  title: `Friendship: ${best_friend.rep()}`,
                })
              }
            }
          }
        }

        if (friendship < 0 || is_lovers) {
          // rivalry bonus
          const boost_amount = setup.RIVALRY_MAX_SKILL_GAIN * Math.abs(friendship) / 1000
          for (let i = 0; i < friendskill.length; ++i) {
            if (friendskill[i] < myskill[i]) {
              const boost_amt = Math.floor(boost_amount * friendskill[i])
              if (boost_amt) {
                result[i].push({
                  value: boost_amt,
                  title: `Rivalry: ${best_friend.rep()}`
                })
              }
            }
          }
        }
      }
    }

    // get bedchamber bonuses
    const rooms = State.variables.bedchamberlist.getBedchambers({ slaver: this })
    if (rooms.length) {
      const buffs = Array(setup.skill.length).fill(0)
      for (let i = 0; i < rooms.length; ++i) {
        const thisbuffs = rooms[i].getSkillAddition()
        for (let j = 0; j < setup.skill.length; ++j) {
          buffs[j] = Math.max(buffs[j], thisbuffs[j])
        }
      }
      for (let i = 0; i < setup.skill.length; ++i) {
        if (buffs[i]) {
          result[i].push({
            value: buffs[i],
            title: `Bedchamber`,
          })
        }
      }
    }

    // get title bonuses
    const title_bonus = State.variables.titlelist.computeSkillAdds(this)
    for (let j = 0; j < title_bonus.length; ++j) {
      if (title_bonus[j]) {
        result[j].push({
          value: title_bonus[j],
          title: `Titles`,
        })
      }
    }

    // get room bonuses
    const room_bonuses = State.variables.roomlist.getTotalSkillBonuses()
    for (let i = 0; i < room_bonuses.length; ++i) {
      if (room_bonuses[i]) {
        result[i].push({
          value: room_bonuses[i],
          title: `Fort`
        })
      }
    }
  }

  return result
}


setup.Unit.prototype.getSkill = function (skill) {
  return this.getSkills()[skill.key]
}

setup.Unit.prototype.setSkillFocus = function (index, skill) {
  this.initSkillFocuses()

  if (index < 0 || index >= this.skill_focus_keys.length) throw new Error(`index out of range for set skill focus`)
  if (!skill) throw new Error(`skill not found for set skill focus`)
  this.skill_focus_keys[index] = skill.key
}


setup.Unit.prototype.getRandomSkillIncreases = function () {
  let skill_focuses = this.getSkillFocuses()
  let increases = Array(setup.skill.length).fill(0)
  let remain = setup.SKILL_INCREASE_PER_LEVEL

  for (let i = 0; i < skill_focuses.length; ++i) {
    let sf = skill_focuses[i]
    if (increases[sf.key]) continue
    increases[sf.key] = 1
    remain -= 1
  }

  for (let i = 0; i < skill_focuses.length; ++i) {
    let sf = skill_focuses[i]
    if (Math.random() < setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE) {
      increases[sf.key] += 1
      remain -= 1
    }
  }

  let current_skills = this.getSkills(/* base only = */ true)
  while (remain) {
    /**
     * @type {Array<[number, number]>}
     */
    let eligible = []
    for (let i = 0; i < setup.skill.length; ++i) {
      if (increases[i] == 0) {
        eligible.push([i, Math.max(1, current_skills[i] - setup.SKILL_INCREASE_BASE_OFFSET)])
      }
    }
    setup.rng.normalizeChanceArray(eligible)
    let res = setup.rng.sampleArray(eligible)
    increases[res] += 1
    remain -= 1
  }
  return increases
}


setup.Unit.prototype.getSkillFocuses = function (is_not_sort) {
  this.initSkillFocuses()

  const skill_focuses = this.skill_focus_keys.map(skill_focus_key => setup.skill[skill_focus_key])
  if (!is_not_sort) skill_focuses.sort(setup.Skill_Cmp)
  return skill_focuses
}


setup.Unit.prototype._increaseSkill = function (skill, amt) {
  let verb = 'increased'
  if (amt < 0) verb = 'decreased'
  this.skills[skill.key] += amt
  this.resetCache()
}


setup.Unit.prototype.increaseSkills = function (skill_gains) {
  if (!Array.isArray(skill_gains)) throw new Error(`Skill gains must be array, not ${skill_gains}`)
  for (let i = 0; i < skill_gains.length; ++i) if (skill_gains[i]) {
    this._increaseSkill(setup.skill[i], skill_gains[i])
  }
}


setup.Unit.prototype.initSkillFocuses = function () {
  // compute initial skill focuses if it has not already been computed before.

  if (this.skill_focus_keys && this.skill_focus_keys.length) {
    return
  }

  let skills = this.getSkillModifiers()
  let skill_idx = []
  for (let i = 0; i < skills.length; ++i) {
    skill_idx.push([i, skills[i]])
  }
  setup.rng.shuffleArray(skill_idx)
  skill_idx.sort((a, b) => b[1] - a[1])

  let skill0 = setup.skill[skill_idx[0][0]]
  let skill1 = setup.skill[skill_idx[1][0]]
  let skill2 = setup.skill[skill_idx[2][0]]

  if (Math.random() < setup.SKILL_TRIPLE_FOCUS_CHANCE) {
    this.skill_focus_keys = [
      skill0.key,
      skill0.key,
      skill0.key,
    ]
  } else if (Math.random() < setup.SKILL_DOUBLE_FOCUS_CHANCE) {
    this.skill_focus_keys = [
      skill0.key,
      skill0.key,
      skill1.key,
    ]
  } else {
    this.skill_focus_keys = [
      skill0.key,
      skill1.key,
      skill2.key,
    ]
  }
  this.resetCache()
}
