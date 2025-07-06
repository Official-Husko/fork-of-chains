"use strict";
// @ts-nocheck
setup.qcImpl.SexPositionChange = class SexPositionChange extends setup.SexCost {
    /**
     * @param {string} actor_name
     * @param {setup.SexPosition} position
     */
    constructor(actor_name, position) {
        super();
        this.actor_name = actor_name;
        this.position = position;
    }
    /**
     * @param {setup.SexAction} action
     */
    apply(action) {
        const unit = action.getActorUnit(this.actor_name);
        if (this.sex.getPosition(unit) == this.position)
            return;
        const swap_with = this.sex.getUnitAtPosition(this.position);
        // First, remove all ongoing penetrations involving units
        this.sex.clearOngoing(unit);
        if (swap_with)
            this.sex.clearOngoing(swap_with);
        // Next, move unit to new positions
        const my_pose = this.sex.getPose(unit);
        const my_position = this.sex.getPosition(unit);
        let swap_pose = this.position.getDefaultPose();
        if (swap_with)
            swap_pose = this.sex.getPose(swap_with);
        this.sex.swapPosition(unit, this.position);
        // Repair poses, if possible
        if (!my_pose.isAllowed(unit, this.sex)) {
            this.sex.getScene().appendText(swap_pose.describe(unit, this.sex));
            // @ts-ignore
            setup.qc.SexPoseChange('a', swap_pose).apply(setup.costUnitHelper(unit));
        }
        if (swap_with && !swap_pose.isAllowed(swap_with, this.sex)) {
            this.sex.getScene().appendText(my_pose.describe(swap_with, this.sex));
            // @ts-ignore
            setup.qc.SexPoseChange('a', my_pose).apply(setup.costUnitHelper(swap_with));
        }
    }
    explain() {
        return `Switch position to ${this.position.rep()}`;
    }
};
