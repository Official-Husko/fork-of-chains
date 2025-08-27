import { Show, createEffect, createSignal, onMount } from "solid-js";
import type { LoreKey } from "../../classes/Lore.js";
import { unitRep } from "../../macro/content/rep.js";
import { reload } from "../nav/nav.js";
import "./ToggleSwitch.css";
export { DOM_Text as Text } from "../text/text.js";

/**
 * Component that renders twee code
 * Note that as it is rendered inside a tree of reactive JSX components,
 * the twee code might get evaluated multiple times, so we careful with possible side effects
 */
export const Twee: Component<{ children: string }> = (props) => {
  let divRef: HTMLDivElement | undefined;

  onMount(() => {
    new Wikifier(divRef!, props.children);
  });

  createEffect(() => {
    while (divRef!.firstChild) {
      divRef!.removeChild(divRef!.firstChild);
    }
    new Wikifier(divRef!, props.children);
  });

  return <div ref={divRef} />;

  //return (
  //  <>
  //    {(() => {
  //      const container = document.createElement("div");
  //      new Wikifier(container, props.children);
  //      return [...container.children];
  //    })()}
  //  </>
  //);
};

export const Message: Component<ParentProps<{ label: string }>> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <span class="message-text">
      <a tabindex="0" onClick={() => setIsOpen(!isOpen())}>
        {props.label}
      </a>
      <span style={{ display: isOpen() ? "block" : "none" }}>
        <Show when={isOpen()}>{props.children}</Show>
      </span>
    </span>
  );
};

export const Help: Component<ParentProps<{}>> = (props) => {
  return (
    <Message label="(?)">
      <div class="helpcard">{props.children}</div>
    </Message>
  );
};

export const Textbox: Component<{
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  return (
    <input
      type="text"
      value={props.value}
      onInput={(ev) => props.onChange?.(ev.currentTarget.value)}
    />
  );
};

export const Numberbox: Component<{
  value: number;
  onChange: (value: number) => void;
}> = (props) => {
  return (
    <input
      type="number"
      value={String(props.value)}
      onInput={(ev) => props.onChange?.(+ev.currentTarget.value)}
    />
  );
};

export const ToggleSwitch: Component<{
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  color?: "blue" | "green";
}> = (props) => {
  return (
    <label class={`ToggleSwitch ToggleSwitch-${props.color ?? "blue"}`}>
      <input
        type="checkbox"
        checked={props.value}
        onChange={(ev) => props.onChange?.(ev.currentTarget.checked)}
        disabled={props.disabled}
      />
      <span />
    </label>
  );
};

// helper function for button/link
function goToPassage(passage: string) {
  State.variables.gOldPassage = State.variables.gPassage;
  State.variables.gPassage = passage;
  reload(
    /* passage switch = */ false,
    /* scroll top = */ State.variables.gPassage != State.variables.gOldPassage,
  );
}

export const Button = (
  props: ParentProps<{
    passage?: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
  }>,
) => {
  return (
    <button
      disabled={props.disabled}
      class={props.active ? "selected" : undefined}
      onClick={() => {
        props.onClick?.();
        if (props.passage) goToPassage(props.passage);
      }}
    >
      {props.children}
    </button>
  );
};

export const Link = (
  props: ParentProps<{
    passage?: string;
    onClick?: () => void;
    disabled?: boolean;
  }>,
) => {
  return (
    <a
      class={props.disabled ? "disabled" : undefined}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!props.disabled) {
          props.onClick?.();
          if (props.passage) goToPassage(props.passage);
        }
      }}
    >
      {props.children}
    </a>
  );
};

export const Icon: Component<{ icon: string; text: string }> = (props) => {
  return (
    <span data-tooltip={props.text} data-tooltip-delay data-tooltip-noclick>
      <i class={"sfa sfa-" + props.icon} />
    </span>
  );
};

export const Image: Component<{
  imagepath: string;
  tooltip_content?: string;
  tooltip_noclick?: boolean;
  extra_class?: string;
}> = (props) => {
  return (
    <Show
      when={props.tooltip_content || props.extra_class}
      fallback={<img src={setup.resolveImageUrl(props.imagepath)} />}
    >
      <span
        data-tooltip={props.tooltip_content || undefined}
        data-tooltip-noclick={props.tooltip_noclick || undefined}
        class={props.extra_class || undefined}
      >
        <img src={setup.resolveImageUrl(props.imagepath)} />
      </span>
    </Show>
  );
};

export const ImageIcon: Component<{
  imagepath: string;
  tooltip_content?: string;
}> = (props) => {
  return <Image {...props} extra_class="trait" />;
};

export const Rep = <T extends { rep(arg: any): any }>(props: {
  of: T | null | undefined;
  arg?: any;
}) => {
  const getTweeCode = () => {
    if (props.of instanceof setup.Unit) {
      return unitRep(props.of);
    } else if (props.of) {
      return props.of.rep(props.arg);
    }
  };

  return (
    <span>
      <Show when={props.of} fallback={<>(none)</>}>
        <Twee>{getTweeCode()}</Twee>
      </Show>
    </span>
  );
};

export const Lore: Component<{ of: LoreKey }> = (props) => {
  return <>{setup.Lore.repLore(props.of)}</>;
};
