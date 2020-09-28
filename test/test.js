const { Relationship } = require('../dist/index')

const relationA = new Relationship().setReferTo('a', 'b', 'c')
console.log(relationA.nodes) // ['a', 'b', 'c']

const relationB = relationA.setReferTo('b', 'd')
console.log(relationB.nodes) // ['a', 'b', 'c', 'd']

const relationC = relationB.setReferTo('e', 'f')
console.log(relationC.getRelation('e').nodes) // ['e', 'f']

const relationD = relationC.setReferTo('e', 'a')
console.log(relationD.getRelation('e').nodes) // ['a', 'b', 'c', 'd', 'e', 'f']


const A = new Relationship().setReferTo('language', 'English', 'Korean', 'Japanese')
const B = A.setReferBoth('English', 'US', 'France', 'Italy')

console.log(A.getRelation('language').nodes) // language, English, Korean, Japanese
console.log(B.getRelation('English').nodes) // English, US, France, Italy

console.log(B.dropNode('language').nodes) // English, US, France, Italy


const rs = new Relationship()
                    .setReferTo('language', 'English', 'Korean', 'Japanese')
                    .setReferBoth('English', 'US', 'France', 'Italy')

console.log(`Languages: ${ rs.getRelation('language').getNodes('language') }`)
// Languages: English, Korean, Japanese, US, France, Italy

console.log(`English country: ${ rs.getRelation('English').dropNode('language').getNodes('English') }`)
// English country: US, France, Italy 