import { Args_OneActor, MacroUtil } from "../../../macro/_metadata";
import { Text } from "../../text";

/**
 * Unit macro utilities
 *
 * This file contains helper functions used by the unit macro registration and
 * handlers. They are thin wrappers that resolve unit references (keys or
 * instances), call project-level `Text` helpers to obtain raw strings, and
 * insert the resulting text into the passage DOM using the project's twee
 * conversion utility.
 *
 * Important runtime assumptions:
 * - The global `resolveObject` function is available (it is registered in
 *   `src/scripts/_init/preinit_base.ts` and uses `SetupUtil.resolveObject`).
 * - `State`, `setup`, and `setup.DOM.Util.twee` are available in the runtime
 *   (the Twine/SugarCube environment provides these globally).
 *
 * These helpers intentionally do not attempt to replicate `resolveObject`
 * behaviour; they simply call the shared implementation to keep resolution
 * consistent across the codebase.
 */

export function internalOutput(
  output: HTMLElement | DocumentFragment,
  func: (unit: Unit) => string,
  unit_raw: Unit | UnitKey,
  article?: boolean,
) {
  // Resolve keys (UnitKey) into live Unit objects using the global helper.
  const unit =
    typeof unit_raw === "string" || typeof unit_raw === "number"
      ? (resolveObject(unit_raw as UnitKey, State.variables.unit) as Unit)
      : (unit_raw as Unit);

  // Call the provided helper to obtain the human-readable string for the unit.
  let raw = func(unit);

  // Optionally prefix the phrase with an English article using the project's
  // `setup.Article` helper. This mirrors historical behavior across macros.
  if (article) raw = setup.Article(raw);

  // Convert any twee/wiki markup to DOM nodes and append to the output node.
  output.append(setup.DOM.Util.twee(raw));
}

export function internalOutputUnitTarget<T extends Unit | null>(
  output: HTMLElement | DocumentFragment,
  func: (arg: { unit: Unit; target: T }) => string,
  unit_raw: Unit | UnitKey,
  target_raw: T | UnitKey | null,
) {
  const unit =
    typeof unit_raw === "string" || typeof unit_raw === "number"
      ? (resolveObject(unit_raw as UnitKey, State.variables.unit) as Unit)
      : (unit_raw as Unit);

  const target =
    target_raw &&
    (typeof target_raw === "string" || typeof target_raw === "number")
      ? (resolveObject(target_raw as UnitKey, State.variables.unit) as Unit)
      : (target_raw as T | null);

  const raw = func({ unit, target: target as T });
  output.append(setup.DOM.Util.twee(raw));
}

// Re-export for convenience in other files.
export { Args_OneActor, MacroUtil, Text };
