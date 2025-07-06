// @ts-nocheck
/**
 * @param {setup.Unit} me
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @return {string}
 */
export function cumFaceReaction(me, them, sex) {
    // if gagged: describe it a bit
    const cover = sex.getBlockingEquipment(them, setup.sexbodypart.mouth);
    let t;
    if (cover) {
        t = [
            `Some of the cum splatters on b|reps ${cover.rep()}`,
            `The ${cover.rep()} blocking b|reps b|mouth is also splattered with cum`,
            `Some of the white cum falls onto b|reps ${cover.rep()}`,
        ];
    }
    else {
        t = [
            `Some of the cum lands directly on b|reps b|mouth`,
            `b|Reps face is covered in quite a bit of cum, and some slides down into b|their b|mouth`,
            `Some of the cum hits b|reps b|mouth with its salty taste`,
        ];
    }
    let story = setup.rng.choice(t) + ' ';
    const theirpace = sex.getPace(them);
    if (theirpace == setup.sexpace.resist) {
        t = [
            `, horrifying b|them.`,
            `, to b|reps great disgust.`,
            `, to b|reps horror.`,
        ];
    }
    else if (theirpace == setup.sexpace.forced) {
        t = [
            `, reminding b|them of b|their place.`,
            `, making clear a|their ownership over b|rep.`,
            `, marking b|rep as a|their plaything for the night.`,
        ];
    }
    else if (theirpace == setup.sexpace.sub || theirpace == setup.sexpace.normal) {
        if (!cover) {
            if (them.getMainTraining().getTags().includes('troral')) {
                t = [
                    `. As a fixated oral slut, b|rep eagerly lap up as much of the delicious gooey cum splattered across b|their face as possible.`,
                    `. b|Reps oral fixation immediately takes hold, and b|they b|find b|themself lapping the cum splattered across b|their b|face.`,
                ];
            }
            else {
                t = [
                    `. b|Rep b|eagerly b|let out b|their tongue and b|lap the delicious cum around b|their b|mouth.`,
                    `, and those stray splatters are lapped clean b|eagerly by b|rep.`,
                ];
            }
        }
        else {
            t = [
                `. Having b|their face covered in cum draws a moan from b|rep.`,
                `. b|Rep b|feel the warm cum on b|their b|face sliding downwards with gravity.`,
            ];
        }
    }
    else {
        t = [
            `. b|Rep quickly wipe out the cum from b|their b|face.`,
            `, which are wiped clean by b|rep immediately.`,
        ];
    }
    story += setup.rng.choice(t) + ' ';
    return setup.SexUtil.convert(story, { a: me, b: them }, sex);
}
/**
 * @param {setup.Unit} me
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @returns {string}
 */
export function titanicBallsCumNotStoppingSentence(me, them, sex) {
    let t = [
        `After a few seconds, b|rep b|realize that a|rep a|is not even close to stopping`,
        `But after a few seconds locked in position, b|rep b|start to realize that a|reps a|balls is not even close to empty`,
        `However, the stream of cum does not stop after several seconds, making b|rep b|realize that a|rep a|is not stopping anytime soon`,
    ];
    return setup.SexUtil.convert(t, { a: me, b: them }, sex);
}
