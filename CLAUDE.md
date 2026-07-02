# VECS — Vue Entangled Component System

Application de démonstration d'un pattern d'architecture Vue 3 baptisé **Sibling Registry** :
les composants ne communiquent **jamais** par imbrication ni par passage de données en props.
Ils s'enregistrent dans un registre partagé au niveau module et se référencent **par clé**.

---

## Règle d'or — Architecture horizontale

**Tous les composants doivent être frère/sœur entre eux. JAMAIS un composant ne doit en contenir
un autre. Architecture horizontale > architecture verticale.**

Concrètement, dans un `<template>`, les composants sont juxtaposés à plat, jamais imbriqués :

```vue
<!-- BIEN : frères/sœurs, à plat -->
<TextField xr_key="pwd" />
<PasswordLogic xr_key="pwd-v" xu_input="pwd" />
<SubmitButton xu_password="pwd-v" />

<!-- INTERDIT : imbrication -->
<PasswordLogic xu_input="pwd">
  <TextField xr_key="pwd" />
</PasswordLogic>
```

Le couplage se fait uniquement via le **ComponentRegistry**, pas via l'arbre de composants.

---

## Le ComponentRegistry

Fichier : [src/ComponentRegistry.ts](src/ComponentRegistry.ts). C'est un `Map` singleton au niveau
module (`name -> api`). Trois fonctions :

```ts
registerComponent<T>(name: string, api: T): void  // publie une API sous une clé
unregisterComponent(name: string): void           // retire la clé
getComponent<T>(name: string): T                   // récupère l'API d'un autre composant
```

- Une « API » est un objet de méthodes (ex. `{ getValue }`, `{ isValid }`), pas l'instance Vue.
- `getComponent` logue une erreur console si la clé est absente **mais retourne quand même**
  `undefined` — l'appelant n'est pas protégé. Vérifie l'existence si l'ordre de montage n'est pas garanti.
- Le typage est porté par l'appelant via le générique (`getComponent<InputField>(...)`), le registre
  ne stocke aucune information de type à l'exécution.

---

## Convention de props `xr_` / `xu_` — le câblage

Toutes les props sont des **clés de registre** (des identifiants, jamais des données). Deux
préfixes distincts selon le sens du câblage :

| Préfixe | Prop | Rôle |
|---------|------|------|
| `xr_` (**r**egister) | `xr_key` | Clé sous laquelle **ce** composant s'enregistre (son identité). |
| `xu_` (**u**se) | `xu_input`, `xu_original`, `xu_confirm`, `xu_user`, `xu_password`, … | Clés d'**autres** composants dont on veut l'API. Le suffixe décrit le rôle de la dépendance. |

Type systématique : `{ type: String, required: true }` (ou `defineProps<{ xr_key: string }>()`).
Les clés (`"pwd"`, `"pwd-v"`, …) sont choisies dans le `<template>` parent et doivent correspondre
exactement entre le `xr_key` du producteur et le `xu_*` du consommateur. Convention observée : la
clé de la valeur brute est courte (`"usr"`, `"pwd"`, `"cfrm"`) et sa logique de validation ajoute
le suffixe `-v` (`"usr-v"`, `"pwd-v"`, `"cfrm-v"`).

---

## Les trois rôles de composant

### 1. Composant d'entrée (a un `<template>`, produit une valeur)

Enregistre une API `InputField` et possède du DOM. Exemple réel :
[src/components/TextField.vue](src/components/TextField.vue).

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { InputField } from "../models/InputField.ts";
import { registerComponent, unregisterComponent } from "../ComponentRegistry.js";

const props = defineProps<{ xr_key: string }>();
const value = ref<string | null>(null);

function onInput(e: Event) { value.value = (e.target as HTMLInputElement).value; }
function getValue(): string | null { return value.value; }

