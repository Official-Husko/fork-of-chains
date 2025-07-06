// @ts-nocheck

setup.SexHeightClass.Medium = class Medium extends setup.SexHeight {
  constructor() {
    super(
      'medium',
      /* height = */ 2,
    )
  }

  getNextHigherHeight() { return setup.sexheight.high }

  repHeightLevel() {
    return 'waist'
  } 
}

setup.sexheight.medium = new setup.SexHeightClass.Medium()
