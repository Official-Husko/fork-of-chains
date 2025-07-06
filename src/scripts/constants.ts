/**
 * constants.ts
 * -------------
 * This file contains all global game constants and configuration values for the Twine SugarCube project.
 * All values are attached to the global `setup` object for use throughout the game.
 *
 * Converted from JavaScript to TypeScript for type safety and maintainability.
 */

export const IMPORTABLE = true;

// Define the shape of the global setup object for type safety
interface Setup {
  [key: string]: any;
}

// Declare the global setup variable
declare var setup: Setup;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Number of unit choices at start */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.STARTING_SLAVER_CHOICES = 12;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Unit group related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.UNIT_GROUP_MAX_UNITS = 10;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Unit image related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// if an image is used, how long to ban it for?
setup.UNIT_IMAGE_MEMORY = 10;

// how much ban is lifted from images when weekend lapse?
setup.UNIT_IMAGE_WEEKEND_MEMORY_LAPSE = 5;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Level related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// what level does exp and money plateau at?
setup.LEVEL_PLATEAU = 40;

// what level does veteran hall raises quests to?
setup.LEVEL_VETERANHALL = 20;

// maximum number of level ups in one sitting
setup.LEVEL_UP_MAX_ONE_SITTING = 5;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Skill related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how many skill points per level up?
setup.SKILL_INCREASE_PER_LEVEL = 6;

// probability of increasing skill: value of current skill minus this value.
setup.SKILL_INCREASE_BASE_OFFSET = 5;

// chance that a newly generated unit has triple focus by default
setup.SKILL_TRIPLE_FOCUS_CHANCE = 0.1;

// chance that a newly generated unit that DOES NOT have triple focus,
// will have a double focus
// for exapmle, if triple focus is 0.2 and double focus is 0.5, then the actual chances are
// 0.2 for triple, 0.4 for double, and 0.4 for triple.
setup.SKILL_DOUBLE_FOCUS_CHANCE = 0.35;

// chance that a focused skill will gain another point on level up.
// calculated independently --- so a triple focus will get three chances of 25% chance each
setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE = 0.25;

// Skill boosts will decay with this chance per every point above zero.
// For example, if the chance is 0.1
// then 2 will decay with 20% chance, 40% chance at 4, and 100% chance at 10.
setup.SKILL_BOOST_DECAY_RATE = 0.2;

// Starting skills for units
setup.DEFAULT_INITIAL_SKILLS = Array(10).fill([7, 12]);

// Minimum modifier for skills
setup.SKILL_MODIFIER_MIN_MULT = -0.9;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Money related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how much money each slaver makes per week on average
setup.MONEY_PER_SLAVER_WEEK = 500;

// how much money each slave makes per week on average on a quest
setup.MONEY_PER_SLAVE_WEEK = 250;

// how much variance can the money reward change? E.g., 0.02 means up to 2%
setup.MONEY_NUDGE = 0.1;

// at slavers level one, how much fraction of money they would get compared to lv40?
setup.MONEY_LEVEL_ONE_MULTI = 0.5;

// how money multiplied by when its a crit result?
setup.MONEY_CRIT_MULTIPLIER = 2;

// multiplier for sold items
setup.MONEY_SELL_MULTIPLIER = 0.5;

// building prices mults
setup.BUILDING_CHEAP_MULT = 6;
setup.BUILDING_MEDIUMLOW_MULT = 10;
setup.BUILDING_MEDIUM_MULT = 20;
setup.BUILDING_HIGH_MULT = 40;
setup.BUILDING_VERYHIGH_MULT = 100;
setup.BUILDING_ASTRO_MULT = 200;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Slave trade related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how much money for each of these traits:

setup.MONEY_TRAIT_MEDIUM = 1000;
setup.MONEY_TRAIT_RARE = 2500;
setup.MONEY_TRAIT_EPIC = 7500;
setup.MONEY_TRAIT_LEGENDARY = 12500;

// base slave value
setup.SLAVE_BASE_VALUE = 2 * setup.MONEY_PER_SLAVER_WEEK;

// how much each of these training traits adds to slave value?
setup.SLAVETRAINVALUE_BASIC = Math.round(0.5 * 3 * setup.MONEY_PER_SLAVER_WEEK);
setup.SLAVETRAINVALUE_ADVANCED = Math.round(
  1.2 * 3 * setup.MONEY_PER_SLAVER_WEEK
);
setup.SLAVETRAINVALUE_MASTER = Math.round(3 * 3 * setup.MONEY_PER_SLAVER_WEEK);

