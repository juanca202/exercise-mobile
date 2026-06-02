# Contract: GET `/api/accounts`

**Implementation**: `src/app/api/accounts/route.ts`  
**Reference**: [docs/technical-docs/api-accounts.md](../../../docs/technical-docs/api-accounts.md)

## Endpoint

| Aspecto | Valor |
| ------- | ----- |
| Método | `GET` |
| Ruta | `/api/accounts` |
| Auth | Misma sesión demo que US-001 (cookie); handler puede asumir petición desde cliente autenticado en `/` |
| Respuesta | `200` + `application/json` (`Account[]`) |

## Response shape — `Account`

| Campo | Tipo | Obligatorio |
| ----- | ---- | ----------- |
| `id` | `string` | Sí |
| `number` | `string` | Sí |
| `balance` | `number` | Sí |
| `type` | `'saving' \| 'checking' \| 'credit-card'` | Sí |
| `name` | `string` | No |

## Demo dataset requirements

- Mínimo **2** cuentas para aceptación (**FR-011**)
- Al menos un `saving` o `checking` y opcionalmente `credit-card` con `balance` negativo o positivo según consumo demo

## Error behavior (demo)

| Código | Cuándo | UI |
| ------ | ------ | -- |
| `200` | OK | `AccountsCarousel` success |
| `500` | Simulable en dev/test vía query `?fail=1` opcional | `Error` + Reintentar (**FR-014**) |

## Client

`src/features/landing/lib/fetch-accounts.ts`:

```typescript
export async function fetchAccounts(): Promise<Account[]>
```

Throws o devuelve Result según convención del store; el store traduce a `error` + mensaje en español.
