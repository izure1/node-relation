# node-relation

[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/node-relation/badge)](https://www.jsdelivr.com/package/npm/node-relation)

This module helps you manage string, numbers, object as a group.
Check the code.

```javascript
import { Relationship } from 'node-relation'

let state = new Relationship().to('a', 'b')
state.nodes // ['a', 'b']

state = state.to('b', 'c')
state.nodes // ['a', 'b', 'c']

state = state.to('c', 'd')
state.from('c').nodes // ['c', 'd']

state = state.to('d', 'a')
state.from('c').nodes // ['a', 'b', 'c', 'd']
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
  const state = new NodeRelation.Relationship().to('a', 'b', 'c')
</script>
```

### Browser (esnext)

```javascript
import { Relationship } from 'https://cdn.jsdelivr.net/npm/node-relation@latest/dist/esm/index.min.js'
```

### Node.js

```javascript
import { Relationship } from 'node-relation'

const state = new Relationship().to('a', 'b', 'c')
```

## Methods

The data inside the instance is immutable.
The method does not modify the data inside, it returns the result of the calculation as a new instance.

### ***to***(source: `T`, ...targets: `T[]`): `Relationship`

Creates a new refer between nodes, and returns it as a Relationship instance.
This is one-sided relationship between both nodes.

```javascript
const state = new Relationship().to('language', 'English', 'Korean', 'Japanese')
```

```bash
# state
language ─> English
language ─> Korean
language ─> Japanese
```

### ***both***(a: `T`, ...b: `T[]`): `Relationship`

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
English <─> US
English <─> France
English <─> Italy
language ─> Korean
language ─> Japanese
```

### ***all***(...nodes: `T[]`): `Relationship`

Creates a new relationship between all each other nodes, and returns it as a new Relationship instance.
All nodes will know each others.

```javascript
const state = new Relationship().all('john', 'harris', 'richard')
```

```bash
john <─> harris
harris <─> richard
richard <─> john
```

### ***from***(source: `T`, depth?: `number` = -1): `Relationship`

Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
You can control calculation depth relationship with depth parameter. If depth parameter are negative, it's will be calculate all relationship between nodes in instance. Depth parameter default value is -1.

```javascript
let state = new Relationship()
  .to('language', 'English', 'Korean', 'Japanese')
  .both('English', 'US', 'France', 'Italy')

state.from('language').nodes // language, English, Korean, Japanese, US, France, Italy
state.from('English').nodes // English, US, France, Italy
```

### ***where***(filter: (node: `T`, i: `number`, array: `T[]`) => `boolean`, depth?: `number` = -1): `Relationship`

Returns a new relationship instance with only nodes that meet the conditions.

```javascript
const state = new Relationship()
  .both('English', 'US', 'France', 'Italy')

state.where((v) => v === 'English').nodes // English, US, France, Italy
```

### ***without***(...nodes: `T[]`): `T[]`

Returns the remaining nodes except those received as parameters from the current relationship instance.

```javascript
const state = new Relationship()
  .to('language', 'English', 'Korean', 'Japanese')

state.from('language').nodes // language, English, Korean, Japanese
state.from('language').without('language') // English, Korean, Japanese
```

### ***unlinkTo***(source: `T`, ...targets: `T[]`): `Relationship`

Deletes the relationship between nodes and returns it as a new Relationship instance.
This is one-sided cut off between both nodes.

```javascript
let state = new Relationship()
  .to('a', 'b', 'c')

state = state.unlinkTo('a', 'b')
state.nodes // a, c
```

### ***unlinkBoth***(a: `T`, ...b: `T[]`): `Relationship`

Deletes the relationship between nodes and returns it as a new Relationship instance.
Both nodes will cut off each other.

```javascript
let state = new Relationship()
  .both('a', 'b', 'c')

state = state.unlinkBoth('a', 'b')
state.nodes // a, c
```

### ***drop***(...nodes: `T[]`): `Relationship`

Delete the node. If the node associated with the deleted node is isolated, it is deleted together. Returns the result with a new Relationship instance.

```javascript
let state = new Relationship()
  .to('a', 'b', 'c')

state = state.drop('a')
state.nodes // empty

let stateB = new Relationship()
  .to('a', 'b')
  .to('b', 'c')

stateB = stateB.drop('b')
stateB.nodes // a

let stateC = new Relationship()
  .to('a', 'b')
  .to('b', 'c')
  .to('c', 'a')

stateC = stateC.drop('b')
stateC.nodes // a, c
```

### ***has***(node: `T`): `boolean`

Returns whether the instance contains that node.

```javascript
const state = new Relationship()
  .to('a', 'b', 'c')

const exists = state.has('a') // true
```

### ***hasAll***(...nodes: `T[]`): `boolean`

Returns whether the instance contains all of its nodes.

```javascript
const state = new Relationship()
  .to('a', 'b', 'c')

const existsAll = state.hasAll('a', 'b') // true
```

### ***weight***(node: `T`, log?: `boolean` = `false`): `number`

Returns how many nodes are related to the node received by the parameter.

```javascript
const state = new Relationship()
  .to('a', 'd')
  .to('b', 'd')
  .to('c', 'd')

const weight = state.weight('d') // 3
```

### ***weights***(log?: `boolean` = `false`, normalize?: `boolean` = `false`): `Map<T, number>`

Returns the weight of all nodes. Check the `weight` method.

```javascript
const state = new Relationship()
  .to('a', 'd')
  .to('b', 'd')
  .to('c', 'd')
  .to('d', 'a')

// Map<[['a', 1], ['b', 0], ['c', 0], ['d', 3]]>
const weights = state.weights()

// Map<[['a', 0.333...], ['b', 0], ['c', 0], ['d', 1]]>
const normalizedWeights = state.weights(false, true) 
```

### ***depth***(source: `T`, target: `T`, log?: `boolean` = `false`): `number`

Returns the found minimum depth to between source to target.

```javascript
const state = new Relationship()
  .to('a', 'b')
  
state.depth('a', 'b') // 1
state.depth('b', 'a') // Infinity
```

### ***distance***(a: `T`, b: `T`, log?: `boolean` = `false`): `number`

Returns the found minimum distance to between both nodes. This is same as `Math.min(this.depth(a, b), this.depth(b, a))`

```javascript
const state = new Relationship()
  .to('a', 'b')
  .to('b', 'c')

state.distance('b', 'a') // 1
state.distance('a', 'c') // 2
```

### ***merge***(...datasets: `RelationData[]`): `Relationship`

Merge a relation dataset with this instance, and returns it as a new Relationship instance.
If there is a non-overlapping dataset, It will be append to instance.

```javascript
const A = state.to('user-a', 'user-b')
const B = state.to('user-c', 'user-d')
const C = A.merge(B.dataset).nodes // user-a, user-b, user-c, user-d
```

### ***clear***(): `void`

Destroy the data in the instance. It is used for garbage collector.

### ***constructor***(dataset?: `RelationData[]`): `Relationship`

You can pass dataset parameter to init this instance.
The `RelationData` is type of 2-dimensional tuple array. Check dataset getter description.

```javascript
const state = new Relationship([ ['a', ['b', 'c', 'd']] ])
const clone = new Relationship(state.dataset) 
```

### `(getter)` ***dataset***: `RelationData[]`

Returns as 2-dimensional array of relationships between nodes in the instance. Relationships are returned to saveable data-type(json).

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c', 'd')
state.dataset // [ ['a', ['b']], ['b', ['c', 'd']] ]
```

### `(getter)` ***nodes***: `T[]`

Get all nodes from the instance.

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c')
state.nodes // a, b, c
```

### `(getter)` ***nodeset***: `Set<T>`

Get all nodes as Set object from the instance.

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c')
state.nodeset // Set<['a', 'b', 'c']>
```

### `(getter)` ***oneHot***: `Map<T, number[]>`

Get all nodes as one-hot vectors from the instance. It could be used as dataset for machine learning.

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c')
const vectors = state.oneHot

vectors // Map<[['a', [1, 0, 0]], ['b', [0, 1, 0]], ['c', [0, 0, 1]]]>
Array.from(vectors.values()) // [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
```

### `(getter)` ***zeroVector***: `number[]`

Get a 1-dimensional vector that was filled 0. The vector's size are same as nodes length of instance. This is useful for representing data that does not belong to anything. It could be used as dataset for machine learning.

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c')

const vectors = state.oneHot
const zeroVector = state.zeroVector // [0, 0, 0]
const allVectors = [zeroVector, ...vectors.values()]
```

### `(getter)` ***label***: `Map<T, number>`

Get all nodes as labeled vector from the instance. It could be used as dataset for machine learning.

```javascript
const state = new Relationship().to('a', 'b').to('b', 'c')
const vector = state.label

vector // Map<[['a', 0], ['b', 1], ['c', 2]]>
Array.from(vector.values()) // [0, 1, 2]
```

### `(getter)` ***clusters***: `T[][]`

Returns the clustering models of this instance in the form of a two-dimensional array.

```javascript
let state = new Relationship().to('a', 'b', 'c').to('d', 'e')
state.clusters // [[a, b, c], [d, e]]

state = state.to('e', 'a')
state.clusters // [[a, b, c, d, e]]
```

## Try it simply

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
import { Relationship } from 'node-relation/dist/umd/raw/index'

const sentence = 'what will the fat cat sit on'
const words = sentence.split(' ')

const state = new Relationship<string>()

words.forEach((word, i) => {
  const next = words[i+1]
  if (next) {
    state.to(word, next)
  }
})

const oneHot = state.oneHot // Map<[['what', [1,0,0,0,0,0,0]], ['will', [0,1,0,0,0,0,0]], ...]>
const oneHotVectors = Array.from(oneHot.values())

const label = state.label // Map<[['what', 0], ['will', 1], ...]>
const labels = Array.from(label.values())
```

### Migration 3.x.x to 4.x.x

Check [readme](https://github.com/izure1/node-relation/blob/master/Migration_3_to_4.md)
