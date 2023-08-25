export const initHTML =
    `
    <div id="target">
     </div>
    `

export const initJS =
    `
    const state = { count: 0 }

    const reducers = {
    add: (state) => ({ count: state.count + 1 }),
    sub: (state) => ({ count: state.count - 1 }),
    }

    function App(state, emit) {
        return h('form', { class: 'container' }, [
            h('h1', { class: 'title' }, ['My counter']),
            h('div', { class: 'container' }, [
                h('button', { on: { click: () => emit('sub') }, class: "btn btn-primary" }, ['-']),
                h(
                    'span',
                    { class: 'badge bg-secondary' },
                    [hString(state.count)]
                ),
                h('button', { on: { click: () => emit('add') }, class: "btn btn-primary" }, ['+']),
            ])
        ])
    }

    createApp({ state, reducers, view: App }).mount(document.querySelector("#target"))
    `

export const initCSS =
    `
    /* bootstrap css is auto imported */ 
    `