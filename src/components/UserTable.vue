<script setup lang="ts">
import { computed } from "vue";
import { NButton, NTable, NTag } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { CrudStore } from "@/models/CrudStore.ts";
import type { Openable } from "@/models/Openable.ts";
import type { Selection } from "@/models/Selection.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xu_store: { type: String, required: true },
  xu_selection: { type: String, required: true },
  xu_modal: { type: String, required: true },
});

// Reads the store through the reactive registry, so this re-evaluates once the
// store registers and whenever its underlying list/filter/sort/page change.
const rows = computed<UserRecord[]>(() => {
  const store = getComponent<CrudStore<UserRecord>>(props.xu_store);
  return store ? store.view() : [];
});

function edit(id: string) {
  getComponent<Selection>(props.xu_selection)?.select(id);
  getComponent<Openable>(props.xu_modal)?.open();
}

function remove(id: string) {
  getComponent<CrudStore<UserRecord>>(props.xu_store)?.remove(id);
}
</script>

<template>
  <n-table :bordered="false" :single-line="false" size="small">
    <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Active</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="u in rows" :key="u.id">
        <td>{{ u.username }}</td>
        <td>{{ u.email }}</td>
        <td>{{ u.role }}</td>
        <td>
          <n-tag :type="u.active ? 'success' : 'default'" size="small" round>
            {{ u.active ? "yes" : "no" }}
          </n-tag>
        </td>
        <td>
          <n-button size="tiny" secondary v-on:click="edit(u.id)">Edit</n-button>
          <n-button size="tiny" secondary type="error" style="margin-left: 6px" v-on:click="remove(u.id)">Delete</n-button>
        </td>
      </tr>
      <tr v-if="rows.length === 0">
        <td colspan="5">No users</td>
      </tr>
    </tbody>
  </n-table>
</template>
