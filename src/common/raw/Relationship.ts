export type Relation<T> = T[]
export type RelationData<T> = [T, Relation<T>]

export class Relationship<T> {
  protected readonly __relations: Map<T, Relation<T>>

  constructor(data: RelationData<T>[] = []) {
    this.__relations = new Map(data)
  }

  /**
   * 배열이 노드를 가지고 있는지 여부를 반환합니다.
   * @param array 대상 배열입니다.
   * @param node 검색할 노드입니다.
   */
  protected static has<T>(array: T[], node: T): boolean {
    return array.includes(node)
  }

  /**
   * 배열에 노드를 추가합니다. 배열이 이미 노드를 가지고 있다면 무시합니다.
   * @param array 대상 배열입니다.
   * @param nodes 추가할 노드입니다.
   */
  protected static add<T>(array: T[], ...nodes: T[]): T[] {
    for (const node of nodes) {
      if (!Relationship.has(array, node)) {
        array.push(node)
      }
    }
    return array
  }

  /**
   * 배열에서 노드를 제거합니다.
   * @param array 대상 배열입니다.
   * @param node 제거할 노드입니다.
   */
  protected static drop<T>(array: T[], ...nodes: T[]): T[] {
    for (const node of nodes) {
      if (Relationship.has(array, node)) {
        const i = array.indexOf(node)
        if (i !== -1) array.splice(i, 1)
      }
    }
    return array
  }

  /**
   * 배열을 초기화합니다.
   * @param array 초기화할 배열입니다.
   */
  protected static clear<T>(array: T[]): T[] {
    array.length = 0
    return array
  }

  /**
   * Returns as 2-dimensional array of relationships between nodes in the instance.
   * Relationships are returned to saveable data-type(json).
   * @example
   * const saveData = JSON.stringify(state.dataset)
   * fs.writeFile('your-file.json', saveData) // in node.js
   * window.localStorage.set('your-file', saveData) // in browser
   */
  get dataset(): RelationData<T>[] {
    return Array.from(this.__relations)
  }

  /** Get all nodes from the instance. */
  get nodes(): T[] {
    const nodes: T[] = []
    for (const [source, targets] of this.__relations) {
      Relationship.add(nodes, source, ...targets)
    }
    return nodes
  }

  /** Get all nodes as Set object from the instance. */
  get nodeset(): Set<T> {
    const set = new Set<T>()
    for (const [source, targets] of this.__relations) {
      set.add(source)
      for (const dist of targets) {
        set.add(dist)
      }
    }
    return set
  }

  /**
   * Get all nodes as one-hot vectors from the instance. It could be used as dataset for machine learning.
   * @example
   * const vectorA = state.oneHot.get('A')
   * const vectors = Array.from(state.oneHot.values())
   */
  get oneHot(): Map<T, number[]> {
    const vectors = new Map<T, number[]>()
    const nodes = this.nodes
    nodes.forEach((node, i) => {
      const vector = new Array<number>(nodes.length).fill(0)
      vector[i] = 1
      vectors.set(node, vector)
    })
    return vectors
  }

  /**
   * Get a 1-dimensional vector that was filled 0. The vector's size are same as nodes length of instance. This is useful for representing data that does not belong to anything. It could be used as dataset for machine learning.
   * @example
   * const voidVector = state.zeroHot
   * const vectors = Array.from(state.oneHot.values())
   * const allVectors = [voidVector, ...vectors]
   */
  get zeroVector(): number[] {
    return new Array(this.nodes.length).fill(0)
  }

  /**
   * Get all nodes as labeled vector from the instance. It could be used as dataset for machine learning.
   * @example
   * const labelA = state.label.get('A')
   * const labels = Array.from(state.label.values())
   */
  get label(): Map<T, number> {
    const labels = new Map<T, number>()
    const nodes = this.nodes
    nodes.forEach((node, i) => {
      labels.set(node, i)
    })
    return labels
  }

  /**
   * Returns the clustering models of this instance in the form of a two-dimensional array.
   */
  get clusters(): T[][] {
    const clusters: T[][] = []
    const nodes = this.nodeset
    for (const node of nodes) {
      const relation = this.from(node)
      const borders = relation.nodes
      clusters.push(borders)
      for (const border of borders) {
        nodes.delete(border)
      }
    }
    return clusters
  }

  /**
   * Returns a new instance of this.
   * The clone instance are copy dataset from this, but It's not deep-copied object.
   */
  get clone(): this {
    return this.copy
  }

  protected get copy(): this {
    return new (this.constructor as any)(this.dataset)
  }

