import { TwineClass } from "../../_TwineClass";
import { SexAction } from "../action/SexAction";
import type { SexAI } from "../ai/SexAI";
import { SexConstants } from "../SexConstants";

/**
 * Handles the current sex act. Does not store any data -- all is stored in the sex instance
 */
export class SexScene extends TwineClass {
  /**
   * Current turn belongs to sex.getUnit()[turn % number of units]
   */
  turn = 1;

  /**
   * Sex AIs
   */
  sex_ais: SexAI[];

  /**
   * @param callbackFn - Callback called to append new scene content to the output.
   */
  constructor(
    public sex: SexInstance,
    public description_selector: string,
  ) {
    super();

    // set the scene there too
    sex.scene = this;

    this.sex_ais = this.sex
      .getUnits()
      .map((unit) => new setup.SexAI(unit, sex));
  }

  /* =============================
      BASIC GETTERS
  ============================= */

  getSex(): SexInstance {
    return this.sex;
  }

  getTurn(): number {
    return this.turn;
  }

  /**
   * Retrieves the unit who needs to make an action right now.
   */
  getTurnUnit(): Unit {
    const units = this.getSex().getUnits();
    return units[this.getTurn() % units.length];
  }

  getTurnUnitSexAI(): SexAI {
    return this.sex_ais[this.getTurn() % this.sex_ais.length];
  }

  /**
   * Retrieves all possible actions that this unit can take.
   */
  getPossibleActions(unit: Unit) {
    const all_action_classes = setup.SexClasses.getAllSexActions();
    const units = this.getSex().getUnits();

    // first, instantiate all instantiated action options
    const all_actions = [];
    for (const action_class of all_action_classes) {
      const test_obj = Object.create(action_class.prototype) as SexAction;

      const actor_count = test_obj.getActorDescriptions().length;
      const permutations = setup.allPermutations(
        actor_count - 1,
        units.filter((u) => u != unit),
      );
      for (const permutation of permutations) {
        all_actions.push(
          new action_class([unit].concat(permutation), this.getSex()),
        );
      }
    }

    const permission = this.getSex().getPermission(unit);
    const res = all_actions.filter((action) => {
      if (!action.isAllowed(this.getSex())) return false;
      if (!permission.isActionAllowed(action, this.getSex())) return false;
      return true;
    });

    // if there is an orgasm action, that takes priority over everything else
    const orgasms = res.filter((action) => action.getTags().includes("orgasm"));
    if (orgasms.length) {
      return orgasms;
    } else {
      return res;
    }
  }

  /* =============================
      LOGIC
  ============================= */

  /**
   * Advances turn.
   * @param forced_action - Action taken forcefully. If empty, will randomize.
   */
  advanceTurn(forced_action?: SexAction) {
    const unit = this.getTurnUnit();
    const ai = this.getTurnUnitSexAI();

    let action: SexAction;

    // choose action
    if (forced_action) {
      action = forced_action;
    } else {
      const actions = this.getPossibleActions(unit);
      action = ai.selectAction(unit, actions, this.getSex());
    }

    // describe action
    if (this.getTurn() % this.getSex().getUnits().length == 0) {
      this.appendText("<hr/>");
    } else {
      this.appendLineBreaks();
    }

    const description = action.story(this.getSex());
    this.appendText(description);

    if (State.variables.gDebug) {
      this.appendText(
        html` <span class="debug-info"
          >(Debug: ${action.description(this.getSex())} ${action.desc()})</span
        >`,
      );
    }

    // do action
    action.applyOutcomes(this.getSex());

    if (!this.isEnded()) {
      // ambience every few turns
      if ((this.getTurn() + 3) % SexConstants.AMBIENCE_TURNS == 0) {
        this.appendLineBreaks();
        this.appendAmbienceText();
      }
    }

    // record history
    this.getSex().addHistory(unit, action);

    // decays
    this.getSex().applyDecays(unit);

    // advance turn
    this.turn += 1;
  }

  /**
   * advance multiple turns
   */
  advanceTurns(number_of_turns: number): void {
    let remain = number_of_turns;
    while (remain && !this.isEnded()) {
      this.advanceTurn();
      remain -= 1;
    }
  }

  /**
   * Whether this sex scene has ended.
   */
  isEnded(): boolean {
    return this.getSex().isEnded();
  }

  /* =============================
      TEXT
  ============================= */

