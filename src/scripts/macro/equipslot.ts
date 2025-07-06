// @ts-nocheck

// v1.0.0
'use strict';

Macro.add('uequipslot', {
  handler : function () {
    let wrapper = $(document.createElement('span'))

    let unit = this.args[0]
    if (setup.isString(unit)) unit = State.variables.unit[unit]

    let slotkey = this.args[1]
    if (!(slotkey in setup.equipmentslot)) {
      throw new Error(`unrecognized slot key: ${slotkey} for uequipslot`)
    }

    let eq = setup.Text.Unit.Equipment.getEquipmentAt(unit, setup.equipmentslot[slotkey])
    if (eq) {
      wrapper.wiki(eq.rep())
    } else {
      wrapper.wiki(`<<u${slotkey} "${unit.key}">>`)
    }

    wrapper.appendTo(this.output)
  }
});

