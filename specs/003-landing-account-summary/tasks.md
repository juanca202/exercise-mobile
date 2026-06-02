---
description: "Task list for feature 003-landing-account-summary — Landing resumen de cuentas (US-002)"
---

# Tasks: Landing — resumen de cuentas y atajos

**Input**: Design documents from `/specs/003-landing-account-summary/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Incluidos (TDD obligatorio — constitution § III; cobertura ≥ 80 % en `src/features/landing/lib/` y `store/`). Vitest + Testing Library, co-located `*.test.ts(x)` bajo `src/features/landing/`.

**Organization**: Tareas agrupadas por user story para implementación y prueba independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias entre tareas incompletas)
- **[Story]**: User story de spec.md (US1–US4)
- Rutas exactas en cada descripción

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura del feature `landing`, tipos, datos demo y constantes de rutas

- [X] T001 Create feature folder structure per plan.md: `src/features/landing/{components,lib,store,testing}/`
- [X] T002 [P] Add `Account`, `Movement`, `AccountType` types in `src/features/landing/lib/types.ts` per `specs/003-landing-account-summary/data-model.md`
- [X] T003 [P] Add Object Mother (≥2 accounts, ≥3 movements, edge cases) in `src/features/landing/testing/landing-object-mother.ts`
- [X] T004 [P] Add `DEMO_UNAVAILABLE_PATH`, `TRANSFER_PATH` (alias → `DEMO_UNAVAILABLE_PATH` en esta feature; sin `src/app/transfer/` hasta US de transferencias) and shortcut route constants in `src/shared/routes.ts`
- [X] T005 [P] Add static demo dataset (≥2 accounts, ≥3 movements, credit-card + negative amount) in `src/features/landing/lib/mock-data.ts` aligned with `docs/technical-docs/api-accounts.md` and `api-activity.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Formateo, API mock, store de carga por sección, componente de error, extensión proxy — **DEBE** completarse antes de user stories

**⚠️ CRITICAL**: Ninguna user story puede empezar hasta cerrar este checkpoint

### Tests (RED first)

- [X] T006 [P] Write failing unit tests for last-4-digit masking in `src/features/landing/lib/format-account-number.test.ts` (**FR-012**)
- [X] T007 [P] Write failing unit tests for `$` en-US currency format in `src/features/landing/lib/format-currency.test.ts` (**FR-013**)
- [X] T008 [P] Write failing unit tests for Spanish relative dates in `src/features/landing/lib/format-relative-date.test.ts` (**FR-003**)
- [X] T009 [P] Write failing unit tests for `fetchAccounts()` against mock handler in `src/features/landing/lib/fetch-accounts.test.ts`
- [X] T010 [P] Write failing unit tests for `fetchActivity()` in `src/features/landing/lib/fetch-activity.test.ts`
- [X] T011 [P] Write failing unit tests for per-section load/retry/error in `src/features/landing/store/landing-data-store.test.ts` (**FR-014**)
- [X] T012 [P] Extend failing tests for `/demo-unavailable` as protected in `src/features/auth/lib/protected-routes.test.ts` per `specs/003-landing-account-summary/contracts/proxy-routes-extension.md`

### Implementation (GREEN)