  /**
   * Appends a text to display.
   */
  appendText(text: DOM.Attachable) {
    const height = $(this.description_selector).height()!;
    let dom;
    if (typeof text === "string") {
      dom = setup.DOM.create("span", {}, text + " ");
    } else {
      dom = text;
    }
    setup.DOM.Helper.append(
      this.description_selector,
      dom,
      /* animate = */ true,
    );
    const new_height = $(this.description_selector).height()!;
    document.documentElement.scrollBy(0, new_height - height);
  }

  appendLineBreaks() {
    const height = $(this.description_selector).height()!;
    setup.DOM.Helper.append(
      this.description_selector,
      html`<br />`,
      /* animate = */ true,
    );
    const new_height = $(this.description_selector).height()!;
    document.documentElement.scrollBy(0, new_height - height);
  }

  /**
   * Append many text describing the initial sex things.
   */
  appendInitText() {
    // describe lovers.
    if (this.sex.getUnits().length == 2) {
      const unit1 = this.sex.getUnits()[0];
      const unit2 = this.sex.getUnits()[1];
      if (unit1.getLover() == unit2) {
        this.appendText(
          setup.SexUtil.convert(
            [
              `a|Reps a|eyes a|light up at the prospect of some quality time with a|their lover.`,
              `As a|rep a|invite a|their lover for some sexy time, a|rep a|receive an immediate kiss from the b|adjgood b|race.`,
              `a|Rep a|is very much looking forward for some loving, especially so with a|their lover.`,
            ],
            { a: unit1, b: unit2 },
            this.sex,
          ),
        );
      }
    }

    // describe location.
    this.appendText(this.sex.getLocation().repStart(this.sex));

    // describe pace
    for (const unit of this.sex.getUnits()) {
      this.appendText(this.sex.getPace(unit).repStart(unit, this.sex));
    }

    if (this.sex.getUnits().length == 2) {
      const pace1 = this.sex.getPace(this.sex.getUnits()[0]);
      const pace2 = this.sex.getPace(this.sex.getUnits()[1]);
      if (pace1 == pace2) {
        if (pace1 == setup.sexpace.sub) {
          this.appendText(
            "With two submissives in one place, there is no way this is going to go as well as expected...",
          );
        } else if (pace2 == setup.sexpace.dom) {
          this.appendText("Having two dominants will surely be problematic...");
        }
      }
    }
  }

