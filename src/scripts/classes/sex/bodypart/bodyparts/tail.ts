import { TraitHelper } from "../../../trait/Trait";
import type { Unit } from "../../../unit/Unit";
import type { SexInstance } from "../../engine/SexInstance";
import { SexConstants } from "../../SexConstants";
import { SexBodypart } from "../SexBodypart";

export class SexBodypart_Tail extends SexBodypart {
  constructor() {
    super(
      "tail",
      [
        /* tags */
      ],
      "Tail",
      "Tail",
    );
  }

  override repSimple(unit: Unit) {
    return setup.rng.choice(["tail"]);
  }

  override getTraitSizeMap() {
    return {
      tail_werewolf: 4,
      tail_foxkin: 3,
      tail_neko: 3,
      tail_dragonkin: 6,
      tail_demon: 4,
    };
  }

  static tailSizeAdjective(size: number): string {
    let t;
    if (size >= 6) {
      t = [`huge`];
    } else if (size >= 4) {
      t = [`large`];
    } else {
      t = [``];
    }

    return setup.rng.choice(t);
  }

  override repSizeAdjective(unit: Unit, sex: SexInstance) {
    return SexBodypart_Tail.tailSizeAdjective(this.getSize(unit, sex));
  }

  override heightTolerance() {
    return 1;
  }

  override giveArousalMultiplier(me: Unit, sex: SexInstance) {
    let base = setup.SexUtil.calculateTraitMultiplier(me, {
      per_curious: SexConstants.TRAIT_MULTI_LOW,
      per_stubborn: -SexConstants.TRAIT_MULTI_LOW,
      per_playful: SexConstants.TRAIT_MULTI_LOW,
      per_serious: -SexConstants.TRAIT_MULTI_LOW,
      per_dominant: SexConstants.TRAIT_MULTI_LOW,
      per_submissive: -SexConstants.TRAIT_MULTI_LOW,

      training_mindbreak: -SexConstants.TRAIT_MULTI_MEDIUM,
    });

    return base;
  }

  override receiveArousalMultiplier(me: Unit, sex: SexInstance) {
    return this.giveArousalMultiplier(me, sex);
  }

  override getHasRestrictions(): Restriction[] {
    return [
      setup.qres.AnyTrait(TraitHelper.getAllTraitsOfTags(["tail"]), true),
    ];
  }

  /**
   * Whether this bodypart is flexible towards facing
   */
  override isFlexible() {
    return true;
  }

  /**
   * Whether this bodypart is completely directionless and disregard facing altogether
   */
  override isDirectionless() {
    return true;
  }

  override isCanPenetrate(bodypart: SexBodypart) {
    return (
      setup.sexbodypart.anus === bodypart ||
      setup.sexbodypart.vagina === bodypart
    );
  }

  override repTip(unit: Unit, sex?: SexInstance) {
    if (unit.isHasTrait("tail_werewolf")) {
      return `fluffy tip`;
    } else if (unit.isHasTrait("tail_foxkin")) {
      return `soft, bushy tip`;
    } else if (unit.isHasTrait("tail_neko")) {
      return `tip`;
    } else if (unit.isHasTrait("tail_dragonkin")) {
      return `scaly tip`;
    } else if (unit.isHasTrait("tail_demon")) {
      return `sharp tip`;
    }
    return "";
  }

  override repFuck(unit: Unit, sex?: SexInstance) {
    return `tail-fuck`;
  }

  override rawDescribeEnd(
    unit: Unit,
    target: Unit,
    target_bodypart: SexBodypart,
    sex: SexInstance,
  ): string | string[] {
    // supports anus, vagina
    const desc = target_bodypart.rep(target, sex);
    return [
      `a|Rep a|withdraw a|their a|tail from b|reps ${desc}, leaving a gaping hole.`,
      `b|Reps desc contracts as a|rep a|withdraw a|their a|tail from the ${desc}`,
      `Slowly, a|rep a|retract a|their a|tail from deep within b|their ${desc}.`,
    ];
  }

