import { Constants } from "../../constants";
import { TraitHelper, type Trait, type TraitKey } from "../trait/Trait";
import type { TraitGroup } from "../trait/TraitGroup";
import type { Unit } from "./Unit";

export namespace UnitTraitsHelper {
  export function addTrait(
    this: Unit,
    trait: Trait | null,
    trait_group?: TraitGroup | null,
    is_replace?: boolean,
  ) {
    // effectively, give trait to unit.
    // there are caveats. First, if trait is from a trait group with is_not_ordered = false,
    // then, will either increase or decrease the trait "value":
    // if trait is a positive trait, then will increase it. Otherwise, will decrease it.
    // otherwise, will replace trait.

    // trait_group can be null, which will default to trait.getTraitGroup()

    // trait can be null, but trait_group must be non null in this case.
    // e.g., if you want to neutralize muscle traitgroups

    // is_replace=True means that forces the replace behavior, even when is_not_ordered = true

    // return the newly added trait, if any.

    // first sanity check
    if (!trait && !trait_group)
      throw new Error(
        `Must have either non null trait or non null trait group`,
      );

    if (trait) {
      if (trait_group) {
        if (trait.getTraitGroup() != trait_group)
          throw new Error(`Incorrect trait group for ${trait.key}`);
      } else {
        trait_group = trait.getTraitGroup();
      }
      if (!trait.isAttachable()) {
        throw new Error(
          `Cannot add trait ${trait.key} because it is not an attachable trait`,
        );
      }
    }

    // get the trait
    let new_trait = trait;
    if (trait_group && !is_replace && trait_group.isOrdered()) {
      new_trait = trait_group.computeResultingTrait(this, trait);
    }

    // check for blessing of virginity and curse of agape
    if (
      new_trait &&
      (new_trait.getTags().includes("vagina") ||
        new_trait.getTags().includes("anus"))
    ) {
      // check that it actually tightens it
      const trait_group = new_trait.getTraitGroup()!;
      const original = this.getTraitFromTraitGroup(trait_group);
      const distance =
        trait_group._getTraitIndex(new_trait) -
        trait_group._getTraitIndex(original);
      if (distance < 0) {
        // tightening
        if (this.isHasTrait(setup.trait.curse_agape1)) {
          this.decreaseTrait(setup.trait.curse_agape8.getTraitGroup()!);
          let vagina;
          if (new_trait.getTags().includes("vagina")) {
            vagina = "vagina";
          } else {
            vagina = "anus";
          }
          if (this.isYourCompany()) {
            setup.notify(
              `a|Reps Curse of Agape prevents a|their ${vagina} from being tightened`,
              { a: this },
            );
          }
          return null;
        }
      } else if (distance > 0) {
        // gaping
        // prevent with blessing of virginity, if the unit has it
        if (this.isHasTrait(`blessing_virginity${distance}` as TraitKey)) {
          for (let i = 0; i < distance; ++i) {
            this.decreaseTrait(
              setup.trait.blessing_virginity8.getTraitGroup()!,
            );
          }
          let vagina;
          if (new_trait.getTags().includes("vagina")) {
            vagina = "vagina";
          } else {
            vagina = "anus";
          }
          if (this.isYourCompany()) {
            setup.notify(
              `a|Reps Blessing of Virginity prevents a|their ${vagina} from being gaped`,
              { a: this },
            );
          }
          return null;
        }
      }
    }

    // check for blessing of wolf and curse of lamb
    {
      const sub = setup.trait.per_submissive;
      const dom = setup.trait.per_dominant;
      if (trait_group && [sub, dom].includes(trait_group.getTraits()[0]!)) {
        if (
          (new_trait == sub && !this.isHasTrait(sub)) ||
          (!new_trait && this.isHasTrait(dom))
        ) {
          // gaining sub or losing dom
          if (this.isHasTrait(setup.trait.blessing_wolf1)) {
            this.decreaseTrait(setup.trait.blessing_wolf8.getTraitGroup()!);
            if (this.isYourCompany()) {
              setup.notify(
                `a|Reps Blessing of Wolf prevents a|them from becoming more submissive`,
                { a: this },
              );
            }
            return null;
          }
        } else if (
          (new_trait == dom && !this.isHasTrait(dom)) ||
          (!new_trait && this.isHasTrait(sub))
        ) {
          // losing sub or gaining dom
          if (this.isHasTrait(setup.trait.curse_lamb1)) {
            this.decreaseTrait(setup.trait.curse_lamb8.getTraitGroup()!);
            if (this.isYourCompany()) {
              setup.notify(
                `a|Reps Curse of Lamb prevents a|them from becoming more dominant`,
                { a: this },
              );
            }
            return null;
          }
        }
      }
    }

    // remove conflicting traits
    if (trait_group) {
      let remove_traits = trait_group.getTraits();
      for (let i = 0; i < remove_traits.length; ++i) {
        let remove_trait = remove_traits[i];
        if (
          remove_trait &&
          this.isHasRemovableTrait(remove_trait) &&
          remove_trait != new_trait
        ) {
          this.removeTraitExact(remove_trait);
          if (this.isYourCompany()) {
            setup.notify(
              `a|Rep <<dangertext 'a|lose'>> ${remove_trait.rep()}`,
              { a: this },
            );
          }
        }
      }
    }

    // add trait
    let assigned_trait = null;

    if (new_trait && !this.isHasRemovableTrait(new_trait)) {
      // if it's a new trait that has a limit, check if the limit is already reached
      let tag_limit_reached = false;
      for (const tag of new_trait.getTags()) {
        if (tag in Constants.TRAIT_MAX_HAVE) {
          const limit =
            Constants.TRAIT_MAX_HAVE[
              tag as keyof typeof Constants.TRAIT_MAX_HAVE
            ];
          const current = this.getAllTraitsWithTag(tag).filter((trait) =>
            this.isHasRemovableTrait(trait),
          );
          if (current.length >= limit) {
            tag_limit_reached = true;
            if (this.isYourCompany() || State.variables.gDebug) {
              if (new_trait.getTags().includes("perk")) {
                setup.notify(
                  `a|Rep <<dangertext 'a|fail'>> to gain ${new_trait.rep()} because a|they already a|have too many perks! You can reset a|their perks using the ${setup.item.potion_perk.rep()}.`,
                  { a: this },
                );
              } else {
                setup.notify(
                  `a|Rep <<dangertext 'a|fail'>> to gain ${new_trait.rep()} because a|they already a|have too many traits of this same type`,
                  { a: this },
                );
              }
            }
            break;
          }
        }
      }

      if (!tag_limit_reached) {
        // Do the actual getting new trait code
        this.trait_key_map[new_trait.key] = 1;
        assigned_trait = new_trait;

        // Hide traits added to mindbroken units.
        const trait_visible =
          !this.isMindbroken() || removeMindbrokenTraits([new_trait]).length;

        if ((trait_visible && this.isYourCompany()) || State.variables.gDebug) {
          setup.notify(`a|Rep <<successtext 'a|gain'>> ${new_trait.rep()}`, {
            a: this,
          });
        }
      }
    }

    this.resetCache();

    return assigned_trait;
  }

