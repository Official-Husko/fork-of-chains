import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

/**
 * @param {setup.Company} company 
 * @returns {Function}
 */
function slaveOrderFilter(company) {
  return (slave_order) => slave_order.getSourceCompany() == company
}

function getSourceCompanyFilter() {
  const orders_sources = State.variables.slaveorderlist.getSlaveOrders().map(order => order.getSourceCompany())
  return Object.values(State.variables.company).filter(company => orders_sources.includes(company)).map(
    company => {
      return {
        title: company.rep(),
        filter: slaveOrderFilter(company),
      }
    }
  )
}

setup.MenuFilter._MENUS.slaveorder = {
  source: {
    title: 'Source',
    default: 'All',
    options: getSourceCompanyFilter,
  },
  ignored: {
    title: 'Ignored',
    default: 'Hide',
    default_filter: slave_order => !slave_order.isIgnored(),
    options: {
      show: {
        title: 'Show',
      },
      ignoredonly: {
        title: 'Ignored only',
        filter: slave_order => slave_order.isIgnored(),
      },
    },
  },
  sort: {
    title: 'Sort',
    default: down('Obtained'),
    options: {
      obtainedup: {
        title: up('Obtained'),
        sort: (a, b) => b.key - a.key,
      },
      expiresdown: {
        title: down('Expires'),
        sort: (a, b) => a.getExpiresIn() - b.getExpiresIn(),
      },
      expiresup : {
        title: up('Expires'),
        sort: (a, b) => b.getExpiresIn() - a.getExpiresIn(),
      },
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
    }
  },
  display: {
    title: 'Display',
    default: 'Full',
    hardreload: true,
    options: {
      compact: {
        title: 'Compact',
      },
    },
  },
}
