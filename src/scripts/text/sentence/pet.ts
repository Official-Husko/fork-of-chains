// @ts-nocheck


setup.Text.Pet = {}

// all while [xxx]
// examples:
// wagging their tail
// wagging their ass
/**
 * 
 * @param {setup.Unit} unit 
 */
setup.Text.Pet.rearwag = function (unit) {
  const tail = unit.getTail()
  const plug = unit.getTailPlug()

  let tailrep
  if (!tail && !plug) {
    tailrep = `a|ass`
  } else {
    tailrep = `a|ctail`
  }

  let t = [
    `wagging a|their ${tailrep} invitingly`,
    `cutely wagging a|their ${tailrep}`,
    `obediently swaying a|their ${tailrep} left and right like a pet dog`,
    `submissively swaying a|their ${tailrep} left and right like a good pet`,
  ]

  return setup.Text.replaceUnitMacros(t, { a: unit })
}


/**
 * 
 * @param {setup.Unit} unit 
 */
setup.Text.Pet.whine = function (unit) {
  let t
  if (unit.isCanPhysicallyTalk()) {
    t = [
      `(Whines)...`,
      `(Whimpers)...`,
      `Yelp...!`,
      `Yip...!`,
    ]
  } else {
    t = [
      `(Muffled whine)...`,
      `Mmph...?`,
      `Nnyh...?`,
      `Mrrlw...?`,
    ]
  }

  return setup.Text.replaceUnitMacros(t, { a: unit })
}

