<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { NAvatar, NButton, NDropdown, type DropdownOption } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";

// Consumer: the account area. Session state lives in a sibling (AuthState) and is
// read through the reactive registry, so signing in/out re-renders this menu.
const props = defineProps({
  xu_auth: { type: String, required: true },
});

const router = useRouter();

const signedIn = computed(() => getComponent<Toggle>(props.xu_auth)?.isOpen() ?? false);

const options = computed<DropdownOption[]>(() =>
  signedIn.value
    ? [
        { label: "Profile", key: "profile" },
        { label: "Settings", key: "settings" },
        { type: "divider", key: "d1" },
        { label: "Logout", key: "logout" },
      ]
    : [
        { label: "Login", key: "login" },
        { label: "Register", key: "register" },
      ],
);

function onSelect(key: string) {
  switch (key) {
    case "login":
    case "logout":
      getComponent<Toggle>(props.xu_auth)?.toggle();
      break;
    case "register":
      router.push({ name: "signup" });
      break;
  }
}
</script>

<template>
  <n-dropdown trigger="click" :options="options" v-on:select="onSelect">
    <n-button v-if="signedIn" quaternary circle style="padding: 0">
      <n-avatar round size="small" style="background-color: #2563eb">BL</n-avatar>
    </n-button>
    <n-button v-else type="primary" size="small">Account</n-button>
  </n-dropdown>
</template>
