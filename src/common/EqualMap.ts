import equal from 'fast-deep-equal'


export class EqualMap<K, V> extends Map<K, V> {
  constructor(iterable?: Iterable<readonly [K, V]>|null|undefined) {
    super()
    const raw = new Map<K, V>(iterable as any)
    for (const [key, value] of raw) {
      this.set(key, value)
    }
  }

  set(key: K, value: V): this {
    if (!this.has(key)) {
      super.set(key, value)
    }
    return this
  }

  delete(key: K): boolean {
    let exists = false
    for (const k of this.keys()) {
      if (equal(k, key)) {
        super.delete(k)
        exists = true
      }
    }
    return exists
  }

  has(key: K): boolean {
    for (const k of this.keys()) {
      if (equal(key, k)) return true
    }
    return false
  }

  get(key: K): V|undefined {
    for (const [k, v] of this) {
      if (equal(key, k)) return v as V
    }
  }
}