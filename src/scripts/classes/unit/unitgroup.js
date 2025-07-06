// @ts-nocheck
export const IMPORTABLE = true;
// not made into proper class due to unitgroupcompose
setup.UnitGroup = class UnitGroup extends setup.TwineClass {
    static keygen = 1; // only used in dev tool
    /**
     * @param {string} key
     * @param {string} name
     * @param {setup.UnitPool[] | string} unitpools
     * @param {number} reuse_chance
     * @param {setup.Cost[]} unit_post_process
     */
    constructor(key, name, unitpools, reuse_chance, unit_post_process) {
        super();
        // Represents a group of people. E.g.,
        // farmers in citizens,
        // slaves in docks, etc.
        // A quest may request one of these units as actor
        // A quest may also offer some unit back to this pool.
        // unitpools: [[unitpool1, weight], ...]
        // unit_post_process: a series of cost objects. Actor name is
        // "unit". So e.g., setup.qc.Trait('unit', 'bg_farmer') to give them farmer background.
        if (!key) {
            this.key = String(setup.UnitGroup.keygen++);
        }
        else {
            this.key = key;
        }
        this.name = name;
        /**
         * @type {Array<[string, number]>}
         */
        this.unitpool_keys = [];
        if (setup.isString(unitpools)) {
            // @ts-ignore
            unitpools = setup.unitgroup[unitpools].getUnitPools();
        }
        for (let i = 0; i < unitpools.length; ++i) {
            this.unitpool_keys.push([unitpools[i][0].key, unitpools[i][1]]);
        }
        if (this.unitpool_keys.length) {
            setup.rng.normalizeChanceArray(this.unitpool_keys);
        }
        this.reuse_chance = reuse_chance;
        /**
         * Whether this unit group is a "base" unit group, and not a quest-made unit group.
         * @type {boolean}
         */
        this.is_base = false;
        this.unit_post_process = unit_post_process || [];
        for (let i = 0; i < unit_post_process.length; ++i) {
            let k = unit_post_process[i];
            if (!k)
                throw new Error(`unit group ${key} missing unit post process ${i}`);
            // @ts-ignore
            if ('actor_name' in k && k.actor_name != 'unit')
                throw new Error(`unit group ${key} post process ${i} actor name must be "unit"`);
        }
        // behavior different for backwards compatibility:
        if (this.key in setup.unitgroup) {
            // do nothing
        }
        else {
            setup.unitgroup[this.key] = this;
        }
        this.temporary_unit_key = null;
    }
    /**
     * @returns {boolean}
     */
    isBase() { return this.is_base; }
    toJs() {
        let base = `new setup.UnitGroup(\n`;
        base += `"${this.key}",\n`;
        base += `"${setup.escapeJsString(this.name)}",\n`;
        // for pools, check if some existing unitgroup has the exact same pools.
        let exist = null;
        for (const unit_group of Object.values(setup.unitgroup)) {
            if (unit_group instanceof setup.UnitGroup &&
                unit_group.isBase()) {
                // check if the unit pools are the same
                const up1 = unit_group.unitpool_keys;
                const up2 = this.unitpool_keys;
                if (up1.length == up2.length) {
                    let same = true;
                    for (let i = 0; i < up1.length; ++i) {
                        if (up1[i][0] != up2[i][0] || Math.abs(up1[i][1] - up2[i][1]) > 0.000001) {
                            same = false;
                        }
                    }
                    if (same) {
                        exist = unit_group;
                        break;
                    }
                }
            }
        }
        if (exist) {
            base += `'${exist.key}', """ /* pools */ """\n`;
        }
        else {
            base += `[ """ /* pools */ """\n`;
            for (const [pool, weight] of this.getUnitPools()) {
                base += `&nbsp; [setup.unitpool.${setup.keyOrSelf(pool)}, ${weight}],\n`;
            }
            base += '],\n';
        }
        base += `${this.reuse_chance},  """ /* reuse chance */ """\n`;
        base += `[ """ /* unit post process */ """\n`;
        for (const postprocess of this.unit_post_process) {
            base += `&nbsp; ${postprocess.text()},\n`;
        }
        base += `],\n`;
        base += `)`;
        return base;
    }
    rep() {
        return setup.repMessage(this, 'unitgroupcardkey');
    }
    getUnitPools() {
        let result = [];
        for (let i = 0; i < this.unitpool_keys.length; ++i) {
            let up = this.unitpool_keys[i];
            result.push([setup.unitpool[up[0]], up[1]]);
        }
        return result;
    }
    getActorUnit(actor_name) {
        if (actor_name != 'unit')
            throw new Error(`Unknown actor name ${actor_name}`);
        if (!this.temporary_unit_key)
            throw new Error(`temporary unit not set`);
        return State.variables.unit[this.temporary_unit_key];
    }
    resetUnitGroupUnitKeys() {
        if (this.reuse_chance) {
            if (!(this.key in State.variables.unitgroup_unit_keys)) {
                State.variables.unitgroup_unit_keys[this.key] = [];
            }
        }
    }
    /**
     * Return the only unit in this group, if any. Ignores busy status.
     * @return {setup.Unit | null}
     */
    getOnlyUnit() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            throw new Error(`GetOnlyUnit only usable when reuse chance is non zero`);
        let unit_keys = State.variables.unitgroup_unit_keys[this.key];
        if (!unit_keys.length)
            return null;
        return State.variables.unit[unit_keys[0]];
    }
    /**
     * Get all units of this unit group, regardless of where they are
     * @return {setup.Unit[]}
     */
    getAllUnits() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            throw new Error(`getAllUnits only usable when reuse chance is non zero`);
        const unit_keys = State.variables.unitgroup_unit_keys[this.key];
        if (!unit_keys)
            return [];
        return unit_keys.map(key => State.variables.unit[key]);
    }
    /**
     * Generate a new unit
     * @returns {setup.Unit}
     */
    _generateUnit(preference) {
        // keep attempting to find the target unit
        let tries = 1;
        if (preference)
            tries = preference.retries + 1;
        let unit = null;
        for (let i = 0; i < tries; ++i) {
            const unitpool_key = setup.rng.sampleArray(this.unitpool_keys);
            const unitpool = setup.unitpool[unitpool_key];
            if (!unitpool) {
                throw new Error(`Missing unit pool for ${this.key} unit group?`);
            }
            unit = unitpool.generateUnit();
            if (i < tries - 1 && preference && !unit.isHasTraitExact(setup.trait[preference.trait_key])) {
                unit.delete();
            }
            else {
                break;
            }
        }
        setup.RestrictionLib.applyAll(this.unit_post_process, setup.costUnitHelperDict({ unit: unit }));
        return unit;
    }
    getUnit(preference) {
        this.resetUnitGroupUnitKeys();
        // cleanup first so that it doesnt get returned then cleaned.
        this.cleanUnits();
        // find a free unit (i.e., unit.quest_key = null)
        if (Math.random() < this.reuse_chance) {
            // try to reuse if possible
            let possible_units = [];
            let unit_keys = State.variables.unitgroup_unit_keys[this.key];
            for (let i = 0; i < unit_keys.length; ++i) {
                let unit_key = unit_keys[i];
                let unit = State.variables.unit[unit_key];
                if (unit.isEngaged())
                    continue;
                possible_units.push(unit);
            }
            if (possible_units.length) {
                return possible_units[Math.floor(Math.random() * possible_units.length)];
            }
        }
        const unit = this._generateUnit(preference);
        // only give unit a group if it's going to be reused, otherwise will be garbage collected.
        if (this.reuse_chance) {
            this.resetUnitGroupUnitKeys();
            unit.unit_group_key = this.key;
            // @ts-ignore
            State.variables.unitgroup_unit_keys[this.key].push(unit.key);
        }
        return unit;
    }
    // remove the unit from the group. E.g., because its taken, killed, etc.
    /**
     * @param {setup.Unit} unit
     */
    removeUnit(unit) {
        this.resetUnitGroupUnitKeys();
        if (unit.unit_group_key != this.key)
            throw new Error(`invalid unit`);
        if (this.reuse_chance) {
            let unit_keys = State.variables.unitgroup_unit_keys[this.key];
            if (!unit_keys.includes(unit.key))
                throw new Error(`invalid array`);
            State.variables.unitgroup_unit_keys[this.key] = unit_keys.filter(item => item != unit.key);
        }
        unit.unit_group_key = null;
        unit.checkDelete();
    }
    isEmpty() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            return true;
        let unit_keys = State.variables.unitgroup_unit_keys[this.key];
        return unit_keys.length == 0;
    }
    isBusy() {
        for (const unit of this.getAllUnits()) {
            if (unit.isEngaged()) {
                return true;
            }
        }
        return false;
    }
    hasUnbusyUnit() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            return false;
        let unit_keys = State.variables.unitgroup_unit_keys[this.key];
        if (!unit_keys)
            throw new Error(`Unit keys not found for ${this.key}`);
        for (let i = 0; i < unit_keys.length; ++i) {
            let unit = State.variables.unit[unit_keys[i]];
            if (!unit.isEngaged())
                return true;
        }
        return false;
    }
    addUnit(unit) {
        if (unit.unit_group_key)
            throw new Error(`Already in a group`);
        if (unit.company_key)
            throw new Error(`Already in a company`);
        if (!this.reuse_chance) {
            // just garbage collect in this case.
            unit.checkDelete();
        }
        else {
            this.resetUnitGroupUnitKeys();
            let unit_keys = State.variables.unitgroup_unit_keys[this.key];
            unit_keys.push(unit.key);
            unit.unit_group_key = this.key;
        }
        this.cleanUnits();
    }
    // remove unit if too many
    cleanUnits() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            return;
        if (this.reuse_chance == 2)
            return; // special case for reserved unit
        let unit_keys = State.variables.unitgroup_unit_keys[this.key];
        while (unit_keys.length > setup.UNIT_GROUP_MAX_UNITS) {
            let rmkey = setup.rng.choice(unit_keys);
            let unit = State.variables.unit[rmkey];
            this.removeUnit(unit);
            unit_keys = State.variables.unitgroup_unit_keys[this.key];
        }
    }
    // remove all units from this group
    removeAllUnits() {
        this.resetUnitGroupUnitKeys();
        if (!this.reuse_chance)
            return;
        let unit_keys = State.variables.unitgroup_unit_keys[this.key];
        while (unit_keys.length > 0) {
            let rmkey = unit_keys[0];
            let unit = State.variables.unit[rmkey];
            this.removeUnit(unit);
            unit_keys = State.variables.unitgroup_unit_keys[this.key];
        }
    }
    getName() {
        return this.name;
    }
    /**
     * @returns {{mean: number, min: number, max: number}}
     */
    computeStatistics() {
        try {
            let sumval = 0;
            let min = setup.INFINITY;
            let max = 0;
            for (let i = 0; i < setup.COMPUTE_APPROXIMATE_VALUE_REPS; ++i) {
                const unit = this._generateUnit();
                sumval += unit.getSlaveValue();
                min = Math.min(min, unit.getSlaveValue());
                max = Math.max(max, unit.getSlaveValue());
                unit.delete();
            }
            State.variables.notification.popAll();
            const mean = Math.round(sumval / setup.COMPUTE_APPROXIMATE_VALUE_REPS * setup.COMPUTE_APPROXIMATE_VALUE_MULTIPLIER);
            return {
                min: min,
                max: max,
                mean: mean,
            };
        }
        catch (ex) {
            // the unit group is a special one that cannot generate units
            return {
                min: 0,
                max: 0,
                mean: 0,
            };
        }
    }
};
