<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { NButton, NButtonGroup } from "naive-ui";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { SortState } from "@/models/SortState.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
});

const SORTABLE: (keyof UserRecord)[] = ["username", "email", "role", "active"];

const currentField = ref<keyof UserRecord>("username");
const direction = ref<"asc"|"desc">("asc");

function field(): keyof UserRecord {
  return currentField.value;
}

function dir(): "asc"|"desc" {
  return direction.value;
}

function toggle(f: keyof UserRecord) {
  if (currentField.value === f) {
    direction.value = direction.value === "asc" ? "desc" : "asc";
  } else {
    currentField.value = f;
    direction.value = "asc";
  }
}

onMounted(() => { registerComponent<SortState>(props.xr_key, { field, dir, toggle }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <n-button-group size="small">
    <n-button
      v-for="f in SORTABLE"
      :key="f"
      :type="currentField === f ? 'primary' : 'default'"
      v-on:click="toggle(f)"
    >
      {{ f }}<template v-if="currentField === f">{{ direction === "asc" ? " ▲" : " ▼" }}</template>
    </n-button>
  </n-button-group>
</template>
