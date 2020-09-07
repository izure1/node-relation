var Relation = require('../dist/NodeRelation')

const relationA = new Relation().setRelation('a', 'b', 'c')
console.log(relationA.nodes)

const relationB = relationA.setRelation('b', 'd')
console.log(relationB.nodes)

const relationC = relationB.setRelation('e', 'f')
console.log(relationC.getLegionRelation('e').nodes)

const relationD = relationC.setRelation('e', 'a')
console.log(relationD.getLegionRelation('e').nodes)