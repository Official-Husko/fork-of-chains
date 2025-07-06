// @ts-nocheck

/**
 * Morphs into its model.
 */
setup.qcImpl.QuestDoppelganger = class QuestDoppelganger extends setup.Cost {
  constructor() {
    super()
  }

  text() {
    return `setup.qc.QuestDoppelganger()`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const unit = quest.getActorUnit('unit')
    const target = setup.getUnit({ title: 'quest_doppelganged' })
    if (target) {
      setup.qcImpl.Bodyswap.doBodySwap(unit, target, /* force */ false, /* one direction */ true)
    }
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `You are captured or otherwise lost from the company`
  }
}
