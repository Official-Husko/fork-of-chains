import type { Unit } from "../../unit/Unit";
import type { SexBodypart } from "../bodypart/SexBodypart";
import type { SexInstance } from "../engine/SexInstance";

/**
 * The more skilfull, the higher the multiplier is
 */
function offsetPaceGive(unit: Unit, sex: SexInstance): number {
  const pace = sex.getPace(unit);
  if (pace == setup.sexpace.dom) {
    return 0.8;
  } else if (pace == setup.sexpace.normal) {
    return 1.0;
  } else if (pace == setup.sexpace.sub) {
    return 1.3;
  } else if (pace == setup.sexpace.resist) {
    return 0.8;
  } else if (pace == setup.sexpace.forced) {
    return 1.0;
  } else if (pace == setup.sexpace.mindbroken) {
    return 0.7;
  }
  return 1.0;
}

/**
 * The more skilfull, the higher the multiplier is
 */
function offsetPaceReceive(unit: Unit, sex: SexInstance): number {
  const pace = sex.getPace(unit);
  if (pace == setup.sexpace.dom) {
    return 1.1;
  } else if (pace == setup.sexpace.normal) {
    return 1.0;
  } else if (pace == setup.sexpace.sub) {
    return 1.0;
  } else if (pace == setup.sexpace.resist) {
    return 0.5;
  } else if (pace == setup.sexpace.forced) {
    return 0.8;
  } else if (pace == setup.sexpace.mindbroken) {
    return 0.8;
  }
  return 1.0;
}

export default {
  giveMultiplier(unit: Unit, bodypart: SexBodypart, sex: SexInstance): number {
    return (
      offsetPaceGive(unit, sex) * bodypart.giveArousalMultiplier(unit, sex)
    );
  },

  receiveMultiplier(
    unit: Unit,
    bodypart: SexBodypart,
    sex: SexInstance,
  ): number {
    return (
      offsetPaceReceive(unit, sex) *
      bodypart.receiveArousalMultiplier(unit, sex)
    );
  },

  /**
   * How much discomfort is multiplied when this unit's skin is damaged, e.g., bitten etc.
   */
  skinDiscomfortMultiplier(unit: Unit, sex: SexInstance): number {
    let base = setup.SexUtil.calculateTraitMultiplier(unit, {
      body_werewolf: -0.9, // thick fur
      body_foxkin: -0.7, // less thick fur hopefully
      body_neko: -0.9, // thick fur
      body_orc: 0.0,
      body_drow: 0.0,
      body_dragonkin: -0.9, // thick scales
      body_demon: 0.0,
    });

    return base;
  },
};
