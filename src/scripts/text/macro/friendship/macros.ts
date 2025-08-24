/**
 * Macro registrations for friendship-related inline helpers.
 *
 * Each Macro calls into the label/relations/output helpers to render the
 * appropriate text into the current Twine passage output.
 */

import { getFriendTitle, getFriendSlaveTitle } from "./labels";
import { getFriend, getTheirRel, getNameRel } from "./relations";
import { internalOutput, wikiOutput } from "./output";

// If your TS build doesn't have globals, add minimal ambient declarations:
declare const Macro: any;

/**
 * Macro: <<tfriendtitle amt>> — write a generic friendship title
 */
Macro.add("tfriendtitle", {
  handler() {
    // `this.args` contains the macro arguments provided inline in the passage.
    internalOutput(this.output as HTMLElement, getFriendTitle, ...this.args);
  },
});

/**
 * Macro: <<tfriendslave amt>> — write a slave-oriented friendship phrase
 */
Macro.add("tfriendslave", {
  handler() {
    internalOutput(this.output as HTMLElement, getFriendSlaveTitle, ...this.args);
  },
});

/**
 * Macro: <<ufriend unit1 unit2>> — write unit1's relation label to unit2 (friend/lover/etc)
 */
Macro.add("ufriend", {
  handler() {
    internalOutput(this.output as HTMLElement, getFriend, ...this.args);
  },
});

/**
 * Macro: <<utheirrel unit1 unit2>> — write a wiki-friendly "<<their \"key\">> rel" fragment
 */
Macro.add("utheirrel", {
  handler() {
    wikiOutput(this.output as HTMLElement, getTheirRel, ...this.args);
  },
});

/**
 * Macro: <<unamerel unit1 unit2>> — write "unit1.rep() rel"
 */
Macro.add("unamerel", {
  handler() {
    wikiOutput(this.output as HTMLElement, getNameRel, ...this.args);
  },
});
