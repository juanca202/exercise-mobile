# Implementation Plan: Landing — resumen de cuentas y atajos

**Branch**: `003-landing-account-summary` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-landing-account-summary/spec.md`

**Note**: Filled by `/speckit-plan`. Phase 2 (`tasks.md`) via `/speckit-tasks`.

## Summary

Implementar **US-002**: sustituir el placeholder de `HomeScreen` por una landing autenticada en `/` con secciones de **cuentas**, **últimos movimientos** y **atajos** (Transferencias, Servicios, Pagos QR), alineada con Figma frame **Home** [36:1699](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1699&m=dev) y `DESIGN.md`. Datos demo vía Route Handlers `GET /api/accounts` y `GET /api/activity` ([contracts](./contracts/)) alineados con `docs/technical-docs/`. Presentación: enmascaramiento últimos 4 dígitos, importes formato `$` anglosajón, fechas relativas en español, errores por sección con «Reintentar», atajos sin ruta → `/demo-unavailable`. Protección de rutas existente (**US-001**, `proxy.ts` [ADR-008](../../docs/adr/ADR-008-proxy-instead-of-middleware.md)).

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 20+

**Primary Dependencies**: Next.js 16.2.6, React 19.2.4, Zustand 5.x (estado de carga por sección), @base-ui/react 1.5.x, Tailwind CSS v4

**Storage**: JSON mock estático en Route Handlers; sin base de datos

**Testing**: Vitest 4 + Testing Library + jsdom; tests co-located en `src/features/landing/`

**Target Platform**: Navegador web (App Router, mobile-first según Figma banca demo)

**Project Type**: Aplicación web Next.js (single project, feature-based [ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md))

**Performance Goals**: Carga inicial del resumen perceptible en < 2 s en local; fetch de cuentas y actividad en paralelo

**Constraints**: Mock/demo (**FR-008**, **BR-007**); UI etiquetas en español (**FR-006**); importes `$` formato en-US (**FR-013**); enmascaramiento últimos 4 dígitos (**FR-012**); errores por sección (**FR-014**); lógica fuera de `page.tsx`; cobertura ≥ 80 % en `lib/`, `store/` y componentes con lógica de negocio de landing (constitution § III)

**Scale/Scope**: 1 ruta principal (`/`), 2 API routes mock, 1 ruta placeholder compartida, feature `landing`, dependencia de auth (**US-001**)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Reference: `.specify/memory/constitution.md` (v1.0.0). All items MUST pass or be listed in _Complexity Tracking_.

| Gate               | Requirement                                                                | Status |
| ------------------ | -------------------------------------------------------------------------- | ------ |
| Decision hierarchy | Plan aligns with MEMORY.md, Accepted ADRs, and spec/user-story BR-SC       | ✅     |
| Routing            | App Router only under `src/app/`; no `pages/`                              | ✅     |
| Structure          | Feature code under `src/features/<feature>/`; shared code in `src/shared/` | ✅     |
| Spec traceability  | User stories prioritized; BR/SC aligned or deviations documented           | ✅     |
| Stack              | Next 16, React 19, Tailwind, Base UI, Zustand per ADRs                     | ✅     |
| Scope              | Mocks/demo boundaries respected; no production core banking                  | ✅     |
| UI                 | Figma/DESIGN.md referenced                                                 | ✅     |
| Quality            | `lint`, `test:run`, `build` planned; tests co-located                      | ✅     |
| Simplicity         | No extra dependencies/layers without Complexity Tracking entry             | ✅     |

**Post-design re-check (Phase 1)**: Gates en verde. Route Handlers mock son la capa HTTP mínima para alinear contratos técnicos sin backend real; formateo en `lib/` mantiene páginas delgadas y tests unitarios deterministas.

## Project Structure

### Documentation (this feature)

```text
specs/003-landing-account-summary/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md          # Phase 2 — /speckit-tasks
```

### Source Code (repository root)

```text
proxy.ts                                    # Extender matcher: /, /login, /demo-unavailable

