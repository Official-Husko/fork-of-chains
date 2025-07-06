// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_START
*/
import { PhallusHoleStart } from "../../phallus/hole/PhallusHoleStart";
export class TailHoleStart extends PhallusHoleStart {
    getPenetratorBodypart() {
        return setup.sexbodypart.tail;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_tail'),
        ]);
    }
}
