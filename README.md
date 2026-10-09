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
Cloudflare  ◄─── CDN, protection DDoS, SSL, masquage IP
  │
  ▼
Oracle Cloud (Ubuntu)
  │
  Nginx ─── Reverse proxy vers les conteneurs Docker
  │         ├── mael-llado.com        → conteneur front  (build Vite servi par Nginx)
  │         ├── mael-llado.com/api    → conteneur back   (Node.js)
  │         └── admin.mael-llado.com  → conteneur admin  (build Vite servi par Nginx)  ◄── ce repo
  │
  └── conteneur db ─── PostgreSQL 17, données dans un volume Docker
```

> Le client ne communique jamais directement avec le serveur Oracle.
> Cloudflare intercepte chaque requête et la relaie, ce qui masque l'IP réelle du serveur.

---

## Présentation

Interface **React 19** privée, écrite en **TypeScript** (mode `strict`), qui permet de modifier tout le contenu affiché sur le portfolio public : profil, sections, parcours, compétences, projets, liens de contact.

Chaque champ se modifie directement en cliquant dessus. L'accès passe par une connexion en deux étapes ; sans session valide, toutes les pages redirigent vers `/login`.

| Route       | Contenu géré                                        |
| ----------- | --------------------------------------------------- |
| `/login`    | Connexion (mot de passe, puis code reçu par e-mail) |
| `/profil`   | Présentation du hero                                |
| `/sections` | Blocs de texte libres                               |
| `/projects` | Projets, leurs étiquettes et leur stack technique   |
| `/timeline` | Étapes du parcours                                  |
| `/socials`  | Liens de contact                                    |
| `/skills`   | Catégories et compétences                           |
| `/briefs`   | Bloc « En bref »                                    |

---

## Stack technique

| Catégorie        | Technologie                 | Version |
| ---------------- | --------------------------- | ------- |
| Langage          | TypeScript (strict)         | 6       |
| Framework UI     | React                       | 19      |
| Bundler          | Vite                        | 8       |
| Routing          | React Router DOM            | 7       |
| CSS              | Sass (SCSS)                 | 1.103   |
| Linting          | ESLint + typescript-eslint  | 10      |
| Conteneurisation | Docker (build Vite → Nginx) | —       |

---

## Architecture du projet

```
Resume-admin/
├── public/                     # Fichiers statiques (favicon)
├── src/
│   ├── main.tsx                # Point d'entrée React
│   ├── App.tsx                 # Routes, toutes protégées sauf /login
│   ├── context/
│   │   ├── authContext.ts      # Type du contexte + hook useAuth
│   │   └── AuthProvider.tsx    # État de la session, connexion, déconnexion
│   ├── hooks/
│   │   ├── useApi.ts           # Client HTTP typé (get, post, patch, del)
│   │   └── useResource.ts      # Charge une ressource et permet de la recharger
│   ├── components/
│   │   ├── ProtectedRoute.tsx  # Redirige vers /login sans session
│   │   ├── AdminLayout.tsx     # En-tête + menu latéral
│   │   ├── Login.tsx           # Formulaire en deux étapes
│   │   ├── EditableField.tsx   # Champ modifiable en ligne
│   │   ├── CreateField.tsx     # Formulaire de création
│   │   └── DeleteField.tsx     # Bouton de suppression avec confirmation
│   ├── pages/                  # Une page par ressource
│   ├── models/                 # Types des données et des routes de l'API
│   ├── lib/                    # Petites fonctions (slugify, tri, erreurs)
│   └── styles/                 # SCSS : abstracts/, base/, components/, pages/
├── nginx.conf                  # Configuration du Nginx embarqué dans l'image Docker
├── Dockerfile
├── tsconfig.json
└── vite.config.ts
```

### Trois composants pour tout gérer

Toutes les pages sont construites avec les mêmes briques :

```tsx
const { data: projects, loading, error, reload } = useResource("/projects");

<CreateField route="/projects" currentOrder={maxOrder} onSuccess={reload} withSlug>
  <input name="title" type="text" />
</CreateField>

<EditableField item={project} fieldKey="title" route={`/projects/${project.id}`} />

<DeleteButton route={`/projects/${project.id}`} onSuccess={reload} />
```

### Ce que TypeScript vérifie

Les modèles de `src/models/` décrivent les données et les routes de l'API. Les erreurs courantes sont attrapées à la compilation :

```tsx
useResource("/projects"); //       → data: Project[] | null
useResource("/projets"); //        ✗ la route n'existe pas

