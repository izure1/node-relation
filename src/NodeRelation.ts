import AdvancedArray from './AdvancedArray'

type RelationNode = string|number
type RelationNodeTuple = [RelationNode, RelationNode]

export default class Relation {

    private readonly relations: AdvancedArray<RelationNodeTuple> = new AdvancedArray

    constructor(...tuples: RelationNodeTuple[]) {
        for (const tuple of tuples) {
            const [ a, b ] = tuple
            if (this.hasTuple(a, b)) {
                continue
            }
            this.relations.push(tuple)
        }
    }

    /** 릴레이션이 가지고 있는 모든 노드 목록을 배열로 반환합니다. */
    get nodes(): RelationNode[] {
        let nodes: AdvancedArray<RelationNode> = new AdvancedArray
        for (const tuple of this.tuples) {
            nodes.ensure(tuple[0])
            nodes.ensure(tuple[1])
        }
        return [ ...nodes ]
    }

    /** 릴레이션이 가지고 있는 1:1 관계를 튜플로 변환하여 목록을 배열로 반환합니다. */
    get tuples(): RelationNodeTuple[] {
        return [ ...this.relations ]
    }

    /**
     * 튜플이 대상 노드를 가지고 있는지 여부를 반환합니다.
     * @param tuple     검색할 튜플입니다.
     * @param node      대상 노드입니다.
     */
    private isTupleHasNode(tuple: RelationNodeTuple, node: RelationNode): boolean {
        return tuple.indexOf(node) !== -1
    }

    /**
     * 튜플에서 대상 노드와 쌍을 맺는 다른 노드를 반환합니다. 없다면 null을 반환합니다.
     * @param tuple     검색할 튜플입니다.
     * @param node      대상 노드입니다.
     */
    private getMateNode(tuple: RelationNodeTuple, node: RelationNode): RelationNode | null {
        if (tuple[0] === node) return tuple[1]
        if (tuple[1] === node) return tuple[0]
        return null
    }

    /**
     * 매개변수로 받은 두 개의 노드를 새로운 튜플로 만들어 반환합니다.
     * @param a         대상 노드입니다.
     * @param b         대상 노드입니다.
     */
    private createTuple(a: RelationNode, b: RelationNode): RelationNodeTuple {
        return [a, b].sort() as RelationNodeTuple
    }

    /**
     * 매개변수로 받은 노드를 알고 있는 모든 릴레이션을 지정합니다.
     * @param target    대상 노드입니다.
     * @param relation  저장될 릴레이션입니다.
     */
    private recursiveToSetTuple(target: RelationNode, relation: Relation) {
        const nodes: RelationNode[] = this.getRelativeNodes(target)
        for (const node of nodes) {
            if (relation.hasTuple(target, node)) {
                continue
            }
            relation.relations.push(this.createTuple(target, node))
            this.recursiveToSetTuple(node, relation)
        }
    }

    /**
     * 릴레이션이 대상 노드를 가지고 있는지 여부를 반환합니다.
     * @param node      대상 노드입니다.
     */
    hasNode(node: RelationNode): boolean {
        for (const tuple of this.relations) {
            if (this.isTupleHasNode(tuple, node)) return true
        }
        return false
    }

    /**
     * 매개변수로 받은 두 개의 노드로 이루어진 튜플이 존재하는지 여부를 반환합니다.
     * @param a         대상 노드입니다.
     * @param b         대상 노드입니다.
     */
    hasTuple(a: RelationNode, b: RelationNode): boolean {
        for (const tuple of this.relations) {
            if (this.getMateNode(tuple, a) === b) {
                return true
            }
        }
        return false
    }

    /**
     * 대상 노드와 관계를 형성하고 있는 모든 노드 목록을 배열로 반환합니다. 여러 노드를 매개변수로 전달하면, 합집합이 됩니다.
     * 배열에 대상 노드는 포함되지 않으니 주의하십시오.
     * @param nodes     대상 노드입니다.
     */
    getRelativeNodes(...nodes: RelationNode[]): RelationNode[] {
        const relatives: AdvancedArray<RelationNode> = new AdvancedArray
        for (const node of nodes) {
            for (const t of this.getRelation(node).nodes) {
                relatives.ensure(t)
            }
            relatives.delete(node)
        }
        return [ ...relatives ]
    }

