<script setup lang="ts">
import { NBadge, NButton } from "naive-ui";

// Presentational leaf: a classic top-bar notifications bell. It renders naive-ui
// primitives only and neither registers nor consumes a registry key — like the
// <span> labels sprinkled through App.vue, it is pure top-bar chrome.
</script>

<template>
  <n-badge :value="3" :max="9">
    <n-button quaternary circle title="Notifications">🔔</n-button>
  </n-badge>
</template>
