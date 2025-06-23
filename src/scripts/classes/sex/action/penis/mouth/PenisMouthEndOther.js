/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : GIVING_BLOWJOB_STOP */

import { PenisHoleEndOther } from "../hole/PenisHoleEndOther"
import { getPenisMouthEndText } from "./PenisMouthEnd"

setup.SexActionClass.PenisMouthEndOther = class PenisMouthEndOther extends PenisHoleEndOther {
  getTags() { return super.getTags().concat(['dom', ]) }

  /**
   * @returns {setup.SexBodypart}
   */
  getPenetrationTarget() {
    return setup.sexbodypart.mouth
  }

  rawTitle(sex) {
    return `Stop blowjob`
  }

  rawDescription(sex) {
    return `Take b|reps b|dick out of your mouth and stop giving b|them a blowjob.`
  }

  rawStory(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    return getPenisMouthEndText(them, me, sex)
  }
}
