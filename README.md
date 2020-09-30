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
## Web brower
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
You can pass dataset paramter to init this instance.
The `RelationData` is type of 2-dimentional array. Check dataset getter description.
```
const rs = new Relationship([['language', ['English', 'Korean', 'Japanese']]])
const copy = new Relationship(rs.dataset)
```
### `(getter)` dataset: `RelationData[]`
Returns as 2-dimentional array of relationships between nodes in the instance. Relationships are returned to saveable data-type(json).
```
const rs = new Relationship().setReferTo('a', 'b').setReferTo('b', 'c', 'd')
rs.dataset // [ [a,['b']], [b,['c', 'd']] ]
```
### `(getter)` nodes: `RelationNode[]`
Get all nodes from the instance.
```
const rs = new Relation().setReferTo('a', 'b').setReferTo('b', 'c')
rs.nodes // a, b, c
```
### setReferTo(target: `RelationNode`, ...nodes: `RelationNode[]`): `Relationship`
Creates a new refer between nodes, and returns it as a Relationship instance.
This is one-sided relationship between both nodes.
```
const A = new Relationship().setReferTo('language', 'English', 'Korean', 'Japanese')
```
### setReferBoth(target: `RelationNode`, ...nodes: `RelationNode[]`): `Relationship`
Creates a new relationship between nodes, and returns it as a new Relationship instance.
Both nodes will know each other.
```
const A = new Relationship().setReferTo('language', 'English', 'Korean', 'Japanese')
const B = A.setReferBoth('English', 'US', 'France', 'Italy')
```
### getRelation(target: `RelationNode[]`, depth?: `number` = -1): `Relationship`
Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
You can control calculation depth relationship with depth paramter. If depth parameter are negative, it's will be calculte all relationship between nodes in instance. Depth paramter default value is -1.
```
A.getRelation('language').nodes // language, English, Korean, Japanese
B.getRelation('English').nodes // language, English, US, France, Italy
```
### getNodes(node: `RelationNode`): `RelationNode[]`
Same as `(getter)nodes`, but removes the node passed as a parameter.
```
B.getLegionRelation('language').getRelativeNodes('language') // English, Korean, Japanese, US, France, Italy
```
### unlinkTo(target: `RelationNode`, ...nodes: `RelationNode[]`): `Relationship`
Deletes the relationship between nodes and returns it as a new Relationship instance.
This is one-sided cut off between both nodes.
```
B.unlinkTo('English', 'France')
```
### unlinkBoth(target: `RelationNode`, ...nodes: `RelationNode[]`): `Relationship`
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
# Try it simply
```
const rs = new Relationship()
            .setReferTo('language', 'English', 'Korean', 'Japanese')
            .setReferBoth('English', 'US', 'France', 'Italy')

console.log(`Languages: ${ rs.getRelation('language').getNodes('language') }`)
// Languages: English, Korean, Japanese, US, France, Italy

console.log(`English country: ${ rs.getRelation('English').dropNode('language').getNodes('English') }`)
// English country: US, France, Italy 
```
# Applying (Advanced Course, with Typescript)
```
import { Relationship } from 'node-relation'

class Human {
    name: string
    constructor(name: string) {
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
let rs: Relationship<Human> = new Relationship

rs = rs.setReferBoth(john, paul, lawrence)
rs = rs.setReferBoth(jacob, richard, collin)
rs = rs.setReferTo(manager, john, jacob)

console.log('manager: Here are the leaders of my team.')
rs.getRelation(manager, 1).getNodes(manager).forEach((leader: Human) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    rs.getRelation(leader).getNodes(leader).forEach((member: Human) => {
        member.sayHello()
    })
})
```