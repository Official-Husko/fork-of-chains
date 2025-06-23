/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tongueVagina.RECEIVING_CUNNILINGUS_STOP
*/

import { PhallusHoleEndOther } from "../../phallus/hole/PhallusHoleEndOther"

export class MouthHoleEndOther extends PhallusHoleEndOther {
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_mouthhole'),
    ])
  }

  /**
   * @returns {setup.SexBodypart}
   */
  getPenetratorBodypart() {
    return setup.sexbodypart.mouth
  }

  rawStory(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const mypace = sex.getPace(me)
    const mypose = sex.getPose(me)
    const myposition = sex.getPosition(me)
    const theirpace = sex.getPace(them)

    let story = ''

    let t

    const hole = this.getPenetrationTarget().rep(me, sex)
    const labia = this.getPenetrationTarget().repLabia(me, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(me, sex)
    const cunn = this.getPenetrationTarget().repCunnilingus(me, sex)

    if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly yanking b|reps head away from a|their ${hole}, a|rep a|order b|them to stop performing ${cunn} on a|them.`,

        `Roughly grinding a|their ${hole} into b|reps b|face one last time, a|rep then a|pull a|their hips away, putting an end to the ongoing ${cunn}.`
      ]
    } else {
      t = [
        `Pulling b|reps head away from a|their ${hole}, a|rep a|tell b|them to stop performing ${cunn} on a|them.`,

        `Pressing a|their ${hole} into b|reps b|face one last time, a|rep then a|pull a|their hips away, putting an end to the ongoing ${cunn}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += setup.SexUtil.afterPenetrationReactionDom(me, them, [
      `a|rep a|move away from b|them`,
      `a|rep a|move a|their a|ass away from b|their b|face`,
      `a|rep a|withdraw a|their ${hole} away`,
    ], [
      `continue to lick inside a|reps ${hole}`,
      `taste more of a|reps ${hole}`,
      `${vaginal}ly please a|rep more`,
    ], sex)

    return story
  }
}
