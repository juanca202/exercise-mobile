---
description: "Task list for feature 001-login-auth — Pantalla de autenticación (US-001)"
---

# Tasks: Pantalla de autenticación

**Input**: Design documents from `/specs/001-login-auth/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Incluidos (TDD obligatorio — constitution § III; US-001 exige verificación **SC-01**, **SC-03**, **SC-04**). Vitest + Testing Library, co-located `*.test.ts(x)` bajo `src/features/auth/`.

**Organization**: Tareas agrupadas por user story para implementación y prueba independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias entre tareas incompletas)
- **[Story]**: User story de spec.md (US1, US2, US3)
- Rutas exactas en cada descripción

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura de carpetas, constantes compartidas y primitivas UI reutilizables

- [x] T001 Create feature folder structure per plan.md: `src/features/auth/{components,lib,store,testing}/`, `src/components/ui/`, `src/shared/`
- [x] T002 [P] Add route constants (`LOGIN_PATH`, `HOME_PATH`) in `src/shared/routes.ts`
- [x] T003 [P] Add auth domain types (`AuthSession`, `LoginCredentials`, `AuthResult`) in `src/features/auth/lib/types.ts`
- [x] T004 [P] Add Object Mother for demo credentials and sessions in `src/features/auth/testing/auth-object-mother.ts`
- [x] T005 [P] Create Base UI `Button` wrapper with Tailwind/DESIGN.md tokens in `src/components/ui/Button.tsx`
- [x] T006 [P] Create Base UI `Input` wrapper in `src/components/ui/Input.tsx`
- [x] T007 [P] Create Base UI `Field` wrapper (label + error slot) in `src/components/ui/Field.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicios de sesión mock, store Zustand y proxy — **DEBE** completarse antes de user stories

**⚠️ CRITICAL**: Ninguna user story puede empezar hasta cerrar este checkpoint

### Tests (RED first)

- [x] T008 [P] Write failing unit tests for `authenticate()` per `specs/001-login-auth/contracts/mock-auth-service.md` in `src/features/auth/lib/mock-auth-service.test.ts`
- [x] T009 [P] Write failing unit tests for cookie read/write/clear in `src/features/auth/lib/auth-session.test.ts`
- [x] T010 [P] Write failing unit tests for path classification (public/protected) in `src/features/auth/lib/protected-routes.test.ts`
- [x] T011 [P] Write failing unit tests for `login`, `logout`, `hydrate` in `src/features/auth/store/auth-store.test.ts`

### Implementation (GREEN)

- [x] T012 [P] Implement `mock-auth-service.ts` with demo user `demo.user`/`demo1234` in `src/features/auth/lib/mock-auth-service.ts`
- [x] T013 [P] Implement cookie helpers (`auth-demo-session`) in `src/features/auth/lib/auth-session.ts`
- [x] T014 [P] Implement route catalog (`/login` public, `/` protected) in `src/features/auth/lib/protected-routes.ts`
- [x] T015 Implement Zustand store syncing cookie + state in `src/features/auth/store/auth-store.ts` (depends on T012, T013)
- [x] T016 Implement root `proxy.ts` with `export function proxy()` and `config.matcher` per `specs/001-login-auth/contracts/proxy-routes.md` and ADR-008 (depends on T013, T014)
- [x] T017 Create client `AuthHydrator.tsx` to hydrate store from cookie on mount in `src/features/auth/components/AuthHydrator.tsx`
- [x] T018 Wire `AuthHydrator` in `src/app/layout.tsx`

**Checkpoint**: Foundation ready — store, cookie, proxy y tests de lib/store en verde

---

## Phase 3: User Story 1 — Inicio de sesión con credenciales (Priority: P1) 🎯 MVP

**Goal**: Pantalla `/login` con formulario usuario/contraseña; login exitoso redirige al resumen (**FR-001**–**FR-003**, **SC-02**, **BR-01**, **BR-02**)

