<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { Selection } from "@/models/Selection.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
});

const current = ref<string|null>(null);

function selectedId(): string|null {
  return current.value;
}

function select(id: string) {
  current.value = id;
}

function clear() {
  current.value = null;
}

onMounted(() => { registerComponent<Selection>(props.xr_key, { selectedId, select, clear }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