setup.SLAVE_ORDER_MENIAL_MULTI = 0.4;

// minimum price of slaves sold to you.
setup.SLAVE_VALUE_MARKET_MINIMUM = 1000;

// minimum price to recruit slaver
setup.SLAVER_VALUE_MARKET_MINIMUM = 1000;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Exp related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// exp required at level 1 to level up:
setup.EXP_LEVEL_1 = 10;

// exp required at level plateau to level up:
setup.EXP_LEVEL_PLATEAU = 500;

// level 1 through plateau, one level every how many weeks?
setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY = 0.9;

// exp to level up after plateau will x 4 every this many levels:
setup.EXP_LATE_GAME_QUAD_EVERY = 3;

// how much is the jump from level 40 to level 41, exp wise?
setup.EXP_LATE_CLIFF = 8;

// how much variance can the exp reward change? E.g., 0.02 means up to 2%
setup.EXP_NUDGE = 0.05;

// how exp multiplied by when its a crit result?
setup.EXP_CRIT_MULTIPLIER = 1;

// how exp multiplied by when its a failure result?
setup.EXP_FAILURE_MULTIPLIER = 2;

// how exp multiplied by when its a crit result?
setup.EXP_DISASTER_MULTIPLIER = 4;

// how much exp does an on duty unit gets compared to normal units?
setup.EXP_DUTY_MULTIPLIER = 0.4;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Quest and content related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how many weeks worth of quest do you get per scouting attempt per week?
setup.QUEST_WEEKS_PER_SCOUT = 6;

// how many skills for a skill summary?
setup.QUEST_SKILL_SUMMARY = 3;

// Default cooldown for most events in weeks
setup.EVENT_DEFAULT_COOLDOWN = 1000;

// Default expiration for quests
setup.QUEST_DEFAULT_EXPIRATION = 6;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Market related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// weeks until a slaver expires from prospect hall
setup.MARKET_OBJECT_SLAVER_EXPIRATION = 6;

// weeks until a slave expires from slave pens
setup.MARKET_OBJECT_SLAVE_EXPIRATION = 6;

// weeks until equipment expires from forge
setup.MARKET_OBJECT_EQUIPMENT_EXPIRATION = 6;

// weeks until item expires from market
setup.MARKET_OBJECT_ITEM_EXPIRATION = 6;

// markup of items sold by contact markets. Does not affect favor markets
setup.CONTACT_PEDDLER_MARKUP = 2.0;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Equipment related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// Amount of equipmentset granted by having an armory and each upgrade to it:
setup.EQUIPMENTSET_ARMORY_DEFAULT_STORAGE = 3;
setup.EQUIPMENTSET_PER_STORAGE = 10;

// How many skills max are displayed on equipment set rep?
setup.EQUIPMENTSET_SKILL_DISPLAY = 3;

// Sluttiness at at this or higher means equipment is off limits to slavers with certain traits.
setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_CHASTE = 5;
setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL = 20;
setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_LUSTFUL = 30;
setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_SEXADDICT = 40;

// Threshold on sluttiness to get the slutty and very slutty traits
setup.EQUIPMENT_SLUTTY_COVERED_THRESHOLD = 10;
setup.EQUIPMENT_SLUTTY_THRESHOLD = 60;
setup.EQUIPMENT_VERYSLUTTY_THRESHOLD = 100;

// Threshold on value to get the valuable and very valuable traits
setup.EQUIPMENT_VALUABLE_THRESHOLD = 15 * setup.MONEY_PER_SLAVER_WEEK;
setup.EQUIPMENT_VERYVALUABLE_THRESHOLD = 75 * setup.MONEY_PER_SLAVER_WEEK;

// Default equipment prices
setup.EQUIPMENT_PRICE_NORMAL = 2 * setup.MONEY_PER_SLAVER_WEEK;
setup.EQUIPMENT_PRICE_NORMALGOOD = 3000;
setup.EQUIPMENT_PRICE_GOOD = 10 * setup.MONEY_PER_SLAVER_WEEK;
setup.EQUIPMENT_PRICE_GOODMASTER = 20 * setup.MONEY_PER_SLAVER_WEEK;
setup.EQUIPMENT_PRICE_MASTER = 40 * setup.MONEY_PER_SLAVER_WEEK;

