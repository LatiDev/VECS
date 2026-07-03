<script setup lang="ts">
import { NButton } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Selection } from "@/models/Selection.ts";
import type { Writable } from "@/models/Writable.ts";

const props = defineProps({
  xu_selection: { type: String, required: true },
  xu_username: { type: String, required: true },
  xu_email: { type: String, required: true },
  xu_role: { type: String, required: true },
  xu_active: { type: String, required: true },
});

function onClick() {
  getComponent<Writable>(props.xu_username)?.clear();
  getComponent<Writable>(props.xu_email)?.clear();
  getComponent<Writable>(props.xu_role)?.clear();
  getComponent<Writable>(props.xu_active)?.clear();
  getComponent<Selection>(props.xu_selection)?.clear();
}
</script>

<template>
  <n-button tertiary v-on:click="onClick">Reset</n-button>
</template>
