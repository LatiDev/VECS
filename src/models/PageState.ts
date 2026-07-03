export interface PageState {
    page(): number
    pageSize(): number
    setPage(n: number): void
    next(): void
    prev(): void
}
