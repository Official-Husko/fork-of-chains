// @ts-nocheck

import {DungeonsLocationBase} from "./dungeons_floor"

setup.SexLocationClass.DungeonsBench = class DungeonsBench extends DungeonsLocationBase {
  constructor() {
    super(
      'dungeonsbench',
      [  /* tags  */
      ],
      'Dungeons (bench)',
      'The worn-out bench in a dungeons cell',
    )
  }

  isHigh() {
    return true
  }

  /**
   * A sentence for starting a sex here.
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawRepStart(sex) {
    return [
      `a|They a|descend to the dungeons, before finding an cell with a single bench perfect for some action.`,
      `After going through the dungeons cell, a|rep a|find an empty cell with a dusty old bench.`,
      `The dungeons might not be the cleanest place in your fort, but it should suffice for the kind of actions a|rep a|have in mind today.`,
    ]
  }
}

setup.sexlocation.dungeonsbench = new setup.SexLocationClass.DungeonsBench()
