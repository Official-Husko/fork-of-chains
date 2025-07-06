// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
FingerBreasts.FEEL_BREASTS

and also from fBreasts from FCdev
*/
import { ArmsBreastsFreeBaseDom } from "./ArmsBreastsFreeBase";
setup.SexActionClass.ArmsBreastsFreeDomGrope = class ArmsBreastsFreeDomGrope extends ArmsBreastsFreeBaseDom {
    getTags() { return super.getTags().concat(['normal']); }
    desc() { return 'Grope breasts'; }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_SMALL,
                discomfort: setup.Sex.DISCOMFORT_SMALL,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_grope'),
        ]);
    }
    rawTitle(sex) {
        return `Grope b|reps b|breasts`;
    }
    rawDescription(sex) {
        return `Give b|reps b|breasts a squeeze.`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const hasbreasts = them.isHasBreasts();
        const hasclothes = sex.getCoveringEquipment(them, this.getPenetrationTarget());
        const simple = this.getPenetrationTarget().repSimple(them);
        let clothesrep;
        if (hasclothes) {
            clothesrep = sex.getCoveringEquipment(them, this.getPenetrationTarget()).rep();
        }
        else {
            clothesrep = setup.rng.choice([
                `exposed ${simple}`,
                `bare ${simple}`,
                `naked ${simple}`,
            ]);
        }
        let nipplerep;
        const nippleclothes = them.getEquipmentAt(setup.equipmentslot.nipple);
        if (nippleclothes) {
            nipplerep = nippleclothes.rep();
        }
        else {
            nipplerep = 'b|nipples';
        }
        let stimulation;
        if (mypace == setup.sexpace.dom) {
            stimulation = 'punishment';
        }
        else {
            stimulation = 'stimulation';
        }
        let story = '';
        let t;
        if (mypace == setup.sexpace.dom) {
            t = [
                `Reaching up to b|reps chest, a|rep a|let out a soft moan as a|they a|start roughly fondling
        and groping b|reps
        b|breasts${!hasclothes ?
                    `.` :
                    `, forcefully grinding b|their ${clothesrep} down against b|their ${nipplerep} in the process.`}`,
                `a|Rep a|find a|themself unable to resist the temptation of b|reps b|breasts, and a|they
         a|reach up to forcefully grind a|their a|hands against b|their
         ${hasclothes ? clothesrep : nipplerep}
         before starting to roughly grope and squeeze b|their ${simple}.`,
                `Sinking a|their fingers into b|reps ${clothesrep},
         a|rep a|start to roughly fondle and grope b|their b|breasts${hasclothes ? ` through it` : ``}.`,
                `After positioning a|their a|hands into b|reps ${clothesrep},
         without any warning a|rep suddenly a|press and a|squeeze, feeling the
         ${them.isHasBreasts() ? 'softness' : 'hardness'} of b|their b|breasts.`,
                `Placing a|their a|hands atop b|reps b|breasts, a|rep a|trace the shape of b|their
         ${them.isHasBreasts() ? 'mammaries' : 'pecs'} before roughly manhandling them.`,
            ];
        }
        else {
            t = [
                `Reaching up to b|reps chest, a|rep a|let out a soft moan as a|they a|start a|eagerly fondling
        and groping b|reps
        b|breasts${!hasclothes ?
                    `.` :
                    `, pressing b|their ${clothesrep} down against b|their ${nipplerep} in the process.`}`,
                `a|Rep a|find a|themself unable to resist the temptation of b|reps b|breasts, and a|they
         a|reach up to a|eagerly press a|their a|hands against b|their
         ${hasclothes ? clothesrep : nipplerep}
         before starting to grope and squeeze b|their ${simple}.`,
                `Teasing a|their fingers over b|reps ${clothesrep},
         a|rep a|start to a|eagerly fondle and grope b|their b|breasts${hasclothes ? ` through it` : ``}.`,
                `After a|eagerly guiding a|their a|hands right in front of b|reps ${clothesrep},
         a|rep a|eagerly press a|their a|hands down, manhandling the
         ${them.isHasBreasts() ? 'soft' : 'hard'} flesh of b|their b|breasts.`,
                `Placing a|their a|hands atop b|reps b|breasts, a|rep a|eagerly a|trace the shape of b|their
         ${them.isHasBreasts() ? 'mammaries' : 'pecs'} before a|eagerly manhandling them.`,
            ];
        }
        { /* from FCdev */
            let base;
            if (mypace == setup.sexpace.dom) {
                base = `b|Rep b|gasp as a|rep slap a|their a|hands on b|their `;
            }
            else {
                base = `a|Rep a|eagerly a|place a|their a|hands on b|their `;
            }
            if (them.isHasTrait('breast_titanic')) {
                base += `
          monster tits, a|eagerly bouncing their weighty mass
          roughly with all a|their might before sliding a|their a|hands to b|their b|nipples,
        `;
            }
            else if (them.isHasTrait('breast_huge')) {
                base += `
          huge tits, a|eagerly bouncing them roughly up and down in a|their a|hands,
          while simultaneously flicking b|their b|nipples hard
          with a|their fingers and thumbs,
        `;
            }
            else if (them.isHasTrait('breast_large')) {
                base += `
          large tits, jiggling them enticingly with your <<uhands $unit.player>>
        `;
            }
            else if (them.isHasTrait('breast_medium')) {
                base += `
          cute breasts, cupping them and roughly playing with b|their
          b|nipples between a|their fingers and thumbs,
        `;
            }
            else if (them.isHasTrait('breast_tiny')) {
                base += `
          flat breasts, roughly playing with b|their hard, erect nipples between a|their fingers and thumbs,
        `;
            }
            else if (them.isHasTrait('muscle_extremelystrong')) {
                base += `
          monster pecs, feeling its shape and hardness and roughly playing with them before
          sliding a|their a|hands to play with b|their b|nipples,
        `;
            }
            else if (them.isHasTrait('muscle_verystrong')) {
                base += `
          extremely muscular pecs, feeling its shape and hardness and roughly playing with them
          before sliding a|their a|hands to b|their b|nipples,
        `;
            }
            else if (them.isHasTrait('muscle_strong')) {
                base += `
          muscular pecs, feeling and tracing its contour and roughly playing with them before sliding a|their
          a|hands to b|their b|nipples,
        `;
            }
            else {
                base += `
          flat chest, roughly playing with b|their hard b|nipples between a|their fingers and thumbs,
        `;
            }
            if (mypace == setup.sexpace.dom) {
                base += `teasing them and firmly pulling them in all directions.`;
            }
            else {
                base += `teasing them and pulling them a|eagerly towards a|them.`;
            }
            t.push(base);
        }
        story += setup.rng.choice(t) + ' ';
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|let out a soft moan at a|reps touch, before b|eagerly encouraging a|them to continue giving b|their b|breasts a|their full attention.`,
                ` With a soft moan, b|rep b|eagerly b|push b|their chest out, imploring a|rep to continue.`,
                ` Softly moaning at a|reps touch, b|rep b|eagerly b|encourage a|them to carry on playing with b|their b|breasts.`,
                ` b|They b|moan passionately at the continued ${stimulation} of b|their b|breasts.`,
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|let out b|a_moan at a|reps touch, before roughly growling for a|them to continue giving b|their b|breasts a|their full attention.`,
                ` With b|a_moan, b|rep b|push b|their chest out, and in a firm tone, b|they b|order a|rep to continue giving b|their b|breasts a|their full attention.`,
                ` With b|a_moan, b|rep b|push b|their b|breasts out, and using a commanding tone, b|rep order a|them to continue before carrying on making lewd noises.`,
                ` Letting out b|a_moan at a|reps touch, b|rep b|demand that a|they a|carry on playing with b|their b|breasts.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                setup.SexUtil.repResist(them, me, sex, [
                    `knock a|their fingers away from b|their b|breasts`,
                    `struggle against a|them`,
                    `hide b|their b|breasts from a|reps touch`,
                    `push a|them off b|their b|breasts`,
                ], [
                    `a|they a|continue playing with b|their b|breasts`,
                    `a|they a|carry on playing with b|their b|breasts`,
                    `a|they a|continue fondling with b|their b|breasts`,
                    `a|they a|continue with the ${stimulation} of b|their b|breasts`,
                ])
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep b|let out b|a_moan at a|reps unwanted touch,
          having no choice but to watch a|them continue giving b|their b|breasts a|their full attention.`,
                ` With b|a_moan, b|rep ${h} push b|their chest out, giving a|rep full access.`,
                ` Moaning at a|reps touch, b|rep ${h} watch a|them carry on playing with b|their b|breasts.`,
                ` b|They b|shake at a|their touch fearfully -- b|their eagerness to avoid punishment b|lead b|them
          to stiffen as a|rep continue the ${stimulation} on b|their b|breasts.
          When a|rep finally stop, b|they b|shiver but b|say nothing, uneasy at what a|they a|is going to do next.`,
            ];
        }
        else {
            t = [
                setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                    `the molesting a|hands`,
                    `the molestation upon b|their b|breasts`,
                    `a|reps invading a|hands`,
                    `the continued stimulation of b|their b|breasts`,
                ])
            ];
        }
        story += setup.rng.choice(t) + ' ';
        return story;
    }
};
