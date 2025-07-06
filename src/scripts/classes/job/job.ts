// @ts-nocheck

export const EXPORTABLE = true

setup.Job = class Job extends setup.TwineClass {
  constructor(key, name) {
    super()

    this.key = key
    this.name = name

    if (key in setup.job) throw new Error(`Job ${key} already exists`)
    setup.job[key] = this
  }

  getImage() {
    return `img/job/${this.key}.svg`
  }

  getImageRep() {
    return setup.repImgIcon(this.getImage(), this.getName())
  }

  rep() {
    return this.getImageRep()
  }

  /**
   * @returns {setup.Trait}
   */
  getTrait() {
    return setup.trait[`job_${this.key}`]
  }

  getName() { return this.name }

}

setup.Job_Cmp = function (job1, job2) {
  if (job1.name < job2.name) return -1
  if (job1.name > job2.name) return 1
  return 0
}
