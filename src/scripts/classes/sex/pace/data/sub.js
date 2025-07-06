"use strict";
// @ts-nocheck
setup.SexPaceClass.Sub = class Sub extends setup.SexPace {
    constructor() {
        super('sub', [ /* tags */], 'Submissive', 'Will try to bottom', 1, /* base chance */ {
            per_chaste: -1,
            per_humble: 1,
            per_proud: -1,
            per_kind: 1,
            per_cruel: -1,
            per_masochistic: 5,
            per_aggressive: -2,
            per_subinant: -3,
            per_submissive: 3,
            per_evil: -1,
            per_honorable: -1,
            per_playful: 1,
            per_serious: -1,
            per_stubborn: -1,
            per_curious: 1,
        });
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawRepStart(unit, sex) {
        const location = sex.getLocation().repRoom(sex);
        const hobby = setup.Text.Hobby.verb(unit);
        if (unit.isSlaver()) {
            return [
                `a|Reps a|eyes light up at the prospect of having some harmless submissive sex.`,
                `a|Rep a|try a|their best to hide a|their secret submissive tendencies.`,
                `a|Rep a|find being a submissive a refreshing change from a|their daily job.`,
            ];
        }
        else {
            return [
                `a|Rep eagerly a|anticipate the prospect of being dominated by a|their betters.`,
                `a|Reps training has borne fruit as the a|race a|is now completely happy at the prospect of being used.`,
                `a|Rep submissively a|spread a|their asscheeks in an attempted build-up for the upcoming sex.`,
            ];
        }
    }
    repAdverb(unit, sex) {
        return setup.rng.choice([
            'eagerly',
            'enthusiastically',
            'submissively',
            'energetically',
            'greedily',
            'happily',
            'desperately',
            'happily',
        ]);
    }
};
setup.sexpace.sub = new setup.SexPaceClass.Sub();
