/**
 * Unit macro registration entrypoint.
 *
 * This file centralises the registration of all "unit"-related macros used in
 * passages (for example `uadj`, `uadv`, `u<candidate>`, `ua<candidate>`, etc.).
 * The registration is intentionally ordered to ensure lower-level utilities
 * (candidate macros and aliases) are available before higher-level feature
 * groups (adjectives, equipment, greetings, etc.) are registered.
 *
 * Registration order (intentional):
 * 1. Candidate macros (core uX / uXall / uaX / uaXall)
 * 2. Aliases for compatibility
 * 3. Feature groups that build on the candidate macros
 */

import { registerAliases } from "./aliases";
import { registerCandidateMacros } from "./register-candidate-macros";
import { registerAdjectives } from "./sections/adjectives";
import { registerAdverbsAndBanter } from "./sections/adverbs";
import { registerEquipment } from "./sections/equipment";
import { registerFlavor } from "./sections/flavor";
import { registerGreeting } from "./sections/greeting";
import { registerPraiseInsultHobby } from "./sections/praise-insult-hobby";
import { registerPunishRescue } from "./sections/punish-rescue";
import { registerStrip } from "./sections/strip";

// 1) Core uX / uXall / uaX / uaXall macros for all body/prop candidates
registerCandidateMacros();

// 2) Simple alias macros (ubody -> utorso, etc.)
registerAliases();

// 3) Feature groups
registerFlavor();
registerEquipment();
registerAdjectives();
registerAdverbsAndBanter();
registerStrip();
registerPunishRescue();
registerPraiseInsultHobby();
registerGreeting();
