import { h } from "snabbdom";

/**
 * @template E
 * @template {keyof HTMLElementEventMap} K
 * @param {string} sel
 * @param {readonly import("./Attributes").Attribute<E, K>[]} attributes
 * @param {readonly Html<E>[]} children
 * @returns {Html<E>}
 */
export function node_impl(sel, attributes, children) {
  return (handler) => {
    /** @type {{ props: import("snabbdom").Props, on: import("snabbdom").On, class: import("snabbdom").Classes }} */
    const data = { props: {}, on: {}, class: {} };

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
      } else if (attribute[0] === "classes") {
        for (const className of attribute[1]) {
          data["class"][className] = true;
        }
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
 * @returns {Html<E>}
 */
export function text_impl(text) {
  return (_handler) => {
    return text;
  };
}

/**
 * @template A
 * @template B
 * @param {Html<A>} html
 * @param {(a: A) => B} f
 * @returns {Html<B>}
 */
export function map_impl(html, f) {
  return (handler) => {
    return html((event) => handler(f(event)));
  };
}

/**
 * @template E
 * @callback Html
 * @param {import("./Attributes").Handler<E>} handler
 * @returns {import("snabbdom").VNodeChildElement}
 */
