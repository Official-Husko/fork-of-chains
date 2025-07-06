// @ts-nocheck
/**
 * Score for how much a dick pokes out of the breasts.
 * -2 : not even close
 * -1 : no
 * 0: barely
 * 1: yes
 * 2: much more than normal
 *
 * @param {setup.Unit} me
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @returns {number}
 */
export function getDickPokeOutScore(me, them, sex) {
    const penis_size = setup.sexbodypart.penis.getSize(me, sex);
    // breast score is a bit special, because only super large ones increase the "size"
    let breast_size;
    if (them.isHasTrait('breast_titanic')) {
        breast_size = 5;
    }
    else if (them.isHasTrait('breast_huge')) {
        breast_size = 4;
    }
    else if (!them.isHasBreasts() && them.isHasTrait('muscle_extremelystrong')) {
        breast_size = 4;
    }
    else {
        // cover large breast and pecjob
        breast_size = 3;
    }
    return Math.min(2, Math.max(-2, penis_size - breast_size));
}
/**
 * Describes whether a dick is long enough to poke out of breasts.
 * E.g., The dick is very long, and its tip poke out of the other end of the cleavage.
 *
 * @param {setup.Unit} me
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @returns {string}
 */
export function getDickPokeOutSentence(me, them, sex) {
    let t;
    // special case
    if (me.isHasTrait('dick_titanic') && them.isHasTrait('breast_gigantic')) {
        t = [
            `The gigantic dick is evenly matched with the equally gigantic breasts, and it barely pokes out of the huge piece of flesh.`,
            `The breasts are a gigantic mound of flesh, but the dick is even more so and it manages to poke out of the massive mound of flesh.`,
            `Despite the huge voluptuous mountain that is b|reps breasts, a|reps equally titanic dick still manage to pop out.`,
        ];
    }
    else {
        const score = getDickPokeOutScore(me, them, sex);
        if (score == 2) {
            t = [
                `a|Reps a|dick proves too intimidatingly long for b|reps b|breasts,
        and almost half of it pokes out of the other end of the b|cleavage.`,
                `a|Reps a|dick is way too long for b|reps b|cleavage,
        and more than half of the shaft pokes out of the other end of the b|cleavage.`,
                `a|Reps a|dick is very lengthy, and it pokes out substantially from the other end of the b|cleavage.`,
            ];
        }
        else if (score == 1) {
            t = [
                `a|Reps dickhead pops out of the other end of b|reps b|cleavage.`,
                `a|Reps a|dick is long enough to poke its head on the end of the b|cleavage.`,
                `a|Reps a|dick pokes out a little from the other end of the b|cleavage.`,
            ];
        }
        else if (score == 0) {
            t = [
                `a|Reps a|dick spans the entire length of the b|cleavage, but it does not poke out.`,
                `a|Reps dickhead is just at the top of the b|cleavage, barely poking out of it.`,
                `The length of a|reps dick is evenly matched with the length of b|reps b|cleavage.`,
            ];
        }
        else if (score == -1) {
            t = [
                `a|Reps a|dick is not long enough to poke out of b|reps b|cleavage.`,
                `The dickhead remains buried somewhere within b|reps b|breasts.`,
                `a|Reps a|dick is too small to breach the other end of the b|cleavage.`,
            ];
        }
        else if (score == -2) {
            t = [
                `a|Reps a|dick is completely buried within b|reps b|breasts.`,
                `a|Reps a|dick barely penetrates a third of b|reps vast b|cleavage.`,
                `a|Reps a|dick could not even make it halfway of b|reps b|cleavage.`,
            ];
        }
    }
    return setup.SexUtil.convert(t, { a: me, b: them }, sex);
}
