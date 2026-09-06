# mael-llado.com — Panneau d'administration

> Interface d'administration du portfolio personnel de **Maël Llado**, développeur Full Stack basé à Bordeaux.
> Accessible à l'adresse : [admin.mael-llado.com](https://admin.mael-llado.com) _(accès restreint)_

Ce dépôt est la **partie administration** d'un projet découpé en trois repos distincts :

| Repo                         | Rôle                        | URL                    |
| ---------------------------- | --------------------------- | ---------------------- |
| Resume-Front                 | Interface utilisateur React | `mael-llado.com`       |
| Resume-Back                  | API REST Node.js / Express  | `mael-llado.com/api`   |
| **Resume-Admin** _(ce repo)_ | Panneau d'administration    | `admin.mael-llado.com` |

### Architecture globale

```
Client
  │
  ▼
Cloudflare  ◄─── CDN, DDoS protection, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse Proxy
  │         ├── mael-llado.com        → Frontend (dist Vite statique)
  │         ├── mael-llado.com/api    → Backend Node.js
  │         └── admin.mael-llado.com  → Panel Admin  ◄── ce repo
  │
  └── PostgreSQL  ◄─── Toutes les données (textes, projets, images, documents)
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur
> (un `ping mael-llado.com` renvoie une IP Cloudflare, pas l'IP Oracle).

---

## Admin — Resume-Admin

### Présentation

Interface React privée permettant de gérer l'intégralité du contenu affiché sur le portfolio public. Elle communique exclusivement avec les **routes admin de l'API** (`POST`, `PATCH`, `DELETE`) protégées par authentification **JWT**.

L'accès est sécurisé par une page de connexion : sans token valide, toutes les routes admin sont bloquées par un `ProtectedRoute`.

---

## Stack technique

| Catégorie    | Technologie            | Version |
| ------------ | ---------------------- | ------- |
| Framework UI | React                  | 19      |
| Bundler      | Vite                   | 8       |
| Routing      | React Router DOM       | 7       |
| Animations   | GSAP + `@gsap/react`   | 3.15    |
| Icônes       | Lucide React           | 1.39    |
| CSS          | Sass (SCSS)            | 1.103   |
| Linting      | ESLint + plugins React | 10      |

> Stack identique au frontend public, à l'exception de **Lenis** (scroll smooth) qui n'est pas inclus ici — l'admin privilégie la fonctionnalité à l'expérience animée.

---

## Architecture du projet

```
Resume-Admin/
├── public/                  # Assets statiques (favicon, etc.)
├── src/
│   ├── main.jsx             # Point d'entrée React + Router
│   ├── context/
│   │   └── AuthContext.jsx  # Contexte global — état d'authentification JWT
│   ├── components/
│   │   └── ProtectedRoute.jsx  # Guard de route — redirige si non authentifié
│   ├── hooks/
│   │   └── useApi.js        # Hook centralisé pour les appels API avec le token JWT
│   ├── pages/               # Pages admin — une par ressource gérée
│   └── components/          # Composants UI par section (formulaires, tableaux, etc.)
├── .env                     # Variables d'environnement (développement)
├── .env.production          # Variables d'environnement (production)
├── vite.config.js
├── eslint.config.js
└── index.html
```

### Logique parent → enfant

Identique au frontend public : chaque **page** orchestre les appels API via les hooks, gère l'état de chargement, et transmet les données en **props** aux composants enfants (formulaires, listes, sections). Aucun composant enfant ne fait d'appel réseau directement.

```
Page admin (ex: ProjectsAdminPage)
  ├── appelle useApi() → requêtes POST / PATCH / DELETE vers l'API
  ├── PageLoader (gère loading / error)
  └── transmet les données en props
        ├── <ProjectsList data={projects} onDelete={handleDelete} />
        ├── <ProjectForm onSubmit={handleCreate} />
        └── <ProjectEditForm data={selected} onSubmit={handleUpdate} />
```

---

## Authentification & sécurité

### Flux de connexion

```
Page Login
  │  saisie identifiants
  ▼
