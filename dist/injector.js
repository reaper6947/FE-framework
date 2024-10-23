const n=document.querySelector(".first"),t=document.querySelector("#output-window");function e(n){t.srcdoc=`\n    <html lang="en">\n    <head>\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"\n    crossorigin="anonymous">\n    </head>\n    <body>\n    <script type="module">\n    ${n}\n    <\/script>\n    </body>\n    </html >`}window.addEventListener("load",(function(){n.value="\nimport { h, hFragment, hString, createApp } from './app.js'\n\n\nconst state = { count: 0 }\nconst reducers = {\n    add: (state) => ({ count: state.count + 1 }),\n    sub: (state) => ({ count: state.count - 1 }),\n}\n\n\nfunction App(state, emit) {\n    return h('form', { class: 'login-form temp', }, [\n        h('h1', { class: 'title' }, ['My counter']),\n        h('div', { class: 'container' }, [\n            h('button', { on: { click: () => emit('sub') }, class: \"btn btn-primary\" }, ['-']),\n            h(\n                'span',\n                { class: 'badge bg-secondary' },\n                [hString(state.count)]\n            ),\n            h('button', { on: { click: () => emit('add') }, class: \"btn btn-primary\" }, ['+']),\n        ])\n    ])\n}\n\ncreateApp({ state, reducers, view: App }).mount(document.body)\n",e(n.value)})),n.addEventListener("keyup",(n=>{e(n.target.value)}));
