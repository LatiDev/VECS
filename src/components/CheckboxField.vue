<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { NCheckbox } from "naive-ui";
import type { InputField } from "../models/InputField.ts";
import type { Writable } from "../models/Writable.ts";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";

const props = defineProps({
  xr_key: { type: String, required: true },
  label: { type: String, default: "Active" },
});

const checked = ref<boolean>(true);

function onChange(v: boolean) {
  checked.value = v;
}

// InputField contract stays string-based; booleans are serialized as "true"/"false".
function getValue(): string|null {
  return checked.value ? "true" : "false";
}

function setValue(v: string|null) {
  checked.value = v === "true";
}

function clear() {
  checked.value = true;
}

onMounted(() => { registerComponent<InputField & Writable>(props.xr_key, { getValue, setValue, clear }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <n-checkbox :checked="checked" v-on:update:checked="onChange">{{ label }}</n-checkbox>
</template>
