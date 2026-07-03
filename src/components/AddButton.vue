<script setup lang="ts">
import { NButton } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Openable } from "@/models/Openable.ts";
import type { Selection } from "@/models/Selection.ts";

const props = defineProps({
  xu_selection: { type: String, required: true },
  xu_modal: { type: String, required: true },
});

function onClick() {
  // New record: drop any prior selection (EditLoader clears the form), then open.
  getComponent<Selection>(props.xu_selection)?.clear();
  getComponent<Openable>(props.xu_modal)?.open();
}
</script>

<template>
  <n-button type="primary" v-on:click="onClick">Add user</n-button>
</template>
