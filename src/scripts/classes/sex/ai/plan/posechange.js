"use strict";
// @ts-nocheck
/**
 * Get all the possible (my_pose, target_unit, target_pose) combinations
 * @typedef {{my_pose: setup.SexPose, target: setup.Unit, target_pose: setup.SexPose}} TargetPoses
 *
 * @param {setup.Unit} my_unit
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.SexPose} my_pose
 * @param {setup.Unit} their_unit
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexPose} their_pose
 * @param {setup.SexPermission} my_permission
 * @param {setup.SexInstance} sex
 * @returns {TargetPoses[]}
 */
function enumeratePenetrations(my_unit, my_bodypart, my_pose, their_unit, their_bodypart, their_pose, my_permission, sex) {
    if (!my_bodypart.isCanPenetrate(their_bodypart))
        return [];
    const my_position = sex.getPosition(my_unit);
    if (sex.getPose(my_unit) != my_pose && !my_pose.isAllowed(my_unit, sex, my_position))
        return [];
    // missing permission case
    if (sex.getPose(my_unit) != my_pose && my_permission.getDisallowedTags().includes('poseself'))
        return [];
    const their_position = sex.getPosition(their_unit);
    if (sex.getPose(their_unit) != their_pose && !their_pose.isAllowed(their_unit, sex, their_position))
        return [];
    // missing permission case again
    if (sex.getPose(their_unit) != their_pose && my_permission.getDisallowedTags().includes('poseother'))
        return [];
    if (!my_bodypart.isCanInteractWith(my_position, my_pose.getFacingHeight(my_bodypart, my_position, sex), their_bodypart, their_position, their_pose.getFacingHeight(their_bodypart, their_position, sex))) {
        // cannot interact, so no
        return [];
    }
    return [{ my_pose: my_pose, target: their_unit, target_pose: their_pose }];
}
setup.SexPlanClass.PoseChange = class PoseChange extends setup.SexPlan {
    constructor(...args) {
        // @ts-ignore
        super(...args);
        this.tries_remain = setup.Sex.AI_POSE_CHANGE_MAX_ATTEMPTS[this.sex.getPace(this.unit).key];
        const pace = this.sex.getPace(this.unit);
        const my_permission = this.sex.getPermission(this.unit);
        let poses_candidate = [];
        for (const target of this.sex.getUnits()) {
            if (target == this.unit)
                continue;
            // try every possible bodypart combination
            for (const my_bodypart of setup.SexBodypart.getAllBodyparts()) {
                for (const their_bodypart of setup.SexBodypart.getAllBodyparts()) {
                    if (my_bodypart.isHasBodypart(this.unit, this.sex) &&
                        their_bodypart.isHasBodypart(target, this.sex) &&
                        (my_bodypart.isCanPenetrate(their_bodypart) ||
                            their_bodypart.isCanPenetrate(my_bodypart))) {
                        for (const my_pose of setup.SexPose.getAllPoses()) {
                            for (const their_pose of setup.SexPose.getAllPoses()) {
                                // dom will want to penetrate. sub will want to be penetrated. normal wants both.
                                let dompaces = [setup.sexpace.dom, setup.sexpace.normal];
                                let subpaces = [setup.sexpace.sub, setup.sexpace.normal];
                                if (my_bodypart.isSubmissivePenetration(their_bodypart)) {
                                    [dompaces, subpaces] = [subpaces, dompaces];
                                }
                                if (dompaces.includes(pace)) {
                                    poses_candidate.push(...enumeratePenetrations(this.unit, my_bodypart, my_pose, target, their_bodypart, their_pose, my_permission, this.sex));
                                }
                                if (subpaces.includes(pace)) {
                                    poses_candidate.push(...enumeratePenetrations(target, their_bodypart, my_pose, this.unit, my_bodypart, their_pose, my_permission, this.sex));
                                }
                            }
                        }
                    }
                }
            }
        }
        /**
         * @type {TargetPoses}
         */
        this.target_config = null;
        if (!poses_candidate.length) {
            this.giveUp();
        }
        else {
            this.target_config = setup.rng.choice(poses_candidate);
        }
    }
    /**
     * @param {setup.SexAction[]} actions
     * @returns {setup.SexAction | null}
     */
    selectAction(actions) {
        this.tries_remain -= 1;
        // change my position
        {
            const want = this.target_config.my_pose;
            const possible = actions.filter(action => action instanceof setup.SexAction.PoseChange &&
                action.getNewPose() == want);
            if (possible.length)
                return setup.rng.choice(possible);
        }
        // change their position
        {
            const want = this.target_config.target_pose;
            const possible = actions.filter(action => action instanceof setup.SexAction.PoseChangeOther &&
                action.getActorUnit('b') == this.target_config.target &&
                action.getNewPose() == want);
            if (possible.length)
                return setup.rng.choice(possible);
        }
        return this.giveUp();
    }
    giveUp() {
        this.tries_remain = 0;
        return null;
    }
    /**
     * Whether the plan has been completed or aborted, and a new plan should be taken
     * @returns {boolean}
     */
    isComplete() {
        if (this.tries_remain == 0)
            return true;
        if (this.sex.getPose(this.unit) == this.target_config.my_pose &&
            this.sex.getPose(this.target_config.target) == this.target_config.target_pose)
            return true;
        return false;
    }
};
