/**
 * @param {Object} obj 
 * @returns {string}
 */
export function domCardName(obj) {
  if (State.variables.gDebug) {
    return `${obj.getName()} (key: '${obj.key}')`
  } else {
    return obj.getName()
  }
}

/**
 * @param {Object} obj 
 * @returns {string}
 */
export function domCardRep(obj) {
  if (State.variables.gDebug) {
    return `${obj.rep()} (key: '${obj.key}')`
  } else {
    return obj.getName()
  }
}

/**
 * @param {Object} obj 
 * @returns {setup.DOM.Node}
 */
export function domCardNameBold(obj) {
  if (State.variables.gDebug) {
    return html`${setup.DOM.Util.namebold(obj)} (key: '${obj.key}')`
  } else {
    return setup.DOM.Util.namebold(obj)
  }
}