- [X] T013 [P] Implement `formatAccountNumber()` in `src/features/landing/lib/format-account-number.ts`
- [X] T014 [P] Implement `formatCurrency()` with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` in `src/features/landing/lib/format-currency.ts`
- [X] T015 [P] Implement `formatRelativeDate()` in `src/features/landing/lib/format-relative-date.ts`
- [X] T016 [P] Implement `GET` handler returning `mock-data` accounts in `src/app/api/accounts/route.ts` per `specs/003-landing-account-summary/contracts/api-accounts-route.md`
- [X] T017 [P] Implement `GET` handler returning `mock-data` movements in `src/app/api/activity/route.ts` per `specs/003-landing-account-summary/contracts/api-activity-route.md`
- [X] T018 [P] Implement `fetchAccounts()` client in `src/features/landing/lib/fetch-accounts.ts`
- [X] T019 [P] Implement `fetchActivity()` client in `src/features/landing/lib/fetch-activity.ts`
- [X] T020 Implement Zustand `landing-data-store.ts` with independent `accounts`/`activity` slices, `load*`, `retry*` (**FR-014**) in `src/features/landing/store/landing-data-store.ts` (depends on T018, T019)
- [X] T021 [P] Write failing tests for shared `Error` (`message`, `onRetry` on click) in `src/components/ui/Error.test.tsx`
- [X] T022 [P] Implement shared `Error.tsx` with props `message: string`, `onRetry: () => void`, optional `retryLabel` default «Reintentar» in `src/components/ui/Error.tsx` (**FR-014**, **FR-020**)
- [X] T023 Register `/demo-unavailable` as `protected` in `src/features/auth/lib/protected-routes.ts` and extend `proxy.ts` `config.matcher` per contracts (**FR-007**, **US4**)

**Checkpoint**: Formatters, API routes, store y proxy extension listos con tests en verde

---

## Phase 3: User Story 1 — Resumen de cuentas autenticado (Priority: P1) 🎯 MVP

**Goal**: `AccountsCarousel` en `/` con ≥2 tarjetas de cuenta, scroll horizontal, número enmascarado y monto formateado (**FR-001**, **FR-002**, **FR-011**, **FR-015**, **SC-01**)

**Independent Test**: Tras login, `/` muestra carrusel con ≥2 tarjetas (`****` + 4 dígitos, montos `$`); deslizar horizontalmente revela la segunda tarjeta

### Tests for User Story 1

- [X] T024 [P] [US1] Write failing component tests (loading, success, error+retry, empty state, horizontal scroll, chip filters Cuentas/Tarjetas/Todos/Inversiones con mensaje vacío en español cuando no hay cuentas) in `src/features/landing/components/AccountsCarousel.test.tsx`

### Implementation for User Story 1

- [X] T025 [P] [US1] Implement `AccountCard.tsx` (tarjeta: nombre, tipo/número enmascarado, monto, etiquetas Figma) in `src/features/landing/components/AccountCard.tsx`
- [X] T026 [US1] Implement `AccountsCarousel.tsx` (chips, carrusel, `Error` con `message` + `onRetry` del store en error) in `src/features/landing/components/AccountsCarousel.tsx` (**FR-014**, **FR-015**, **FR-016**, **FR-020**)
- [X] T027 [US1] Create `LandingScreen.tsx` shell (layout mobile-first, `LogoutButton`, `AccountsCarousel` only) in `src/features/landing/components/LandingScreen.tsx`
- [X] T028 [US1] Replace `HomeScreen` with `LandingScreen` in `src/app/page.tsx`
- [X] T029 [US1] Trigger `loadAccounts()` on mount from `LandingScreen.tsx` (**FR-011**)

**Checkpoint**: US1 — cuentas visibles en landing autenticada; movimientos/atajos aún ausentes o stub

---

## Phase 4: User Story 2 — Últimos movimientos (Priority: P1)

**Goal**: Sección de movimientos con descripción, fecha relativa e importe con signo (**FR-003**, **SC-02**)

**Independent Test**: En `/`, sección movimientos muestra ≥3 filas con fecha relativa en español e importes con signo

### Tests for User Story 2

- [X] T030 [P] [US2] Write failing component tests (loading, success, error+retry, negative amount display, empty state in Spanish when activity list is empty) in `src/features/landing/components/MovementsList.test.tsx`

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement `MovementsList.tsx` with masked `accountNumber` and shared `Error` (`message`, `onRetry`) in `src/features/landing/components/MovementsList.tsx`
- [X] T032 [US2] Wire `MovementsList` and `loadActivity()` in `src/features/landing/components/LandingScreen.tsx`

**Checkpoint**: US1 + US2 — cuentas y movimientos en landing; atajos pendientes

---

## Phase 5: User Story 3 — Atajos a operaciones frecuentes (Priority: P2)

**Goal**: Atajos en contenido + barra inferior `Navbar` (Inicio, Transferir, Retirar, Pagos, Otros); destinos según rutas/placeholder (**FR-004**, **FR-005**, **FR-009**, **FR-017**–**FR-019**, **SC-03**, **BR-06**)

**Independent Test**: Atajos y `Navbar` visibles; Inicio activo en `/`; Transferir → `/demo-unavailable` (esta feature; sin ruta `/transfer`); Retirar/Pagos/Otros/Servicios/Pagos QR → placeholder en demo

### Tests for User Story 3

- [X] T033 [P] [US3] Write failing component tests for shortcut labels and `href` targets in `src/features/landing/components/Shortcuts.test.tsx`

### Implementation for User Story 3

- [X] T034 [P] [US3] Implement placeholder page in Spanish + volver al inicio in `src/app/demo-unavailable/page.tsx` per `specs/003-landing-account-summary/contracts/demo-unavailable-page.md`
- [X] T035 [P] [US3] Implement `Shortcuts.tsx` (Transferencias, Servicios, Pagos QR per **FR-005**) with all `href` → `DEMO_UNAVAILABLE_PATH` in this feature (`TRANSFER_PATH` equals placeholder until transfer US exists) in `src/features/landing/components/Shortcuts.tsx`
- [X] T036 [US3] Wire `Shortcuts` in `src/features/landing/components/LandingScreen.tsx`
- [X] T037 [P] [US3] Write failing component tests (ítems, ítem activo Inicio en `/`, navegación) in `src/components/ui/Navbar.test.tsx`
- [X] T038 [P] [US3] Implement shared `Navbar.tsx` (5 ítems, `activeItem`, estilos Figma) in `src/components/ui/Navbar.tsx` (**FR-017**, **FR-018**)
- [X] T039 [US3] Wire `Navbar` in `LandingScreen.tsx` with routes per **FR-019** (Transferir/Retirar/Pagos/Otros → `DEMO_UNAVAILABLE_PATH` in demo) in `src/features/landing/components/LandingScreen.tsx`

**Checkpoint**: **SC-03** y **BR-06** verificables; landing con carrusel, movimientos, atajos y `Navbar`

---

## Phase 6: User Story 4 — Acceso solo con sesión válida (Priority: P1)

**Goal**: Resumen y `/demo-unavailable` inaccesibles sin sesión US-001 (**FR-007**, **SC-04**)

**Independent Test**: Incógnito → `/` y `/demo-unavailable` redirigen a `/login` sin filtrar datos

### Tests for User Story 4

- [X] T040 [P] [US4] Add failing proxy/path tests for unauthenticated `/demo-unavailable` in `src/features/auth/lib/protected-routes.test.ts`

### Implementation for User Story 4

- [X] T041 [US4] Verify and finalize `proxy.ts` redirects for `/demo-unavailable` without session in `proxy.ts`
- [X] T042 [US4] Document manual **SC-04** steps in `specs/003-landing-account-summary/quickstart.md` if gaps found during verification

**Checkpoint**: **SC-04** — sin sesión no se consume contenido del resumen

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Figma, quality gate, cobertura y validación US-002

- [X] T043 [P] Align `LandingScreen.tsx`, `AccountsCarousel.tsx` and shared `src/components/ui/Navbar.tsx` with Figma frame Home (node 36:1699) and `DESIGN.md` (**FR-010**)
- [X] T044 Remove or deprecate unused `HomeScreen.tsx` in `src/features/auth/components/HomeScreen.tsx` if fully replaced
- [X] T045 Run quality gate `npm run lint && npm run test:run && npm run build` and fix failures
- [X] T046 [P] Execute manual checklist in `specs/003-landing-account-summary/quickstart.md` (**SC-01**–**SC-04**, **FR-014** optional)
- [X] T047 Verify branch coverage ≥ 80 % in `src/features/landing/lib/`, `src/features/landing/store/` and landing components with business logic (`AccountsCarousel`, `MovementsList`, etc.) per constitution § III

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — **bloquea** US1–US4
- **US1 (Phase 3)**: Tras Phase 2 — MVP landing con cuentas
- **US2 (Phase 4)**: Tras Phase 2; integra en `LandingScreen` tras US1
- **US3 (Phase 5)**: Tras Phase 2; idealmente tras US1 (layout base)
- **US4 (Phase 6)**: T012/T023 en Phase 2 habilitan pruebas; T040–T041 validan integralmente
- **Polish (Phase 7)**: Tras US1–US4 deseadas

### User Story Dependencies

| Story | Prioridad | Depende de | Independiente cuando |
| ----- | --------- | ---------- | -------------------- |
| US1   | P1        | Phase 2    | `/` muestra cuentas mock enmascaradas |
| US2   | P1        | Phase 2, US1 (`LandingScreen`) | Movimientos visibles con fechas relativas |
| US3   | P2        | Phase 2, US1 (layout) | Atajos navegan a destinos acordados |
| US4   | P1        | Phase 2 (proxy), US-001 | Rutas protegidas sin filtrar datos |

### Within Each User Story

1. Tests RED → implementación GREEN → refactor
2. Lib/formatters/API antes de componentes
3. Componentes antes de composición en `LandingScreen`
4. Checkpoint antes de siguiente prioridad

### Parallel Opportunities

- **Phase 1**: T002–T005 en paralelo tras T001
- **Phase 2**: T006–T012 tests en paralelo; T013–T019 implementación en paralelo
- **Phase 3**: T024–T025 en paralelo (tests RED + AccountCard)
- **Phase 4**: T030–T031 en paralelo
- **Phase 5**: T033–T038 en paralelo (tests + placeholder + Shortcuts + Navbar)
- **Phase 7**: T043 y T046 en paralelo

---

## Parallel Example: Foundational

```bash
# Tests RED en paralelo:
Task T006: format-account-number.test.ts
Task T007: format-currency.test.ts
Task T008: format-relative-date.test.ts
Task T009: fetch-accounts.test.ts
Task T010: fetch-activity.test.ts
Task T011: landing-data-store.test.ts

