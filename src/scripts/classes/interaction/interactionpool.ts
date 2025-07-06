// @ts-nocheck

setup.InteractionPool = class InteractionPool extends setup.TwineClass {
  constructor(key) {
    super()
    
    this.key = key
    this.interaction_keys = []

    if (key in setup.interactionpool) throw new Error(`Duplicate ${key} in interaction pool`)
    setup.interactionpool[key] = this
  }

  register(interaction) {
    this.interaction_keys.push(interaction.key)
  }

  getInteractions() {
    let result = []
    for (let i = 0; i < this.interaction_keys.length; ++i) {
      result.push(setup.interaction[this.interaction_keys[i]])
    }
    return result
  }

  //advanceWeek() {
    //let interactions = this.getInteractions()
    //for (let i = 0; i < interactions.length; ++i) {
      //interactions[i].advanceWeek()
    //}
  //}
}
