<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { InputField } from "@/models/InputField.ts";
import type { ListTransform } from "@/models/ListTransform.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_query: { type: String, required: true },
});

function apply(items: UserRecord[]): UserRecord[] {
  const source = getComponent<InputField>(props.xu_query);
  const term = (source?.getValue() ?? "").trim().toLowerCase();
  if (!term) return items;
  return items.filter((u) =>
    u.username.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term) ||
    u.role.toLowerCase().includes(term),
  );
}

onMounted(() => { registerComponent<ListTransform<UserRecord>>(props.xr_key, { apply }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
