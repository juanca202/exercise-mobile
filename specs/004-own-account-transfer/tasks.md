---
description: "Task list for feature 004-own-account-transfer — Transferencia entre cuentas propias (US-004)"
---

# Tasks: Transferencia entre cuentas propias

**Input**: Design documents from `/specs/004-own-account-transfer/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Incluidos (TDD obligatorio — constitution § III; cobertura ≥ 80 % en `src/features/transfer/lib/`, `store/` y componentes con lógica). Vitest + Testing Library, co-located `*.test.ts(x)` bajo `src/features/transfer/`.

**Organization**: Tareas agrupadas por user story (US1–US5 de spec.md) para implementación y prueba independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias entre tareas incompletas)
- **[Story]**: User story de spec.md (US1–US5)
- Rutas exactas en cada descripción

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura del feature `transfer`, tipos, datos de prueba y constantes de rutas

- [X] T001 Create feature folder structure per plan.md: `src/features/transfer/{components,lib,store,testing}/`
- [X] T002 [P] Add `TransferFormDraft`, `TransferRequest`, `TransferReceipt`, validation result types in `src/features/transfer/lib/types.ts` per `specs/004-own-account-transfer/data-model.md`
- [X] T003 [P] Add Object Mother (draft válido/inválido, receipt, accounts elegibles) in `src/features/transfer/testing/transfer-object-mother.ts`
- [X] T004 [P] Add `TRANSFER_PATH`, `TRANSFER_OWN_PATH`, `TRANSFER_REVIEW_PATH`, `TRANSFER_RECEIPT_PATH` in `src/shared/routes.ts` per `specs/004-own-account-transfer/contracts/transfer-routes.md` (reemplazar alias `TRANSFER_PATH` → `DEMO_UNAVAILABLE_PATH`)
- [X] T005 [P] Add `filterEligibleTransferAccounts()` (solo `saving` | `checking`) in `src/features/transfer/lib/filter-eligible-accounts.ts` reusing `Account` from `src/features/landing/lib/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Validación, store, API mock, proxy, layout base — **DEBE** completarse antes de user stories

**⚠️ CRITICAL**: Ninguna user story puede empezar hasta cerrar este checkpoint

### Tests (RED first)

- [X] T006 [P] Write failing unit tests for amount range $5–$2000 inclusive, decimals, same account, insufficient balance in `src/features/transfer/lib/validate-transfer-draft.test.ts` (**BR-06**, **BR-08**, **BR-09**, **SC-03**)
- [X] T007 [P] Write failing unit tests for draft/receipt/submit state, `swapAccounts`, `resetDraft`, `clearReceipt` in `src/features/transfer/store/transfer-store.test.ts`
- [X] T008 [P] Write failing unit tests for `buildTransferRequest()` in `src/features/transfer/lib/build-transfer-request.test.ts`
- [X] T009 [P] Write failing unit tests for `executeTransfer()` (200 + receipt fields, 400/500 errors) in `src/features/transfer/lib/execute-transfer.test.ts`
- [X] T010 [P] Write failing unit tests for POST handler validation in `src/app/api/transfer/route.test.ts` per `specs/004-own-account-transfer/contracts/api-transfer-route.md`
- [X] T011 [P] Extend failing tests for `/transfer` and subpaths as protected in `src/features/auth/lib/protected-routes.test.ts` per `specs/004-own-account-transfer/contracts/proxy-routes-extension.md` (**SC-10**)

### Implementation (GREEN)

