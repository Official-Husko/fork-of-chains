// @ts-nocheck
/* ORIGINAL TEXT FROM darko */
import { PenisHoleDomSpitroastTentacle } from "./../hole/PenisHoleDomSpitroastTentacle";
setup.SexActionClass.PenisAnusDomSpitroastTentacle = class PenisAnusDomSpitroastTentacle extends PenisHoleDomSpitroastTentacle {
    getTags() { return super.getTags().concat(['dom', 'discomfort',]); }
    desc() { return 'Anal spitroast with a tentacle'; }
    getPenetrationTarget() { return setup.sexbodypart.anus; }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
};
