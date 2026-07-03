import { createRouter, createWebHistory } from 'vue-router'
import { getComponent } from '../ComponentRegistry'
import type { Toggle } from '@/models/Toggle.ts'
import HomeView from '../views/HomeView.vue'
import SignupView from '../views/SignupView.vue'
import CrudView from '../views/CrudView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/signup', name: 'signup', component: SignupView },
    {
      path: '/crud',
      name: 'crud',
      component: CrudView,
      // Private: the session flag lives in the AuthState sibling, read through the
      // shared registry. Signed-out visitors (or a cold load before AuthState has
      // mounted) get bounced to Signup.
      meta: { private: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.private) {
    const auth = getComponent<Toggle>('auth')
    if (!auth?.isOpen()) {
      return { name: 'signup' }
    }
  }
})

export default router
