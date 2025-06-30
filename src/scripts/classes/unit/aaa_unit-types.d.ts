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
    // @ts-ignore
    getDuty(): setup.DutyInstance | null
    // @ts-ignore
    getTeam(): setup.Team | null
    // @ts-ignore
    getParty(): setup.Party | null
    getLover(): setup.Unit | null
    getBestFriend(): setup.Unit | null
    // @ts-ignore
    getQuest(): setup.QuestInstance | null
    // @ts-ignore
    getOpportunity(): setup.OpportunityInstance | null
    // @ts-ignore
    getEquipmentSet(): setup.EquipmentSet | null
    isPlayerSlaver(): boolean
    isYou(): boolean
    // @ts-ignore
    getUnitGroup()
    // @ts-ignore
    getCompany()
    isYourCompany(): boolean
    // @ts-ignore
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
    // @ts-ignore
    isHasTitle(title: setup.Title): boolean
    // @ts-ignore
    addTitle()
    // @ts-ignore
    getEquipmentAt(equipment_slot): setup.Equipment
    isNaked(): boolean
    getCustomImageName(): string | null
    // @ts-ignore
    getMarket(): setup.Market | null

    // "unit_history.js"
    history: any
    // @ts-ignore
    addHistory(history_text, quest): void
    // @ts-ignore
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
    // @ts-ignore
    busyInfo(show_duty_icon?: boolean, tooltip?: string)

    // "unit_rep.js"
    skill_focus_keys: number[]
    // @ts-ignore
    getSkillModifiers(is_base_only?): Skills
    // @ts-ignore
    getSkillAdditives(is_base_only?): Skills
    // @ts-ignore
    getSkillsBase(ignore_skill_boost?): Skills
    // @ts-ignore
    getSkillsAdd(is_base_only?): Skills
    // @ts-ignore
    getSkills(is_base_only?): Skills
    // @ts-ignore
    getSkill(skill)
    // @ts-ignore
    setSkillFocus(index, skill)
    // @ts-ignore
    getRandomSkillIncreases()
    // @ts-ignore
    getSkillFocuses(is_not_sort?)
    // @ts-ignore
    _increaseSkill(skill, amt)
    // @ts-ignore
    increaseSkills(skill_gains)
    // @ts-ignore
    initSkillFocuses()

    // @ts-ignore
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
    // @ts-ignore
    getTitle()

    // @ts-ignore
    getInnateTraits(): Array.<setup.Trait>
    // @ts-ignore
    getMissingInnateTraits(): Array.<setup.Trait>
    // @ts-ignore
    getNonInnateSkinTraits(): Array.<setup.Trait>
    // @ts-ignore
    makeInnateTrait(trait: setup.Trait | null, trait_group: setup.TraitGroup?)
    // @ts-ignore
    setInnateTraits(traits: Array.<setup.Trait>)
    // @ts-ignore
    resetInnateTraits()
    // @ts-ignore
    isHasInnateTrait(trait: setup.Trait)

    // @ts-ignore
    resetTraitMapCache()
    // @ts-ignore
    getExtraTraitMapCache(): Object<string, boolean>
    // @ts-ignore
    getTraitMapCache(): Object<string, boolean>
    // @ts-ignore
    getBaseTraitMapCache(): Object<string, boolean>

    // @ts-ignore
    _computeAllBaseTraits(): Array<setup.Trait>
    // @ts-ignore
    _computeAllTraits(): Array<setup.Trait>
    // @ts-ignore
    _computeAllExtraTraits(): Array<setup.Trait>

    // @ts-ignore
    addTrait(trait, trait_group?, is_replace?)
    // @ts-ignore
    decreaseTrait(trait_group: setup.TraitGroup)

    // @ts-ignore
    getTraits(): Array.<setup.Trait>
    // @ts-ignore
    getBaseTraits(): Array.<setup.Trait>
    // @ts-ignore
    getAllTraits(): Array.<setup.Trait>
    // @ts-ignore
    getExtraTraits(): Array.<setup.Trait>

    // @ts-ignore
    getRemovableTraits(): Array.<setup.Trait>
    // @ts-ignore
    getInheritableTraits(): Array.<setup.Trait>

    // @ts-ignore
    getTraitFromTraitGroup(trait_group)
    // @ts-ignore
    isHasAnyTraitExact(traits: Array<setup.Trait | string>): boolean
    // @ts-ignore
    isHasTrait(trait_raw, trait_group?, ignore_cover?): boolean
    // @ts-ignore
    isHasTraitExact(trait_raw)
    // @ts-ignore
    isHasTraitIncludeExtra(trait): boolean
    // @ts-ignore
    isHasTraitIncludeExtraExact(trait): boolean
    // @ts-ignore
    isHasRemovableTrait(trait: setup.Trait | string, include_cover?: boolean): boolean
    // @ts-ignore
    isHasTraitsExact(traits: setup.Trait[]): boolean
    // @ts-ignore
    removeTraitsWithTag(trait_tag)
    // @ts-ignore
    removeTraitExact(trait)
    // @ts-ignore
    isMale(): boolean
    // @ts-ignore
    isFemale(): boolean
    // @ts-ignore
    isSissy(): boolean
    // @ts-ignore
    isHasDick(): boolean
    // @ts-ignore
    isHasBalls(): boolean
    // @ts-ignore
    isHasVagina(): boolean
    // @ts-ignore
    getWings()
    // @ts-ignore
    getTail()
    // @ts-ignore
    getTailPlug(): setup.Equipment | null
    // @ts-ignore
    isHasTail(includes_tailplug?: boolean): boolean
    // @ts-ignore
    getTraitWithTag(tag): setup.Trait
    // @ts-ignore
    getAllTraitsWithTag(tag: string): Array.<setup.Trait>

    // @ts-ignore
    getRace(): setup.Trait
    // @ts-ignore
    getSubrace(): setup.Trait

    // @ts-ignore
    getGender(): setup.Trait
    // @ts-ignore
    _getPurifiable(trait_tag)
    // @ts-ignore
    isCanPurify(trait_tag)
    // @ts-ignore
    purify(trait_tag)
    // @ts-ignore
    corrupt(trait_tag?: string, is_return_anyways?: boolean): setup.Trait | null
    // @ts-ignore
    corruptPermanently(): setup.Trait | null
    // @ts-ignore
    getSpeech(): setup.Speech
    // @ts-ignore
    getSpeechChances()
    // @ts-ignore
    resetSpeech()
    // @ts-ignore
    recomputeSpeech()
    // @ts-ignore
    isCanPhysicallyTalk(): boolean
    // @ts-ignore
    isCanTalk(): boolean
    // @ts-ignore
    isCanPhysicallyWalk(): boolean
    // @ts-ignore
    isCanWalk(): boolean
    // @ts-ignore
    isCanPhysicallyOrgasm(): boolean
    // @ts-ignore
    isCanOrgasm(): boolean
    // @ts-ignore
    isDietCum(): boolean
    // @ts-ignore
    isDietMilk(): boolean

    // @ts-ignore
    isAllowedTalk(): boolean
    // @ts-ignore
    isAllowedWalk(): boolean
    // @ts-ignore
    isAllowedOrgasm(): boolean

    // @ts-ignore
    isCanPhysicallyCum(): boolean
    // @ts-ignore
    isCanSee(): boolean
    // @ts-ignore
    getDefaultWeapon(): setup.Equipment
    // @ts-ignore
    isTraitCompatible(trait: setup.Trait): boolean

    // @ts-ignore
    getOwnedBedchambers(): Array<setup.Bedchamber>
    // @ts-ignore
    getGenitalCovering(): setup.Equipment
    // @ts-ignore
    getChestCovering(): setup.Equipment

    // @ts-ignore
    getHomeland(): string
    // @ts-ignore
    getHomeCompany(): setup.Company
  }
}

