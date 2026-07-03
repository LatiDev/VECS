<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { Toggle } from "@/models/Toggle.ts";

// Logic-only sibling: mock session state. `isOpen()` means "signed in".
// AccountMenu reads it to decide which options to show and calls `toggle()`
// to sign in / out.
const props = defineProps({
  xr_key: { type: String, required: true },
});

const signedIn = ref<boolean>(false);

function isOpen(): boolean {
  return signedIn.value;
}

function toggle() {
  signedIn.value = !signedIn.value;
}

onMounted(() => { registerComponent<Toggle>(props.xr_key, { isOpen, toggle }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
