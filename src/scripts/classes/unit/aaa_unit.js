// @ts-nocheck
setup.Unit = class Unit extends setup.TwineClass {
    /**
     *
     * @param {Array.<string>} bothnamearray
     * @param {Array.<setup.Trait>} traits
     * @param {Array | Object} skills_raw
     * @param {string=} unique_key
     */
    constructor(bothnamearray, traits, skills_raw, unique_key) {
        super();
        // skills: a 10 array indicating the initial value for the 10 skills in game.
        // A unit
        // Usually belongs to a company. Otherwise is unemployed.
        // E.g., a farmer belongs to the kingdom company.
        if (unique_key) {
            this.key = unique_key;
        }
        else {
            this.key = State.variables.Unit_keygen;
            State.variables.Unit_keygen += 1;
        }
        this.level = 1;
        this.first_name = bothnamearray[0];
        // some surname can be empty.
        this.surname = bothnamearray[1];
        if (this.surname)
            this.name = `${this.first_name} ${this.surname}`;
        else
            this.name = this.first_name;
        this.custom_image_name = '';
        this.nickname = this.first_name;
        /**
         * Unit's traits
         * @type {Object.<string, boolean>}
         */
        this.trait_key_map = {};
        /**
         * Unit's innate (skin) traits
         * @type {Object.<string, boolean>}
         */
        this.innate_trait_key_map = {};
        for (const trait of traits) {
            if (!trait)
                throw new Error(`Unrecognized trait for unit ${this.name}`);
            this.trait_key_map[trait.key] = true;
            if (trait.getTags().includes('skin')) {
                // skin traits are innate
                this.innate_trait_key_map[trait.key] = true;
            }
        }
        /**
         * List of unit's extra perk choices.
         * @type {string[]}
         */
        this.perk_keys_choices = [];
        // unit's speech type.
        this.speech_key = null;
        this.job_key = setup.job.unemployed.key;
        let skills = setup.Skill.translate(skills_raw);
        this.skills = [];
        // list of INVISIBLE tags. Useful for marking units for certain quests.
        this.tags = [];
        // level 1 skills, for implementing re-speccing later.
        this.base_skills = [];
        if (skills.length != setup.skill.length)
            throw new Error(`Skills must have exactly 10 elements`);
        for (let i = 0; i < skills.length; ++i) {
            this.skills.push(skills[i]);
            this.base_skills.push(skills[i]);
        }
        // this unit belongs to...
        this.team_key = null;
        this.party_key = null;
        this.company_key = null;
        this.unit_group_key = null;
        this.duty_key = null;
        this.contact_key = null;
        // Current quest this unit is tied to. E.g., relevant mostly for actors
        this.quest_key = null;
        this.opportunity_key = null;
        this.market_key = null;
        this.equipment_set_key = null;
        this.exp = 0;
        this.weeks_with_you = 0; // accumulated number of weeks this unit has been with your company.
        this.origin = ''; // flavor text to supplement unit origin
        // the quest/event/interaction/etc that generates this unit. For debug only.
        this.debug_generator_type = null;
        this.debug_generator_key = null;
        this.skill_focus_keys = [];
        /**
         * @type {string[]}
         */
        this.history = [];
        if (this.key in State.variables.unit)
            throw new Error(`Unit ${this.key} duplicated`);
        State.variables.unit[this.key] = this;
        this.is_speech_reset = true;
        this.reSeed();
    }
    /**
     * How many perks can this unit learn?
     * @returns {number}
     */
    getStandardPerkLimit() {
        let perks = 0;
        for (const level of setup.PERK_GAIN_AT_LEVEL) {
            if (this.getLevel() >= level)
                ++perks;
        }
        return perks;
    }
    /**
     * How many special perks can this unit learn?
     * @returns {number}
     */
    getSpecialPerkLimit() {
        return setup.TRAIT_MAX_HAVE.perkspecial;
    }
    /**
     * @returns {boolean}
     */
    isCanLearnNewPerk() {
        return this.getLearnablePerks().length > 0;
    }
    /**
     * Return list of all perks that this unit could possibly learn. Must re-check that the unit can actually learn it.
     * @returns {setup.Perk[]}
     */
    getPerkChoices() {
        if (!this.perk_keys_choices.length) {
            // generate extra perk choices.
            const perks = [];
            /**
             * @type {setup.Perk[]}
             */
            // @ts-ignore
            const all_perks = setup.TraitHelper.getAllTraitsOfTags(['perk']).filter(perk => !perk.getTags().includes('perkspecial'));
            const available = all_perks.filter(perk => perk.isPerkAvailableInChoiceFor(this));
            const available_nonbasic = available.filter(perk => !perk.getTags().includes('perkbasic'));
            // compute the random perks
            const others = available_nonbasic.filter(perk => !perks.includes(perk));
            setup.rng.shuffleArray(others);
            // if player character, can learn everything
            if (this.isYou()) {
                perks.push(...all_perks);
            }
            else {
                for (const perk of others) {
                    if (perks.length < setup.PERK_EXTRA_CHOICES) {
                        perks.push(perk);
                    }
                }
                // also, all basic perks are always available
                perks.push(...available.filter(perk => perk.getTags().includes('perkbasic')));
            }
            this.perk_keys_choices = perks.map(perk => perk.key);
        }
        const base = this.perk_keys_choices.map(key => setup.trait[key]);
        base.sort(setup.Trait_Cmp);
        // @ts-ignore
        return base;
    }
    /**
     * @returns {setup.Perk[]}
     */
    getLearnablePerks() {
        /**
         * @type {setup.Perk[]}
         */
        const learnable = [];
        if (!this.isSlaver())
            return learnable;
        const perks = this.getAllTraitsWithTag('perk');
        const choices = this.getPerkChoices().filter(perk => !this.isHasTrait(perk));
        const current_standard_perks = perks.filter(perk => !perk.isSpecial());
        if (current_standard_perks.length < this.getStandardPerkLimit()) {
            learnable.push(...choices.filter(perk => !perk.isSpecial()));
        }
        const current_special_perks = perks.filter(perk => perk.isSpecial());
        if (current_special_perks.length < this.getSpecialPerkLimit()) {
            learnable.push(...choices.filter(perk => perk.isSpecial()));
        }
        return learnable;
    }
    /**
     * Force add a perk choice. Works for non basic perks.
     * @param {setup.Trait} trait
     * @returns {boolean}  whether succesfully added. Can fail, e.g., when the unit already know it
     */
    addPerkChoice(trait) {
        if (trait.getTags().includes('perkbasic')) {
            throw new Error(`Can only add non basic perks, not ${trait.key}!`);
        }
        // generate perks
        this.getPerkChoices();
        if (this.perk_keys_choices.includes(trait.key)) {
            // already know this perk
            if (this.isYourCompany()) {
                setup.notify(`a|Rep a|was supposed to gain access to the ${trait.rep()} perk, but a|they already a|know it`, { a: this });
            }
            return false;
        }
        this.perk_keys_choices.push(trait.key);
        if (this.isYourCompany()) {
            setup.notify(`a|Rep a|gain access to the ${trait.rep()} perk!`, { a: this });
        }
        return true;
    }
    /**
     * Force remove a perk choice. Relevant for special perks.
     * @param {setup.Trait} trait
     */
    removePerkChoice(trait) {
        if (trait.getTags().includes('perkbasic')) {
            throw new Error(`Can only remove non-basic traits from perk choice, not ${trait.key}!`);
        }
        // generate perks
        this.getPerkChoices();
        if (!this.perk_keys_choices.includes(trait.key)) {
            // does not know the perk
            return;
        }
        this.perk_keys_choices = this.perk_keys_choices.filter(key => key != trait.key);
        if (this.isYourCompany()) {
            setup.notify(`a|Rep a|lose access to the ${trait.rep()} perk!`, { a: this });
        }
        if (this.isHasRemovableTrait(trait)) {
            this.removeTraitExact(trait);
        }
    }
    /**
     * @param {setup.Perk} trait
     * @returns {boolean}
     */
    isHasPerkChoice(trait) {
        return this.getPerkChoices().includes(trait);
    }
    /**
     * @returns {setup.Contact | null}
     */
    getContact() {
        if (!this.contact_key)
            return null;
        return State.variables.contact[this.contact_key];
    }
    /**
     * @returns {boolean}
     */
    _isCanDelete() {
        return (!this.quest_key &&
            !this.opportunity_key &&
            !this.market_key &&
            !this.company_key &&
            !this.unit_group_key &&
            !this.contact_key &&
            !this.isRetired() &&
            !State.variables.bodyshift.isSpareBody(this) &&
            !State.variables.eventpool.isUnitScheduledForEvent(this));
    }
    delete() {
        // there is a check here because sometimes the unit can be removed and then immediately added again
        // e.g., see Light in Darkness disaster results.
        // Note: need to update because delete can be on stale object
        const check_obj = State.variables.unit[this.key];
        if (check_obj && check_obj._isCanDelete()) {
            this.clearCache();
            State.variables.unitimage.deleteUnit(this);
            State.variables.activitylist.removeUnitActivity(this);
            State.variables.hospital.deleteUnit(this);
            State.variables.friendship.deleteUnit(this);
            State.variables.trauma.deleteUnit(this);
            State.variables.family.deleteUnit(this);
            State.variables.leave.deleteUnit(this);
            State.variables.bodyshift.deleteUnit(this);
            State.variables.skillboost.deleteUnit(this);
            if (this.key in State.variables.unit) {
                delete State.variables.unit[this.key];
            }
        }
    }
    checkDelete() {
        let check_obj = State.variables.unit[this.key];
        if (check_obj && check_obj._isCanDelete()) {
            setup.queueDelete(check_obj, 'unit');
        }
    }
    /**
     * @returns {boolean}
     */
    isRetired() {
        return State.variables.retiredlist.isRetired(this);
    }
    /**
     * @returns {setup.Living}
     */
    getLiving() {
        return State.variables.retiredlist.getLiving(this);
    }
    advanceWeek() {
        if (this.isYourCompany()) {
            this.weeks_with_you += 1;
        }
        for (const trait of this.getTraits()) {
            trait.advanceWeek(this);
        }
        this.resetCache();
    }
    reSeed() {
        this.seed = Math.floor(Math.random() * 999999997);
    }
    setName(firstname, surname) {
        let changenick = (this.nickname == this.first_name);
        this.first_name = firstname;
        this.surname = surname;
        if (changenick)
            this.nickname = this.first_name;
        if (this.surname)
            this.name = `${this.first_name} ${this.surname}`;
        else
            this.name = this.first_name;
        this.resetCache();
    }
    getWeeksWithCompany() {
        return this.weeks_with_you;
    }
    resetWeeksWithCompany() {
        this.weeks_with_you = 0;
    }
    getOrigin() { return setup.Text.replaceUnitMacros(this.origin, { a: this }); }
    setOrigin(origin_text) {
        this.origin = origin_text;
        this.resetCache();
    }
    /**
     * TRAITS ARE UNRELIABLE here, due to being called when traits are refreshed.
     * Do NOT use trait methods like isMindbroken
     *
     * @typedef {Array<{value: number, title: string}>} ValueBreakdown
     *
     * @returns {ValueBreakdown}
     */
    getSlaveValueBreakdown() {
        /**
         * @type {ValueBreakdown}
         */
        const result = [];
        result.push({
            value: setup.SLAVE_BASE_VALUE,
            title: 'Base',
        });
        // increase value based on traits. Cannot use computed traits, because computed traits depend on this
        let traits = this.getBaseTraits();
        // add trauma to list of traits, because they are special and have negative value
        traits = traits.concat(State.variables.trauma.getTraits(this));
        const isdemon = this.getRace() == setup.trait.race_demon;
        for (const trait of traits) {
            const trait_value = trait.getSlaveValue();
            if (isdemon && trait_value < 0 && trait.isCorruption()) {
                // demons ignore demonic bodypart penalty
                continue;
            }
            if (trait_value) {
                result.push({
                    value: trait_value,
                    title: trait.rep(),
                });
            }
        }
        // increase value based on ALL titles
        for (const title of State.variables.titlelist.getAllTitles(this)) {
            const value = title.getSlaveValue();
            if (value) {
                result.push({
                    value: value,
                    title: title.rep()
                });
            }
        }
        return result;
    }
    /**
     * TRAITS ARE UNRELIABLE here, due to being called when traits are refreshed.
     * Do NOT use trait methods like isMindbroken
     *
     * @returns {number}
     */
    getSlaveValue() {
        // reset unit value cache
        if (!State.variables.cache.has('unitvalue', this.key)) {
            const value = Math.round(this.getSlaveValueBreakdown().map(breakdown => breakdown.value).reduce((a, b) => a + b, 0));
            State.variables.cache.set('unitvalue', this.key, value);
        }
        return State.variables.cache.get('unitvalue', this.key);
    }
    getSluttinessLimit() {
        if (this.isYou())
            return setup.INFINITY;
        let base;
        if (this.isHasTraitExact(setup.trait.per_chaste)) {
            base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_CHASTE;
        }
        else if (this.isHasTraitExact(setup.trait.per_sexaddict)) {
            base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_SEXADDICT;
        }
        else if (this.isHasTraitExact(setup.trait.per_lustful)) {
            base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_LUSTFUL;
        }
        else {
            base = setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL;
        }
        if (!this.isHasTrait(setup.trait.per_chaste) && this.isHasTrait(setup.trait.perk_sluttiness)) {
            base += setup.PERK_SLUTTINESS_LIMIT_INCREASE;
        }
        return base;
    }
    /**
     * @returns {boolean}
     */
    isCanChangeEquipmentSet() {
        return State.variables.fort.player.isHasBuilding('armory') && this.isYourCompany() && this.isHome();
    }
    /**
     * @param {setup.EquipmentSet} equipment_set
     * @returns {boolean}
     */
    isCanWear(equipment_set) {
        return this.isCanChangeEquipmentSet() && equipment_set.isEligibleOn(this);
    }
    /**
     * Whether the unit is currently busy with a quest/opp/event/market/etc
     * Must ABSOLUTELY not be disturbed or selected by events
     * Work for all jobs
     *
     * @returns {boolean}
     */
    isEngaged() {
        return (this.quest_key || this.opportunity_key || this.market_key);
    }
    /**
     * Whether the unit is currently at your fort. Mainly for your units
     * Use isEngaged() for NPCs
     *
     * @param {boolean} [ignore_leave]
     * @returns {boolean}
     */
    isHome(ignore_leave) {
        if (!this.isYourCompany())
            return false; // not in your company
        if (this.isEngaged())
            return false; // on a quest/opp/somewhere sold
        if (!ignore_leave && State.variables.leave.isOnLeave(this))
            return false; // on leave
        return true;
    }
    /**
     * Whether the unit is currently at your fort AND not injured. Mainly for your units
     * Use isEngaged() for NPCs
     *
     * @returns {boolean}
     */
    isAvailable() {
        return this.isHome() && !State.variables.hospital.isInjured(this);
    }
    /**
     * Whether the unit is busy with something right now. Mainly for your units
     * Use isEngaged() for NPCs
     *
     * @returns {boolean}
     */
    isBusy() {
        if (!this.isAvailable())
            return true;
        const duty = this.getDuty();
        if (duty)
            return true;
        return false;
    }
    /**
     * Get a pseudo-random number based on this unit's seed and the given string.
     * Useful for making the unit has certain property, e.g., which preferred weapon
     * @param {string} stringobj
     */
    Seed(stringobj) {
        let t = `${stringobj}_${this.seed}`;
        let res = Math.abs(t.hashCode()) % 1000000009;
        return res;
    }
    /**
     * Gets a random value between 0 and almost 1.0. Never returns 1.0
     * @param {string} stringobj
     */
    seedFloat(stringobj) {
        const val = this.Seed(stringobj);
        return val / 1000000009.0;
    }
    // get bedchamber, if any. If a unit has multiple, return one at random.
    /**
     * @returns {setup.Bedchamber | null}
     */
    getBedchamber() {
        if (this.isSlave()) {
            const duty = this.getDuty();
            if (duty && duty instanceof setup.DutyInstanceBedchamberSlave) {
                return duty.getBedchamber();
            }
            else {
                return null;
            }
        }
        else if (this.isSlaver()) {
            const bedchambers = State.variables.bedchamberlist.getBedchambers({ slaver: this });
            if (bedchambers.length) {
                return setup.rng.choice(bedchambers);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    /**
     * @returns {string}  full, animal, or none
     */
    getSpeechRule() {
        if (!this.isSlave())
            return 'full';
        const bedchamber = this.getBedchamber();
        if (!bedchamber)
            return 'full';
        return bedchamber.getOption('speech');
    }
    /**
     * @returns {string}  normal, cum, or milk
     */
    getFoodRule() {
        if (!this.isSlave())
            return 'normal';
        const bedchamber = this.getBedchamber();
        if (!bedchamber)
            return 'normal';
        return bedchamber.getOption('food');
    }
    /**
     * @returns {setup.Unit | null}
     */
    getBedchamberOtherSlave() {
        const bedchamber = this.getBedchamber();
        if (this.isSlave() && bedchamber) {
            for (const slave of bedchamber.getSlaves()) {
                if (slave != this)
                    return slave;
            }
        }
        return null;
    }
    isUsableBy(unit) {
        if (State.variables.hospital.isInjured(this))
            return false;
        if (!this.isHome())
            return false;
        let bedchamber = this.getBedchamber();
        if (!unit.isSlave() || !bedchamber || !bedchamber.isPrivate())
            return true;
        return bedchamber.getSlaver() == unit;
    }
    /**
     * @returns {setup.Trait}
     */
    getMainTraining() { return setup.UnitTitle.getMainTraining(this); }
    /**
     * Clears this unit's cache.
     */
    clearCache() {
        this.resetTraitMapCache();
        this.resetSkillCache();
        // reset unit value cache
        State.variables.cache.clear('unitvalue', this.key);
        this.resetSpeech();
    }
    /**
     * Resets this unit's cache, because something has changed.
     * resetImage can repopulate the cleared cache. Do not use this method when preparing to delete a unit.
     */
    resetCache() {
        this.clearCache();
        State.variables.unitimage.resetImage(this);
    }
    /**
     * @returns {boolean}
     */
    isCanHaveSexWithYou() {
        return (!this.isYou() &&
            this.isAvailable() &&
            State.variables.unit.player.isAvailable() &&
            State.variables.fort.player.isHasBuilding('dungeons') &&
            this.isUsableBy(State.variables.unit.player) &&
            !this.isDefiant());
    }
    /**
     * Whether this unit acts submissively TO the target unit.
     * @param {setup.Unit} unit
     * @returns {boolean}
     */
    isSubmissiveTo(unit) {
        if (this.isSlave() && !unit.isSlave())
            return true;
        return ((!this.isDominant() && unit.isDominant()) ||
            (this.isSubmissive() && !unit.isSubmissive()));
    }
    /**
     * Whether this unit can be dismissed
     * @returns {boolean}
     */
    isCanBeDismissed() {
        return this.isYourCompany() && this.isHome() && !this.getParty() && !this.isYou() && (this.isSlave() ||
            State.variables.company.player.getUnits({ job: setup.job.slaver }).length > setup.SLAVER_COUNT_MINIMUM);
    }
    /**
     * Whether this unit can be selected for auto-assignment.
     * @returns {boolean}
     */
    isCanGoOnQuestsAuto() {
        if (this.getDuty() && !this.getDuty().isCanGoOnQuestsAuto())
            return false;
        if (this.getParty() && !this.getParty().isCanGoOnQuestsAuto())
            return false;
        return true;
    }
    /**
     * @param {ContentTemplate} content_template
     */
    setDebugInfo(content_template) {
        if (!this.debug_generator_key) {
            this.debug_generator_key = content_template.key;
            this.debug_generator_type = content_template.TYPE;
        }
    }
    /**
     * @returns {setup.Rarity}
     */
    getRarity() {
        const value = this.getSlaveValue();
        if (value >= 30000) {
            return setup.rarity.legendary;
        }
        else if (value >= 10000) {
            return setup.rarity.epic;
        }
        else if (value >= 5000 || State.variables.titlelist.getAllTitles(this).length) {
            return setup.rarity.rare;
        }
        else if (value >= 3000) {
            return setup.rarity.uncommon;
        }
        else {
            return setup.rarity.common;
        }
    }
    static BUSY_QUEST_URL = 'img/special/busy_quest.svg';
    static BUSY_OPPORTUNITY_URL = 'img/special/busy_opportunity.svg';
    static BUSY_LEAVE_URL = 'img/special/busy_leave.svg';
    static BUSY_INJURY_URL = 'img/special/busy_injury.svg';
    static BUSY_DUTY_URL = 'img/special/busy_duty.svg';
    static BUSY_OTHER_URL = 'img/special/busy_other.svg';
    static BUSY_IDLE_URL = 'img/special/busy_idle.svg';
    static DANGER_IMAGE_URL = 'img/special/danger.svg';
    static LOVERS_IMAGE_URL = 'img/special/lovers.svg';
    static INJURY_IMAGE_URL = 'img/other/injury.svg';
};
// Retrieves any unit that satisfies something:
/**
 * @param {{
 * job?: setup.Job | string
 * tag?: string
 * duty?: string
 * title?: string | setup.Title
 * available?: boolean
 * skill_max?: setup.Skill
 * trait?: setup.Trait | string
 * alltraits?: Array<setup.Trait | string>
 * anytraits?: Array<setup.Trait | string>
 * random?: boolean
 * notyou?: boolean
 * injured?: boolean
 * }} filter_dict
 * @returns
 */
setup.getUnit = function ({ job, tag, duty, title, available, skill_max, trait, random, alltraits, anytraits, notyou, injured, }) {
    let candidates = [];
    if (duty && !(duty in setup.dutytemplate)) {
        throw new Error(`Unrecognized duty template key: ${duty}`);
    }
    for (let unitkey in State.variables.unit) {
        const unit = State.variables.unit[unitkey];
        if (job && unit.getJob() != setup.selfOrObject(job, setup.job))
            continue;
        if (tag && !unit.getTags().includes(tag))
            continue;
        if (title && !unit.isHasTitle(setup.selfOrObject(title, setup.title)))
            continue;
        if (available && !unit.isAvailable())
            continue;
        if (trait && !unit.isHasTrait(trait))
            continue;
        if (alltraits && alltraits.filter(trait => !unit.isHasTraitExact(trait)).length)
            continue;
        if (anytraits && !unit.isHasAnyTraitExact(anytraits))
            continue;
        if (notyou && unit.isYou())
            continue;
        if (injured && !unit.isInjured())
            continue;
        if (duty && (!unit.getDuty() || unit.getDuty().getTemplate().key != duty))
            continue;
        if (!random && !skill_max)
            return unit;
        candidates.push(unit);
    }
    if (!candidates.length)
        return null;
    if (skill_max) {
        candidates.sort((a, b) => b.getSkill(skill_max) - a.getSkill(skill_max));
        return candidates[0];
    }
    return setup.rng.choice(candidates);
};
// retrieves a unit that satisfies something, if any. Otherwise, return yourself (useful for testing)
setup.getUnitOrAny = function (filter_dict) {
    const unit = setup.getUnit(filter_dict);
    if (unit)
        return unit;
    return State.variables.unit.player;
};
/**
 * Like getUnit but randomly pick the unit
 * @param {object} kwargs
 */
setup.getUnitRandom = function (kwargs) {
    kwargs['random'] = true;
    return setup.getUnit(kwargs);
};
/**
 * @typedef {{preferences: string[], forbidden?: setup.Unit[]}} GetDutySlaverForTalkingToArgs
 *
 * @param {GetDutySlaverForTalkingToArgs} args
 */
function getDutySlaverForTalkingTo({ preferences, forbidden }) {
    const parsed_forbidden = forbidden || [];
    for (const pref of preferences) {
        const unit = State.variables.dutylist.getUnitIfAvailable(pref);
        if (unit && !unit.isYou() && unit.isAvailable() && !parsed_forbidden.includes(unit))
            return unit;
    }
    let units = State.variables.company.player.getUnits({
        available: true,
        job: setup.job.slaver,
    }).filter(unit => !unit.isYou() && !parsed_forbidden.includes(unit));
    if (units.length)
        return setup.rng.choice(units);
    units = State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(a => !a.isYou() && !parsed_forbidden.includes(a));
    return setup.rng.choice(units);
}
/**
 * Retrieves any available slaver unit on duty, with preference for a certain job
 * The prefrences is strings, which is lowercase version of the duty (e.g., Marketer becomes marketer)
 * This is done for writer's convenience
 * @param  {...string} preference
 */
setup.getDutySlaver = function (...preference) {
    return getDutySlaverForTalkingTo({ preferences: preference });
};
/**
 * Gets any slaver for talking to in quest descriptions
 * @param {setup.Unit[]} [forbidden]
 */
setup.getAnySlaver = function (forbidden) {
    return getDutySlaverForTalkingTo({
        preferences: ['viceleader'],
        forbidden: forbidden,
    });
};
/**
 * @param {setup.Unit[]} units
 * @param {{
 * trait?: setup.Trait | string
 * anytrait?: Array<setup.Trait | string>
 * notrait?: Array<setup.Trait | string>
 * alltrait?: Array<setup.Trait | string>
 * }} args
 *
 * @returns {setup.Unit | null}
 */
setup.selectUnit = function (units, { trait, anytrait, notrait, alltrait }) {
    if (trait) {
        units = units.filter(unit => unit.isHasTrait(setup.selfOrObject(trait, setup.trait)));
    }
    if (anytrait) {
        units = units.filter(unit => unit.isHasAnyTraitExact(anytrait.map(key => setup.selfOrObject(key, setup.trait))));
    }
    if (notrait) {
        units = units.filter(unit => !unit.isHasAnyTraitExact(notrait.map(key => setup.selfOrObject(key, setup.trait))));
    }
    if (alltrait) {
        units = units.filter(unit => !unit.isHasTraitsExact(alltrait.map(key => setup.selfOrObject(key, setup.trait))));
    }
    if (units.length) {
        return setup.rng.choice(units);
    }
    else {
        return null;
    }
};
export {};
