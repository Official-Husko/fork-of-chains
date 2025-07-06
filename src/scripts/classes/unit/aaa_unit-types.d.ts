
// Declare augments to the Unit class, from other files
// (to make type checker aware of them, and not complain)
// TODO: find a more maintenable way to handle this...

interface SkillBreakdown {
  value: number,
  title: string,
}

declare namespace setup {
  interface Unit {
    // "unit_exp.js"
    getLevel(): number
    resetLevel(): void
    levelUp(levels?: number): void
    gainExp(amt: number): void
    getExp(): number
    getExpForNextLevel(): number
    getOnDutyExp(): number

    // "unit_getters.js"
    getName(): string
    getFirstName(): string
    getSurname(): string
    getFullName(): string
    getDuty(): setup.DutyInstance | null
    getTeam(): setup.Team | null
    getParty(): setup.Party | null
    getLover(): setup.Unit | null
    getBestFriend(): setup.Unit | null
    getQuest(): setup.QuestInstance | null
    getOpportunity(): setup.OpportunityInstance | null
    getEquipmentSet(): setup.EquipmentSet | null
    isPlayerSlaver(): boolean
    isYou(): boolean
    getUnitGroup()
    getCompany()
    isYourCompany(): boolean
    getJob()
    isSlaver(): boolean
    isSlave(): boolean
    isSlaveOrInSlaveMarket(): boolean
    isObedient(): boolean
    isCompliant(): boolean
    isMindbroken(): boolean
    isDefiant(): boolean
    isHasStrapOn(): boolean
    isHasDicklike(): boolean
    isHasDick(): boolean
    isInChastity(): boolean
    isHasVagina(): boolean
    isHasBreasts(): boolean
    isSubmissive(): boolean
    isDominant(): boolean
    isMasochistic(): boolean
    isDominantSlave(): boolean
    isInjured(): boolean
    isFurryBody(): boolean
    isHasTitle(title: setup.Title): boolean
    addTitle()
    getEquipmentAt(equipment_slot): setup.Equipment
    isNaked(): boolean
    getCustomImageName(): string | null
    getMarket(): setup.Market | null

    // "unit_history.js"
    history: any
    addHistory(history_text, quest): void
    getHistory()

    // "unit_image.js"
    getImageInfo(): ImageMetadata|undefined
    getImage(): string

    // "unit_money.js"
    getWage(): number
    getSlaverMarketValue(): number

    // "unit_rep.js"
    rep(): string
    repShort(): string
    repLong(): string

    // Bob of party 3
    repFull(): string

    repBusyState(show_duty_icon?: boolean): string
    repGender(): string
    busyInfo(show_duty_icon?: boolean, tooltip?: string)

    // "unit_rep.js"
    skill_focus_keys: number[]
    getSkillModifiers(is_base_only?): Skills
    getSkillAdditives(is_base_only?): Skills
    getSkillsBase(ignore_skill_boost?): Skills
    getSkillsAdd(is_base_only?): Skills
    getSkills(is_base_only?): Skills
    getSkill(skill)
    setSkillFocus(index, skill)
    getRandomSkillIncreases()
    getSkillFocuses(is_not_sort?)
    _increaseSkill(skill, amt)
    increaseSkills(skill_gains)
    initSkillFocuses()

    resetSkillCache()
    getSkillModifiersBreakdown(is_base_only?: boolean): Array<SkillBreakdown[]>
    getSkillsBaseBreakdown(ignore_skill_boost?: boolean): Array<SkillBreakdown[]>
    getSkillAdditivesBreakdown(is_base_only?: boolean): Array<SkillBreakdown[]>

    // "unit_tag.js"
    getTags(): string[]
    addTag(tag: string): void
    removeTag(tag: string): void
    isHasTag(tag: string): boolean

    // "unit_title.js"
    getTitle()

    getInnateTraits(): Array.<setup.Trait>
    getMissingInnateTraits(): Array.<setup.Trait>
    getNonInnateSkinTraits(): Array.<setup.Trait>
    makeInnateTrait(trait: setup.Trait | null, trait_group: setup.TraitGroup?)
    setInnateTraits(traits: Array.<setup.Trait>)
    resetInnateTraits()
    isHasInnateTrait(trait: setup.Trait)

    resetTraitMapCache()
    getExtraTraitMapCache(): Object<string, boolean>
    getTraitMapCache(): Object<string, boolean>
    getBaseTraitMapCache(): Object<string, boolean>

    _computeAllBaseTraits(): Array<setup.Trait>
    _computeAllTraits(): Array<setup.Trait>
    _computeAllExtraTraits(): Array<setup.Trait>

    addTrait(trait, trait_group?, is_replace?)
    decreaseTrait(trait_group: setup.TraitGroup)

    getTraits(): Array.<setup.Trait>
    getBaseTraits(): Array.<setup.Trait>
    getAllTraits(): Array.<setup.Trait>
    getExtraTraits(): Array.<setup.Trait>

    getRemovableTraits(): Array.<setup.Trait>
    getInheritableTraits(): Array.<setup.Trait>

    getTraitFromTraitGroup(trait_group)
    isHasAnyTraitExact(traits: Array<setup.Trait | string>): boolean
    isHasTrait(trait_raw, trait_group?, ignore_cover?): boolean
    isHasTraitExact(trait_raw)
    isHasTraitIncludeExtra(trait): boolean
    isHasTraitIncludeExtraExact(trait): boolean
    isHasRemovableTrait(trait: setup.Trait | string, include_cover?: boolean): boolean
    isHasTraitsExact(traits: setup.Trait[]): boolean
    removeTraitsWithTag(trait_tag)
    removeTraitExact(trait)
    isMale(): boolean
    isFemale(): boolean
    isSissy(): boolean
    isHasDick(): boolean
    isHasBalls(): boolean
    isHasVagina(): boolean
    getWings()
    getTail()
    getTailPlug(): setup.Equipment | null
    isHasTail(includes_tailplug?: boolean): boolean
    getTraitWithTag(tag): setup.Trait
    getAllTraitsWithTag(tag: string): Array.<setup.Trait>

    getRace(): setup.Trait
    getSubrace(): setup.Trait

    getGender(): setup.Trait
    _getPurifiable(trait_tag)
    isCanPurify(trait_tag)
    purify(trait_tag)
    corrupt(trait_tag?: string, is_return_anyways?: boolean): setup.Trait | null
    corruptPermanently(): setup.Trait | null
    getSpeech(): setup.Speech
    getSpeechChances()
    resetSpeech()
    recomputeSpeech()
    isCanPhysicallyTalk(): boolean
    isCanTalk(): boolean
    isCanPhysicallyWalk(): boolean
    isCanWalk(): boolean
    isCanPhysicallyOrgasm(): boolean
    isCanOrgasm(): boolean
    isDietCum(): boolean
    isDietMilk(): boolean

    isAllowedTalk(): boolean
    isAllowedWalk(): boolean
    isAllowedOrgasm(): boolean

    isCanPhysicallyCum(): boolean
    isCanSee(): boolean
    getDefaultWeapon(): setup.Equipment
    isTraitCompatible(trait: setup.Trait): boolean

    getOwnedBedchambers(): Array<setup.Bedchamber>
    getGenitalCovering(): setup.Equipment
    getChestCovering(): setup.Equipment

    getHomeland(): string
    getHomeCompany(): setup.Company
  }
}

