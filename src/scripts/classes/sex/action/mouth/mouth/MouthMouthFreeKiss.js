// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
TongueMouth

and also from FCdev's "Kiss" interaction
*/
import { MouthMouthFreeBaseDom } from "./MouthMouthFreeBase";
setup.SexActionClass.MouthMouthFreeKiss = class MouthMouthFreeKiss extends MouthMouthFreeBaseDom {
    getTags() { return super.getTags().concat(['normal']); }
    desc() { return 'Kiss'; }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
            },
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    rawTitle(sex) {
        return `Kiss`;
    }
    rawDescription(sex) {
        return `Press your lips against b|reps mouth and let the magic guide you.`;
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
        let is_begin_penetrated = (setup.qres.SexIsOngoing('b', setup.sexbodypart.penis, 'a', setup.sexbodypart.vagina).isOk(this) ||
            setup.qres.SexIsOngoing('b', setup.sexbodypart.penis, 'a', setup.sexbodypart.anus).isOk(this));
        let t;
        if (is_begin_penetrated) {
            const hole = sex.getBodypartPenetrationTarget(them, setup.sexbodypart.penis).bodypart.rep(me, sex);
            t = [
                `a|Rep a|sink down onto b|reps b|dick, letting out a|a_moan as a|their ${hole} grips down around
        b|their b|dick.
        As a|their moan trails off, a|rep a|eagerly a|grab b|reps head in both a|hands,
        before pressing a|their lips against b|theirs and a|eagerly delivering a passionate kiss.`,
                `With a|a_moan, a|rep a|slide down onto b|reps b|dick, before pressing a|themself against
        b|their b|body.
        Breathing in b|reps b|scent, a|rep a|press a|their lips against b|theirs and a|start to
        a|eagerly kiss b|them.`,
                `a|Rep a|let b|reps b|dick slide even deeper into a|their ${hole} as a|they a|eagerly a|pull b|them into a
        kiss.`,
                `Dropping down, a|rep a|let out a|a_moan as a|they a|bury b|reps b|dick in a|their ${hole},
        before a|eagerly pressing a|their lips against a|theirs.`,
            ];
        }
        else if (mypace == setup.sexpace.dom) {
            t = [
                `Gazing into b|reps b|eyes, a|rep a|lean forwards, roughly pressing a|their lips against b|theirs as a|they a|pull b|them into a forceful kiss.`,
                `a|Rep a|lean into b|rep, breathing in b|their b|scent as a|they roughly a|grind a|their lips against b|theirs.`,
                `a|Rep a|lean in against b|reps b|breasts, tilting a|their head to one side before violently pulling b|them into a rough kiss.`
            ];
        }
        else {
            t = [
                `Gazing into b|reps b|eyes, a|rep a|lean forwards, a|eagerly pressing a|their lips against b|theirs and delivering a passionate kiss.`,
                `a|Rep a|lean into b|rep, breathing in b|their b|scent as a|they a|eagerly a|press a|their lips against b|theirs.`,
                `a|Rep a|lean in against b|reps b|breasts, tilting a|their head slightly to one side before a|eagerly planting a passionate kiss on b|their lips.`
            ];
            if (sex.isCanUse(me, setup.sexbodypart.arms)) {
                t.push(`a|They a|extend a|their a|arms and a|eagerly a|graze a|their fingertips along the line of
           b|their cheekbone.
           Then, a|they a|raise b|their b|face and a|eagerly a|kiss b|them
           right on b|their lips.`);
            }
        }
        story += setup.rng.choice(t) + ' ';
        if (mypace == setup.sexpace.dom) {
            t = [
                `Forcefully pressing a|their lips against b|theirs, a|rep greedily a|thrust a|their tongue deep down b|their throat.`,
                `a|Rep roughly a|grind against b|rep, breathing in b|their b|scent as a|they greedily tongue-a|fuck b|their mouth.`,
                `a|Rep roughly a|press against b|reps b|breasts, before thrusting a|their tongue deep down b|their throat.`,
            ];
            if (sex.isCanUse(me, setup.sexbodypart.arms)) {
                t.push(`a|They roughly grabbed b|reps head before yanking it close and pressing b|their b|mouth against a|theirs, pushing a|their tongue down b|their throat.`);
            }
        }
        else {
            t = [
                `a|Eagerly pressing a|their lips against b|theirs, a|rep a|plant a series of passionate kisses on b|their mouth.`,
                `a|Rep a|eagerly a|lean in against b|rep, breathing in b|their b|scent as a|they a|plant a series of soft kisses on b|their lips.`,
                `a|Rep a|eagerly a|press against b|reps b|breasts, before tilting a|their head slightly to one side as a|they passionately a|kiss b|their lips.`
            ];
        }
        story += setup.rng.choice(t) + ' ';
        if (me.getLover() == them) {
            t = [
                `b|Rep hurriedly b|return the kisses, happy to be near b|their lover and the object of b|their longing.`,
                `b|Rep b|find the intense look from the person b|he b|love overwhelming, and b|their b|mouth falters for a short moment, before blushing furiously.`,
                `b|Reps b|mouth b|accept a|theirs with love, matching itself perfectly to b|their lover's
         insistent lips and tongue.`,
                `b|Rep b|melt into a|them, sighing ever so gently.`,
            ];
        }
        else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|eagerly b|push b|their tongue into a|reps mouth, reaching up to gently caress a|their a|face as b|they happily b|return a|their display of affection.`,
                ` With an approving hum, b|rep b|lean into a|rep, muffling a|their a|moans with b|their lips as b|they b|eagerly b|push b|their tongue into a|their mouth.`,
                ` Moaning in approval, b|rep b|lean into a|rep, pressing b|their lips gently against a|theirs as b|they b|eagerly b|slide b|their tongue into a|their mouth.`,
                ` b|Rep b|let out a soft moan in response, taking a moment to b|eagerly plant a series of kisses on a|reps lips, before b|eagerly sliding b|their tongue into a|their mouth.`,
                ` With a soft moan, b|rep b|lean into a|rep, b|eagerly pushing b|their tongue past a|their lips as b|they b|return b|their display of affection.`,
                ` Letting out a gentle moan, b|rep b|press b|themself against a|rep, muffling b|their b|moans against a|their lips as b|they b|eagerly b|slide b|their tongue into a|their mouth.`
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|force b|their tongue deep into a|reps mouth, roughly pressing b|their lips against a|theirs as b|they greedily b|return a|their display of affection.`,
                ` With an approving moan, b|rep forcefully b|grind up against a|them, muffling a|their a|moans with b|their lips as b|they roughly b|thrust b|their tongue deep into a|their mouth.`,
                ` Moaning in approval, b|rep b|grind b|themself up against a|rep, forcefully pressing b|their lips against a|theirs as b|they roughly b|push b|their tongue deep into a|their mouth.`,
                ` b|Rep b|let out a growl, roughly grinding b|their lips against a|their mouth as b|they violently b|thrust b|their tongue deep down a|their throat.`,
                ` With a menacing growl, b|rep violently b|grind up against a|rep, concerned solely with b|their own pleasure as b|they greedily b|thrust b|their tongue deep down a|their throat.`,
                ` b|Rep grin in response to a|reps display of affection, and with a violent growl, b|they forcefully b|grind b|their lips against a|theirs, moaning into a|their mouth as b|they greedily tongue-b|fuck a|their throat.`,
                ` b|Rep b|laugh into a|rep and b|kiss a|them back with vigor,
          b|their b|head pressing insistently forward.
          The two of ${me.isYou() || them.isYou() ? `you` : `them`}
          make out rather aggressively.`,
                ` b|Rep b|reply to the intrusion with b|their own tongue, which only retreats when 
          a|reps tongue a|press against it.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep b|try to pull away, sobbing and squirming in discomfort as a|rep a|force a|themself on b|them.`,
                ` b|Reps sob is muffled into a|reps mouth as b|they b|try to pull away, squirming in discomfort as a|rep a|force a|themself on b|them.`,
                ` With b|a_sob, b|them b|try, in vain, to pull away from a|rep, protesting and squirming in discomfort as a|rep a|force a|their tongue past b|their reluctant lips.`,
                ` b|Rep b|let out b|a_sob in response, trying b|their hardest to b|push a|rep away as b|they b|writhe about in discomfort.`,
                ` With b|a_sob, b|rep b|try to b|push a|rep away, struggling in vain as a|they a|continue to plant gentle kisses on b|their unwilling lips.`,
                ` b|Rep desperately b|try to pull away, struggling and pushing back as a|rep a|continue to molest b|them, drawing a muffled sob from between b|their lips at the feel of each of a|their unwanted kisses.`,
                ` b|Rep reflexively b|turn b|their b|head away from a|rep,
          but a|they a|catch b|their jaw and kiss b|them harder.`,
                ` Spluttering at the kiss, b|rep b|try to escape,
          but a|rep a|keep plundering b|their b|mouth without mercy, causing b|rep to wriggle desperately.`,
            ];
            // combine t2 with a random t3 to form a sentence for t
            let t2 = [
                `Feeling tears welling up in b|their eyes, b|rep b|let out b|a_sob, trying to push back against a|rep in response to a|their unwanted kisses.`,
                `With a|reps a|scent overwhelming b|their senses, b|rep b|let out a muffled sob, before desperately trying to push a|them off of b|them in a futile attempt to stop a|their continued assault on b|their mouth.`,
                `b|Rep desperately b|try to push a|rep away, sobbing in distress as a|they a|continue kissing and grinding up against b|them.`,
            ];
            let t3;
            if (theirpace == setup.sexpace.dom) {
                t3 = [
                    ` a|Rep a|let out an threatening growl in response to b|their protests, roughly grinding a|their lips against b|their mouth before violently thrusting a|their tongue deep down b|their throat.`,
                    ` With a furious growl, a|rep violently grinds a|themself up against b|rep, ignoring b|their b|sobs as a|they a|thrust a|their tongue deep down b|their throat.`,
                    ` a|Rep ignores b|their protests, and with a rough growl, a|they a|continue violently tongue-fucking b|their reluctant throat.`,
                ];
            }
            else {
                t3 = [
                    ` a|Rep a|let out a|a_moan in response, ignoring b|reps protests as a|they a|continue to plant passionate kisses on b|their lips.`,
                    ` With a|a_moan, a|rep a|lean into b|rep, ignoring b|their b|sobs as a|they firmly pushes a|their tongue past b|their unwilling lips and into b|their mouth.`,
                    ` Letting out a|a_moan, a|rep a|press a|themself against b|rep, continuing to passionately kiss b|them.`,
                ];
            }
            for (const sentence of t2) {
                t.push(`${sentence} ${setup.rng.choice(t3)}`);
            }
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep ${h} push b|their tongue into a|reps mouth, pressing b|their lips against a|theirs as b|they hesitantly b|return a|their display of affection.`,
                ` With b|a_moan, b|rep tiredly b|lean into a|rep, muffling b|their b|moans into a|their mouth as b|they b|let b|their frustrations out through the tongue past a|their lips.`,
                ` b|rep b|lean into a|rep, not believing b|their luck as b|they b|press b|their lips against a|theirs, b|sliding b|their tongue into a|their mouth.`,
                ` b|Rep reflexively b|let out b|a_moan in response. Seeing no way out, b|they b|press b|themself
        against a|rep hoping that b|their gesture is enough to please a|rep.`,
                ` b|Rep b|accept the kiss fearfully --  b|their eagerness to avoid punishment b|lead
         b|them to kiss a|rep back, though nervousness makes b|theirs mechanical.
         a|Rep a|kiss b|them harder, enjoying b|their fear.`,
                ` b|Rep b|is nearly frozen with fear, and b|do not resist as a|rep kiss b|them.
          In fact, b|they barely b|react at all. b|They b|open b|their b|mouth mechanically in
          response to a|their insistent tongue, but it's like kissing a doll.`,
            ];
        }
        else {
            t = [
                `Being kissed affects b|rep as little as being penetrated,
         being struck, or being loved: not at all.`,
            ];
            const limit = t.length;
            for (let i = 0; i < limit; ++i) {
                t.push(setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `Despite b|their b|mouth opening to accept the kiss`,
                    `Despite b|their compliance with a|reps questing tongue`,
                    `Even with b|their b|mouth kissed and caressed`,
                ]));
            }
        }
        story += setup.rng.choice(t) + ' ';
        if (mypace == setup.sexpace.dom) {
            t = [
                `Finally, a|rep a|pull back and roughly a|push b|rep away from a|them as a|they puts an end to a|their kiss.`,
                `After a while, a|rep suddenly, and roughly, a|push b|rep away from a|them, bringing an end to a|their kiss.`,
                `After some time, a|rep a|pull back from b|rep, before roughly pushing b|them away from a|them and breaking off a|their kiss.`
            ];
        }
        else {
            t = [
                `Gazing into b|reps b|eyes, a|rep a|grin as a|they a|pull back, putting an end to a|their kiss.`,
                `After a while, a|rep suddenly a|pull back, bringing an end to a|their kiss.`,
                `After some time, a|rep a|pull back from b|rep, taking a|their lips away from b|theirs as a|they breaks off a|their kiss.`
            ];
        }
        story += setup.rng.choice(t) + ' ';
        if (me.getLover() == them && Math.random() < 0.5) {
            t = [
                `When the kiss is broken, b|reps b|mouth freezes in the shape it was in when last a|reps lips
        touched, and a momentary look of longing crosses b|their b|face.`,
                `The kiss over, b|reps b|hand reaches dumbly up to b|their b|mouth to trace b|their lips
        where a|rep last touched.`,
                `As the kiss ends, b|rep confesses b|their love to a|rep dreamily.`,
            ];
            story += setup.rng.choice(t) + ' ';
        }
        return story;
    }
};
