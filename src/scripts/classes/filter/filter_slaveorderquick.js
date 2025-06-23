import { up, down } from "./AAA_filter"
import { getJobFilters, getStatusFilters } from "./filter_unit"
import { MenuFilterHelper } from "./filterhelper"
import { } from "./filter_slaveorder"

setup.MenuFilter._MENUS.slaveorderquick = {
  sort: setup.MenuFilter._MENUS.slaveorder.sort,
}
