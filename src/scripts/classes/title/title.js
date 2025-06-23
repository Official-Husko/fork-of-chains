
setup.Title = class Title extends setup.TwineClass {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string} description 
   * @param {string} unit_text 
   * @param {number} slave_value 
   * @param {Object<string, number>} skill_adds 
   * @param {{
   *   is_negative?: boolean,
   * }} [args]
   */
  constructor(key, name, description, unit_text, slave_value, skill_adds, args) {
    super()

    if (!args) {
      args = {}
    }

    if (!key) throw new Error(`null key for title`)
    this.key = key

    if (!name) throw new Error(`null name for title ${key}`)
    this.name = name

    if (!description) throw new Error(`null name for title ${key}`)
    this.description = description

    // unit text can be null. In which case it'll be hidden.
    this.unit_text = unit_text

    this.slave_value = slave_value
    this.skill_adds = setup.Skill.translate(skill_adds)

    this.is_negative = !!args.is_negative

    if (key in setup.title) throw new Error(`Title ${key} duplicated`)
    setup.title[key] = this
  }

  toText() {
    let base = `new setup.Title(\n`
    base += `"${setup.escapeJsString(this.key)}",  """/* key */"""\n`
    base += `"${setup.escapeJsString(this.name)}",  """/* name */"""\n`
    base += `"${setup.escapeTwine(setup.escapeJsString(this.description))}",  """/* description */"""\n`
    if (this.unit_text) {
      base += `"${setup.escapeTwine(setup.escapeJsString(this.unit_text))}",  """/* unit text */"""\n`
    } else {
      base += `null,  """/* unit text */"""\n`
    }
    base += `${this.slave_value},  """/* slave value */"""\n`
    base += `{   """/* skill additives */"""\n`

    let skill_adds = this.getSkillAdds()
    for (let i = 0; i < skill_adds.length; ++i) {
      let val = skill_adds[i]
      if (val) {
        base += `&nbsp;${setup.skill[i].keyword}: ${val},`
      }
    }

    base += `},\n`
    base += `{\n`
    base += `&nbsp;is_negative: ${this.isNegative()},\n`
    base += `},\n`
    base += `)\n`
    return base
  }

  isNegative() {
    return this.is_negative
  }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {string}
   */
  getDescription() { return this.description }

  /**
   * @param {setup.Unit} [unit]
   * @returns {string}
   */
  getUnitText(unit) {
    if (unit) {
      return setup.Text.replaceUnitMacros(this.unit_text, { a: unit })
    } else {
      return this.unit_text
    }
  }

  getSlaveValue() { return this.slave_value }

  getSkillAdds() { return this.skill_adds }

  /**
   * @returns {string}
   */
  rep() {
    let base = setup.repMessage(this, 'titlecardkey')
    return `<span class="titlecardmini${this.isNegative() ? '-negative' : ''}">${base}</span>`
  }

}
