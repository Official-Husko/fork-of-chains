// @ts-nocheck

import { getMasterNickname } from "./greeting"

setup.Text.Slave = {}

/**
 * Yes, master
 * 
 * @param {{
 * unit: setup.Unit,
 * target: setup.Unit,
 * }} args
 * @returns {string}
 */
setup.Text.Slave.yesmaster = function ({
  unit,
  target,
}) {
  const title = getMasterNickname(unit, target)

  const options = []
  if (unit.isObedient()) {
    options.push(
      `Yes, ${title}.`,
      `I live to serve, ${title}.`,
      `As you ordered, ${title}.`,
      `I am your slave, ${title}.`,
      `At once, ${title}.`,
    )
  } else {
    options.push(
      `Yes, ${title}...`,
      `I will obey, ${title}...`,
      `Y-yes, ${title}...`,
      `...y-Yes, ${title}.`,
      `Have mercy please, ${title}...`,
    )
  }

  return setup.Text.replaceUnitMacros(options, { a: unit, b: target })
}
