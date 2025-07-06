"use strict";
// @ts-nocheck
setup.SexPaceClass.Mindbroken = class Mindbroken extends setup.SexPace {
    constructor() {
        super('mindbroken', [ /* tags */], 'Mindbroken', 'Is unresponsive due to severe trauma', 0, /* base chance */ {});
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawRepStart(unit, sex) {
        const location = sex.getLocation().repRoom(sex);
        return [
            `The mindbroken slave did not respond to the prospect of being used very soon.`,
            `The unresponsive fucktoy a|rep is on today's ${location} menu.`,
            `No signs of intelligence can be seen from a|reps a|eyes, and having sex with a|them sometimes feel unnatural.`,
        ];
    }
    repAdverb(unit, sex) {
        return setup.rng.choice([
            'blankly',
            'dazedly',
        ]);
    }
};
setup.sexpace.mindbroken = new setup.SexPaceClass.Mindbroken();
