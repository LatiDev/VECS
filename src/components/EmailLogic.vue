<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { InputField } from "@/models/InputField.ts";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_input: { type: String, required: true },
});

const isValid = function(): boolean {
  const { getValue } = getComponent<InputField>(props.xu_input);
  const email = getValue();

  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

onMounted(() => { registerComponent<Validatable>(props.xr_key, { isValid }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
