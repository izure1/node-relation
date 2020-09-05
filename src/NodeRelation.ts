import AdvancedArray from './AdvancedArray'

type RelationNode = string|number|Symbol
class Relation extends AdvancedArray<RelationNode> {}
class RelationGroup extends AdvancedArray<Relation> {}

/**
 * 
 * @param group     초기값입니다. Relation 인스턴스를 매개변수로 넘깁니다.
 * @description     새로운 RelationGroup 인스턴스를 만들어 반환합니다.
 */
function create(...relations: Relation[]): RelationGroup {
    const group: RelationGroup = new RelationGroup
    for (const relation of relations) group.push(relation)
    return group
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @param keys      서로 관련성을 가지는 노드입니다.
 * @description     서로 관련 있는 노드를 매개변수로 넘겨 릴레이션으로 지정합니다.
 */
function setRelation(group: RelationGroup, ...keys: RelationNode[]): RelationGroup {

    const allKeys: AdvancedArray<RelationNode> = new AdvancedArray
    allKeys.push(...keys)
    allKeys.deduplication()

    const relations: AdvancedArray<Relation> = new AdvancedArray
    const newReleation: Relation = new Relation(...allKeys)

    for (const key of allKeys) {
        relations.ensure(getRelation(group, key))
    }

    for (const relation of relations) {
        for (const relationNode of relation) {
            newReleation.ensure(relationNode)
        }
        group.delete(relation)
    }

    group.push(newReleation)
    return group
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @description     RelationGroup 인스턴스에 담긴 모든 노드를 배열로 반환합니다.
 */
function getNodes(group: RelationGroup): RelationNode[] {
    const lists: Relation = new Relation
    const relationNodes: AdvancedArray<RelationNode> = new AdvancedArray
    for (const relation of group) relationNodes.push(...relation)
    relationNodes.deduplication()
    return [ ...relationNodes ]
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @param u         대상 노드입니다.
 * @description     대상 노드를 포함하고 있는 릴레이션을 반환합니다.
 */
function getRelation(group: RelationGroup, u: RelationNode): Relation {
    for (const relation of group) {
        if (relation.has(u)) return relation
    }
    return new Relation
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @param u         대상 노드입니다.
 * @description     RelationGroup 인스턴스가 대상 노드를 포함하고 있는지 여부를 반환합니다.
 */
function hasNode(group: RelationGroup, u: RelationNode): boolean {
    return !!getRelation(group, u)
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @param u         대상 노드입니다.
 * @description     릴레이션이 대상 노드를 포함하고 있다면 노드를 삭제하고, 해당 릴레이션을 반환합니다. 어떤 릴레이션도 대상 노드를 가지고 있지 않다면 null을 반환합니다.
 */
function deleteNode(groups: RelationGroup, u: RelationNode): Relation | null {
    const t: Relation = getRelation(groups, u)
    if (!t.length) return null
    else {
        t.delete(u)
        return t
    }
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @param u         대상 노드입니다.
 * @description     대상 노드를 포함하고 있는 릴레이션을 RelationGroup 인스턴스에서 삭제합니다.
 */
function dropRelation(groups: RelationGroup, u: RelationNode): void {
    let i: number = groups.length
    while (i--) {
        const relation: Relation = groups[i]
        if (relation.has(u)) {
            groups.delete(relation)
        }
    }
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @description     RelationGroup 인스턴스의 릴레이션을 모두 제거하여 초기화합니다.
 */
function clear(groups: RelationGroup): void {
    groups.clear()
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @param keys      대상 노드입니다.
 * @description     대상 노드를 모두 포함하고 있는 릴레이션을 반환합니다.
 */
function getRelationEvery(groups: RelationGroup, ...keys: RelationNode[]): Relation {
    const result: Set<RelationNode> = new Set
    for (const u of [...keys]) {
        const keys: Relation = getRelation(groups, u)
        if (keys.length)
            for (const key of keys) result.add(key)
        else {
            result.clear()
            break
        }
    }
    return new Relation(...result)
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @param keys      대상 노드입니다.
 * @description     대상 노드 중 한개라도 포함하고 있는 릴레이션의 모든 노드를 릴레이션으로 반환합니다.
 */
function getRelationSome(groups: RelationGroup, ...keys: RelationNode[]): Relation {
    const result: Set<RelationNode> = new Set
    for (const u of [...keys]) {
        const keys: Relation = getRelation(groups, u)
        for (const key of keys) result.add(key)
    }
    return new Relation(...result)
}


export {
    create,
    clear,
    hasNode,
    getNodes,
    deleteNode,
    setRelation,
    getRelation,
    getRelationEvery,
    dropRelation,
}