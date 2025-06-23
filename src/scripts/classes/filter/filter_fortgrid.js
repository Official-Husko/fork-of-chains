import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

/* Not actually a filter, but just for storing fort grid options */
setup.MenuFilter._MENUS.fortgrid = {
  zoom: {
    title: 'Zoom',
    default: '1x',
    options: {
      zoom0_25: {
        title: '0.25x',
      },
      zoom0_5: {
        title: '0.5x',
      },
      zoom0_75: {
        title: '0.75x',
      },
      zoom1_25: {
        title: '1.25x',
      },
      zoom1_5: {
        title: '1.5x',
      },
      zoom1_75: {
        title: '1.75x',
      },
      zoom2: {
        title: '2x',
      },
      zoom2_5: {
        title: '2.5x',
      },
      zoom3: {
        title: '3x',
      },
      zoom4: {
        title: '4x',
      },
    },
  },
  show_caption: {
    title: 'Show room name',
    default: 'Show',
    options: {
      hide: {
        title: 'Hide',
      },
    },
  },
  show_tooltip: {
    title: 'Show tooltips',
    default: 'Show',
    options: {
      hide: {
        title: 'Hide',
      },
    },
  },
  show_skills: {
    title: 'Show skills',
    default: 'Show',
    options: {
      hide: {
        title: 'Hide',
      },
    },
  },
  show_activities: {
    title: 'Show unit activities',
    default: 'Show',
    options: {
      hide: {
        title: 'Hide',
      },
    },
  },
}

