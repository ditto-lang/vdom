/**
 * @template  E
 * @template {keyof HTMLElementEventMap} K
 * @param {K} key
 * @param {E} event
 * @returns {import("./Attributes").EventHandler<E, K>}
 */
export function on_impl(key, event) {
  return [
    "on",
    key,
    (_ev, handler) => {
      handler(event);
    },
  ];
}

/**
 * @template  E
 * @param {(input: string) => E} mkEvent
 * @returns {import("./Attributes").EventHandler<E, "input">}
 */
export function on_input_impl(mkEvent) {
  return [
    "on",
    "input",
    (ev, handler) => {
      if (ev.target !== null) {
        if ("value" in ev.target && typeof ev.target.value === "string") {
          ev.stopPropagation();
          const event = mkEvent(ev.target.value);
          handler(event);
        }
      }
    },
  ];
}

/**
 * @template  E
 * @param {(checked: boolean) => E} mkEvent
 * @returns {import("./Attributes").EventHandler<E, "change">}
 */
export function on_check_impl(mkEvent) {
  return [
    "on",
    "change",
    (ev, handler) => {
      if (ev.target !== null) {
        if ("checked" in ev.target && typeof ev.target.checked === "boolean") {
          const event = mkEvent(ev.target.checked);
          handler(event);
        }
      }
    },
  ];
}

/**
 * @template  E
 * @param {E} event
 * @returns {import("./Attributes").EventHandler<E, "submit">}
 */
export function on_submit_impl(event) {
  return [
    "on",
    "submit",
    (ev, handler) => {
      ev.preventDefault();
      handler(event);
    },
  ];
}

/**
 * @template  E
 * @param {(key: string) => E} mkEvent
 * @returns {import("./Attributes").EventHandler<E, "keydown">}
 */
export function on_key_down_impl(mkEvent) {
  return [
    "on",
    "keydown",
    (ev, handler) => {
      const event = mkEvent(ev.key);
      handler(event);
    },
  ];
}

/**
 * @template  E
 * @param {(key: string) => E} mkEvent
 * @returns {import("./Attributes").EventHandler<E, "keypress">}
 */
export function on_key_press_impl(mkEvent) {
  return [
    "on",
    "keypress",
    (ev, handler) => {
      const event = mkEvent(ev.key);
      handler(event);
    },
  ];
}

/**
 * @template  E
 * @param {(key: string) => E} mkEvent
 * @returns {import("./Attributes").EventHandler<E, "keyup">}
 */
export function on_key_up_impl(mkEvent) {
  return [
    "on",
    "keyup",
    (ev, handler) => {
      const event = mkEvent(ev.key);
      handler(event);
    },
  ];
}

/**
 * @template  E
 * @param {(elm: NonNullable<import("snabbdom").VNode["elm"]>) => E} mkEvent
 * @returns {import("./Attributes").Hook<E>}
 */
export function on_mount_impl(mkEvent) {
  return [
    "hook",
    "insert",
    (vnode, handler) => {
      if (vnode.elm !== undefined) {
        const event = mkEvent(vnode.elm);
        handler(event);
      }
    },
  ];
}

/**
 * @template  E
 * @param {E} event
 * @returns {import("./Attributes").Hook<E>}
 */
export function on_unmount_impl(event) {
  return [
    "hook",
    "destroy",
    (_vnode, handler) => {
      handler(event);
    },
  ];
}
