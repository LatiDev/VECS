<script setup lang="ts">
import { NButton } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { CrudStore } from "@/models/CrudStore.ts";
import type { InputField } from "@/models/InputField.ts";
import type { Openable } from "@/models/Openable.ts";
import type { Selection } from "@/models/Selection.ts";
import type { UserRecord } from "@/models/UserRecord.ts";
import type { Validatable } from "@/models/Validatable.ts";
import type { Writable } from "@/models/Writable.ts";

const props = defineProps({
  xu_store: { type: String, required: true },
  xu_selection: { type: String, required: true },
  xu_username: { type: String, required: true },
  xu_email: { type: String, required: true },
  xu_role: { type: String, required: true },
  xu_active: { type: String, required: true },
  xu_username_valid: { type: String, required: true },
  xu_email_valid: { type: String, required: true },
  xu_modal: { type: String, required: true },
});

function onClick() {
  const { isValid: userOk } = getComponent<Validatable>(props.xu_username_valid);
  const { isValid: emailOk } = getComponent<Validatable>(props.xu_email_valid);

  if (!userOk()) {
    console.error("username error");
    return;
  }

  if (!emailOk()) {
    console.error("email error");
    return;
  }

  const data: Omit<UserRecord, "id"> = {
    username: getComponent<InputField>(props.xu_username).getValue() ?? "",
    email: getComponent<InputField>(props.xu_email).getValue() ?? "",
    role: getComponent<InputField>(props.xu_role).getValue() ?? "",
    active: getComponent<InputField>(props.xu_active).getValue() === "true",
  };

  const store = getComponent<CrudStore<UserRecord>>(props.xu_store);
  const selection = getComponent<Selection>(props.xu_selection);
  const editingId = selection.selectedId();

  if (editingId) {
    store.update(editingId, data);
  } else {
    store.create(data);
  }

  // Reset the form: clear the fields directly (a create leaves the selection
  // already null, so EditLoader's watch would not fire) and drop any selection.
  getComponent<Writable>(props.xu_username)?.clear();
  getComponent<Writable>(props.xu_email)?.clear();
  getComponent<Writable>(props.xu_role)?.clear();
  getComponent<Writable>(props.xu_active)?.clear();
  selection.clear();

  // Saved successfully — dismiss the form modal.
  getComponent<Openable>(props.xu_modal)?.close();
}
</script>

<template>
  <n-button type="primary" v-on:click="onClick">Save</n-button>
</template>