  /**
   * Append many text describing the initial sex things.
   */
  appendEndText() {
    const sex = this.sex;
    this.appendLineBreaks();
    for (const unit of this.sex.getUnits()) {
      // describe how many times have cummed
      const cums = this.sex.getOrgasms(unit);
      if (cums && unit.isSlave()) {
        if (unit.isMindbroken()) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `Orgasming is merely an automatic response for the mindbroken slave a|rep.`,
              ],
              { a: unit },
              sex,
            ),
          );
        } else if (unit.isCompliant()) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `The slave was rewarded with ${cums > 1 ? "several orgasms" : "an orgasm"} during the intercourse.`,
                `Despite being used as a sex toy, a|rep managed to orgasm throughout the sex.`,
                `a|Rep reached orgasm ${cums > 1 ? "several times" : "once"} under the tender ministrations of a|their betters.`,
              ],
              { a: unit },
              sex,
            ),
          );
        } else {
          this.appendText(
            setup.SexUtil.convert(
              [
                `To a|their horror, a|rep orgasmed during the unwanted intrusion.`,
                `Despite a|their abject begging, a|rep managed to reach orgasm during the unwanted intercourse.`,
                `a|Rep climaxed at some point during the sex, to a|their utter horror.`,
              ],
              { a: unit },
              sex,
            ),
          );
        }
      } else if (cums == 1) {
        this.appendText(
          setup.SexUtil.convert(
            [
              `a|Rep climaxed once throughout the intercourse, leaving a|them quite satisfied.`,
              `Climaxing has relieved a|rep of some of a|their stress.`,
              `a|Rep a|adv only climaxed once throughout the intercourse`,
            ],
            { a: unit },
            sex,
          ),
        );
      } else if (cums > 1) {
        this.appendText(
          setup.SexUtil.convert(
            [
              `a|Rep came many times throughout the intercourse, leaving a|them entirely satisfied.`,
              `If what a|they counted is correct, then a|they must have climaxed at least ${cums} times throughout the entire sex.`,
              `a|Rep reached climax many times throughout the intercourse, greatly satisfying a|them.`,
            ],
            { a: unit },
            sex,
          ),
        );
      } else {
        if (unit.isSlaver()) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `a|Rep failed to orgasm this time, but being a slaver means there are plenty of next times.`,
                `The sex was cut short before a|rep managed to reach orgasm.`,
                `a|Rep did not climax even once throughout the intercourse.`,
              ],
              { a: unit },
              sex,
            ),
          );
        } else {
          if (unit.isMindbroken()) {
            this.appendText(
              setup.SexUtil.convert(
                [
                  `Being denied orgasm left no difference on the mindbroken slave a|rep.`,
                ],
                { a: unit },
                sex,
              ),
            );
          } else {
            this.appendText(
              setup.SexUtil.convert(
                [
                  `The slave was left unsatisfied from being used.`,
                  `a|Rep managed to hold their arousal and resisted climaxing during the entire ordeal.`,
                  `a|Rep did not climax even once throughout the entire time being used as a sex toy.`,
                ],
                { a: unit },
                sex,
              ),
            );
          }
        }
      }

      // describe remaining energy
      const energy = this.sex.getEnergy(unit);
      if (unit.isSlaver()) {
        if (energy > 500) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `a|They was still full of energy after the sex has ended.`,
                `a|They could still go for more if a|they wanted, but all good things have to come to an end.`,
                `The sex was very quick, and a|they was still brimming with energy at the end of the intercourse.`,
              ],
              { a: unit },
              sex,
            ),
          );
        } else if (energy < 500) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `a|They a|is visibly exhausted from the sex.`,
                `The long sex makes a|their a|body sweaty.`,
                `a|They a|go straight to a|their room to recover a|their energy.`,
              ],
              { a: unit },
              sex,
            ),
          );
        }
      } else {
        if (unit.isMindbroken()) {
          this.appendText(
            setup.SexUtil.convert(
              [
                `As a|reps mind is completely gone, the toy has to be manually taken back to a|their
             cage.`,
              ],
              { a: unit },
              sex,
            ),
          );
        } else if (unit.isCompliant()) {
          if (energy > 500) {
            this.appendText(
              setup.SexUtil.convert(
                [
                  `a|They a|is almost disappointed that the actions were over so quickly.`,
                  `a|They a|look a little unsatisfied at the quick sex.`,
                  `a|They secretly hoped that the sex would lasted a little longer.`,
                ],
                { a: unit },
                sex,
              ),
            );
          } else if (energy < 500) {
            const floor = this.sex.getLocation().repSurface(this.sex);
            this.appendText(
              setup.SexUtil.convert(
                [
                  `The well-used slave collapsed to the ${floor} after such a thorough use.`,
                  `With the sex finally over, the a|race slave is finally allowed to rest, before a|their next use.`,
                  `Having being so thoroughly used, a|they collapsed to the ${floor}, smiling a little submissive smile.`,
                ],
                { a: unit },
                sex,
              ),
            );
          }
        } else {
          if (energy > 500) {
            this.appendText(
              setup.SexUtil.convert(
                [
                  `a|They a|look completely relieved that the sex ended relatively quickly.`,
                  `a|They a|try to regain whatever dignity a|they a|have left with their remaining energy.`,
                  `a|Their a|body was left relatively intact, to a|their great relife.`,
                ],
                { a: unit },
                sex,
              ),
            );
          } else if (energy < 500) {
            const floor = this.sex.getLocation().repSurface(this.sex);
            this.appendText(
              setup.SexUtil.convert(
                [
                  `The disobedient slave collapsed to the floor after such a thorough and brutal use.`,
                  `Being used so thoroughly left the disobedient slave a little more broken inside.`,
                  `a|They a|is hauled back to recover in a|their small cell, awaiting further use of a|their a|body.`,
                ],
                { a: unit },
                sex,
              ),
            );
          }
        }
      }
    }
  }

  /**
   * Append many text describing the initial sex things.
   */
  appendAmbienceText() {
    const ambience = this.getSex().getLocation().repAmbience(this.getSex());
    this.appendText(
      setup.rng.choice([
        `${setup.capitalize(ambience)}.`,
        `As the sex continues, ${ambience}.`,
        `${setup.capitalize(ambience)}, and the sex continues.`,
        `Meanwhile, ${ambience}.`,
        `${setup.capitalize(ambience)}, but is quickly forgotten.`,
        `All the while, ${ambience}.`,
      ]),
    );
  }
}
