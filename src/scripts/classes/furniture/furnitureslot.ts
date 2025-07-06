// @ts-nocheck

// hack to make this into an importable module
export const FURNITURE_SLOT = 0

setup.FurnitureSlot = class FurnitureSlot extends setup.TwineClass {
  constructor(key, name) {
    super()

    this.key = key
    this.name = name

    if (key in setup.furnitureslot) throw new Error(`Furniture Slot ${key} already exists`)
    setup.furnitureslot[key] = this
  }

  getName() { return this.name }

  getImage() {
    return `img/furnitureslot/${this.key}.svg`
  }

  getImageRep() {
    const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage()))}" />`
    return `<span class='trait colorize-white' data-tooltip="${setup.capitalize(this.getName())}">${img}</span>`;
  }

  rep() {
    return this.getImageRep()
  }

  /**
   * @returns {setup.Furniture}
   */
  getBasicFurniture() {
    const key = `f_${this.key}_none`
    // @ts-ignore
    return setup.item[key]
  }
}
