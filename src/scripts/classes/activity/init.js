/**
 * ActivityTemplateInitFuck
 * -----------------------------------------------------------------------------
 * Initializes and registers a set of sexual activity templates for the game.
 * Defines a variety of sexual activities, their requirements, critical/disaster traits,
 * rarity, and associated rooms. Each activity is registered as an ActivityTemplate
 * with all necessary configuration for use in the activity system.
 *
 * Key Responsibilities:
 * - Defines author metadata for attribution.
 * - Specifies trait arrays for critical and disaster weighting.
 * - Configures room types for slave and slaver activities.
 * - Enumerates all sexual activity types, their requirements, and restrictions.
 * - Dynamically generates and registers ActivityTemplate objects for each activity.
 *
 * Usage:
 *   setup.ActivityTemplateInitFuck();
 *   // Registers all defined sexual activities as templates in the system.
 */

setup.ActivityTemplateInitFuck = function () {
  const rarity_default = setup.rarity.rare
  const veryrare = setup.rarity.epic

  // Author metadata for all activities defined in this function.
  const authordata = {
    name: "Innoxia",
    url: "https://lilithsthrone.blogspot.com/",
  }

  // Trait arrays for weighting activity selection (critical/disaster traits).
  const horny_c = Object.freeze(["per_lustful", "per_sexaddict"]);
  /** @type {string[]} */
  const horny_d = [];
  const cruel_c = Object.freeze(["per_cruel"]);
  const cruel_d = Object.freeze(["per_kind", "per_honorable"]);
  const weird_c = Object.freeze(["per_lunatic", "per_playful"]);
  const weird_d = Object.freeze(["per_stubborn"]);

  const default_horny_abuse_crit = horny_c.concat(cruel_c);
  const default_horny_abuse_disaster = horny_d.concat(cruel_d);

  // Room type arrays for slave and slaver activities.
  const slave_rooms = Object.freeze(["dungeons"]);
  const slaver_rooms = Object.freeze(["lodgings"]);

  /**
   * Helper to build requirements for actor 'a' (the slaver).
   * @param {any} unit_bodypart
   * @returns {any[]}
   */
  function getActorARequirements(unit_bodypart) {
    return [
      setup.qres.Job(setup.job.slaver),
      setup.qres.NoTrait(setup.trait.per_chaste),
      setup.qres.RememberUnit(),
      ...unit_bodypart.getHasRestrictions(),
    ];
  }

  /**
   * Helper to build requirements for actor 'b' (the slave or slaver target).
   * @param {string} type
   * @param {any} target_bodypart
   * @returns {any[]}
   */
  function getActorBRequirements(type, target_bodypart) {
    /** @type {any[]} */
    let bres = [];
    if (type === "slave") {
      bres = [
        setup.qres.Job(setup.job.slave),
        setup.qres.CanBeUsedByRememberedUnit(),
      ];
      if (target_bodypart === setup.sexbodypart.penis) {
        bres.push(
          setup.qres.AnyTrait([
            setup.trait.dick_tiny,
            setup.trait.dick_small,
            setup.trait.dick_medium,
            setup.trait.dick_large,
            setup.trait.dick_huge,
            setup.trait.dick_titanic,
          ], true)
        );
      }
    } else if (type === "slaver") {
      bres = [
        setup.qres.Job(setup.job.slaver),
        setup.qres.NoTrait(setup.trait.per_chaste),
      ];
    }
    return bres.concat(target_bodypart.getHasRestrictions());
  }

  /**
   * Helper to generate a dialogue macro string for a given actor.
   * @param {string} actorKey - "unit_dialogue" or "target_dialogue"
   * @param {any} fuckdata
   * @returns {string}
   */
  function getDialogueMacro(actorKey, fuckdata) {
    return `<<set _dialogue = setup.Text.Dirty.talk({strip: true, unit: $g.a, target: $g.b, unit_bodypart: setup.sexbodypart.${fuckdata.unit_bodypart.key}, target_bodypart: setup.sexbodypart.${fuckdata.target_bodypart.key}})>> <<= _dialogue.${actorKey} >>`;
  }

  /**
   * Array of sexual activity configuration objects.
   * Each object defines the name, room(s), critical/disaster traits, type (slave/slaver),
   * body parts involved, rarity, and any additional restrictions for the activity.
   *
   * Example entry:
   *   {
   *     name: "Fuck a slave",
   *     rooms: ["dungeons"],
   *     crits: [...],
   *     disaster: [...],
   *     type: "slave",
   *     unit_bodypart: setup.sexbodypart.penis,
   *     target_bodypart: setup.sexbodypart.vagina,
   *   }
   */
  const fucks = [
    {
      name: "Fuck a slave",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.vagina,
    },
    {
      name: "Buttfuck a slave",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_anus)],
    },
    {
      name: "Tailfuck a slave",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit.concat(weird_c),
      disaster: default_horny_abuse_disaster.concat(weird_d),
      type: "slave",
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.vagina,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_tail)],
    },
    {
      name: "Anal Tailfuck a slave",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit.concat(weird_c),
      disaster: default_horny_abuse_disaster.concat(weird_d),
      type: "slave",
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
        setup.qres.HasItem(setup.item.sexmanual_bodypart_anus),
      ],
    },
    {
      name: "Facefuck a slave",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.mouth,
    },
    {
      name: "Have a slave eat you out",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.mouth,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_penetration_mouthhole)],
    },
    {
      name: "Have a slave fuck you",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.penis,
    },
    {
      name: "Have a slave tailfuck you",
      rooms: slave_rooms,
      crits: default_horny_abuse_crit,
      disaster: default_horny_abuse_disaster,
      type: "slave",
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.tail,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_tail)],
    },
    {
      name: "Consensual vaginal",
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: "slaver",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.vagina,
    },
    {
      name: "Consensual anal",
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: "slaver",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_bodypart_anus)],
    },
    {
      name: "Consensual anal tailfuck",
      rooms: slaver_rooms,
      crits: horny_c.concat(weird_c),
      disaster: horny_d.concat(weird_d),
      type: "slaver",
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.anus,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
        setup.qres.HasItem(setup.item.sexmanual_bodypart_anus),
      ],
    },
    {
      name: "Consensual tailfuck",
      rooms: slaver_rooms,
      crits: horny_c.concat(weird_c),
      disaster: horny_d.concat(weird_d),
      type: "slaver",
      rarity: veryrare,
      unit_bodypart: setup.sexbodypart.tail,
      target_bodypart: setup.sexbodypart.vagina,
      restriction: [
        setup.qres.HasItem(setup.item.sexmanual_bodypart_tail),
      ],
    },
    {
      name: "Consensual oral",
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: "slaver",
      unit_bodypart: setup.sexbodypart.penis,
      target_bodypart: setup.sexbodypart.mouth,
    },
    {
      name: "Consensual cunnilingus",
      rooms: slaver_rooms,
      crits: horny_c,
      disaster: horny_d,
      type: "slaver",
      unit_bodypart: setup.sexbodypart.vagina,
      target_bodypart: setup.sexbodypart.mouth,
      restriction: [setup.qres.HasItem(setup.item.sexmanual_penetration_mouthhole)],
    },
  ]

  // For each activity configuration, build actor requirements and restrictions based on type.
  // Add trait-based restrictions for certain body parts (e.g., penis size for target_bodypart).
  for (const fuckdata of fucks) {
    /**
     * Dialogue object for actor 'a'.
     * Uses a dynamic macro to generate dirty talk for the activity.
     * @type {Dialogue}
     */
    const dialogue_a = {
      actor: "a",
      // @ts-ignore
      texts: [getDialogueMacro("unit_dialogue", fuckdata)],
    };
    /**
     * Dialogue object for actor 'b'.
     * Uses a dynamic macro to generate dirty talk for the activity.
     * @type {Dialogue}
     */
    const dialogue_b = {
      actor: "b",
      // @ts-ignore
      texts: [getDialogueMacro("target_dialogue", fuckdata)],
    };

    // Register the activity as a new ActivityTemplate with all configuration options.
    new setup.ActivityTemplate({
      key: setup.getKeyFromName(fuckdata.name, setup.activitytemplate),
      name: fuckdata.name,
      author: authordata,
      tags: [],
      actor_unitgroups: {
        "a": getActorARequirements(fuckdata.unit_bodypart),
        "b": getActorBRequirements(fuckdata.type, fuckdata.target_bodypart),
      },
      // @ts-ignore
      critical_traits: fuckdata.crits.map(key => setup.selfOrObject(key, setup.trait)),
      // @ts-ignore
      disaster_traits: fuckdata.disaster.map(key => setup.selfOrObject(key, setup.trait)),
      restrictions: fuckdata.restriction || [],
      rarity: fuckdata.rarity ? fuckdata.rarity : rarity_default,
      dialogues: [dialogue_a, dialogue_b],
      // @ts-ignore
      room_templates: fuckdata.rooms.map(key => setup.selfOrObject(key, setup.roomtemplate)),
    });
  }
}
