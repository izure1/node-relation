import { Relationship as RawRelationship, RelationData } from './raw/index'

export class Relationship<T> extends RawRelationship<T> {
  constructor(data?: RelationData<T>[])

  /**
   * Creates a new refer between nodes, and returns it as a Relationship instance.
   * This is one-sided relationship between both nodes.
   * @param source    The source node.
   * @param targets     The target nodes.
   */
  to(source: T, ...targets: T[]): this

  /**
   * Creates a new relationship between nodes, and returns it as a new Relationship instance.
   * Both nodes will know each other.
   * @param a     Node A to refer to node B.
   * @param b     Node B to refer to node A.
   */
  both(a: T, ...b: T[]): this

  /**
   * Creates a new relationship between all each other nodes, and returns it as a new Relationship instance.
   * All nodes will know each others.
   * @param nodes Nodes to relate to each other.
   */
  all(...nodes: T[]): this

  /**
   * Deletes the relationship between nodes and returns it as a new Relationship instance.
   * This is one-sided cut off between both nodes.
   * @param source The source node.
   * @param targets The target nodes.
   */
  unlinkTo(source: T, ...targets: T[]): this

  /**
   * Deletes the relationship between nodes and returns it as a new Relationship instance.
   * Both nodes will cut off each other.
   * @param a Node A to unlink from node B.
   * @param b Node B to unlink from node A.
   */
  unlinkBoth(a: T, ...b: T[]): this

  /**
   * Delete the node. If the node associated with the deleted node is isolated, it is deleted together.
   * Returns the result with a new Relationship instance.
   * @param nodes Nodes to be deleted.
   */
  drop(...nodes: T[]): this
}