// Default equipment stat boosts
setup.EQUIPMENT_STAT_BOOST_TINY = 0.01;
setup.EQUIPMENT_STAT_BOOST_LOW = 0.02;
setup.EQUIPMENT_STAT_BOOST_NORMAL = 0.03;
setup.EQUIPMENT_STAT_BOOST_GOOD = 0.04;
setup.EQUIPMENT_STAT_BOOST_MASTER = 0.05;

// Minimum skill required to wield master weapons
setup.EQUIPMENT_WEAPON_MASTER_MIN_SKILL = 100;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Bedchamber and Furniture related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// when do the bedchamber slave give addition +1 to stat?
// rivalry counts
setup.BEDCHAMBER_SLAVE_SKILL_GAIN = [300, 600, 900];

// Default furniture prices
setup.FURNITURE_PRICE_NORMAL = 2 * setup.MONEY_PER_SLAVER_WEEK;
setup.FURNITURE_PRICE_GOOD = 10 * setup.MONEY_PER_SLAVER_WEEK;
setup.FURNITURE_PRICE_GOODMASTER = 20 * setup.MONEY_PER_SLAVER_WEEK;
setup.FURNITURE_PRICE_MASTER = 40 * setup.MONEY_PER_SLAVER_WEEK;

// how much skill boost from these equipments?
setup.FURNITURE_SKILL_NORMAL = 2;
setup.FURNITURE_SKILL_GOOD = 4;
setup.FURNITURE_SKILL_MASTER = 5;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Slave training related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.get_TRAINING_MASTER_DIFFICULTY = function () {
  return setup.qdiff.hardest50;
};

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Banter related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// will need these many friends first before they can use slaves
setup.BANTER_USE_LIMIT = 1;

/* soft and hard limit on number of friends. note that even the hard limit is not that hard... */
setup.BANTER_FRIENDS_SOFT_LIMIT = 5;
setup.BANTER_FRIENDS_HARD_LIMIT = 10;

/* minimum and maximum relationship per banter */
setup.BANTER_GAIN_MIN = 30;
setup.BANTER_GAIN_MAX = 60;

/* maximum and minimum friendship that can be achieved from unit interactions */
setup.BANTER_INTERACTION_MAX_FRIENDSHIP = 200;
setup.BANTER_INTERACTION_MIN_FRIENDSHIP = -200;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Skill related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// Note: lovers will get both the friendship and rivalry bonuses

// how much mentoring bonus from friendship? This is percentage of the difference in value.
setup.FRIENDSHIP_MAX_SKILL_GAIN = 0.4;

// how much rivalry bonus from rivals? This is percentage of the difference in value.
setup.RIVALRY_MAX_SKILL_GAIN = 0.1;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Trait related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.PERK_GAIN_AT_LEVEL = [25, 45];

// how many maximum traits of this tag can a unit have at the same time?
setup.TRAIT_MAX_HAVE = {
  bg: 3,
  skill: 4,
  magic: 3,

  perkstandard: setup.PERK_GAIN_AT_LEVEL.length,
  perkspecial: 2,

  trmaster: 1,
};

// skill modifiers from:
setup.TRAIT_TRAUMA_EFFECT = -0.7;
setup.TRAIT_BOON_EFFECT = 0.4;

// weeks to get the junior / senior trait
setup.TRAIT_JUNIOR_THRESHOLD = 52;
setup.TRAIT_SENIOR_THRESHOLD = 200;

// values to get the value traits
setup.TRAIT_VALUE_LOW_THRESHOLD = 3000;
setup.TRAIT_VALUE_HIGH_THRESHOLDS = [
  10000, 20000, 30000, 40000, 50000, 70000, 150000,
];

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Perk related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// price of a standard perk potion
setup.PERK_POTION_STANDARD_PRICE = 10000;

// number of priority perk that are preferred
setup.PERK_PRIORITY_COUNT = 2;

// number of extra perks offered
setup.PERK_EXTRA_CHOICES = 6;

// amount of skill given by basic perks
setup.PERK_BASIC_SKILL_GAIN = 0.06;

// amount of skill given by generalist perk
setup.PERK_GENERALIST_SKILL_GAIN = 0.03;

// amount of skill substracted by null perks
setup.PERK_NULL_SKILL_NERF = 0.2;

// amount of skill penalty reduced from trauma
setup.PERK_TRAUMA_PENALTY_REDUCTION = 0.8;

// amount of skill penalty reduced from corruption
setup.PERK_CORRUPTION_PENALTY_REDUCTION = 0.8;

// amount of skill bonus increased from boon
setup.PERK_BOON_BONUS_INCREASE = 0.4;