- [X] T012 [P] Implement `validateTransferDraft()` returning Spanish error messages in `src/features/transfer/lib/validate-transfer-draft.ts`
- [X] T013 [P] Implement `buildTransferRequest()` with demo `routerNumber` in `src/features/transfer/lib/build-transfer-request.ts`
- [X] T014 [P] Implement `mapTransferResponseToReceipt()` in `src/features/transfer/lib/map-receipt.ts`
- [X] T015 [P] Implement `executeTransfer()` client POST to `/api/transfer` in `src/features/transfer/lib/execute-transfer.ts`
- [X] T016 Implement Zustand `transfer-store.ts` (`draft`, `lastReceipt`, `submitStatus`, actions) in `src/features/transfer/store/transfer-store.ts` (depends on T012, T015)
- [X] T017 [P] Implement `POST` mock handler with validation, `receiptNumber`, `executedAt`, optional in-memory balance update in `src/app/api/transfer/route.ts` per `specs/004-own-account-transfer/contracts/api-transfer-route.md`
- [X] T018 [P] Move `formatAccountNumber` and `formatCurrency` to `src/shared/lib/format-account-number.ts` and `src/shared/lib/format-currency.ts`; update imports in `src/features/landing/` (evitar acoplamiento feature→feature)
- [X] T019 Register `/transfer` prefix as protected via `isProtectedPath()` in `src/features/auth/lib/protected-routes.ts` and extend `proxy.ts` `config.matcher` per contracts (**FR-001**, **SC-10**)
- [X] T020 [P] Create `src/app/transfer/layout.tsx` with `Navbar` `activeItem="transfer"` per `specs/004-own-account-transfer/contracts/transfer-routes.md`

**Checkpoint**: Validación, store, API POST, proxy y layout listos con tests en verde

---

## Phase 3: User Story 1 — Seleccionar transferencia entre cuentas propias (Priority: P1) 🎯 MVP

**Goal**: Pantalla de tipo de transferencia en `/transfer` con «Entre mis cuentas» y «A terceros» (**FR-003**, **SC-01**, **SC-11**)

**Design reference**: [Figma 36:1459](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1459&m=dev)

**Independent Test**: Autenticado → `/transfer` → «Entre mis cuentas» navega a `/transfer/own`; «A terceros» muestra aviso sin entrar al flujo propio

### Tests for User Story 1

- [X] T021 [P] [US1] Write failing component tests (opciones visibles, navegación a `/transfer/own`, aviso «A terceros» sin navegar a ingreso) in `src/features/transfer/components/TransferTypeScreen.test.tsx`

### Implementation for User Story 1

- [X] T022 [P] [US1] Implement `TransferTypeScreen.tsx` aligned to Figma 36:1459 in `src/features/transfer/components/TransferTypeScreen.tsx` (**FR-003**, **FR-016**)
- [X] T023 [US1] Compose `TransferTypeScreen` in `src/app/transfer/page.tsx` (thin route)

**Checkpoint**: US1 — hub de transferencias operativo; ingreso aún no implementado

---

## Phase 4: User Story 2 — Ingresar y validar datos de la transferencia (Priority: P1)

**Goal**: Paso de ingreso con tarjetas Desde/Hacia, modal «CUENTAS», monto, concepto, validaciones y «Continuar» (**FR-004**–**FR-009**, **BR-14**, **SC-02**–**SC-04**)

**Design reference**: [Figma 36:1794](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1794&m=dev); modal [1:3077](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3077&m=dev)

**Independent Test**: En `/transfer/own`, seleccionar cuentas vía modal, monto válido $5–$2000 → `/transfer/own/review`; montos/cuentas inválidos bloquean «Continuar»

### Tests for User Story 2

- [X] T024 [P] [US2] Write failing tests for modal list, selection highlight, $0.00 disabled, close X sin cambio in `src/features/transfer/components/AccountsPickerModal.test.tsx`
- [X] T025 [P] [US2] Write failing tests for Desde/Hacia display in `src/features/transfer/components/AccountPickerCard.test.tsx`
- [X] T026 [P] [US2] Write failing tests for validation messages, Continuar/Cancelar, swap accounts in `src/features/transfer/components/TransferEnterScreen.test.tsx`

### Implementation for User Story 2

