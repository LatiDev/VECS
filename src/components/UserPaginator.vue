<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { ListTransform } from "@/models/ListTransform.ts";
import type { PageState } from "@/models/PageState.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_control: { type: String, required: true },
});

function apply(items: UserRecord[]): UserRecord[] {
  const control = getComponent<PageState>(props.xu_control);
  if (!control) return items;
  const size = control.pageSize();
  const start = (control.page() - 1) * size;
  return items.slice(start, start + size);
}

onMounted(() => { registerComponent<ListTransform<UserRecord>>(props.xr_key, { apply }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
