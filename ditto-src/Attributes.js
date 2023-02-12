/**
 * @param {string} key
 * @param {any} value
 * @returns {Prop}
 */
export function prop_impl(key, value) {
  return ["props", key, value];
}

/**
 * @param {readonly string[]} value
 * @returns {Classes}
 */
export function classes_impl(value) {
  return ["classes", value];
}

/**
 * @template A
 * @template B
 * @template {keyof HTMLElementEventMap} K
 * @param {Attribute<A, K>} attr
 * @param {(a: A) => B} f
 * @returns {Attribute<B, K>}
 */
export function map_impl(attr, f) {
  if (attr[0] === "on") {
    const [_, event, value] = attr;
    return [
      "on",
      event,
      (ev, handler) => value(ev, (event) => handler(f(event))),
    ];
  }
  if (attr[0] === "hook") {
    const [_, hook, value] = attr;
    return [
      "hook",
      hook,
      (vnode, handler) => value(vnode, (event) => handler(f(event))),
    ];
  }
  return attr;
}

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @typedef {Prop | Classes | EventHandler<E, K> | Hook<E>} Attribute
 */

/**
 * @typedef {readonly [t: "props", key: string, value: any]} Prop
 */

/**
 * @typedef {readonly [t: "classes", value: readonly string[]]} Classes
 */

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @typedef {readonly [t: "on", event: K, value: (ev: HTMLElementEventMap[K], handler: Handler<E>) => void]} EventHandler
 */

/**
 * @template E
 * @typedef {readonly [t: "hook", hook: "insert" | "destroy", value: (vnode: import("snabbdom").VNode, handler: Handler<E>) => void]} Hook
 */

/**
 * @template E
 * @callback Handler
 * @param {E} event
 * @returns {void}
 */
