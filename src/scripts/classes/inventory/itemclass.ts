// @ts-nocheck

  
setup.ItemClass = class ItemClass extends setup.TwineClass {
  constructor(key, name) {
    super()
    
    this.key = key
    this.name = name

    if (key in setup.itemclass) throw new Error(`Item Class ${key} already exists`)
    setup.itemclass[key] = this
  }

  getName() { return this.name }

  getImage() {
    return `img/itemclass/${this.key}.svg`
  }

  getImageRep() {
    return setup.repImgIcon(this.getImage())
  }

  rep() {
    return setup.repImgIcon(this.getImage(), this.getName())
  }
}