onMounted(() => { registerComponent<InputField>(props.xr_key, { getValue }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>

<template>
  <input v-on:input="onInput" />
</template>
```

### 2. Composant de logique pure (PAS de `<template>`)

Ne rend aucun DOM. Il lit ses dépendances via `getComponent` et publie une API `Validatable`.
Exemples réels : [src/components/PasswordLogic.vue](src/components/PasswordLogic.vue),
[src/components/UsernameAvailability.vue](src/components/UsernameAvailability.vue),
[src/components/ConfirmMatchLogic.vue](src/components/ConfirmMatchLogic.vue).

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getComponent, registerComponent, unregisterComponent } from "../ComponentRegistry.js";
import type { InputField } from "@/models/InputField.ts";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xr_key: { type: String, required: true },
  xu_input: { type: String, required: true },
});

const isValid = function (): boolean {
  const target = getComponent<InputField>(props.xu_input);
  const value = target.getValue();
  if (!value) return false;
  return value.length >= 8 && /[0-9]/.test(value) && /[A-Z]/.test(value);
};

onMounted(() => { registerComponent<Validatable>(props.xr_key, { isValid }); });
onUnmounted(() => { unregisterComponent(props.xr_key); });
</script>
```

Un composant de logique peut dépendre de plusieurs autres (`xu_original` + `xu_confirm` dans
`ConfirmMatchLogic`) et un composant de logique peut consommer un autre composant de logique
(chaînage : `TextField` → `PasswordLogic`/`ConfirmMatchLogic` → `SubmitButton`).

### 3. Composant consommateur (a un `<template>`, ne s'enregistre PAS)

Point d'entrée d'une action utilisateur. Il ne fait qu'appeler `getComponent` pour orchestrer,
sans se publier lui-même. Exemple réel : [src/components/SubmitButton.vue](src/components/SubmitButton.vue).

```vue
<script setup lang="ts">
import { getComponent } from "../ComponentRegistry.js";
import type { Validatable } from "@/models/Validatable.ts";

const props = defineProps({
  xu_user: { type: String, required: true },
  xu_password: { type: String, required: true },
});

async function onClick() {
  const { isValid: isUserValid } = getComponent<Validatable>(props.xu_user);
  const { isValid: isPwdValid } = getComponent<Validatable>(props.xu_password);
  if (!isUserValid()) { console.error("user error"); return; }
  if (!isPwdValid()) { console.error("password error"); return; }
  console.log("perfect");
}
</script>

<template>
  <button v-on:click="onClick">Sign up</button>
</template>
```

---

## Les interfaces d'API (models)

Les contrats publiés dans le registre vivent dans [src/models/](src/models/). Ce sont de simples
interfaces TypeScript, une méthode chacune :

- [src/models/InputField.ts](src/models/InputField.ts) — `getValue(): string | null`
- [src/models/Validatable.ts](src/models/Validatable.ts) — `isValid(): boolean`

Pour un nouveau type de capacité, ajoute une interface dédiée dans `src/models/` et enregistre-la
avec `registerComponent<MonInterface>(...)`. Garde les interfaces minimales (une responsabilité).

---

## Assemblage — [src/App.vue](src/App.vue)

`App.vue` est le seul endroit qui déclare les clés et câble les composants entre eux. Il n'y a
aucune logique dans `App.vue`, uniquement du câblage déclaratif à plat :

```vue
<TextField xr_key="usr" />
<UsernameAvailability xr_key="usr-v" xu_input="usr" />

<TextField xr_key="pwd" />
<PasswordLogic xr_key="pwd-v" xu_input="pwd" />

<TextField xr_key="cfrm" />
<ConfirmMatchLogic xr_key="cfrm-v" xu_original="pwd" xu_confirm="cfrm" />

<SubmitButton xu_user="usr-v" xu_password="cfrm-v" />
```

Les `<span>` de libellé et les `<br>` de mise en forme sont juxtaposés à plat au milieu du câblage,
au même niveau que les composants — cohérent avec la règle horizontale.

---

## Conventions de style (à respecter)

- **Vue 3 `<script setup lang="ts">`** exclusivement, Composition API.
- **Cycle de vie du registre** : toujours `registerComponent` dans `onMounted` et
  `unregisterComponent` dans `onUnmounted`. Ne jamais s'enregistrer au niveau module.
- **API par déstructuration** : côté consommateur, `const { isValid } = getComponent<...>(key)`.
- **Extensions d'import explicites** : `.ts` pour les models/composants, `.js` pour
  `ComponentRegistry` (import `../ComponentRegistry.js` alors que le fichier est `.ts` — résolu par Vite/TS).
- **Alias `@/`** = `src/` (ex. `@/models/Validatable.ts`). Le chemin relatif `../` est aussi utilisé ;
  les deux coexistent, pas de règle stricte.
- **Composants de logique = zéro template**. S'il y a du DOM, ce n'est pas un composant de logique.
- Les erreurs sont signalées via `console.error` et un retour `false`/early-return (pas d'exceptions).

---

## Stack & commandes

- **Vue 3.5**, **Vite 8**, **TypeScript 6**, **vue-router 5** (routes vides), **Pinia** (installé, non utilisé).
- Tests : **Vitest** (`src/__tests__/`) + **Playwright** (e2e).
- Lint/format : **oxlint** + **eslint** + **oxfmt**.

```bash
npm run dev          # serveur de dev Vite
npm run build        # type-check + build
npm run type-check   # vue-tsc --build
npm run test:unit    # Vitest
npm run test:e2e     # Playwright
npm run lint         # oxlint --fix puis eslint --fix
npm run format       # oxfmt src/
```

> Note : [src/__tests__/App.spec.ts](src/__tests__/App.spec.ts) est un test hérité qui cible un
> champ email inexistant dans l'`App.vue` actuel — le mettre à jour avant de s'y fier.