POST /api/admin/login
  │  → renvoie un token JWT signé
  ▼
AuthContext
  │  stocke le token dans l'état global
  ▼
useApi (hook)
  │  injecte automatiquement le token dans chaque requête
  │  Authorization: Bearer <token>
  ▼
Routes protégées de l'API (POST / PATCH / DELETE)
```

### ProtectedRoute

Toutes les pages admin sont encapsulées dans un composant `ProtectedRoute` :

```jsx
// Si aucun token valide → redirection automatique vers /login
<ProtectedRoute>
  <ProjectsAdminPage />
</ProtectedRoute>
```

### Hook `useApi`

Centralise tous les appels HTTP vers l'API en injectant automatiquement le header `Authorization` :

```js
const { data, loading, error } = useApi("/admin/projects");
// → GET https://mael-llado.com/api/admin/projects
//   avec Authorization: Bearer <token>
```

---

## Routes API consommées

Le panel admin utilise exclusivement les **routes protégées** de l'API backend :

| Méthode  | Route                       | Action                                       |
| -------- | --------------------------- | -------------------------------------------- |
| `POST`   | `/api/admin/login`          | Authentification — récupération du token JWT |
| `POST`   | `/api/admin/:ressource`     | Créer un élément (projet, compétence, etc.)  |
| `PATCH`  | `/api/admin/:ressource/:id` | Modifier un élément existant                 |
| `DELETE` | `/api/admin/:ressource/:id` | Supprimer un élément                         |

> Les routes `GET` publiques (`/api/projets`, `/api/skills`, etc.) sont également consommées
> pour afficher les données existantes avant modification.

---

## Styles & conventions CSS

Méthodologie **BEM** (Block Element Modifier) appliquée sur l'ensemble des fichiers SCSS.

```scss
/* Exemple de nommage BEM */
.admin-form {
} /* Block */
.admin-form__field {
} /* Element */
.admin-form__field--error {
} /* Modifier */
```

Organisation des fichiers — un fichier SCSS dédié par page et par composant :

```
src/
├── pages/
│   ├── LoginPage.scss
│   ├── DashboardPage.scss
│   └── ProjectsAdminPage.scss
└── components/
    ├── ProjectForm.scss
    ├── ProjectsList.scss
    └── ProtectedRoute.scss
```

Compilé via le plugin **Sass** de Vite, sans aucun framework CSS externe.

---

## Variables d'environnement

Créer un fichier `.env` à la racine avant de lancer le projet :

```dotenv
VITE_API_URL=https://mael-llado.com/api
```

| Variable       | Description                  |
| -------------- | ---------------------------- |
| `VITE_API_URL` | URL de base de l'API backend |

> En production, le fichier `.env.production` est utilisé automatiquement par Vite lors du `build`.
> Ne jamais committer ces fichiers — ils sont dans le `.gitignore`.

---

## Installation & développement

```bash
# Cloner le repo
git clone https://github.com/Mayel-0/Resume-admin.git
cd Resume-admin

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# puis renseigner VITE_API_URL

# Lancer le serveur de développement
npm run dev
```

> Le backend (Resume-Back) doit être lancé en parallèle pour que les appels API fonctionnent.

## Scripts disponibles

| Commande          | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Serveur de développement Vite avec HMR  |
| `npm run build`   | Build de production → dossier `dist/`   |
| `npm run preview` | Prévisualisation du build de production |
| `npm run lint`    | Analyse statique ESLint                 |

---

## Déploiement

Le build de production est généré avec Vite et servi **statiquement** par Nginx sur la machine Oracle Cloud, sur le sous-domaine `admin.mael-llado.com`.

```bash
npm run build
# → génère dist/

# Copier dist/ vers le répertoire servi par Nginx
# ex: /var/www/admin.mael-llado.com/html/
```

Nginx est configuré pour servir `dist/index.html` sur toutes les routes (SPA fallback) :

```nginx
server {
    server_name admin.mael-llado.com;

    root /var/www/admin.mael-llado.com/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
