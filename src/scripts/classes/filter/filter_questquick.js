import { up, down } from "./AAA_filter"
import { getJobFilters, getStatusFilters } from "./filter_unit"
import { MenuFilterHelper } from "./filterhelper"
import { } from "./filter_quest"

setup.MenuFilter._MENUS.questquick = {
  tag_region: setup.MenuFilter._MENUS.quest.tag_region,
  status: setup.MenuFilter._MENUS.quest.status,
  sort: setup.MenuFilter._MENUS.quest.sort,
}
