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
let rs = new Relationship

rs = rs.setReferBoth(john, paul, lawrence)
rs = rs.setReferBoth(jacob, richard, collin)
rs = rs.setReferTo(manager, john, jacob)

console.log(rs.getRelation(manager, 1).getNodes(manager))
console.log('manager: Here are the leaders of my team.')
rs.getRelation(manager, 1).getNodes(manager).forEach((leader) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    rs.getRelation(leader).getNodes(leader).forEach((member) => {
        member.sayHello()
    })
})