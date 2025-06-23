setup.DialogueHelper = class DialogueHelper extends setup.TwineClass {
  /**
   * @param {string} actor_name 
   * @returns {Dialogue}
   */
  static createEmptyDialogue(actor_name) {
    const res = {
      friendly: [''],
      bold: [''],
      cool: [''],
      witty: [''],
      debauched: [''],
    }
    return {
      actor: actor_name,
      texts: res,
    }
  }
}

