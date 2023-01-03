/**
 * @param {string} key
 * @param {any} value
 * @returns {Prop}
 */
export function mk_prop_impl(key, value) {
  return ["props", key, value];
}

/**
 * @template  E
 * @template {keyof HTMLElementEventMap} K
 * @param {K} key
 * @param {(ev: HTMLElementEventMap[K]) => E} mkEvent
 * @returns {EventHandler<E, K>}
 */
export function mk_event_handler_impl(key, mkEvent) {
  return [
    "on",
    key,
    (ev, handler) => {
      const event = mkEvent(ev);
      handler(event);
    },
  ];
}

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @typedef {Prop | EventHandler<E, K>} Attribute
 */

/**
 * @typedef {readonly [t: "props", key: string, value: any]} Prop
 */

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @typedef {readonly [t: "on", event: K, value: (ev: HTMLElementEventMap[K], handler: Handler<E>) => void]} EventHandler
 */

/**
 * @template E
 * @callback Handler
 * @param {E} event
 * @returns {void}
 */
