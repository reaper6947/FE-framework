import { destroyDOM } from './destroy-dom.js'
import { Dispatcher } from './dispatcher.js'
import { mountDOM } from './mount-dom.js'

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


export function createApp({ state, view, reducers = {} }) {
    let parentEl = null
    let vdom = null

    const dispatcher = new Dispatcher()
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

    function emit(eventName, payload) {
        dispatcher.dispatch(eventName, payload)
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName]
        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload)
        })
        subscriptions.push(subs)
    }

    function renderApp() {
        if (vdom) {
            destroyDOM(vdom)
        }
        vdom = view(state, emit)

        mountDOM(vdom, parentEl)
    }

    return {
        mount(_parentEl) {
            parentEl = _parentEl
            renderApp()
        },
        unmount() {
            destroyDOM(vdom)
            vdom = null
            subscriptions.forEach((unsubscribe) => unsubscribe())
        }
    }
}

