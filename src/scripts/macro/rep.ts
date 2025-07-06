// @ts-nocheck

// v1.0.1
'use strict';

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
function unitRep(unit) {
  return setup.DOM.Util.unitRep(unit);
}

Macro.add('rep', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    if (this.args[0] instanceof setup.Unit) {
      const unitrep = unitRep(this.args[0])
      wrapper.wiki(unitrep)
    } else {
      wrapper.wiki(this.args[0].rep(this.args[1]))
    }
    wrapper.appendTo(this.output)
  }
})

Macro.add('Rep', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    if (this.args[0] instanceof setup.Unit) {
      let unitrep = unitRep(this.args[0])
      if (unitrep == 'you') {
        unitrep = 'You'
      }
      wrapper.wiki(unitrep)
    } else {
      wrapper.wiki(this.args[0].rep(this.args[1]))
    }
    wrapper.appendTo(this.output)
  }
})

Macro.add('reps', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    let rep = unitRep(this.args[0])
    if (rep == 'you') {
      rep = 'your'
    } else {
      rep = `${rep}'s`
    }
    wrapper.wiki(rep)
    wrapper.appendTo(this.output)
  }
})

Macro.add('Reps', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    let rep = unitRep(this.args[0])
    if (rep == 'you') {
      rep = 'Your'
    } else {
      rep = `${rep}'s`
    }
    wrapper.wiki(rep)
    wrapper.appendTo(this.output)
  }
})


Macro.add('repall', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(this.args[0].map(a => a.rep()).join(''))
    wrapper.appendTo(this.output)
  }
})


/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
function yourRep(unit) {
  return setup.DOM.Util.yourRep(unit);
}


Macro.add('yourrep', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(yourRep(this.args[0]))
    wrapper.appendTo(this.output)
  }
})

Macro.add('Yourrep', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(setup.capitalize(yourRep(this.args[0])))
    wrapper.appendTo(this.output)
  }
})


/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
function theSlaver(unit) {
  const rep = unitRep(unit)
  if (rep != 'you') {
    return `the ${unit.getJob().getName().toLowerCase()}`
  } else {
    return `you`
  }
}


Macro.add('theslaver', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(theSlaver(this.args[0]))
    wrapper.appendTo(this.output)
  }
})

Macro.add('Theslaver', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(setup.capitalize(theSlaver(this.args[0])))
    wrapper.appendTo(this.output)
  }
})


/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
function theRace(unit) {
  const rep = unitRep(unit)
  if (rep != 'you') {
    return setup.Text.replaceUnitMacros(`the a|race`, { a: unit })
  } else {
    return `you`
  }
}


Macro.add('therace', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(theRace(this.args[0]))
    wrapper.appendTo(this.output)
  }
})

Macro.add('Therace', {
  handler: function () {
    const wrapper = $(document.createElement('span'))
    wrapper.wiki(setup.capitalize(theRace(this.args[0])))
    wrapper.appendTo(this.output)
  }
})
