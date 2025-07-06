// @ts-nocheck

// class methods
/**
 * @param {setup.Unit} unit1 
 * @param {setup.Unit} unit2 
 * @returns {number}
 */
setup.Unit_CmpDefault = function (unit1, unit2) {
  const result = setup.Job_Cmp(unit1.getJob(), unit2.getJob())
  if (result != 0) return result

  if (unit1.getName() < unit2.getName()) return -1
  if (unit1.getName() > unit2.getName()) return 1

  return 0
}

// class methods
/**
 * @param {setup.Unit} unit1 
 * @param {setup.Unit} unit2 
 * @returns {number}
 */
setup.Unit_CmpName = function (unit1, unit2) {
  if (unit1.getName() < unit2.getName()) return -1
  if (unit1.getName() > unit2.getName()) return 1
  return setup.Unit_CmpDefault(unit1, unit2)
}

// class methods
/**
 * @param {setup.Unit} unit1 
 * @param {setup.Unit} unit2 
 * @returns {number}
 */
setup.Unit_CmpJob = function (unit1, unit2) {
  const result = setup.Job_Cmp(unit1.getJob(), unit2.getJob())
  if (result) return result
  return setup.Unit_CmpDefault(unit1, unit2)
}

