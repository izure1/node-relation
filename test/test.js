var { Relationship } = require('../dist/umd/raw')

class Human {
    constructor(name) {
        this.name = name
    }
    sayHello() {
        console.log(`${this.name}: Hello, my name is ${this.name}`)
    }
}

// Team A
const john      = new Human('john') // leader
const paul      = new Human('paul')
const lawrence  = new Human('lawrence')

// Team B
const jacob     = new Human('jacob') // leader
const richard   = new Human('richard')
const collin    = new Human('collin')

// Manager
const manager   = new Human('harris')

// Create relationship
let state = new Relationship

state = state.to(manager, john, jacob)

state.all(john, paul, lawrence)
state.all(jacob, richard, collin)

console.log(state.from(manager, 1).without(manager))
console.log('manager: Here are the leaders of my team.')

state.from(manager, 1).without(manager).forEach((leader) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    state.from(leader).without(leader).forEach((member) => {
        member.sayHello()
    })
})
