<script setup lang="ts">
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import { onMounted, onUnmounted } from "vue";
import type { InputField } from "@/models/InputField.ts";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_input: { type: String, required: true },
});

const isValidFormat = function(value: string|null) {
  if (!value) {
    return false;
  }

  return !/^[a-z0-9_]{3,20}$/.test(value);
}

const isValid = function(): boolean {
  const { getValue:getUsername } = getComponent<InputField>(props.xu_input);
  const username = getUsername();

  return isValidFormat(username);
}

onMounted(() => { registerComponent<Validatable>(props.xr_key, { isValid }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
