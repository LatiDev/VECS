export interface Selection {
    selectedId(): string|null
    select(id: string): void
    clear(): void
}