  /**
   * Filters out traits that are incompatible with mindbroken state
   */
  export function removeMindbrokenTraits(traits: Trait[]): Trait[] {
    const disabled_traits_base = ["per", "skill", "perk"];
    return traits
      .filter((trait) => !trait.getTags().includesAny(disabled_traits_base))
      .filter((trait) => trait != setup.trait.will_defiant)
      .filter(
        (trait) =>
          trait == setup.trait.training_mindbreak ||
          !trait.getTags().includes("training"),
      );
  }

  export function doCorrupt({
    unit,
    trait_tag,
    is_return_anyways,
    is_ignore_blessing,
  }: {
    unit: Unit;
    trait_tag?: string | null;
    is_return_anyways?: boolean;
    is_ignore_blessing?: boolean;
  }): Trait | null {
    {
      // if unit has blessing of purity, use it
      if (
        !is_ignore_blessing &&
        unit.isHasTrait(setup.trait.blessing_purity1)
      ) {
        unit.decreaseTrait(setup.trait.blessing_purity1.getTraitGroup()!);
        if (unit.isYourCompany()) {
          setup.notify(
            `a|Reps Blessing of Purity prevents an impending corruption`,
            { a: unit },
          );
        }
        return null;
      }
    }

    if (unit.isSlaver()) {
      State.variables.statistics.add("corruptions_slaver", 1);
    } else if (unit.isSlave()) {
      State.variables.statistics.add("corruptions_slave", 1);
    }

    let rng = Math.random();
    let targets: Trait[] = [];
    let tags = ["skin"];
    if (trait_tag) tags.push(trait_tag);
    let rare_chance = setup.CORRUPTION_MISFIRE_RARE_CHANCE;
    let medium_chance = setup.CORRUPTION_MISFIRE_MEDIUM_CHANCE;
    if (is_return_anyways) {
      rare_chance *= setup.CORRUPTION_PERMANENT_MISFIRE_CHANCE_MULTIPLIER;
      medium_chance *= setup.CORRUPTION_PERMANENT_MISFIRE_CHANCE_MULTIPLIER;
    }

    if (rng < rare_chance) {
      targets = TraitHelper.getAllTraitsOfTags(tags.concat(["rare"]));
    } else if (rng < medium_chance) {
      targets = TraitHelper.getAllTraitsOfTags(tags.concat(["medium"]));
    }

    if (!targets.length) {
      targets = TraitHelper.getAllTraitsOfTags(tags.concat(["common"]));
    }

    targets = targets.filter((trait) => unit.isTraitCompatible(trait));

    if (!targets.length) {
      return null;
    }

    let result = setup.rng.choice(targets);
    let failed = false;

    if (unit.isHasRemovableTrait(result)) {
      failed = true;
    }

    if (failed) {
      if (unit.isYourCompany()) {
        setup.notify(
          `a|Rep a|is supposed to be corrupted but nothing happened.`,
          { a: unit },
        );
      }
      if (is_return_anyways) {
        return result;
      } else {
        return null;
      }
    } else {
      return unit.addTrait(result);
    }
  }
}
