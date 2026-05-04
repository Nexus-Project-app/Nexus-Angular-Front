# Nexus - Frontend Angular

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Nexus-Project-app_Nexus-Angular-Front&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Nexus-Project-app_Nexus-Angular-Front)

Nexus, c'est le frontend d'une plateforme sociale pensée pour connecter des gens autour de leurs centres d'intérêt. Ce dépôt contient uniquement la partie Angular.

---

## Stack technique

| Quoi | Version |
|---|---|
| Angular | 21 |
| TypeScript | ~5.9 |
| SSR (Server-Side Rendering) | @angular/ssr + Express 5 |
| CSS | Tailwind CSS 4 |

---

## Architecture

On suit l'architecture **Clean-Archi** avec des couches bien séparées à l'intérieur de chaque feature :

```
src/app/features/<feature>/
├── domain/          → entités, modèles métier purs (aucune dépendance Angular)
├── application/     → cas d'usage, ports (interfaces), DTOs
├── infrastructure/  → implémentations concrètes (services HTTP, mocks)
└── presentation/    → composants, pages, templates
```

La règle d'or : `domain` ne dépend de rien. `application` dépend de `domain`. `infrastructure` implémente les ports de `application`. `presentation` consomme `application`.

---

## Lancer le projet en local

### Prérequis

- Node.js 20+
- npm 11+

### Installation

```bash
npm install
```

### Démarrer le serveur de développement

```bash
npm start
```

L'application sera disponible sur [http://localhost:4200](http://localhost:4200). Le rechargement automatique est activé.

### Lancer le build de production

```bash
npm run build
```

Les artefacts sont générés dans `dist/`. Pour démarrer le serveur SSR en mode production :

```bash
npm run serve:ssr:projet
```

---

## Tests

```bash
npm test
```

Les tests tournent avec Vitest. Ils couvrent la validation de formulaire, les cas d'erreur, la navigation post-connexion et les comportements d'état local.

---

## Qualité du code

Ce projet est analysé en continu par SonarCloud et Snyk. L'objectif est de garder zéro nouveau problème bloquant ou critique sur le code modifié.

Si tu touches un fichier, tu es responsable de sa qualité SonarLint avant de pousser.

---

## Conventions Git

- Les branches suivent le format `Feature/<nom-explicite>`
- On ne pousse jamais directement sur `main`
- Les commits suivent [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat:`, `fix:`, `chore:`...)
- Les PRs ciblent `main` et doivent passer en revue avant merge

*Projet réalisé dans le cadre de la formation DIIAGE - Promotion D2.*

