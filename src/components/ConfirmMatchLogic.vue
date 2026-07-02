<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { InputField } from "@/models/InputField.ts";
import type { Validatable } from "@/models/Validatable.js";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_original: { type: String, required: true },
  xu_confirm: { type: String, required: true },
});

const isValid = function() {
  const { getValue:getOriginal } = getComponent<InputField>(props.xu_original);
  const { getValue:getConfirm } = getComponent<InputField>(props.xu_confirm);
  
  const original = getOriginal();
  const confirm = getConfirm();

  return !!original && original === confirm;
}

onMounted(() => { registerComponent<Validatable>(props.xr_key, { isValid }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
