// @ts-nocheck
import { PhallusHoleFreeBaseTeaseDom } from "../../phallus/hole/PhallusHoleFreeTeaseDom";
import { PhallusHoleFreeBaseTeaseSub } from "../../phallus/hole/PhallusHoleFreeTeaseSub";
export class TailHoleFreeBaseTeaseDom extends PhallusHoleFreeBaseTeaseDom {
    getPenetratorBodypart() { return setup.sexbodypart.tail; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_tail'),
        ]);
    }
}
export class TailHoleFreeBaseTeaseSub extends PhallusHoleFreeBaseTeaseSub {
    getPenetratorBodypart() { return setup.sexbodypart.tail; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_tail'),
        ]);
    }
}
