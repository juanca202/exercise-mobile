# Contract Reference: GET `/api/settings` (futuro — fuera de alcance US-001)

**Status**: Reference only — **not implemented** in 001-login-auth  
**Source of truth**: [docs/technical-docs/api-settings.md](../../../docs/technical-docs/api-settings.md)

## Purpose

Document the target HTTP contract for loading authenticated user profile after token-based login.

## Request

```http
GET /api/settings
Authorization: Bearer <token>
```

## Response — `Settings` (200)

```json
{
  "user": {
    "username": "demo.user",
    "firstName": "María",
    "lastName": "Pérez",
    "email": "maria.perez@example.com"
  }
}
```

| JSON path | Type | Description |
| --------- | ---- | ----------- |
| `user.username` | string | Login identifier |
| `user.firstName` | string | Given name |
| `user.lastName` | string | Family name |
| `user.email` | string | Email address |

## Migration notes

- After login via `/api/token`, call `/api/settings` to hydrate profile in resumen (**US-002**)
- Not required for US-001 mock; placeholder resumen may show only `username` from session
