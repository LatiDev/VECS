<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";

// Consumer: renders a button but registers nothing. The dark-mode flag lives in
// a sibling (ThemeState) and is read through the reactive registry, so flipping
// it re-evaluates this computed automatically.
const props = defineProps({
  xu_theme: { type: String, required: true },
});

const dark = computed(() => getComponent<Toggle>(props.xu_theme)?.isOpen() ?? false);

function onClick() {
  getComponent<Toggle>(props.xu_theme)?.toggle();
}
</script>

<template>
  <n-button quaternary circle :title="dark ? 'Switch to light' : 'Switch to dark'" v-on:click="onClick">
    {{ dark ? "☀" : "🌙" }}
  </n-button>
</template>
