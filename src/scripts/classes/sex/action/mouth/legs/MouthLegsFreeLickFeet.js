// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
The entirety of FootMouth.java
*/
import { MouthLegsFreeBaseDom } from "./MouthLegsFreeBase";
setup.SexActionClass.MouthLegsFreeLickFeet = class MouthLegsFreeLickFeet extends MouthLegsFreeBaseDom {
    getTags() { return super.getTags().concat(['sub']); }
    desc() { return 'Lick feet'; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_lick_feet'),
        ]);
    }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALLMEDIUM,
                arousal: setup.Sex.AROUSAL_TINY,
                paces: [setup.sexpace.sub],
            },
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    rawTitle(sex) {
        return `Lick feet`;
    }
    rawDescription(sex) {
        return `Guide your a|mouth onto b|reps b|cfeet and use your tongue to lavish attention to it.`;
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
        let story = '';
        let t;
        t = [
            `Eagerly bringing a|their head down to b|reps b|cfeet, a|rep a|press a|their lips
       against them and obediently a|kiss and a|lick them.`,
            `a|Rep a|drop a|their head down to b|reps b|cfeet, before eagerly pressing a|their lips against them and  obediently a|kiss and a|lick them.`,
            `Like a good little slut, a|rep a|position a|their a|mouth right in front of b|reps b|cfeet before lavishing attention on it with a|their tongue.`,
            `After planting a series of submissive kisses on b|reps b|cfeet,
       a|rep a|proceed to enthusiastically lick them clean,
       letting out a series of submissive moans in the process.`,
            `Eagerly kissing and licking b|reps toes like a good dog, a|rep a|let out a|a_moan as a|they happily a|worship b|reps b|cfeet.`,
        ];
        const rearwag = setup.Text.Pet.rearwag(me);
        if (them.isHasTrait('training_pet_advanced')) {
            t = t.concat([
                `As a properly trained pet slave, a|rep a|spare no hesitation as a|they eagerly a|lap up all the grime from b|reps dirty b|cfeet, all while ${rearwag}.`,
                `${setup.capitalize(rearwag)}, a|reps pet training kicks in as the slave eagerly a|lavish attention to b|reps dirty b|cfeet.`,
            ]);
        }
        story += setup.rng.choice(t) + ' ';
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|let out b|a_moan as a|rep a|worship b|their b|cfeet, before b|eagerly pushing them into a|their a|face in order to encourage a|them to keep on going.`,
                ` In response to this, b|rep b|eagerly b|push b|their b|cfeet into a|reps a|face, letting out b|a_moan as b|they b|focus on the delightful feeling of having b|their b|cfeet worshipped.`,
                ` b|Rep b|shut b|their b|eyes as b|they b|continue to enjoy the feeling of b|their b|cfeet being worshipped by a submissive slut.`,
                ` Moaning in delight, b|rep b|eagerly b|push b|their b|cfeet against a|reps mouth as b|they b|have them worshipped.`,
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` Having a submissive worship b|their b|cfeet greatly arouses b|rep and b|their need for dominance.`,
                ` b|Rep b|let out a dominant smile seeing a slut worshipping b|their b|cfeet, enjoying the feeling of putting ${me.isYou() ? 'you' : 'the a|race'} in a|their place.`,
                ` b|Rep b|make sure a|they a|continue worshipping b|their b|cfeet by talking dirtily to the submissive, making sure b|they always remember b|their rightful place.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep b|let out b|a_sob as a|rep a|do this, and with tears running down b|their b|face, b|they desperately b|beg for a|them to stop.`,
                ` With b|a_sob, b|rep b|try to pull away from a|rep, but, being unable to do so, all b|they can do is sob as a|rep a|continue worshipping b|their b|cfeet.`,
            ];
            // combine t2 with a random t3 to form a sentence for t
            let t2 = [
                `b|Rep desperately b|try, and b|fail, to pull b|their b|cfeet away from a|reps a|face, letting out b|a_sob in the process.`,
                `b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|reps a|face away from b|their b|cfeet.`,
                `Sobbing in distress, b|rep weakly b|struggle against a|rep as b|they b|plead for a|them to take a|their a|mouth away from b|their b|cfeet.`,
            ];
            let t3 = [
                ` Totally ignoring b|reps protests, a|rep a|eagerly a|continue to worship b|their b|cfeet by planting a series of licks and kisses on them.`,
                ` Moaning in delight, a|rep completely a|ignore b|reps protests and a|continue to orally worship b|their b|cfeet.`,
                ` Not paying any attention to b|reps struggles, a|rep a|let out a|a_moan as a|they a|press a|their lips against b|reps b|cfeet.`,
            ];
            for (const s of t2) {
                t.push(`${s} ${setup.rng.choice(t3)}`);
            }
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep b|force b|themself to remain eerily still, not sure why b|their b|master is worshipping b|their b|cfeet`,
                ` b|Rep ${h} start pushing b|their b|cfeet into a|reps a|face, hoping b|their submissive owner is delighted at b|them.`,
            ];
        }
        else {
            t = [
                setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `Despite the eager slut at b|their b|cfeet`,
                    `Even with an eager slut busily worshipping b|their b|cfeet`,
                    `Despite having the pleasurable sensation of an eager slut worshipping b|their b|cfeet`
                ])
            ];
        }
        story += setup.rng.choice(t) + ' ';
        return story;
    }
};
