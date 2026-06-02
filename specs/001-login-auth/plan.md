# Implementation Plan: Pantalla de autenticación

**Branch**: `002-login-auth` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-login-auth/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar el flujo de autenticación mock de **US-001**: pantalla de login (`/login`), resumen protegido como ruta de demostración (`/`), mecanismo de rutas protegidas vía `proxy.ts` ([ADR-008](../../docs/adr/ADR-008-proxy-instead-of-middleware.md)), estado de sesión en Zustand ([ADR-003](../../docs/adr/ADR-003-zustand-state-management.md)) sincronizado con cookie de demo para que el proxy pueda evaluar acceso en navegación directa por URL. UI alineada con Figma y `DESIGN.md` usando Base UI ([ADR-006](../../docs/adr/ADR-006-base-ui-component-library.md)). Sin integración con `/api/token` ni backend real en esta entrega.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 20+

**Primary Dependencies**: Next.js 16.2.6, React 19.2.4, Zustand 5.x, @base-ui/react 1.5.x, Tailwind CSS v4

**Storage**: Cookie de sesión demo (`auth-demo-session`) en cliente; sin persistencia en servidor ni base de datos

**Testing**: Vitest 4 + Testing Library + jsdom; tests co-located en `src/features/auth/`

**Target Platform**: Navegador web (App Router, mobile-first según diseño banca demo)

**Project Type**: Aplicación web Next.js (single project, feature-based)

**Performance Goals**: Redirecciones de auth perceptibles al instante (< 200 ms en entorno local); formulario interactivo sin bloqueos perceptibles

**Constraints**: Mock only (**BR-06**, **FR-008**); proxy.ts obligatorio en lugar de middleware.ts (**ADR-008**); lógica de dominio fuera de `page.tsx` (**ADR-004**); UI en español; cobertura ≥ 80 % en `lib/` y `store/` de auth

**Scale/Scope**: 2 rutas de aplicación principales (`/login`, `/`), 1 feature (`auth`), credenciales demo fijas, placeholder de resumen hasta **US-002**

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Reference: `.specify/memory/constitution.md` (v1.0.0+). All items MUST pass or be listed in _Complexity Tracking_ with justification.

| Gate               | Requirement                                                                | Status |
| ------------------ | -------------------------------------------------------------------------- | ------ |
| Decision hierarchy | Plan aligns with MEMORY.md, Accepted ADRs, and spec/user-story BR-SC       | ✅     |
| Routing            | App Router only under `src/app/`; no `pages/`                              | ✅     |
| Structure          | Feature code under `src/features/<feature>/`; shared code in `src/shared/` | ✅     |
| Spec traceability  | User stories prioritized; BR/SC aligned or deviations documented           | ✅     |
| Stack              | Next 16, React 19, Tailwind, Base UI, Zustand per ADRs                     | ✅     |
| Scope              | Mocks/demo boundaries respected; no production IdP/API unless spec says so | ✅     |
| UI                 | Figma/DESIGN.md referenced when applicable                                 | ✅     |
| Quality            | `lint`, `test:run`, `build` planned; tests co-located if required by spec  | ✅     |
| Simplicity         | No extra dependencies/layers without Complexity Tracking entry             | ✅     |

**Post-design re-check (Phase 1)**: Todos los gates siguen en verde. La cookie + Zustand es la mínima dualidad necesaria para que `proxy.ts` evalúe sesión en peticiones de navegación (**SC-01**) mientras la UI reacciona en cliente; no se añaden dependencias nuevas.

## Project Structure

### Documentation (this feature)

```text
specs/001-login-auth/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
proxy.ts                              # Interceptación de rutas protegidas (ADR-008)

src/
├── app/
│   ├── layout.tsx                    # Layout raíz; provider de auth si aplica
│   ├── page.tsx                      # Resumen protegido (placeholder US-001)
│   ├── login/
│   │   └── page.tsx                  # Composición de LoginScreen
│   └── globals.css
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx         # Formulario usuario/contraseña (Client)
│       │   ├── LoginScreen.tsx       # Layout pantalla login
│       │   └── LogoutButton.tsx      # Cierre de sesión reutilizable
│       ├── lib/
│       │   ├── auth-session.ts       # Lectura/escritura cookie demo
│       │   ├── mock-auth-service.ts  # Validación credenciales mock
│       │   ├── protected-routes.ts   # Catálogo rutas públicas/protegidas
│       │   └── auth-session.test.ts
│       ├── store/
│       │   ├── auth-store.ts         # Zustand: login, logout, hydrate
│       │   └── auth-store.test.ts
│       └── testing/
│           └── auth-object-mother.ts
├── components/
│   └── ui/                           # Wrappers Base UI (Button, Field, Input)
├── lib/
│   └── cookies.ts                    # Helpers genéricos cookie (si no caben en feature)
└── shared/
    └── routes.ts                     # Constantes de rutas (/login, /)
```

**Structure Decision**: Arquitectura por features ([ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md)). `src/app/` solo enruta y compone; toda lógica de autenticación mock vive en `src/features/auth/`. `proxy.ts` en raíz del proyecto (convención Next.js 16, [ADR-008](../../docs/adr/ADR-008-proxy-instead-of-middleware.md)).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

_Sin violaciones. No se requieren entradas._

## Phase Summary

### Phase 0 — Research

Decisiones documentadas en [research.md](./research.md):

- Sesión mock: Zustand + cookie sincronizada
- Protección de rutas: `proxy.ts` con `matcher` y módulo `protected-routes.ts`
- Rutas: `/login` (pública), `/` (protegida, resumen placeholder)
- Credenciales demo centralizadas; mensaje genérico en fallo de login
- Contratos HTTP reales diferidos; shapes de referencia en `contracts/`

### Phase 1 — Design

- Modelo de datos: [data-model.md](./data-model.md)
- Contratos internos y referencia futura: [contracts/](./contracts/)
- Guía de verificación manual: [quickstart.md](./quickstart.md)

### Phase 2 — Tasks

Pendiente de `/speckit-tasks` → `tasks.md`

## Traceability Matrix

| Spec / US-001 | Implementación planificada |
| ------------- | -------------------------- |
| **FR-001**, **FR-002** | `LoginForm` + validación campos obligatorios |
| **FR-003**, **SC-02** | `mock-auth-service` + redirect a `/` tras login |
| **FR-004**, **SC-03** | `proxy.ts` + guard en `/login` redirige autenticados a `/` |
| **FR-005**, **FR-006**, **SC-01** | `proxy.ts` + `protected-routes.ts`; `/` como ruta demo |
| **FR-007**, **SC-04** | `LogoutButton` + `auth-store.logout()` → `/login` |
| **FR-008**, **BR-06** | Sin llamadas a `/api/token`; mocks locales |
| **FR-009** | `LoginScreen` según Figma + `DESIGN.md` |
| **FR-010** | `src/app/page.tsx` placeholder resumen autenticado |

## Quality Gate (pre-merge)

```bash
npm run lint
npm run test:run
npm run build
```

Cobertura de ramas ≥ 80 % en `src/features/auth/lib/` y `src/features/auth/store/` ([constitution](../../.specify/memory/constitution.md) § III).
