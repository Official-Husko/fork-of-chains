// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : GIVING_BLOWJOB_START */
import { PenisHoleStartOther } from "../hole/PenisHoleStartOther";
setup.SexActionClass.PenisMouthStartOther = class PenisMouthStartOther extends PenisHoleStartOther {
    getTags() { return super.getTags().concat(['sub',]); }
    desc() { return 'Begin performing blowjob'; }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() {
        return setup.sexbodypart.mouth;
    }
    rawTitle(sex) {
        return `Perform blowjob`;
    }
    rawDescription(sex) {
        return `Take b|reps b|dick into your mouth and start giving b|them a blowjob.`;
    }
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        let story = '';
        let t;
        if (mypose.getFacingHeight(setup.sexbodypart.penis, myposition, sex).facing.isUpDown()) {
            // facing up or down
            if (mypace == setup.sexpace.dom) {
                t = [
                    `a|Reps hot breath falls down onto b|reps groin as a|they quickly a|move a|their head between b|their b|legs, roughly kissing the cock head of b|their b|dick before forcefully taking b|them into a|their mouth.`,
                    `Dropping a|their head down between b|reps b|legs, a|rep a|deliver a rough, wet lick up the length of b|their b|dick, before forcefully taking the cock head into a|their mouth.`
                ];
            }
            else {
                t = [
                    `a|Reps hot breath falls down onto b|reps groin as a|they a|eagerly a|move a|their head between b|their b|legs, passionately kissing the cock head of b|their b|dick before taking b|them into a|their mouth.`,
                    `a|Eagerly lowering a|their head down between b|reps b|legs, a|rep a|deliver a long, deliberate lick up the length of b|their b|dick, before taking the cock head into a|their mouth.`
                ];
            }
        }
        else {
            // facing right or left
            if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
                t = [
                    `Bringing a|their lips to the cock head of b|reps b|dick, a|rep a|eagerly a|take b|them into a|their mouth, letting out a muffled moan as a|they a|start giving b|them a blowjob.`,
                    `Wrapping a|their lips around the cock head of b|reps b|dick, a|rep a|let out a muffled moan as a|they a|start giving b|them a blowjob a|eagerly.`
                ];
            }
            else if (mypace == setup.sexpace.dom) {
                t = [
                    `Bringing a|their lips up to the cock head of b|reps b|dick, a|rep forcefully a|take b|them into a|their mouth, letting out a muffled moan as a|they a|start giving b|them a rough blowjob.`,
                    `Forcefully wrapping a|their lips around the cock head of b|reps b|dick, a|rep a|let out a muffled moan as a|they a|start giving b|them a rough blowjob.`
                ];
            }
        }
        story += setup.rng.choice(t);
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|eagerly b|buck b|their hips into a|reps a|face, b|eagerly moaning as a|they a|suck b|their b|dick.`,
                ` With a buck of b|their hips, b|rep b|let out a moan as b|they b|enjoy the feeling of a|reps lips sliding up and down the length of b|their b|dick.`
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep roughly b|slam b|their hips into a|reps a|face, moaning as a|they a|suck b|their b|dick.`,
                ` With an rough a|thrust of b|their hips, b|rep b|let out an approving moan as b|they b|get to taste the feeling of a|reps lips sliding up and down the length of b|their b|dick.`
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            t = [
                ` b|Rep meekly b|buck b|their hips into a|reps a|face, moaning as a|they a|suck b|their b|dick.`,
                ` Bucking b|their hips into a|reps a|face, b|rep b|let out b|a_moan as b|they b|enjoy the rare feeling of having a|reps lips sliding up and down the length of b|their b|dick, instead of giving one.`
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep b|let out b|a_sob, trying, and failing, to pull b|their b|dick out of a|reps mouth as b|they b|struggle against the unwanted oral attention.`,
                ` With tears welling up in b|their b|eyes, b|rep b|struggle against the unwanted oral attention, sobbing and squirming as b|they b|beg for a|them to stop.`
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                    `the stimulation on b|their b|dick`,
                    `the pleasure wave coming hot from b|their b|dick`,
                ])
            ];
        }
        story += ' ';
        story += setup.rng.choice(t);
        return story;
    }
};
