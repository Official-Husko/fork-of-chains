// will be set to $settings
setup.Settings = class Settings extends setup.TwineClass {

  static DIFFICULTY_DEFAULT = 'Standard'
  static DIFFICULTIES = {
    'unfair': 'Unfair',
    'impossible': 'Impossible',
  }

  constructor() {
    super()
    this.bannedtags = {}
    this.gender_preference = {
      slave: 'neutral',
      slaver: 'neutral',
    }
    this.other_gender_preference = 'neutral'
    for (let key of setup.TagHelper.getAllTagsOfType('quest', 'fetish')) {
      this.bannedtags[key] = false
    }

    // auto-save every this many weeks. Put 0 to never auto-save
    this.autosave_interval = 5

    this.hidequestdescription = false
    this.hideeventdescription = false
    this.animatedtooltips = true
    this.summarizeunitskills = false
    /**
     * @type {boolean | string}
     */
    this.challengemode = false
    this.hideskintraits = false
    this.unitactionautoassign = true
    this.unsortedskills = false
    this.unitimagefull = false

    // whether to hide quest outcome effects in the end week screen
    this.hidequestoutcome = false

    // if true, can't use hover in mobile.
    this.mobilemode = false

    // if true, hides content images
    this.hidecontentimages = false

    this.rightsidebar = 'unit'

    // restriction for lovers
    this.lovers_mf = true
    this.lovers_mm = true
    this.lovers_ff = true

    // whether to show icon next to unit / equipments inline
    this.inline_icon = false

    // whether to color unit names in texts.
    this.inline_color = true

    // whether to use different fonts for unit names in texts.
    this.inline_font = false

    // stores SexActionClass names of disabled sex actions.
    /** @type {Object<string, boolean>} */
    this.disabled_sex_actions = {}
  }

  /**
   * @returns {string}
   */
  static difficulty_to_human(difficulty) {
    if (difficulty in setup.Settings.DIFFICULTIES) {
      return setup.Settings.DIFFICULTIES[difficulty]
    } else {
      return setup.Settings.DIFFICULTY_DEFAULT
    }
  }

  /**
   * @returns {string}
   */
  getDifficultyHumanReadable() {
    return setup.Settings.difficulty_to_human(this.challengemode)
  }

  /**
   * Whether should autosave this week
   * @param {number} week
   * @returns {boolean}
   */
  shouldAutosave(week) {
    if (this.autosave_interval <= 0) return false
    if (this.autosave_interval == 1) return true
    return week % this.autosave_interval == 1
  }

  /**
   * @param {setup.Trait} gender1 
   * @param {setup.Trait} gender2 
   * 
   * @returns {boolean}
   */
  isCanBecomeLovers(gender1, gender2) {
    if (gender1 == gender2) {
      if (gender1 == setup.trait.gender_male) {
        return this.lovers_mm
      } else {
        return this.lovers_ff
      }
    }
    return this.lovers_mf
  }

  /**
   * @param {setup.SexAction} sex_action 
   * @returns {boolean}
   */
  isSexActionDisabled(sex_action) {
    return sex_action.constructor.name in this.disabled_sex_actions
  }

  /**
   * @param {setup.SexAction} sex_action 
   */
  toggleSexActionDisabled(sex_action) {
    const sex_action_class_name = sex_action.constructor.name
    if (this.isSexActionDisabled(sex_action)) {
      delete this.disabled_sex_actions[sex_action_class_name]
    } else {
      this.disabled_sex_actions[sex_action_class_name] = true
    }
  }

  getGenderRandom(job) {
    // randomly pick a gender based on preferences
    let preferences = this.getGenderPreference(job)
    let retries = preferences.retries
    let gender_trait = 'gender_female'
    if (Math.random() < 0.5) gender_trait = 'gender_male'
    while (retries && gender_trait != preferences.trait_key) {
      if (Math.random() < 0.5) {
        gender_trait = preferences.trait_key
        break
      }
      --retries
    }
    return setup.trait[gender_trait]
  }

  getGenderPreference(job) {
    let prefkey = this.other_gender_preference
    if (job) {
      if (!(job.key in this.gender_preference)) throw new Error(`Unknown job for gender pref: ${job.key}`)
      prefkey = this.gender_preference[job.key]
    }
    if (!(prefkey in setup.SETTINGS_GENDER_PREFERENCE)) throw new Error(`Unknown gender preferences`)
    return setup.SETTINGS_GENDER_PREFERENCE[prefkey]
  }

  getBannedTags() {
    let banned = []
    for (let key in this.bannedtags) if (this.bannedtags[key]) banned.push(key)
    return banned
  }

  isBanned(tags) {
    let bannedtags = this.getBannedTags()
    for (let i = 0; i < tags.length; ++i) {
      if (bannedtags.includes(tags[i])) return true
    }
    return false
  }
}

setup.SETTINGS_GENDER_PREFERENCE = {
  'allfemale': {
    name: 'Almost all females',
    trait_key: 'gender_female',
    retries: 20,
  },
  'mostfemale': {
    name: 'Mostly females (around 95%)',
    trait_key: 'gender_female',
    retries: 3,
  },
  'female': {
    name: 'Leaning towards female (around 75%)',
    trait_key: 'gender_female',
    retries: 1,
  },
  'neutral': {
    name: 'Equal male/female ratio',
    trait_key: 'gender_male',
    retries: 0,
  },
  'male': {
    name: 'Leaning towards male (around 75%)',
    trait_key: 'gender_male',
    retries: 1,
  },
  'mostmale': {
    name: 'Mostly males (around 95%)',
    trait_key: 'gender_male',
    retries: 3,
  },
  'allmale': {
    name: 'Almost all males',
    trait_key: 'gender_male',
    retries: 20,
  },
}
