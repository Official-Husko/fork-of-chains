/*
  Text macros for multiple units.
  (Describes unit1 getting unit2's traits)
  <<ubodyswap unit1 unit2>>: 'Draconic wings grow painfully from Bob's back as his dick grow ridges slowly becoming demonic in nature.'
  <<uinsultrape unit1 unit2>>: unit1 insults unit2 about trying to rape unit2
*/

function internalOutput(output, func, unit1_raw, unit2_raw) {
  let wrapper = $(document.createElement('span'))
  wrapper.wiki(func(unit1_raw, unit2_raw))
  wrapper.appendTo(output)
}

Macro.add(`ubodyswap`, { handler() {
  internalOutput(this.output, setup.Text.Unit.Bodyswap.bodyswap, this.args[0], this.args[1]);
} });

Macro.add(`uinsultrape`, { handler() {
  internalOutput(this.output, setup.Text.Insult.prerape, this.args[0], this.args[1]);
} });