    /**
     * 노드 간 새로운 관계를 형성합니다. 중심 노드를 기준으로 대상 노드와 관계를 형성합니다.
     * 형성된 결과를 새로운 릴레이션으로 만들어 반환합니다.
     * 가령 `setRelation('language', 'korean', 'english', 'japanese')` 메서드는 `['langauge', 'korean'], ['language', 'english'], ['language', 'japanese']` 튜플을 생성합니다.
     * 따라서 language 노드를 삭제할 경우 korean, english, japanese 노드들 사이의 관계성은 사라집니다.
     * @param target    중심 노드입니다.
     * @param nodes     대상 노드입니다.
     */
    setRelation(target: RelationNode, ...nodes: RelationNode[]): Relation {
        const relation: Relation = new Relation(...this.relations)
        for (const node of nodes) {
            if (relation.hasTuple(target, node)) {
                continue
            }
            const tuple: RelationNodeTuple = relation.createTuple(target, node)
            relation.relations.push(tuple)
        }
        return relation
    }

    /**
     * 대상 노드와 관계를 맺고 있는 노드만 추려내어 새로운 릴레이션으로 만들어 반환합니다.
     * 여러 노드를 매개변수로 전달하면, 합집합이 됩니다.
     * @param nodes     대상 노드입니다.
     */
    getRelation(...nodes: RelationNode[]): Relation {
        const tuples: RelationNodeTuple[] = []
        for (const tuple of this.relations) {
            for (const node of nodes) {
                if (this.isTupleHasNode(tuple, node)) tuples.push(tuple)
            }
        }
        return new Relation(...tuples)
    }

    /**
     * 대상 노드를 알고 있는 모든 관계를 추려내어 새로운 릴레이션으로 만들어 반환합니다.
     * 여러 노드를 매개변수로 전달하면, 합집합이 됩니다.
     * '알고 있다'는 것은, 직접적으로 관계되어 있거나, 다른 노드의 중계로 연결되어 있는 경우를 의미합니다.
     * 예를 들어 A--B--C, D--E 의 형태로 노드가 관계되어 있을 경우, A와 C는 B를 경유합니다. 이 경우, A와 C는 서로를 '알고 있다'고 표현합니다.
     * 하지만 D는 A, B, C와 어떤 관련도 없으므로 알고 있지 못합니다.
     * @param nodes     대상 노드입니다.
     */
    getLegionRelation(...nodes: RelationNode[]): Relation {
        const relation: Relation = new Relation
        for (const node of nodes) {
            this.recursiveToSetTuple(node, relation)
        }
        return relation
    }

    /**
     * 노드 간 형성된 관계를 제거합니다. 중심 노드를 기준으로 대상 노드와 관계를 제거합니다.
     * 형성된 결과를 새로운 릴레이션으로 만들어 반환합니다.
     * @param target    중심 노드입니다.
     * @param nodes     대상 노드입니다.
     */
    deleteRelation(target: RelationNode, ...nodes: RelationNode[]): Relation {
        const relation: Relation = new Relation(...this.relations)
        for (const node of nodes) {
            let i: number = relation.relations.length
            while (i--) {
                const tuple: RelationNodeTuple = relation.relations[i]
                if (relation.getMateNode(tuple, target) === node) {
                    relation.relations.delete(tuple)
                    break
                }
            }
        }
        return relation
    }

    /**
     * 노드를 삭제합니다. 삭제된 노드와 형성되어 있던 관계는 제거됩니다.
     * 형성된 결과를 새로운 릴레이션으로 만들어 반환합니다.
     * @param nodes     대상 노드입니다.
     */
    deleteNode(...nodes: RelationNode[]): Relation {
        const relation: Relation = new Relation(...this.relations)
        for (const node of nodes) {
            let i: number = relation.relations.length
            while (i--) {
                const tuple: RelationNodeTuple = relation.relations[i]
                if (relation.isTupleHasNode(tuple, node)) {
                    relation.relations.delete(tuple)
                } 
            }
        }
        return relation
    }
}