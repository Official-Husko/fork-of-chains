/**
 * Unit's rep
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.DOM.Util.unitRep = function unitRep(unit) {
    if (unit.isYou()) {
        return 'you'
    } else {
        return unit.rep()
    }
}

/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.DOM.Util.yourRep = function yourRep(unit) {
    let rep = setup.DOM.Util.unitRep(unit)
    if (rep != 'you') {
        const duty = unit.getDuty()
        let title
        if (duty) {
            title = duty.getName()
        } else if (unit.isSlave()) {
            title = 'slave'
        } else if (unit.isRetired()) {
            title = 'ex-slaver'
        } else if (unit.isSlaver()) {
            title = 'slaver'
        } else {
            title = setup.Text.Unit.Trait.race(unit)
        }
        rep = setup.Text.replaceUnitMacros(`your a|adj ${title} a|rep`, { a: unit })
    }
    return rep
}

/**
 * Capitalized version of yourRep
 * @param {setup.Unit} unit 
 * @returns {string}
 */
 setup.DOM.Util.YourRep = function YourRep(unit) {
    return setup.capitalize(setup.DOM.Util.yourRep(unit))
}