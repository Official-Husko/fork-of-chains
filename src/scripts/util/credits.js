setup.getAuthorCredits = function () {
  /**
   * @param {object} iter
   * @param {object} credits
   * @param {string} name
   */
  function addToCredits(iter, credits, name) {
    for (const workkey in iter) {
      const work = iter[workkey]
      const author = work.getAuthor()
      if (!author.name) continue
      if (!(author.name in credits)) {
        credits[author.name] = {}
        for (const contentkey of setup.CONTENT_CREATOR_TYPES) {
          credits[author.name][contentkey] = []
        }
        credits[author.name][name].push({ content: work, info: author })
      }
    }

    // sort it
    for (const author in credits) {
      credits[author][name].sort((a, b) => a.content.getName().localeCompare(b.content.getName()))
    }
  }

  const credits = {}
  addToCredits(setup.questtemplate, credits, 'quest')
  addToCredits(setup.opportunitytemplate, credits, 'opportunity')
  addToCredits(setup.event, credits, 'event')
  addToCredits(setup.interaction, credits, 'interaction')
  addToCredits(setup.activitytemplate, credits, 'activity')
  return credits
}
