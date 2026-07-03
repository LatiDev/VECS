<script setup lang="ts">
import { computed } from "vue";
import { NText } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xu_validator: { type: String, required: true },
  label: { type: String, default: "" },
});

// Reads the validator through the reactive registry: re-evaluates when the
// validator (re)registers, and — via isValid() reading the target field's
// reactive value — as the user types.
const ok = computed<boolean>(() => {
  const validator = getComponent<Validatable>(props.xu_validator);
  return validator ? validator.isValid() : false;
});
</script>

<template>
  <n-text :type="ok ? 'success' : 'error'" style="margin-left: 8px">
    {{ ok ? "✓" : "✗" }}<template v-if="label"> {{ label }}</template>
  </n-text>
</template>
