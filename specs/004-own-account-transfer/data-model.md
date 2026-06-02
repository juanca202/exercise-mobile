# Data Model: Transferencia entre cuentas propias

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## Overview

Modelo para el flujo de transferencia entre cuentas propias del usuario autenticado. Cuentas provienen de `GET /api/accounts` (US-002). Borrador y comprobante en cliente (Zustand); ejecución vía `POST /api/transfer` mock.

## Entities

### Account (reutilizado)

Misma entidad que landing ([api-accounts.md](../../docs/technical-docs/api-accounts.md)).

**Regla de selección en transferencia**: solo cuentas con `type` ∈ `saving` | `checking` son elegibles como origen/destino (**FR-004**). `credit-card` no aparece en pickers de esta feature.

### TransferFormDraft

Borrador capturado en ingreso (**Key Entities: Borrador de transferencia**).

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `sourceAccountId` | `string` | Sí | Debe referenciar `Account.id` elegible |
| `targetAccountId` | `string` | Sí | Distinto de origen (**BR-08**) |
| `amount` | `number` | Sí | ∈ [5, 2000] inclusive; ≤ saldo origen (**BR-06**, **BR-09**) |
| `description` | `string` | No | Concepto opcional (**BR-07**); UI vacío → «Sin concepto» |

**Derivados para UI** (no persistidos en draft):

- `sourceAccount`, `targetAccount`: resueltos desde lista de cuentas
- `commission`: siempre `0` para cuentas propias (**BR-10**)

### TransferRequest (API)

Payload `POST /api/transfer` (alineado a contrato técnico).

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `sourceAccountNumber` | `string` | Sí | Número de cuenta origen |
| `targetAccountNumber` | `string` | Sí | Distinto de origen |
| `routerNumber` | `string` | Sí | Mock fijo demo p. ej. `021000021` |
| `amount` | `number` | Sí | > 0; servidor valida [5, 2000] |
| `description` | `string` | Sí | Enviar `""` o «Sin concepto» si vacío |

### TransferReceipt

Comprobante post-éxito (**Key Entities: Comprobante**).

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `receiptNumber` | `string` | Sí | No vacío (**SC-005**) |
| `executedAt` | `string` | Sí | ISO 8601; formatear fecha/hora en UI |
| `amount` | `number` | Sí | Monto transferido |
| `sourceAccountNumber` | `string` | Sí | |
| `targetAccountNumber` | `string` | Sí | Enmascarado en UI (**BR-10**) |
| `description` | `string` | Sí | Puede ser «Sin concepto» |
| `commission` | `number` | Sí | `0` en transferencia propia |
| `message` | `string` | No | Eco de `TransferResponse.message` |

### Transfer (dominio)

Operación de movimiento entre cuentas propias.

| Campo | Tipo | Valores |
| ----- | ---- | ------- |
| `status` | enum | `draft` (borrador en cliente), `confirmed` (POST OK), `failed` (POST error) |

Transiciones:

```text
draft → (validación cliente OK) → revisión (sigue draft en store)
draft → (POST /api/transfer 200) → confirmed + TransferReceipt
draft → (POST error) → failed (permanece en revisión, sin receipt)
```

## Validation Rules (cliente + mock servidor)

| ID | Regla | Mensaje UI (español, orientativo) |
| -- | ----- | --------------------------------- |
| BR-06 | `5 <= amount <= 2000` | El monto debe estar entre $5 y $2000 |
| BR-08 | `sourceAccountId !== targetAccountId` | Origen y destino deben ser distintos |
| BR-09 | `amount <= source.balance` | Saldo insuficiente |
| BR-07 | `description` opcional | — |
| BR-11 | POST solo desde acción «Transferir» en revisión | — |

Límites **inclusive**: $5.00 y $2000.00 válidos. Decimales permitidos (p. ej. $10.50).

## UI State (Zustand)

`transfer-store`:

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `draft` | `TransferFormDraft \| null` | Borrador actual |
| `lastReceipt` | `TransferReceipt \| null` | Último comprobante exitoso |
| `submitStatus` | `idle \| loading \| error` | Estado del POST en revisión |
| `submitError` | `string \| null` | Mensaje **SC-12** |

Acciones: `setDraft`, `swapAccounts`, `resetDraft`, `executeTransfer`, `clearReceipt`.

## Relationships

```text
User (auth session)
  └── owns many Account (GET /api/accounts)
  └── creates TransferFormDraft
        └── on confirm → TransferRequest → TransferReceipt
```

## Out of scope

- Transferencias a terceros (solo aviso UI)
- Persistencia en base de datos
- Programación / autorización diferida de transferencias
