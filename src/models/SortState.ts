import type { UserRecord } from "./UserRecord.ts";

export interface SortState {
    field(): keyof UserRecord
    dir(): "asc"|"desc"
    toggle(field: keyof UserRecord): void
}
