import { rng } from "../../util/rng";
import type { Skill, SkillKey, SkillValuesArray } from "../Skill";
import type { Unit, UnitKey } from "./Unit";

export interface SkillBreakdown {
  value: number;
  title: string;
}

export namespace UnitSkillsHelper {
  /**
   * Get unit's cached trait value. Set it first if it was unset.
   */
  export function getOrCreateCachedValue(
    unit: Unit,
    varkey: string,
    callback: (unit: Unit) => SkillValuesArray,
  ): SkillValuesArray {
    let value = State.variables.cache.get<SkillValuesArray>(varkey, unit.key);
    if (!value) {
      value = callback(unit);
      State.variables.cache.set(varkey, unit.key, value);
    }
    return value;
  }

  export function resetSkillCache(unit_key: UnitKey) {
    State.variables.cache.clear("unitskillmodifiers", unit_key);
    State.variables.cache.clear("unitskillmodifiersbaseonly", unit_key);
    State.variables.cache.clear("unitskillsbase", unit_key);
    State.variables.cache.clear("unitskillsbaseignoreskillboost", unit_key);
    State.variables.cache.clear("unitskilladditives", unit_key);
    State.variables.cache.clear("unitskilladditivesbaseonly", unit_key);
    State.variables.cache.clear("unitskilladds", unit_key);
    State.variables.cache.clear("unitskilladdsbaseonly", unit_key);
    State.variables.cache.clear("unitskills", unit_key);
    State.variables.cache.clear("unitskillsbaseonly", unit_key);
  }