**Independent Test**: Abrir `/login`, enviar `demo.user`/`demo1234`, confirmar llegada a `/` con sesión activa; campos vacíos muestran validación

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T019 [P] [US1] Write failing component tests (empty fields, success redirect, invalid credentials message) in `src/features/auth/components/LoginForm.test.tsx`

### Implementation for User Story 1

- [x] T020 [P] [US1] Implement controlled form with required validation and generic error in `src/features/auth/components/LoginForm.tsx`
- [x] T021 [P] [US1] Implement login page layout aligned with Figma node 36-1533 and DESIGN.md in `src/features/auth/components/LoginScreen.tsx`
- [x] T022 [US1] Compose login route importing `LoginScreen` in `src/app/login/page.tsx`
- [x] T023 [US1] Create minimal authenticated summary placeholder (welcome + username stub) in `src/app/page.tsx`
- [x] T024 [US1] Connect `LoginForm` submit to `auth-store.login()` and navigate to `/` on success in `src/features/auth/components/LoginForm.tsx`

**Checkpoint**: US1 demo — login manual funcional de extremo a extremo (sin depender aún de proxy para redirect post-login)

---

## Phase 4: User Story 2 — Protección de rutas y redirección al login (Priority: P1)

**Goal**: Visitante sin sesión no accede a `/`; usuario autenticado sí (**FR-005**, **FR-006**, **FR-010**, **SC-01**, **BR-04**)

**Independent Test**: Ventana incógnito → navegar a `/` → redirección a `/login`; tras login, `/` muestra contenido

### Tests for User Story 2

- [x] T025 [P] [US2] Extend failing tests for unauthenticated `/` and authenticated access in `src/features/auth/lib/protected-routes.test.ts`

### Implementation for User Story 2

- [x] T026 [US2] Finalize `proxy.ts` redirect rules: protected path without cookie → `/login`; allow authenticated access to `/` in `proxy.ts`
- [x] T027 [US2] Enhance summary placeholder with protected-only content indicator in `src/app/page.tsx`

**Checkpoint**: **SC-01** verificable — acceso directo a `/` sin sesión redirige a login

---

## Phase 5: User Story 3 — Evitar login duplicado y cierre de sesión (Priority: P2)

**Goal**: Autenticado en `/login` → redirect `/`; logout desde app → siempre `/login` (**FR-004**, **FR-007**, **SC-03**, **SC-04**, **BR-03**, **BR-05**)

**Independent Test**: Con sesión activa, ir a `/login` → redirect `/`; pulsar cerrar sesión → `/login` y `/` vuelve a exigir login

### Tests for User Story 3

- [x] T028 [P] [US3] Write failing tests for logout clearing cookie/store and navigation in `src/features/auth/components/LogoutButton.test.tsx`

### Implementation for User Story 3

- [x] T029 [P] [US3] Implement `LogoutButton` calling `auth-store.logout()` with `router.replace('/login')` in `src/features/auth/components/LogoutButton.tsx`
- [x] T030 [US3] Add `LogoutButton` to summary placeholder in `src/app/page.tsx`
- [x] T031 [US3] Add proxy rule: authenticated user on `/login` redirects to `/` in `proxy.ts` (**SC-03**)
- [x] T032 [US3] Verify post-logout back-button does not restore authenticated view (session cleared + `replace`) in `src/features/auth/store/auth-store.ts` and `LogoutButton.tsx`

**Checkpoint**: **SC-03** y **SC-04** verificables manualmente vía quickstart

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gate, cobertura y validación de escenarios US-001

- [x] T033 Run quality gate `npm run lint && npm run test:run && npm run build` and fix any failures
- [x] T034 [P] Execute manual checklist in `specs/001-login-auth/quickstart.md` (SC-01–SC-04, campos obligatorios, credenciales inválidas)
- [x] T035 Verify branch coverage ≥ 80 % in `src/features/auth/lib/` and `src/features/auth/store/` per constitution § III

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — inicio inmediato
- **Foundational (Phase 2)**: Depende de Setup — **bloquea** todas las user stories
- **User Stories (Phase 3–5)**: Dependen de Foundational
  - US1 (P1) puede empezar tras Phase 2
  - US2 (P1) depende de proxy base (T016) + página `/` (T023); idealmente tras US1
  - US3 (P2) depende de US1 (login) y US2 (rutas protegidas) para prueba integral
