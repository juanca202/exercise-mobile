# Implementation Plan: Transferencia entre cuentas propias

**Branch**: `004-own-account-transfer` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-own-account-transfer/spec.md`

**Note**: Filled by `/speckit-plan`. Phase 2 (`tasks.md`) via `/speckit-tasks`.

## Summary

Implementar el flujo de **transferencia entre cuentas propias** para usuarios autenticados (**US-001**), integrado con resumen y navegación (**US-002**): cuatro pasos (tipo → ingreso → revisión → comprobante), validaciones **BR-06**–**BR-09**, comisión $0.00, mock `POST /api/transfer` con comprobante, y UI alineada a Figma. Estado de borrador en Zustand; rutas bajo `src/app/transfer/`; feature `src/features/transfer/`. Sustituir placeholder `TRANSFER_PATH` → `/transfer`.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 20+

**Primary Dependencies**: Next.js 16.2.6, React 19.2.4, Zustand 5.x, @base-ui/react 1.5.x, Tailwind CSS v4

**Storage**: Mock JSON en Route Handlers; borrador y comprobante en Zustand (cliente); saldos actualizables en memoria en handler POST (demo)

**Testing**: Vitest 4 + Testing Library + jsdom; tests co-located en `src/features/transfer/`

**Target Platform**: Navegador web (App Router, mobile-first según Figma banca demo)

**Project Type**: Aplicación web Next.js (single project, feature-based [ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md))

**Performance Goals**: Flujo completo < 3 minutos (**SC-002**); validaciones cliente síncronas antes de revisión

**Constraints**: Demo/mock (**BR-15**); montos USD $5–$2000 inclusive; español en UI; sin flujo «A terceros»; lógica fuera de `page.tsx`; cobertura ≥ 80 % en `lib/`, `store/` y componentes con lógica (constitution § III); tokens Tailwind según `DESIGN.md` / `.agents/MEMORY.md`

**Scale/Scope**: 4 rutas de flujo + 1 API POST, 1 feature `transfer`, cambios en `routes.ts`, `proxy.ts`, `Shortcuts`, `Navbar`

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

**Post-design re-check (Phase 1)**: Gates en verde. Reutilización de `GET /api/accounts` y formateo de landing evita duplicar mocks. `POST /api/transfer` es la capa HTTP mínima para **BR-11**–**BR-12** y **SC-012**.

## Project Structure

### Documentation (this feature)

```text
specs/004-own-account-transfer/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── api-transfer-route.md
│   ├── transfer-routes.md
│   ├── proxy-routes-extension.md
│   └── transfer-screens-ui.md
└── tasks.md             # Phase 2 — /speckit-tasks
```

### Source Code (repository root)

```text
proxy.ts                                    # Matcher + prefijo /transfer protegido

src/
├── app/
│   ├── transfer/
│   │   ├── layout.tsx                      # Navbar activeItem=transfer
│   │   ├── page.tsx                        # TransferTypeScreen
│   │   └── own/
│   │       ├── page.tsx                    # TransferEnterScreen
│   │       ├── review/
│   │       │   └── page.tsx                # TransferReviewScreen
│   │       └── receipt/
│   │           └── page.tsx                # TransferReceiptScreen
│   └── api/
│       └── transfer/
│           └── route.ts                    # POST mock TransferRequest/Receipt
├── features/
│   ├── auth/                               # Extender protected-routes (US-001)
│   ├── landing/                            # Shortcuts → TRANSFER_PATH real
│   └── transfer/
│       ├── components/
│       │   ├── TransferTypeScreen.tsx
│       │   ├── TransferEnterScreen.tsx
│       │   ├── TransferReviewScreen.tsx
│       │   ├── TransferReceiptScreen.tsx
│       │   ├── AccountPickerCard.tsx       # Desde / Hacia
│       │   └── SwapAccountsButton.tsx
│       ├── lib/
│       │   ├── types.ts
│       │   ├── validate-transfer-draft.ts
│       │   ├── build-transfer-request.ts
│       │   ├── execute-transfer.ts
│       │   └── map-receipt.ts
│       ├── store/
│       │   └── transfer-store.ts
│       └── testing/
│           └── transfer-object-mother.ts
├── components/ui/                          # Button, Input, Field, Navbar, Error
└── shared/
    └── routes.ts                           # TRANSFER_* paths
```

**Structure Decision**: Nuevo feature `transfer` ([ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md)). Páginas en `src/app/transfer/**` solo componen screens del feature. Validación en `lib/` testeable (TDD). Cuentas vía fetch a `/api/accounts` existente; tipos `Account` importados desde landing o movidos a `src/shared/types` si se refactoriza en implementación.

## Complexity Tracking

_Sin violaciones._

## Phase Summary

### Phase 0 — Research

Completado en [research.md](./research.md): rutas anidadas, Zustand draft/receipt, `POST /api/transfer`, integración navbar/atajos, Figma, share API, filtro cuentas saving/checking.

### Phase 1 — Design & Contracts

| Artefacto | Contenido |
| --------- | --------- |
| [data-model.md](./data-model.md) | TransferFormDraft, TransferReceipt, validaciones BR-06–BR-09 |
| [contracts/](./contracts/) | API POST, rutas, proxy, contrato UI por pantalla |
| [quickstart.md](./quickstart.md) | Smoke tests y checklist SC-01–SC-12 |

### Phase 2 — Tasks

Completado: [tasks.md](./tasks.md) — 52 tareas TDD (US1–US5, foundational, polish).

## Traceability (spec → implementación)

| User Story | Rutas / módulos principales |
| ---------- | --------------------------- |
| US1 Selección tipo | `/transfer`, `TransferTypeScreen` |
| US2 Ingreso | `/transfer/own`, `validate-transfer-draft`, `AccountPickerCard` |
| US3 Revisión | `/transfer/own/review`, `execute-transfer` |
| US4 Comprobante | `/transfer/own/receipt`, share |
| US5 Navegación | `routes.ts`, `Shortcuts`, `Navbar`, `proxy.ts` |

## Dependencies

- **US-001**: sesión y redirect visitantes
- **US-002**: `GET /api/accounts`, atajo transferencias, `Navbar`
- **docs/technical-docs/api-transfer.md**: shape de petición
- **Figma**: [Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD) — Paso 1 [36:1459](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1459&m=dev), Paso 2 [36:1794](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1794&m=dev), Paso 3 [1:2920](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2920&m=dev), Paso 4 [1:2984](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2984&m=dev), modal [1:3077](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3077&m=dev)

## Implementation notes (for `/speckit-tasks`)

1. Actualizar `TRANSFER_PATH` y enlaces en landing/navbar antes o con US5.
2. TDD: `validate-transfer-draft.test.ts` cubre límites $5/$2000, misma cuenta, saldo, decimales.
3. Guard de receipt: sin `lastReceipt` → redirect `/transfer`.
4. «A terceros»: aviso inline (no ruta `/transfer/own`).
5. Extraer `formatCurrency` / `formatAccountNumber` a `src/shared/lib/` si landing y transfer importan ambos (evitar acoplamiento feature→feature).
