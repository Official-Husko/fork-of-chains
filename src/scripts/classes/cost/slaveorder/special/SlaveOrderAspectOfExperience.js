
setup.qcImpl.SlaveOrderAspectOfExperience = class SlaveOrderAspectOfExperience extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = 3000
    this.value_multi = 0

    this.name = 'Order for a personal slave for a chieftain in the Northern Vale'
    this.company_key = 'humanvale'
    this.expires_in = 10
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderAspectOfExperience(${this.value_multi})`
  }


  getCriteria(quest) {
    const critical = [
    ]
    const disaster = [
    ]
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit('slave')
    const traits = unit.getTraits()
    for (const trait of traits) {
      if (trait.isAttachable() &&
        !trait.getTags().includes('race') &&
        !trait.getTags().includes('subrace') &&
        !trait.getTags().includes('training')) {
        critical.push(trait)
      }
    }

    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.NoTrait(unit.getRace()),
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Chieftain Order', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
