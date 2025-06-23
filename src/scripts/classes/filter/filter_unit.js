import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

export const IMPORTABLE = true

function getUnitPartyFilter(party_key) {
  return unit => unit.getParty()?.key == party_key
}

function getUnitParties() {
  const base = {}
  for (const party of State.variables.partylist.getParties()) {
    base[party.key] = {
      title: party.getName(),
      filter: getUnitPartyFilter(party.key),
    }
  }
  base['no_party'] = {
    title: 'No Party',
    filter: unit => !unit.getParty(),
  }
  return base
}

function getUnitSkillSort(skill_key) {
  return (a, b) => b.getSkill(setup.skill[skill_key]) - a.getSkill(setup.skill[skill_key])
}

function getUnitSkillsSort() {
  const base = {
  }

  for (const skill of setup.skill) {
    base[skill.keyword] = {
      title: skill.getImageRep(),
      sort: getUnitSkillSort(skill.key),
    }
  }
  return base
}

function getJobFilter(job_key) {
  return unit => unit.getJob().key == job_key
}

export function getJobFilters() {
  return () => {
    const base = {}
    for (const job_key in setup.job) {
      base[job_key] = {
        title: setup.job[job_key].rep(),
        filter: getJobFilter(job_key),
      }
    }
    return base
  }
}


function getTraitFilter(trait_key) {
  return unit => unit.isHasTrait(setup.trait[trait_key])
}

function getTraitFilters(tag) {
  return () => {
    const base = {}
    for (const trait of Object.values(setup.trait)) {
      if (trait.getTags().includes(tag)) {
        base[trait.key] = {
          title: trait.rep(),
          filter: getTraitFilter(trait.key),
        }
      }
    }
    return base
  }
}


export function getStatusFilters() {
  const filter_data = {
    idle: {
      img: setup.Unit.BUSY_IDLE_URL,
      tooltip: 'Idle',
      filter: unit => !unit.isBusy(),
    },
    duty: {
      img: setup.Unit.BUSY_DUTY_URL,
      tooltip: 'On duty',
      filter: unit => unit.getDuty(),
    },
    busy: {
      img: setup.Unit.BUSY_OTHER_URL,
      tooltip: 'Not available',
      filter: unit => !unit.isAvailable(),
    },
    quest: {
      img: setup.Unit.BUSY_QUEST_URL,
      tooltip: 'On a quest / opportunity',
      filter: unit => unit.getQuest() || unit.getOpportunity(),
    },
    leave: {
      img: setup.Unit.BUSY_LEAVE_URL,
      tooltip: 'On leave',
      filter: unit => State.variables.leave.isOnLeave(unit),
    },
    injured: {
      img: setup.Unit.BUSY_INJURY_URL,
      tooltip: 'Injured',
      filter: unit => unit.isInjured(),
    },
  }
  const result = {}
  for (const filter_key in filter_data) {
    const filter_obj = filter_data[filter_key]
    result[filter_key] = {
      title: setup.repImgIcon(filter_obj.img, filter_obj.tooltip),
      filter: filter_obj.filter,
    }
  }
  return result
}


setup.MenuFilter._MENUS.unit = {
  job: {
    title: 'Job',
    icon_menu: true,
    options: getJobFilters(),
  },
  gender: {
    title: 'Gender',
    icon_menu: true,
    options: getTraitFilters('gender'),
  },
  /*
  race: {
    title: 'Race',
    default: 'All',
    icon_menu: true,
    options: getTraitFilters('subrace'),
  },
  */
  party: {
    title: 'Party',
    default: 'All',
    options: getUnitParties,
  },
  status: {
    title: 'Status',
    default: 'All',
    options: getStatusFilters,
  },
  traits: {
    title: 'Traits',
    trait_menu: true,
  },
  display: {
    title: 'Display',
    default: 'Full',
    hardreload: true,
    options: {
      compact: {
        title: 'Compact',
      }
    }
  },
  sort: {
    title: 'Sort',
    default: 'Default',
    resets: ['sortskill'],
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      race: {
        title: down('Race'),
        sort: (a, b) => setup.Trait_Cmp(a.getSubrace(), b.getSubrace()),
      },
      leveldown: MenuFilterHelper.leveldown,
      levelup: MenuFilterHelper.levelup,
      joindown: MenuFilterHelper.joindown,
      joinup: MenuFilterHelper.joinup,
      slavevaluedown: MenuFilterHelper.slavevaluedown,
      slavevalueup: MenuFilterHelper.slavevalueup,
      party: {
        title: down('Party'),
        sort: (a, b) => setup.Party.Cmp(a.getParty(), b.getParty()),
      },
    }
  },
  sortskill: {
    title: 'Skill',
    default: 'None',
    resets: ['sort'],
    options: getUnitSkillsSort,
  },
}

setup.MenuFilter._MENUS.unitslave = setup.MenuFilter._MENUS.unit
setup.MenuFilter._MENUS.unitslaver = setup.MenuFilter._MENUS.unit
setup.MenuFilter._MENUS.unitequipmentset = setup.MenuFilter._MENUS.unit

