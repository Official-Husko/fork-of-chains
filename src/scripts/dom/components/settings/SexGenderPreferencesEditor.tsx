import { createSignal, For, Show } from "solid-js";
import {
  type SexgenderDistribution,
  type SexgenderKey,
} from "../../../classes/Settings";
import { SEXGENDERS } from "../../../data/sexgenders";
import { Message, Twee } from "../common";
import "./SexGenderPreferencesEditor.css";

const TARGETS = [
  ["$settings.gender_preference.slave", "Slave"],
  ["$settings.gender_preference.slaver", "Slaver"],
  ["$settings.other_gender_preference", "Other (NPCs, etc.)"],
];

const PRESETS: Record<string, SexgenderDistribution> = {
  "all male": { male: 1 },
  "all female": { female: 1 },
  "fifty-fifty male/female": { male: 0.5, female: 0.5 },
};

function initDistributions() {
  const distributions: Record<string, SexgenderDistribution> = {};
  for (const [varname] of TARGETS) {
    let distr = State.getVar(varname) as SexgenderDistribution | undefined;
    if (distr) {
      distr = { ...distr };
    } else {
      distr = { male: 0.5, female: 0.5 };
    }
    distributions[varname] = distr;
  }
  return distributions;
}

export const SexGenderPreferencesEditor: Component<{
  char_creation?: boolean;
}> = (props) => {
  const [getDistributions, setDistributions] =
    createSignal<Record<string, SexgenderDistribution>>(initDistributions());

  const SEXGENDERS_KEYS = objectKeys(SEXGENDERS);

  const setRatio = (
    target: string,
    sexgender: SexgenderKey,
    new_ratio_value: number,
  ) => {
    const distributions = getDistributions();
    const old_distr = distributions[target];
    const new_distr: SexgenderDistribution = {
      ...old_distr,
      [sexgender]: new_ratio_value,
    };

    const idx = SEXGENDERS_KEYS.findIndex((it) => it === sexgender);

    const to_reassign = SEXGENDERS_KEYS.filter((_, i) => i !== idx);
    let rem = 1 - new_ratio_value;
    if (new_ratio_value > (old_distr[sexgender] ?? 0)) {
      while (to_reassign.length) {
        const old_ratio = old_distr[to_reassign[0]] ?? 0;
        if (old_ratio <= rem) {
          rem -= old_ratio;
          to_reassign.shift();
        } else {
          break;
        }
      }
    }

    if (to_reassign.length) {
      const sum = to_reassign.reduce(
        (sum, it) =>
          sum + ((old_distr[it] || 0) < 0.01 ? 0 : old_distr[it] || 0),
        0,
      );

      for (const it of to_reassign) {
        let old_ratio = old_distr[it] || 0;
        if (old_ratio < 0.01) old_ratio = 0;
        const normalized_ratio =
          sum > 0 ? old_ratio / sum : 1 / to_reassign.length;
        new_distr[it] = rem * normalized_ratio;
      }
    }

    setDistributions({
      ...distributions,
      [target]: new_distr,
    });

    State.setVar(target, new_distr);
  };

  const getPercentText = (ratio: number) => {
    if (!ratio) return "-";
    const val = Math.round(100 * ratio);
    return `${val}%`;
  };

  return (
    <>
      <div>
        <Show
          when={props.char_creation}
          fallback={
            <>
              Sex/gender preferences for units:
              <Message label="(?)">
                <div class="helpcard">
                  You can use this option to adjust the how often units of
                  certain sex/gender will be encountered in the game.
                </div>
              </Message>
            </>
          }
        >
          <h4 style={{ margin: "0.5em 0" }}>Sex/gender ratios:</h4>
          You can decide the proportion of sex or gender you want to see for
          each character role in the game.
        </Show>
        <div>
          <b>Quick presets:</b>
          <For each={Object.entries(PRESETS)}>
            {([presetLabel, presetDistr]) => (
              <a
                style={{ "margin-left": "0.5em" }}
                onClick={(ev) => {
                  ev.preventDefault();

                  setDistributions(
                    Object.fromEntries(
                      TARGETS.map(([target]) => [target, { ...presetDistr }]),
                    ),
                  );
                }}
              >
                {`(${presetLabel})`}
              </a>
            )}
          </For>
        </div>
        <div
          class="SexGenderPreferencesEditor-table"
          style={{
            "grid-template-columns": `auto auto auto auto auto repeat(${TARGETS.length}, 1fr)`,
          }}
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          {TARGETS.map(([, target_label]) => (
            <div class="SexGenderPreferencesEditor-slider">{target_label}</div>
          ))}

          {SEXGENDERS_KEYS.map((sexgender) => (
            <>
              <header
                style={
                  Object.values(getDistributions()).some(
                    (d) => (d[sexgender] ?? 0) > 0,
                  )
                    ? undefined
                    : { opacity: 0.4 }
                }
              >
                <span>{SEXGENDERS[sexgender].name}</span>
              </header>
              <span>
                <Twee>
                  {setup.trait[SEXGENDERS[sexgender].gender_trait_key].rep()}
                </Twee>
              </span>
              <span>
                <Show when={SEXGENDERS[sexgender].dick} fallback={<aside />}>
                  <Twee>{setup.trait.dick_medium.rep()}</Twee>
                </Show>
              </span>
              <span>
                <Show when={SEXGENDERS[sexgender].vagina} fallback={<aside />}>
                  <Twee>{setup.trait.vagina_loose.rep()}</Twee>
                </Show>
              </span>
              <span>
                <Show when={SEXGENDERS[sexgender].breast} fallback={<aside />}>
                  <Twee>{setup.trait.breast_medium.rep()}</Twee>
                </Show>
              </span>
              {TARGETS.map(([target]) => (
                <div class="SexGenderPreferencesEditor-slider">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={100 * (getDistributions()[target][sexgender] ?? 0)}
                    onInput={(ev) =>
                      setRatio(target, sexgender, +ev.currentTarget.value / 100)
                    }
                  />
                  <div
                    class={
                      "SexGenderPreferencesEditor-percent" +
                      (!(getDistributions()[target][sexgender] ?? 0)
                        ? " zero"
                        : "")
                    }
                  >
                    {getPercentText(getDistributions()[target][sexgender] ?? 0)}
                  </div>
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </>
  );
};
