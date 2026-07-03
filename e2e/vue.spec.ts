import { test, expect } from '@playwright/test'

// The root redirects to /crud, which renders the Users CRUD built on the
// VECS Sibling Registry.
test('creates a user through the CRUD form', async ({ page }) => {
  await page.goto('/crud')

  await expect(page.locator('table')).toBeVisible()
  await expect(page.locator('body')).toContainText('alice')

  const textInputs = page.locator('input:not([type="checkbox"])')
  await textInputs.nth(1).fill('zoe')       // username field
  await textInputs.nth(2).fill('zoe@example.com') // email field
  await page.getByRole('button', { name: 'Save' }).click()

  // search for the new user
  await textInputs.nth(0).fill('zoe')
  await expect(page.locator('table')).toContainText('zoe@example.com')
})