src/
├── app/
│   ├── page.tsx                            # Composición LandingScreen (reemplaza HomeScreen)
│   ├── demo-unavailable/
│   │   └── page.tsx                        # Placeholder FR-009 (atajos sin ruta)
│   # Sin src/app/transfer/ en esta feature — atajos Transferir → /demo-unavailable
│   └── api/
│       ├── accounts/
│       │   └── route.ts                    # GET mock Account[]
│       └── activity/
│           └── route.ts                    # GET mock Movement[]
├── features/
│   ├── auth/                               # US-001 (sin cambios de dominio salvo LogoutButton en layout landing)
│   └── landing/
│       ├── components/
│       │   ├── LandingScreen.tsx           # Layout Figma; orquesta secciones
│       │   ├── AccountsCarousel.tsx      # Carrusel horizontal de tarjetas (FR-015)
│       │   ├── AccountCard.tsx           # Tarjeta individual dentro del carrusel
│       │   ├── MovementsList.tsx
│       │   └── Shortcuts.tsx
│       ├── lib/
│       │   ├── types.ts                    # Account, Movement
│       │   ├── format-account-number.ts
│       │   ├── format-currency.ts
│       │   ├── format-relative-date.ts
│       │   ├── fetch-accounts.ts
│       │   ├── fetch-activity.ts
│       │   └── mock-data.ts                # Dataset demo (≥2 cuentas, ≥3 movimientos)
│       ├── store/
│       │   └── landing-data-store.ts       # loading/error/data por sección; retry
│       └── testing/
│           └── landing-object-mother.ts
├── components/ui/
│   ├── Button.tsx, Field.tsx, Input.tsx    # Existentes (auth)
│   ├── Error.tsx                           # Compartido: message + onRetry (FR-014, FR-020)
│   └── Navbar.tsx                          # Compartido: barra inferior (FR-017–FR-019)
└── shared/
    └── routes.ts                           # HOME, LOGIN, DEMO_UNAVAILABLE, TRANSFER, …
```

**Structure Decision**: Nuevo feature `landing` ([ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md)). `src/app/page.tsx` solo importa `LandingScreen`. APIs mock en `src/app/api/*` cumplen contratos de `docs/technical-docs/` sin nucleo bancario real. Placeholder compartido en `/demo-unavailable` para **FR-009** y transferencias no implementadas (**clarificación 2026-06-01**).

## Complexity Tracking

_Sin violaciones._

## Phase Summary

### Phase 0 — Research

Ver [research.md](./research.md): Route Handlers mock, store por sección, formateo, placeholder único, extensión proxy.

### Phase 1 — Design

- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)

### Phase 2 — Tasks

Completado: [tasks.md](./tasks.md) (generado con `/speckit-tasks`, 47 tareas T001–T047).

## Traceability Matrix

| Spec / US-002 | Implementación planificada |
| ------------- | -------------------------- |
| **FR-001**, **FR-002**, **FR-011**, **FR-015**, **FR-016**, **SC-01** | `AccountsCarousel` (chips + carrusel) + `AccountCard` + mock ≥2 cuentas |
| **FR-003**, **SC-02** | `MovementsList` + fechas relativas + ≥3 movimientos |
| **FR-004**, **FR-005**, **FR-017**–**FR-019**, **SC-03** | `Shortcuts` (landing) + `Navbar` (shared UI) + rutas en `shared/routes.ts` |
| **FR-006** | Copy UI en español |
| **FR-007**, **SC-04** | `proxy.ts` + sesión US-001 |
| **FR-008**, **BR-07** | Mock estático en API routes |
| **FR-009**, **BR-06** | `/demo-unavailable` |
| **FR-010** | `LandingScreen` según Figma 36:1699 (Home) |
| **FR-012** | `format-account-number.ts` |
| **FR-013** | `format-currency.ts` (`en-US`, `$`) |
| **FR-014**, **FR-020** | `Error` (shared UI, `message` + `onRetry`) + `landing-data-store` retry por sección |

## Quality Gate (pre-merge)

```bash
npm run lint
npm run test:run
npm run build
```

Cobertura ≥ 80 % en `src/features/landing/lib/`, `src/features/landing/store/` y componentes con lógica (`AccountsCarousel`, `MovementsList`, etc.) — constitution § III.
