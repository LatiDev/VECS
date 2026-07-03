<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { NButton, NText } from "naive-ui";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { CrudStore } from "@/models/CrudStore.ts";
import type { PageState } from "@/models/PageState.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_store: { type: String, required: true },
  size: { type: Number, default: 25 },
});

const current = ref<number>(1);

function page(): number {
  return Math.min(current.value, pageTotal.value);
}

function pageSize(): number {
  return props.size;
}

function setPage(n: number) {
  current.value = Math.max(1, Math.min(n, pageTotal.value));
}

function next() {
  setPage(current.value + 1);
}

function prev() {
  setPage(current.value - 1);
}

// Total pages derives from the store's post-filter count and this control's page
// size; reading the store through the reactive registry keeps it up to date.
const pageTotal = computed(() => {
  const store = getComponent<CrudStore<UserRecord>>(props.xu_store);
  const count = store ? store.filteredCount() : 0;
  return Math.max(1, Math.ceil(count / props.size));
});

// Keep the current page in range when filtering shrinks the result set.
const clampedPage = computed(() => Math.min(current.value, pageTotal.value));

onMounted(() => { registerComponent<PageState>(props.xr_key, { page, pageSize, setPage, next, prev }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <n-button size="small" v-on:click="prev" :disabled="clampedPage <= 1">Prev</n-button>
  <n-text depth="2" style="margin: 0 12px">Page {{ clampedPage }} of {{ pageTotal }}</n-text>
  <n-button size="small" v-on:click="next" :disabled="clampedPage >= pageTotal">Next</n-button>
</template>
