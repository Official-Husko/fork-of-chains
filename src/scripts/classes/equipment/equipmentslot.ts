// @ts-nocheck

// hack to make this into an importable module
export const EQUIPMENT_SLOT = 0

setup.EquipmentSlot = class EquipmentSlot extends setup.TwineClass {
  constructor(key, name) {
    super()

    this.key = key
    this.name = name

    if (key in setup.equipmentslot) throw new Error(`Equipment Slot ${key} already exists`)
    setup.equipmentslot[key] = this
  }

  getName() { return this.name }

  getImage() {
    return `img/equipmentslot/${this.key}.svg`
  }

  getImageRep() {
    const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage()))}" />`
    return `<span class='trait colorize-white' data-tooltip="${setup.capitalize(this.getName())}">${img}</span>`;
  }

  rep() {
    return this.getImageRep()
  }

}
