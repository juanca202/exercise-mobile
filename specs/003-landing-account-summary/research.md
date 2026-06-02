# Research: Landing — resumen de cuentas y atajos (003-landing-account-summary)

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## R1 — Origen de datos demo

**Decision**: Route Handlers Next.js `GET /api/accounts` y `GET /api/activity` que devuelven JSON estático desde `mock-data.ts`, alineado con `docs/technical-docs/api-accounts.md` y `api-activity.md`.

**Rationale**: La spec permite simulación; los contratos técnicos ya definen shapes y rutas en inglés. Los handlers permiten que la UI use `fetch` real (preparación para backend futuro) sin nucleo bancario. Facilita tests de integración ligeros del cliente HTTP.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Import directo de `mock-data.ts` en componentes | No ejercita contrato HTTP ni estados de red/error de forma realista |
| Zustand con datos embebidos sin fetch | Oculta loading/error por sección (**FR-014**) |
| Backend externo | Fuera de alcance (**BR-07**) |

## R2 — Estado de carga y reintento por sección

**Decision**: `landing-data-store.ts` (Zustand) con slices `accounts` y `activity`, cada uno con `status: 'idle' | 'loading' | 'success' | 'error'`, `data`, `retry()`.

**Rationale**: **FR-014** exige error localizado y «Reintentar» sin pantalla global. Dos fetches independientes en `useEffect` al montar `LandingScreen`. Cumple ADR-003 sin mezclar con `auth-store`.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Un solo estado global de página | Un fallo ocultaría la sección exitosa |
| React Query / SWR | YAGNI; nueva dependencia no justificada en constitución |
| Suspense único | No modela retry por sección ni copy en español acordado |

## R3 — Formateo de presentación

**Decision**:

| Regla | Implementación |
| ----- | -------------- |
| Enmascaramiento | `formatAccountNumber(raw)` → `****` + últimos 4 dígitos |
| Moneda | `formatCurrency(n)` con `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` |
| Fecha relativa | `formatRelativeDate(iso)` con `Intl.RelativeTimeFormat('es', …)` + umbrales día/hora |

**Rationale**: Clarificaciones 2026-06-01. `Intl` evita dependencias; tests unitarios con fechas fijas (`vi.setSystemTime`).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| `date-fns` | Dependencia extra para demo |
| Formato es-ES para moneda | Contradice clarificación (formato `$` anglosajón) |

## R4 — Pantalla placeholder para atajos

**Decision**: Ruta protegida `/demo-unavailable` con página mínima en español («Esta función no está disponible en la demostración») + enlace volver al resumen.

**Rationale**: **FR-009**, **FR-004** (transfer sin ruta), clarificación Q1 y Q4. Una sola ruta evita duplicar copy y 404 genérico.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| 404 Next por defecto | Rechazado en clarificación |
| Modal en landing | No cumple «pantalla dedicada» |
| Atajos disabled | Rechazado en clarificación |

## R5 — Atajos y rutas (Figma / US-002)

**Decision**:

| Atajo (UI) | Ruta destino | Notas |
| ---------- | ------------ | ----- |
| Transferencias | `/transfer` si existe en repo; si no, `/demo-unavailable` | **SC-03** |
| Servicios | `/demo-unavailable` | **BR-06** |
| Pagos QR | `/demo-unavailable` | **BR-06** |

Constantes en `src/shared/routes.ts`. `Shortcuts` usa `Link` de Next.js.

**Rationale**: **BR-03** y maqueta Figma. Transferencias puede evolucionar sin cambiar placeholder.

## R6 — Sustitución del placeholder US-001

**Decision**: Reemplazar contenido de `HomeScreen` por composición `LandingScreen`; mantener `LogoutButton` en header o pie según Figma.

**Rationale**: `src/app/page.tsx` ya compone `HomeScreen`; migración mínima. Auth permanece en `features/auth`.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Nueva ruta `/dashboard` | Desalineado con US-001/US-002 (`/` como inicio autenticado) |
| Mezclar landing dentro de `features/auth` | Viola cohesión por dominio ([ADR-004]) |

## R7 — Tarjeta de crédito y tipos de cuenta

**Decision**: Mostrar `balance` del contrato como consumo; etiqueta opcional «Consumo» en UI para `type: 'credit-card'`; sin cupo disponible.

**Rationale**: **BR-07** y `api-accounts.md`. Mejora comprensión sin ampliar contrato.

## R8 — Extensión de proxy y rutas protegidas

**Decision**: Añadir `/demo-unavailable` (y `/transfer` cuando exista) a `ROUTE_ACCESS` como `protected` y ampliar `config.matcher` en `proxy.ts`.

**Rationale**: Placeholder y transfer no deben ser públicos (**FR-007**).

## R9 — Testing

**Decision**: TDD en `format-*.ts`, `fetch-*.ts` (mock `fetch`), `landing-data-store.test.ts`, tests de `Error` en `src/components/ui/` (props `message`, `onRetry`) y secciones landing con RTL.

**Rationale**: Constitución § III; formateo y retry son lógica de negocio verificable sin E2E.

## R10 — Estados vacíos (edge cases)

**Decision**: Mock siempre incluye ≥2 cuentas y ≥3 movimientos; funciones de UI soportan lista vacía con mensaje «No hay cuentas» / «No hay movimientos recientes» por si el mock cambia.

**Rationale**: Spec edge cases; demo normal cumple **FR-011**.
