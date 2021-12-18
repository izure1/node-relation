# node-relation

This module helps you manage string, numbers, object as a group.
Check the code.
```
import { Relationship } from 'node-relation'

const A = new Relationship().setReferTo('a', 'b', 'c')
console.log(A.nodes) // ['a', 'b', 'c']

const B = A.setReferTo('b', 'd')
console.log(B.nodes) // ['a', 'b', 'c', 'd']

const C = B.setReferTo('e', 'f')
console.log(C.getRelation('e').nodes) // ['e', 'f']

const D = C.setReferTo('e', 'a')
console.log(D.getRelation('e').nodes) // ['a', 'b', 'c', 'd', 'e', 'f']
```
# Install
You can download in npm [node-relation](https://www.npmjs.com/package/node-relation).
```
npm install node-relation
```
# How to use
## Web browser
```
<script src="js/nodeRelation.js"></script>
<script>
  const A = new NodeRelation.Relationship().setReferTo('a', 'b', 'c')
</script>
```
## Front-end
```
import { Relationship } from 'node-relation'

const A = new Relationship().setReferTo('a', 'b', 'c')
```
## Back-end
```
const { Relationship } = require('node-relation')

const A = new Relationship().setReferTo('a', 'b', 'c')
```
# Methods
The data inside the instance is immutable.
The method does not modify the data inside, it returns the result of the calculation as a new instance.

### constructor(dataset?: `RelationData[]`): `Relationship`
You can pass dataset parameter to init this instance.
The `RelationData` is type of 2-dimentional array. Check dataset getter description.
```
const state = new Relationship([['language', ['English', 'Korean', 'Japanese']]])
const copy = new Relationship(state.dataset)
```
### `(getter)` dataset: `RelationData[]`
Returns as 2-dimentional array of relationships between nodes in the instance. Relationships are returned to saveable data-type(json).
```
const state = new Relationship().setReferTo('a', 'b').setReferTo('b', 'c', 'd')
state.dataset // [ [a,['b']], [b,['c', 'd']] ]
```
### `(getter)` nodes: `RelationNode[]`
Get all nodes from the instance.
```
const state = new Relation().setReferTo('a', 'b').setReferTo('b', 'c')
state.nodes // a, b, c
```
### `(getter)` nodeset: `Set<RelationNode>`
Get all nodes as Set object from the instance.
```
const state = new Relation().setReferTo('a', 'b').setReferTo('b', 'c')
state.nodeset // Set<['a', 'b', 'c']>
```
### setReferTo(source: `RelationNode`, ...dists: `RelationNode[]`): `Relationship`
Creates a new refer between nodes, and returns it as a Relationship instance.
This is one-sided relationship between both nodes.
```
const A = new Relationship().setReferTo('language', 'English', 'Korean', 'Japanese')
```
### setReferBoth(a: `RelationNode`, ...b: `RelationNode[]`): `Relationship`
Creates a new relationship between nodes, and returns it as a new Relationship instance.
Both nodes will know each other.
```
const A = new Relationship().setReferTo('language', 'English', 'Korean', 'Japanese')
const B = A.setReferBoth('English', 'US', 'France', 'Italy')
```
### setReferAll(...nodes: `RelationNode[]`): `Relationship`
Creates a new relationship between all each other nodes, and returns it as a new Relationship instance.
All nodes will know each others.
```
const Team = new Relationship().setReferAll('john', 'harris', 'richard')
```
### getRelation(source: `RelationNode[]`, depth?: `number` = -1): `Relationship`
Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
You can control calculation depth relationship with depth parameter. If depth parameter are negative, it's will be calculte all relationship between nodes in instance. Depth parameter default value is -1.
```
A.getRelation('language').nodes // language, English, Korean, Japanese
B.getRelation('English').nodes // language, English, US, France, Italy
```
### getNodes(node: `RelationNode`): `RelationNode[]`
Same as `(getter)nodes`, but removes the node passed as a parameter.
```
B.getRelation('language').getNodes('language') // English, Korean, Japanese, US, France, Italy
```
### getNodeset(node: `RelationNode`): `Set<RelationNode>`
Same as `(getter)nodeset`, but removes the node passed as a parameter.
```
B.getRelation('language').getNodeset('language') // Set<['English', 'Korean', 'Japanese', 'US', 'France', 'Italy']>
```
### getAmbientNodes(node: `RelationNode`): `RelationNode[]`
Alias to `getNodes`
### getAmbientNodeset(node: `RelationNode`): `Set<RelationNode>`
Alias to `getNodeset`
### unlinkTo(source: `RelationNode`, ...dists: `RelationNode[]`): `Relationship`
Deletes the relationship between nodes and returns it as a new Relationship instance.
This is one-sided cut off between both nodes.
```
B.unlinkTo('English', 'France')
```
### unlinkBoth(a: `RelationNode`, ...b: `RelationNode[]`): `Relationship`
Deletes the relationship between nodes and returns it as a new Relationship instance.
Both nodes will cut off each other.
```
B.unlinkBoth('English', 'France')
```
### dropNode(...nodes: `RelationNode[]`): `Relationship`
Delete the node. If the node associated with the deleted node is isolated, it is deleted together. Returns the result with a new Relationship instance.
```
B.dropNode('language').nodes // English, US, France, Italy
```
### hasNode(node: `RelationNode`): `Boolean`
Returns whether the instance contains that node.
```
const hasKorean = B.hasNode('korean') // true
```
### clear(): `void`
Destroy the data in the instance. It is used for garbage collector.
# Try it simply
```
const state = new Relationship()
            .setReferTo('language', 'English', 'Korean', 'Japanese')
            .setReferBoth('English', 'US', 'France', 'Italy')

console.log(`Languages: ${ state.getRelation('language').getAmbientNodes('language') }`)
// Languages: English, Korean, Japanese, US, France, Italy

console.log(`English country: ${ state.getRelation('English').dropNode('language').getAmbientNodes('English') }`)
// English country: US, France, Italy 
```
# Applying (Advanced usage, with Typescript)
```
// The data structure what you want
// {
//   'server-a': [userA, userB],
//   'server-b': [userC]
// }

import { Relationship } from 'node-relation'

type ServerName = 'server-a' | 'server-b'
class User {}

const userA = new User
const userB = new User
const userC = new User

let state: Relationship<ServerName|User> = new Relationship

state = state.setReferTo('server-a', userA, userB)
state = state.setReferTo('server-b', userC)

console.log( state..getRelation('server-b').getAmbientNodes('server-b') ) // userC
```
```
import { Relationship } from 'node-relation'

class Human {
    name: string
    constructor(name: string) {
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
let state: Relationship<Human> = new Relationship

state = state.setReferTo(manager, john, jacob)
             .setReferAll(john, paul, lawrence)
             .setReferAll(jacob, richard, collin)

console.log(`${manager.name}: Here are the leaders of my team.`)
state.getRelation(manager, 1).getAmbientNodes(manager).forEach((leader: Human) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    state.getRelation(leader).getAmbientNodes(leader).forEach((member: Human) => {
        member.sayHello()
    })
})
```