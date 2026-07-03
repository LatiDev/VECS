<script setup lang="ts">
import { RouterLink } from "vue-router";
import { NButton, NCard, NGi, NGrid, NSpace, NTag } from "naive-ui";

// Landing page. A view template is presentational plumbing: it renders naive-ui
// primitives and RouterLinks and wires no registry keys — there is no
// cross-component logic to entangle here, so nothing registers or consumes.
const features = [
  {
    icon: "↔",
    title: "Horizontal architecture",
    body: "Components are always siblings. None ever contains another — the tree stays flat.",
  },
  {
    icon: "🔑",
    title: "Registry wiring",
    body: "Siblings publish tiny APIs under a key and reference each other by key, never by props.",
  },
  {
    icon: "🚫",
    title: "Zero prop drilling",
    body: "No data flows through the component tree. Coupling lives in the ComponentRegistry alone.",
  },
];
</script>

<template>
  <n-space vertical size="large">
    <n-card segmented class="hero">
      <n-tag round type="info" size="small" style="margin-bottom: 14px">
        Vue&nbsp;3 · Sibling Registry pattern
      </n-tag>
      <h1 class="hero-title">Wire components sideways, not top-down.</h1>
      <p class="hero-sub">
        VECS — the Vue Entangled Component System — is a demo of an architecture where components
        never nest and never pass props. They register a small API under a key and reference each
        other through a shared module-level registry.
      </p>
      <n-space size="medium" justify="center" style="margin-top: 22px">
        <RouterLink v-slot="{ navigate }" to="/signup" custom>
          <n-button type="primary" size="large" v-on:click="navigate">Get started</n-button>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/crud" custom>
          <n-button size="large" v-on:click="navigate">Explore the CRUD demo</n-button>
        </RouterLink>
      </n-space>
    </n-card>

    <n-grid :cols="3" :x-gap="16" :y-gap="16" item-responsive responsive="screen">
      <n-gi v-for="f in features" :key="f.title" span="3 s:1">
        <n-card class="feature" segmented>
          <div class="feature-icon">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-body">{{ f.body }}</p>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 24px 12px;
}

.hero-title {
  margin: 0;
  font-size: 34px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.hero-sub {
  max-width: 620px;
  margin: 16px auto 0;
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
}

.feature-icon {
  font-size: 26px;
  margin-bottom: 8px;
}

.feature-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
}

.feature-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #6b7280;
}
</style>
