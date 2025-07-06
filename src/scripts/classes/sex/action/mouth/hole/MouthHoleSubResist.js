// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_SUB_RESIST
*/
import { MouthHoleSubBase } from "./MouthHoleBase";
export class MouthHoleSubResist extends MouthHoleSubBase {
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: -setup.Sex.AROUSAL_SMALLMEDIUM,
                discomfort: setup.Sex.DISCOMFORT_TINY,
                paces: [setup.sexpace.resist],
                restrictions: [
                    setup.qres.SexPaceIn([setup.sexpace.resist])
                ],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_TINY,
                discomfort: setup.Sex.DISCOMFORT_TINY,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
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
        const hole = this.getPenetrationTarget().rep(me, sex);
        const labia = this.getPenetrationTarget().repLabia(me, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(me, sex);
        const cunn = this.getPenetrationTarget().repCunnilingus(me, sex);
        let t;
        if (theirpace == setup.sexpace.sub) {
            t = [
                `a|Rep desperately a|try to pull a|their ${labia} away from b|reps b|face, letting out a|a_sob as b|rep greedily b|slide b|their tongue deep into a|their ${hole}.`,
                `Letting out a|a_sob, a|rep desperately a|try to pull a|their ${hole} away from b|reps lips. Ignoring a|their protests, b|rep b|hold a|rep in place as b|they b|plant a passionate kiss on a|their ${labia}, before greedily sliding b|their tongue deep into a|their ${hole}.`,
                `With a|a_sob, a|rep frantically a|try to pull a|their ${labia} away from b|reps lips, but b|they holds a|them in place, ignoring a|their protests as b|they b|continue eagerly thrusting b|their tongue into a|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.normal) {
            t = [
                `a|Rep desperately a|try to pull a|their ${labia} away from b|reps b|face, letting out a|a_sob as b|rep gently b|slide b|their tongue deep into a|their ${hole}.`,
                `Letting out a|a_sob, a|rep desperately a|try to pull a|their ${hole} away from b|reps lips. Ignoring a|their protests, b|rep b|hold a|rep in place as b|they b|plant a soft kiss on a|their ${labia}, before gently sliding b|their tongue deep into a|their ${hole}.`,
                `With a|a_sob, a|rep frantically a|try to pull a|their ${labia} away from b|reps lips, but b|they holds a|them in place, ignoring a|their protests as b|they b|continue gently thrusting b|their tongue into a|their ${hole}.`
            ];
        }
        else {
            t = [
                `a|Rep desperately a|try to pull a|their ${labia} away from b|reps b|face, letting out a|a_sob as b|rep roughly b|slide b|their tongue deep into a|their ${hole}.`,
                `Letting out a|a_sob, a|rep desperately a|try to pull a|their ${hole} away from b|reps lips. Ignoring a|their protests, b|rep b|hold a|rep in place as b|they b|plant a wet kiss on a|their ${labia}, before roughly thrusting b|their tongue deep into a|their ${hole}.`,
                `With a|a_sob, a|rep frantically a|try to pull a|their ${labia} away from b|reps lips, but b|they firmly holds a|them in place, ignoring a|their protests as b|they b|continue roughly thrusting b|their tongue into a|their ${hole}.`
            ];
        }
        story += setup.rng.choice(t);
        return story;
    }
}
