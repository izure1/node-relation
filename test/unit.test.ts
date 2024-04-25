import { Relationship } from '../'

describe('RelationShip', () => {
  let inst: Relationship<string>
  beforeAll(() => {
    inst = new Relationship<string>().to('a', 'b', 'c').to('d','e')
  })

  test('from', () => {
    const state = new Relationship<string>()
      .to('language', 'English', 'Korean', 'Japanese')
      .both('English', 'US', 'France', 'Italy')

    expect(state.from('language').nodes.sort()).toEqual([
      'language',
      'English',
      'Korean',
      'Japanese',
      'US',
      'France',
      'Italy'
    ].sort())

    expect(state.from('English').nodes.sort()).toEqual([
      'English',
      'US',
      'France',
      'Italy'
    ].sort())
  })

  test('where', () => {
    const state = new Relationship<string>()
      .both('English', 'US', 'France', 'Italy')
    expect(state.where(v => v === 'English').nodes.sort()).toEqual([
      'English',
      'US',
      'France',
      'Italy'
    ].sort())
  })

  test('without', () => {
    const state = new Relationship<string>()
      .to('language', 'English', 'Korean', 'Japanese')

    expect(state.from('language').nodes.sort()).toEqual([
      'language',
      'English',
      'Korean',
      'Japanese'
    ].sort())

    expect(state.from('language').without('language').sort()).toEqual([
      'English',
      'Korean',
      'Japanese'
    ].sort())
  })

  test('unlinkTo', () => {
    let state = new Relationship<string>().to('a', 'b', 'c')
    state = state.unlinkTo('a', 'b')
    expect(state.nodes.sort()).toEqual([
      'a',
      'c'
    ].sort())
  })

  test('unlinkBoth', () => {
    let state = new Relationship<string>().both('a', 'b', 'c')
    state = state.unlinkBoth('a', 'b')
    expect(state.nodes.sort()).toEqual([
      'a',
      'c'
    ])
  })

  test('drop', () => {
    let state = new Relationship<string>().to('a', 'b', 'c')

    state = state.drop('a')
    console.log(state.nodes, state)
    expect(state.nodes).toEqual([]) // empty

    let stateB = new Relationship<string>()
      .to('a', 'b')
      .to('b', 'c')

    stateB = stateB.drop('b')
    expect(stateB.nodes).toEqual([]) // empty

    let stateC = new Relationship<string>()
      .to('a', 'b')
      .to('b', 'c')
      .to('c', 'a')

    stateC = stateC.drop('b')
    expect(stateC.nodes.sort()).toEqual([
      'a',
      'c'
    ]) // a, c
  })
  
  test('cluster', () => {
    expect(inst.clusters).toEqual([['a', 'b', 'c'], ['d', 'e']])
  })

  test('nodes', () => {
    expect(inst.nodes).toEqual(['a', 'b', 'c', 'd', 'e'].sort())
  })

  test('a.nodes', () => {
    expect(inst.from('a').nodes).toEqual(['a', 'b', 'c'].sort())
    expect(inst.to('a', 'd').nodes).toEqual(['a', 'b', 'c', 'd', 'e'].sort())
  })

  test('has', () => {
    expect(inst.has('a')).toBeTruthy()
    expect(inst.has('f')).toBeFalsy()
  })

  test('reverse', () => {
    const reversed = inst.reverse
    expect(reversed.from('b').nodes.sort()).toEqual(['a', 'b'].sort())
  })

  test('children', () => {
    expect(inst.from('a').children.sort()).toEqual(['b', 'c'].sort())
    expect(inst.from('d').children.sort()).toEqual(['e'])
  })

  test('weight', () => {
    const state = new Relationship<string>()
      .to('a', 'd')
      .to('b', 'd')
      .to('c', 'd')

    expect(state.weight('d')).toBe(3)
  })

  test('weights', () => {
    const state = new Relationship<string>()
      .to('a', 'd')
      .to('b', 'd')
      .to('c', 'd')
      .to('d', 'a')

    expect(
      Object.fromEntries(state.weights().entries())
    ).toMatchObject({
      a: 4,
      b: 0,
      c: 0,
      d: 4
    })

    expect(
      Object.fromEntries(state.weights(false, true).entries())
    ).toMatchObject({
      a: 1,
      b: 0,
      c: 0,
      d: 1
    })
  })

  test('entries', () => {
    const state = new Relationship<string>()
      .to('a', 'b')
      .to('a', 'c')
      .to('a', 'd')
      .to('b', 'a')

    expect(
      Object.fromEntries(state.entries().entries())
    ).toMatchObject({
      a: 4,
      b: 4,
      c: 0,
      d: 0
    })

    expect(
      Object.fromEntries(state.entries(false, true).entries())
    ).toMatchObject({
      a: 1,
      b: 1,
      c: 0,
      d: 0
    })
  })

  test('depth', () => {
    const state = new Relationship<string>().to('a', 'b')

    expect(state.depth('a', 'b')).toBe(1)
    expect(state.depth('b', 'a')).toBe(Infinity)
  })

  test('distance', () => {
    const state = new Relationship<string>()
      .to('a', 'b')
      .to('b', 'c')
    
    expect(state.distance('b', 'a')).toBe(1)
    expect(state.distance('a', 'c')).toBe(2)
  })

  test('merge', () => {
    const state = new Relationship<string>()
    const A = state.to('user-a', 'user-b')
    const B = state.to('user-c', 'user-d')
    const C = A.merge(B.dataset)
    
    expect(C.nodes.sort()).toEqual(['user-a', 'user-b', 'user-c', 'user-d'])
  })

  test('dataset', () => {
    const state = new Relationship<string>().to('a', 'b').to('b', 'c', 'd')
    expect(state.dataset).toEqual([
      ['a', ['b']],
      ['b', ['c', 'd']]
    ])
  })

  test('oneHot', () => {
    const state = new Relationship<string>().to('a', 'b').to('b', 'c')
    const vectors = state.oneHot

    expect(Object.fromEntries(vectors.entries())).toMatchObject({
      a: [1, 0, 0],
      b: [0, 1, 0],
      c: [0, 0, 1]
    })
  })

  test('zeroVector', () => {
    const state = new Relationship<string>().to('a', 'b').to('b', 'c')
    expect(state.zeroVector).toEqual([0, 0, 0])
  })

  test('label', () => {
    const state = new Relationship<string>().to('a', 'b').to('b', 'c')
    expect(Object.fromEntries(state.label.entries())).toMatchObject({
      a: 1,
      b: 2,
      c: 3
    })
  })
})
