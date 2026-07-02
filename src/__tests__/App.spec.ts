import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders the email input', () => {
    const wrapper = mount(App)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
  })

  it('validates the email via the sibling registry', async () => {
    const wrapper = mount(App)
    const input = wrapper.find('input')

    await input.setValue('not-an-email')
    expect(wrapper.text()).toContain('invalid')

    await input.setValue('you@example.com')
    expect(wrapper.text()).toContain('looks valid')
  })
})
