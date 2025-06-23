

// Type for 'setup' global (SugarCube.setup)
// declare stuff that is defined in the .twee files (hence not detected)
declare namespace setup {
  let INFINITY: number
  let INIT_DONE: boolean
  let VERSION: `${number}.${number}.${number}.${number}`

  let skill: Registry<typeof setup.Skill> & Array<InstanceType<typeof setup.Skill>>

  let activitytemplate: Registry<typeof setup.Activity>
  let buildingtemplate: Registry<typeof setup.BuildingTemplate>
  let companytemplate: Registry<typeof setup.CompanyTemplate>
  let contacttemplate: Registry<typeof setup.ContactTemplate>
  let qu: Registry<typeof setup.UnitCriteria>
  let equipment: Registry<typeof setup.Equipment>
  let equipmentpool: Registry<typeof setup.EquipmentPool>
  let event: Registry<typeof setup.Event>
  let familyrelation: Registry<typeof setup.FamilyRelation>
  let qdiff: Registry<typeof setup.QuestDifficulty>
  let title: Registry<typeof setup.Title>
  let interaction: Registry<typeof setup.Interaction>
  let interactionpool: Registry<typeof setup.InteractionPool>
  let item: Registry<typeof setup.Item>
  let itempool: Registry<typeof setup.ItemPool>
  let itemclass: Registry<typeof setup.ItemClass>
  let lore: Registry<typeof setup.Lore>
  let opportunitytemplate: Registry<typeof setup.OpportunityTemplate>
  let questpool: Registry<typeof setup.QuestPool>
  let questtemplate: Registry<typeof setup.QuestTemplate>
  let roomtemplate: Registry<typeof setup.RoomTemplate>
  let sexaction: Registry<typeof setup.SexAction>
  let sexbodypart: Registry<typeof setup.SexBodypart>
  let sexfacing: Registry<typeof setup.SexFacing>
  let sexheight: Registry<typeof setup.SexHeight>
  let sexgoal: Registry<typeof setup.SexGoal>
  let sexlocation: Registry<typeof setup.SexLocation>
  let sexpace: Registry<typeof setup.SexPace>
  let sexpermission: Registry<typeof setup.SexPermission>
  let sexpose: Registry<typeof setup.SexPose>
  let sexposition: Registry<typeof setup.SexPosition>
  let speech: Registry<typeof setup.Speech>
  let trait: Registry<typeof setup.Trait>
  let traitgroup: Registry<typeof setup.TraitGroup>
  let unitaction: Registry<typeof setup.UnitAction>
  let unitgroup: Registry<typeof setup.UnitGroup>
  let unitpool: Registry<typeof setup.UnitPool>

  interface UnitAction { }

  let unitaction: UnitAction

  let ch: Record<string, (actor_name) => string>

  let qs: {
    job_slaver: Restriction
    job_slave: Restriction
    trait_vagina: Restriction
    trait_dick: Restriction
    trait_breast: Restriction
    trait_balls: Restriction
    trait_gender_male: Restriction
    trait_gender_female: Restriction
  }

  let SPEECH_ADVERBS: Record<string, string[]>
  let TRAIT_TEXTS: Record<string, Record<string, string>>
  let TRAIT_TEXTS_DEFAULT: Record<string, *>
  let TRAIT_PHYSICAL_TAGS: string[]
  let TRAITRACESKINMAP: Record<string, Record<string, number>>
  let TRAIT_SKIN_TAGS: string[]

  let ALLUNITGROUPSMALE: [any, number][]
  let ALLUNITGROUPSFEMALE: [any, number][]
  let ALLUNITGROUPS: [any, number][]
  let DEFAULT_INITIAL_SKILLS: number[]

  //let TraitHelper.EQUIPMENT_SLUTTY:
  /*let TraitHelper.TRAINING_BASIC_GENDERLESS: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_BASIC: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_ADVANCED: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_ADVANCED_GENDERLESS: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_MASTER: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_MASTER_GENDERLESS: setup.TraitHelper.getAllTraitsOfTags
  let TraitHelper.TRAINING_ALL: setup.TraitHelper.TRAINING_BASIC.conca
  let TraitHelper.TRAINING_ALL_GENDERLESS: setup.TraitHelper.TRAINING_BASIC_GENDERLESS.conca
  let TraitHelper.TRAINING_ALL_INCL_MINDBREAK: setup.TraitHelper.TRAINING_ALL.concat([setup.trait.training_mindbreak])
  let TraitHelper.TRAUMA =*/
}

// Helper type
//   Maps a class to a function that returns a new instance of it without needing to use the "operator new"
type ConstructorProxyFunction<T extends new (...args: any) => any> =
  T extends new (...args: infer P) => infer R ? ((...args: P) => R) & { class: T } : never

// Declare type for "setup.qc"
declare type setup_qc = {
  [k in keyof typeof setup.qcImpl]: ConstructorProxyFunction<typeof setup.qcImpl[k]>
}

// Declare type for "setup.qres"
declare type setup_qres = {
  [k in keyof typeof setup.qresImpl]: ConstructorProxyFunction<typeof setup.qresImpl[k]>
}

// Declare type for "setup.SlaveOrderAddon"
declare type setup_SlaveOrderAddon = {
  [k in keyof typeof setup.SlaveOrderAddonImpl]: ConstructorProxyFunction<typeof setup.SlaveOrderAddonImpl[k]>
}
