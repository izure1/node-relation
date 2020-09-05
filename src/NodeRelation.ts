type RelationNode = string|number|Symbol
type Relation = RelationNode[]
type RelationGroup = Relation[]

/**
 * 
 * @param group     초기값입니다. Relation 인스턴스를 매개변수로 넘깁니다.
 * @description     새로운 RelationGroup 인스턴스를 만들어 반환합니다.
 */
function create(...relations: Relation[]): RelationGroup {
    const group: RelationGroup = []
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
    const allKeys: Set<RelationNode> = new Set([...keys])
    const totalKeys: Set<RelationNode> = new Set
    const lists: Set<Relation> = new Set

    // 새로 받은 key를 보유하고 있는 모든 릴레이션을 받아와 lists 변수에 담습니다.
    for (const key of allKeys) {
        for (const relation of group) {
            const hasKey: boolean = relation.indexOf(key) !== -1
            if (hasKey) lists.add(relation)
        }
    }
    // lists 변수에 담긴 릴레이션을 group 인스턴스에서 삭제합니다.
    // 이후 삭제된 릴레이션의 내용물을 prevRelation 변수에 담습니다.
    for (const relation of lists) {
        let i: number = group.length
        while (i--) {
            if (group[i] !== relation) continue
            group.splice(i, 1)
            for (const key of relation) totalKeys.add(key)
        }
    }

    // 새로운 릴레이션을 만듭니다.
    // 이 배열에는 이전에 prevRelation에 있던 모든 내용을 중복없이 하나로 합쳤습니다.
    const newKeys: Set<RelationNode> = [...allKeys].reduce((totalKeys: Set<RelationNode>, key: RelationNode) => totalKeys.add(key), totalKeys)
    const newRelation: Relation = [...newKeys]

    group.push(newRelation)
    return group
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @description     RelationGroup 인스턴스에 담긴 모든 노드를 배열로 반환합니다.
 */
function getNodes(group: RelationGroup): RelationNode[] {
    const lists: Relation = []
    for (const relation of group) lists.push(...relation)
    return [...new Set(lists)]
}

/**
 * 
 * @param group     RelationGroup 인스턴스입니다.
 * @param u         대상 노드입니다.
 * @description     대상 노드를 포함하고 있는 릴레이션을 반환합니다.
 */
function getRelation(group: RelationGroup, u: RelationNode): Relation {
    for (const relation of group) {
        const hasKey: boolean = relation.indexOf(u) !== -1
        if (hasKey) return relation
    }
    return [] as Relation
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
    if (!t) return null
    else {
        const i: number = t.indexOf(u)
        t.splice(i, 1)
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
        const hasKey = groups[i].indexOf(u) !== -1
        if (hasKey) groups.splice(i, 1)
    }
}

/**
 * 
 * @param groups    RelationGroup 인스턴스입니다.
 * @description     RelationGroup 인스턴스의 릴레이션을 모두 제거하여 초기화합니다.
 */
function clear(groups: RelationGroup): void {
    groups.splice(0, groups.length)
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
    return [...result]
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
    return [...result]
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