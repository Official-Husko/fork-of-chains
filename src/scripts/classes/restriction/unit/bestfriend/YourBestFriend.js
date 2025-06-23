setup.qresImpl.YourBestFriend = class YourBestFriend extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.YourBestFriend()`
  }

  explain() {
    return `Unit must be your best friend` 
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getBestFriend()?.isYou()
  }
}
