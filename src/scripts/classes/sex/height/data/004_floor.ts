// @ts-nocheck

setup.SexHeightClass.Floor = class Floor extends setup.SexHeight {
  constructor() {
    super(
      'floor',
      /* height = */ 0,
    )
  }

  getNextHigherHeight() { return setup.sexheight.low }

  repHeightLevel() {
    return 'floor'
  } 
}

setup.sexheight.floor = new setup.SexHeightClass.Floor()
