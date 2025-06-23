import { up, down } from "./AAA_filter"
import { getJobFilters, getStatusFilters } from "./filter_unit"
import { MenuFilterHelper } from "./filterhelper"
import { } from "./filter_unit"

setup.MenuFilter._MENUS.unitquick = {
  job: setup.MenuFilter._MENUS.unit.job,
  status: setup.MenuFilter._MENUS.unit.status,
  sort: Object.assign({}, setup.MenuFilter._MENUS.unit.sort),
}

delete setup.MenuFilter._MENUS.unitquick.sort.resets
