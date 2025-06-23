
setup.qcImpl.Nothing = class Nothing extends setup.Cost {
  constructor() {
    super()

  }

  text() {
    return 'setup.qc.Nothing()'
  }

  isOk() {
    throw new Error(`Nothing not a cost`)
  }

  apply(quest) {
  }

  undoApply() {
  }

  explain() {
    return `Nothing happened.`
  }
}
