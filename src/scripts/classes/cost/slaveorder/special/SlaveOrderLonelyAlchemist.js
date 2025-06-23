setup.qcImpl.SlaveOrderLonelyAlchemist = class SlaveOrderLonelyAlchemist extends setup.qcImpl.SlaveOrderItem {
  /**
   * @param {setup.Item | string} item 
   */
  constructor(item) {
    super(item, Math.floor(25000 / setup.selfOrObject(item, setup.item).getValue()))

    this.base_price = 4000
    this.trait_multi = 1200
    this.value_multi = 0.9

    this.name = 'Order from the Lonely Alchemist'
    this.company_key = 'elf'
    this.expires_in = 14
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderLonelyAlchemist('${this.item_key}')`
  }

  getCriteria(quest) {
    const crit_traits_pool = [
      [setup.trait.skill_alchemy,],
      [setup.trait.magic_earth, setup.trait.magic_earth_master],
      [setup.trait.face_beautiful],
      [setup.trait.tough_nimble],
      [setup.trait.per_smart],
    ]

    const disaster_traits_pool = [
      [setup.trait.race_human,],
      [setup.trait.magic_wind, setup.trait.magic_wind_master],
      [setup.trait.face_scary, setup.trait.face_hideous],
      [setup.trait.tough_tough],
      [setup.trait.per_slow],
    ]

    const critical = setup.rng.choicesRandom(crit_traits_pool, 2).reduce((a, b) => a.concat(b), [])
    const disaster = setup.rng.choicesRandom(disaster_traits_pool, 2).reduce((a, b) => a.concat(b), [])

    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(setup.trait.training_obedience_basic,)
    ]

    const criteria = new setup.UnitCriteria(
      null, /* key */
      this.name,
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
