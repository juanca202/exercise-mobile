# Data Model: Landing — resumen de cuentas y atajos

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## Overview

Modelo para la landing autenticada. Datos servidos por Route Handlers mock; transformación de presentación en `src/features/landing/lib/`. Sin persistencia en servidor.

## Entities

### Account

Cuenta mostrada en el resumen (**Key Entities**, `api-accounts.md`).

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `id` | `string` | Sí | Identificador único |
| `number` | `string` | Sí | Valor crudo; en UI solo últimos 4 dígitos visibles (**FR-012**) |
| `balance` | `number` | Sí | Saldo (`saving`/`checking`) o consumo (`credit-card`) |
| `type` | `'saving' \| 'checking' \| 'credit-card'` | Sí | Enum cerrado |
| `name` | `string` | No | Nombre visible si existe (**FR-002**) |

**Filtrado por chip** (dentro de `AccountsCarousel`):

| Chip UI | Tipos `Account.type` incluidos |
| ------- | ------------------------------ |
| Todos | Todos |
| Cuentas | `saving`, `checking` |
| Tarjetas | `credit-card` |
| Inversiones | Ninguno en dataset demo por defecto (estado vacío) |

**Presentación UI**:

- `number` → `formatAccountNumber(number)` → p. ej. `****7890`
- `balance` → `formatCurrency(balance)` → p. ej. `$1,250.50`
- `credit-card`: opcional etiqueta «Consumo» junto al monto

### Movement

Movimiento en actividad reciente (`api-activity.md`).

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `accountNumber` | `string` | Sí | Enmascarado en UI con misma regla que Account |
| `date` | `string` | Sí | ISO 8601 |
| `description` | `string` | Sí | Texto breve en español en mock |
| `amount` | `number` | Sí | Positivo o negativo; signo visible (**BR-02**) |

**Presentación UI**:

- `date` → `formatRelativeDate(date)` → p. ej. «hace 2 días», «ayer»
- `amount` → `formatCurrency(amount)` preservando signo (p. ej. `-$42.75`)

### Shortcut

Atajo de navegación desde la landing.

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `id` | `string` | Clave interna (`transfer`, `services`, `qr`) |
| `label` | `string` | Texto visible en español |
| `href` | `string` | Ruta Next (`/transfer`, `/demo-unavailable`, …) |
| `icon` | `string` | Referencia a icono/asset según Figma |

No persistido; definido como constante en código o config estática.

### SectionLoadState (UI state)

Estado de carga por sección (**FR-014**).

| Campo | Tipo | Valores |
| ----- | ---- | ------- |
| `status` | enum | `idle`, `loading`, `success`, `error` |
| `data` | `T \| null` | Payload cuando `success` |
| `errorMessage` | `string \| null` | Mensaje en español cuando `error` |

Aplica por separado a `accounts` y `activity` en `landing-data-store`.

## Validation Rules

| Regla | Fuente |
| ----- | ------ |
| Demo mock ≥ 2 `Account` | **FR-011**, **SC-01** |
| Demo mock ≥ 3 `Movement` | **FR-011**, **SC-02** |
| `type` solo valores permitidos | `api-accounts.md` |
| `amount` negativo muestra signo en UI | **BR-02** |
| Fetch fallido → `error` + retry, otra sección intacta | **FR-014** |

## Relationships

```text
Account (1) ──< Movement (N)   [por accountNumber, lógico en demo]

LandingScreen
  ├── AccountsCarousel ──fetch──► GET /api/accounts ──► Account[] ──► AccountCard (tarjetas)
  ├── MovementsList ──fetch──► GET /api/activity ──► Movement[]
  ├── Shortcuts ──link──► Shortcut[] ──► routes (transfer | demo-unavailable)
  └── Navbar ──link──► NavbarItem[] ──► routes (home | transfer | demo-unavailable)
```

## State Transitions (per section)

```text
idle ──load()──► loading ──success──► success
                    │
                    └──failure──► error ──retry()──► loading
```

## API ↔ UI mapping

| HTTP | Response | Consumer |
| ---- | -------- | -------- |
| `GET /api/accounts` | `Account[]` | `AccountsCarousel` |
| `GET /api/activity` | `Movement[]` | `MovementsList` |

## Out of Scope

- Cupo de tarjeta de crédito
- Integración con núcleo de cuentas real (**BR-07**)
- Paginación o filtros de movimientos
- Personalización de atajos por usuario
