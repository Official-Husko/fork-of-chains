// @ts-nocheck

import { PhallusHoleDomBase } from "../../phallus/hole/PhallusHoleDomBase"
import { PhallusHoleDomBaseResist } from "../../phallus/hole/PhallusHoleDomBaseResist"
import { PhallusHoleSubBase } from "../../phallus/hole/PhallusHoleSubBase"
import { PhallusHoleSubBaseResist } from "../../phallus/hole/PhallusHoleSubBaseResist"

export class PenisHoleDomBase extends PhallusHoleDomBase {
  getPenetratorBodypart() { return setup.sexbodypart.penis }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }
}

export class PenisHoleDomBaseResist extends PhallusHoleDomBaseResist {
  getPenetratorBodypart() { return setup.sexbodypart.penis }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
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
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }
}

export class PenisHoleSubBase extends PhallusHoleSubBase {
  getPenetratorBodypart() { return setup.sexbodypart.penis }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }
}

export class PenisHoleSubBaseResist extends PhallusHoleSubBaseResist {
  getPenetratorBodypart() { return setup.sexbodypart.penis }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_LARGE,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist])
        ],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }
}

