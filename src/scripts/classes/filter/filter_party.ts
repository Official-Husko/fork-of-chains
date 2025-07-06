// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

setup.MenuFilter._MENUS.party = {
  sort: {
    title: 'Sort',
    default: down('Obtained'),
    options: {
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
