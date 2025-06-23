/**
 * @param {boolean=} show_duty_icon 
 * @param {string} [tooltip]
 * @returns {{icon: string, title: string}}
 */
setup.Unit.prototype.busyInfo = function (show_duty_icon, tooltip) {
  let img
  let title
  if (this.getQuest()) {
    img = setup.Unit.BUSY_QUEST_URL
    title = 'on a quest'
  } else if (this.getOpportunity()) {
    img = setup.Unit.BUSY_OPPORTUNITY_URL
    title = 'on an opportunity'
  } else if (State.variables.leave.isOnLeave(this)) {
    img = setup.Unit.BUSY_LEAVE_URL
    title = 'on leave'
  } else if (this.isInjured()) {
    img = setup.Unit.BUSY_INJURY_URL
    title = 'injured'
  } else if (!this.isAvailable()) {
    // should not actually happen, but just in case
    img = setup.Unit.BUSY_OTHER_URL
    title = 'unknown'
  } else if (this.getDuty()) {
    title = 'on duty'
    if (show_duty_icon) {
      return {
        icon: this.getDuty().repIcon(),
        title: title,
      }
    } else {
      img = setup.Unit.BUSY_DUTY_URL
    }
  } else {
    img = setup.Unit.BUSY_IDLE_URL
    title = 'idle'
  }

  return {
    icon: setup.repImgIcon(img, tooltip),
    title: title,
  }
}

/**
 * @param {boolean=} show_duty_icon 
 * @returns {string}
 */
setup.Unit.prototype.repBusyState = function (show_duty_icon) {
  if (!this.isYourCompany()) return ''
  return this.busyInfo(show_duty_icon, `<<tooltipunitstatus '${this.key}'>>`).icon
}

// Same as rep, but doesn't include icons (just name + tooltip)
setup.Unit.prototype.repShort = function () {
  let color_class = ''
  if (State.variables.settings.inline_color) {
    if (this.isSlaver()) {
      color_class = ` rep-${this.getJob().key}-${this.isMale() ? 'male' : 'female'}`
    } else {
      color_class = ` rep-${this.getJob().key}`
    }
  }

  if (State.variables.settings.inline_font) {
    color_class += ` text-${this.getSubrace().key}`
  }

  // only show if either: (0. your unit, 1. in market, 2. contact, 3. retiree, 4. in debug mode)
  if (
    !State.variables.gDebug &&
    !this.isYourCompany() &&
    !this.getMarket() &&
    !this.getContact() &&
    !this.isRetired()
  ) {
    return `<span class="${color_class}">${this.getName()}</span>`
  } else {
    return (
      `<span data-tooltip="<<tooltipunit '${this.key}'>>" data-tooltip-wide>` +
      `<a class="replink${color_class}">${this.getName()}</a>` +
      `</span>`
    )
  }
}

// Same as rep and always include icons
setup.Unit.prototype.repLong = function () {
  const job = this.getJob()

  let text = '<span class="rep">'

  if (job == setup.job.slaver) {
    text += '<div class="icongrid">'
    text += this.repBusyState(/* show duty = */ false)
    const focuses = this.getSkillFocuses(State.variables.settings.unsortedskills)
    for (let i = 0; i < focuses.length; ++i) {
      text += focuses[i].rep()
    }
    text += '</div>'
  } else {
    text += this.repBusyState(/* show duty = */ true)
    text += job.rep()
  }

  text += this.repShort()

  if (State.variables.hospital.isInjured(this)) {
    text += setup.DOM.toString(setup.DOM.Card.injury(this))
  }

  return text + '</span>'
}

setup.Unit.prototype.rep = function () {
  if (!State.variables.settings.inline_icon) {
    return this.repShort()
  } else {
    return this.repLong()
  }
}


/**
 * @returns {string}
 */
setup.Unit.prototype.repGender = function () {
  if (this.isSissy()) return 'sissy'
  return this.getGender().getName()
}


/**
 * Bob of Party 3
 * @returns {string}
 */
setup.Unit.prototype.repFull = function () {
  let base = `${this.repLong()}`
  const party = this.getParty()
  if (party) {
    return `${base} of ${party.rep()}`
  } else {
    return base
  }
}
