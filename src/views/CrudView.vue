<script setup lang="ts">
import { computed } from "vue";
import { NCard, NSpace, NDivider } from "naive-ui";
import { getComponent } from "../ComponentRegistry.js";
import type { Openable } from "@/models/Openable.ts";
import ModalState from "../components/ModalState.vue";
import AddButton from "../components/AddButton.vue";
import UserStore from "../components/UserStore.vue";
import UserFilter from "../components/UserFilter.vue";
import UserSort from "../components/UserSort.vue";
import UserPaginator from "../components/UserPaginator.vue";
import UserTable from "../components/UserTable.vue";
import SelectionState from "../components/SelectionState.vue";
import EditLoader from "../components/EditLoader.vue";
import TextField from "../components/TextField.vue";
import SelectField from "../components/SelectField.vue";
import CheckboxField from "../components/CheckboxField.vue";
import UsernameAvailability from "../components/UsernameAvailability.vue";
import EmailLogic from "../components/EmailLogic.vue";
import ValidationMessage from "../components/ValidationMessage.vue";
import SortControls from "../components/SortControls.vue";
import PageControls from "../components/PageControls.vue";
import SaveButton from "../components/SaveButton.vue";
import ResetButton from "../components/ResetButton.vue";

// The form modal's open state lives in a sibling (ModalState), read through the
// reactive registry — same wiring pattern the top-bar uses for its theme toggle.
// We render our own v-show overlay (not <n-modal>): the VECS registry needs the
// form fields to stay MOUNTED even while hidden, so validators keep resolving and
// EditLoader can populate them the instant a row's "Edit" fires. Naive UI's modal
// teleports and mounts its body lazily on first open, which would leave those keys
// unregistered and crash the render. The overlay is presentational plumbing, like
// the <n-card> wrappers: the siblings inside stay flat and never contain one another.
const modalOpen = computed(() => getComponent<Openable>("modal")?.isOpen() ?? false);

function closeModal() {
  getComponent<Openable>("modal")?.close();
}
</script>

<template>
  <!-- Logic-only siblings (render nothing): the store consumes the transforms -->
  <UserFilter xr_key="filter" xu_query="q"/>
  <UserSort xr_key="sortT" xu_control="sort"/>
  <UserPaginator xr_key="pageT" xu_control="page"/>
  <UserStore xr_key="store" xu_filter="filter" xu_sort="sortT" xu_page="pageT"/>
  <SelectionState xr_key="sel"/>
  <UsernameAvailability xr_key="f-usr-v" xu_input="f-usr"/>
  <EmailLogic xr_key="f-eml-v" xu_input="f-eml"/>
  <EditLoader
    xu_selection="sel"
    xu_store="store"
    xu_username="f-usr"
    xu_email="f-eml"
    xu_role="f-role"
    xu_active="f-active"
  />
  <ModalState xr_key="modal"/>

  <n-card title="Users" segmented>
    <n-space align="center" style="margin-bottom: 4px">
      <span class="label">Search</span>
      <TextField xr_key="q" placeholder="username, email or role…"/>
      <SortControls xr_key="sort"/>
      <AddButton xu_selection="sel" xu_modal="modal"/>
    </n-space>

    <n-divider style="margin: 12px 0"/>

    <UserTable xu_store="store" xu_selection="sel" xu_modal="modal"/>

    <n-space justify="end" align="center" style="margin-top: 12px">
      <PageControls xr_key="page" xu_store="store"/>
    </n-space>
  </n-card>

  <!-- The add/edit form lives in a modal overlay. v-show keeps the VECS siblings
       below permanently mounted (and registered); they remain flat. -->
  <div v-show="modalOpen" class="modal-backdrop" v-on:click.self="closeModal">
    <n-card
      title="Add / edit user"
      closable
      segmented
      class="modal-panel"
      v-on:close="closeModal"
    >
    <n-space vertical size="medium">
      <div class="field-row">
        <span class="label">Username</span>
        <TextField xr_key="f-usr" placeholder="lowercase, 3–20 chars"/>
        <ValidationMessage xu_validator="f-usr-v"/>
      </div>

      <div class="field-row">
        <span class="label">Email</span>
        <TextField xr_key="f-eml" placeholder="name@example.com"/>
        <ValidationMessage xu_validator="f-eml-v"/>
      </div>

      <div class="field-row">
        <span class="label">Role</span>
        <SelectField xr_key="f-role" :options="['admin', 'editor', 'viewer']"/>
      </div>

      <div class="field-row">
        <span class="label">Active</span>
        <CheckboxField xr_key="f-active"/>
      </div>

      <n-space>
        <SaveButton
          xu_store="store"
          xu_selection="sel"
          xu_username="f-usr"
          xu_email="f-eml"
          xu_role="f-role"
          xu_active="f-active"
          xu_username_valid="f-usr-v"
          xu_email_valid="f-eml-v"
          xu_modal="modal"
        />
        <ResetButton
          xu_selection="sel"
          xu_username="f-usr"
          xu_email="f-eml"
          xu_role="f-role"
          xu_active="f-active"
        />
      </n-space>
    </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.label {
  display: inline-block;
  min-width: 84px;
  font-weight: 600;
  color: #4b5563;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 16px;
  background: rgba(0, 0, 0, 0.45);
}

.modal-panel {
  width: 520px;
  max-width: 92vw;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}
</style>
