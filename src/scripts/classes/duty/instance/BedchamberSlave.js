// for load order:
import { } from "../dutytemplate"

setup.DutyTemplateBedchamberSlave = class DutyTemplateBedchamberSlave extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'bedchamberslave',
      type: 'bedchamber',
      name: 'Bedchamber Slave',
      description_passage: 'DutyBedchamberSlave',
      unit_restrictions: [setup.qres.Job(setup.job.slave)],
    })
  }
}

/**
 * @type {setup.DutyTemplateBedchamberSlave}
 */
// @ts-ignore
setup.dutytemplate.bedchamberslave = () => new setup.DutyTemplateBedchamberSlave()

setup.DutyInstanceBedchamberSlave = class DutyInstanceBedchamberSlave extends setup.DutyInstance {
  /**
   * @param {{
   * bedchamber: setup.Bedchamber,
   * index: number,
   * }} args 
   */
  constructor({ bedchamber, index }) {
    super({ duty_template: setup.dutytemplate.bedchamberslave })
    this.bedchamber_key = bedchamber.key
    this.index = index
  }

  /**
   * @returns {setup.Bedchamber}
   */
  getBedchamber() {
    return State.variables.bedchamber[this.bedchamber_key]
  }

  /**
   * @returns {string}
   */
  getName() {
    return `Bedchamber slave for ${this.getBedchamber().getName()}`
  }
}
