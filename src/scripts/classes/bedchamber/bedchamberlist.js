
// special. Will be assigned to State.variables.bedchamberlist
setup.BedchamberList = class BedchamberList extends setup.TwineClass {
  constructor() {
    super()
    this.bedchamber_keys = []
  }

  newBedchamber() {
    let bedchamber = new setup.Bedchamber()
    this.bedchamber_keys.push(bedchamber.key)
    return bedchamber
  }

  getBedchambers(filter_dict) {
    let result = []
    for (let i = 0; i < this.bedchamber_keys.length; ++i) {
      let bedchamber = State.variables.bedchamber[this.bedchamber_keys[i]]
      if (
        filter_dict &&
        ('slaver' in filter_dict) &&
        bedchamber.getSlaver() != filter_dict['slaver']) {
        continue
      }
      result.push(bedchamber)
    }
    return result
  }
  
}