  /**
   * Gives a verb for this bodypart penetrating another. E.g., "penetrating b|anus"
   */
  rawVerbPenetrate(
    unit: Unit,
    target: Unit,
    target_bodypart: SexBodypart,
    sex: SexInstance,
  ): string | string[] {
    const pace = sex.getPace(unit);
    const desc = target_bodypart.rep(target, sex);
    if (pace == setup.sexpace.dom) {
      let mult = ``;
      if (unit.isHasTrait("tail_werewolf")) {
        mult = `, all the fluffs included,`;
      } else if (unit.isHasTrait("tail_foxkin")) {
        mult = `, the soft fur teasing every inch,`;
      } else if (unit.isHasTrait("tail_neko")) {
        // no special text for cats
      } else if (unit.isHasTrait("tail_dragonkin")) {
        mult = `, including some of the painful-looking ridges,`;
      } else if (unit.isHasTrait("tail_demon")) {
        mult = `, including the pointy edge,`;
      }
      return [
        `lodged deep${mult} inside of b|reps ${desc}`,
        `stuck deep${mult} inside of b|reps ${desc}`,
        `being shoved deep${mult} inside of b|reps ${desc}`,
      ];
    } else {
      return [
        `lodged inside b|reps`,
        `penetrating b|reps ${desc}`,
        `stuck inside b|reps`,
      ];
    }
  }

  /**
   * Gives a sentence describing extra flavor text when this bodypart penetrating another.
   */
  rawPenetrateFlavorSentence(
    unit: Unit,
    target: Unit,
    target_bodypart: SexBodypart,
    sex: SexInstance,
  ): string | string[] {
    const accom = this.getAccomodatingValue(unit, target, target_bodypart);
    const hole = target_bodypart.rep(target, sex);

    let t: string[] = [];
    let adj = "";
    if (accom >= 2) {
      adj = setup.rng.choice([
        `roughly`,
        `violently`,
        `harshly`,
        `painfully`,
        `cruelly`,
        `mercilessly`,
      ]);
    } else if (accom == 0) {
      adj = setup.rng.choice([`harmlessly`, `barely`, `slightly`, `softly`]);
    }

    if (unit.isHasTrait("tail_dragonkin")) {
      t = [
        `All the while the sharp ridges on a|reps a|tail greatly amplify the stimulation as they ${adj}
         bump the inner walls.`,
        `The sharp ridges lining a|reps a|tail enhance the stimulation by ${adj} bumping into b|reps soft inner walls.`,
        `The sharp ridges lining a|reps a|tail add another layer of complexity to the stimulation each
         time they hit, bump, and ${adj} graze the inner muscles in b|reps ${hole}.`,
      ];
    } else if (unit.isHasTrait("tail_demon")) {
      t = [
        `All the while the sharp tip of a|reps a|tail amplify the stimulation as it ${adj} grazes the soft inner walls of b|rep, which was never designed to ever be filled with such an appendage.`,
        `The sharp tip at the end of a|reps a|tail add to the stimulation by ${adj} grazing b|reps inner walls, amplifying the pain and pleasure.`,
        `The sensitive sharp tip at the end of a|reps a|tail gives an extra source of pleasure as it
         ${adj} hit and bump b|reps sensitive inner walls.`,
      ];
    } else if (unit.isHasTrait("tail_werewolf")) {
      t = [
        `The fluffy tail ${adj} tickles the inner walls of b|rep.`,
        `b|Rep b|let out b|a_moan as b|they feel b|their ${hole} stimulated by a|reps fluffy tail, which ${adj} tickles its innner walls.`,
        `a|Rep can feel their a|tail as it ${adj} penetrate and tickles the inner walls of b|rep.`,
      ];
    } else if (unit.isHasTrait("tail_foxkin")) {
      t = [
        `The soft, bushy tail ${adj} brushes and teases every sensitive spot inside b|rep.`,
        `b|Rep b|shiver as a|reps plush fox tail ${adj} caresses the inner walls of b|their ${hole}, sending waves of pleasure.`,
        `a|Rep can feel their a|tail as it ${adj} stirs up warmth and longing deep within b|rep, every motion gentle and inviting.`,
      ];
    } else if (unit.isHasTrait("tail_neko")) {
      // TODO: ??? what do neko tail do
      t = [];
    }
    if (t.length) {
      return setup.rng.choice(t);
    } else {
      return "";
    }
  }
}