- [X] T027 [P] [US2] Implement `AccountsPickerModal.tsx` (bottom sheet «CUENTAS», Figma 1:3077) in `src/features/transfer/components/AccountsPickerModal.tsx` (**FR-004**, **FR-004a**)
- [X] T028 [P] [US2] Implement `AccountPickerCard.tsx` («Desde» / «Hacia») in `src/features/transfer/components/AccountPickerCard.tsx`
- [X] T029 [P] [US2] Implement `SwapAccountsButton.tsx` in `src/features/transfer/components/SwapAccountsButton.tsx` (**BR-05**)
- [X] T030 [US2] Implement `TransferEnterScreen.tsx` (fetch `/api/accounts`, draft en store, validación, Figma 36:1794) in `src/features/transfer/components/TransferEnterScreen.tsx`
- [X] T031 [US2] Compose `TransferEnterScreen` in `src/app/transfer/own/page.tsx`; «Cancelar» → `/transfer` + `resetDraft()` (**BR-14**)

**Checkpoint**: US1 + US2 — ingreso completo con modal; revisión pendiente

---

## Phase 5: User Story 3 — Revisar y confirmar la transferencia (Priority: P1)

**Goal**: Resumen pre-ejecución y POST al confirmar «Transferir» (**FR-010**, **FR-011**, **SC-05**, **SC-06**, **SC-12**)

**Design reference**: [Figma 1:2920](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2920&m=dev)

**Independent Test**: Desde ingreso válido → revisión muestra monto, aviso inmediato, comisión $0.00, destino enmascarado → «Transferir» → comprobante

### Tests for User Story 3

- [X] T032 [P] [US3] Write failing component tests (resumen, comisión $0, Transferir ejecuta store, error POST con reintentar/cancelar) in `src/features/transfer/components/TransferReviewScreen.test.tsx`
- [X] T033 [P] [US3] Write failing test for review route guard (sin draft válido → redirect `/transfer/own`) in `src/features/transfer/lib/review-route-guard.test.ts`

### Implementation for User Story 3

- [X] T034 [P] [US3] Implement `requireValidDraft()` guard helper in `src/features/transfer/lib/review-route-guard.ts`
- [X] T035 [US3] Implement `TransferReviewScreen.tsx` (Figma 1:2920, masked target, «Sin concepto») in `src/features/transfer/components/TransferReviewScreen.tsx`
- [X] T036 [US3] Compose review page with guard in `src/app/transfer/own/review/page.tsx`; «Cancelar» → `/transfer` + `resetDraft()` (**BR-14**)
- [X] T037 [US3] Wire `executeTransfer` on «Transferir» → navigate `/transfer/own/receipt` on success; stay on review on error (**BR-11**, **SC-12**)

**Checkpoint**: Flujo hasta comprobante tras confirmación; receipt screen puede estar stub hasta US4

---

## Phase 6: User Story 4 — Recibir comprobante de transferencia exitosa (Priority: P1)

**Goal**: Comprobante con acciones Nueva transferencia, Ir al inicio, Compartir (**FR-012**, **FR-013**, **SC-07**, **SC-08**, **SC-005**)

**Design reference**: [Figma 1:2984](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2984&m=dev)

**Independent Test**: Tras transferencia exitosa, comprobante muestra monto, número, fecha/hora; acciones navegan correctamente; Compartir invoca share/clipboard

### Tests for User Story 4

- [X] T038 [P] [US4] Write failing tests for `shareReceipt()` (Web Share + clipboard fallback) in `src/features/transfer/lib/share-receipt.test.ts`
- [X] T039 [P] [US4] Write failing component tests (datos comprobante, tres acciones) in `src/features/transfer/components/TransferReceiptScreen.test.tsx`
- [X] T040 [P] [US4] Write failing test for receipt guard (sin `lastReceipt` → redirect `/transfer`) in `src/features/transfer/lib/receipt-route-guard.test.ts`

### Implementation for User Story 4

