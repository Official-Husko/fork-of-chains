// @ts-nocheck


setup.qcImpl.SlaveOrderEquivalentExchange = class SlaveOrderEquivalentExchange extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 100

    this.name = 'Your Ransom'
    this.company_key = 'independent'
    this.expires_in = 4

    this.fulfilled_outcomes = [
      setup.qc.FreePlayer(),
    ]

    this.unfulfilled_outcomes = [
      setup.qc.Player(
        setup.qc.TraumatizeRandom('unit', 20),
      ),
      setup.qc.HideAll([
        setup.qc.Function(() => {
          setup.qc.Opportunity('equivalent_exchange', { 'you': 'you' }).apply(
            setup.costUnitHelper(State.variables.unit.player)
          )
        })],
        'You will continue to be held captive...'
      ),
    ]
  }

  text() {
    return `setup.qc.SlaveOrderEquivalentExchange()`
  }

  getCriteria(quest) {
    const req = []
    const your_value = State.variables.unit.player.getSlaveValue()

    req.push(setup.qres.Job(setup.job.slave))
    req.push(setup.qres.Trait(setup.trait.training_none))
    req.push(setup.qres.SlaveValueAtLeast(Math.round(your_value * 2)))

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Your Ransom', /* title */
      [],  /* crit */
      [],  /* disaster */
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
