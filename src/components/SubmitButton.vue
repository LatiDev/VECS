<script setup lang="ts">
import { getComponent } from "../ComponentRegistry.js";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xu_user: { type: String, required: true },
  xu_password: { type: String, required: true },
});

async function onClick() {
  const { isValid:isUserValid } = getComponent<Validatable>(props.xu_user);
  const { isValid:isPwdValid } = getComponent<Validatable>(props.xu_password);

  if (!isUserValid()) {
    console.error("user error");
    return;
  }

  if (!isPwdValid()) {
    console.error("password error");
    return;
  }

  console.log("perfect");
}
</script>

<template>
  <button v-on:click="onClick">Sign up</button>
</template>
