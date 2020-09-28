type Relation<T> = T[]
type RelationData<T> = [T, Relation<T>]

export class Relationship<T> {
    private readonly relationmap: Map<T, Relation<T>> = new Map

    constructor(datas: RelationData<T>[]) {
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

    /** 릴레이션 정보를 저장가능한 형태로 반환합니다. */
    get dataset(): RelationData<T>[] {
        return Array.from(this.relationmap)
    }

    /** 인스턴스에 존재하는 모든 노드 목록을 배열로 반환합니다. */
    get nodes(): T[] {
        let nodes: T[] = []
        for (const [ source, dists ] of this.relationmap) {
            Relationship.add(nodes, source)
            Relationship.add(nodes, ...dists)
        }
        return nodes
    }

    /**
     * 인스턴스에 존재하는 노드 목록을 배열로 반환합니다. relation.nodes와 비슷하지만, 매개변수로 전달한 노드는 제거 됩니다.
     * @param node 배열에 포함되지 않을 노드입니다.
     */
    getNodes(node: T): T[] {
        return Relationship.drop(this.nodes, node)
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
     * 해당 노드를 목표 노드를 참조합니다. 이는 단방향적인 관계입니다.
     * 대상 노드는 대상 노드가 자신을 참조하는지 모를 것입니다.
     * @param source    해당 노드입니다.
     * @param dists     대상 노드입니다.
     */
    setReferTo(source: T, ...dists: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.ensureRelation(source, ...dists)
        return newR
    }

    /**
     * 해당 노드와 대상 노드가 서로를 참조합니다. 이는 양방향적인 관계입니다.
     * @param a     해당 노드입니다.
     * @param b     대상 노드입니다.
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
     * 해당 노드와 참조를 맺고 있는 모든 노드를 새로운 릴레이션으로 만들어 반환합니다.
     * 깊이 탐색이 가능합니다. 깊이 탐색 기능을 사용하면, 참조의 참조를 연달아 계산하여 반환합니다.
     * @param source 해당 노드입니다.
     * @param depth 탐색할 깊이입니다. 이 수치만큼 연산합니다. 숫자가 클 수록, 더 깊게 탐색합니다. 기본값은 -1입니다. 음수를 사용하면 횟수 제한없이 탐색합니다.
     */
    getRelation(source: T, depth: number = -1): Relationship<T> {
        if (depth < 0) {
            depth = Number.MAX_SAFE_INTEGER
        }
        const testR: Relationship<T> = new Relationship(this.dataset)
        const relationDataset: RelationData<T>[] = testR.getSearchedRelationDataset(source, depth)
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
     * 해당 노드가 대상 노드와의 관계를 끊습니다.
     * 만일 서로 참조하고 있던 관계라면 한 쪽만이 끊깁니다.
     * @param source 해당 노드입니다.
     * @param dists 대상 노드입니다.
     */
    unlinkTo(source: T, ...dists: T[]): Relationship<T> {
        const newR: Relationship<T> = new Relationship(this.dataset)
        newR.unlinkRefersFromSource(source, ...dists)
        return newR
    }

    /**
     * 해당 노드와 대상 노드가 서로간의 관계를 끊습니다.
     * @param a 해당 노드입니다.
     * @param b 대상 노드입니다.
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
     * 인스턴스에서 해당 노드를 완전히 삭제합니다. 해당 노드는 가비지컬렉터가 수집해갈 것입니다.
     * @param nodes 해당 노드입니다.
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
     * 인스턴스에 해당 노드가 포함되어있는지 여부를 반환합니다.
     * @param node 검색할 노드입니다.
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

    /** 해당 인스턴스의 모든 데이터를 초기화합니다. */
    clear(): void {
        this.relationmap.clear()
    }
}