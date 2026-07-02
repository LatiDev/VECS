<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { InputField } from "@/models/InputField.ts";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_input: { type: String, required: true },
});

const isValid = function() {
  const target = getComponent<InputField>(props.xu_input);
  const password = target.getValue();

  if (!password) {
    console.error("password error");
    return false
  }

  return password.length >= 8 && /[0-9]/.test(password) && /[A-Z]/.test(password);
}

onMounted(() => { registerComponent<Validatable>(props.xr_key, { isValid }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
