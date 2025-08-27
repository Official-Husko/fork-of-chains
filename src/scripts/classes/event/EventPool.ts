import { TwineClass } from "../_TwineClass";
import type { Deck } from "../deck/Deck";
import type { Rarity } from "../deck/Rarity";
import type { UnitKey } from "../unit/Unit";
import type { EventInstance } from "./EventInstance";
import type { EventTemplate, EventTemplateKey } from "./EventTemplate";

export interface ScheduledEventInfo {
  event_key: EventTemplateKey;
  default_assignment_keys: ActorUnitKeyMap;
  is_visible_in_calendar?: boolean;
}

export interface ScheduledEventInfoRealized {
  occur_week: number;
  events: Array<{
    event: EventTemplate;
    is_visible_in_calendar: boolean;
  }>;
}

/**
 * Special variable $eventpool set to this.
 */
export class EventPool extends TwineClass {
  /**
   * Maps from week to event that is scheduled for that week.
   */
  schedule: { [week in number | string]?: ScheduledEventInfo[] } = {};

  done_on_week: number | null = null;

  /** How many scheduled events does this unit have in the future? will prevent the unit from being deleted */
  unit_scheduled_events: { [k in UnitKey]?: number } = {};

  constructor() {
    super();
  }

  /**
   * Registered events (static field)
   */
  static event_rarity_map: { [k in EventTemplateKey]?: Rarity } = {};

  //
  /**
   * Static method to register a new event
   */
  static registerEvent(event: EventTemplate, rarity: Rarity) {
    if (event.key in setup.EventPool.event_rarity_map) {
      return; // event already registered
    }
    setup.EventPool.event_rarity_map[event.key] = rarity;
  }

  getDeck(): Deck<EventTemplateKey> {
    return setup.Deck.get(`eventpooldeck`);
  }

  static getEventUnitAssignmentRandom(
    event: EventTemplate,
    default_assignment?: ActorUnitMap,
  ): ActorUnitMap | null {
    const MAX_TRIES = 10;
    let unit_restrictions = event.getUnitRestrictions();

    for (let _attempt = 0; _attempt < MAX_TRIES; ++_attempt) {
      let assignment: ActorUnitMap = {};
      let used_unit_keys: Record<UnitKey, boolean> = {};
      let ok = true;

      // first, fill in as many as you can from default_assignment
      if (default_assignment) {
        for (const actor_key in unit_restrictions) {
          if (actor_key in default_assignment) {
            const unit = default_assignment[actor_key];
            used_unit_keys[unit.key] = true;
            assignment[actor_key] = unit;
          }
        }
      }

      // next, fill in the rest with random units from your company
      // NEVER, EVER change this order below. This is because the order is important for
      // setup.qres.RememberUnit
      for (let actor_key in unit_restrictions) {
        // if already filled by default option, don't reassign
        if (actor_key in assignment) continue;

        let restrictions = unit_restrictions[actor_key];
        let candidates = [];
        let base_unit_choices =
          setup.QuestPool.getYourUnitBaseCandidates(restrictions);
        for (const unit of base_unit_choices) {
          if (unit.key in used_unit_keys) continue;
          if (
            !setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(
              unit,
              restrictions,
            )
          )
            continue;
          candidates.push(unit);
        }
        if (!candidates.length) {
          ok = false;
          break;
        }
        let chosen = candidates[Math.floor(Math.random() * candidates.length)];
        used_unit_keys[chosen.key] = true;
        assignment[actor_key] = chosen;
      }
      if (!ok) continue;
      return assignment;
    }

    return null;
  }

  static finalizeEventAssignment(
    event: EventTemplate,
    assignment: ActorUnitMap,
    default_assignment?: ActorUnitMap,
  ) {
    let actors = setup.QuestPool.instantiateActors(event, default_assignment);
    if (!actors) {
      // not found
      return null;
    }

    for (const actor_key in actors) {
      assignment[actor_key] = actors[actor_key];
    }
    return assignment;
  }

