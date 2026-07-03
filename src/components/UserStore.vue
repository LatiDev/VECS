<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { CrudStore } from "@/models/CrudStore.ts";
import type { ListTransform } from "@/models/ListTransform.ts";
import type { UserRecord } from "@/models/UserRecord.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_filter: { type: String, required: true },
  xu_sort: { type: String, required: true },
  xu_page: { type: String, required: true },
});

const STORAGE_KEY = "vecs.users";

const ROLES = ["admin", "editor", "viewer"];

const NAMES = [
  "alice", "bob", "carol", "dave", "erin", "frank", "grace", "heidi", "ivan", "judy",
  "karl", "laura", "mallory", "niaj", "olivia", "peggy", "rupert", "sybil", "trent", "victor",
  "walter", "wendy", "xavier", "yara", "zach", "amina", "bruno", "chloe", "diego", "elena",
];

function buildSeed(): UserRecord[] {
  const records: UserRecord[] = [];
  for (let i = 1; i <= 120; i++) {
    const base = NAMES[(i - 1) % NAMES.length]!;
    const suffix = Math.floor((i - 1) / NAMES.length) + 1;
    const username = suffix > 1 ? `${base}${suffix}` : base;
    records.push({
      id: `u${i}`,
      username,
      email: `${username}@example.com`,
      role: ROLES[i % ROLES.length]!,
      active: i % 4 !== 0,
    });
  }
  return records;
}

const SEED: UserRecord[] = buildSeed();

function load(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserRecord[];
  } catch {
    console.error("could not read users from localStorage");
  }
  return SEED.map((u) => ({ ...u }));
}

const list = ref<UserRecord[]>(load());

watch(list, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    console.error("could not persist users to localStorage");
  }
}, { deep: true });

function all(): UserRecord[] {
  return list.value;
}

function get(id: string): UserRecord|undefined {
  return list.value.find((u) => u.id === id);
}

function create(data: Omit<UserRecord, "id">): UserRecord {
  const record: UserRecord = { id: crypto.randomUUID(), ...data };
  list.value = [...list.value, record];
  return record;
}

function update(id: string, patch: Partial<UserRecord>) {
  list.value = list.value.map((u) => (u.id === id ? { ...u, ...patch, id } : u));
}

function remove(id: string) {
  list.value = list.value.filter((u) => u.id !== id);
}

function filtered(): UserRecord[] {
  const filter = getComponent<ListTransform<UserRecord>>(props.xu_filter);
  const sort = getComponent<ListTransform<UserRecord>>(props.xu_sort);
  let items = list.value.slice();
  if (filter) items = filter.apply(items);
  if (sort) items = sort.apply(items);
  return items;
}

function view(): UserRecord[] {
  const page = getComponent<ListTransform<UserRecord>>(props.xu_page);
  const items = filtered();
  return page ? page.apply(items) : items;
}

function filteredCount(): number {
  return filtered().length;
}

onMounted(() => {
  registerComponent<CrudStore<UserRecord>>(props.xr_key, {
    all, get, create, update, remove, view, filteredCount,
  });
});
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
