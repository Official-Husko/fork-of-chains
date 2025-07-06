// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

/**
 * Not actually a filter, but rather a menu option for how you want to auto assign your equipment.
 */
setup.MenuFilter._MENUS.equipmentauto = {
  max: {
    title: '(Auto-Attach) Fill All',
    default: 'No',
    options: {
      yes: {
        title: 'Yes',
      }
    }
  },
  slutty: {
    title: '(Auto-Attach) Slutty',
    default: 'No',
    options: {
      yes: {
        title: 'Yes',
      }
    }
  },
  special: {
    title: '(Auto-Attach) Special',
    default: 'No',
    options: {
      yes: {
        title: 'Yes',
      }
    }
  },
}