// amount of sluttiness limit increased
setup.PERK_SLUTTINESS_LIMIT_INCREASE = 15;

// amount of bonus chance awarded by duty perk
setup.PERK_DUTY_BONUS = 0.11;

// amount of specialist cost reduction
setup.PERK_SPECIALIST_REDUCTION = 0.3;

// a blessing every this many weeks
setup.PERK_BLESSING_WEEKS = 43;

// a corruption every this many weeks
setup.PERK_CORRUPTION_WEEKS = 9;

// a purification every this many weeks
setup.PERK_PURIFICATION_WEEKS = 29;

// switch changes dom/sub every this weeks
setup.PERK_SWITCH_WEEKS = 7;

// uncursed slaver will get traumatized this long instead
setup.PERK_UNCURSED_TRAUMA_DURATION = 26;

// gold per week whenever the slaver with this trait is at home
setup.PERK_SIDEJOB_GOLD_PER_WEEK = 62;

// gold per week whenever the slaver completes a quest
setup.PERK_SCAVENGER_GOLD_PER_WEEK = 75;

// automatically bodyshifts every this many weeks
setup.PERK_UNSTABLE_BODYSHIFTER_WEEKS = 3;

// reverse personalities every this many weeks
setup.PERK_CHAOTIC_PERSONALITY_WEEKS = 9;

// doppelganger transforms every this many weeks
setup.PERK_QUEST_DOPPELGANGER_WEEKS = 30;

// doppelganged heal this many weeks of injuries every xxx weeks
setup.PERK_QUEST_DOPPELGANGER_INJURY_HEAL = 5;

// doppelganged healer injuries every xxx weeks
setup.PERK_QUEST_DOPPELGANGER_INJURY_WEEKS = 16;

// harbinger of crows skill bonus
setup.PERK_QUEST_HARBINGER_OF_CROW_SKILL_BONUS = 0.09;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Corruption trait related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// chance a corruption will give a rare trait instead
setup.CORRUPTION_MISFIRE_RARE_CHANCE = 0.05;

// chance a corruption will give a medium rarity trait instead
setup.CORRUPTION_MISFIRE_MEDIUM_CHANCE = 0.15;

// chance above will be multiplied by this for permanent corruption
setup.CORRUPTION_PERMANENT_MISFIRE_CHANCE_MULTIPLIER = 0.1;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Trauma related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// trauma durations
setup.TRAUMA_SHORT = 6;
setup.TRAUMA_MEDIUM = 12;
setup.TRAUMA_LONG = 20;

// how many weeks of trauma a unit get when their lover is gone?
setup.TRAUMA_LOVERS_GONE = 40;

/**
 * How much trauma after a breakup?
 */
setup.LOVERS_BREAKUP_TRAUMA_DURATION = 25;

// how many weeks of boon (negative) or trauma (positive) a unit get when its friend are gone?
setup.TRAUMA_REMOVED_DURATION = [
  [[-1000, -900], -27],
  [[-900, -500], -14],
  [[-500, -300], -7],
  [[300, 500], 7],
  [[500, 900], 14],
  [[900, 1000], 27],
];

/**
 * Units with these traits will adjust their trauma duration from the above.
 * Has an opposite effect on the amount of relationship lost (i.e., evil units will get more relationship damage
 * when broken up)
 */
setup.TRAUMA_TRAIT_ADJUST = {
  per_evil: -0.5,
  per_lunatic: -0.5,
  per_logical: -0.5,
  per_cruel: -0.5,

  per_dominant: -0.25,
  per_sexaddict: -0.25,
  per_lustful: -0.25,

  per_dreamy: -0.1,

  per_loner: -0.1,
  per_gregarious: +0.1,

  per_attentive: +0.1,

  per_chaste: +0.25,
  per_submissive: +0.25,

  per_kind: +0.5,
  per_masochistic: +0.5,
  per_honorable: +0.5,
  per_empath: +0.5,
};

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Curse and Blessings related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.BLESSING_MAX_STACKS = 8;

setup.BLESSING_INJURY_WEEKS = 8;
setup.BLESSING_TRAUMA_WEEKS = 25;

setup.CURSE_VALUE = -1500;
setup.CURSE_INJURY_WEEKS = 8;
setup.CURSE_TRAUMA_WEEKS = 24;
setup.CURSE_INJURY_MULTIPLIER = 4;
setup.CURSE_TRAUMA_MULTIPLIER = 4;

