<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { ListTransform } from "@/models/ListTransform.ts";
import type { SortState } from "@/models/SortState.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_control: { type: String, required: true },
});

function apply(items: UserRecord[]): UserRecord[] {
  const control = getComponent<SortState>(props.xu_control);
  if (!control) return items;
  const field = control.field();
  const factor = control.dir() === "asc" ? 1 : -1;
  return items.slice().sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av < bv) return -1 * factor;
    if (av > bv) return 1 * factor;
    return 0;
  });
}

onMounted(() => { registerComponent<ListTransform<UserRecord>>(props.xr_key, { apply }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
