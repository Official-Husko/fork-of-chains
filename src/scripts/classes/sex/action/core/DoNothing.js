setup.SexActionClass.DoNothing = class DoNothing extends setup.SexAction {
  getTags() { return super.getTags().concat(['normal',]) }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
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
    return 'Do nothing'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Skip a|their turn`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const ambience = sex.getLocation().repAmbience(sex)
    const gaze_at = sex.getLocation().repGazeAt(sex)

    const unit = this.getActorUnit('a')
    const pace = sex.getPace(unit)

    if (pace == setup.sexpace.mindbroken) {
      return [
        `a|Rep a|continue to do nothing, while staring blankly at ${gaze_at}.`,
        `a|Reps broken mind comples the slave to do nothing.`,
        `The broken slave prefers to start at ${gaze_at} and does nothing.`,
        `a|Rep a|continue to mindlessly stay still.`,
        `The broken slave remains completely passive.`,

        `Like a sex toy waiting to be used, the slave stays silent, unaware of what's coming next.`,
        `a|Rep a|remain still, fixing a|their gaze on ${gaze_at}.`,
        `Without a functional mind, a|rep can do nothing but do nothing.`,
        `a|Rep a|do nothing in response.`,
        `a|Rep no longer a|have the mind capability to do anything else than remaining passive.`,
      ]
    } else if (pace == setup.sexpace.resist) {
      return [
        `a|Rep a|cry a little but a|is unable to do anything.`,
        `a|Rep a|let out a helpless cry as a|they a|is unable to do anything.`,
        `a|Rep a|remain helpless and a|is unable to do anything.`,
      ]
    } else if (pace == setup.sexpace.forced) {
      return [
        `a|Rep a|is starting to accept a|their role in life and a|decide to remain passive.`,
        `a|Rep a|let out a small cry as a|they a|continue to do nothing.`,
        `a|Rep a|close a|their eyes as a|they a|do nothing in anticipation of the upcoming abuse.`,
      ]
    } else if (pace == setup.sexpace.dom) {
      return [
        `a|Rep confidently a|do nothing for the moment.`,
        `a|Rep a|choose to do nothing and a|continue to wait for the right moment.`,
        `a|Rep a|decide to do nothing for now.`,
      ]
    } else {
      return [
        `a|Rep a|do nothing for the moment.`,
        `a|Rep a|feel like doing nothing for now.`,
        `a|Rep a|decide to do nothing for now.`,
      ]
    }
  }

}