setup.CURSE_CROW_MAX_CRIT_CHANCE = 0.5;
setup.CURSE_VICE_PERMANENT_CORRUPTION_CHANCE = 0.01;
setup.CURSE_DEMISE_LOST_MONEY = 3500;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Duties related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how much is the multiplier per skill total?
setup.DUTY_SKILL_MULTIPLIER_TOTAL = 0.008;

// how much chance increase from "normal" traits?
setup.DUTY_TRAIT_NORMAL_CHANCE = 0.1;

// from "crit" traits?
setup.DUTY_TRAIT_CRIT_CHANCE = 0.3;

setup.DUTY_TRAIT_PRESTIGE1 = 1;
setup.DUTY_TRAIT_PRESTIGE2 = 2;
setup.DUTY_TRAIT_PRESTIGE3 = 3;
setup.DUTY_TRAIT_PRESTIGE4 = 4;
setup.DUTY_TRAIT_PRESTIGE5 = 5;
setup.DUTY_TRAIT_PRESTIGE6 = 6;

// gain prestige every this much value:
setup.DUTY_VALUE_PRESTIGE_GAINS = [5000, 10000, 17000, 25000, 35000];

// weekly upkeep for contract specialists
setup.DUTY_SPECIALIST_WEEKLY_UPKEEP = 900;

// how many of weeks of injuries cured by doctors
setup.DOCTOR_ATTEMPTS = 3;
// how many of weeks of injuries cured by doctors on critical
setup.DOCTOR_ATTEMPTS_CRIT = 5;

// how many leveling attempts do the drill sergeant get each week?
setup.DRILL_SERGEANT_ATTEMPTS = 5;

// how many crit leveling attempts do the drill sergenat get each week? I.e., these attempts
// are triggered with (success chance - 1.0) chance.
setup.DRILL_SERGEANT_ATTEMPTS_CRIT = 5;

// how much money leader makes on their duty?
setup.LEADER_MONEY = 500;
setup.LEADER_MONEY_CRIT = 700;

// maximum weeks of extra boon granted by mystic on crit
setup.MYSTIC_MAX_BOON = 5;
setup.MYSTIC_MAX_BOON_CRIT = 10;

// boon is increased by this much on success
setup.MYSTIC_BOON_MULTI = 0.5;

// boon is increased by this much on crit
setup.MYSTIC_BOON_MULTI_CRIT = 1.0;

// slave orders generated by marketers expire after this many weeks
setup.MARKETER_ORDER_EXPIRATION = 2;

// slave order price on critical marketer are multiplied by this much
setup.MARKETER_CRIT_MULTIPLIER = 1.5;

// profit per prestige from pimp
setup.PIMP_PRESTIGE_MULTIPLIER = 50;

// each pimp can manage at most this many slaves
setup.PIMP_SLAVE_LIMIT = 3;

// profit multiplied by this on pimp crit
setup.PIMP_CRIT_MULTIPLIER = 1.5;

// profit on critical pimp are multiplied by this much
setup.MARKETER_CRIT_MULTIPLIER = 1.5;

// on scout critical, this many quests are generated.
setup.SCOUTDUTY_CRIT_MULTIPLIER = 1.5;

// how much slave value is worth 1 prestige?
setup.PRESTIGESLAVE_SLAVE_VALUE_FOR_ONE_PRESTIGE =
  6 * setup.MONEY_PER_SLAVER_WEEK;

// how much does your vice leader improve your skills?
setup.VICELEADER_SKILL_MULTI = 0.12;

setup.TRAINER_MAX_LEVEL = 35;
setup.TRAINER_CRIT_EXP_MULTI = 1.7;

// How much percent of the money insurer gives on these outcomes?
setup.INSURER_MULTIS = {
  failure: {
    proc: 2.0 / 3.0,
    crit: 1.0,
  },
  disaster: {
    proc: 1.0,
    crit: 1.4,
  },
};

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* History related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.HISTORY_UNIT_MAX = 100;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Favor related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// maximum amount of favor? minimum is 0
setup.FAVOR_MAX = 2000;

// thresholds at which favor effects will proc
setup.FAVOR_EFFECT_THRESHOLDS = [300, 600, 900];

// favor decay per week, when your starting favor is at most xxx.
setup.FAVOR_DECAY = [
  [250, 1],
  [525, 20],
  [800, 50],
  [2000, 80],
];

// favor decay with the relationship manager assigned to this company
setup.FAVOR_DECAY_RELATIONSHIP_MANAGER = [
  [800, 0],
  [2000, 30],
];

