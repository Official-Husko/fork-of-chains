// @ts-nocheck

// schedules an event that will trigger in {weeks} weeks. 0 = will trigger same week.
setup.qcImpl.Event = class Event extends setup.Cost {
  /**
   * @param {setup.Event | string} template 
   * @param {number} weeks 
   * @param {Object<string, string>} default_assignment 
   * @param {boolean} [is_visible_in_calendar]
   */
  constructor(template, weeks, default_assignment, is_visible_in_calendar) {
    super()

    if (!template) throw new Error(`Missing event for Event`)

    this.template_key = setup.keyOrSelf(template)
    this.weeks = weeks
    if (default_assignment && typeof default_assignment !== 'object') {
      throw new Error(`Default assignment must be an object or null, not ${default_assignment}!`)
    }
    this.default_assignment = default_assignment
    this.is_visible_in_calendar = is_visible_in_calendar
  }

  text() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentTextHelper(this.default_assignment)
    return `setup.qc.Event('${this.template_key}', ${this.weeks}, ${assignment_text}, ${this.is_visible_in_calendar})`
  }

  apply(quest) {
    const template = setup.event[this.template_key]
    const default_assignment = setup.qcImpl.QuestDirect.getDefaultAssignment(
      this.default_assignment,
      quest
    )
    State.variables.eventpool.scheduleEvent(
      template,
      State.variables.calendar.getWeek() + this.weeks,
      default_assignment,
      this.is_visible_in_calendar,
    )
  }

  explain() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentExplainHelper(this.default_assignment)
    let template = setup.event[this.template_key]
    if (!template) throw new Error(`Event ${this.template_key} is missing`)
    let base = `In ${this.weeks} weeks, trigger event: ${template.getName()} ${assignment_text}`
    if (this.is_visible_in_calendar) {
    } else {
      base += ` (hidden from calendar)`
    }
    return base
  }
}