- [X] T041 [P] [US4] Implement `shareReceipt()` in `src/features/transfer/lib/share-receipt.ts`
- [X] T042 [P] [US4] Implement `requireReceipt()` in `src/features/transfer/lib/receipt-route-guard.ts`
- [X] T043 [US4] Implement `TransferReceiptScreen.tsx` (Figma 1:2984) in `src/features/transfer/components/TransferReceiptScreen.tsx`
- [X] T044 [US4] Compose receipt page with guard in `src/app/transfer/own/receipt/page.tsx`; «Nueva transferencia» → `/transfer` + `clearReceipt()`; «Ir al inicio» → `/` (**SC-07**, **SC-08**)

**Checkpoint**: Flujo E2E demo completo (tipo → ingreso → revisión → comprobante)

---

## Phase 7: User Story 5 — Acceder al flujo desde la navegación autenticada (Priority: P2)

**Goal**: Atajo resumen y `Navbar` «Transferir» apuntan a `/transfer` con ítem activo en flujo (**SC-09**, **FR-002** integración US-002)

**Independent Test**: Desde `/`, atajo Transferencias y navbar Transferir → `/transfer`; en flujo transfer, Transferir activo en `Navbar`

### Tests for User Story 5

- [X] T045 [P] [US5] Update failing tests expecting `TRANSFER_PATH` `/transfer` in `src/features/landing/components/Shortcuts.test.tsx`
- [X] T046 [P] [US5] Update failing tests for Navbar Transferir `href` and active state in `src/components/ui/Navbar.test.tsx`

### Implementation for User Story 5

- [X] T047 [US5] Point Transferencias shortcut to `TRANSFER_PATH` in `src/features/landing/components/Shortcuts.tsx`
- [X] T048 [US5] Point Navbar «Transferir» to `TRANSFER_PATH` and support `activeItem="transfer"` on transfer routes in `src/components/ui/Navbar.tsx`

**Checkpoint**: **SC-09** — acceso desde landing y navbar

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Alineación Figma, quality gate, cobertura y validación manual

- [X] T049 [P] Align all transfer screens and `AccountsPickerModal` with Figma nodes 36:1459, 36:1794, 1:2920, 1:2984, 1:3077 and `DESIGN.md` / `globals.css` tokens (**FR-016**, **SC-004**)
- [X] T050 Run quality gate `npm run lint && npm run test:run && npm run build` and fix failures
- [X] T051 [P] Execute manual checklist in `specs/004-own-account-transfer/quickstart.md` (**SC-01**–**SC-12**)
- [X] T052 Verify branch coverage ≥ 80 % in `src/features/transfer/lib/`, `store/` and transfer components with business logic per constitution § III

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — **bloquea** US1–US5
- **US1 (Phase 3)**: Tras Phase 2 — MVP hub `/transfer`
- **US2 (Phase 4)**: Tras Phase 2; depende de US1 para navegación desde tipo
- **US3 (Phase 5)**: Tras US2 (draft válido)
- **US4 (Phase 6)**: Tras US3 (`lastReceipt`)
- **US5 (Phase 7)**: Tras US1 (ruta `/transfer` existe); puede paralelizarse con US2–US4 si la ruta ya está desplegada
- **Polish (Phase 8)**: Tras US1–US5 deseadas

### User Story Dependencies

| Story | Prioridad | Depende de | Independiente cuando |
| ----- | --------- | ---------- | -------------------- |
| US1   | P1        | Phase 2    | `/transfer` muestra tipo y navega a ingreso |
| US2   | P1        | Phase 2, US1 (navegación) | `/transfer/own` valida y avanza a revisión |
| US3   | P1        | US2        | Revisión ejecuta POST y navega a receipt |
| US4   | P1        | US3        | Comprobante y acciones post-éxito |
| US5   | P2        | US1, Phase 2 | Atajos/navbar llegan a `/transfer` |

