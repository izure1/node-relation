export default class AdvancedArray<T> extends Array {

    constructor(...params: T[]) {
        super()
        this.push(...params)
    }
    
    has(t: T): boolean {
        return this.indexOf(t) !== -1
    }

    get(t: T): T | undefined {
        return this[this.indexOf(t)]
    }

    delete(t: T): void {
        const i: number = this.indexOf(t)
        if (i !== -1) this.splice(i, 1)
    }

    clear(): void {
        this.splice(0, this.length)
    }

    ensure(t: T): void {
        if (!this.has(t)) this.push(t)
    }

    deduplication(): void {
        const set: Set<T> = new Set(this)
        this.clear()
        this.push(...set)
    }

    *[Symbol.iterator](): IterableIterator<T> {
        for (let i: number = 0, len: number = this.length; i < len; i++) {
            const t: T = this[i]
            yield t
        }
    }
    
}