  /**
   * 해당 노드와 관련있는 릴레이션을 반환합니다. 릴레이션이 없다면 생성하고 반환합니다.
   * @param source 해당 노드입니다.
   */
  protected ensureRelation(source: T, ...targets: T[]): Relation<T> {
    if (!this.__relations.has(source)) {
      this.__relations.set(source, [])
    }
    const relation = this.__relations.get(source)!
    for (const dist of targets) {
      Relationship.add(relation, dist)
    }
    return relation
  }

  /**
   * Creates a new refer between nodes, and returns it as a Relationship instance.
   * This is one-sided relationship between both nodes.
   * @param source    The source node.
   * @param targets     The target nodes.
   * @example
   * // user-a -> user-b
   * // user-a -> user-c
   * state.to('user-a', 'user-b', 'user-c')
   */
  to(source: T, ...targets: T[]): this {
    this.ensureRelation(source, ...targets)
    return this
  }

  /**
   * Creates a new relationship between nodes, and returns it as a Relationship instance.
   * Both nodes will know each other.
   * @param a     Node A to refer to node B.
   * @param b     Node B to refer to node A.
   * @example
   * // user-a <-> user-b
   * // user-a <-> user-c
   * state.both('user-a', 'user-b', 'user-c')
   */
  both(a: T, ...b: T[]): this {
    this.ensureRelation(a, ...b)
    for (const dist of b) {
      this.ensureRelation(dist, a)
    }
    return this 
  }

  /**
   * Creates a new relationship between all each other nodes, and returns it as a Relationship instance.
   * All nodes will know each others.
   * @param nodes Nodes to relate to each other.
   * @example
   * // user-a <-> user-b
   * // user-b <-> user-c
   * // user-c <-> user-a
   * state.all('user-a', 'user-b', 'user-c')
   */
  all(...nodes: T[]): this {
    for (const node of nodes) {
      const relation = this.ensureRelation(node, ...nodes)
      Relationship.drop(relation, node)
    }
    return this
  }

  /**
   * 두 개의 릴레이션데이터 배열을 병합합니다.
   * 이는 두 개의 인스턴스를 병합하는데 사용하기에 좋습니다.
   * @param a 병합할 릴레이션데이터 배열입니다.
   * @param b 병합할 릴레이션데이터 배열입니다.
   */
  protected getCombinedDataset(a: RelationData<T>[], b: RelationData<T>[]): RelationData<T>[] {
    const map = new Map<T, Relation<T>>()
    const mapA = new Map<T, Relation<T>>(a)
    const mapB = new Map<T, Relation<T>>(b)

    for (const [sourceA, relationA] of mapA) {
      if (!map.has(sourceA)) {
        map.set(sourceA, relationA)
      }
      const relation = map.get(sourceA)!
      Relationship.add(relation, ...relationA)
    }
    for (const [sourceB, relationB] of mapB) {
      if (!map.has(sourceB)) {
        map.set(sourceB, relationB)
      }
      const relation = map.get(sourceB)!
      Relationship.add(relation, ...relationB)
    }

    return Array.from(map)
  }

  /**
   * 인스턴스에 있는 관계를 계산합니다. 시작 노드에서 시작하여, 깊이만큼 탐색합니다. 탐색하여 관계를 새로운 릴레이션데이터 배열로 만들어 반환합니다.
   * @param source 시작 노드입니다.
   * @param depth 탐색할 횟수입니다. 재귀할 때 마다 이 횟수가 줄어들어, 0보다 작아지면 기본값을 반환합니다.
   * @param accDataset 탐색된 관계를 누산할 릴레이션데이터 배열입니다.
   * @param tests 탐색된 노드를 담고있는 배열입니다. 이미 한 번 탐색된 노드는 이 배열에 담깁니다. 상호참조하는 관계로 인해 무한히 탐색되는 것을 방지하는 용도로 사용됩니다.
   */
  protected getSearchedRelationDataset(source: T, depth: number, accDataset: RelationData<T>[] = [[source, []]], tests: T[] = []): RelationData<T>[] {
    const distRelation: Relation<T>         = this.__relations.has(source) ? this.__relations.get(source)! : []
    const srcDataset: RelationData<T>[]     = [[source, distRelation]]
    if (!depth)                             return srcDataset
    if (!distRelation)                      return srcDataset
    if (Relationship.has(tests, source))    return srcDataset

    Relationship.add(tests, source)

    depth--
    accDataset = this.getCombinedDataset(accDataset, srcDataset)
    for (const dist of distRelation) {
      const distDataset = this.getSearchedRelationDataset(dist, depth, accDataset, tests)
      accDataset = this.getCombinedDataset(accDataset, distDataset)
    }
    return accDataset
  }