### Within Each User Story

1. Tests RED → implementación GREEN → refactor
2. `lib/` y `store/` antes de pantallas
3. Componentes antes de `src/app/transfer/**/page.tsx`
4. Checkpoint antes de siguiente prioridad

### Parallel Opportunities

- **Phase 1**: T002–T005 en paralelo tras T001
- **Phase 2**: T006–T011 tests en paralelo; T012–T015, T017–T018, T020 en paralelo
- **Phase 3**: T021–T022 en paralelo
- **Phase 4**: T024–T029 en paralelo (tests + modal/cards/swap); T030–T031 secuencial
- **Phase 5**: T032–T034 en paralelo
- **Phase 6**: T038–T042 en paralelo
- **Phase 7**: T045–T048 en paralelo
- **Phase 8**: T049 y T051 en paralelo

---

## Parallel Example: Foundational

```bash
# Tests RED en paralelo:
vitest src/features/transfer/lib/validate-transfer-draft.test.ts
vitest src/features/transfer/store/transfer-store.test.ts
vitest src/app/api/transfer/route.test.ts

# GREEN en paralelo:
# validate-transfer-draft.ts, build-transfer-request.ts, map-receipt.ts, execute-transfer.ts
# api/transfer/route.ts, shared/lib/format-*.ts
```

---

## Parallel Example: User Story 2

```bash
Task T024: AccountsPickerModal.test.tsx
Task T025: AccountPickerCard.test.tsx
Task T027: AccountsPickerModal.tsx
Task T028: AccountPickerCard.tsx
Task T029: SwapAccountsButton.tsx
# Luego T030–T031 TransferEnterScreen + page
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1
4. **STOP and VALIDATE**: Login → `/transfer` → «Entre mis cuentas» intenta `/transfer/own` (puede 404 hasta US2)

### Incremental Delivery

1. Setup + Foundational → validación, API, proxy
2. **US1** → selección de tipo (MVP navegación)
3. **US2** → ingreso + modal (**SC-02**–**SC-04**)
4. **US3** → revisión + ejecución (**SC-05**, **SC-06**, **SC-12**)
5. **US4** → comprobante (**SC-07**, **SC-08**, **SC-005**)
6. **US5** → integración landing/navbar (**SC-09**)
7. **Polish** → Figma + quality gate

### Parallel Team Strategy

Tras Foundational:

- Dev A: US1 → US2 (pantallas + modal)
- Dev B: US3 → US4 (confirmación + comprobante)
- Dev C: US5 + Polish (integración y QA)

---

## Traceability

| Spec / BR-SC | Tasks |
| ------------ | ----- |
| **FR-001**, **SC-10** | T011, T019 |
| **FR-002**, **FR-003**, **SC-01**, **SC-11** | T021–T023 |
| **FR-004**, **FR-004a**, **FR-005**–**FR-009**, **BR-14**, **SC-02**–**SC-04** | T024–T031 |
| **FR-010**, **FR-011**, **SC-05**, **SC-06**, **SC-12** | T032–T037 |
| **FR-012**, **FR-013**, **SC-07**, **SC-08**, **SC-005** | T038–T044 |
| **SC-09** | T045–T048 |
| **BR-06**, **BR-08**, **BR-09** | T006, T012 |
| **BR-15** | T017 |
| **FR-016**, **SC-004** | T049 |
| Quality gate | T050–T052 |

---

## Notes

- **US-001** y **US-002** deben estar operativas (login, `GET /api/accounts`, landing)
- Lógica en `src/features/transfer/`; páginas `src/app/transfer/**` solo componen (**ADR-004**)
- UI en español; importes `$` formato en-US (reutilizar formatters compartidos)
- «A terceros»: aviso inline en US1, sin flujo propio (**FR-003**)
- Commit tras cada checkpoint o par RED/GREEN
- Siguiente comando sugerido: `/speckit-implement` o implementación manual por fase
