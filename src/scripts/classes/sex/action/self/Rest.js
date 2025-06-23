setup.SexActionClass.Rest = class Rest extends setup.SexAction {
  getTags() { return super.getTags().concat(['nobodypart', 'normal', 'relief',]) }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        discomfort: -setup.Sex.DISCOMFORT_MEDIUM,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced, setup.sexpace.resist],
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'Rest'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Rest, reducing discomfort`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    const topic = setup.Text.Banter._getTopic()
    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const location = sex.getLocation()
    const gaze = location.repGazeAt(sex)

    let t
    if (mypace == setup.sexpace.resist) {
      t = [
        `a|Rep a|let out a|a_sob as a|they a|rest for a short while to reduce the pain.`,
        `a|Rep a|try to cope with the unwanted pain by resting a little.`,
        `The pain was too much for a|rep, who a|let out a|a_sob in distress.`,
        `a|Rep a|attempt to relax however a|they can to reduce the pain of the unwanted violations.`,
      ]
    } else {
      t = [
        'a|Rep a|rest, reducing a|their discomfort.',
        `a|Rep a|try to reduce a|their discomfort by doing a|their best to relax despite the situation.`,
        `a|Rep a|rest for a little while, reducing some of a|their discomfort.`,
      ]
    }

    return setup.rng.choice(t)
  }

}