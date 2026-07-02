<script setup lang="ts">
import UsernameAvailability from "./components/UsernameAvailability.vue";
import PasswordLogic from "./components/PasswordLogic.vue";
import ConfirmMatchLogic from "./components/ConfirmMatchLogic.vue";
import TextField from "./components/TextField.vue";
import SubmitButton from "./components/SubmitButton.vue";
</script>

<template>
  <span>Username</span>
  <TextField xr_key="usr"/>
  <UsernameAvailability xr_key="usr-v" xu_input="usr"/>
  <br>

  <span>Password</span>
  <TextField xr_key="pwd"/>
  <PasswordLogic xr_key="pwd-v" xu_input="pwd"/>
  <br>

 <span>Confirm password</span>
 <TextField xr_key="cfrm"/>
 <ConfirmMatchLogic xr_key="cfrm-v" xu_original="pwd" xu_confirm="cfrm"/>
 <br>
 
 <SubmitButton xu_user="usr-v" xu_password="cfrm-v"/>
</template>
