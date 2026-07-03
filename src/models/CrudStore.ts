export interface CrudStore<T> {
    all(): T[]
    get(id: string): T|undefined
    create(data: Omit<T, "id">): T
    update(id: string, patch: Partial<T>): void
    remove(id: string): void
    view(): T[]
    filteredCount(): number
}
