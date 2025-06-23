
setup.qcImpl.SlaveOrderTheRearDeal = class SlaveOrderTheRearDeal extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 100
    this.trait_multi = 0
    this.value_multi = 0

    this.name = 'The Rear Deal'
    this.company_key = 'humankingdom'
    this.expires_in = 18
    this.unfulfilled_outcomes = [
      setup.qc.VarRemove('the_rear_deal_active'),
    ]
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderTheRearDeal()`
  }

  // @ts-ignore
  getFulfilledOutcomes(quest) {
    const outcomes = [
      setup.qc.VarRemove('the_rear_deal_active'),
      setup.qc.Item(setup.item.potion_tight),
      setup.qc.Item(setup.item.potion_tight),
    ]
    if (State.variables.inventory.isHasItem(setup.item.rear_technology)) {
      outcomes.push(setup.qc.Item(setup.item.potion_tight))
      outcomes.push(setup.qc.Item(setup.item.potion_tight))
      outcomes.push(setup.qc.Item(setup.item.potion_tight))
    } else {
      outcomes.push(setup.qc.Item(setup.item.rear_technology))
    }
    return outcomes
  }

  getCriteria(quest) {
    // retrieve a random master training and four random advanced trainings.
    let adv = setup.rng.choicesRandom(setup.TraitHelper.TRAINING_ADVANCED_GENDERLESS, 12)

    let critical = []
    let disaster = []

    let req = [
      setup.qres.Job(setup.job.slave),
    ]

    let alltrait = [adv[0].getTraitGroup().getLargestTrait(), adv[1], adv[2], adv[3], adv[4], adv[5], adv[6]]
    for (let i = 0; i < alltrait.length; ++i) {
      req.push(setup.qres.TraitExact(alltrait[i]))
    }

    let banes = [adv[7], adv[8], adv[9], adv[10], adv[11]]
    for (let i = 0; i < banes.length; ++i) {
      let bane = banes[i]
      if (bane.getTags().includes('trobedience')) continue
      if (bane.getTags().includes('trendurance')) continue
      req.push(setup.qres.NoTrait(bane.getTraitGroup().getSmallestTrait()))
    }

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'The Rear Deal', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
