setup.qcImpl.SlaveOrderHighDemonCommunity = class SlaveOrderHighDemonCommunity extends setup.qcImpl.SlaveOrderTemplate {
  /**
   * @param {string} type 
   */
  constructor(type) {
    super()

    let difficulty

    this.base_price = 1000
    this.trait_multi = 0
    this.value_multi = 0

    this.type = type
    if (type == 'money') {
      difficulty = 'easy'
      this.base_price = 5000
      this.trait_multi = 2600
      this.value_multi = 1.1
    } else if (type == 'favor') {
      difficulty = 'easy'
    } else if (type == 'equipment') {
      difficulty = 'easy'
    } else if (type == 'sexmanual') {
      difficulty = 'hard'
    } else if (type == 'slaver') {
      difficulty = 'hard'
    } else if (type == 'potion') {
      difficulty = 'hard'
    } else if (type == 'punishment') {
      difficulty = 'punishment'
      this.base_price = 15
    }
    this.difficulty = difficulty

    this.name = 'Order from the High Demon Society'
    this.company_key = 'demon'
    this.expires_in = 24

    this.destination_unit_group_key = setup.unitgroup.soldslaves.key
  }

  text() {
    return `setup.qc.SlaveOrderHighDemonCommunity(${this.value_multi})`
  }

  getUnfulfilledOutcomes(quest) {
    /**
     * @type {setup.Cost[]}
     */
    const outcomes = [
      setup.qc.HideAll(
        [
          setup.qc.SetCooldownQuest('high_demon_society', 0),
        ],
        '',
      ),
    ]
    if (this.type == 'punishment') {
      outcomes.push(setup.qc.Ire('demon', 20))
    }
    return outcomes
  }

  getFulfilledOutcomes(quest) {
    const outcomes = []

    if (this.type != 'punishment') {
      outcomes.push(
        setup.qc.HideAll([
          setup.qc.VarSet('high_demon_society_fulfilled', 1, 25)
        ], ``))
    }

    if (this.type == 'favor') {
      outcomes.push(setup.qc.UnitValueToFavor(
        'demon',
        /* favor per value = */ 0.02,
        /* favor per crit = */ 50,
      ))
    } else if (this.type == 'equipment') {
      outcomes.push(setup.qc.HideAll(
        [
          setup.qc.Equipment(setup.equipmentpool.slaving_good),
          setup.qc.Equipment(setup.equipmentpool.slaving_good),
        ],
        'Rare equipments...',
      ))
    } else if (this.type == 'sexmanual') {
      outcomes.push(setup.qc.Item(setup.item.sexmanual_facesit))
    } else if (this.type == 'slaver') {
      outcomes.push(setup.qc.Function((order) => {
        const unit = order.getUnit()

        const slaver = setup.unitgroup.subrace_demon.getUnit({
          trait_key: unit.getGender().key,
          retries: setup.INFINITY,
        })

        State.variables.notification.disable()
        setup.qcImpl.Bodyswap.doBodySwap(unit, slaver)
        setup.qc.TraitReplace('unit', setup.trait.race_demon).apply(setup.costUnitHelper(slaver))
        setup.qc.ResetInnateTraits('unit').apply(setup.costUnitHelper(slaver))
        setup.qc.AddTitle('unit', 'high_society_demon').apply(setup.costUnitHelper(slaver))
        State.variables.notification.enable()

        setup.qc.Slaver(
          'unit',
          `a|is a demon from the high demon society who joined your company after possessing the body of ${unit.getName()}`
        ).apply(setup.costUnitHelper(slaver, order.getName()))
      }, "A demonic slaver will possess the slave's body and join the mortal realm..."))
    } else if (this.type == 'potion') {
      const tech = setup.item.technology_blank
      const potion = setup.item.blank_potion
      if (!State.variables.inventory.isHasItem(tech)) {
        outcomes.push(setup.qc.Item(tech))
      } else {
        outcomes.push(setup.qc.Item(potion))
        outcomes.push(setup.qc.Item(potion))
      }
      outcomes.push(setup.qc.Item(potion))
      outcomes.push(setup.qc.Item(potion))
    }
    return outcomes
  }

  _getRandomTraits() {
    let acceptable = ['per', 'skill', 'muscle', 'height', 'tough', 'face',]
    // add a few random traits commonly seen in demons
    const t1 = setup.unitpool.subrace_demon_male._generateTraits().filter(trait =>
      !trait.isNeedGenital() &&
      trait.getTags().filter(tag => acceptable.includes(tag)).length
    )
    return t1
  }

  getCriteria(quest) {
    const critical = [
    ]
    const disaster = [
    ]

    /**
     * @type {setup.Restriction[]}
     */
    const req = [
      setup.qres.Job(setup.job.slave),
      setup.qres.NoTrait(setup.trait.race_demon),
    ]

    if (this.type != 'punishment') {
      req.push(
        setup.qres.Through(
          setup.qres.VarNull('high_demon_society_fulfilled'),
          'Only one High Demon Society order can be fulfilled at a time',
        )
      )
    }

    if (['money', 'favor'].includes(this.type)) {
      // add 5 non-dick corruptions
      const corruptions = setup.TraitHelper.getAllTraitsOfTags(['corruption']).filter(
        trait => !trait.isNeedGenital())
      setup.rng.shuffleArray(corruptions)
      for (let i = 0; i < 5; ++i) {
        critical.push(corruptions[i])
      }
      for (let i = 5; i < corruptions.length; ++i) {
        disaster.push(corruptions[i])
      }

      // add random traits
      const t1 = this._getRandomTraits()
      for (let i = 0; i < t1.length; ++i) {
        if (i % 2) {
          disaster.push(...t1[i].getTraitCover())
        } else {
          critical.push(...t1[i].getTraitCover())
        }
      }
    }

    if (this.difficulty == 'easy') {
      // just general corruption, and corruptions
      const traits = this._getRandomTraits()
      req.push(setup.qres.Trait(traits[0]))
      req.push(setup.qres.Trait(setup.trait.corrupted))
    } else if (this.difficulty == 'punishment') {
      req.push(setup.qres.Trait(setup.trait.corrupted))
    } else {
      const traits = this._getRandomTraits()
      req.push(setup.qres.Trait(traits[0]))

      // half-corrupted
      const corruptions = setup.TraitHelper.getAllTraitsOfTags(['corruption']).filter(
        trait => !trait.isNeedGenital())
      setup.rng.shuffleArray(corruptions)
      for (let i = 0; i < corruptions.length; ++i) {
        if (i % 2) {
          req.push(setup.qres.NoTrait(corruptions[i]))
        } else {
          req.push(setup.qres.Trait(corruptions[i]))
        }
      }
    }

    let criteria = new setup.UnitCriteria(
      null, /* key */
      'High Demon Society Order', /* title */
      critical,
      disaster,
      req,
      {}  /* skill effects */
    )
    return criteria
  }
}
