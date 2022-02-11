export declare type Relation<T> = T[]
export declare type RelationData<T> = [T, Relation<T>]

export class Relationship<T> {
  protected readonly __relations: Map<T, Relation<T>>

  constructor(data: RelationData<T>[])

  /**
   * 배열이 노드를 가지고 있는지 여부를 반환합니다.
   * @param array 대상 배열입니다.
   * @param node 검색할 노드입니다.
   */
  protected static has<T>(array: T[], node: T): boolean

  /**
   * 배열에 노드를 추가합니다. 배열이 이미 노드를 가지고 있다면 무시합니다.
   * @param array 대상 배열입니다.
   * @param nodes 추가할 노드입니다.
   */
  protected static add<T>(array: T[], ...nodes: T[]): T[]

  /**
   * 배열에서 노드를 제거합니다.
   * @param array 대상 배열입니다.
   * @param node 제거할 노드입니다.
   */
  protected static drop<T>(array: T[], ...nodes: T[]): T[]

  /**
   * 배열을 초기화합니다.
   * @param array 초기화할 배열입니다.
   */
  protected static clear<T>(array: T[]): T[]

  /**
   * Returns as 2-dimensional array of relationships between nodes in the instance.
   * Relationships are returned to saveable data-type(json).
   */
  get dataset(): RelationData<T>[]

  /** Get all nodes from the instance. */
  get nodes(): T[]

  /** Get all nodes as Set object from the instance. */
  get nodeset(): Set<T>

  protected get copy(): this

  /**
   * 해당 노드와 관련있는 릴레이션을 반환합니다. 릴레이션이 없다면 생성하고 반환합니다.
   * @param source 해당 노드입니다.
   */
  protected ensureRelation(source: T, ...targets: T[]): Relation<T>

  /**
   * Creates a new refer between nodes, and returns it as a Relationship instance.
   * This is one-sided relationship between both nodes.
   * @param source    The source node.
   * @param targets     The target nodes.
   */
  to(source: T, ...targets: T[]): this

  /**
   * Creates a new relationship between nodes, and returns it as a Relationship instance.
   * Both nodes will know each other.
   * @param a     Node A to refer to node B.
   * @param b     Node B to refer to node A.
   */
  both(a: T, ...b: T[]): this

  /**
   * Creates a new relationship between all each other nodes, and returns it as a Relationship instance.
   * All nodes will know each others.
   * @param nodes Nodes to relate to each other.
   */
  all(...nodes: T[]): this

  /**
   * 두 개의 릴레이션데이터 배열을 병합합니다.
   * 이는 두 개의 인스턴스를 병합하는데 사용하기에 좋습니다.
   * @param a 병합할 릴레이션데이터 배열입니다.
   * @param b 병합할 릴레이션데이터 배열입니다.
   */
  protected getCombinedDataset(a: RelationData<T>[], b: RelationData<T>[]): RelationData<T>[]

  /**
   * 인스턴스에 있는 관계를 계산합니다. 시작 노드에서 시작하여, 깊이만큼 탐색합니다. 탐색하여 관계를 새로운 릴레이션데이터 배열로 만들어 반환합니다.
   * @param source 시작 노드입니다.
   * @param depth 탐색할 횟수입니다. 재귀할 때 마다 이 횟수가 줄어들어, 0보다 작아지면 기본값을 반환합니다.
   * @param accDataset 탐색된 관계를 누산할 릴레이션데이터 배열입니다.
   * @param tests 탐색된 노드를 담고있는 배열입니다. 이미 한 번 탐색된 노드는 이 배열에 담깁니다. 상호참조하는 관계로 인해 무한히 탐색되는 것을 방지하는 용도로 사용됩니다.
   */
  protected getSearchedRelationDataset(source: T, depth: number, accDataset: RelationData<T>[], tests: T[]): RelationData<T>[]

  /**
   * Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
   * You can control calculation depth relationship with depth parameter.
   * @param source The source node.
   * @param depth If depth parameter are negative, it's will be calculate all relationship between nodes in instance. Depth parameter default value is -1.
   */
  from(source: T, depth: number): this

  /**
   * Returns a new relationship instance with only nodes that meet the conditions.
   * @param filter condition filter callback function
   */
  where(filter: (node: T, i: number, array: T[]) => boolean): this

  /**
   * Returns the remaining nodes except those received as parameters from the current relationship instance.
   * @param nodes This is a list of nodes to exclude.
   */
  without(...nodes: T[]): T[]

  /**
   * 해당 노드에서 참조하는 노드들 중에서 대상 노드를 제거합니다.
   * @param source 해당 노드입니다.
   * @param targets 대상 노드입니다.
   */
  protected unlinkRefersFromSource(source: T, ...targets: T[]): void

  /**
   * Deletes the relationship between nodes and returns it as a Relationship instance.
   * This is one-sided cut off between both nodes.
   * @param source The source node.
   * @param targets The target nodes.
   */
  unlinkTo(source: T, ...targets: T[]): this

  /**
   * Deletes the relationship between nodes and returns it as a Relationship instance.
   * Both nodes will cut off each other.
   * @param a Node A to unlink from node B.
   * @param b Node B to unlink from node A.
   */
  unlinkBoth(a: T, ...b: T[]): this

  /**
   * Delete the node. If the node associated with the deleted node is isolated, it is deleted together.
   * Returns the result with a Relationship instance.
   * @param nodes Nodes to be deleted.
   */
  drop(...nodes: T[]): this

  /**
   * Returns whether the instance contains that node.
   * @param node Node to find.
   */
  has(node: T): boolean

  /**
   * Returns whether the instance contains all of its nodes.
   * @param nodes A list of nodes to search for.
   */
  hasAll(...nodes: T[]): boolean

  /** Destroy the data in the instance. It is used for garbage collector. */
  clear(): void
}