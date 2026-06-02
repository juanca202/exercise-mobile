# Contract: POST `/api/transfer`

**Implementation**: `src/app/api/transfer/route.ts`  
**Reference**: [docs/technical-docs/api-transfer.md](../../../docs/technical-docs/api-transfer.md) (campos base; respuesta ampliada para comprobante)

## Endpoint

| Aspecto | Valor |
| ------- | ----- |
| Método | `POST` |
| Ruta | `/api/transfer` |
| Auth | Sesión demo US-001 (cookie); en demo el handler puede asumir cliente autenticado |
| `Content-Type` | `application/json` |

## Request — `TransferRequest`

| Campo | Tipo | Obligatorio |
| ----- | ---- | ----------- |
| `sourceAccountNumber` | `string` | Sí |
| `targetAccountNumber` | `string` | Sí |
| `routerNumber` | `string` | Sí |
| `amount` | `number` | Sí |
| `description` | `string` | Sí (permitir `""`) |

## Response — éxito `200`

| Campo | Tipo | Obligatorio | Notas |
| ----- | ---- | ----------- | ----- |
| `message` | `string` | Sí | p. ej. «Transferencia realizada con éxito.» |
| `receiptNumber` | `string` | Sí | **BR-12**, **SC-005** |
| `executedAt` | `string` | Sí | ISO 8601 |

El cliente mapea a `TransferReceipt` junto con datos del borrador.

## Response — error

| Código | Cuándo | Cuerpo |
| ------ | ------ | ------ |
| `400` | Validación (monto, cuentas iguales, saldo) | `{ "error": string }` |
| `500` | Fallo simulado (`?fail=1` en dev) | `{ "error": string }` |

## Server-side validation (mock)

- `sourceAccountNumber !== targetAccountNumber`
- `5 <= amount <= 2000`
- `amount <= balance` de cuenta origen en dataset mock
- `amount > 0`

## Client

`src/features/transfer/lib/execute-transfer.ts`:

```typescript
export async function executeTransfer(
  request: TransferRequest,
): Promise<TransferReceipt>
```

## Post-success side effect (demo)

Opcional: actualizar `balance` de origen/destino en dataset mock en memoria para coherencia en sesión (**research R9**).
