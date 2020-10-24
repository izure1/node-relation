var { Relationship } = require('../dist/index')

class Human {
    constructor(name) {
        this.name = name
    }
    sayHello() {
        console.log(`Hello, my name is ${this.name}`)
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

state = state.setReferTo(manager, john, jacob)
            .setReferAll(john, paul, lawrence)
            .setReferAll(jacob, richard, collin)

console.log(state.getRelation(manager, 1).getNodes(manager))
console.log('manager: Here are the leaders of my team.')

state.getRelation(manager, 1).getNodes(manager).forEach((leader) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    state.getRelation(leader).getNodes(leader).forEach((member) => {
        member.sayHello()
    })
})