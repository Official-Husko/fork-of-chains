// @ts-nocheck


// whether slave is located in a full bedchamber with both slaves usable by you
setup.qresImpl.SlaveBedchamberFullUsableByYou = class SlaveBedchamberFullUsableByYou extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.SlaveBedchamberFullUsableByYou()`
  }

  explain() {
    return `Unit must be in a full bedchamber usable by you`
  }

  isOk(unit) {
    if (!unit.isSlave()) return false
    let bedchamber = unit.getBedchamber()
    if (!bedchamber) return false
    let slaves = bedchamber.getSlaves()
    if (slaves.length < 2) return false
    for (let i = 0; i < slaves.length; ++i) {
      if (!slaves[i].isUsableBy(State.variables.unit.player)) return false
    }
    return true
  }
}
