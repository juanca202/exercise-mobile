# Contract: GET `/api/activity`

**Implementation**: `src/app/api/activity/route.ts`  
**Reference**: [docs/technical-docs/api-activity.md](../../../docs/technical-docs/api-activity.md)

## Endpoint

| Aspecto | Valor |
| ------- | ----- |
| Método | `GET` |
| Ruta | `/api/activity` |
| Auth | Sesión demo (mismo criterio que accounts) |
| Respuesta | `200` + `application/json` (`Movement[]`) |

## Response shape — `Movement`

| Campo | Tipo | Obligatorio |
| ----- | ---- | ----------- |
| `accountNumber` | `string` | Sí |
| `date` | `string` | Sí (ISO 8601) |
| `description` | `string` | Sí |
| `amount` | `number` | Sí |

## Demo dataset requirements

- Mínimo **3** movimientos (**FR-011**)
- Al menos un `amount` negativo para **BR-02**
- Fechas recientes respecto a “ahora” del cliente para fechas relativas creíbles

## Error behavior (demo)

| Código | Cuándo | UI |
| ------ | ------ | -- |
| `200` | OK | `MovementsList` success |
| `500` | Simulable opcional (`?fail=1`) | `Error` + Reintentar (**FR-014**) |

## Client

`src/features/landing/lib/fetch-activity.ts`:

```typescript
export async function fetchActivity(): Promise<Movement[]>
```
