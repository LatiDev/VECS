<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";

// Logic-only sibling: holds the dark-mode flag and publishes it as a Toggle.
// App.vue reads it to pick naive-ui's theme; ThemeToggle reads it to flip it.
// `isOpen()` means "dark mode is on" (the Toggle shape is reused for on/off state).
const props = defineProps({
  xr_key: { type: String, required: true },
});

const dark = ref<boolean>(false);

function isOpen(): boolean {
  return dark.value;
}

function toggle() {
  dark.value = !dark.value;
}

onMounted(() => { registerComponent<Toggle>(props.xr_key, { isOpen, toggle }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
