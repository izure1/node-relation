# node-relation

This module helps you manage string, numbers as a group.

The data in the instance is immutable. Do not modify the data in the instance that invokes the method (setRelation, getRelation, getLegionRelation, deleteNode, etc.). Instead, it returns the result with a new instance.

Check the code.
```
import Relation from 'node-relation'

const relationA = new Relation().setRelation('a', 'b', 'c')
console.log(relationA.nodes)

const relationB = relationA.setRelation('b', 'd')
console.log(relationB.nodes)

const relationC = relationB.setRelation('e', 'f')
console.log(relationC.getLegionRelation('e').nodes)

const relationD = relationC.setRelation('e', 'a')
console.log(relationD.getLegionRelation('e').nodes)
```
---
## Methods
### setRelation(target: `RelationNode`, ...nodes: `RelationNode[]`): `Relation`
Creates a new relationship between nodes, and returns it as a relation instance.
```
const A = new Relation().setRelation('language', 'English', 'Korean', 'Japanese')
const B = A.setRelation('English', 'US', 'France', 'Italy')
```
### getRelation(...nodes: `RelationNode[]`): `Relation`
Only the nodes that are related to the node received by the parameter are filtered and returned in a new relation instance.
```
A.getRelation('language').nodes // English, Korean, Japanese
B.getRelation('English').nodes // US, France, Italy
```
### getLegionRelation(...nodes: `RelationNode[]`): `Relation`
Only groups of nodes that are associated with the node received by the parameter. Then make and return a new relation instance.
```
B.getLegionRelation('language').nodes // English, Korean, Japanese, US, France, Italy
```
### deleteRelation(target: `RelationNode`, ...nodes: `RelationNode[]`): Relation
Deletes the relationship between nodes and returns it as a new relation instance.
```
B.deleteRelation('English', 'France')
```
### deleteNode(...nodes: `RelationNode[]`): `Relation`
Delete the node. If the node associated with the deleted node is isolated, it is deleted together. Returns the result with a new relation instance.
```
B.deleteNode('lanugage').nodes // English, US, France, Italy
```
## Try it simply
```
const relation = new Relation()
                    .setRelation('language', 'English', 'Korean', 'Japanese')
                    .setRelation('English', 'US', 'France', 'Italy')

console.log(`Languages: ${ relation.getRelativeNodes('language') }`)
// Languages: English, Korean, Japanese

console.log(`English country: ${ relation.getRelation('English').deleteNode('language').getRelativeNodes('English') }`)
// English country: US, France, Italy 
```