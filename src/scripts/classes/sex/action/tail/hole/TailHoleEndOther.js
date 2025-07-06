// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.FUCKED_STOP
*/
import { PhallusHoleEndOther } from "../../phallus/hole/PhallusHoleEndOther";
export class TailHoleEndOther extends PhallusHoleEndOther {
    getPenetratorBodypart() {
        return setup.sexbodypart.tail;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_tail'),
        ]);
    }
}
