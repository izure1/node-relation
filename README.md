# node-relation

This module helps you manage string, numbers, object as a group.
Check the code.

```javascript
import { Relationship } from 'node-relation'

const A = new Relationship().to('a', 'b', 'c')
console.log(A.nodes) // ['a', 'b', 'c']

const B = A.to('b', 'd')
console.log(B.nodes) // ['a', 'b', 'c', 'd']

const C = B.to('e', 'f')
console.log(C.from('e').nodes) // ['e', 'f']

const D = C.to('e', 'a')
console.log(D.from('e').nodes) // ['a', 'b', 'c', 'd', 'e', 'f']
```

## Install

You can download in npm [node-relation](https://www.npmjs.com/package/node-relation).

```bash
npm install node-relation
```

## How to use

### Browser (umd)

```html
<script src="https://cdn.jsdelivr.net/npm/node-relation@latest/dist/umd/index.min.js"></script>
<script>
  const A = new NodeRelation.Relationship().to('a', 'b', 'c')
</script>
```

### Browser (esnext)

```javascript
import { Relationship } from 'https://cdn.jsdelivr.net/npm/node-relation@latest/dist/esm/index.min.js'
```

### Node.js

```javascript
import { Relationship } from 'node-relation'

const A = new Relationship().to('a', 'b', 'c')
```

### Migration 3.x.x to 4.x.x

Check [readme](./Migration_3_to_4.md)

### Methods

The data inside the instance is immutable.
The method does not modify the data inside, it returns the result of the calculation as a new instance.

#### constructor(dataset?: `RelationData[]`): `Relationship`

You can pass dataset parameter to init this instance.
The `RelationData` is type of 2-dimensional array. Check dataset getter description.

```javascript
const state = new Relationship([['language', ['English', 'Korean', 'Japanese']]])
const clone = new Relationship(state.dataset)
```

#### `(getter)` dataset: `RelationData[]`

Returns as 2-dimensional array of relationships between nodes in the instance. Relationships are returned to saveable data-type(json).

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c', 'd')
state.dataset // [ [a,['b']], [b,['c', 'd']] ]
```

#### `(getter)` nodes: `RelationNode[]`

Get all nodes from the instance.

```javascript
const state = new Relation().to('a', 'b').to('b', 'c')
state.nodes // a, b, c
```

#### `(getter)` nodeset: `Set<RelationNode>`

Get all nodes as Set object from the instance.

```javascript
const state = new Relation().to('a', 'b').to('b', 'c')
state.nodeset // Set<['a', 'b', 'c']>
```

#### to(source: `RelationNode`, ...targets: `RelationNode[]`): `Relationship`

Creates a new refer between nodes, and returns it as a Relationship instance.
This is one-sided relationship between both nodes.

```javascript
const A = new Relationship().to('language', 'English', 'Korean', 'Japanese')
```

```bash
# A
language ─> English
language ─> Korean
language ─> Japanese
```

#### both(a: `RelationNode`, ...b: `RelationNode[]`): `Relationship`

Creates a new relationship between nodes, and returns it as a new Relationship instance.
Both nodes will know each other.

```javascript
const A = new Relationship().to('language', 'English', 'Korean', 'Japanese')
const B = A.both('English', 'US', 'France', 'Italy')
```

```bash
# A
language ─> English
language ─> Korean
language ─> Japanese

# B
language ─> English
            (English <─> US)
            (English <─> France)
            (English <─> Italy)
language ─> Korean
language ─> Japanese
```

#### all(...nodes: `RelationNode[]`): `Relationship`

Creates a new relationship between all each other nodes, and returns it as a new Relationship instance.
All nodes will know each others.

```javascript
const Team = new Relationship().all('john', 'harris', 'richard')
```

```bash
# Team
john <─> harris
harris <─> richard
richard <─> john
```

#### from(source: `RelationNode[]`, depth?: `number` = -1): `Relationship`

Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
You can control calculation depth relationship with depth parameter. If depth parameter are negative, it's will be calculate all relationship between nodes in instance. Depth parameter default value is -1.

```javascript
A.from('language').nodes // language, English, Korean, Japanese
B.from('English').nodes // language, English, US, France, Italy
```

#### where(filter: (node: `RelationNode`, i: `number`, array: `RelationNode[]`) => `boolean`): `Relationship`

Returns a new relationship instance with only nodes that meet the conditions.

```javascript
A.where((v) => v.includes('Kor')).nodes // Korean
```

#### without(...nodes: `RelationNode[]`): `RelationNode[]`

Returns the remaining nodes except those received as parameters from the current relationship instance.

```javascript
A.from('language').without('language') // English, Korean, Japanese
```

#### unlinkTo(source: `RelationNode`, ...targets: `RelationNode[]`): `Relationship`

Deletes the relationship between nodes and returns it as a new Relationship instance.
This is one-sided cut off between both nodes.

```javascript
B.unlinkTo('English', 'France')
```

#### unlinkBoth(a: `RelationNode`, ...b: `RelationNode[]`): `Relationship`

Deletes the relationship between nodes and returns it as a new Relationship instance.
Both nodes will cut off each other.

```javascript
B.unlinkBoth('English', 'France')
```

#### drop(...nodes: `RelationNode[]`): `Relationship`

Delete the node. If the node associated with the deleted node is isolated, it is deleted together. Returns the result with a new Relationship instance.

```javascript
B.drop('language').nodes // English, US, France, Italy
```

#### has(node: `RelationNode`): `Boolean`

Returns whether the instance contains that node.

```javascript
const hasKorean = B.has('korean') // true
```

#### hasAll(...nodes: `RelationNode[]`): `Boolean`

Returns whether the instance contains all of its nodes.

```javascript
const hasAll = B.hasAll('Japanese', 'Korean') // true
```

#### clear(): `void`

Destroy the data in the instance. It is used for garbage collector.

## Try it simply

```javascript
const state = new Relationship()
            .to('language', 'English', 'Korean', 'Japanese')
            .both('English', 'US', 'France', 'Italy')

console.log(`Languages: ${ state.from('language').without('language') }`)
// Languages: English, Korean, Japanese, US, France, Italy

console.log(`English country: ${ state.from('English').drop('language').without('English') }`)
// English country: US, France, Italy 
```

## Applying (Advanced usage, with Typescript)

```javascript
// The data structure what you want
// {
//   'server-a': [userA, userB],
//   'server-b': [userC]
// }

import { Relationship } from 'node-relation'

type ServerName = 'server-a' | 'server-b'
class User {
  ...
}

const userA = new User
const userB = new User
const userC = new User

let state: Relationship<ServerName|User> = new Relationship

state = state.to('server-a', userA, userB)
state = state.to('server-b', userC)

console.log( state.from('server-b').without('server-b') ) // userC
```

```javascript
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

state = state.to(manager, john, jacob)
             .all(john, paul, lawrence)
             .all(jacob, richard, collin)

console.log(`${manager.name}: Here are the leaders of my team.`)
state.from(manager, 1).without(manager).forEach((leader: Human) => {
    leader.sayHello()
    console.log(`${leader.name}: And... these are my teammates.`)
    state.from(leader).without(leader).forEach((member: Human) => {
        member.sayHello()
    })
})
```
