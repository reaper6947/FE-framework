
import { h, hFragment, hString } from './framework.js'
import { createApp } from './app.js'

// const vdom = h('form', { class: 'login-form temp', action: 'login' }, [
//     h('input', { type: 'text', name: 'user' }),
//     h('input', { type: 'password', name: 'pass' }),
//     h('button', {}, ['Login']),
//     h("span", {}, [{ type: "text", value: "temp1" }, "temp2"])
// ])




const state = {
    inputVals: {
        fullName: "",
        sid: "",
        email: "",
        slotNumber: ""
    },

    err: "",

    userSlots: [],

    appointmentSlots: [
        {
            idx: 1,
            time: "Sunday 7:50",
            seatRemaining: 8
        },
        {
            idx: 2,
            time: "Monday 7:50",
            seatRemaining: 8
        },
        {
            idx: 3,
            time: "Tuesday 7:50",
            seatRemaining: 8
        }]
}

const reducers = {

    "change-full-name": (state, fullName) => {
        state.inputVals.fullName = fullName
        return {
            ...state
        }
    },
    "change-sid": (state, sid) => {
        state.inputVals.sid = sid
        return {
            ...state
        }
    },
    "change-slot-number": (state, slotNumber) => {
        state.inputVals.slotNumber = slotNumber
        return {
            ...state
        }
    },
    "change-email": (state, email) => {
        state.inputVals.email = email
        return {
            ...state
        }
    },

    'add-item': (state) => {


        if (state.inputVals.fullName.length == 0) {
            state.err = "full name can not be empty"
            return state
        }

        if (state.inputVals.sid.length == 0) {
            state.err = "sid can not be empty"
            return state
        }

        if (isNaN(state.inputVals.sid)) {
            state.err = "sid number must be a number"
            return state
        }

        if (state.inputVals.email.length == 0) {
            state.err = "email can not be empty"
            return state
        }

        if (state.inputVals.slotNumber.length == 0) {
            state.err = "slot number can not be empty"
            return state
        }

        if (isNaN(state.inputVals.slotNumber)) {
            state.err = "slot number must be a number"
            return state
        }

        let alreadyRegistered = false
        let slotExists = false

        state.userSlots.forEach((item) => {

            if (item.email == state.inputVals.email) {
                alreadyRegistered = true

            }
            if (item.sid == state.inputVals.sid) {
                alreadyRegistered = true

            }
        })

        state.appointmentSlots.forEach((item) => {
            if (item.idx == state.inputVals.slotNumber) {
                slotExists = true
            }
        })

        if (!slotExists) {
            state.err = "this slot does not exist"
            return state
        }
        console.log(state.inputVals, state.userSlots)
        if (alreadyRegistered) {
            state.err = "user already registered"
            return state
        }


        state.appointmentSlots.forEach((item) => {
            if (item.idx == state.inputVals.slotNumber) {
                state.appointmentSlots[item.idx - 1].seatRemaining -= 1
            }
        })

        state.userSlots.push(state.inputVals)


        state.err = ""

        state.inputVals.fullName = ""
        state.inputVals.sid = ""
        state.inputVals.email = ""
        state.inputVals.slotNumber = ""


        return {
            ...state
        }
    },

    'remove-item': (state, idx) => ({
        ...state,
        todos: state.todos.filter((_, i) => i !== idx),
    }),
}

function App(state, emit) {
    return h("div", {}, [h('h1', {}, ['Register']),
    CreateInput(state, emit),
    h("h4", { className: "err" }, [state.err]),
    h("h3", {}, ["choose from these slots"]),
    appointmentList(state, emit),])

}

function addRandom({ todos }, emit) {
    return h("button", {
        on: {
            click: async () => {
                const response = await fetch('https://random-data-api.com/api/v2/users?size=5');
                const data = await response.json()
                console.log()
                const newItemArr = data.map((el) => el.uid)
                console.log(newItemArr)
                emit("add-random", { todos, newItemArr })

            }
        }
    }, ["add-random"])

}

function CreateInput({ inputVals }, emit) {
    return h('div', {}, [

        h('label', { for: 'name-input' }, ['full name']),

        h('input', {
            type: 'text',
            id: 'name-input',
            value: inputVals.fullName,
            required: true,
            on: {
                change: ({ target }) => { emit("change-full-name", target.value) }
            }
        }),

        h('label', { for: 'sid-input' }, ['sid']),

        h('input', {
            type: 'text',
            id: 'sid-input',
            value: inputVals.sid,
            required: true,
            on: {
                change: ({ target }) => { emit("change-sid", target.value) }
            }
        }),
        h('label', { for: 'email-input' }, ['email']),

        h('input', {
            type: 'text',
            id: 'email-input',
            value: inputVals.email,
            required: true,
            on: {
                change: ({ target }) => { emit("change-email", target.value) }
            }
        }),
        h('label', { for: 'slot-input' }, ['slot No']),

        h('input', {
            type: 'text',
            id: 'slot-input',
            value: inputVals.slotNumber,
            required: true,
            on: {
                change: ({ target }) => { emit("change-slot-number", target.value) }
            }
        }),
        h(
            'button',
            {
                on: { click: () => emit('add-item', inputVals) },
            },
            ['register']
        ),
    ])
}

function appointmentList(state, emit) {
    const arr = []
    state.appointmentSlots.forEach(element => {
        arr.push(appointmentItem(element, emit))
    });

    return h(
        "ol",
        {},
        arr
    )

}

function appointmentItem(item, emit) {
    return h("li", {}, [`${item.time} seat remaining: ${item.seatRemaining}`])
}





createApp({ state, reducers, view: App }).mount(document.body)