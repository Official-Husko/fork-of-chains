import { Show, createSignal } from "solid-js"
import { reload } from "../nav/AAA_nav.js"
export { Text } from "../text/AAA_text.js"

/**
 * Component that renders twee code
 * Note that as it is rendered inside a tree of reactive JSX components,
 * the twee code might get evaluated multiple times, so we careful with possible side effects
 * @type {Component<{ code: string }>}
 */
export const Twee = (props) => {
  return (
    <>
      {(() => {
        const container = document.createElement("div")
        $(container).wiki(props.code)
        return [...container.children]
      })()}
    </>
  )
}

/**@type {Component<ParentProps<{ label: string }>>} */
export const Message = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  return (
    <span class="message-text">
      <a tabindex="0" onClick={() => setIsOpen(!isOpen())}>
        {props.label}
      </a>
      <span style={{ display: isOpen() ? 'block' : 'none' }}>
        <Show when={isOpen()}>
          {props.children}
        </Show>
      </span>
    </span>
  )
}

/** @type {Component<ParentProps<{}>>} */
export const Help = (props) => {
  return (
    <Message label="(?)">
      <div class="helpcard">
        {props.children}
      </div>
    </Message>
  )
}

/** @type {Component<{ value: string, onChange: (value: string) => void }>} */
export const Textbox = (props) => {
  return (
    <input type="text" value={props.value}
      onInput={ev => props.onChange?.(ev.currentTarget.value)} />
  )
}

/** @type {Component<{ value: number, onChange: (value: number) => void }>} */
export const Numberbox = (props) => {
  return (
    <input type="number" value={String(props.value)}
      onInput={ev => props.onChange?.(+ev.currentTarget.value)} />
  )
}

/** @type {Component<{ value: boolean, onChange: (value: boolean) => void, disabled?: boolean, color?: 'blue'|'green' }>} */
export const ToggleSwitch = (props) => {
  return (
    <label class={`ToggleSwitch ToggleSwitch-${props.color ?? 'blue'}`}>
      <input type="checkbox"
        checked={props.value}
        onChange={ev => props.onChange?.(ev.currentTarget.checked)}
        disabled={props.disabled} />
      <span/>
    </label>
  )
}

// helper function for button/link
function goToPassage(/** @type {string} */ passage) {
  State.variables.gOldPassage = State.variables.gPassage
  State.variables.gPassage = passage
  reload(/* passage switch = */ false, /* scroll top = */ State.variables.gPassage != State.variables.gOldPassage)
}

/**
 * @param {ParentProps<{ passage?: string, onClick?: () => void, disabled?: boolean, active?: boolean }>} props
 */
export const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      class={props.active ? 'selected' : undefined}
      onClick={() => {
        props.onClick?.()
        if (props.passage)
          goToPassage(props.passage)
      }}
    >
      {props.children}
    </button>
  )
}

/**
 * @param {ParentProps<{ passage?: string, onClick?: () => void, disabled?: boolean }>} props
 */
export const Link = (props) => {
  return (
    <a
      class={props.disabled ? 'disabled' : undefined}
      onClick={(ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        if (!props.disabled) {
          props.onClick?.()
          if (props.passage)
            goToPassage(props.passage)
        }
      }}
    >
      {props.children}
    </a>
  )
}

/**
 * @param {{ icon: string, text: string }} props
 */
export const Icon = (props) => {
  return (
    <span data-tooltip={props.text} data-tooltip-delay data-tooltip-noclick>
      <i class={'sfa sfa-' + props.icon} />
    </span>
  )
}

/**
 * @template {{ rep(arg: any): any }} T
 * @param {{
 *   of: T|null|undefined
 *   arg?: any
 * }} props
 */
export const Rep = (props) => {
  const getTweeCode = () => {
    if (props.of instanceof setup.Unit) {
      return unitRep(props.of)
    } else if (props.of) {
      return props.of.rep(props.arg)
    }
  }

  return (
    <span>
      <Show when={props.of} fallback={<>(none)</>}>
        <Twee code={getTweeCode()} />
      </Show>
    </span>
  )
}

/**
 * @param {{ of: string }} props
 */
export const Lore = (props) => {
  return (
    <>{setup.Lore.repLore(props.of)}</>
  )
}