  /**
   * 인스턴스에 있는 관계의 깊이를 계산합니다. 현재 노드에서 목표 노드까지의 가장 짧은 깊이를 반환해야 합니다.
   * 시작 노드는 재귀하여 호출될 때 마다 변경됩니다.
   * @param current 현재 노드입니다.
   * @param target 목표 노드입니다.
   * @param depth 재귀호출되며 누적된 깊이입니다.
   * @param tests 탐색된 노드를 담고있는 배열입니다. 이미 한 번 탐색된 노드는 이 배열에 담깁니다. 상호참조하는 관계로 인해 무한히 탐색되는 것을 방지하는 용도로 사용됩니다.
   */
  protected getSearchedDepth(current: T, target: T, depth = 0, tests: T[] = []): number {
    if (current === target)                 return depth
    if (Relationship.has(tests, current))   return Infinity

    Relationship.add(tests, current)
    depth++

    let newDepth = Infinity
    const distRelation: Relation<T> = this.__relations.has(current) ? this.__relations.get(current)! : []

    for (const dist of distRelation) {
      const distDepth = this.getSearchedDepth(dist, target, depth, tests)
      newDepth = Math.min(newDepth, distDepth)
    }
    return newDepth
  }

  /**
   * Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
   * You can control calculation depth relationship with depth parameter.
   * @param source The source node.
   * @param depth If depth parameter are negative, it's will be calculate all relationship between nodes in instance. Depth parameter default value is -1.
   * @returns new Relationship instance.
   * @example
   * const A = state.to('user-a', 'user-b').to('user-b', 'user-c') // user-a -> user-b -> user-c
   * A.from('user-a') // 'user-a', 'user-b', 'user-c'
   * A.from('user-a', 1) // 'user-a', 'user-b'
   */
  from(source: T, depth: number = -1): this {
    const clone = this.copy
    const relationDataset = clone.getSearchedRelationDataset(source, --depth)
    return new (this.constructor as any)(relationDataset)
  }

  /**
   * Returns a new relationship instance with only nodes that meet the conditions or the relational node.  
   * This is similar to the `from` method, but it is useful when you want to use more detailed conditions.
   * You can control calculation depth relationship with depth parameter.
   * @param filter condition filter callback function
   * @param depth If depth parameter are negative, it's will be calculate all relationship between nodes in instance. Depth parameter default value is -1.
   * @returns new Relationship instance.
   * @example
   * // user-a -> user-b
   * // user-c -> user-d
   * const A = state.to('user-a', 'user-b').to('user-c', 'user-d')
   * A.where((node) => node.includes('a')) // user-a, user-b
   */
  where(filter: (node: T, i: number, array: T[]) => boolean, depth = -1): this {
    --depth
    let accData: RelationData<T>[] = []
    const correctNodes = this.nodes.filter(filter)
    for (const node of correctNodes) {
      const append = this.getSearchedRelationDataset(node, depth)
      accData = this.getCombinedDataset(accData, append)
    }
    return new (this.constructor as any)(accData) as this
  }

  /**
   * Returns the remaining nodes except those received as parameters from the current relationship instance.
   * @param nodes This is a list of nodes to exclude.
   * @example
   * const A = state.all('user-a', 'user-b', 'user-c')
   * const B = A.from('user-a')
   * B.nodes // user-a, user-b, user-c
   * B.without('user-a') // user-b, user-c
   */
  without(...nodes: T[]): T[] {
    return Relationship.drop(this.nodes, ...nodes)
  }

  /**
   * 해당 노드에서 참조하는 노드들 중에서 대상 노드를 제거합니다.
   * @param source 해당 노드입니다.
   * @param targets 대상 노드입니다.
   */
  protected unlinkRefersFromSource(source: T, ...targets: T[]): void {
    const relation = this.__relations.get(source)
    if (relation) {
      Relationship.drop(relation, ...targets)
    }
  }

  /**
   * Deletes the relationship between nodes and returns it as a Relationship instance.
   * This is one-sided cut off between both nodes.
   * Check the `to` method.
   * @param source The source node.
   * @param targets The target nodes.
   * @example
   */
  unlinkTo(source: T, ...targets: T[]): this {
    this.unlinkRefersFromSource(source, ...targets)
    return this
  }

  /**
   * Deletes the relationship between nodes and returns it as a Relationship instance.
   * Both nodes will cut off each other.
   * Check the `both` method.
   * @param a Node A to unlink from node B.
   * @param b Node B to unlink from node A.
   */
  unlinkBoth(a: T, ...b: T[]): this {
    this.unlinkRefersFromSource(a, ...b)
    for (const dist of b) {
      this.unlinkRefersFromSource(dist, a)
    }
    return this
  }

