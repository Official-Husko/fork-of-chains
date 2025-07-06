"use strict";
// @ts-nocheck
setup.UnitTitle = {};
setup.UnitTitle.UNIT_TITLE_SLAVE_NO_TRAINING = 'Defiant Slave';
setup.UnitTitle.UNIT_TITLE_NONE = 'Generalist';
setup.UnitTitle.UNIT_TITLE_MAP_SINGLE = [
    'Fighter', /* combat */
    'Brawler', /* brawn */
    'Scout', /* survival */
    'Spy', /* intrigue */
    'Slaver', /* slaving */
    'Scholar', /* knowledge */
    'Trader', /* social */
    'Healer', /* aid */
    'Wizard', /* arcane */
    'Whore', /* sex */
];
setup.UnitTitle.UNIT_TITLE_MAP_DOUBLE = [
    [
        '', /* combat combat */
        'Gladiator', /* combat brawn */
        'Archer', /* combat survival */
        'Rogue', /* combat intrigue */
        'Raider', /* combat slaving */
        'Battle Scholar', /* combat knowledge */
        'Bard', /* combat social */
        'Paladin', /* combat aid */
        'Magic Knight', /* combat arcane */
        'Barbarian', /* combat sex */
    ],
    [
        '', /* brawn combat */
        '', /* brawn brawn */
        'Wildman', /* brawn survival */
        'Enforcer', /* brawn intrigue */
        'Breaker', /* brawn slaving */
        'Coach', /* brawn knowledge */
        'Intimidator', /* brawn social */
        'Rescuer', /* brawn aid */
        'Magic Brawler', /* brawn arcane */
        'Actor', /* brawn sex */
    ],
    [
        '', /* survival combat */
        '', /* survival brawn */
        '', /* survival survival */
        'Hunter', /* survival intrigue */
        'Nomad', /* survival slaving */
        'Survivor', /* survival knowledge */
        'Pioneer', /* survival social */
        'Herbalist', /* survival aid */
        'Hermit', /* survival arcane */
        'Beast', /* survival sex */
    ],
    [
        '', /* intrigue combat */
        '', /* intrigue brawn */
        '', /* intrigue survival */
        '', /* intrigue intrigue */
        'Torturer', /* intrigue slaving */
        'Information Broker', /* intrigue knowledge */
        'Socialite', /* intrigue social */
        'Artillery', /* intrigue aid */
        'Invisible', /* intrigue arcane */
        'Kidnapper', /* intrigue sex */
    ],
    [
        '', /* slaving combat */
        '', /* slaving brawn */
        '', /* slaving survival */
        '', /* slaving intrigue */
        '', /* slaving slaving */
        'Experimentor', /* slaving knowledge */
        'Schemer', /* slaving social */
        'Jailor', /* slaving aid */
        'Magus', /* slaving arcane */
        'Sex Slaver', /* slaving sex */
    ],
    [
        '', /* knowledge combat */
        '', /* knowledge brawn */
        '', /* knowledge survival */
        '', /* knowledge intrigue */
        '', /* knowledge slaving */
        '', /* knowledge knowledge */
        'Wiseman', /* knowledge social */
        'Medic', /* knowledge aid */
        'Sage', /* knowledge arcane */
        'Pro', /* knowledge sex */
    ],
    [
        '', /* social combat */
        '', /* social brawn */
        '', /* social survival */
        '', /* social intrigue */
        '', /* social slaving */
        '', /* social knowledge */
        '', /* social social */
        'Caretaker', /* social aid */
        'Mindwasher', /* social arcane */
        'Hustler', /* social sex */
    ],
    [
        '', /* aid combat */
        '', /* aid brawn */
        '', /* aid survival */
        '', /* aid intrigue */
        '', /* aid slaving */
        '', /* aid knowledge */
        '', /* aid social */
        '', /* aid aid */
        'Priest', /* aid arcane */
        'Heal Slut', /* aid sex */
    ],
    [
        '', /* arcane combat */
        '', /* arcane brawn */
        '', /* arcane survival */
        '', /* arcane intrigue */
        '', /* arcane slaving */
        '', /* arcane knowledge */
        '', /* arcane social */
        '', /* arcane aid */
        '', /* arcane arcane */
        'Magic Whore', /* arcane sex */
    ],
];
/**
 * Get the unit's main training. This determines their sex preferences, among other things.
 * @param {setup.Unit} unit
 * @param {boolean} [include_will]  // if true, will return will trait if the slave is still unbroken instead.
 * @returns {setup.Trait}
 */
setup.UnitTitle.getMainTraining = function (unit, include_will) {
    if (unit.isMindbroken())
        return setup.trait.training_mindbreak;
    let trainings = unit.getAllTraitsWithTag('training');
    if (!trainings.length) {
        if (include_will && unit.isDefiant()) {
            // defiant slaves with no training return their will if include will is set to true.
            return unit.getTraitWithTag('will');
        }
        return setup.trait.training_none;
    }
    let maxval = Math.max.apply(Math, trainings.map(function (trait) { return trait.getSlaveValue(); }));
    let eligible = [];
    for (let i = 0; i < trainings.length; ++i) {
        if (trainings[i].getSlaveValue() == maxval)
            eligible.push(trainings[i]);
    }
    if (!eligible.length)
        throw new Error(`??? why is this array empty???`);
    return eligible[unit.Seed('unittraining') % eligible.length];
};
/**
 * @param {setup.Unit} unit
 * @returns {string}
 */
setup.UnitTitle.getTitleSlave = function (unit) {
    let training = this.getMainTraining(unit, /* include will =*/ true);
    return training.text().title;
};
setup.UnitTitle.getTitleSlaver = function (unit) {
    let level = unit.getLevel();
    let targetstat = 8 + level * 1.1;
    let skills = unit.getSkillsBase();
    let high = [];
    for (let i = 0; i < skills.length; ++i) {
        if (skills[i] > targetstat) {
            high.push(i);
        }
    }
    if (!high.length || high.length > 4)
        return this.UNIT_TITLE_NONE;
    if (high.length == 1) {
        return this.UNIT_TITLE_MAP_SINGLE[high[0]];
    }
    // sort
    high.sort((a, b) => skills[b] - skills[a]);
    const base = this.UNIT_TITLE_MAP_DOUBLE[Math.min(high[0], high[1])][Math.max(high[0], high[1])];
    if (high.length == 2)
        return base;
    if (high.length == 3) {
        return `${base}-${this.UNIT_TITLE_MAP_SINGLE[high[2]]}`;
    }
    const suffix = this.UNIT_TITLE_MAP_DOUBLE[Math.min(high[2], high[3])][Math.max(high[2], high[3])];
    return `${base}-${suffix}`;
};
/**
 * @param {setup.Unit} unit
 * @returns
 */
setup.UnitTitle.getTitle = function (unit) {
    // slaver and slave titles are calculated differently.
    if (unit.isSlave()) {
        // find the "highest-scoring" training trait.
        return setup.UnitTitle.getTitleSlave(unit);
    }
    else {
        return setup.UnitTitle.getTitleSlaver(unit);
    }
};
setup.Unit.prototype.getTitle = function () {
    return setup.UnitTitle.getTitle(this);
};
