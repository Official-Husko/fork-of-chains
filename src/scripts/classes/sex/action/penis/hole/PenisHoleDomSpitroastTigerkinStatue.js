// @ts-nocheck
/* ORIGINAL TEXT FROM darko */
import { eatCum } from "./cum";
import { PenisHoleDomBase } from "./PenisHoleBase";
import { spitroastReaction } from "./spitroast";
export class PenisHoleDomSpitroastTigerkinStatue extends PenisHoleDomBase {
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasAnyItemAnywhere([
                'f_object_master_tigerkinstatuemale',
                'f_object_master_tigerkinstatuefemale',
            ]),
            setup.qres.Or(this.getStatues().map(statue => setup.qres.SexIsInLocationWithFurniture(statue))),
        ]);
    }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
                paces: [setup.sexpace.dom, setup.sexpace.normal],
                restrictions: [
                    setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
                    setup.qres.SexCanUseBodypart(setup.sexbodypart.legs),
                ],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUMLARGE,
                arousal: setup.Sex.AROUSAL_MEDIUM,
                discomfort: setup.Sex.DISCOMFORT_LARGE,
                paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.resist, setup.sexpace.mindbroken, setup.sexpace.forced],
                restrictions: [
                    setup.qres.SexCanUseBodypart(setup.sexbodypart.mouth),
                ],
            },
        ];
    }
    /**
     * @returns {setup.Furniture[]}
     */
    getStatues() {
        return [
            // @ts-ignore
            setup.item.f_object_master_tigerkinstatuemale,
            // @ts-ignore
            setup.item.f_object_master_tigerkinstatuefemale,
        ];
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {setup.Furniture}
     */
    getStatue(sex) {
        const location = sex.getLocation();
        for (const statue of this.getStatues()) {
            if (location.getFurnitureAt(statue.getSlot()) == statue) {
                return statue;
            }
        }
        throw new Error(`Missing statue in PenisHoleDomSpitroast!`);
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {boolean}
     */
    isStatueMale(sex) {
        return this.getStatue(sex) == setup.item.f_object_master_tigerkinstatuemale;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    repStatueDick(sex) {
        if (this.isStatueMale(sex)) {
            return 'dick';
        }
        else {
            return 'pussy';
        }
    }
    rawTitle(sex) {
        const statue = this.getStatue(sex).rep();
        return `Spitroast with the ${statue}`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const dick = this.getPenetratorBodypart().rep(me, sex);
        const hole = this.getPenetrationTarget().rep(them, sex);
        const statue = this.getStatue(sex).rep();
        const statuedick = this.repStatueDick(sex);
        return `With your ${dick} still in b|reps ${hole}, position b|their mouth in front of the ${statue} and 
    shove it into the statue's ${statuedick}.`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const theirpose = sex.getPose(them);
        const theirposition = sex.getPosition(them);
        let story = '';
        const dick = this.getPenetratorBodypart().rep(me, sex);
        const tip = this.getPenetratorBodypart().repTip(me, sex);
        const fuck = this.getPenetratorBodypart().repFuck(me, sex);
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
        const myfacingheight = mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex);
        const theirfacingheight = theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex);
        let dir = 'for';
        let odir = 'back';
        if (myfacingheight.facing.isDown()) {
            dir = 'down';
            odir = 'up';
        }
        else if (myfacingheight.facing.isUp()) {
            dir = 'up';
            odir = 'down';
        }
        const statue = this.getStatue(sex).rep();
        const statuedick = this.repStatueDick(sex);
        const statuemale = this.isStatueMale(sex);
        let precum;
        if (this.isStatueMale(sex)) {
            precum = `precum`;
        }
        else {
            precum = `pussyjuice`;
        }
        let t = [
            `Seeing the ${statue} in the room, a|rep a|come up with a devilish idea.`,
            `Seeing the ${statue} in the room leaking ${precum} from its ${statuedick}, a|rep a|think of an evil idea to do to b|rep.`,
        ];
        story += setup.rng.choice(t) + ' ';
        t = [
            `With a|their ${dick} still deep inside b|reps ${hole}, a|rep a|eagerly a|reposition b|rep so that
      b|their b|mouth is lined up nicely in front of the statue's ${statuedick}.`,
            `Temporarily sliding a|their ${dick} out from b|reps ${hole}, a|rep a|eagerly a|move to reposition b|rep
      so that now b|their b|mouth is just in front of the statue's ${statuedick}. Once there, a|rep a|eagerly shove
      a|their ${dick} back inside b|reps ${hole}, earning a moan from b|them.`,
        ];
        story += setup.rng.choice(t) + ' ';
        if (mypace == setup.sexpace.dom) {
            t = [
                `With an evil grin, a|rep forcefully a|shove a|their ${dick} even deeper inside of b|rep, forcing
        b|them to b|move b|their b|body forwards and `,
                `Without the slightest warning, a|rep a|laugh as |they a|smite a|their ${dick} forward inside of
        b|rep, which in turn moves b|reps b|body forwards and `,
            ];
        }
        else {
            t = [
                `Gently but surely, a|rep a|press a|their ${dick} forwards inside of b|rep, forcing
        b|them to b|move b|their b|body forwards and `,
                `While caressing b|reps head, a|rep slowly push forwards and forwards, pushing a|their ${dick}
        further inside of b|rep. In turn, b|reps b|body forwards and `,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        if (statuemale) {
            t = [
                `impaling the tigerkin statue's permanently erect feline dick into b|their b|mouth.`,
                `effectively choking b|reps b|mouth full with the tigerkin statue's permanently erect feline dick.`,
            ];
        }
        else {
            t = [
                `forcing b|their b|mouth to get stuck in front of the tigerkin statue's permanently wet feline pussy.`,
                `wetting b|reps b|face with the pussyjuice dripping from the tigerkin statue's permanently wet feline pussy, which is now pressed against b|their face.`
            ];
        }
        story += setup.rng.choice(t) + ' ';
        let action;
        if (statuemale) {
            action = [
                `swallow the tigerkin dick`,
                `choke on the tigerkin dick`,
                `suck the tigerkin dick`,
            ];
        }
        else {
            action = [
                `eat the tigerkin pussy`,
                `slather the tigerkin pussy`,
            ];
        }
        story += spitroastReaction(me, dick, them, hole, action, sex) + ' ';
        if (statuemale) {
            t = [
                `The muscular ${statue} eventually ejaculated, gushing down salty ancient cum down b|reps throat,`,
                `After a long moment, the muscular ${statue}'s dick twitches before squirting a large amount of salty ejaculate down b|reps tongue and into b|their stomach,`,
            ];
        }
        else {
            t = [
                `The bountifully endowed ${statue} eventually climaxed, splattering girl cum all over b|reps b|face,`,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        story += eatCum(me, them, sex) + ' ';
        story += setup.rng.choice([
            ` Sensing the fun to be over, a|rep a|return b|rep to b|their original position, before resuming putting a|their ${dick} in b|reps ${hole}.`,
            ` With the ${precum} all licked up, a|rep a|return b|rep to b|their original positions and resume the fucking.`,
        ]);
        return story;
    }
}
