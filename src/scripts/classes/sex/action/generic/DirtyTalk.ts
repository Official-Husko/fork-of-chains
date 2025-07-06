// @ts-nocheck

setup.SexActionClass.DirtyTalk = class DirtyTalk extends setup.SexAction {
  getTags() { return super.getTags().concat(['normal', 'mouth',]) }
  desc() { return 'Dirty talk' }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_TINY,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub,],
        restrictions: [
          setup.qres.IsCanTalk(),
          setup.qres.SexCanUseBodypart(setup.sexbodypart.mouth),
        ],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Dirty talk`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Talk dirty to b|rep`
  }

  /**
   * Returns the parsed string from this raw story.
   * @param {setup.SexInstance} sex 
   * @returns {string | setup.DOM.Node}
   */
  story(sex) {
    const unit = this.getActorUnit('a')
    const target = this.getActorUnit('b')
    const dirty_talk = setup.Text.Dirty.talk({
      unit: unit,
      target: target,
      sex: sex,
    })

    const fragments = []
    fragments.push(setup.DOM.Card.dialogue({
      unit: unit, dialogue: dirty_talk.unit_dialogue
    }))

    if (!target.isYou()) {
      fragments.push(setup.DOM.Card.dialogue({
        unit: target,
        dialogue: dirty_talk.target_dialogue,
        position: 'right',
      }))
    }

    return setup.DOM.create('div', {}, fragments)
  }
}

