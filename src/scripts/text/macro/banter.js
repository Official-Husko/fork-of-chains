/*
  <<bantertext banter>>: display banter text
*/

Macro.add('bantertext', { handler() {
  this.output.append(setup.DOM.Card.bantertext(this.args[0]))
} });

