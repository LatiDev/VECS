<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { NSelect } from "naive-ui";
import type { InputField } from "../models/InputField.ts";
import type { Writable } from "../models/Writable.ts";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";

const props = defineProps({
  xr_key: { type: String, required: true },
  options: { type: Array as () => string[], required: true },
});

const value = ref<string|null>(props.options[0] ?? null);

const selectOptions = computed(() => props.options.map((o) => ({ label: o, value: o })));

function onChange(v: string) {
  value.value = v;
}

function getValue(): string|null {
  return value.value;
}

function setValue(v: string|null) {
  value.value = v;
}

function clear() {
  value.value = props.options[0] ?? null;
}

onMounted(() => { registerComponent<InputField & Writable>(props.xr_key, { getValue, setValue, clear }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <n-select
    :value="value"
    :options="selectOptions"
    v-on:update:value="onChange"
    style="max-width: 260px"
  />
</template>