<EditableField item={project} fieldKey="title" />; //  ✓
<EditableField item={project} fieldKey="titel" />; //  ✗ ce champ n'existe pas sur Project
<EditableField item={project} fieldKey="order" />; //  ✗ ce n'est pas un champ texte
```

---

## Authentification & sécurité

### Flux de connexion

```
Page /login
  │  e-mail + mot de passe
  ▼
POST /api/auth/login
  │  → l'API envoie un code à 6 chiffres par e-mail
  ▼
Saisie du code
  │
POST /api/auth/verify-otp
  │  → l'API pose un cookie de session HttpOnly
  ▼
Requêtes vers /api/admin/*
     le navigateur joint le cookie (credentials: "include")
```

Le jeton de session n'est **jamais manipulé par le JavaScript** de l'interface : il vit dans un cookie `HttpOnly` posé par l'API. Le front ne stocke rien dans `localStorage` et n'envoie aucun header `Authorization`.

### Vérification de la session

- Au chargement, `AuthProvider` appelle `GET /api/auth/me` pour savoir si le cookie est encore valide.
- `ProtectedRoute` redirige vers `/login` si ce n'est pas le cas.
- Si une requête reçoit une réponse `401` (session expirée en cours d'utilisation), `useApi` déconnecte et renvoie à la page de connexion.

### Validation

Les données envoyées sont validées par l'API. En cas d'erreur, le message renvoyé s'affiche sous le champ concerné :

```
Données invalides — visibility : Option invalide : une valeur parmi "Public"|"Privé" attendue
```

---

## Routes API consommées

| Méthode  | Route                       | Action                                  |
| -------- | --------------------------- | --------------------------------------- |
| `POST`   | `/api/auth/login`           | Vérifie les identifiants, envoie le code |
| `POST`   | `/api/auth/verify-otp`      | Vérifie le code, ouvre la session       |
| `POST`   | `/api/auth/logout`          | Ferme la session                        |
| `GET`    | `/api/auth/me`              | Vérifie la session                      |
| `GET`    | `/api/admin/:ressource`     | Lister                                  |
| `POST`   | `/api/admin/:ressource`     | Créer                                   |
| `PATCH`  | `/api/admin/:ressource/:id` | Modifier                                |
| `DELETE` | `/api/admin/:ressource/:id` | Supprimer                               |

Ressources : `profil`, `sections`, `timeline`, `briefs`, `socials`, `skill-categories`, `skill-items`, `projects`, `project-tags`, `project-tech-stack`.

---

## Styles & conventions CSS

Méthodologie **BEM** sur l'ensemble des fichiers SCSS, sans framework CSS externe.

```
src/styles/
├── main.scss            # Point d'entrée, importe tout le reste
├── abstracts/           # Variables
├── base/                # Reset, utilitaires
├── components/          # Layout, formulaires, champ modifiable, connexion
└── pages/               # Pages d'administration
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine :

```dotenv
VITE_API_URL=https://mael-llado.com
```

| Variable       | Description                                             |
| -------------- | ------------------------------------------------------- |
| `VITE_API_URL` | URL de base du back, **sans** `/api` (le code l'ajoute) |

> La valeur est figée dans le bundle au moment du build.

---

## Installation & développement

```bash
git clone https://github.com/Mayel-0/Resume-admin.git
cd Resume-admin
npm install

# Créer le fichier .env (voir ci-dessus), puis :
npm run dev
```

Le serveur de développement écoute sur le port `5174`.

> Le cookie de session est limité au domaine `.mael-llado.com` : la connexion complète ne fonctionne donc que sur le site en ligne. En local, l'interface se lance mais reste sur la page de connexion.

## Scripts disponibles

| Commande            | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Serveur de développement Vite avec HMR       |
| `npm run build`     | Vérification des types, puis build → `dist/` |
| `npm run typecheck` | Vérification des types seule                 |
| `npm run lint`      | Analyse statique ESLint                      |
| `npm run preview`   | Prévisualisation du build de production      |

---

## Déploiement

Le panneau est livré dans une **image Docker** construite en deux étapes : build Vite, puis Nginx qui sert le dossier `dist/`.

```bash
docker build -t resume-admin .
docker run -d -p 127.0.0.1:8081:80 resume-admin
```

Le Nginx embarqué (`nginx.conf`) renvoie `index.html` pour toutes les routes, afin que React Router gère `/login`, `/projects`, etc.

En production, un `docker-compose.yml` lance ce conteneur avec l'API, le site public et la base de données. Le Nginx du serveur relaie `admin.mael-llado.com` vers lui, et `/api` vers le conteneur de l'API.

---

## Auteur

**Maël Llado** — Développeur Full Stack
[mael-llado.com](https://mael-llado.com) · Bordeaux, France
