import type { Unit } from "../../../unit/Unit";
import type { SexInstance } from "../../engine/SexInstance";
import { SexConstants } from "../../SexConstants";
import { SexBodypart } from "../SexBodypart";

export class SexBodypart_Mouth extends SexBodypart {
  constructor() {
    super(
      "mouth",
      [
        /* tags */
      ],
      "Mouth",
      "Mouth",
    );
  }

  override repSimple(unit: Unit) {
    let t;
    if (unit.isHasTrait(setup.trait.mouth_werewolf)) {
      t = ["muzzle", "maw"];
    } else if (unit.isHasTrait(setup.trait.mouth_foxkin)) {
      t = ["soft muzzle", "fox muzzle", "muzzle"];
    } else if (unit.isHasTrait(setup.trait.mouth_dragonkin)) {
      t = ["snout", "maw"];
    } else {
      t = [`mouth`];
    }
    return setup.rng.choice(t);
  }

  override getTraitSizeModifierMap() {
    return {
      training_oral_basic: SexConstants.BODYPART_SIZE_TRAINING_BASIC,
      training_oral_advanced: SexConstants.BODYPART_SIZE_TRAINING_ADVANCED,
      training_oral_master: SexConstants.BODYPART_SIZE_TRAINING_MASTER,
      default: 0,
    };
  }

  override repVaginal(unit: Unit, sex: SexInstance) {
    return "oral";
  }

  override getTraitSizeMap() {
    return {
      default: 4,
    };
  }

  override repFuck(unit: Unit, sex: SexInstance) {
    return `eat`;
  }

  override isSubmissivePenetration(bodypart: SexBodypart) {
    return true;
  }

  override getEquipmentSlots() {
    return [setup.equipmentslot.mouth];
  }

  override giveArousalMultiplier(me: Unit, sex: SexInstance) {
    return setup.SexUtil.calculateTraitMultiplier(me, {
      training_none: -SexConstants.TRAIT_MULTI_MEDIUM,
      training_oral_basic: SexConstants.TRAIT_MULTI_LOW,
      training_oral_advanced: SexConstants.TRAIT_MULTI_MEDIUM,
      training_oral_master: SexConstants.TRAIT_MULTI_HIGH,
      per_submissive: SexConstants.TRAIT_MULTI_LOW,
      per_dominant: -SexConstants.TRAIT_MULTI_LOW,
      per_lustful: SexConstants.TRAIT_MULTI_LOW,
      per_sexaddict: SexConstants.TRAIT_MULTI_LOW,
      per_chaste: -SexConstants.TRAIT_MULTI_LOW,
      mouth_demon: SexConstants.TRAIT_MULTI_MEDIUM,
      training_mindbreak: -SexConstants.TRAIT_MULTI_HIGH,
    });
  }

  override receiveArousalMultiplier(me: Unit, sex: SexInstance) {
    return setup.SexUtil.calculateTraitMultiplier(me, {
      training_none: -SexConstants.TRAIT_MULTI_MEDIUM,
      training_oral_advanced: SexConstants.TRAIT_MULTI_LOW,
      training_oral_master: SexConstants.TRAIT_MULTI_MEDIUM,
      per_sexaddict: SexConstants.TRAIT_MULTI_LOW,
      per_chaste: -SexConstants.TRAIT_MULTI_LOW,
    });
  }

  /**
   * Can this bodypart penetrate another? Filled manually for efficiency
   */
  override isCanPenetrate(bodypart: SexBodypart): boolean {
    return (
      [setup.sexbodypart.anus, setup.sexbodypart.vagina] as SexBodypart[]
    ).includes(bodypart);
  }

  /**
   * Describe unit bodypart teasing to penetrate another.
   */
  override rawDescribeTease(
    unit: Unit,
    target: Unit,
    target_bodypart: SexBodypart,
    sex: SexInstance,
  ): string | string[] {
    if (
      !(
        [setup.sexbodypart.anus, setup.sexbodypart.vagina] as SexBodypart[]
      ).includes(target_bodypart)
    ) {
      return ``;
    }
    const hole = target_bodypart.rep(target, sex);
    return [
      `a|Rep can already taste b|reps ${hole} located right in front of a|their lips.`,
      `a|Reps a|tongue can probably reach b|reps ${hole} from this position.`,
      `With a|breps ${hole} situated right next to a|reps a|mouth, there could only be one possible way the action could go.`,
    ];
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
      `a|Rep a|withdraw a|their a|tongue from b|reps ${desc}, and left with nothing but its taste.`,
      `a|Rep a|stop eating out b|reps ${desc} for the time being.`,
      `a|Rep a|retract their b|tongue back to inside b|their b|mouth.`,
    ];
  }

  /**
   * Gives a verb for this bodypart penetrating another. E.g., "penetrating b|anus"
   */
  override rawVerbPenetrate(
    unit: Unit,
    target: Unit,
    target_bodypart: SexBodypart,
    sex: SexInstance,
  ): string | string[] {
    const pace = sex.getPace(unit);
    const hole = target_bodypart.rep(target, sex);
    if (
      target_bodypart == setup.sexbodypart.anus ||
      target_bodypart == setup.sexbodypart.vagina
    ) {
      return [
        `busy eating out b|reps ${hole}`,
        `working its way in b|reps ${hole}`,
        `exploring b|reps ${hole}`,
      ];
    }
    return "";
  }
}
