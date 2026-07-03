<script setup lang="ts">
import { NCard, NSpace } from "naive-ui";
import UsernameAvailability from "../components/UsernameAvailability.vue";
import PasswordLogic from "../components/PasswordLogic.vue";
import ConfirmMatchLogic from "../components/ConfirmMatchLogic.vue";
import ValidationMessage from "../components/ValidationMessage.vue";
import TextField from "../components/TextField.vue";
import SubmitButton from "../components/SubmitButton.vue";
</script>

<template>
  <!-- Logic-only siblings (render nothing) -->
  <UsernameAvailability xr_key="usr-v" xu_input="usr"/>
  <PasswordLogic xr_key="pwd-v" xu_input="pwd"/>
  <ConfirmMatchLogic xr_key="cfrm-v" xu_original="pwd" xu_confirm="cfrm"/>

  <n-card title="Create your account" segmented style="max-width: 520px; margin: 0 auto">
    <n-space vertical size="medium">
      <div class="field-row">
        <span class="label">Username</span>
        <TextField xr_key="usr" placeholder="lowercase, 3–20 chars"/>
        <ValidationMessage xu_validator="usr-v"/>
      </div>

      <div class="field-row">
        <span class="label">Password</span>
        <TextField xr_key="pwd" type="password" placeholder="8+ chars, 1 digit, 1 uppercase"/>
        <ValidationMessage xu_validator="pwd-v"/>
      </div>

      <div class="field-row">
        <span class="label">Confirm</span>
        <TextField xr_key="cfrm" type="password" placeholder="repeat password"/>
        <ValidationMessage xu_validator="cfrm-v"/>
      </div>

      <SubmitButton xu_user="usr-v" xu_password="cfrm-v"/>
    </n-space>
  </n-card>
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
</style>
