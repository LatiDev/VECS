<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { InputField } from "../models/InputField.ts";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";

const props = defineProps<{
  xr_key: string;
}>();

const value = ref<string|null>(null);

function onInput(e: Event) {
  value.value = (e.target as HTMLInputElement).value;
}

function getValue(): string|null {
  return value.value
}

onMounted(() => { registerComponent<InputField>(props.xr_key, { getValue }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <input v-on:input="onInput"/>
</template>
