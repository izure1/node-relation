# node-relation

This module helps you manage string, numbers, and cymbols as a group.

```
import { create, setRelation, getRelation } from 'node-relation'

const group = create()

setRelation(group, 'JavaScript', 'Node.JS')
setRelation(group, 'Node.JS', 'ES2018')
setRelation(group, 'ES2018', 'Webpack')

console.log( getRelation(group, 'ES2018') ) // [ 'JavaScript', 'Node.JS', 'ES2018', 'Webpack' ]

```