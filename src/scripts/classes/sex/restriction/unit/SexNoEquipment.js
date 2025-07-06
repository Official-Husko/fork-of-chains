"use strict";
// @ts-nocheck
setup.qresImpl.SexNoEquipment = class SexNoEquipment extends setup.SexRestriction {
    /**
     * @param {setup.EquipmentSlot} equipment_slot
     */
    constructor(equipment_slot) {
        super();
        this.equipment_slot = equipment_slot;
    }
    explain() {
        return `No equipment in ${this.equipment_slot.rep()}`;
    }
    /**
     * @param {setup.Unit} unit
     */
    isOk(unit) {
        return !unit.getEquipmentAt(this.equipment_slot);
    }
};
