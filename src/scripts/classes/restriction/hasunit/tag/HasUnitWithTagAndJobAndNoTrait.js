
setup.qresImpl.HasUnitWithTagAndJobAndNoTrait = class HasUnitWithTagAndJobAndNoTrait extends setup.Restriction {
  constructor(tag_name, job, trait) {
    super()

    this.job_key = job.key
    this.tag_name = tag_name
    this.trait_key = trait.key
  }

  text() {
    return `setup.qres.HasUnitWithTagAndJobAndNoTrait('${this.tag_name}', setup.job.${this.job_key}, setup.trait.${this.trait_key})`
  }

  explain() {
    let tagname = this.tag_name
    let trait = setup.trait[this.trait_key]
    return `Must have a unit with job: ${this.job_key} WITHOUT trait: ${trait.rep()} and HAVE tag/flag : "${tagname}"`
  }

  isOk() {
    let units = State.variables.company.player.getUnits({job: setup.job[this.job_key]})
    let trait = setup.trait[this.trait_key]
    for (let i = 0; i < units.length; ++i) {
      if (units[i].isHasTag(this.tag_name) && !units[i].isHasTrait(trait)) return true
    }
    return false
  }
}
