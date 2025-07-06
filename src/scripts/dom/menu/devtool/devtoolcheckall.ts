// @ts-nocheck

import { display_errors, get_errors_from_texts_to_check } from "./devtoolverifycreate"

setup.DOM.Menu.devtoolcheckall = function () {
  /**
   * @type {Object}
   */
  const texts_to_check = {}

  for (const quest of Object.values(setup.questtemplate)) {
    texts_to_check[`Quest Description of ${quest.key}`] = Story.get(quest.getDescriptionPassage()).text
    for (let i = 0; i < setup.QUEST_OUTCOMES.length; ++i) {
      const outcomes = quest.getOutcomes()
      if (i > 0 && outcomes[i][0] == outcomes[i - 1][0]) continue
      texts_to_check[`Outcome ${setup.QUEST_OUTCOMES[i]} of ${quest.key}`] = Story.get(outcomes[i][0]).text
    }
  }

  for (const opportunity of Object.values(setup.opportunitytemplate)) {
    texts_to_check[`Opportunity Description of ${opportunity.key}`] = Story.get(opportunity.getDescriptionPassage()).text
    const options = opportunity.getOptions()
    for (let i = 0; i < options.length; ++i) {
      const option = options[i]
      texts_to_check[`Title of option #${i + 1} of ${opportunity.key}`] = Story.get(option.description_passage).text
      const passage = option.outcome_passage
      if (passage) {
        texts_to_check[`Text of option #${i + 1} of ${opportunity.key}`] = Story.get(passage).text
      }
    }
  }

  for (const event of Object.values(setup.event)) {
    texts_to_check[`Event text of ${event.key}`] = Story.get(event.getPassage()).text
  }

  for (const interaction of Object.values(setup.interaction)) {
    texts_to_check[`Interaction text of ${interaction.key}`] = Story.get(interaction.getPassage()).text
  }

  for (const activity of Object.values(setup.activitytemplate)) {
    const dialogues = activity.getDialogues()
    for (let i = 0; i < dialogues.length; ++i) {
      for (const speech in dialogues[i].texts) {
        const texts = dialogues[i].texts[speech]
        for (let j = 0; j < texts.length; ++j) {
          texts_to_check[`Dialogue variant ${j + 1} of the ${i + 1}-th dialogue of activity ${activity.key}`] = texts[j]
        }
      }
    }
  }

  const details = get_errors_from_texts_to_check(texts_to_check)
  display_errors({
    error_details: details,
  })
}
