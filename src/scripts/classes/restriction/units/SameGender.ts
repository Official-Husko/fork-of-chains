// @ts-nocheck

setup.qresImpl.SameGender = class SameGender extends setup.Restriction {
  /**
   * @param {string} actor_name1 
   * @param {string} actor_name2 
   */
  constructor(actor_name1, actor_name2) {
    super()

    this.actor_name1 = actor_name1
    this.actor_name2 = actor_name2
  }

  text() {
    return `setup.qres.SameGender('${this.actor_name1}', '${this.actor_name2}')`
  }

  explain(quest) {
    if (quest) {
      const unit1 = quest.getActorUnit(this.actor_name1)
      const unit2 = quest.getActorUnit(this.actor_name2)
      return `${unit1.rep()} and ${unit2.rep()} must be of the same gender`
    } else {
      return `${this.actor_name1} and ${this.actor_name2} must be of the same gender`
    }
  }

  isOk(quest) {
    const unit1 = quest.getActorUnit(this.actor_name1)
    const unit2 = quest.getActorUnit(this.actor_name2)
    return unit1.getGender() == unit2.getGender()
  }
}
