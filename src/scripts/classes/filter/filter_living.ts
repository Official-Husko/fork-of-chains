// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

setup.MenuFilter._MENUS.title = {
  sort: {
    title: 'Sort',
    default: 'Default',
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
    }
  },
}

