
setup.qresImpl.CanPurify = class CanPurify extends setup.Restriction {
  constructor(trait_tag) {
    super()

    this.trait_tag = trait_tag
  }

  text() {
    return `setup.qres.CanPurify(${this.trait_tag})`
  }

  explain() {
    return `Unit can be purified in: ${this.trait_tag || "anything"}`
  }

  isOk(unit) {
    return unit.isCanPurify(this.trait_tag)
  }
}
