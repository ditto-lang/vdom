import { h } from "snabbdom";

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @param {string} sel
 * @param {readonly import("./Attributes").Attribute<E, K>[]} attributes
 * @param {readonly HTML<E>[]} children
 * @returns {HTML<E>}
 */
export function node_impl(sel, attributes, children) {
  return (handler) => {
    /** @type {{ props: import("snabbdom").Props, on: import("snabbdom").On }} */
    const data = { props: {}, on: {} };

    for (const attribute of attributes) {
      if (attribute[0] === "on") {
        const [_, event, value] = attribute;
        /**
         * @param {HTMLElementEventMap[typeof event]} ev
         * @returns {void}
         */
        const listener = (ev) => {
          value(ev, handler);
        };
        data["on"][/** @type {string} */ (event)] = listener;
      } else {
        const [_, key, value] = attribute;
        data["props"][key] = value;
      }
    }
    return h(
      sel,
      data,
      children.map((child) => child(handler))
    );
  };
}

/**
 * @template E
 * @param {string} text
 * @returns {HTML<E>}
 */
export function text_impl(text) {
  return (_handler) => {
    return text;
  };
}

/**
 * @template E
 * @callback HTML
 * @param {import("./Attributes").Handler<E>} handler
 * @returns {import("snabbdom").VNodeChildElement}
 */
