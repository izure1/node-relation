import * as Relationship from "../Relationship"

describe("Relationship.Relationship.clusters", () => {
    let inst: Relationship.Relationship<string>
    let equalInst: Relationship.Relationship<string[]>

    beforeEach(() => {
        inst = new Relationship.Relationship()
        inst.to('a', 'b', 'c').to('d','e')

        equalInst = new Relationship.Relationship(undefined, true)
        equalInst.to(['a'], ['b'], ['c']).to(['d'], ['e'])
    })

    test("0", () => {
        let result: any = inst.clusters
        expect(result).toEqual([['a', 'b', 'c'], ['d', 'e']])
    })

    test("1", () => {
        let result = equalInst.nodes.sort()
        expect(result).toEqual([['a'], ['b'], ['c'], ['d'], ['e']].sort())
    })

    test("2", () => {
      let result = equalInst.from(['a']).nodes
      expect(result.sort()).toEqual([['a'], ['b'], ['c']].sort())

      let result2 = equalInst.to(['a'], ['d']).from(['a']).nodes
      expect(result2.sort()).toEqual([['a'], ['b'], ['c'], ['d'], ['e']].sort())
    })

    test("3", () => {
      let result = equalInst.dataset
      expect(result.sort()).toEqual([
        [['a'], [['b'], ['c']]],
        [['d'], [['e']]]
      ].sort())
    })
})

describe("Relationship.Relationship.add", () => {
    let inst: any = Relationship.Relationship
    
    test("0", () => {
        expect(inst.add(true, [], [1], [2], [3], [3]).sort()).toEqual([[1],[2],[3]].sort())
    })

    test("1", () => {
        expect(inst.has(true, [[1], [2], [3]], [1])).toBe(true)
        expect(inst.has(true, [[1], [2], [3]], [4])).toBe(false)
    })

    test("1", () => {
        const array = [[1], [2], [3]]
        expect(inst.drop(true, array, [1]).sort()).toEqual([[2], [3]].sort())
    })
})

describe("Relationship.Relationship.reverse", () => {
    let inst: Relationship.Relationship<number>

    beforeEach(() => {
      inst = new Relationship.Relationship()
      inst.to(1, 2, 3).to(3, 4)
    })
    
    test("0", () => {
        const reversed = inst.reverse
        expect(reversed.from(2).nodes.sort()).toEqual([1, 2].sort())
    })
})

describe("Relationship.Relationship.children", () => {
    let inst: Relationship.Relationship<number>

    beforeEach(() => {
      inst = new Relationship.Relationship()
      inst.to(1, 2, 3).to(3, 4).both(5, 6)
    })
    
    test("0", () => {
        expect(inst.from(1).children.sort()).toEqual([2, 3, 4].sort())
        expect(inst.from(5).children.sort()).toEqual([5, 6].sort())
    })
})

describe("Relationship.Relationship.raw", () => {
    let inst: Relationship.Relationship<{ name: string }>

    beforeEach(() => {
        inst = new Relationship.Relationship(undefined, true)
        inst.to({ name: 'a' }, { name: 'b' })
    })

    test("0", () => {
        const weights = inst.weights()

        expect(weights.get({ name: 'b' })).toBe(undefined)

        const raw = inst.raw({ name: 'b' })
        expect(weights.get(raw!)).toBe(1)
    })
})

// @ponicode
describe("Relationship.Relationship.weights", () => {
    let inst: Relationship.Relationship<number>

    beforeEach(() => {
        inst = new Relationship.Relationship()
        inst.to(2, 1).to(3, 1).to(4, 2)
    })

    test("0", () => {
        const a: Record<string, number> = Object.fromEntries(inst.weights(false, true).entries())
        expect(a).toMatchObject({ '1': 1, '2': 0.5, '3': 0, '4': 0 })

        const b: Record<string, number> = Object.fromEntries(inst.weights(false, true, true).entries())
        expect(b).toMatchObject({ '1': 0.6666666666666666, '2': 0.3333333333333333, '3': 0, '4': 0 })

        const c: Record<string, number> = Object.fromEntries(inst.weights(false).entries())
        expect(c).toMatchObject({ '1': 2, '2': 1, '3': 0, '4': 0 })
    })
})
