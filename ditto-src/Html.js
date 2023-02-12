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
    /** @type {{
      attrs: import("snabbdom").Attrs,
      props: import("snabbdom").Props,
      on: import("snabbdom").On,
      class: import("snabbdom").Classes,
      hook: import("snabbdom").Hooks }} */
    const data = { attrs: {}, props: {}, on: {}, class: {}, hook: {} };

    for (const attribute of attributes) {
      if (attribute[0] === "attrs") {
        const [_, key, value] = attribute;
        data["attrs"][key] = value;
        continue;
      }

      if (attribute[0] === "props") {
        const [_, key, value] = attribute;
        data["props"][key] = value;
        continue;
      }

      if (attribute[0] === "classes") {
        for (const className of attribute[1]) {
          data["class"][className] = true;
        }
        continue;
      }

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
        continue;
      }

      if (attribute[0] === "hook") {
        const [_, hook, value] = attribute;
        /**
         * @param {import("snabbdom").VNode} vnode
         * @returns {void}
         */
        const listener = (vnode) => {
          value(vnode, handler);
        };
        data["hook"][hook] = listener;
        continue;
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
