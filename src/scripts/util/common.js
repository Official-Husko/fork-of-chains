
/**
 * @param {object | string} obj 
 * @returns {string}
 */
setup.keyOrSelf = function (obj) {
  if (setup.isString(obj)) return obj
  return obj.key
}

/**
 * @template A
 * @param {A | string} obj 
 * @param {*} obj_set
 * @returns {A}
 */
setup.selfOrObject = function (obj, obj_set) {
  if (typeof obj === 'string') {
    if (!(obj in obj_set)) {
      throw new Error(`${obj} not found in ${obj_set}!`)
    }
    return obj_set[obj]
  } else {
    return obj
  }
}

setup.copyProperties = function (obj, objclass) {
  Object.keys(objclass).forEach(function (pn) {
    obj[pn] = clone(objclass[pn])
  })
}

setup.nameIfAny = function (obj) {
  if (obj && 'getName' in obj) return obj.getName()
  return null
}

setup.isString = function (x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

setup.escapeJsString = function (s) {
  return s.split("\\").join("\\\\").split("'").join("\\\'").split('"').join('\\\"')
}

/** @param {string} s */
setup.capitalize = function (s) {
  return s.substr(0, 1).toUpperCase() + s.substr(1)
}

const capitalize_words_regex = /(\b[a-z](?!\s))/g;

/** @param {string} s */
setup.capitalizeWords = function (s) {
  return s.replace(capitalize_words_regex, (c) => c.toUpperCase())
}

/** @param {string} s */
setup.title_case = function (s) {
  return s.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const escape_html_regexp = /[&<>"']/g
const escape_html_map = {
  '&': "&amp;",
  '<': "&lt;",
  '>': "&gt;",
  '"': "&quot;",
  "'": "&#039;",
}

/**
 * @param {string} unsafe 
 */
setup.escapeHtml = function (unsafe) {
  return unsafe.replace(escape_html_regexp, c => escape_html_map[c])
}

/**
 * Returns the URL for an image
 * Tries to find if it is present as an embbeded image, returning the data uri in such case
 **/
setup.resolveImageUrl = function (imagepath) {
  return (window.IMAGES && window.IMAGES[imagepath]) || imagepath
}

/**
 * Returns the string for an image to the specified path,
 * calling setup.resolveImageUrl internally, and escaping the url
 * @param {{
 * imagepath: string,
 * tooltip_content?: string,
 * tooltip_noclick?: boolean,
 * extra_class?: string,
 * }} args
 **/
setup.repImg = function ({
  imagepath,
  tooltip_content,
  tooltip_noclick,
  extra_class,
}) {
  const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(imagepath))}" />`
  if (tooltip_content || extra_class) {
    const noclick = tooltip_noclick ? ' data-tooltip-noclick' : ''
    return `<span ${tooltip_content ? `data-tooltip="${setup.escapeHtml(tooltip_content)}" ${noclick}` : ''} ${extra_class ? `class="${extra_class}"` : ''}>${img}</span>`
  } else {
    return img
  }
}

/**
 * Like setup.repImg, but for icons and resize them properly.
 * @param {string} imagepath
 * @param {string=} tooltip_content
 **/
setup.repImgIcon = function (imagepath, tooltip_content) {
  return setup.repImg({
    imagepath: imagepath,
    tooltip_content: tooltip_content,
    extra_class: 'trait'
  })
}


/**
 * @param {any} instance 
 * @param {string} macroname 
 * @param {*=} icontext 
 * @param {string=} message 
 * @param {*=} target 
 * @returns {string}
 */
setup.repMessage = function (instance, macroname, icontext, message, target) {
  return setup.repMessageDict({
    instance: instance,
    macroname: macroname,
    icontext: icontext,
    message: message,
  })
}

/**
 * 
 * @param {{
 * instance: Object,
 * macroname: string,
 * icontext?: string,
 * message?: string,
 * text_class?: string,
 * }} args
 * @returns {string}
 */
setup.repMessageDict = function ({
  instance,
  macroname,
  icontext,
  message,
  text_class,
}) {
  if (!message) message = instance.getName()
  let text = (icontext || '')
  text += `<span data-tooltip="<<${macroname} '${instance.key}' 1>>" data-tooltip-wide>`
  text += `<a class="replink ${text_class ? text_class : ''}">${message}</a>`
  text += `</span>`
  return text
}

/**
 * @param {string} name 
 * @param {Object} pool 
 * @param {boolean} [is_retain_key]
 * @returns 
 */
setup.getKeyFromName = function (name, pool, is_retain_key) {
  let basekey = name.replace(/\W/g, '_').toLowerCase().replace(/_+/g, '_')
  let testkey = basekey
  if (is_retain_key) {
    return testkey
  }
  let idx = 1
  while (testkey in pool) {
    idx += 1
    testkey = `${basekey}${idx}`
  }
  return testkey
}

setup.getUnitPlayerLevelDifficulty = function () {
  const level = Math.min(State.variables.unit.player.getLevel(), setup.LEVEL_PLATEAU)
  return setup.qdiff[`normal${level}`]
}

setup.lowLevelMoneyMulti = function () {
  const diff1 = setup.getUnitPlayerLevelDifficulty()
  const diff2 = setup.qdiff[`normal${setup.LEVEL_PLATEAU}`]
  return diff1.getMoney() / diff2.getMoney()
}

/**
 * @param {number} money 
 * @returns {number}
 */
setup.nudgeMoney = function (money) {
  const nudge = setup.MONEY_NUDGE

  let nudge_amt = Math.random() * nudge
  if (Math.random() < 0.5) nudge_amt *= -1

  return Math.round(money * (1.0 + nudge_amt))
}

// Swaps the values of two array items or object fields
setup.swapValues = function (target, a, b) {
  const val = target[a]
  target[a] = target[b]
  target[b] = val
}

setup.isAbsoluteUrl = function (url) {
  return /^(?:\/|[a-z]+:\/\/)/.test(url)
}

/**
 * Runs a sugarcube command, for example, <<focgoto "xxx">>
 * @param {string} command 
 */
setup.runSugarCubeCommand = function (command) {
  // TODO: there's got to be a better way (... i hope)
  //       please don't judge me for this
  //       ...well, could be worse. believe me, it was...
  //       ...and now everyone can use this function without feeling guilty woo!
  new Wikifier(null, command)
}

/**
 * Runs a sugarcube command and get its output as a html string
 * @param {string} command 
 * @returns {string}
 */
setup.runSugarCubeCommandAndGetOutput = function (command) {
  // see comment for runSugarCubeCommand
  const fragment = document.createDocumentFragment()
  new Wikifier(fragment, command)
  return setup.DOM.toString(fragment)
}

/**
 * Works similarly to element.querySelector(...), but allows navigating up to parents
 * Path corresponds to a jQuery/CSS selector, prepended by zero or more '<' which mean 'go to parent node'
 * Also, paths starting with # are handled as absolute, so "#my_id" won't be searched under the element but on the whole document
 * @param {HTMLElement} element
 * @param {string} path
 */
setup.querySelectorRelative = function (element, path) {
  const matches = [...path.matchAll(/\s*\</g)]
  const selectorStart = matches.length ? matches[matches.length - 1].index + matches[matches.length - 1][0].length : 0
  const selector = path.substr(selectorStart).trim()

  for (let i = 0; i < matches.length && element; ++i) // navigate parents
    element = element.parentElement

  if (selector.length) {
    if (selector.startsWith("#")) { // treat as absolute
      element = document.querySelector(selector)
    } else if (element) {
      element = $(element).find(selector).get(0)
    }
  }

  return element || null
}

// Evals a path into a object
// Example usages:
//    evalJsPath(".somefield[1].someotherfield", obj)
//    evalJsPath("$statevariable.field[0]")
//    evalJsPath("$a", null, true, 5)    equiv to $a = 5. Use setup.evalJsPathAssign instead.
setup.evalJsPath = function (path, obj, assign, value) {
  //console.log("evalJsPath", path, obj, assign, value) // [DEBUG]
  const matches = [...path.matchAll(/(\.?[$\w_]+|\[\d+\])/g)]

  if (!obj && matches.length && matches[0][1].startsWith("$")) { // special case: Twine state member
    obj = State.variables
    matches[0][1] = matches[0][1].substr(1)
  }

  if (!obj && matches.length && matches[0][1].startsWith("_")) { // special case: Twine temporary variable
    obj = State.temporary
    matches[0][1] = matches[0][1].substr(1)
  }

  let last_match = null
  if (assign && matches.length)
    last_match = matches.pop()

  for (const match of matches) {
    let part = match[1]
    if (part.startsWith("[")) {
      if (!Array.isArray(obj))
        throw new Error(`Invalid JS path '${path}', expected array but found ${typeof obj}`)
      obj = obj[+part.substr(1, part.length - 2)]
    } else {
      obj = obj[part.startsWith(".") ? part.substr(1) : part]
    }
  }

  if (assign && last_match) {
    let part = last_match[1]
    if (part.startsWith("["))
      obj[+part.substr(1, part.length - 2)] = value
    else
      obj[part.startsWith(".") ? part.substr(1) : part] = value
  }

  return obj
}

// Same as evalJsPath, but instead of returning the value, assigns to it
// Example usages:
//    evalJsPathAssign(".somefield[1].someotherfield", obj, 42)
setup.evalJsPathAssign = function (path, obj, value) {
  return setup.evalJsPath(path, obj, true, value)
}

/**
 * Helper function to make using cost object that target unit easier.
 * Example: setup.qc.Corrupt('unit').apply(setup.costUnitHelper(unit))
 * @param {setup.Unit | null} unit
 * @param {string} [name]
 */
setup.costUnitHelper = function (unit, name) {
  const base = {
    getActorUnit: () => unit
  }
  if (name) {
    base.getName = () => name
  }
  return base
}


/**
 * Same as costUnitHelper, but can have multiple actors
 * @param {Object<string, setup.Unit>} actor_map
 * @param {string} [name]
 */
setup.costUnitHelperDict = function (actor_map, name) {
  const base = {
    getActorUnit: (actor_name) => actor_map[actor_name]
  }
  if (name) {
    base.getName = () => name
  }
  return base
}


/**
 * returns a deep copy of the object
 * @template A
 * @param {A} obj 
 * @returns {A}
 */
setup.deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}


/**
 * Get all possible permutation of x elements out of an array
 * @param {number} x 
 * @param {Array} arr 
 * @returns {Array<Array>}
 */
setup.allPermutations = function (x, arr) {
  if (x == 0) return [[],]
  if (x > arr.length) return []

  const res = []
  for (let i = 0; i < arr.length; ++i) {
    const tocopy = arr.filter(a => true)
    tocopy.splice(i, 1)
    for (const subper of setup.allPermutations(x - 1, tocopy)) {
      res.push([arr[i]].concat(subper))
    }
  }
  return res
}
