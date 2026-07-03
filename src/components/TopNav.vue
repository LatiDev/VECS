<script setup lang="ts">
import { computed, h } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { NMenu, type MenuOption } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";

// Consumer: horizontal primary navigation. Registers nothing; it reflects the
// current route and reads the session flag from a sibling (AuthState) through the
// reactive registry, so the private "Users CRUD" link appears only when signed in.
const props = defineProps({
  xu_auth: { type: String, required: true },
});

const route = useRoute();

const signedIn = computed(() => getComponent<Toggle>(props.xu_auth)?.isOpen() ?? false);

const menuOptions = computed<MenuOption[]>(() => [
  {
    label: () => h(RouterLink, { to: "/" }, { default: () => "Home" }),
    key: "home",
  },
  ...(signedIn.value
    ? [
        {
          label: () => h(RouterLink, { to: "/crud" }, { default: () => "Users CRUD" }),
          key: "crud",
        },
      ]
    : []),
]);

const activeKey = computed(() => route.name as string | undefined);
</script>

<template>
  <n-menu mode="horizontal" :value="activeKey" :options="menuOptions"/>
</template>
