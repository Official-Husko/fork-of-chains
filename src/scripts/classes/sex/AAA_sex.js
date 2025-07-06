"use strict";
// @ts-nocheck
setup.Sex = {};
/* =========================
    TRAIT MULTIPLIER
========================= */
setup.Sex.TRAIT_MULTI_LOW = 0.2;
setup.Sex.TRAIT_MULTI_MEDIUM = 0.4;
setup.Sex.TRAIT_MULTI_HIGH = 0.6;
/* how much pleasure a strapon give compared to a real d?*/
setup.Sex.STRAPON_GIVE_PLEASURE_MULTI = 0.75;
/* how much pleasure gained from receiving pleasure through your strap compared to a real d? */
setup.Sex.STRAPON_GET_PLEASURE_MULTI = 0.5;
/* =========================
    AROUSAL
========================= */
setup.Sex.AROUSAL_MAX = 1000;
/* How much arousal for an orgasm? */
setup.Sex.AROUSAL_ORGASM_THRESHOLD = 800;
/* Fraction: much arousal decays each turn normally? */
setup.Sex.AROUSAL_DECAY = 0.03;
setup.Sex.AROUSAL_TINY = 10;
setup.Sex.AROUSAL_SMALL = 40;
setup.Sex.AROUSAL_SMALLMEDIUM = 60;
setup.Sex.AROUSAL_MEDIUM = 80;
setup.Sex.AROUSAL_MEDIUMLARGE = 120;
setup.Sex.AROUSAL_LARGE = 160;
setup.Sex.AROUSAL_HUGE = 240;
setup.Sex.AROUSAL_ICON = `img/special/arousal.svg`;
/* =========================
    DISCOMFORT
========================= */
setup.Sex.DISCOMFORT_MAX = 1000;
/* How much discomfort initially a unit gets when they started with RESIST goal? */
setup.Sex.DISCOMFORT_RESIST_INITIAL = 500;
/* How much fraction of discomfort decays each turn? */
setup.Sex.DISCOMFORT_DECAY = 0.1;
/* How much fraction of arousal is reduced by discomfort each turn at max? */
setup.Sex.DISCOMFORT_AROUSAL_REDUCTION = 0.1;
/* How much arousal do masochists get from being in discomfort? */
setup.Sex.DISCOMFORT_MASOCHIST_AROUSAL_MULTIPLIER = 0.5;
/* Discomfort multiplier for tough units */
setup.Sex.DISCOMFORT_TOUGH_MULTIPLIER = 0.5;
/* Discomfort multiplier for nimble units */
setup.Sex.DISCOMFORT_NIMBLE_MULTIPLIER = 2.0;
/* How much discomfort is lost immediately after an orgasm? */
setup.Sex.DISCOMFORT_ORGASM_REDUCTION = 500;
setup.Sex.DISCOMFORT_TINY = 10;
setup.Sex.DISCOMFORT_TINYSMALL = 30;
setup.Sex.DISCOMFORT_SMALL = 50;
setup.Sex.DISCOMFORT_SMALLMEDIUM = 75;
setup.Sex.DISCOMFORT_MEDIUM = 100;
setup.Sex.DISCOMFORT_MEDIUMLARGE = 140;
setup.Sex.DISCOMFORT_LARGE = 200;
setup.Sex.DISCOMFORT_HUGE = 400;
setup.Sex.DISCOMFORT_ICON = `img/special/discomfort.svg`;
/* =========================
    ENERGY
========================= */
setup.Sex.ENERGY_MAX = 1000;
/* How much fraction of arousal is gained when at zero energy? */
setup.Sex.ENERGY_DEPLETED_AROUSAL_MULTIPLIER = 0.3;
setup.Sex.ENERGY_TINY = -1;
setup.Sex.ENERGY_SMALL = -5;
setup.Sex.ENERGY_SMALLMEDIUM = -7;
setup.Sex.ENERGY_MEDIUM = -10;
setup.Sex.ENERGY_MEDIUMLARGE = -15;
setup.Sex.ENERGY_LARGE = -25;
setup.Sex.ENERGY_HUGE = -50;
/* How much energy is lost immediately after an orgasm? */
setup.Sex.ENERGY_ORGASM_REDUCTION = 200;
setup.Sex.ENERGY_ICON = `img/special/energy.svg`;
/* =========================
    AI
========================= */
/* Wiehgt for ending penetration as a sub. Pure doms only */
setup.Sex.AI_END_PENETRATION_SUB_WEIGHT = 200;
/* Maximum number of turns the AI is willing to spend in order to try moving to a preferred position */
setup.Sex.AI_POSITION_CHANGE_MAX_ATTEMPTS = 5;
/* Maximum number of turns the AI is willing to spend in order to try change poses of participants */
setup.Sex.AI_POSE_CHANGE_MAX_ATTEMPTS = {
    dom: 4,
    normal: 2,
    sub: 1,
    resist: 1,
    forced: 1,
    mindbroken: 1,
};
/* Chance AI will change pose after climaxing */
setup.Sex.AI_POSE_CHANGE_PLAN_CHANCE = 0.5;
/* Chance DOM AI will change position after climaxing */
setup.Sex.AI_POSITION_CHANGE_PLAN_CHANCE = 0.2;
/* Chance AI will end sex when their energy is depleted */
setup.Sex.AI_END_SEX_CHANCE = 0.1;
/* Below this discomfort, unit will never seek relief */
setup.Sex.DISCOMFORT_MIN_TRIGGER = 400;
/* Above this discomfort, unit will always seek relief */
setup.Sex.DISCOMFORT_MAX_TRIGGER = 900;
/* Below this arousal, units that cannot orgasm will never try to reduce arousal */
setup.Sex.AROUSAL_MIN_TRIGGER = 200;
/* Above this arousal, units that cannot orgasm will always try to reduce arousal*/
setup.Sex.AROUSAL_MAX_TRIGGER = 600;
/* Score to be given to penetrative actions. These score are weighted the same with arousal gain. */
/* To read: find the first matching trait (exact), then x[i] is the score when you are currently already engaged
in i penetrations */
setup.Sex.AROUSAL_PENETRATION_SCORE = {
    // chaste is vanilla, don't want multiple ones.
    per_chaste: [
        200,
        0,
    ],
    // lustful is the opposite
    per_lustful: [
        300,
        200,
        100,
        50,
        25,
        10,
        0,
    ],
    // sex addict is hungry
    per_sexaddict: [
        400,
    ],
    // lunatics
    per_lunatic: [
        100,
    ],
    // otherwise default
    default: [
        200,
        100,
        0,
    ],
};
/* =========================
    UI
========================= */
setup.Sex.UI_PLAYER_ACTIONS = 5;
/* =========================
    BODYPART
========================= */
setup.Sex.BODYPART_SIZE_TRAINING_BASIC = 1;
setup.Sex.BODYPART_SIZE_TRAINING_ADVANCED = 2;
setup.Sex.BODYPART_SIZE_TRAINING_MASTER = 3;
setup.Sex.BODYPART_MAX_SIZE = 6;
/* Multiplie discomfort on giver based on bodypart size difference */
setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_GIVER = [
    0.0, /* -6 */
    0.0, /* -5 */
    0.2, /* -4 */
    0.4, /* -3 */
    0.6, /* -2 */
    0.8, /* -1 */
    1.0, /* 0 */
    1.1, /* 1 */
    1.2, /* 2 */
    1.3, /* 3 */
    1.4, /* 4 */
    1.5, /* 5 */
    1.6, /* 6 */
];
setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_RECEIVER = [
    0.0, /* -6 */
    0.0, /* -5 */
    0.2, /* -4 */
    0.4, /* -3 */
    0.6, /* -2 */
    0.8, /* -1 */
    1.0, /* 0 */
    1.2, /* 1 */
    1.5, /* 2 */
    2.0, /* 3 */
    3.0, /* 4 */
    4.0, /* 5 */
    6.0, /* 6 */
];
/* Multiplie arousal on giver based on bodypart size difference. Does not take modifier into account. */
setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_GIVER = [
    0.5, /* -6 */
    0.7, /* -5 */
    0.8, /* -4 */
    0.9, /* -3 */
    1.0, /* -2 */
    1.0, /* -1 */
    1.0, /* 0 */
    1.1, /* 1 */
    1.2, /* 2 */
    1.3, /* 3 */
    1.4, /* 4 */
    1.5, /* 5 */
    1.7, /* 6 */
];
/* Multiplie arousal on taker based on bodypart size difference. Does not take modifier into account. */
setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_RECEIVER = [
    0.5, /* -6 */
    0.7, /* -5 */
    0.8, /* -4 */
    0.9, /* -3 */
    1.0, /* -2 */
    1.0, /* -1 */
    1.0, /* 0 */
    1.1, /* 1 */
    1.2, /* 2 */
    1.3, /* 3 */
    1.4, /* 4 */
    1.5, /* 5 */
    1.0, /* 6 */
];
/* =========================
    TEXT
========================= */
/* Ambience text shown every this many turns */
setup.Sex.AMBIENCE_TURNS = 10;
