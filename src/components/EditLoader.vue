<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { getComponent } from "../ComponentRegistry.js";
import type { CrudStore } from "@/models/CrudStore.ts";
import type { Selection } from "@/models/Selection.ts";
import type { UserRecord } from "@/models/UserRecord.ts";
import type { Writable } from "@/models/Writable.ts";

const props = defineProps({
  xu_selection: { type: String, required: true },
  xu_store: { type: String, required: true },
  xu_username: { type: String, required: true },
  xu_email: { type: String, required: true },
  xu_role: { type: String, required: true },
  xu_active: { type: String, required: true },
});

function fields() {
  return {
    username: getComponent<Writable>(props.xu_username),
    email: getComponent<Writable>(props.xu_email),
    role: getComponent<Writable>(props.xu_role),
    active: getComponent<Writable>(props.xu_active),
  };
}

// Reactively track the current selection across the registry and mirror the
// selected record into the form fields (or clear them when nothing is selected).
// Reading the selection through the reactive registry means the getter re-binds
// automatically once the SelectionState sibling registers.
const stop = watch(
  () => getComponent<Selection>(props.xu_selection)?.selectedId() ?? null,
  (id) => {
    const f = fields();
    if (!id) {
      f.username?.clear();
      f.email?.clear();
      f.role?.clear();
      f.active?.clear();
      return;
    }
    const store = getComponent<CrudStore<UserRecord>>(props.xu_store);
    const record = store?.get(id);
    if (!record) return;
    f.username?.setValue(record.username);
    f.email?.setValue(record.email);
    f.role?.setValue(record.role);
    f.active?.setValue(record.active ? "true" : "false");
  },
);

onUnmounted(() => { stop(); });
</script>
