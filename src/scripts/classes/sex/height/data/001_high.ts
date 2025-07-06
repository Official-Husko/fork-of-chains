// @ts-nocheck

setup.SexHeightClass.High = class High extends setup.SexHeight {
  constructor() {
    super(
      'high',
      /* height = */ 3,
    )
  }

  getNextHigherHeight() { return setup.sexheight.veryhigh }

  repHeightLevel() {
    return 'head'
  } 
}

setup.sexheight.high = new setup.SexHeightClass.High()