// Probability for master equipment at medium and high favor
setup.FAVOR_MASTER_EQUIPMENT_PROBABILITY_MEDIUM = 0.01;
setup.FAVOR_MASTER_EQUIPMENT_PROBABILITY_HIGH = 1.0;

// gain one company to manage every this much efficiency
setup.FAVOR_RELATIONSHIP_MANAGER_COMPANY_EVERY = 0.33;

// How much upkeep does the relationship manager cost when managing x+1 companies?
setup.FAVOR_RELATIONSHIP_MANAGER_UPKEEPS = [
  200, 800, 1400, 2000, 2800, 3900, 5700,
];

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Ire related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// money paid when DCO reduces ire by 1
setup.IRE_DCO_PAY = 1000;

// money paid when DCO reduces ire by 2 (crit)
setup.IRE_DCO_PAY_CRIT = 2000;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Childbirth related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// chance the child will inherit one of the parent's background traits
setup.CHILD_TRAIT_BACKGROUND_INHERIT_CHANCE = 0.25;

// chance the child will inherit one of the parent's non background trait
setup.CHILD_TRAIT_NON_BACKGROUND_INHERIT_CHANCE = 0.33;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Difficulty related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// if success goes above 100%, how much of the leftover is converted to critical?
setup.DIFFICULTY_SUCCESS_EXCESS_CRIT_CONVERSION = 0.25;

// if failure goes above 100%, how much of the leftover is converted to disaster?
setup.DIFFICULTY_FAILURE_EXCESS_DISASTER_CONVERSION = 1.0;

// what fraction of the base disaster chance can be eliminated by the trait critical chance?
setup.DIFFICULTY_BASE_DISASTER_ELIMINATION_FRACTION = 1.0;

// what fraction of the maximum hard cap on success modifier can you get if you have this many matching
// critical traits?
setup.DIFFICULTY_CRIT_CHANCE_TABLE = [
  0.0 /* 0 */, 0.19 /* 1 */, 0.36 /* 2 */, 0.51 /* 3 */, 0.64 /* 4 */,
  0.76 /* 5 */, 0.86 /* 6 */, 0.94 /* 7 */, 1.0 /* 8 */,
];

setup.DIFFICULTY_MAX_LEVEL = 100;

// for each level up, the skills that matters for the quest increase by on average this many
// this includes modifiers etc.
// increasing this will increase overall game difficulty.
setup.DIFFICULTY_BASE_STAT_SUM_PER_LEVEL = 4.6;

// stat at level 0
setup.DIFFICULTY_LV0_STAT = 27;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Item related */
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.ITEM_MARKET_ALCHEMIST_POTION_MARKUP = 5;

// thresholds for items to be considered of common/uncommon/rare/unicorn rarities
setup.ITEM_PRICE_LOW = 1000;
setup.ITEM_PRICE_NORMAL = 5000;
setup.ITEM_PRICE_GOOD = 10000;
setup.ITEM_PRICE_MASTER = 20000;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Deck and rarity
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

setup.DECK_SUBDECKS = 4;

setup.RARITY_COMMON_FREQUENCY = 16;
setup.RARITY_UNCOMMON_FREQUENCY = 8;
setup.RARITY_RARE_FREQUENCY = 4;
setup.RARITY_EPIC_FREQUENCY = 2;
setup.RARITY_LEGENDARY_FREQUENCY = 1;
setup.RARITY_NEVER_FREQUENCY = 0;

/* How many times to retry drawing a card from a deck when the drawn card is not good? */
setup.DECK_DRAW_RETRIES_QUEST = 200;
setup.DECK_DRAW_RETRIES_EVENT = 200;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Unit generation
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* average number of personality traits of each rarity */
setup.UNIT_POOL_PER_TRAITS_AVERAGE_COMMON = 3.0;
setup.UNIT_POOL_PER_TRAITS_AVERAGE_MEDIUM = 0.18;
setup.UNIT_POOL_PER_TRAITS_AVERAGE_RARE = 0.02;
setup.UNIT_POOL_PER_TRAITS_AVERAGE_UNICORN = 0.002;

/* minimum and maximum number of personality traits on generated units */
setup.UNIT_POOL_PER_TRAITS_MIN = 1;
setup.UNIT_POOL_PER_TRAITS_MAX = 5;

/* average number of personality traits of each rarity */
setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_COMMON = 0.075;
setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_MEDIUM = 0.075;
setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_RARE = 0.015;
setup.UNIT_POOL_SKILL_TRAITS_AVERAGE_UNICORN = 0.0015;

