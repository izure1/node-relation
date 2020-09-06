import AdvancedArray from './AdvancedArray'

type RelationNode = string|number|Symbol
class Relation extends AdvancedArray<RelationNode> {
    get nodes(): RelationNode[] {
        return [ ...this ]
    }
}
class RelationGroup extends AdvancedArray<Relation> {
    get relations(): Relation[] {
        return [ ...this ]
    }
    get nodes(): RelationNode[] {
        let nodes: RelationNode[] = []
        for (const relation of this) {
            nodes.push(...relation.nodes)
        }
        return nodes
    }
}

/**
 * 새로운 RelationGroup 인스턴스를 만들어 반환합니다.
 * @param group     초기값입니다. Relation 인스턴스를 매개변수로 넘깁니다.
 */
function create(...relations: Relation[]): RelationGroup {
    const group: RelationGroup = new RelationGroup
    for (const relation of relations) group.push(relation)
    return group
}

/**
 * 대상 노드를 포함하고 있지 않는 모든 릴레이션을 묶어 새로운 RelationGroup 인스턴스를 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param nodes     포함되지 않을 노드입니다.
 */
function exclude(group: RelationGroup, ...nodes: RelationNode[]): RelationGroup {
    const excludeRelations: Relation[] = group.filter((relation: Relation): boolean => {
        for (const node of nodes) {
            if (relation.has(node)) return false
        }
        return true
    })
    return create(...excludeRelations)
}

/**
 * 서로 관련 있는 노드를 매개변수로 넘겨 릴레이션으로 지정합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param nodes     서로 관련성을 가지는 노드입니다.
 */
function setRelation(group: RelationGroup, ...node: RelationNode[]): RelationGroup {

    const allKeys: AdvancedArray<RelationNode> = new AdvancedArray
    allKeys.push(...node)
    allKeys.deduplication()

    const relations: AdvancedArray<Relation> = new AdvancedArray
    const newRelation: Relation = new Relation(...allKeys)

    for (const key of allKeys) {
        const matchedRelation: Relation | null = getRelation(group, key)
        if (matchedRelation) relations.ensure(matchedRelation)
    }

    for (const relation of relations) {
        for (const relationNode of relation) {
            newRelation.ensure(relationNode)
        }
        group.delete(relation)
    }

    group.push(newRelation)
    return group
}

/**
 * 대상 노드를 포함하고 있는 릴레이션을 반환합니다. 어떤 릴레이션도 대상 노드를 가지고 있지 않다면 null을 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param node      대상 노드입니다.
 */
function getRelation(group: RelationGroup, node: RelationNode): Relation | null {
    for (const relation of group) {
        if (relation.has(node)) return relation
    }
    return null
}

/**
 * 대상 노드를 모두 포함하고 있는 릴레이션을 반환합니다. 해당되는 릴레이션이 없다면 null을 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param nodes     대상 노드입니다.
 */
function getRelationEvery(group: RelationGroup, ...nodes: RelationNode[]): Relation | null {
    const matchedRelations: Relation[] = group.filter((relation: Relation): boolean => {
        for (const node of nodes) {
            if ( !relation.has(node) ) return false
        }
        return true
    })
    return matchedRelations.pop() || null
}

/**
 * RelationGroup 인스턴스에 담긴 모든 노드를 배열로 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @deprecated      group.nodes getter를 사용하십시오.
 */
function getNodes(group: RelationGroup): RelationNode[] {
    const relationNodes: AdvancedArray<RelationNode> = new AdvancedArray
    for (const relation of group) relationNodes.push(...relation)
    relationNodes.deduplication()
    return [ ...relationNodes ]
}

/**
 * RelationGroup 인스턴스가 대상 노드를 포함하고 있는지 여부를 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param node      대상 노드입니다.
 */
function hasNode(group: RelationGroup, node: RelationNode): boolean {
    return !!getRelation(group, node)
}

/**
 * 릴레이션이 대상 노드를 포함하고 있다면 노드를 삭제하고, 해당 릴레이션을 반환합니다. 어떤 릴레이션도 대상 노드를 가지고 있지 않다면 null을 반환합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param node      대상 노드입니다.
 */
function deleteNode(group: RelationGroup, node: RelationNode): Relation | null {
    const t: Relation | null = getRelation(group, node)
    if (!t) return null
    else {
        t.delete(node)
        return t
    }
}

/**
 * 대상 노드를 포함하고 있는 릴레이션을 RelationGroup 인스턴스에서 삭제합니다.
 * @param group     RelationGroup 인스턴스입니다.
 * @param node      대상 노드입니다.
 */
function dropRelation(group: RelationGroup, node: RelationNode): void {
    let i: number = group.length
    while (i--) {
        const relation: Relation = group[i]
        if (relation.has(node)) {
            group.delete(relation)
        }
    }
}

/**
 * RelationGroup 인스턴스의 릴레이션을 모두 제거하여 초기화합니다.
 * @param group     RelationGroup 인스턴스입니다.
 */
function clear(group: RelationGroup): void {
    group.clear()
}


export {
    create,
    exclude,
    clear,
    hasNode,
    getNodes,
    deleteNode,
    setRelation,
    getRelation,
    getRelationEvery,
    dropRelation,
}