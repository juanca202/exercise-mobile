# Implementation Plan: Pantalla de autenticación (US-001)

**Branch**: `002-pantalla-autenticacion` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-pantalla-autenticacion/spec.md`

## Summary

Implementar la pantalla de login (usuario/contraseña), sesión **mock** en cliente, mecanismo de **rutas protegidas** con redirecciones login ↔ resumen, y cierre de sesión con destino único, alineado a US-001 (**BR-01**–**BR-06**, **SC-01**–**SC-04**). Enfoque técnico: feature `src/features/auth/` con Zustand + persistencia local, cookie sincronizada para `proxy.ts` (Next 16), UI con Base UI/Tailwind según Figma nodo `1-3167` y `DESIGN.md`. Sin integración real a `POST /api/token` ni `GET /api/settings` en esta entrega.

## Technical Context

**Language/Version**: TypeScript strict, Node.js 20+  
**Primary Dependencies**: Next.js 16.2, React 19, Zustand 5, Base UI, Tailwind CSS v4  
**Storage**: `localStorage` (`auth:demo:v1`) + cookie `demo-auth-session` (demo); sin backend  
**Testing**: Vitest + Testing Library + jsdom (`npm run test:run`)  
**Target Platform**: Web responsive (mobile-first demo bancaria)  
**Project Type**: Next.js App Router single-page application under `src/`  
**Performance Goals**: Login → resumen perceptible en < 1 min (MO-002); redirects sin flash prolongado de contenido protegido  
**Constraints**: Mock auth only (**FR-006**); UI en español; App Router exclusivo (ADR-001)  
**Scale/Scope**: 1 pantalla login, 1 ruta protegida demo (`/`), 2+ puntos de logout, extensible catálogo de rutas

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Reference: `.specify/memory/constitution.md` (v1.0.0). All items MUST pass or be listed in _Complexity Tracking_.

| Gate               | Requirement                                                                | Status                                  |
| ------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| Decision hierarchy | Plan aligns with MEMORY.md, Accepted ADRs, and spec/user-story BR-SC       | ✅ ADR-001–006; US-001 BR/SC mapeados   |
| Routing            | App Router only under `src/app/`; no `pages/`                              | ✅ `src/app/login`, `src/app/page.tsx`  |
| Structure          | Feature code under `src/features/<feature>/`; shared code in `src/shared/` | ✅ `src/features/auth/`                 |
| Spec traceability  | User stories prioritized; BR/SC aligned or deviations documented           | ✅ P1 login + guard; P2 redirect/logout |
| Stack              | Next 16, React 19, Tailwind, Base UI, Zustand per ADRs                     | ✅ Sin deps extra                       |
| Scope              | Mocks/demo boundaries respected; no production IdP/API unless spec says so | ✅ Contratos HTTP solo referencia       |
| UI                 | Figma/DESIGN.md referenced when applicable                                 | ✅ Figma 1-3167 + DESIGN.md             |
| Quality            | `lint`, `test:run`, `build` planned; tests co-located if required by spec  | ✅ TDD en store/lib auth                |
| Simplicity         | No extra dependencies/layers without Complexity Tracking entry             | ✅                                      |

**Post–Phase 1 re-check**: ✅ Sin violaciones; diseño mock + proxy + Zustand es la opción mínima que cumple SC-01 en navegación directa.

## Project Structure

### Documentation (this feature)

```text
specs/001-pantalla-autenticacion/
├── plan.md              # This file
├── research.md          # Phase 0 — decisiones técnicas
├── data-model.md        # Phase 1 — entidades de sesión mock
├── quickstart.md        # Phase 1 — verificación manual y gates
├── contracts/           # Phase 1 — mock auth, route guard, UI, HTTP ref
└── tasks.md             # Phase 2 (/speckit-tasks — pendiente)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                 # lang="es"; shell global
│   ├── page.tsx                   # Ruta protegida / — stub resumen (US-002)
│   ├── login/
│   │   └── page.tsx               # Composición LoginPage (Client)
│   └── globals.css
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── LoginPage.tsx
│       │   ├── AuthenticatedShell.tsx   # layout zona autenticada + logout
│       │   └── LogoutButton.tsx
│       ├── lib/
│       │   ├── auth-store.ts
│       │   ├── auth-store.test.ts
│       │   ├── auth-service.mock.ts
│       │   ├── auth-service.mock.test.ts
│       │   ├── protected-routes.ts
│       │   ├── session-cookie.ts
│       │   └── types.ts
│       └── index.ts               # API pública de la feature
├── components/
│   └── ui/                        # Button, Input, Field (Base UI wrappers)
├── shared/
│   └── constants/
│       └── routes.ts              # LOGIN_PATH, HOME_PATH
└── lib/                           # Infra transversal si crece

proxy.ts                           # Guard edge: rutas protegidas + /login
```

**Structure Decision**: Arquitectura por features (ADR-004). Lógica de autenticación mock y store en `src/features/auth/`; `src/app/` solo enruta y compone. Catálogo de rutas protegidas centralizado para **BR-04**. Resumen post-login reutiliza `/` como stub hasta US-002.

## Complexity Tracking

> No violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| —         | —          | —                                    |

## Phase 0 — Research (complete)

Ver [research.md](./research.md). Decisiones clave:

1. **proxy.ts** + cookie + catálogo `protected-routes.ts`
2. **Zustand persist** para sesión cliente
3. Validación mock: credenciales no vacías
4. Rutas: `/login` pública, `/` protegida
5. UI Base UI + Tailwind + Figma 1-3167
6. Sin API HTTP en US-001

## Phase 1 — Design (complete)

| Artifact   | Path                             |
| ---------- | -------------------------------- |
| Data model | [data-model.md](./data-model.md) |
| Contracts  | [contracts/](./contracts/)       |
| Quickstart | [quickstart.md](./quickstart.md) |

### Implementation sequence (for `/speckit-tasks`)

1. **P1 — Core auth mock**: types, `auth-service.mock`, `auth-store`, tests RED→GREEN.
2. **P1 — Route guard**: `protected-routes`, `session-cookie`, `proxy.ts`, tests.
3. **P1 — Login UI**: componentes UI base, `LoginForm`/`LoginPage`, Figma alignment, `/login` route.
4. **P1 — Protected home stub**: `/` con `AuthenticatedShell`, redirect SC-01.
5. **P2 — Logout & redirects**: `LogoutButton` en ≥2 puntos, SC-03/SC-04, metadata `lang="es"`.
6. **Gate**: `lint`, `test:run`, `build`; revisión visual vs Figma (MO-004).

### Traceability matrix

| Spec           | Implementation focus             |
| -------------- | -------------------------------- |
| FR-001 / BR-01 | LoginForm validación required    |
| FR-002 / BR-02 | login → `/`, store authenticated |
| FR-003 / BR-03 | proxy/page guard `/login` → `/`  |
| FR-004 / BR-04 | `protected-routes.ts` + proxy    |
| FR-005 / BR-05 | logout → `/login` constante      |
| FR-006 / BR-06 | mock service; no JWT backend     |
| FR-007         | ui-login-screen contract + Figma |

## Phase 2 — Tasks

Generado por **`/speckit-tasks`** (no incluido en este comando).
