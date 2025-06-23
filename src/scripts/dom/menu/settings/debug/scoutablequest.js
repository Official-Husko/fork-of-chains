/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.Debug.scoutablequest = function () {
  const fragments = []

  // link to return to previous menu
  fragments.push(html`
      <div>
        ${setup.DOM.Nav.return('Back')}
      </div>
    `)

  fragments.push(html`
       <h2>
         Select questpool
       </h2>
    `)

  // list the quests 
  for (const quest_key in setup.questpool) {
    const quest = setup.questpool[quest_key];
    const generatable = quest.getAllQuestsAndOpportunities();
    generatable.sort((a, b) => a.template.getDifficulty().getLevel() - b.template.getDifficulty().getLevel())

    fragments.push(setup.DOM.Util.message(
      quest.getName(),
      () => {
        const quest_fragments = []
        generatable.forEach(entry => {
          quest_fragments.push(html`
                    <div>
                      ${entry.rarity.rep()}: (${entry.template.getDifficulty().rep()}) ${entry.template.getName()}
                    </div>
                    `)
        })
        if (quest_fragments.length) {
          return setup.DOM.create(
            'div',
            {},
            quest_fragments
          )
        } else {
          return null
        }
      }))
    fragments.push(html`
          <br/>
        `)
  }

  // put the fragments into one big <div>
  return setup.DOM.create(
    'div',
    {},
    fragments,
  )
}