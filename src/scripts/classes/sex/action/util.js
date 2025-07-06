"use strict";
// @ts-nocheck
/**
 * The more skilfull, the higher the multiplier is
 * @param {setup.Unit} unit
 * @param {setup.SexInstance} sex
 * @returns {number}
 */
function offsetPaceGive(unit, sex) {
    const pace = sex.getPace(unit);
    if (pace == setup.sexpace.dom) {
        return 0.8;
    }
    else if (pace == setup.sexpace.normal) {
        return 1.0;
    }
    else if (pace == setup.sexpace.sub) {
        return 1.3;
    }
    else if (pace == setup.sexpace.resist) {
        return 0.8;
    }
    else if (pace == setup.sexpace.forced) {
        return 1.0;
    }
    else if (pace == setup.sexpace.mindbroken) {
        return 0.7;
    }
}
/**
 * The more skilfull, the higher the multiplier is
 * @param {setup.Unit} unit
 * @param {setup.SexInstance} sex
 * @returns {number}
 */
function offsetPaceReceive(unit, sex) {
    const pace = sex.getPace(unit);
    if (pace == setup.sexpace.dom) {
        return 1.1;
    }
    else if (pace == setup.sexpace.normal) {
        return 1.0;
    }
    else if (pace == setup.sexpace.sub) {
        return 1.0;
    }
    else if (pace == setup.sexpace.resist) {
        return 0.5;
    }
    else if (pace == setup.sexpace.forced) {
        return 0.8;
    }
    else if (pace == setup.sexpace.mindbroken) {
        return 0.8;
    }
}
/**
 * @param {setup.Unit} unit
 * @param {setup.SexBodypart} bodypart
 * @param {setup.SexInstance} sex
 */
setup.SexUtil.giveMultiplier = function (unit, bodypart, sex) {
    return offsetPaceGive(unit, sex) * bodypart.giveArousalMultiplier(unit, sex);
};
/**
 * @param {setup.Unit} unit
 * @param {setup.SexBodypart} bodypart
 * @param {setup.SexInstance} sex
 */
setup.SexUtil.receiveMultiplier = function (unit, bodypart, sex) {
    return offsetPaceReceive(unit, sex) * bodypart.receiveArousalMultiplier(unit, sex);
};
/**
 * How much discomfort is multiplied when this unit's skin is damaged, e.g., bitten etc.
 * @param {setup.Unit} unit
 * @param {setup.SexInstance} sex
 */
setup.SexUtil.skinDiscomfortMultiplier = function (unit, sex) {
    let base = setup.SexUtil.calculateTraitMultiplier(unit, {
        body_werewolf: -0.9, // thick fur
        body_neko: -0.9, // thick fur
        body_orc: 0.0,
        body_drow: 0.0,
        body_dragonkin: -0.9, // thick scales
        body_demon: 0.0,
    });
    return base;
};
