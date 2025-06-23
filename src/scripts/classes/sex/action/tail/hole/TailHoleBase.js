import { PhallusHoleDomBase } from "../../phallus/hole/PhallusHoleDomBase"
import { PhallusHoleDomBaseResist } from "../../phallus/hole/PhallusHoleDomBaseResist"
import { PhallusHoleSubBase } from "../../phallus/hole/PhallusHoleSubBase"
import { PhallusHoleSubBaseResist } from "../../phallus/hole/PhallusHoleSubBaseResist"

export class TailHoleDomBase extends PhallusHoleDomBase {
  getPenetratorBodypart() { return setup.sexbodypart.tail }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        discomfort: setup.Sex.DISCOMFORT_MEDIUM,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }
}

export class TailHoleDomBaseResist extends PhallusHoleDomBaseResist {
  getPenetratorBodypart() { return setup.sexbodypart.tail }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist])
        ],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }
}

export class TailHoleSubBase extends PhallusHoleSubBase {
  getPenetratorBodypart() { return setup.sexbodypart.tail }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }
}


export class TailHoleSubBaseResist extends PhallusHoleSubBaseResist {
  getPenetratorBodypart() { return setup.sexbodypart.tail }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        discomfort: setup.Sex.DISCOMFORT_LARGE,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist])
        ],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }
}