  /**
   * Delete the node. If the node associated with the deleted node is isolated, it is deleted together.
   * Returns the result with a Relationship instance.
   * @param nodes Nodes to be deleted.
   * @example
   * // user-a -> user-b
   * // user-a -> user-c
   * const A = state.to('user-a', 'user-b').to('user-a', 'user-c')
   * const B = A.drop('user-a')
   * B.nodes // empty
   */
  drop(...nodes: T[]): this {
    for (const relation of this.__relations.values()) {
      Relationship.drop(relation, ...nodes)
    }
    for (const node of nodes) {
      this.__relations.delete(node)
    }
    return this
  }

  /**
   * Returns whether the instance contains that node.
   * @param node Node to find.
   * @example
   * const A = state.to('user-a', 'user-b')
   * state.has('user-a') // true
   */
  has(node: T): boolean {
    let isExists = this.__relations.has(node)
    for (const [key, relation] of this.__relations) {
      if (key === node || Relationship.has(relation, node)) {
        isExists = true
        break
      }
    }
    return isExists
  }

  /**
   * Returns whether the instance contains all of its nodes.
   * @param nodes A list of nodes to search for.
   * @example
   * const A = state.to('user-a', 'user-b', 'user-c')
   * state.hasAll('user-a', 'user-f') // false
   */
  hasAll(...nodes: T[]): boolean {
    for (const node of nodes) {
      if (!this.has(node)) {
        return false
      }
    }
    return true
  }

  /**
   * Returns how many nodes are related to the node received by the parameter.
   * @param node Node to find.
   * @param log If this parameter is set to true, it returns the value to which the log function is applied. This is useful when the value is too high.
   * @example
   * const A = state.to('user-a', 'user-c').both('user-b', 'user-c')
   * A.weight('user-c') // 2
   * A.weight('user-a') // 0
   * A.weight('user-b') // 1
   */
  weight(node: T, log = false): number {
    let weight = 0
    for (const relation of this.__relations.values()) {
      if (Relationship.has(relation, node)) {
        weight++
      }
    }
    if (log) {
      weight = Math.log(weight + 1)
    }
    return weight
  }

  /**
   * Returns the weight of all nodes. Check the `weight` method.
   * @param log If this parameter is set to true, it returns the value to which the log function is applied. This is useful when the value is too high.
   * @param normalize Normalize the weight value. Convert all values to values from 0 to 1.
   */
  weights(log = false, normalize = false): Map<T, number> {
    const weights = new Map<T, number>()
    let max = 0
    for (const node of this.nodes) {
      const weight = this.weight(node, log)
      if (weight > max) {
        max = weight
      }
      weights.set(node, weight)
    }
    if (normalize) {
      const map = Array.from(weights)
      for (const [node, weight] of map) {
        weights.set(node, weight / max)
      }
    }
    return weights
  }

  /**
   * Returns the found minimum depth to between source to target.
   * If cannot find the way on source to target, Returns `Infinity`
   * @param source Node to start
   * @param target Node to target
   * @param log If this parameter is set to true, it returns the value to which the log function is applied. This is useful when the value is too high.
   * @example
   * const A = state.to('user-a', 'user-b').to('user-b', 'user-c')
   * A.depth('user-a', 'user-b') // 1
   * A.depth('user-a', 'user-c') // 2
   * A.depth('user-c', 'user-a') // Infinity
   */
  depth(source: T, target: T, log = false): number {
    let depth = this.getSearchedDepth(source, target)
    if (log) {
      depth = Math.log(depth + 1)
    }
    return depth
  }

  /**
   * Returns the found minimum distance to between a to b.
   * If cannot find the way on both node, Returns `Infinity`
   * This is same as `Math.min(this.depth(a, b), this.depth(b, a))`
   * @param a Node to find a.
   * @param b Node to find b.
   * @param log If this parameter is set to true, it returns the value to which the log function is applied. This is useful when the value is too high.
   * @example
   * const A = state.to('user-a', 'user-b').to('user-b', 'user-c')
   * A.distance('user-a', 'user-b') // 1
   * A.distance('user-a', 'user-c') // 2
   * A.distance('user-c', 'user-a') // 2
   */
  distance(a: T, b: T, log = false): number {
    return Math.min(this.depth(a, b, log), this.depth(b, a, log))
  }

  /**
   * Merge a relation dataset with this instance.
   * If there is a non-overlapping dataset, It will be append to instance.
   * @param datasets Data set to be merged
   * @example
   * const A = state.to('user-a', 'user-b')
   * const B = state.to('user-a', 'user-c')
   * const C = A.merge(B.dataset).nodes // user-a, user-b, user-c
   */
  merge(...datasets: RelationData<T>[][]): this {
    let acc = this.dataset
    for (const dataset of datasets) {
      acc = this.getCombinedDataset(acc, dataset)
    }
    for (const [key, relation] of acc) {
      this.ensureRelation(key, ...relation)
    }
    return this
  }

  /** Destroy the data in the instance. It is used for garbage collector. */
  clear(): void {
    this.__relations.clear()
  }
}