  _finalizeEvent(eventinstance: EventInstance) {
    State.variables.statistics.add("events", 1);
    const event = eventinstance.getEvent();
    const cooldown = event.getCooldown();
    if (cooldown) {
      const previous_cooldown = State.variables.calendar.getCooldown(event);
      State.variables.calendar.setCooldown(
        event,
        Math.max(previous_cooldown, cooldown),
      );
    }
    eventinstance.applyRewards();
  }

  getEventInstance(): EventInstance | null {
    // returns an event instance, actor_assignment], or null if done.
    // also do all the corresponding bookkeeping.
    let week = State.variables.calendar.getWeek();

    // Get scheduled events
    while (this.schedule[week]?.length ?? 0 > 0) {
      const scheduled = this.schedule[week]!;

      const eventinfo = scheduled[0];
      scheduled.splice(0, 1);

      if (!scheduled.length) {
        delete this.schedule[week];
      }

      // make unit available for deletion, if appropriate
      this.cleanEvent(eventinfo);

      const event = setup.event[eventinfo.event_key];

      const default_assignment: ActorUnitMap = {};
      let assignment_ok = true;
      for (const [actor_key, unit_key] of objectEntries(
        eventinfo.default_assignment_keys,
      )) {
        if (!(unit_key in State.variables.unit)) {
          // Unit is already gone. Cancel event.
          assignment_ok = false;
          break;
        }
        default_assignment[actor_key] = State.variables.unit[unit_key];
      }

      if (!assignment_ok) {
        // some of the units involved in the event is gone
        continue;
      }

      let assignment = setup.EventPool.getEventUnitAssignmentRandom(
        event,
        default_assignment,
      );
      if (assignment) {
        this.done_on_week = week;
        let finalized_assignment = setup.EventPool.finalizeEventAssignment(
          event,
          assignment,
          default_assignment,
        );
        if (!finalized_assignment) {
          // cannot find assignment
          continue;
        }
        let eventinstance = new setup.EventInstance(
          event,
          finalized_assignment,
        );
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

    let finalized_assignment = setup.EventPool.finalizeEventAssignment(
      eventobj.event,
      eventobj.assignment,
    );
    if (!finalized_assignment) return null;
    let eventinstance = new setup.EventInstance(
      eventobj.event,
      finalized_assignment,
    );
    return eventinstance;
  }

  /**
   * Generates an event. Does not run it or do any calc on it.
   * @returns [event, unit_assignmeet] is found, null otherwise.
   */
  _pickEvent(
    priority_only?: boolean,
  ): { event: EventTemplate; assignment: ActorUnitMap } | null {
    const candidates: Array<{
      rarity: Rarity;
      object: EventTemplate;
    }> = [];

    for (const [event_key, rarity] of objectEntries(
      EventPool.event_rarity_map,
    )) {
      candidates.push({
        rarity: rarity,
        object: setup.event[event_key],
      });
    }

    const zero = candidates.filter((event_obj) => {
      return event_obj.rarity.isForced() && event_obj.object.isCanGenerate();
    });

    setup.rng.shuffleArray(zero);
    for (const candidate of zero) {
      const assignment = setup.EventPool.getEventUnitAssignmentRandom(
        candidate.object,
      );
      if (assignment)
        return { event: candidate.object, assignment: assignment };
    }

    if (zero.length) {
      // Despite having some "should trigger" event, the event cannot trigger. Skip it.
      console.warn(
        "The following events should trigger, but some factor prevents it.",
      );
      console.warn(zero);
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
          candidates
            .filter((event_obj) => !event_obj.rarity.isForced())
            .map((event_obj) => {
              return { object: event_obj.object.key, rarity: event_obj.rarity };
            }),
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
   */
  scheduleEvent(
    event: EventTemplate,
    occur_week: number,
    default_assignment: ActorUnitMap,
    is_visible_in_calendar?: boolean,
  ) {
    const current_week = State.variables.calendar.getWeek();
    if (occur_week < current_week) {
      throw new Error(
        `Event ${event.getName()} is scheduled for week ${occur_week}, ` +
          `but it's already week ${current_week}!`,
      );
    }

    const parsed_default_assignment: ActorUnitKeyMap = {};
    if (default_assignment) {
      for (const actor_name in default_assignment) {
        const unit = default_assignment[actor_name];
        parsed_default_assignment[actor_name] = unit.key;

        this.unit_scheduled_events[unit.key] =
          (this.unit_scheduled_events[unit.key] || 0) + 1;
      }
    }

    (this.schedule[occur_week] ??= []).push({
      event_key: event.key,
      default_assignment_keys: parsed_default_assignment,
      is_visible_in_calendar: is_visible_in_calendar,
    });

    if (is_visible_in_calendar) {
      const trigger = occur_week - State.variables.calendar.getWeek();
      setup.notify(`${event.getName()} will trigger in ${trigger} weeks.`);
    } else if (State.variables.gDebug) {
      setup.notify(
        `<span class="debug-info">DEBUG: Hidden event ${event.getName()} is scheduled to trigger in week ${occur_week}.</span>`,
      );
    }
  }

  isEventScheduled(event: EventTemplate): boolean {
    for (const [occur_week, scheduled] of objectEntries(this.schedule)) {
      if (+occur_week >= State.variables.calendar.getWeek()) {
        if (scheduled!.filter((info) => info.event_key == event.key).length) {
          return true;
        }
      }
    }
    return false;
  }

  unscheduleEvent(event: EventTemplate): void {
    // removes all scheduled events of this variety.
    for (const [occur_week, scheduled] of objectEntries(this.schedule)) {
      for (let to_be_deleted of scheduled!.filter(
        (info) => info.event_key == event.key,
      )) {
        this.cleanEvent(to_be_deleted);
      }
      this.schedule[occur_week] = scheduled!.filter(
        (info) => info.event_key != event.key,
      );
    }
  }

  isUnitScheduledForEvent(unit: Unit): boolean {
    return unit.key in this.unit_scheduled_events;
  }

  cleanEvent(event_info: ScheduledEventInfo): void {
    let default_assignment_keys = event_info.default_assignment_keys;

    for (const key of Object.values(default_assignment_keys)) {
      if (!(key in this.unit_scheduled_events))
        throw new Error(
          `Unit ${key} not found in unit scheduled event! BUG somewhere`,
        );
      this.unit_scheduled_events[key]! -= 1;

      if (this.unit_scheduled_events[key] == 0) {
        // unit no longer scheduled for any events. Delete it if necessary
        delete this.unit_scheduled_events[key];
        State.variables.unit[key].checkDelete();
      }
    }
  }

  /**
   * Get list of all scheduled events
   */
  getScheduledEvents({
    is_visible_in_calendar,
  }: {
    is_visible_in_calendar: boolean;
  }): ScheduledEventInfoRealized[] {
    const result: ScheduledEventInfoRealized[] = [];

    const occur_weeks = Object.keys(this.schedule).map((week) =>
      parseInt(week),
    );
    occur_weeks.sort();

    for (const occur_week of occur_weeks) {
      let arr = this.schedule[occur_week]!.map((x) => {
        return {
          event: setup.event[x.event_key],
          is_visible_in_calendar: !!x.is_visible_in_calendar,
        };
      });
      if (is_visible_in_calendar) {
        arr = arr.filter((x) => x.is_visible_in_calendar);
      }
      if (arr.length) {
        result.push({
          occur_week: occur_week,
          events: arr,
        });
      }
    }
    return result;
  }

  getNextVisibleEvents(): ScheduledEventInfoRealized | null {
    const all_events = this.getScheduledEvents({
      is_visible_in_calendar: true,
    });
    if (!all_events.length) {
      return null;
    } else {
      return all_events[0];
    }
  }
}
