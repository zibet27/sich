import { isArray } from "../utils";
import { RendererOptions } from "./renderer";

export const webRendererOptions: RendererOptions<Node> = {
    createElement(name) {
        return document.createElement(name);
    },
    createTextNode(value) {
        return document.createTextNode(value);
    },
    getFirstChild(node) {
        return node.firstChild as Node;
    },
    getNextSibling(node) {
        return node.nextSibling as Node;
    },
    getParentNode(node) {
        return node.parentNode as Node;
    },
    insertNode(parent, node, before) {
        if (before) parent.insertBefore(node, before);
        else parent.appendChild(node);
    },
    replaceText(textNode, value) {
        textNode.textContent = value;
    },
    removeNode(node) {
        // @ts-ignore
        node.remove();
    },
    setProperty(node: any, name, value) {
        if (!isArray(name)) {
            node[name] = value;
            return;
        }
        let item = node;
        const lastKey = name[name.length - 1];
        for (let i = 0; i < name.length - 1; i++) {
            item = item[name[i]];
        }
        item[lastKey] = value;
    }
};