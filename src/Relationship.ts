type Relation<T> = T[]
type RelationData<T> = [T, Relation<T>]

export class Relationship<T> {
    private readonly relationmap: Map<T, Relation<T>> = new Map

    constructor(datas: RelationData<T>[] = []) {
        this.relationmap = new Map(datas)
    }

    /**
     * 배열이 노드를 가지고 있는지 여부를 반환합니다.
     * @param array 대상 배열입니다.
     * @param node 검색할 노드입니다.
     */
    private static has<T>(array: T[], node: T): boolean {
        return array.indexOf(node) !== -1
    }

    /**
     * 배열에 노드를 추가합니다. 배열이 이미 노드를 가지고 있다면 무시합니다.
     * @param array 대상 배열입니다.
     * @param nodes 추가할 노드입니다.
     */
    private static add<T>(array: T[], ...nodes: T[]): T[] {
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
    private static drop<T>(array: T[], ...nodes: T[]): T[] {
        for (const node of nodes) {
            if (Relationship.has(array, node)) {
                const i: number = array.indexOf(node)
                if (i !== -1) array.splice(i, 1)
            }
        }
        return array
    }

    /**
     * 배열을 초기화합니다.
     * @param array 초기화할 배열입니다.
     */
    private static clear<T>(array: T[]): T[] {
        array.length = 0
        return array
    }

    /**
     * Returns as 2-dimentional array of relationships between nodes in the instance.
     * Relationships are returned to saveable data-type(json).
     */
    get dataset(): RelationData<T>[] {
        return Array.from(this.relationmap)
    }

    /** Get all nodes from the instance. */
    get nodes(): T[] {
        const nodes: T[] = []
        for (const [ source, dists ] of this.relationmap) {
            Relationship.add(nodes, source)
            Relationship.add(nodes, ...dists)
        }
        return nodes
    }

    /** Get all nodes as Set object from the instance. */
    get nodeset(): Set<T> {
        const set: Set<T> = new Set
        for (const [ source, dists ] of this.relationmap) {
            set.add(source)
            for (const dist of dists) {
                set.add(dist)
            }
        }
        return set
    }

    /**
     * Same as `(getter)nodes`, but removes the node passed as a parameter.
     * @param node Nodes that will not be included in the array.
     */
    getNodes(node: T): T[] {
        return Relationship.drop(this.nodes, node)
    }

    /**
     * Same as `(getter)nodeset`, but removes the node passed as a parameter.
     * @param node Nodes that will not be included in the Set instance.
     */
    getNodeset(node: T): Set<T> {
        const set: Set<T> = this.nodeset
        set.delete(node)
        return set
    }

    /**
     * 해당 노드와 관련있는 릴레이션을 반환합니다. 릴레이션이 없다면 생성하고 반환합니다.
     * @param source 해당 노드입니다.
     */
    private ensureRelation(source: T, ...dists: T[]): Relation<T> {
        if (!this.relationmap.has(source)) {
            this.relationmap.set(source, [])
        }
        const relation: Relation<T> = this.relationmap.get(source)!
        for (const dist of dists) {
            Relationship.add(relation, dist)
        }
        return relation
    }

    /**
     * Creates a new refer between nodes, and returns it as a Relationship instance.
     * This is one-sided relationship between both nodes.
     * @param source    The source node.
     * @param dists     The target nodes.
     */
    setReferTo(source: T, ...dists: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.ensureRelation(source, ...dists)
        return newR
    }

    /**
     * Creates a new relationship between nodes, and returns it as a new Relationship instance.
     * Both nodes will know each other.
     * @param a     Node A to refer to node B.
     * @param b     Node B to refer to node A.
     */
    setReferBoth(a: T, ...b: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.ensureRelation(a, ...b)
        for (const dist of b) {
            newR.ensureRelation(dist, a)
        }
        return newR 
    }

    /**
     * Creates a new relationship between all each other nodes, and returns it as a new Relationship instance.
     * All nodes will know each others.
     * @param nodes Nodes to relate to each other.
     */
    setReferAll(...nodes: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        for (const node of nodes) {
            const relation: Relation<T> = newR.ensureRelation(node, ...nodes)
            Relationship.drop(relation, node)
        }
        return newR
    }

    /**
     * 두 개의 릴레이션데이터 배열을 병합합니다.
     * 이는 두 개의 인스턴스를 병합하는데 사용하기에 좋습니다.
     * @param a 병합할 릴레이션데이터 배열입니다.
     * @param b 병합할 릴레이션데이터 배열입니다.
     */
    private getCombinedDataset(a: RelationData<T>[], b: RelationData<T>[]): RelationData<T>[] {
        const map: Map<T, Relation<T>> = new Map
        const mapA: Map<T, Relation<T>> = new Map(a)
        const mapB: Map<T, Relation<T>> = new Map(b)

        for (const [ sourceA, relationA ] of mapA) {
            if (!map.has(sourceA)) {
                map.set(sourceA, relationA)
            }
            const relation: Relation<T> = map.get(sourceA)!
            Relationship.add(relation, ...relationA)
        }
        for (const [ sourceB, relationB ] of mapB) {
            if (!map.has(sourceB)) {
                map.set(sourceB, relationB)
            }
            const relation: Relation<T> = map.get(sourceB)!
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
    private getSearchedRelationDataset(source: T, depth: number, accDataset: RelationData<T>[] = [[source, []]], tests: T[] = []): RelationData<T>[] {
        const distRelation: Relation<T>         = this.relationmap.has(source) ? this.relationmap.get(source)! : []
        const srcDataset: RelationData<T>[]     = [[source, distRelation]]
        if (depth <= 0)                         return srcDataset
        if (Relationship.has(tests, source))    return srcDataset
        if (!distRelation)                      return srcDataset

        Relationship.add(tests, source)

        depth--
        accDataset = this.getCombinedDataset(accDataset, srcDataset)
        for (const dist of distRelation) {
            const distDataset: RelationData<T>[] = this.getSearchedRelationDataset(dist, depth, accDataset, tests)
            accDataset = this.getCombinedDataset(accDataset, distDataset)
        }
        return accDataset
    }

    /**
     * Only the nodes that are related to the node received by the parameter are filtered and returned in a new Relationship instance.
     * You can control calculation depth relationship with depth parameter.
     * @param source The source node.
     * @param depth If depth parameter are negative, it's will be calculte all relationship between nodes in instance. Depth parameter default value is -1.
     */
    getRelation(source: T, depth: number = -1): Relationship<T> {
        if (depth < 0) {
            depth = Number.MAX_SAFE_INTEGER
        }
        const testR: Relationship<T> = new Relationship(this.dataset)
        const relationDataset: RelationData<T>[] = testR.getSearchedRelationDataset(source, --depth)
        return new Relationship(relationDataset)
    }

    /**
     * 해당 노드에서 참조하는 노드들 중에서 대상 노드를 제거합니다.
     * @param source 해당 노드입니다.
     * @param dists 대상 노드입니다.
     */
    private unlinkRefersFromSource(source: T, ...dists: T[]): void {
        const relation: Relation<T>|undefined = this.relationmap.get(source)
        if (relation) {
            Relationship.drop(relation, ...dists)
        }
    }

    /**
     * Deletes the relationship between nodes and returns it as a new Relationship instance.
     * This is one-sided cut off between both nodes.
     * @param source The source node.
     * @param dists The target nodes.
     */
    unlinkTo(source: T, ...dists: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.unlinkRefersFromSource(source, ...dists)
        return newR
    }

    /**
     * Deletes the relationship between nodes and returns it as a new Relationship instance.
     * Both nodes will cut off each other.
     * @param a Node A to unink from node B.
     * @param b Node B to unink from node A.
     */
    unlinkBoth(a: T, ...b: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.unlinkRefersFromSource(a, ...b)
        for (const dist of b) {
            newR.unlinkRefersFromSource(dist, a)
        }
        return newR
    }

    /**
     * Delete the node. If the node associated with the deleted node is isolated, it is deleted together.
     * Returns the result with a new Relationship instance.
     * @param nodes Nodes to be deleted.
     */
    dropNode(...nodes: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        for (const relation of newR.relationmap.values()) {
            Relationship.drop(relation, ...nodes)
        }
        for (const node of nodes) {
            newR.relationmap.delete(node)
        }
        return newR
    }

    /**
     * Returns whether the instance contains that node.
     * @param node Node to find.
     */
    hasNode(node: T): boolean {
        let isExists: boolean = this.relationmap.has(node)
        for (const relation of this.relationmap.values()) {
            if (Relationship.has(relation, node)) {
                isExists = true
            }
        }
        return isExists
    }

    /** Destroy the data in the instance. It is used for garbage collector. */
    clear(): void {
        this.relationmap.clear()
    }
}