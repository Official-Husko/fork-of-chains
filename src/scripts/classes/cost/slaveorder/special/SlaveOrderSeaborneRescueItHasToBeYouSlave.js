
setup.qcImpl.SlaveOrderSeaborneRescueItHasToBeYouSlave = class SlaveOrderSeaborneRescueItHasToBeYouSlave extends setup.qcImpl.SlaveOrderTemplate {
  constructor() {
    super()

    this.base_price = 0
    this.trait_multi = 3000
    this.value_multi = 1

    this.name = 'Pirate Captain Order (Slave)'
    this.company_key = 'outlaws'
    this.expires_in = 4
    this.fulfilled_outcomes = []
    this.unfulfilled_outcomes = []
    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderSeaborneRescueItHasToBeYouSlave()`
  }


  getCriteria(quest) {
    let choices = [
      [setup.trait.per_lustful, setup.trait.per_sexaddict],
      [setup.trait.per_active],
      [setup.trait.per_playful],
      [setup.trait.training_obedience_advanced],
      [setup.trait.anus_tight],
      [setup.trait.muscle_strong, setup.trait.muscle_verystrong, setup.trait.muscle_extremelystrong],
      [setup.trait.face_attractive, setup.trait.face_beautiful],
      [setup.trait.muscle_thin, setup.trait.muscle_verythin, setup.trait.muscle_extremelythin],
      [setup.trait.skill_entertain],
      [setup.trait.skill_hypnotic],
      [setup.trait.skill_ambidextrous],
    ]
    let gender = State.variables.settings.getGenderRandom(setup.job.slave)

    if (gender == setup.trait.gender_male) {
      choices = choices.concat([
        [setup.trait.dick_large, setup.trait.dick_huge, setup.trait.dick_titanic,],
        [setup.trait.balls_large, setup.trait.balls_huge, setup.trait.balls_titanic,],
      ])
    } else {
      choices = choices.concat([
        [setup.trait.breast_large, setup.trait.breast_huge, setup.trait.breast_titanic,],
        [setup.trait.vagina_tight],
      ])
    }

    setup.rng.shuffleArray(choices)
    let disaster = []
    let critical = []
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < choices[i].length; ++j) {
        critical.push(choices[i][j])
      }
    }

    let req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.Trait(gender),
    ]

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'Easy-to-Please Pirate Order', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
