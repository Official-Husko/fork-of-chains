/*
  <<bantertext banter>>: display banter text
*/

Macro.add('missingunitquest', { handler() {
  this.output.append(html`
    ${setup.DOM.Text.danger('The unit required to complete this quest no longer exists.')}
    This quest is no longer able to be completed. You should remove this quest.
  `)
} });

