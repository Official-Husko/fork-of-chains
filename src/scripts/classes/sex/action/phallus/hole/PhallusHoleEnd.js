/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_STOP
.*/

export class PhallusHoleEnd extends setup.SexAction.OngoingEnd {
  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const mypace = sex.getPace(me)
    const mypose = sex.getPose(me)
    const myposition = sex.getPosition(me)
    const theirpace = sex.getPace(them)
    const theirpose = sex.getPose(them)
    const theirposition = sex.getPosition(them)

    let story = ''

    let t

    const dick = this.getPenetratorBodypart().rep(me, sex)
    const tip = this.getPenetratorBodypart().repTip(me, sex)
    const fuck = this.getPenetratorBodypart().repFuck(me, sex)

    const hole = this.getPenetrationTarget().rep(them, sex)
    const labia = this.getPenetrationTarget().repLabia(them, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(them, sex)

    const myfacingheight = mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex)
    const theirfacingheight = theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex)

    let dir = 'for'
    let odir = 'back'
    if (myfacingheight.facing.isDown()) {
      dir = 'down'
      odir = 'up'
    } else if (myfacingheight.facing.isUp()) {
      dir = 'up'
      odir = 'down'
    }

    if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly yanking a|their ${dick} out of b|reps ${hole}, a|rep dominantly a|slide the ${tip} up and down over b|their ${labia} one last time before pulling back.`,
        `Thrusting deep inside of b|rep one last time, a|rep then a|yank a|their ${dick} back out of b|their ${hole}, putting an end to the rough ${fuck}ing.`
      ]
    } else {
      t = [
        `Sliding a|their ${dick} out of b|reps ${hole}, a|rep a|rub the ${tip} up and down over b|their ${labia} one last time before pulling back.`,
        `Pushing deep inside of b|rep one last time, a|rep then a|slide a|their ${dick} back out of b|their ${hole}, putting an end to the ${fuck}ing.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += setup.SexUtil.afterPenetrationReactionSub(me, them, [
      `a|rep a|pull out of b|reps ${hole}`,
      `b|they b|pull b|their ${hole} away from a|rep`,
      `a|reps ${dick} retreated from b|reps ${hole}`,
      `the penetration seemingly ends`,
      `a|rep a|pull a|their ${dick} out of b|their ${hole}`,
    ], [
      `continue having a|their ${dick} lodged deep in b|their ${hole}`,
      `continue enjoying the feeling of having a|their ${dick} inside of b|them`,
      `have a|them use more of b|their holes`,
    ], sex)

    return story
  }
}
