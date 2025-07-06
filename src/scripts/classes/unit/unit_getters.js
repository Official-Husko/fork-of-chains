"use strict";
// @ts-nocheck
/**
 * @return {string}
 */
setup.Unit.prototype.getName = function () {
    return this.nickname;
};
/**
 * @return {string}
 */
setup.Unit.prototype.getFullName = function () {
    return this.name;
};
/**
 * @return {string}
 */
setup.Unit.prototype.getFirstName = function () {
    return this.first_name;
};
/**
 * @return {string}
 */
setup.Unit.prototype.getSurname = function () {
    return this.surname;
};
/**
 * @returns {setup.DutyInstance | null}
 */
setup.Unit.prototype.getDuty = function () {
    if (!this.duty_key)
        return null;
    return State.variables.duty[this.duty_key];
};
/**
 * @returns {setup.Team | null}
 */
setup.Unit.prototype.getTeam = function () {
    if (!this.team_key)
        return null;
    return State.variables.team[this.team_key];
};
/**
 * @returns {setup.Party | null}
 */
setup.Unit.prototype.getParty = function () {
    if (!this.party_key)
        return null;
    return State.variables.party[this.party_key];
};
/**
 * @returns {setup.QuestInstance | null}
 */
setup.Unit.prototype.getQuest = function () {
    if (!this.quest_key)
        return null;
    return State.variables.questinstance[this.quest_key];
};
/**
 * @returns {setup.OpportunityInstance | null}
 */
setup.Unit.prototype.getOpportunity = function () {
    if (!this.opportunity_key)
        return null;
    return State.variables.opportunityinstance[this.opportunity_key];
};
setup.Unit.prototype.getEquipmentSet = function () {
    if (!this.equipment_set_key)
        return null;
    return State.variables.equipmentset[this.equipment_set_key];
};
setup.Unit.prototype.isPlayerSlaver = function () {
    return (this.getJob() == setup.job.slaver && this.isYourCompany());
};
setup.Unit.prototype.isYou = function () {
    return this == State.variables.unit.player;
};
setup.Unit.prototype.getUnitGroup = function () {
    if (!this.unit_group_key)
        return null;
    return setup.unitgroup[this.unit_group_key];
};
setup.Unit.prototype.getCompany = function () {
    if (!this.company_key)
        return null;
    return State.variables.company[this.company_key];
};
setup.Unit.prototype.isYourCompany = function () {
    return this.getCompany() == State.variables.company.player;
};
/**
 * @returns {setup.Job}
 */
setup.Unit.prototype.getJob = function () {
    if (this.isRetired()) {
        return setup.job.retired;
    }
    else {
        return setup.job[this.job_key];
    }
};
setup.Unit.prototype.isSlaver = function () { return this.getJob() == setup.job.slaver; };
setup.Unit.prototype.isSlave = function () { return this.getJob() == setup.job.slave; };
setup.Unit.prototype.isSlaveOrInSlaveMarket = function () {
    // case one: unit already has the job
    if (this.isSlave())
        return true;
    // case two: unit is a free unit in market of that particular job
    if (!this.isYourCompany()) {
        const market = this.getMarket();
        if (market && market.getJob() == setup.job.slave) {
            return true;
        }
    }
    return false;
};
setup.Unit.prototype.isObedient = function () { return this.isHasTrait('training_obedience_advanced'); };
setup.Unit.prototype.isCompliant = function () { return this.isHasTrait('training_obedience_basic'); };
setup.Unit.prototype.isMindbroken = function () {
    // Special, because has to work when cache trait is in limbo
    return setup.trait.training_mindbreak.key in this.trait_key_map;
};
setup.Unit.prototype.isDefiant = function () {
    return this.isHasTrait('will_defiant') || this.isHasTrait('will_indomitable');
};
/**
 * @returns {boolean}
 */
setup.Unit.prototype.isHasStrapOn = function () {
    // only ever return true during sex.
    const genital_eq = this.getEquipmentAt(setup.equipmentslot.genital);
    if (genital_eq && genital_eq.getTags().includes('strapon')) {
        return true;
    }
    return false;
};
/**
 * @returns {boolean}
 */
setup.Unit.prototype.isHasDicklike = function () {
    return this.isHasDick() || this.isHasStrapOn();
};
setup.Unit.prototype.isHasDick = function () {
    return this.isHasTrait(setup.trait.dick_tiny);
};
setup.Unit.prototype.isInChastity = function () {
    return this.isHasTrait(setup.trait.eq_chastity);
};
setup.Unit.prototype.isHasVagina = function () {
    return this.isHasTrait(setup.trait.vagina_tight);
};
setup.Unit.prototype.isHasBreasts = function () {
    return this.isHasTrait(setup.trait.breast_tiny);
};
setup.Unit.prototype.isSubmissive = function () {
    return this.isHasTrait(setup.trait.per_submissive);
};
setup.Unit.prototype.isDominant = function () {
    return this.isHasTrait(setup.trait.per_dominant);
};
setup.Unit.prototype.isDominantSlave = function () {
    if (!this.isSlave())
        return false;
    return this.getMainTraining().getTags().includes('trdominance');
};
setup.Unit.prototype.isMasochistic = function () {
    return (this.isHasTrait(setup.trait.per_masochistic)
        ||
            (this.isSlave() &&
                this.getMainTraining().getTags().includes('trmasochist')));
};
setup.Unit.prototype.isInjured = function () {
    return State.variables.hospital.isInjured(this);
};
setup.Unit.prototype.isHasTitle = function (title) {
    return State.variables.titlelist.isHasTitle(this, title);
};
setup.Unit.prototype.addTitle = function (title) {
    return State.variables.titlelist.addTitle(this, title);
};
/**
 *
 * @param {setup.EquipmentSlot | string} slot
 * @returns {setup.Equipment}
 */
setup.Unit.prototype.getEquipmentAt = function (slot) {
    return setup.Text.Unit.Equipment.getEquipmentAt(this, setup.selfOrObject(slot, setup.equipmentslot));
};
/**
 * @returns {setup.Market | null}
 */
setup.Unit.prototype.getMarket = function () {
    if (!this.market_key)
        return null;
    return State.variables.market[this.market_key];
};
/**
 * @returns {setup.Unit | null}
 */
setup.Unit.prototype.getLover = function () {
    return State.variables.friendship.getLover(this);
};
/**
 * @returns {setup.Unit | null}
 */
setup.Unit.prototype.getBestFriend = function () {
    return State.variables.friendship.getBestFriend(this);
};
/**
 * @returns {Array<setup.Bedchamber>}
 */
setup.Unit.prototype.getOwnedBedchambers = function () {
    if (this.isSlaver()) {
        return State.variables.bedchamberlist.getBedchambers({
            slaver: this
        });
    }
    return [];
};
