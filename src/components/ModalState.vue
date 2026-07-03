<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { Openable } from "@/models/Openable.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
});

const shown = ref<boolean>(false);

function isOpen(): boolean { return shown.value; }
function open() { shown.value = true; }
function close() { shown.value = false; }

onMounted(() => { registerComponent<Openable>(props.xr_key, { isOpen, open, close }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