/* minimum and maximum number of personality traits on generated units */
setup.UNIT_POOL_SKILL_TRAITS_MIN = 0;
setup.UNIT_POOL_SKILL_TRAITS_MAX = setup.TRAIT_MAX_HAVE.skill;

setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_COMMON = 0.25;
setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_MEDIUM = 0.05;
setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_RARE = 0.01;
setup.UNIT_POOL_PHYS_TRAITS_AVERAGE_UNICORN = 0.001;

setup.POOL_BG_COMMON_1 = 1;
setup.POOL_BG_UNCOMMON_2 = 0.5;
setup.POOL_BG_RARE_3 = 0.2;
setup.POOL_BG_EPIC_4 = 0.1;
setup.POOL_BG_LEGENDARY_5 = 0.05;
setup.POOL_BG_MYTHIC_6 = 0.01;
setup.POOL_BG_ULTRA_7 = 0.001;
setup.POOL_BG_FINAL_8 = 0.0001;
setup.POOL_BG_IMPOSSIBLE_9 = 0.00001;

setup.POOL_PER_COMMON_1 = 0.5;
setup.POOL_PER_UNCOMMON_2 = 0.2;
setup.POOL_PER_RARE_3 = 0.1;
setup.POOL_PER_EPIC_4 = 0.05;
setup.POOL_PER_LEGENDARY_5 = 0.01;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Party
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* max number of parties */
setup.PARTY_MAX = 100;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* ROOMS
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* max skill that can be boosted from rooms */
setup.ROOM_MAX_SKILL_BOOST = 12;

/* if all adjancey bonus is full, grant this many stats */
setup.ROOM_BONUS_SKILL_BONUS_DEFAULT = 10;

/* bonus skill from decorations sub building */
setup.ROOM_DECORATION_BONUS = 0.5;
/* bonus skill from decorations main building */
setup.ROOM_DECORATION_BONUS_MAIN = 2;

/**
 * width of the fort grid
 */
setup.FORTGRID_WIDTH = 24;

/**
 * Extra amount of tiles multiplied by total needed to build all improvements.
 */
setup.FORTGRID_EXTRA_TILE_MULTIPLIER = 1.25;

/**
 * These two will be computed later
 */
setup.MAX_TILE_INSIDE = 0;
setup.MAX_TILE_OUTSIDE = 0;

/**
 * initial heights of the indoor area of the fort, including the entrance "wall"
 */
setup.FORTGRID_INDOOR_HEIGHT_INIT = 4;
/**
 * initial heights of the outdoor area of the fort, excluding the entrance "wall"
 */
setup.FORTGRID_OUTDOOR_HEIGHT_INIT = 2;

/**
 * Width of a single tile in px by default. Will actually be scaled on smaller screens
 */
setup.FORTGRID_TILE_SIZE = 32;

/**
 * Price to relocate a building per tile. Charged when you remove a building.
 */
setup.FORTGRID_RELOCATE_PRICE_PER_TILE = 20;

/**
 * If the entrance between two buildings is within this distance, they are considered near.
 */
setup.FORTGRID_NEAR_DISTANCE = 10;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* FORT CAPACITIES
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// these three governs number of slavers per lodgings level
setup.FORT_SLAVER_CAPACITY_PER_LODGING = 2;

// slave slot per dungeons level
setup.FORT_SLAVE_CAPACITY_PER_CELL = 8;

// retirees that can be tracked per guest room level
setup.FORT_GUEST_ROOM_CAPACITY_PER_LEVEL = 4;

// minimum number of slavers. Cannot dismiss slavers to have less than this
setup.SLAVER_COUNT_MINIMUM = 5;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* RETIREMENT
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// cost to re-recruit a retiree
setup.RETIRE_RERECRUIT_COST_MONEY = 10000;

// weeks that a retiree that has just been re-recruited will become useless
setup.RETIRE_RERECRUIT_AFK_WEEKS = 100;

// default preference for unicorn livings
setup.LIVING_UNICORN_PREFERENCE = 100000;

// default preference for rare livings
setup.LIVING_RARE_PREFERENCE = 1000;

// default preference for uncommon livings
setup.LIVING_UNCOMMON_PREFERENCE = 100;

// default preference for common livings
setup.LIVING_COMMON_PREFERENCE = 1;

// default preference for very common livings
setup.LIVING_MORECOMMON_PREFERENCE = 0.1;

// default preference for very common livings
setup.LIVING_VERYCOMMON_PREFERENCE = 0.01;

