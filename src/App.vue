<script setup lang="ts">
import { computed, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { NConfigProvider, darkTheme } from "naive-ui";
import { getComponent } from "./ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";
import ThemeState from "./components/ThemeState.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import AuthState from "./components/AuthState.vue";
import TopNav from "./components/TopNav.vue";
import TextField from "./components/TextField.vue";
import NotificationsButton from "./components/NotificationsButton.vue";
import AccountMenu from "./components/AccountMenu.vue";

// Dark-mode flag lives in a sibling (ThemeState) and is read through the reactive
// registry, so toggling it re-picks naive-ui's theme here automatically. Before
// ThemeState mounts, the key is absent → light theme, then it re-evaluates.
const theme = computed(() =>
  getComponent<Toggle>("theme")?.isOpen() ? darkTheme : null,
);

// Enforce private routes reactively: the route guard covers navigation, but if a
// signed-in user signs out while sitting on a private page, eject them too. The
// session flag is read from the AuthState sibling through the reactive registry.
const route = useRoute();
const router = useRouter();
const signedIn = computed(() => getComponent<Toggle>("auth")?.isOpen() ?? false);

watch(signedIn, (isSignedIn) => {
  if (!isSignedIn && route.meta.private) {
    router.push({ name: "signup" });
  }
});
</script>

<template>
  <n-config-provider :theme="theme">
    <!-- Global logic-only siblings: they render nothing, only publish state. -->
    <ThemeState xr_key="theme"/>
    <AuthState xr_key="auth"/>

    <div class="app">
      <!-- Top-bar: presentational chrome (like an n-card) holding flat siblings.
           The VECS components inside stay juxtaposed and never contain one another. -->
      <header class="topbar">
        <span class="brand">VECS</span>
        <TopNav xu_auth="auth"/>
        <span class="spacer"/>
        <AccountMenu xu_auth="auth"/>
      </header>

      <main class="container">
        <RouterView/>
      </main>
    </div>
  </n-config-provider>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 60px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e9f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.brand {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.5px;
  color: #2563eb;
}

.spacer {
  flex: 1;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}
</style>
