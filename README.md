# VECS — Vue Entangled Component System

Application de démonstration d'un pattern d'architecture Vue 3 : le **Sibling Registry**.

Les composants ne communiquent **jamais** par imbrication ni par passage de données en props.
Ils s'enregistrent dans un registre partagé au niveau module et se référencent **par clé**. Toutes
les props ne transportent que des identifiants — jamais de données.

> Voir [CLAUDE.md](CLAUDE.md) pour la spécification complète du pattern et des conventions.

---

## La règle d'or — architecture horizontale

**Tous les composants sont frère/sœur. Jamais un composant n'en contient un autre.** Dans un
`<template>`, ils sont juxtaposés à plat ; le couplage passe uniquement par le registre.

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

---

## Comment ça marche

### Le registre — [src/ComponentRegistry.ts](src/ComponentRegistry.ts)

Un `Map` singleton au niveau module (`clé -> api`), enveloppé dans `shallowReactive` pour que
l'**appartenance** au registre soit suivie par la réactivité Vue. Un consommateur qui se rend avant
que son frère producteur ne soit monté se ré-évalue automatiquement dès l'enregistrement — pas de
`nextTick` post-montage nécessaire.

```ts
registerComponent<T>(name, api)   // publie une API sous une clé (dans onMounted)
unregisterComponent(name)         // retire la clé (dans onUnmounted)
getComponent<T>(name): T          // récupère l'API d'un autre composant (par clé)
```

Une « API » est un objet de méthodes (`{ getValue }`, `{ isValid }`, `{ isOpen }`), pas l'instance
Vue. Le typage est porté par l'appelant via le générique ; le registre ne stocke aucun type à
l'exécution. `getComponent` logue une erreur mais retourne `undefined` si la clé est absente.

### Le câblage — préfixes `xr_` / `xu_`

| Préfixe | Prop | Rôle |
|---------|------|------|
| `xr_` (**r**egister) | `xr_key` | Clé sous laquelle **ce** composant s'enregistre (son identité). |
| `xu_` (**u**se) | `xu_input`, `xu_store`, `xu_selection`, … | Clés d'**autres** composants dont on veut l'API. Le suffixe décrit le rôle de la dépendance. |

Les clés (`"pwd"`, `"pwd-v"`, …) sont choisies dans le `<template>` parent et doivent correspondre
exactement entre le `xr_key` du producteur et le `xu_*` du consommateur. Convention : la valeur
brute a une clé courte (`"usr"`, `"pwd"`) et sa logique de validation ajoute le suffixe `-v`.

### Les trois rôles de composant

1. **Composant d'entrée** — a un `<template>`, produit une valeur, enregistre une API.
   Ex. [TextField.vue](src/components/TextField.vue), [SelectField.vue](src/components/SelectField.vue).
2. **Composant de logique pure** — **aucun `<template>`**, lit ses dépendances via `getComponent`,
   publie une API. Ex. [PasswordLogic.vue](src/components/PasswordLogic.vue),
   [UserStore.vue](src/components/UserStore.vue).
3. **Composant consommateur** — a un `<template>`, orchestre une action, ne s'enregistre pas.
   Ex. [SubmitButton.vue](src/components/SubmitButton.vue), [SaveButton.vue](src/components/SaveButton.vue).

Les contrats d'API vivent dans [src/models/](src/models/) : de simples interfaces TypeScript, une
responsabilité chacune (`InputField`, `Validatable`, `Toggle`, `CrudStore`, …).

---

## Les démos

Le câblage déclaratif à plat vit dans les vues ([src/views/](src/views/)) ; `App.vue` ne fait que
la coque (top-bar, thème, garde de session).

- **`/signup`** — [SignupView.vue](src/views/SignupView.vue) : un formulaire d'inscription. Champs
  → composants de validation (username, mot de passe, confirmation) → bouton de soumission, chaînés
  entièrement via le registre.
- **`/crud`** — [CrudView.vue](src/views/CrudView.vue) : une table d'utilisateurs avec recherche,
  tri, pagination, sélection et un formulaire d'ajout/édition en modale. Le store, les transforms
  (filtre/tri/page) et les validateurs sont tous des frères logiques sans DOM. Route **privée**,
  protégée par la garde de session.
- **`/`** — [HomeView.vue](src/views/HomeView.vue).

Session (`AuthState`) et thème sombre (`ThemeState`) sont eux aussi des composants-frères
logiques : leur état est lu à travers le registre réactif, ce qui repeint le thème naive-ui et
éjecte un utilisateur déconnecté d'une page privée, automatiquement.

---

## Stack

**Vue 3.5** · **Vite 8** · **TypeScript 6** · **vue-router 5** · **naive-ui 2** · **Pinia** (installé,
non utilisé). Tests : **Vitest** + **Playwright**. Lint/format : **oxlint** + **eslint** + **oxfmt**.

## Commandes

```bash
npm install

npm run dev          # serveur de dev Vite
npm run build        # type-check + build
npm run type-check   # vue-tsc --build
npm run test:unit    # Vitest
npm run test:e2e     # Playwright (npx playwright install au premier lancement)
npm run lint         # oxlint --fix puis eslint --fix
npm run format       # oxfmt src/
```

---

## À savoir

- **naive-ui** : ses primitives (`n-card`, `n-space`…) ne servent que d'habillage présentationnel
  autour des composants-frères VECS, qui restent plats et ne se contiennent jamais.
- **Modale CRUD** : on utilise un overlay `v-show` maison plutôt que `<n-modal>`. Le montage
  paresseux de `n-modal` désenregistrerait les clés des champs ; l'overlay garde les frères montés
  pour que les validateurs et l'`EditLoader` continuent de résoudre.
- [src/__tests__/App.spec.ts](src/__tests__/App.spec.ts) est un test hérité qui cible un champ
  inexistant — à mettre à jour avant de s'y fier.
