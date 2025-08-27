import { For, Show } from "solid-js";
import { SexConstants } from "../../../classes/sex/SexConstants";
import { ImageIcon, Twee } from "../common";
import { Meter } from "../common/Meter";
import "./InteractiveSexStatusView.css";
import { getSexInstance } from "./InteractiveSexView";

const ArousalRep: Component<{ value: number }> = (props) => {
  //const r = Math.round(((1000 - props.value) / 1000) * 255);
  //return (
  //  <span
  //    style={`color: rgb(${r}, 255, ${r})`}
  //    data-tooltip="Arousal: How close this unit is to climax"
  //  >
  //    {(props.value / 10).toFixed(1)}{" "}
  //    <ImageIcon imagepath={SexConstants.AROUSAL_ICON} />
  //  </span>
  //);
  return (
    <div data-tooltip="Arousal: How close this unit is to climax">
      <ImageIcon imagepath={SexConstants.AROUSAL_ICON} />
      <Meter value={props.value / SexConstants.AROUSAL_MAX} color="#ea638c" />
    </div>
  );
};

const DiscomfortRep: Component<{ value: number }> = (props) => {
  //const r = Math.round(((1000 - props.value) / 1000) * 255);
  //return (
  //  <span
  //    style={`color: rgb(255, 255, ${r})`}
  //    data-tooltip="Discomfort: Amount of discomfort this unit is having from this intercourse"
  //  >
  //    {(props.value / 10).toFixed(1)}
  //    <ImageIcon imagepath={SexConstants.DISCOMFORT_ICON} />
  //  </span>
  //);
  return (
    <div data-tooltip="Discomfort: Amount of discomfort this unit is having from this intercourse">
      <ImageIcon imagepath={SexConstants.DISCOMFORT_ICON} />
      <Meter
        value={props.value / SexConstants.DISCOMFORT_MAX}
        color="#ff7d00"
      />
    </div>
  );
};

const EnergyRep: Component<{ value: number }> = (props) => {
  //const r = Math.round(((1000 - props.value) / 1000) * 255);
  //return (
  //  <span
  //    style={`color: rgb(${r}, ${r}, 255)`}
  //    data-tooltip="Energy: How much energy left in this unit for sex action"
  //  >
  //    {(props.value / 10).toFixed(1)}
  //    <ImageIcon imagepath={SexConstants.ENERGY_ICON} />
  //  </span>
  //);
  return (
    <div data-tooltip="Energy: How much energy left in this unit for sex action">
      <ImageIcon imagepath={SexConstants.ENERGY_ICON} />
      <Meter value={props.value / SexConstants.ENERGY_MAX} color="#f4d35e" />
    </div>
  );
};

export const InteractiveSexParticipantCard: Component<{
  sex: SexInstance;
  unit: Unit;
}> = (props) => {
  return (
    <div class="InteractiveSexParticipantCard">
      <header>
        <div>
          <Twee>{props.unit.rep()}</Twee>
        </div>
        <div>
          <Twee>{props.sex.getPosition(props.unit).rep()}</Twee>
          <Twee>
            {props.sex
              .getPose(props.unit)
              .rep(props.sex.getPosition(props.unit), props.sex)}
          </Twee>
        </div>
        <footer>{props.sex.getPace(props.unit).rep()}</footer>
      </header>
      <div>
        <ArousalRep value={props.sex.getArousal(props.unit)} />
        <DiscomfortRep value={props.sex.getDiscomfort(props.unit)} />
        <EnergyRep value={props.sex.getEnergy(props.unit)} />
      </div>
    </div>
  );
};

export const InteractiveSexParticipantCards: Component<{
  sex: SexInstance;
  positions: SexPosition[];
}> = (props) => {
  return (
    <div>
      <For each={props.positions}>
        {(position) => {
          const unit = props.sex.getUnitAtPosition(position);
          if (!unit) return null;
          return <InteractiveSexParticipantCard sex={props.sex} unit={unit} />;
        }}
      </For>
    </div>
  );
};

export const InteractiveSexStatusView: Component = () => {
  return (
    <Show when={getSexInstance()}>
      <div class="InteractiveSexStatusView">
        {/* Draw cards for the sex participants. */}
        <InteractiveSexParticipantCards
          sex={getSexInstance()!}
          positions={setup.SexClasses.getAllPositions()}
        />

        {/* Draw the sex positions. */}
        <div>
          <For
            each={[
              setup.sexposition.front,
              setup.sexposition.center,
              setup.sexposition.back,
            ]}
          >
            {(position) => {
              const sex = getSexInstance()!;

              const unit = sex.getUnitAtPosition(position);

              let image: string | null = null;
              let tooltip_positions = [position];
              if (unit) {
                if (unit.isYou()) {
                  image = sex.getPose(unit).repBigPlayer(position, sex);
                } else {
                  image = sex.getPose(unit).repBig(position, sex);
                }
              }

              if (position == setup.sexposition.center) {
                const top = setup.sexposition.top;
                const topunit = sex.getUnitAtPosition(top);
                if (topunit) {
                  // topunit dominates the image
                  if (topunit.isYou()) {
                    image = sex.getPose(topunit).repBigPlayer(position, sex);
                  } else {
                    image = sex.getPose(topunit).repBig(position, sex);
                  }
                  tooltip_positions = [top].concat(tooltip_positions);
                }
              }

              if (image) {
                const tooltip = `<<attach setup.DOM.Util.interactiveSexTooltip(${tooltip_positions.map((a) => `'${a.key}'`).join(",")})>>`;
                return (
                  <span data-tooltip={tooltip}>
                    <Twee>{image}</Twee>
                  </span>
                );
              } else {
                return html`${setup.SexPose.repBigNone()}`;
              }
            }}
          </For>
        </div>

        <footer>
          <span>Location:</span>{" "}
          <Twee>{getSexInstance()!.getLocation().rep()}</Twee>
        </footer>
      </div>
    </Show>
  );
};