  export function computeSkillModifiers(
    unit: Unit,
    is_base_only?: boolean,
  ): SkillValuesArray {
    const breakdown = getSkillModifiersBreakdown.call(unit, is_base_only);
    const traitmodsum = setup.Skill.makeEmptySkills();
    for (let i = 0; i < traitmodsum.length; ++i) {
      traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0.0);
      if (traitmodsum[i] < setup.SKILL_MODIFIER_MIN_MULT) {
        traitmodsum[i] = setup.SKILL_MODIFIER_MIN_MULT;
      }
    }
    return traitmodsum;
  }

  export function computeSkillsBase(
    unit: Unit,
    ignore_skill_boost?: boolean,
  ): SkillValuesArray {
    const breakdown = getSkillsBaseBreakdown.call(unit, ignore_skill_boost);
    const traitmodsum = setup.Skill.makeEmptySkills();
    for (let i = 0; i < traitmodsum.length; ++i) {
      traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0);
    }
    return traitmodsum;
  }

  export function computeSkillAdditives(
    unit: Unit,
    is_base_only?: boolean,
  ): SkillValuesArray {
    const breakdown = getSkillAdditivesBreakdown.call(unit, is_base_only);
    const traitmodsum = setup.Skill.makeEmptySkills();
    for (let i = 0; i < traitmodsum.length; ++i) {
      traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0);
    }
    return traitmodsum;
  }

  export function computeSkillsAdd(
    unit: Unit,
    is_base_only?: boolean,
  ): SkillValuesArray {
    const nskills = setup.skill.length;
    const multipliers = unit.getSkillModifiers(is_base_only);
    const additives = unit.getSkillAdditives(is_base_only);
    const result = unit.getSkillsBase();
    const final = setup.Skill.makeEmptySkills();

    for (let i = 0; i < nskills; ++i) {
      final[i] = Math.floor(result[i] * multipliers[i]) + additives[i];
    }

    return final;
  }

  export function computeSkills(
    unit: Unit,
    is_base_only?: boolean,
  ): SkillValuesArray {
    const nskills = setup.skill.length;
    const result = unit.getSkillsBase();
    const final = setup.Skill.makeEmptySkills();

    const adds = unit.getSkillsAdd(is_base_only);
    for (let i = 0; i < nskills; ++i) {
      final[i] = result[i] + adds[i];
    }

    return final;
  }

  export function getSkillModifiersBreakdown(
    this: Unit,
    is_base_only?: boolean,
  ): Array<SkillBreakdown[]> {
    let traits;
    if (is_base_only) {
      traits = this.getBaseTraits();
    } else {
      traits = this.getAllTraits();
    }

    const breakdown: Array<SkillBreakdown[]> = [];
    for (let i = 0; i < setup.skill.length; ++i) {
      breakdown.push([]);
    }

    const isdemon = this.isHasTrait(setup.trait.race_demon);
    const is_perk_reduce_trauma = this.isHasTrait(
      setup.trait.perk_reduce_trauma,
    );
    const is_perk_reduce_corruption = this.isHasTrait(
      setup.trait.perk_reduce_corruption,
    );
    const is_perk_increase_boon = this.isHasTrait(
      setup.trait.perk_increase_boon,
    );
    const is_perk_needy_bottom = this.isHasTrait(setup.trait.perk_needy_bottom);

    for (const trait of traits) {
      // demons ignore demonic bodypart penalty
      if (isdemon && trait.isCorruption()) {
        continue;
      }

      const traitmod = trait.getSkillBonuses();

      let modifier = 1.0;

      // check for needy bottom
      if (
        is_perk_needy_bottom &&
        [setup.trait.anus_gape, setup.trait.vagina_gape].includes(trait)
      ) {
        modifier *= -1;
      }

      // check for reduce trauma, corruption or increase boon effects
      if (is_perk_reduce_trauma && trait.getTags().includes("trauma")) {
        modifier *= 1.0 - setup.PERK_TRAUMA_PENALTY_REDUCTION;
      }

      if (is_perk_reduce_corruption && trait.isCorruption()) {
        modifier *= 1.0 - setup.PERK_CORRUPTION_PENALTY_REDUCTION;
      }

      if (is_perk_increase_boon && trait.getTags().includes("boon")) {
        modifier *= 1.0 + setup.PERK_BOON_BONUS_INCREASE;
      }

      for (let j = 0; j < traitmod.length; ++j) {
        const total = traitmod[j] * modifier;
        if (Math.abs(total * modifier) > Number.EPSILON) {
          breakdown[j].push({
            value: total,
            title: trait.rep(),
          });
        }
      }
    }

    if (!is_base_only) {
      const equipmentset = this.getEquipmentSet();
      if (equipmentset) {
        const eqmod = equipmentset.getSkillMods();
        for (let j = 0; j < eqmod.length; ++j) {
          if (eqmod[j]) {
            breakdown[j].push({
              value: eqmod[j],
              title: equipmentset.rep(),
            });
          }
        }
      }
    }
    return breakdown;
  }

  export function getSkillsBaseBreakdown(
    this: Unit,
    ignore_skill_boost?: boolean,
  ): Array<SkillBreakdown[]> {
    const result: Array<SkillBreakdown[]> = [];
    for (let i = 0; i < setup.skill.length; ++i) {
      result.push([]);
    }

    const base = this.skills;
    const initial = this.base_skills;
    for (let i = 0; i < setup.skill.length; ++i) {
      result[i].push({
        value: initial[i],
        title: "Innate",
      });
      const level_up = base[i] - initial[i];
      if (level_up) {
        result[i].push({
          value: level_up,
          title: "Level up",
        });
      }
    }

    if (!ignore_skill_boost && State.variables.skillboost.isHasAnyBoost(this)) {
      const boosts = State.variables.skillboost.getBoosts(this);
      for (let i = 0; i < boosts.length; ++i) {
        if (boosts[i]) {
          result[i].push({
            value: boosts[i],
            title: "Boost",
          });
        }
      }
    }
    return result;
  }

  export function getSkillAdditivesBreakdown(
    this: Unit,
    is_base_only?: boolean,
  ): Array<SkillBreakdown[]> {
    const result: Array<SkillBreakdown[]> = [];
    for (let i = 0; i < setup.skill.length; ++i) {
      result.push([]);
    }

    if (!is_base_only) {
      // vice leader effect
      if (this == State.variables.unit.player) {
        const viceleaderduty = State.variables.dutylist.getDuty("viceleader");
        const viceleader_unit = viceleaderduty?.getAssignedUnit();
        if (viceleader_unit) {
          const vicestats = viceleader_unit.getSkills(
            /* is base only = */ true,
          );
          for (let i = 0; i < vicestats.length; ++i) {
            const bonus = Math.floor(
              vicestats[i] * setup.VICELEADER_SKILL_MULTI,
            );
            if (bonus) {
              result[i].push({
                value: bonus,
                title: `Vice leader ${viceleader_unit.rep()}`,
              });
            }
          }
        }
      }

      // get friendship/rivalry bonuses
      const best_friend = State.variables.friendship.getBestFriend(this);
      if (best_friend) {
        let boost = false;
        if (this.isSlaver() && best_friend.isSlaver()) {
          boost = true;
        }
        if (boost) {
          const friendship = State.variables.friendship.getFriendship(
            this,
            best_friend,
          );
          const friendskill = best_friend.getSkills(/* is base only = */ true);
          const myskill = this.getSkills(/* is base only = */ true);
          const is_lovers =
            State.variables.friendship.isLoversWithBestFriend(this);

          if (friendship > 0 || is_lovers) {
            // friendship bonus
            const boost_amount =
              (setup.FRIENDSHIP_MAX_SKILL_GAIN * Math.abs(friendship)) / 1000;
            for (let i = 0; i < friendskill.length; ++i) {
              if (friendskill[i] > myskill[i]) {
                const boost_amt = Math.floor(
                  boost_amount * (friendskill[i] - myskill[i]),
                );
                if (boost_amt) {
                  result[i].push({
                    value: boost_amt,
                    title: `Friendship: ${best_friend.rep()}`,
                  });
                }
              }
            }
          }

          if (friendship < 0 || is_lovers) {
            // rivalry bonus
            const boost_amount =
              (setup.RIVALRY_MAX_SKILL_GAIN * Math.abs(friendship)) / 1000;
            for (let i = 0; i < friendskill.length; ++i) {
              if (friendskill[i] < myskill[i]) {
                const boost_amt = Math.floor(boost_amount * friendskill[i]);
                if (boost_amt) {
                  result[i].push({
                    value: boost_amt,
                    title: `Rivalry: ${best_friend.rep()}`,
                  });
                }
              }
            }
          }
        }
      }

      // get bedchamber bonuses
      const rooms = State.variables.bedchamberlist.getBedchambers({
        slaver: this,
      });
      if (rooms.length) {
        const buffs = Array(setup.skill.length).fill(0);
        for (let i = 0; i < rooms.length; ++i) {
          const thisbuffs = rooms[i].getSkillAddition();
          for (let j = 0; j < setup.skill.length; ++j) {
            buffs[j] = Math.max(buffs[j], thisbuffs[j]);
          }
        }
        for (let i = 0; i < setup.skill.length; ++i) {
          if (buffs[i]) {
            result[i].push({
              value: buffs[i],
              title: `Bedchamber`,
            });
          }
        }
      }

      // get title bonuses
      const title_bonus = State.variables.titlelist.computeSkillAdds(this);
      for (let j = 0; j < title_bonus.length; ++j) {
        if (title_bonus[j]) {
          result[j].push({
            value: title_bonus[j],
            title: `Titles`,
          });
        }
      }

      // get room bonuses
      const room_bonuses = State.variables.roomlist.getTotalSkillBonuses();
      for (let i = 0; i < room_bonuses.length; ++i) {
        if (room_bonuses[i]) {
          result[i].push({
            value: room_bonuses[i],
            title: `Fort`,
          });
        }
      }
    }

    return result;
  }

  export function setSkillFocus(this: Unit, index: number, skill: Skill): void {
    initSkillFocuses.call(this);

    if (index < 0 || index >= this.skill_focus_keys!.length) {
      throw new Error(`index out of range for set skill focus`);
    }
    if (!skill) {
      throw new Error(`skill not found for set skill focus`);
    }
    this.skill_focus_keys![index] = skill.key;
  }

  export function getRandomSkillIncreases(this: Unit): SkillValuesArray {
    let skill_focuses = this.getSkillFocuses();
    let increases: SkillValuesArray = Array(setup.skill.length).fill(0);
    let remain = setup.SKILL_INCREASE_PER_LEVEL;

    for (let i = 0; i < skill_focuses.length; ++i) {
      let sf = skill_focuses[i];
      if (increases[sf.key]) continue;
      increases[sf.key] = 1;
      remain -= 1;
    }

    for (let i = 0; i < skill_focuses.length; ++i) {
      let sf = skill_focuses[i];
      if (Math.random() < setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE) {
        increases[sf.key] += 1;
        remain -= 1;
      }
    }

    let current_skills = this.getSkills(/* base only = */ true);
    while (remain) {
      let eligible: Array<[SkillKey, number]> = [];
      for (let i = 0; i < setup.skill.length; ++i) {
        if (increases[i] == 0) {
          eligible.push([
            i as SkillKey,
            Math.max(1, current_skills[i] - setup.SKILL_INCREASE_BASE_OFFSET),
          ]);
        }
      }
      rng.normalizeChanceArray(eligible);
      let res = rng.sampleArray(eligible)!;
      increases[res] += 1;
      remain -= 1;
    }
    return increases;
  }

  export function getSkillFocuses(this: Unit, is_not_sort?: boolean) {
    initSkillFocuses.call(this);

    const skill_focuses = this.skill_focus_keys!.map(
      (skill_focus_key) => setup.skill[skill_focus_key],
    );
    if (!is_not_sort) skill_focuses.sort(setup.Skill.cmp);
    return skill_focuses;
  }

  function _increaseSkill(this: Unit, skill: Skill, amt: number) {
    //let verb = "increased";
    //if (amt < 0) verb = "decreased";
    this.skills[skill.key] += amt;
    this.resetCache();
  }

  export function increaseSkills(this: Unit, skill_gains: SkillValuesArray) {
    if (!Array.isArray(skill_gains))
      throw new Error(`Skill gains must be array, not ${skill_gains}`);
    for (let i = 0; i < skill_gains.length; ++i)
      if (skill_gains[i]) {
        _increaseSkill.call(this, setup.skill[i], skill_gains[i]);
      }
  }

  function initSkillFocuses(this: Unit) {
    // compute initial skill focuses if it has not already been computed before.

    if (this.skill_focus_keys?.length) {
      return;
    }

    let skills = this.getSkillModifiers();
    let skill_idx = [];
    for (let i = 0; i < skills.length; ++i) {
      skill_idx.push([i, skills[i]]);
    }
    setup.rng.shuffleArray(skill_idx);
    skill_idx.sort((a, b) => b[1] - a[1]);

    let skill0 = setup.skill[skill_idx[0][0]];
    let skill1 = setup.skill[skill_idx[1][0]];
    let skill2 = setup.skill[skill_idx[2][0]];

    if (Math.random() < setup.SKILL_TRIPLE_FOCUS_CHANCE) {
      this.skill_focus_keys = [skill0.key, skill0.key, skill0.key];
    } else if (Math.random() < setup.SKILL_DOUBLE_FOCUS_CHANCE) {
      this.skill_focus_keys = [skill0.key, skill0.key, skill1.key];
    } else {
      this.skill_focus_keys = [skill0.key, skill1.key, skill2.key];
    }
    this.resetCache();
  }
}
