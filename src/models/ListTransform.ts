export interface ListTransform<T> {
    apply(items: T[]): T[]
}
