// @ts-nocheck

setup.qcImpl.SlaveOrderHeadCourtesan = class SlaveOrderHeadCourtesan extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = 0
    this.value_multi = 0.5

    this.name = 'Head Courtesan'
    this.company_key = 'player'
    this.expires_in = 50

    /**
     * @type {setup.Cost[]}
     */
    this.fulfilled_outcomes = [
      setup.qc.HideAll([
        // @ts-ignore
        setup.qc.VarSet('quest_brothel_progress', '108', -1),
        // @ts-ignore
        setup.qc.VarSet('quest_brothel_wait', '4', -1),
      ], 'Improves your brothel'),
    ]
    this.destination_unit_group_key = setup.unitgroup.brothel_head_courtesan.key
  }

  text() {
    return `setup.qc.SlaveOrderHeadCourtesan()`
  }

  getCriteria(quest) {

    const class_level = setup.dutytemplate.questbrothelmanager.class()

    const sub = setup.dutytemplate.questbrothelmanager.sub()

    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(setup.trait.training_obedience_advanced),
      setup.qres.AnyTrait([setup.trait.magic_fire, setup.trait.magic_water, setup.trait.magic_earth,
      setup.trait.magic_wind, setup.trait.magic_dark, setup.trait.magic_light])
    ]

    if (sub == 'sub') {
      req.push(setup.qres.Trait('per_submissive'))
      req.push(setup.qres.AnyTrait([setup.trait.value_high3, setup.trait.value_high4, setup.trait.value_high5, setup.trait.value_high6, setup.trait.value_high7], true))
    } else if (sub == 'dom') {
      req.push(setup.qres.Trait('per_dominant'))
      req.push(setup.qres.AnyTrait([setup.trait.value_high3, setup.trait.value_high4, setup.trait.value_high5, setup.trait.value_high6, setup.trait.value_high7], true))
    } else {
      req.push(setup.qres.NoTrait('per_dominant'))
      req.push(setup.qres.NoTrait('per_submissive'))
      req.push(setup.qres.AnyTrait([setup.trait.value_high4, setup.trait.value_high5, setup.trait.value_high6, setup.trait.value_high7], true))
    }

    if (setup.dutytemplate.questbrothelmanager.gender() == 'male') {
      req.push(setup.qres.Trait('gender_male'))
    } else {
      req.push(setup.qres.Trait('gender_female'))
    }

    const critical = []
    const disaster = []

    const criteria = new setup.UnitCriteria(
      null, /* key */
      this.name, /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
