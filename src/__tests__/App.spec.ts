import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import CrudView from '../views/CrudView.vue'

// The CRUD view wires every sibling through the ComponentRegistry; these tests
// drive the real DOM and assert the rendered table, exercising the registry.

function button(wrapper: VueWrapper, text: string) {
  return wrapper.findAll('button').find((b) => b.text().trim() === text)!
}

// Naive n-input renders a native <input>; role is an n-select (no input) and
// active is a checkbox. Text inputs in DOM order: [0] search, [1] username, [2] email.
function textInputs(wrapper: VueWrapper) {
  return wrapper.findAll('input:not([type="checkbox"])')
}

async function fillForm(wrapper: VueWrapper, username: string, email: string) {
  const inputs = textInputs(wrapper)
  await inputs[1]!.setValue(username)
  await inputs[2]!.setValue(email)
}

async function search(wrapper: VueWrapper, term: string) {
  await textInputs(wrapper)[0]!.setValue(term)
  await flushPromises()
}

async function mountView() {
  const wrapper = mount(CrudView)
  await flushPromises() // let onMounted registrations + ready bumps settle
  return wrapper
}

describe('CrudView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reads: renders seeded users in the table', async () => {
    const wrapper = await mountView()
    expect(wrapper.find('table').exists()).toBe(true)
    // Default sort is username asc → first page contains alice/bob/carol.
    expect(wrapper.text()).toContain('alice')
  })

  it('creates a user and it shows up when searched', async () => {
    const wrapper = await mountView()
    await fillForm(wrapper, 'newbie', 'new@example.com')
    await button(wrapper, 'Save').trigger('click')
    await flushPromises()

    await search(wrapper, 'newbie')
    expect(wrapper.text()).toContain('newbie')
    expect(wrapper.text()).toContain('new@example.com')
  })

  it('blocks save when the email is invalid', async () => {
    const wrapper = await mountView()
    await fillForm(wrapper, 'ghost', 'not-an-email')
    await button(wrapper, 'Save').trigger('click')
    await flushPromises()

    await search(wrapper, 'ghost')
    expect(wrapper.text()).toContain('No users')
  })

  it('edits a user: selecting prefills the form, saving updates the row', async () => {
    const wrapper = await mountView()
    await search(wrapper, 'bob')
    await button(wrapper, 'Edit').trigger('click')
    await flushPromises()

    const inputs = textInputs(wrapper)
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('bob')

    await inputs[2]!.setValue('bob2@example.com')
    await button(wrapper, 'Save').trigger('click')
    await flushPromises()

    // search box still holds "bob"; the row now shows the new email
    await flushPromises()
    expect(wrapper.text()).toContain('bob2@example.com')
  })

  it('deletes a user', async () => {
    const wrapper = await mountView()
    await search(wrapper, 'carol')
    expect(wrapper.text()).toContain('carol')

    await button(wrapper, 'Delete').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('No users')
  })
})
