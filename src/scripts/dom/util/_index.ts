import { interactiveSexTooltip } from "../menu/interactivesex";
import async from "./async";
import cardnamerep from "./cardnamerep";
import exception from "./exception";
import favor from "./favor";
import filter from "./filter";
import filterable from "./filterable";
import friendship from "./friendship";
import help from "./help";
import image from "./image";
import include from "./include";
import include_replace from "./include_replace";
import level from "./level";
import menuitem from "./menuitem";
import message from "./message";
import money from "./money";
import name from "./name";
import onevent from "./onevent";
import outcome from "./outcome";
import prestige from "./prestige";
import rep from "./rep";
import table from "./table";
import twee from "./twee";

/**
 * Stores util functions that returns another dom object
 */
export const DOM_Util = {
  ...async,
  ...cardnamerep,
  ...exception,
  ...favor,
  ...filter,
  ...filterable,
  ...friendship,
  ...help,
  ...image,
  ...include_replace,
  ...include,
  ...level,
  ...menuitem,
  ...message,
  ...money,
  ...name,
  ...onevent,
  ...outcome,
  ...prestige,
  ...rep,
  ...table,
  ...twee,
  interactiveSexTooltip,
};
