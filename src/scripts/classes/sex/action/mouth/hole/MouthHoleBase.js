// @ts-nocheck
import { PhallusHoleDomBase } from "../../phallus/hole/PhallusHoleDomBase";
import { PhallusHoleSubBase } from "../../phallus/hole/PhallusHoleSubBase";
export class MouthHoleDomBase extends PhallusHoleDomBase {
    getPenetratorBodypart() { return setup.sexbodypart.mouth; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_penetration_mouthhole'),
        ]);
    }
    // size does not matter for tongue penetration
    getDiscomfortMultiplier(actor_name, unit, sex) { return 1.0; }
    getArousalMultiplier(actor_name, unit, sex) { return 1.0; }
}
export class MouthHoleSubBase extends PhallusHoleSubBase {
    getPenetratorBodypart() { return setup.sexbodypart.mouth; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_penetration_mouthhole'),
        ]);
    }
    // size does not matter for tongue penetration
    getDiscomfortMultiplier(actor_name, unit, sex) { return 1.0; }
    getArousalMultiplier(actor_name, unit, sex) { return 1.0; }
}
