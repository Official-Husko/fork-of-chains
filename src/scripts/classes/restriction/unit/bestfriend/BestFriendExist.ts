// @ts-nocheck

setup.qresImpl.BestFriendExist = class BestFriendExist extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.BestFriendExist()`
  }

  explain() {
    return `Unit has a best friend/lover`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return !!unit.getBestFriend()
  }
}
