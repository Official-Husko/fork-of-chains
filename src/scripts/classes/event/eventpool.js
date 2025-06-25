/**
 * @file eventpool.js
 * @module EventPool
 * @description
 * Manages the scheduling, registration, assignment, and instantiation of in-game events. Handles event rarity, deck drawing, assignment of units to event actors, and event scheduling for future weeks. Provides robust error handling, efficient assignment algorithms, and utilities for event lifecycle management.
 *
 * @class EventPool
 * @extends setup.TwineClass
 */
setup.EventPool = class EventPool extends setup.TwineClass {
  /**
   * Constructs a new EventPool instance, initializing all scheduling and tracking structures.
   * @constructor
   */
  constructor() {
    super();
    /**
     * Maps from week number to an array of scheduled event info objects for that week.
     * Used to manage which events are scheduled for which weeks.
     * @type {Object<number, Array<ScheduledEventInfo>>}
     */
    this.schedule = {};
    /**
     * The week number when the last event was completed.
     * @type {number|null}
     */
    this.done_on_week = null;
    /**
     * Tracks how many scheduled events each unit has in the future, preventing deletion of units with pending events.
     * @type {Object<string, number>}
     */
    this.unit_scheduled_events = {};
  }

  /**
   * Static map of registered event keys to their rarity objects.
   * @type {Object<string, setup.Rarity>}
   */
  static event_rarity_map = {};

  /**
   * Registers a new event and its rarity in the event pool.
   * Prevents duplicate registration.
   * @param {setup.Event} event - The event to register.
   * @param {setup.Rarity} rarity - The rarity of the event.
   */
  static registerEvent(event, rarity) {
    if (event.key in setup.EventPool.event_rarity_map) {
      return; // Event already registered
    }
    setup.EventPool.event_rarity_map[event.key] = rarity;
  }

  /**
   * Retrieves the deck object used for event selection.
   * @returns {setup.Deck} The deck for event pool draws.
   */
  getDeck() {
    return setup.Deck.get("eventpooldeck");
  }

  /**
   * Attempts to assign units to event actors, using default assignments where possible and random assignment otherwise.
   * Ensures no duplicate units and that all restrictions are satisfied.
   * @param {setup.Event} event - The event to assign units for.
   * @param {object=} default_assignment - Optional default assignment of units to actors.
   * @returns {object|null} Assignment object mapping actor names to unit objects, or null if assignment fails.
   */
  static getEventUnitAssignmentRandom(event, default_assignment) {
    const MAX_TRIES = 10;
    const unit_restrictions = event.getUnitRestrictions();
    for (let _attempt = 0; _attempt < MAX_TRIES; ++_attempt) {
      /** @type {any} */
      const assignment = {};
      /** @type {any} */
      const used_unit_keys = {};
      let ok = true;
      // Fill in as many as possible from default_assignment
      if (default_assignment) {
        for (const actor_key in unit_restrictions) {
          // @ts-ignore
          if (actor_key in default_assignment) {
            // @ts-ignore
            const unit = default_assignment[actor_key];
            // @ts-ignore
            used_unit_keys[unit.key] = true;
            // @ts-ignore
            assignment[actor_key] = unit;
          }
        }
      }
      // Fill in the rest with random units from the company, preserving order for deterministic assignment
      for (const actor_key in unit_restrictions) {
        if (actor_key in assignment) continue;
        const restrictions = unit_restrictions[actor_key];
        const base_unit_choices = setup.QuestPool.getYourUnitBaseCandidates(restrictions);
        const candidates = base_unit_choices.filter(unit =>
          // @ts-ignore
          !(unit.key in used_unit_keys) && setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, restrictions)
        );
        if (!candidates.length) {
          ok = false;
          break;
        }
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        // @ts-ignore
        used_unit_keys[chosen.key] = true;
        // @ts-ignore
        assignment[actor_key] = chosen;
      }
      if (!ok) continue;
      return assignment;
    }
    return null;
  }

  /**
   * Finalizes the assignment of units to event actors, instantiating actors as needed.
   * @param {setup.Event} event - The event to finalize assignment for.
   * @param {object} assignment - The current assignment of units to actors.
   * @param {object=} default_assignment - Optional default assignment for fallback.
   * @returns {object|null} Finalized assignment or null if instantiation fails.
   */
  static finalizeEventAssignment(event, assignment, default_assignment) {
    // @ts-ignore
    const actors = setup.QuestPool.instantiateActors(event, default_assignment || {});
    if (!actors) {
      // Instantiation failed
      return null;
    }
    for (const actor_key in actors) {
      // @ts-ignore
      assignment[actor_key] = actors[actor_key];
    }
    return assignment;
  }

  /**
   * Applies rewards and cooldowns, and updates statistics for a completed event instance.
   * @param {setup.EventInstance} eventinstance - The completed event instance.
   * @private
   */
  _finalizeEvent(eventinstance) {
    State.variables.statistics.add("events", 1);
    const event = eventinstance.getEvent();
    const cooldown = event.getCooldown();
    if (cooldown) {
      const previous_cooldown = State.variables.calendar.getCooldown(event);
      State.variables.calendar.setCooldown(event, Math.max(previous_cooldown, cooldown));
    }
    eventinstance.applyRewards();
  }

  /**
   * Retrieves and instantiates the next scheduled or random event for the current week, handling all bookkeeping.
   * @returns {setup.EventInstance|null} The next event instance, or null if no event is available.
   */
  getEventInstance() {
    // returns an event instance, actor_assignment], or null if done.
    // also do all the corresponding bookkeeping.
    let week = State.variables.calendar.getWeek();

    // Get scheduled events
    while (week in this.schedule && this.schedule[week].length) {
      const scheduled = this.schedule[week];

      /**
       * @type {ScheduledEventInfo}
       */
      const eventinfo = scheduled[0];
      scheduled.splice(0, 1);

      if (!scheduled.length) {
        delete this.schedule[week];
      }

      // make unit available for deletion, if appropriate
      this.cleanEvent(eventinfo);

      const event = setup.event[eventinfo.event_key];

      const default_assignment = {};
      let assignment_ok = true;
      for (const actor_key in eventinfo.default_assignment_keys) {
        const unit_key = eventinfo.default_assignment_keys[actor_key];
        // @ts-ignore
        if (!(unit_key in State.variables.unit)) {
          // Unit is already gone. Cancel event.
          assignment_ok = false;
          break;
        }
        // @ts-ignore
        default_assignment[actor_key] = State.variables.unit[unit_key];
      }

      if (!assignment_ok) {
        // some of the units involved in the event is gone
        continue;
      }

      let assignment = setup.EventPool.getEventUnitAssignmentRandom(event, default_assignment);
      if (assignment) {
        this.done_on_week = week;
        let finalized_assignment = setup.EventPool.finalizeEventAssignment(event, assignment, default_assignment);
        if (!finalized_assignment) {
          // cannot find assignment
          continue;
        }
        let eventinstance = new setup.EventInstance(event, finalized_assignment);
        return eventinstance;
      }
    }

    // Get random events
    let priority_only = false;
    if (this.done_on_week == week) {
      priority_only = true;
    }
    this.done_on_week = week;

    let eventobj = this._pickEvent(priority_only);

    if (!eventobj) return null;

    let finalized_assignment = setup.EventPool.finalizeEventAssignment(eventobj.event, eventobj.assignment);
    if (!finalized_assignment) return null;
    let eventinstance = new setup.EventInstance(eventobj.event, finalized_assignment);
    return eventinstance;
  }

  // generates an event. Does not run it or do any calc on it. Returns
  // [event, unit_assingmnet] is found, null otherwise.
  /**
   * @param {boolean} priority_only 
   * @returns {{event: setup.Event, assignment: any} | null}
   */
  _pickEvent(priority_only) {
    const candidates = [];

    for (const event_key in setup.EventPool.event_rarity_map) {
      candidates.push({
        rarity: setup.EventPool.event_rarity_map[event_key],
        object: setup.event[event_key]
      });
    }

    const zero = candidates.filter(event_obj => {
      return (
        event_obj.rarity.isForced() &&
        event_obj.object.isCanGenerate()
      );
    });

    setup.rng.shuffleArray(zero);
    for (const candidate of zero) {
      const assignment = setup.EventPool.getEventUnitAssignmentRandom(candidate.object);
      if (assignment) return { event: candidate.object, assignment: assignment };
    }

    if (zero.length) {
      // Despite having some "should trigger" event, the event cannot trigger. Skip it.
      console.log("The following events should trigger, but some factor prevents it.")
      console.log(zero)
    }

    // if only priority quest, then stop here
    if (priority_only) {
      return null;
    }

    // otherwise, draw from deck
    const deck = this.getDeck();
    for (let i = 0; i < setup.DECK_DRAW_RETRIES_EVENT; ++i) {
      if (deck.isEmpty()) {
        deck.regenerateDeck(
          candidates.filter(event_obj => !event_obj.rarity.isForced()).map(event_obj => {
            return { object: event_obj.object.key, rarity: event_obj.rarity }
          })
        );
      }
      const drawn = deck.drawCard();
      const event = setup.event[drawn];
      if (event && event.isCanGenerate()) {
        const assignment = setup.EventPool.getEventUnitAssignmentRandom(event);
        if (assignment) {
          return { event: event, assignment: assignment };
        }
      }
    }

    return null;
  }

  /**
   * Schedule an event to occur in a certain future week.
   * 
   * @param {setup.Event} event 
   * @param {number} occur_week 
   * @param {object} default_assignment 
   * @param {boolean} [is_visible_in_calendar]
   */
  scheduleEvent(event, occur_week, default_assignment, is_visible_in_calendar) {
    const current_week = State.variables.calendar.getWeek();
    if (occur_week < current_week) {
      throw new Error(
        `Event ${event.getName()} is scheduled for week ${occur_week}, ` +
        `but it's already week ${current_week}!`)
    }

    if (!(occur_week in this.schedule)) {
      this.schedule[occur_week] = [];
    }

    /**
     * @type {Object<string, string>}
     */
    const parsed_default_assignment = {};
    if (default_assignment) {
      for (const actor_name in default_assignment) {
        // @ts-ignore
        const unit = default_assignment[actor_name];
        parsed_default_assignment[actor_name] = unit.key;
        if (!(unit.key in this.unit_scheduled_events)) {
          this.unit_scheduled_events[unit.key] = 0;
        }
        this.unit_scheduled_events[unit.key] += 1;
      }
    }

    this.schedule[occur_week].push({
      event_key: event.key,
      default_assignment_keys: parsed_default_assignment,
      is_visible_in_calendar: is_visible_in_calendar,
    });

    if (is_visible_in_calendar) {
      const trigger = occur_week - State.variables.calendar.getWeek();
      setup.notify(`${event.getName()} will trigger in ${trigger} weeks.`);
    } else if (State.variables.gDebug) {
      setup.notify(`DEBUG: Hidden event ${event.getName()} is scheduled to trigger in week ${occur_week}.`);
    }
  }

  /**
   * Checks if an event is scheduled for the future.
   * Uses Array.prototype.some for early exit and performance.
   * @param {setup.Event} event - The event to check.
   * @returns {boolean} True if the event is scheduled for any future week, false otherwise.
   */
  isEventScheduled(event) {
    const currentWeek = State.variables.calendar.getWeek();
    return Object.entries(this.schedule).some(([occur_week, infos]) =>
      +occur_week >= currentWeek && infos.some((/** @type {any} */ info) => info.event_key === event.key)
    );
  }

  /**
   * Unschedules an event, removing it from all future weeks.
   * Uses filter and forEach for clarity and performance.
   * @param {setup.Event} event - The event to unschedule.
   */
  unscheduleEvent(event) {
    for (const occur_week in this.schedule) {
      const infos = this.schedule[occur_week];
      infos.filter(info => info.event_key === event.key).forEach(to_be_deleted => this.cleanEvent(to_be_deleted));
      this.schedule[occur_week] = infos.filter(info => info.event_key !== event.key);
    }
  }

  /**
   * Checks if a unit is scheduled for any event in the future.
   * @param {setup.Unit} unit - The unit to check.
   * @returns {boolean} True if the unit is scheduled for any future event, false otherwise.
   */
  isUnitScheduledForEvent(unit) {
    return unit.key in this.unit_scheduled_events;
  }

  /**
   * Cleans up after an event, updating unit schedules and triggering deletions if necessary.
   * @param {ScheduledEventInfo} event_info - The event info object to clean up.
   */
  cleanEvent(event_info) {
    let default_assignment_keys = event_info.default_assignment_keys;

    for (const key of Object.values(default_assignment_keys)) {
      if (!(key in this.unit_scheduled_events)) throw new Error(`Unit ${key} not found in unit scheduled event! BUG somewhere`);
      this.unit_scheduled_events[key] -= 1;

      if (this.unit_scheduled_events[key] == 0) {
        // unit no longer scheduled for any events. Delete it if necessary
        delete this.unit_scheduled_events[key];
        State.variables.unit[key].checkDelete();
      }
    }
  }

  /**
   * Get list of all scheduled events
   * @param {{
   *   is_visible_in_calendar: boolean
   * }} args
   * 
   * @returns {Array<ScheduledEventInfoRealized>}
   */
  getScheduledEvents({ is_visible_in_calendar }) {
    /**
     * @type {Array<ScheduledEventInfoRealized>}
     */
    const result = [];
    /**
     * @type {Array<number>}
     */
    const occur_weeks = Object.keys(this.schedule).map(week => parseInt(week));
    occur_weeks.sort();
    for (const occur_week of occur_weeks) {
      let arr = this.schedule[occur_week].map(x => {
        return {
          event: setup.event[x.event_key],
          is_visible_in_calendar: x.is_visible_in_calendar,
        }
      });
      if (is_visible_in_calendar) {
        arr = arr.filter(x => x.is_visible_in_calendar);
      }
      if (arr.length) {
        result.push({
          occur_week: occur_week,
          // @ts-ignore
          events: arr,
        });
      }
    }
    return result;
  }

  /**
   * @returns {ScheduledEventInfoRealized | null}
   */
  getNextVisibleEvents() {
    const all_events = this.getScheduledEvents({ is_visible_in_calendar: true });
    if (!all_events.length) {
      return null;
    } else {
      return all_events[0];
    }
  }
}

