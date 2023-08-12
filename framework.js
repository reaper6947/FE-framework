export function withoutNulls(arr) {
    return arr.filter((item) => item != null)
}

function mapTextNodes(children) {
    return children.map((child) =>
        typeof child === 'string' ? hString(child) : child
    )
}

export const DOM_TYPES = {
    ELEMENT: 'element',
    TEXT: 'text',
    FRAGMENT: 'fragment',
}


export function h(tag, props = {}, children = []) {
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT,
    }
}

export function hFragment(vNodes) {
    return {
        children: mapTextNodes(withoutNulls(vNodes)),
        type: DOM_TYPES.FRAGMENT
    }
}

export function hString(str) {
    return { type: DOM_TYPES.TEXT, value: str }
}