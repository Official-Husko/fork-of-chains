// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

setup.MenuFilter._MENUS.dutytemplate = {
  sort: {
    title: 'Sort',
    default: 'Default',
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      type: {
        title: down('Type'),
        sort: (duty1, duty2) => duty1.getType().localeCompare(duty2.getType()),
      }
    }
  },
}

