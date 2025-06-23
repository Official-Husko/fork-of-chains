
setup.CriteriaHelper = {}

setup.CriteriaHelper.CritTraits = function(traits, criteria) {
  // adds crit traits to the criteria.
  let newcriteria = setup.deepCopy(criteria)

  for (let i = 0; i < traits.length; ++i) {
    if (!traits[i]) throw new Error(`Missing ${i}-th trait for CritTrait`)
    newcriteria.crit_trait_map[traits[i].key] = true
  }

  return newcriteria
}

setup.CriteriaHelper.DisasterTraits = function(traits, criteria) {
  // adds disaster traits to the criteria.
  let newcriteria = setup.deepCopy(criteria)

  for (let i = 0; i < traits.length; ++i) {
    if (!traits[i]) throw new Error(`Missing ${i}-th trait for CritTrait`)
    newcriteria.disaster_trait_map[traits[i].key] = true
  }

  return newcriteria
}


setup.CriteriaHelper.Restrictions = function(restrictions, criteria) {
  // adds [restriction1, restriction2]
  let newcriteria = setup.deepCopy(criteria)

  for (let i = 0; i < restrictions.length; ++i) {
    if (!restrictions[i]) throw new Error(`Missing ${i}-th trait for CritTrait`)
    newcriteria.restrictions.push(restrictions[i])
  }

  return newcriteria
}

setup.CriteriaHelper.Name = function(name, criteria) {
  // adds [restriction1, restriction2]
  let newcriteria = setup.deepCopy(criteria)
  newcriteria.name = name

  return newcriteria
}
