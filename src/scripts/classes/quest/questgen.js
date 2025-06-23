
// set to $questgen. Responsible for generating most quests.
// When a quest is generated in qc.QuestDelay(), then it will only be generated here.
setup.QuestGen = class QuestGen extends setup.TwineClass {
  constructor() {
    super()
    // list of [quest_pool_key, number_of_quests]
    this.to_generate = []
  }

  queue(quest_pool, number_of_quests) {
    this.to_generate.push([quest_pool.key, number_of_quests])
  }

  generate() {
    for (let i = 0; i < this.to_generate.length; ++i) {
      let quest_pool = setup.questpool[this.to_generate[i][0]]
      let number = this.to_generate[i][1]
      for (let j = 0; j < number; ++j) {
        quest_pool.generateQuest()
      }
    }
    this.to_generate = []
  }
}
