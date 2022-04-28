import * as EqualMap from "../EqualMap"
describe("EqualMap.EqualMap.get", () => {
    let inst: EqualMap.EqualMap<number[], any>

    beforeEach(() => {
        inst = new EqualMap.EqualMap()
        for (let i = 0; i < 10; i++) {
          inst.set([0], i)
        }
    })

    test("0", () => {
        expect(Array.from(inst.keys())).toEqual([[0]])

        const has = inst.has([0])
        const exists = inst.delete([0])

        expect(Array.from(inst.keys())).toEqual([])
        expect(has).toBe(true)
        expect(exists).toBe(true)
    })
})
