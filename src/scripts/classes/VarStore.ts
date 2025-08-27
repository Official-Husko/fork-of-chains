import { TwineClass } from "./_TwineClass";

/**
 * Special. Will be assigned to State.variables.varstore
 */
export class VarStore extends TwineClass {
  /** Mapping of: key -> value */
  vars: Record<string, any> = {};

  /** Mapping of: key -> deadline */
  vars_deadline: Record<string, number> = {};

  constructor() {
    super();
  }

  set<T>(key: string, value: T, deadline: number) {
    // if deadline is 0 or negative, will never expires.
    this.vars[key] = value;
    this.vars_deadline[key] = deadline;
    if (State.variables.gDebug) {
      setup.notify(
        `<span class="debug-info">DEBUG: variable ${key} is set to ${value}${deadline != -1 ? ` for ${deadline} weeks` : ""}</span>`,
      );
    }
  }

  get<T = unknown>(key: string) {
    if (!(key in this.vars)) return null;
    return this.vars[key] as T;
  }

  remove(key: string) {
    if (key in this.vars) {
      delete this.vars[key];
      if (!(key in this.vars_deadline))
        throw new Error(`${key} not found in vars deadline`);
      delete this.vars_deadline[key];
      if (State.variables.gDebug) {
        setup.notify(
          `<span class="debug-info">DEBUG: variable ${key} is unset</span>`,
        );
      }
    } else {
      if (State.variables.gDebug) {
        setup.notify(
          `<span class="debug-info">DEBUG: variable ${key} was attempted to be unset, but it's already unset</span>`,
        );
      }
    }
  }

  advanceWeek() {
    let keys = Object.keys(this.vars_deadline);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      this.vars_deadline[key] -= 1;
      if (!this.vars_deadline[key]) {
        this.remove(key);
      }
    }
  }
}
