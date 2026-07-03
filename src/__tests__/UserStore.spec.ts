import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import CrudView from '../views/CrudView.vue'
import { getComponent } from '../ComponentRegistry.js'
import type { CrudStore } from '../models/CrudStore.ts'
import type { PageState } from '../models/PageState.ts'
import type { SortState } from '../models/SortState.ts'
import type { UserRecord } from '../models/UserRecord.ts'

// Drives the store + filter/sort/paginate pipeline through the registry APIs
// that CrudView wires up (view() = paginate(sort(filter(all())))).

let wrapper: VueWrapper

const store = () => getComponent<CrudStore<UserRecord>>('store')
const usernames = () => store().view().map((u) => u.username)

describe('UserStore pipeline', () => {
  beforeEach(async () => {
    localStorage.clear()
    wrapper = mount(CrudView)
    await flushPromises()
  })

  afterEach(() => {
    wrapper.unmount() // unregister everything from the singleton registry
  })

  it('seeds five users and pages the view (pageSize 3)', () => {
    expect(store().all()).toHaveLength(5)
    expect(store().filteredCount()).toBe(5)
    // default sort username asc, first page
    expect(usernames()).toEqual(['alice', 'bob', 'carol'])
  })

  it('paginates through the sorted list', () => {
    const page = getComponent<PageState>('page')
    page.next()
    expect(usernames()).toEqual(['dave', 'erin'])
  })

  it('sorts descending when the same field is toggled', () => {
    const sort = getComponent<SortState>('sort')
    sort.toggle('username') // asc -> desc
    getComponent<PageState>('page').setPage(1)
    expect(usernames()).toEqual(['erin', 'dave', 'carol'])
  })

  it('creates, updates and removes records', () => {
    const created = store().create({
      username: 'zoe', email: 'zoe@example.com', role: 'viewer', active: true,
    })
    expect(store().all()).toHaveLength(6)

    store().update(created.id, { role: 'admin' })
    expect(store().get(created.id)?.role).toBe('admin')

    store().remove(created.id)
    expect(store().all()).toHaveLength(5)
    expect(store().get(created.id)).toBeUndefined()
  })
})
