
const QUESTPOOL_TO_STACKS = {
  capturedeasy: 1,
  capturedmedium: 2,
  capturedhard: 3,
  escapeeasy: 1,
  escapemedium: 2,
  escapehard: 3,
}

// force one of your units into a "missing unit" quest that can recapture them.
setup.qcImpl.MissingUnitRecapture = class MissingUnitRecapture extends setup.Cost {
  constructor(actor_name, questpool_key) {
    super()

    if (!(questpool_key in QUESTPOOL_TO_STACKS)) throw new Error(`Unknown quest pool for recapture: ${questpool_key}`)
    this.questpool_key = questpool_key
    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.MissingUnitRecapture('${this.actor_name}', '${this.questpool_key}')`
  }

  apply(quest) {
    let questpool = setup.questpool[this.questpool_key]
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)

    let stacks
    if (unit.isMindbroken() || unit.isObedient()) {
      stacks = 1
    } else {
      stacks = QUESTPOOL_TO_STACKS[this.questpool_key]
    }
    if (setup.qcImpl.MissingUnit.checkBlessingOfLife({ unit: unit, stacks: stacks })) return

    if (unit.isSlave()) {
      setup.notify(`a|Rep a|is <<dangertext 'attempting an escape!'>> You must recapture immediately if you want the unit back!`,
        { a: unit })
    } else if (unit.isSlaver()) {
      setup.notify(`a|Rep a|is <<dangertext 'captured!'>> You must immediately rescue the slaver if you want them back!`,
        { a: unit })
    }

    let tag = 'escaped_slave'
    if (unit.isSlaver()) tag = 'captured_slaver'

    unit.addTag(tag)
    setup.qc.Quest(questpool, 1).apply(quest)
    unit.removeTag(tag)
  }

  undoApply(quest) {
    throw new Error(`Cannot be undone`)
  }

  explain(quest) {
    return `${this.actor_name} will be lost from your company, but immediately regainable with quest (${this.questpool_key})`
  }
}