- **Polish (Phase 6)**: Depende de US1–US3 completas

### User Story Dependencies

| Story | Prioridad | Depende de | Independiente cuando |
| ----- | --------- | ---------- | -------------------- |
| US1   | P1        | Phase 2    | Login + redirect a `/` funciona |
| US2   | P1        | Phase 2, US1 (página `/`) | `/` protegida sin sesión → `/login` |
| US3   | P2        | Phase 2, US1, US2 | Logout + guard `/login` operativos |

### Within Each User Story

1. Tests RED → implementación GREEN → refactor
2. Lib/store antes de componentes
3. Componentes antes de páginas App Router
4. Checkpoint antes de siguiente prioridad

### Parallel Opportunities

- **Phase 1**: T002–T007 en paralelo tras T001
- **Phase 2**: T008–T011 tests en paralelo; T012–T014 implementación en paralelo
- **Phase 3**: T019–T021 en paralelo (tests + componentes distintos)
- **Phase 5**: T028–T029 en paralelo
- **Phase 6**: T034 en paralelo con T033 si otro agente ejecuta gate

---

## Parallel Example: User Story 1

```bash
# Tras Phase 2, lanzar en paralelo:
Task T019: "Write failing LoginForm tests in src/features/auth/components/LoginForm.test.tsx"
Task T020: "Implement LoginForm.tsx"           # tras T019 RED confirmado
Task T021: "Implement LoginScreen.tsx"       # layout independiente del form logic
```

---

## Parallel Example: Foundational

```bash
# Tests RED en paralelo:
Task T008: mock-auth-service.test.ts
Task T009: auth-session.test.ts
Task T010: protected-routes.test.ts
Task T011: auth-store.test.ts

# GREEN en paralelo (tras RED):
Task T012: mock-auth-service.ts
Task T013: auth-session.ts
Task T014: protected-routes.ts
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Login manual `demo.user`/`demo1234` → `/`
5. Demo MVP si aplica

### Incremental Delivery

1. Setup + Foundational → infraestructura auth mock lista
2. **US1** → login funcional (MVP)
3. **US2** → rutas protegidas (**SC-01**)
4. **US3** → logout + guard login (**SC-03**, **SC-04**)
5. **Polish** → quality gate + quickstart

### Parallel Team Strategy

Con dos desarrolladores tras Foundational:

- Dev A: US1 (login UI + form)
- Dev B: US2 (proxy hardening + placeholder)
- Converger en US3 (logout + reglas proxy `/login`)

---

## Traceability

| Spec / US-001 | Tasks |
| ------------- | ----- |
| **FR-001**, **FR-002**, **SC-02** | T019–T024 |
| **FR-003**, **FR-010** | T023–T024, T027 |
| **FR-005**, **FR-006**, **SC-01** | T010, T014, T016, T025–T027 |
| **FR-004**, **SC-03** | T031 |
| **FR-007**, **SC-04** | T028–T032 |
| **FR-008**, **BR-06** | T012 (mock, sin API) |
| **FR-009** | T021 |
| Quality gate | T033–T035 |

---

## Notes

- No implementar `/api/token` ni `/api/settings` — fuera de alcance (**FR-008**)
- Usar `proxy.ts`, nunca `middleware.ts` (**ADR-008**)
- Lógica de negocio solo en `src/features/auth/`; `src/app/*/page.tsx` compone (**ADR-004**)
- UI en español; credenciales demo documentadas en `specs/001-login-auth/quickstart.md`
- Commit tras cada checkpoint o par RED/GREEN lógico
