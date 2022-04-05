import * as Relationship from "../Relationship"

describe("Relationship.Relationship.clusters", () => {
    let inst: any

    beforeEach(() => {
        inst = new Relationship.Relationship()
        inst.to('a', 'b', 'c').to('d','e')
    })

    test("0", () => {
        let result: any = inst.clusters
        expect(result).toEqual([['a', 'b', 'c'], ['d', 'e']])
    })
})
