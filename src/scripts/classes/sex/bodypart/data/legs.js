"use strict";
// @ts-nocheck
// this is actually feet 
setup.SexBodypartClass.Legs = class Legs extends setup.SexBodypart {
    constructor() {
        super('legs', [ /* tags */], 'Legs', 'Legs');
    }
    repSimple(unit) {
        return setup.rng.choice(['legs',]);
    }
    getEquipmentSlots() {
        return [
            setup.equipmentslot.feet,
        ];
    }
    giveArousalMultiplier(me, sex) {
        return 1.0;
    }
    receiveArousalMultiplier(me, sex) {
        return 1.0;
    }
    isCanUseCovered() { return true; }
};
setup.sexbodypart.legs = new setup.SexBodypartClass.Legs();
