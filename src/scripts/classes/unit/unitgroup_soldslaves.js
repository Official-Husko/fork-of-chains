// @ts-nocheck
// not made into proper class due to unitgroupcompose
setup.UnitGroupSoldSlaves = class UnitGroupSoldSlaves extends setup.UnitGroup {
    /**
     * @param {setup.Unit} unit
     */
    addUnit(unit) {
        // sold slaves are special in that it segreates the slaves into different group
        // depending on the training
        if (unit.isMindbroken() || unit.isDefiant()) {
            // don't add special slaves to the group below
            super.addUnit(unit);
            return;
        }
        if (unit.isObedient()) {
            setup.unitgroup.soldslavesobedient.addUnit(unit);
        }
        else if (unit.isCompliant()) {
            setup.unitgroup.soldslavesbasicobedience.addUnit(unit);
        }
        else {
            setup.unitgroup.soldslavesuntrained.addUnit(unit);
        }
    }
};
export {};
