var Relation = require('../dist/NodeRelation.js')

const relationA = new Relation().setRelation('a', 'b', 'c')
console.log(relationA.nodes)

const relationB = relationA.setRelation('b', 'd')
console.log(relationB.nodes)

const relationC = relationB.setRelation('e', 'f')
console.log(relationC.getLegionRelation('e').nodes)

const relationD = relationC.setRelation('e', 'a')
console.log(relationD.getLegionRelation('e').nodes)
console.log(relationD.getLegionRelation('e').nodes, relationD.getLegionRelation('e').getNodes('e'))


const objA = { test: 1 }
const objB = { test: 2 }
const objC = { test: 3 }
const relationObj = new Relation().setRelation(objA, objB).setRelation(objB, objC)

console.log(relationObj.getRelation(objA).nodes, relationObj.getLegionRelation(objA).nodes)