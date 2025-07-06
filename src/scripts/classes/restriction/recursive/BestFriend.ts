// @ts-nocheck

setup.qresImpl.BestFriend = class BestFriend extends setup.Restriction {
  /**
   * @param {setup.Restriction} restriction 
   */
  constructor(restriction) {
    super()

    this.restriction = restriction
  }

  text() {
    return `setup.qres.BestFriend(${this.restriction.text()})`
  }

  explain(quest) {
    return `Unit's best friend or lover satisfies: (${this.restriction.explain(quest)})`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const best_friend = unit.getBestFriend()
    if (!best_friend) return false
    return this.restriction.isOk(best_friend)
  }

  getLayout() {
    return {
      css_class: "marketobjectcard",
      blocks: [
        {
          passage: "RestrictionBestFriendHeader",
          addpassage: "QGAddRestrictionUnit",
          entrypath: ".restriction"
        }
      ]
    }
  }
}