setup.MenuFilter._MENUS.unitnewgameplus = {}
for (const key in setup.MenuFilter._MENUS.unit) {
  const obj = setup.MenuFilter._MENUS.unit[key]
  if (!obj.hardreload) {
    setup.MenuFilter._MENUS.unitnewgameplus[key] = obj
  }
}

setup.MenuFilter._MENUS.unitmarket = Object.assign({}, setup.MenuFilter._MENUS.unit)
setup.MenuFilter._MENUS.unitmarket.sort = Object.assign({}, setup.MenuFilter._MENUS.unit.sort)
setup.MenuFilter._MENUS.unitmarket.sort.options = Object.assign({}, setup.MenuFilter._MENUS.unit.sort.options)

delete setup.MenuFilter._MENUS.unitmarket.team
delete setup.MenuFilter._MENUS.unitmarket.status
delete setup.MenuFilter._MENUS.unitmarket.display
delete setup.MenuFilter._MENUS.unitmarket.sort.options.joindown
delete setup.MenuFilter._MENUS.unitmarket.sort.options.joinup
delete setup.MenuFilter._MENUS.unitmarket.sort.options.leveldown
delete setup.MenuFilter._MENUS.unitmarket.sort.options.levelup
setup.MenuFilter._MENUS.unitmarket.sort.options.raritydown = MenuFilterHelper.raritydown
setup.MenuFilter._MENUS.unitmarket.sort.options.rarityup = MenuFilterHelper.rarityup

setup.MenuFilter._MENUS.unitmarket['display'] = {
  title: 'Display',
  default: 'Full',
  hardreload: true,
  // @ts-ignore
  options: {
    compact: {
      title: 'Compact',
    },
  }
}

setup.MenuFilter._MENUS.unitmarket.rarity = {
  title: 'Rarity',
  default: 'All',
  icon_menu: true,
  options: MenuFilterHelper.rarityFilters,
}

setup.MenuFilter._MENUS.unitduty = Object.assign({}, setup.MenuFilter._MENUS.unit)
setup.MenuFilter._MENUS.unitduty.sort = Object.assign({}, setup.MenuFilter._MENUS.unit.sort)
setup.MenuFilter._MENUS.unitduty.sort.options = Object.assign({}, setup.MenuFilter._MENUS.unit.sort.options)
setup.MenuFilter._MENUS.unitduty.sort.options.triggerdown = {
  title: up('Trigger / Prestige'),
  sort: (a, b) => {
    // @ts-ignore
    const duty = State.variables.duty[State.variables.gDuty_key]
    return duty.getTemplate().computeChanceForUnit(b) - duty.getTemplate().computeChanceForUnit(a)
  },
}

setup.MenuFilter._MENUS.unitso = Object.assign({}, setup.MenuFilter._MENUS.unit)
setup.MenuFilter._MENUS.unitso.sort = Object.assign({}, setup.MenuFilter._MENUS.unit.sort)
setup.MenuFilter._MENUS.unitso.sort.options = Object.assign({}, setup.MenuFilter._MENUS.unit.sort.options)
setup.MenuFilter._MENUS.unitso.sort.options.pricedown = {
  title: down('Price'),
  sort: (a, b) => {
    // @ts-ignore
    const so = State.variables.slaveorder[State.variables.gSlaveOrder_key]
    return so.getFulfillPrice(a) - so.getFulfillPrice(b)
  },
}
setup.MenuFilter._MENUS.unitso.sort.options.priceup = {
  title: up('Price'),
  sort: (a, b) => {
    // @ts-ignore
    const so = State.variables.slaveorder[State.variables.gSlaveOrder_key]
    return so.getFulfillPrice(b) - so.getFulfillPrice(a)
  },
}

setup.MenuFilter._MENUS.unitquest = Object.assign({}, setup.MenuFilter._MENUS.unit)

delete setup.MenuFilter._MENUS.unitquest.display

setup.MenuFilter._MENUS.unitquest.sort = Object.assign({}, setup.MenuFilter._MENUS.unit.sort)

setup.MenuFilter._MENUS.unitquest.sort.resets = ['sortskill', 'sortscore']

setup.MenuFilter._MENUS.unitquest.sortskill = Object.assign({}, setup.MenuFilter._MENUS.unit.sortskill)

setup.MenuFilter._MENUS.unitquest.sortskill.resets = ['sort', 'sortscore']

/*
Sorting from this is hardcoded in the corresponding menu, due to needing the quest as parameter.
*/
setup.MenuFilter._MENUS.unitquest.sortscore = {
  title: 'Score',
  default: 'Overall',
  resets: ['sort', 'sortskill',],
  hardreload: true,
  options: {
    crit: {
      title: up('Critical'),
    },
    success: {
      title: up('Success+'),
    },
    failure: {
      title: up('Failure+'),
    },
  },
}

setup.MenuFilter._MENUS.unitretired = Object.assign({}, setup.MenuFilter._MENUS.unit)

delete setup.MenuFilter._MENUS.unitretired.party
delete setup.MenuFilter._MENUS.unitretired.status
