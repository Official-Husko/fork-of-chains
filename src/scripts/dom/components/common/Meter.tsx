import "./Meter.css";

export const Meter: Component<{
  value: number;
  text?: string;
  color?: string;
  tooltip?: string;
}> = (props) => {
  return (
    <div
      class="Meter"
      data-tooltip={props.tooltip}
      style={{
        "--meter-color": props.color,
      }}
    >
      <span style={{ width: `${100 * props.value}%` }}></span>
      <div>{props.text}</div>
    </div>
  );
};
