import { TwineClass } from "./_TwineClass";
import type { ContentTemplate } from "./content/ContentTemplate";

/**
 * Special variable $calendar set to this.
 */
export class Calendar extends TwineClass {
  week = 1;

  last_week_of: {
    [k in ContentType]?: Record<string | number, number>;
  } = {};

  /**
   * `cooldowns['quest']['quest_key'] = xxx`
   * means this quest is on cooldown and cannot be generated.
   */
  cooldowns: {
    [k in ContentType]?: Record<string | number, number>;
  } = {};

  seed?: number;

  constructor() {
    super();
  }

  getWeek(): number {
    return this.week;
  }

  advanceWeek(): void {
    this.week += 1;
    if (this.seed) delete this.seed;

    for (const cdtype in this.cooldowns) {
      const container = this.cooldowns[cdtype as keyof typeof this.cooldowns];
      for (const cdkey in container) {
        container[cdkey] -= 1;
        if (container[cdkey] <= 0) {
          delete container[cdkey];
        }
      }
    }
  }

  /**
   * Prevent this quest/opportunity from being respawned in the next duration weeks.
   */
  setCooldown(obj: ContentTemplate, duration: number) {
    const container = (this.cooldowns[obj.TYPE] ??= {});
    if (duration <= 0) {
      container[obj.key];
    } else {
      container[obj.key] = duration;
    }
    if (State.variables.gDebug) {
      setup.notify(
        `<span class="debug-info">DEBUG: ${obj.TYPE} ${obj.key} is on cooldown for ${duration} weeks.</span>`,
      );
    }
  }

  /**
   * Prevent this quest/opportunity from being respawnd in the next duration weeks.
   */
  getCooldown(obj: ContentTemplate): number {
    return this.cooldowns[obj.TYPE]?.[obj.key] || 0;
  }

  isOnCooldown(obj: ContentTemplate): boolean {
    return !!this.getCooldown(obj);
  }

  record(obj: ContentTemplate) {
    const type = obj.TYPE;
    if (!type) {
      throw new Error(`object must have type to be recorded: ${obj}`);
    }
    (this.last_week_of[type] ??= {})[obj.key] = this.getWeek();
  }

  getLastWeekOf(obj: ContentTemplate): number {
    let type = obj.TYPE;
    if (!type) {
      throw new Error(`object must have type to be get last week of'd: ${obj}`);
    }
    return this.last_week_of[type]?.[obj.key] ?? -setup.INFINITY;
  }

  getSeed(): number {
    if (this.seed) return this.seed;
    this.seed = 1 + Math.floor(Math.random() * 999999997);
    return this.seed;
  }
}