// default preference for extremely common livings
setup.LIVING_EXTREMELYCOMMON_PREFERENCE = 0.001;

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* NEW GAME PLUS
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// number of slavers you can bring along on a new game plus
setup.NEW_GAME_PLUS_SLAVERS = 3;

// number of slaves you can bling along on a new game plus
setup.NEW_GAME_PLUS_SLAVES = 3;

setup.NEW_GAME_PLUS_BASE_QUIT_CHANCE = 0.4;

// chances of a slaver to quit your company
setup.NEW_GAME_PLUS_QUIT_CHANCE = {
  per_slow: -0.2,
  per_smart: 0.2,
  per_brave: 0.1,
  per_cautious: -0.1,
  per_aggressive: 0.1,
  per_calm: -0.1,
  per_proud: 0.2,
  per_humble: -0.2,
  per_direct: -0.1,
  per_sly: 0.1,
  per_active: 0,
  per_studious: 0,
  per_loner: 0.2,
  per_gregarious: -0.2,
  per_frugal: 0.1,
  per_lavish: -0.1,
  per_independent: 0.3,
  per_loyal: -0.3,
  per_attentive: -0.1,
  per_dreamy: 0.1,
  per_stubborn: -0.2,
  per_curious: 0.2,
  per_cruel: 0.1,
  per_kind: -0.1,
  per_serious: 0,
  per_playful: 0,
  per_logical: 0,
  per_empath: 0,
  per_chaste: 0,
  per_lustful: 0,
  per_sexaddict: 0,
  per_dominant: 0.2,
  per_submissive: -0.2,
  per_masochistic: 0,
  per_lunatic: 0.2,
  per_evil: 0.1,
  per_honorable: -0.1,
};

setup.NEW_GAME_PLUS_BASE_SUCCESS_CHANCE = 0.6;

// chances of new leader to lead company to continued success
setup.NEW_GAME_PLUS_NEW_LEADER_SUCCESS_CHANCE = {
  per_slow: -0.2,
  per_smart: 0.2,
  per_brave: -0.1,
  per_cautious: 0.1,
  per_aggressive: 0,
  per_calm: 0,
  per_proud: 0.1,
  per_humble: 0.1,
  per_direct: 0,
  per_sly: 0.1,
  per_active: 0,
  per_studious: 0,
  per_loner: -0.1,
  per_gregarious: 0.1,
  per_frugal: 0.1,
  per_lavish: -0.1,
  per_independent: -0.1,
  per_loyal: 0.1,
  per_attentive: 0.1,
  per_dreamy: -0.1,
  per_stubborn: 0,
  per_curious: 0,
  per_cruel: 0,
  per_kind: 0,
  per_serious: 0,
  per_playful: 0,
  per_logical: 0.1,
  per_empath: -0.1,
  per_chaste: 0,
  per_lustful: 0,
  per_sexaddict: -0.1,
  per_dominant: 0.2,
  per_submissive: 0.2,
  per_masochistic: -0.3,
  per_lunatic: -0.1,
  per_evil: 0.1,
  per_honorable: -0.1,
  join_junior: -0.3,
};

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Activity related
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// probability a unit will engage in some sort of activity at home
setup.ACTIVITY_CHANCE = 0.9;

// number of tries to find a good activity per rarity level
setup.ACTIVITY_MAX_ATTEMPT_PER_RARITY = 10;

// activity chance is increased by this much per matching crit traits
setup.ACTIVITY_CHANCE_MULTIPLIER_CRIT_TRAITS = [
  1.0, 2.5, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0,
];

// activity chance is increased by this much per matching crit traits
setup.ACTIVITY_CHANCE_MULTIPLIER_DISASTER_TRAITS = [
  1.0, 0.4, 0.1, 0.03, 0.005, 0.0001, 0,
];

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* Content creator
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// all things supported by content creator
setup.CONTENT_CREATOR_TYPES = [
  "event",
  "quest",
  "opportunity",
  "activity",
  "interaction",
];

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* DEPLOYMENT
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// this will be over-written to true with a [script] passage on itch.io version.
setup.is_itch_io = function () {
  return Story.has("ItchIoOnlyPassage");
};

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
/* DEBUG
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// how many units to generate to approximate a unit pool / unit group average worth?
setup.COMPUTE_APPROXIMATE_VALUE_REPS = 100;

// multiplier for approximate value comput to account for variance
setup.COMPUTE_APPROXIMATE_VALUE_MULTIPLIER = 1.1;
