"use strict";
// @ts-nocheck
/**
 * Stores information about the current sex act.
 *
 * Transient, and does not gets stored in save file.
 */
setup.SexInstance = class SexInstance extends setup.TwineClass {
    /**
     * @typedef {{my_bodypart: setup.SexBodypart, target: setup.Unit, target_bodypart: setup.SexBodypart}} Inside
     *
     * @typedef {Object} Participant
     * @property {setup.Unit} unit
     * @property {setup.SexGoal} goal  // optional for players
     * @property {setup.SexPace} pace  // initial pace
     * @property {setup.SexPermission} permission  // permissions
     * @property {setup.SexPose} pose  // initial pose
     * @property {setup.SexPosition} position  // initial position
     * @property {Object<string, boolean>} [displaced_equipment]  // list of equipment slots that has been displaced
     * @property {Object<string, string>} [temporary_equipment]  // slot: equipment. list of equipment that is worn over this slot
     * @property {Array<setup.SexAction>} [action_history]  // history of sex actions chosen by this unit in this scene
     * @property {number} [orgasms]
     * @property {number} arousal
     * @property {number} discomfort
     * @property {number} energy
     *
     * Array of {my_bodypart, target, target_bodypart}, meaning that my bodypart is inside unit's bodypart
     * Note that this is not reflexive.
     * @property {Array<Inside>} [ongoing]
     *
     * @param {setup.SexLocation} location  // where the sex takes place
     * @param {Array<Participant>} participants  // list of sex participants
     */
    constructor(location, participants) {
        super();
        if (!participants.length)
            throw new Error(`No participant in SexInstance`);
        if (participants.length > setup.SexInstance.PARTICIPANTS_MAX) {
            throw new Error(`Too many actors in SexInstance: ${participants.length}`);
        }
        this.location = location;
        this.participants = participants;
        /**
         * Whether this sex scene has ended.
         * @type {boolean}
         */
        this.is_ended = false;
        // will be set later
        /**
         * @type {setup.SexScene}
         */
        this.scene = null;
        // Add in missing variables that we will use
        for (const participant of this.participants) {
            participant.ongoing = [];
            participant.displaced_equipment = {};
            participant.temporary_equipment = {};
            participant.action_history = [];
            participant.orgasms = 0;
        }
        // put in global variable for ease of use in restrictions
        State.temporary.gSex = this;
        // Sanity check, no two units occupy the same position
        const chosen_positions = [];
        for (const participant of participants) {
            if (!participant.unit)
                throw new Error(`Missing unit for participant`);
            if (!participant.position)
                throw new Error(`Missing position for participant ${participant.unit.key}`);
            if (chosen_positions.includes(participant.position))
                throw new Error(`Duplicated position: ${participant.position.key}`);
            chosen_positions.push(participant.position);
        }
        if (!(chosen_positions.includes(setup.sexposition.center)))
            throw new Error(`Missing unit in CENTER position`);
    }
    /* =============================
        BASIC GETTERS and SETTERS
    ============================= */
    /**
     * @returns {setup.SexScene}
     */
    getScene() { return this.scene; }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isParticipant(unit) {
        return this.getUnits().includes(unit);
    }
    /**
     * @param {setup.Unit} unit
     */
    _getParticipant(unit) {
        for (const participant of this.participants) {
            if (participant.unit == unit)
                return participant;
        }
        throw new Error(`Unit not found in SexInteraction: ${unit.key}`);
    }
    /**
     * Return list of all units participating in this sex
     * @returns {setup.Unit[]}
     */
    getUnits() { return Object.values(this.participants).map(participant => participant.unit); }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexGoal}
     */
    getGoal(unit) { return this._getParticipant(unit).goal; }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexGoal} goal
     */
    setGoal(unit, goal) { this._getParticipant(unit).goal = goal; }
    /**
     * @returns {setup.SexLocation}
     */
    getLocation() { return this.location; }
    /**
     * @param {setup.SexLocation} location
     */
    setLocation(location) { this.location = location; }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexPace}
     */
    getPace(unit) { return this._getParticipant(unit).pace; }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexPace} pace
     */
    setPace(unit, pace) { this._getParticipant(unit).pace = pace; }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexPermission}
     */
    getPermission(unit) { return this._getParticipant(unit).permission; }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexPose}
     */
    getPose(unit) { return this._getParticipant(unit).pose; }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexPose} pose
     */
    setPose(unit, pose) { this._getParticipant(unit).pose = pose; }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexPosition}
     */
    getPosition(unit) { return this._getParticipant(unit).position; }
    /**
     * Will swap unit in that position
     * @param {setup.Unit} unit
     * @param {setup.SexPosition} position
     */
    swapPosition(unit, position) {
        const in_position = this.getUnitAtPosition(position);
        // already in position
        if (unit == in_position)
            return;
        const old_position = this.getPosition(unit);
        this._getParticipant(unit).position = position;
        if (in_position) {
            this._getParticipant(in_position).position = old_position;
        }
    }
    /**
     * @param {setup.SexPosition} position
     * @returns {setup.Unit | null}
     */
    getUnitAtPosition(position) {
        for (const participant of this.participants) {
            if (participant.position == position)
                return participant.unit;
        }
        return null;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {number}
     */
    getOrgasms(unit) { return this._getParticipant(unit).orgasms; }
    /**
     * @param {setup.Unit} unit
     */
    addOrgasm(unit) { this._getParticipant(unit).orgasms += 1; }
    /**
     * Has this scene ended?
     * @returns {boolean}
     */
    isEnded() { return this.is_ended; }
    /**
     * End this sex scene
     */
    endSex() { this.is_ended = true; }
    /* =============================
        ONGOING PENETRATIONS
    ============================= */
    /**
     * unit's bodypart is inside what? Returns {unit: unit, bodypart: bodypart} or null
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {{unit: setup.Unit, bodypart: setup.SexBodypart} | null}
     */
    getBodypartPenetrationTarget(unit, bodypart) {
        for (const insideobj of this._getParticipant(unit).ongoing) {
            if (insideobj.my_bodypart == bodypart) {
                return {
                    unit: insideobj.target,
                    bodypart: insideobj.target_bodypart,
                };
            }
        }
        return null;
    }
    /**
     * unit bodypart is penetrated by what? Returns {unit: unit, bodypart: bodypart} or null
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {{unit: setup.Unit, bodypart: setup.SexBodypart} | null}
     */
    getBodypartPenetrator(unit, bodypart) {
        for (const participant of this.participants) {
            for (const insideobj of participant.ongoing) {
                if (insideobj.target == unit && insideobj.target_bodypart == bodypart) {
                    return {
                        unit: participant.unit,
                        bodypart: insideobj.my_bodypart,
                    };
                }
            }
        }
        return null;
    }
    /**
     * get either penetrator or the bodypart this is penetrating
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {{unit: setup.Unit, bodypart: setup.SexBodypart} | null}
     */
    getBodypartOther(unit, bodypart) {
        const target = this.getBodypartPenetrationTarget(unit, bodypart);
        if (target)
            return target;
        const subject = this.getBodypartPenetrator(unit, bodypart);
        if (subject)
            return subject;
        return null;
    }
    /**
     * Cancels penetration done by unit's bodypart. Should not be called directly except through sex action.
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     */
    cancelOngoing(unit, bodypart) {
        const participant = this._getParticipant(unit);
        participant.ongoing = participant.ongoing.filter(a => a.my_bodypart != bodypart);
    }
    /**
     * Get all ongoing penetrations involving this unit. Returns the penetrators
     * @typedef {{unit: setup.Unit, bodypart: setup.SexBodypart}} PenetrationInfo
     *
     * @param {setup.Unit} unit
     * @returns {PenetrationInfo[]}
     */
    getAllOngoing(unit) {
        const result = [];
        for (const participant of this.participants) {
            for (const ongoing of participant.ongoing) {
                if (participant.unit == unit || ongoing.target == unit) {
                    result.push({
                        unit: participant.unit,
                        bodypart: ongoing.my_bodypart,
                    });
                }
            }
        }
        return result;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isBeingPenetrated(unit) {
        return !!this.getAllOngoing(unit).filter(a => a.unit != unit).length;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isPenetrating(unit) {
        return !!this.getAllOngoing(unit).length;
    }
    /**
     * Cancel all ongoing penetrations. Should not be called directly except through sex action.
     * @param {setup.Unit} [unit]   // if supplied, will stop only those involving this unit
     */
    clearOngoing(unit) {
        if (unit) {
            for (const to_remove of this.getAllOngoing(unit)) {
                this.cancelOngoing(to_remove.unit, to_remove.bodypart);
            }
        }
        else {
            for (const participant of this.participants) {
                const to_removes = participant.ongoing.map(a => a.my_bodypart);
                for (const to_remove of to_removes)
                    this.cancelOngoing(participant.unit, to_remove);
            }
        }
    }
    /**
     * Put unit's bodypart inside target's bodypart
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} unit_bodypart
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     */
    setOngoing(unit, unit_bodypart, target, target_bodypart) {
        if (this.isBodypartOngoing(unit, unit_bodypart))
            throw new Error(`${unit.getName()}'s ${unit_bodypart.key} is busy!`);
        if (this.isBodypartOngoing(target, target_bodypart))
            throw new Error(`${target.getName()}'s ${target_bodypart.key} is busy!`);
        const participant = this._getParticipant(unit);
        participant.ongoing.push({
            my_bodypart: unit_bodypart,
            target: target,
            target_bodypart: target_bodypart,
        });
    }
    /**
     * Whether unit's bodypart is currently ongoing on a sex penetration
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {boolean}
     */
    isBodypartOngoing(unit, bodypart) {
        return !!(this.getBodypartPenetrationTarget(unit, bodypart) || this.getBodypartPenetrator(unit, bodypart));
    }
    /* =============================
        UNIT STATE
    ============================= */
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isCanTalk(unit) {
        return this.isCanUse(unit, setup.sexbodypart.mouth) && unit.isCanTalk();
    }
    /**
     * @param {setup.Unit} unit
     */
    isCanCum(unit) {
        return unit.isCanOrgasm() && unit.isHasDick();
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {boolean}
     */
    isCanUse(unit, bodypart) {
        // no bodypart to begin with
        if (!bodypart.isHasBodypart(unit, this))
            return false;
        if (bodypart.isCanUseCovered()) {
            if (this.getDisablingEquipment(unit, bodypart)) {
                // disabled by equipment
                return false;
            }
        }
        else {
            if (this.getBlockingEquipment(unit, bodypart)) {
                // blocked by equipment
                return false;
            }
        }
        // busy choking on something
        if (this.isBodypartOngoing(unit, bodypart))
            return false;
        return true;
    }
    /* =============================
        CLOTHINGS
    ============================= */
    /**
     * get the outermost piece of equipment that covers this bodypart, if any
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {setup.Equipment | null}
     */
    getCoveringEquipment(unit, bodypart) {
        // special case: strapon can't be covered
        if (bodypart == setup.sexbodypart.penis && unit.isHasStrapOn())
            return null;
        for (const slot of bodypart.getEquipmentSlots()) {
            const eq = unit.getEquipmentAt(slot);
            if (eq && eq.isCovering())
                return eq;
        }
        return null;
    }
    /**
     * get the outermost piece of equipment that disables this bodypart, if any
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {setup.Equipment | null}
     */
    getDisablingEquipment(unit, bodypart) {
        // special case: strapon can't be disabled
        if (bodypart == setup.sexbodypart.penis && unit.isHasStrapOn())
            return null;
        // disabling only check the last one.
        const slots = bodypart.getEquipmentSlots();
        if (slots.length) {
            const slot = slots[slots.length - 1];
            const eq = unit.getEquipmentAt(slot);
            if (eq && eq.isMakeBodypartUseless())
                return eq;
        }
        return null;
    }
    /**
     * get the outermost piece of equipment that blocks this bodypart, if any
     * @param {setup.Unit} unit
     * @param {setup.SexBodypart} bodypart
     * @returns {setup.Equipment | null}
     */
    getBlockingEquipment(unit, bodypart) {
        const cover = this.getCoveringEquipment(unit, bodypart);
        if (cover)
            return cover;
        return this.getDisablingEquipment(unit, bodypart);
    }
    /**
     * Whether equipment at this slot has been (temporarily) displaced
     * @param {setup.Unit} unit
     * @param {setup.EquipmentSlot} equipment_slot
     * @returns {boolean}
     */
    isDisplaced(unit, equipment_slot) {
        return this._getParticipant(unit).displaced_equipment[equipment_slot.key];
    }
    /**
     * Removes an equipment from a unit until end of scene
     * @param {setup.Unit} unit
     * @param {setup.Equipment} equipment
     */
    displaceEquipment(unit, equipment) {
        this._getParticipant(unit).displaced_equipment[equipment.getSlot().key] = true;
        unit.resetCache();
    }
    displaceAllEquipments() {
        for (const unit of this.getUnits()) {
            for (const slot of Object.values(setup.equipmentslot)) {
                const equipment = unit.getEquipmentAt(slot);
                if (equipment) {
                    this.displaceEquipment(unit, equipment);
                }
            }
        }
    }
    /**
     * Wear a temporary equipment
     * @param {setup.Unit} unit
     * @param {setup.Equipment} equipment
     */
    equipTemporarily(unit, equipment) {
        this._getParticipant(unit).temporary_equipment[equipment.getSlot().key] = equipment.key;
        unit.resetCache();
    }
    /* =============================
        ACTION HISTORY
    ============================= */
    /**
     * @param {setup.Unit} unit
     * @returns {Array<setup.SexAction>}
     */
    getHistory(unit) {
        return this._getParticipant(unit).action_history;
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexAction} action_class
     */
    addHistory(unit, action_class) {
        this._getParticipant(unit).action_history.push(action_class);
    }
    /**
     * @param {setup.Unit} unit
     * @returns {setup.SexAction}
     */
    getLatestAction(unit) {
        const history = this._getParticipant(unit).action_history.filter(a => true);
        history.reverse();
        for (const action of history)
            if (action.getUnits()[0] == unit)
                return action;
        return null;
    }
    /* =============================
        AROUSAL
    ============================= */
    /**
     * @param {setup.Unit} unit
     * @param {number} adjustment
     */
    adjustArousal(unit, adjustment) {
        let arousal = this._getParticipant(unit).arousal + adjustment;
        arousal = Math.max(arousal, 0);
        arousal = Math.min(arousal, setup.Sex.AROUSAL_MAX);
        this._getParticipant(unit).arousal = arousal;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {number}
     */
    getArousal(unit) {
        return this._getParticipant(unit).arousal;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isArousalDepleted(unit) {
        return this.getArousal(unit) == 0;
    }
    /**
     * @param {setup.Unit} unit
     * @param {number} adjustment
     */
    adjustDiscomfort(unit, adjustment) {
        let discomfort = this._getParticipant(unit).discomfort + adjustment;
        discomfort = Math.max(discomfort, 0);
        discomfort = Math.min(discomfort, setup.Sex.AROUSAL_MAX);
        this._getParticipant(unit).discomfort = discomfort;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {number}
     */
    getDiscomfort(unit) {
        return this._getParticipant(unit).discomfort;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isDiscomfortDepleted(unit) {
        return this.getDiscomfort(unit) == 0;
    }
    /**
     * @param {setup.Unit} unit
     * @param {number} adjustment
     */
    adjustEnergy(unit, adjustment) {
        let energy = this._getParticipant(unit).energy + adjustment;
        energy = Math.max(energy, 0);
        energy = Math.min(energy, setup.Sex.AROUSAL_MAX);
        this._getParticipant(unit).energy = energy;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {number}
     */
    getEnergy(unit) {
        return this._getParticipant(unit).energy;
    }
    /**
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isEnergyDepleted(unit) {
        return this.getEnergy(unit) == 0;
    }
    /* =============================
        LOGIC
    ============================= */
    /**
     * Apply various "end-of-turn" decays to the unit
     * @param {setup.Unit} unit
     */
    applyDecays(unit) {
        { // Arousal decays
            const arousal = this.getArousal(unit);
            const to_decay_natural = Math.round(setup.Sex.AROUSAL_DECAY * arousal);
            // decay arousal from discomfort... unless you're a masochist
            let to_decay_discomfort = Math.round((setup.Sex.DISCOMFORT_AROUSAL_REDUCTION *
                this.getDiscomfort(unit) /
                setup.Sex.DISCOMFORT_MAX) * arousal);
            if (unit.isMasochistic()) {
                // opposite effect
                to_decay_discomfort *= -1;
            }
            this.adjustArousal(unit, Math.round(-to_decay_natural + -to_decay_discomfort));
        }
        { // Discomfort decays
            const discomfort = this.getDiscomfort(unit);
            let to_decay = setup.Sex.DISCOMFORT_DECAY * discomfort;
            this.adjustDiscomfort(unit, Math.round(-to_decay));
        }
    }
    /**
     * Whether the unit is climaxing
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isOrgasming(unit) {
        return this.isCanOrgasm(unit) && this.getArousal(unit) >= setup.Sex.AROUSAL_ORGASM_THRESHOLD;
    }
    /**
     * Whether the unit can phsyically orgasm. They have other rules too, but this is pure biological.
     * Essentially units can break the rules under some circumstances.
     * @param {setup.Unit} unit
     */
    isCanOrgasm(unit) {
        if (unit.isHasDick()) {
            return unit.isCanPhysicallyCum();
        }
        // Girls can always cum for now.
        return true;
    }
    /**
     * This unit orgasms, doing a lot of things to their stats.
     * @param {setup.Unit} unit
     */
    doOrgasm(unit) {
        // increment orgasm count
        this.addOrgasm(unit);
        // reset arousal
        this.adjustArousal(unit, -this.getArousal(unit));
        // reduce discomfort
        this.adjustDiscomfort(unit, -setup.Sex.DISCOMFORT_ORGASM_REDUCTION);
        // reduce energy
        this.adjustEnergy(unit, -setup.Sex.ENERGY_ORGASM_REDUCTION);
    }
    /* =============================
        TEXT THINGS
    ============================= */
    /**
     * @param {setup.Unit} unit
     * @returns {string}
     */
    repUnit(unit) {
        const position = this.getPosition(unit);
        const pose = this.getPose(unit);
        return `${position.rep()}${pose.rep(position, this)}${unit.rep()}`;
    }
    /* =============================
        STATIC THINGS
    ============================= */
    static cleanup() {
        if (State.temporary.gSex) {
            for (const unit of State.temporary.gSex.getUnits()) {
                unit.resetCache();
            }
        }
        delete State.temporary.gSex;
    }
    /**
     * Get default participant positions, poses, and values.
     * @param {setup.Unit[]} units
     * @returns {Participant[]}
     */
    static initParticipants(units) {
        const results = [];
        for (let i = 0; i < units.length; ++i) {
            const unit = units[i];
            const goal = setup.SexGoal.getStartingGoal(unit);
            let discomfort_initial = 0;
            if (goal == setup.sexgoal.resist) {
                discomfort_initial = setup.Sex.DISCOMFORT_RESIST_INITIAL;
            }
            let pose;
            if (unit.isSlave()) {
                pose = setup.sexpose.kneel;
            }
            else {
                pose = setup.sexpose.stand;
            }
            let position = setup.SexPosition.getAllPositions()[i];
            if (units.length == 1) {
                // alone must be in the center
                position = setup.sexposition.center;
            }
            results.push({
                unit: unit,
                goal: setup.SexGoal.getStartingGoal(unit),
                pace: setup.SexPace.getStartingPace(unit),
                permission: setup.SexPermission.getPermission(unit),
                arousal: 0,
                discomfort: discomfort_initial,
                energy: setup.Sex.ENERGY_MAX,
                position: position,
                pose: pose,
            });
        }
        return results;
    }
    static PARTICIPANTS_MAX = 3;
};