# GREEN en paralelo:
Task T013: format-account-number.ts
Task T014: format-currency.ts
Task T015: format-relative-date.ts
Task T016: api/accounts/route.ts
Task T017: api/activity/route.ts
```

---

## Parallel Example: User Story 1

```bash
Task T024: AccountsCarousel.test.tsx  # RED
Task T025: AccountCard.tsx
Task T026: AccountsCarousel.tsx       # tras T025
Task T027: LandingScreen.tsx          # layout en paralelo con T026
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1
4. **STOP and VALIDATE**: Login → `/` con ≥2 cuentas enmascaradas

### Incremental Delivery

1. Setup + Foundational → APIs y store listos
2. **US1** → cuentas (MVP)
3. **US2** → movimientos (**SC-02**)
4. **US3** → atajos + placeholder (**SC-03**, **BR-06**)
5. **US4** → verificación acceso protegido (**SC-04**)
6. **Polish** → Figma + quality gate

### Parallel Team Strategy

Tras Foundational:

- Dev A: US1 + US2 (secciones de datos)
- Dev B: US3 (placeholder + shortcuts) + US4 (proxy verify)

---

## Traceability

| Spec / US-002 | Tasks |
| ------------- | ----- |
| **FR-001**, **FR-002**, **FR-011**, **FR-015**, **SC-01** | T024–T029 |
| **FR-003**, **SC-02** | T030–T032 |
| **FR-004**, **FR-005**, **FR-009**, **FR-017**–**FR-019**, **SC-03**, **BR-06** | T033–T039 |
| **FR-007**, **SC-04** | T012, T023, T040–T042 |
| **FR-008**, **BR-07** | T005, T016–T017 |
| **FR-010** | T043 |
| **FR-012** | T006, T013, T025, T031 |
| **FR-013** | T007, T014 |
| **FR-014**, **FR-020** | T011, T020, T021–T022, T024–T026, T031 |
| **FR-015**, **FR-016** | T026, T043 |
| Quality gate | T045–T047 |

---

## Notes

- **US-001** debe estar operativa (login, cookie, proxy base)
- No integrar núcleo bancario real (**BR-07**)
- Lógica en `src/features/landing/`; `src/app/page.tsx` solo compone (**ADR-004**)
- Etiquetas UI en español; importes con formato `$` anglosajón (**clarificaciones 2026-06-01**)
- **Transferencias en demo**: no crear `src/app/transfer/` en esta feature; `TRANSFER_PATH` y atajos Transferir usan `DEMO_UNAVAILABLE_PATH` (**FR-009**, **SC-03**)
- Commit tras cada checkpoint o par RED/GREEN
