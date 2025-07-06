"use strict";
// @ts-nocheck
// abstract
setup.SexAction.PositionChange = class PositionChange extends setup.SexAction {
    getTags() { return super.getTags().concat(['positionself', 'normal']); }
    /**
     * A little special because of swapping
     * @param {setup.Unit} main_unit
     * @param {setup.SexInstance} sex
     */
    isAIAllowed(main_unit, sex) {
        const swap_with = sex.getUnitAtPosition(this.getNewPosition());
        if (swap_with && swap_with != main_unit) {
            // considered a swap action, so will have harder permission
            const permission = sex.getPermission(main_unit);
            if (permission.getDisallowedTags().includes('positionother'))
                return false;
        }
        return super.isAIAllowed(main_unit, sex);
    }
    /**
     * Change position to this
     * @returns {setup.SexPosition}
     */
    getNewPosition() {
        return setup.sexposition.center;
    }
    /**
     * @returns {ActorDescription[]}
     */
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_TINY,
                restrictions: [
                    setup.qres.Not(setup.qres.SexIsBeingPenetrated()),
                    setup.qres.SexPositionCanChangeTo(this.getNewPosition())
                ],
                paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced, setup.sexpace.resist],
            },
        ];
    }
    getOutcomes() {
        return [
            setup.qc.SexPositionChange('a', this.getNewPosition()),
        ];
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Move to ${this.getNewPosition().getTitle()}`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `Move to the "${this.getNewPosition().getTitle()}" position`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawStory(sex) {
        return setup.SexAction.PositionChange.describe(this.getActorUnit('a'), this.getNewPosition(), sex);
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexPosition} new_position
     * @param {setup.SexInstance} sex
     */
    static describe(unit, new_position, sex) {
        const sentences = [];
        if (sex.getPosition(unit) == new_position)
            return '';
        const swap_with = sex.getUnitAtPosition(new_position);
        // First, remove all ongoing penetrations involving units
        const penetrations = sex.getAllOngoing(unit);
        sentences.push(setup.SexBodypart.describePenetrationEnds(penetrations, sex));
        if (swap_with) {
            sentences.push(setup.SexBodypart.describePenetrationEnds(sex.getAllOngoing(swap_with), sex));
        }
        // Next, move unit to new positions
        let swap_pose = new_position.getDefaultPose();
        if (swap_with)
            swap_pose = sex.getPose(swap_with);
        sentences.push(new_position.describe(unit, sex));
        return sentences.join(' ');
    }
};
setup.SexActionClass.PositionChangeStand = class PositionChangeStand extends setup.SexAction.PositionChange {
    getNewPosition() { return setup.sexposition.front; }
};
setup.SexActionClass.PositionChangeBack = class PositionChangeBack extends setup.SexAction.PositionChange {
    getNewPosition() { return setup.sexposition.back; }
};
setup.SexActionClass.PositionChangeCenter = class PositionChangeCenter extends setup.SexAction.PositionChange {
    getNewPosition() { return setup.sexposition.center; }
};
setup.SexActionClass.PositionChangeTop = class PositionChangeTop extends setup.SexAction.PositionChange {
    getNewPosition() { return setup.sexposition.top; }
};
