const first = document.querySelector(".first");
const ifr = document.querySelector("#output-window")

function loadIframe(scriptToRun) {
    const boostrap = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    crossorigin="anonymous">`

    ifr.srcdoc = `
    <html lang="en">
    <head>
    ${boostrap}
    </head>
    <body>
    <script type="module">
    ${scriptToRun}
    </script>
    </body>
    </html >`

}

const sample = `
import { h, hFragment, hString } from './framework.js'
import { createApp } from './app.js'

const state = { count: 0 }
const reducers = {
    add: (state) => ({ count: state.count + 1 }),
    sub: (state) => ({ count: state.count - 1 }),
}


function App(state, emit) {
    return h('form', { class: 'login-form temp', }, [
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

createApp({ state, reducers, view: App }).mount(document.body)
`

window.addEventListener('load', function () {
    first.value = sample
    loadIframe(first.value)
})

first.addEventListener("keyup", (e) => {
    const customScript = e.target.value
    loadIframe(customScript)
});