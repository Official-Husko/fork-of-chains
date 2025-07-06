// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

/* Not actually a filter, but just for storing quest team assignment type */
setup.MenuFilter._MENUS.questassign = {
  score: {
    title: '<i class="sfa sfa-cog"></i>',
    default: 'Default',
    hardreload: true,
    options: {
      crit: {
        title: 'Max. Critical',
      },
      /*
      success: {
        title: 'Max. Success+',
      },
      */
      failure: {
        title: 'Min. Disaster',
      },
    },
  },
}

