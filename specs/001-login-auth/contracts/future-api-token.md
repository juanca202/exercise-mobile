# Contract Reference: POST `/api/token` (futuro — fuera de alcance US-001)

**Status**: Reference only — **not implemented** in 001-login-auth  
**Source of truth**: [docs/technical-docs/api-token-login.md](../../../docs/technical-docs/api-token-login.md)

## Purpose

Document the target HTTP contract for when mock auth is replaced by real backend integration.

## Request — `LoginRequest`

```json
{
  "username": "demo.user",
  "password": "••••••••"
}
```

| Field | Type | Required |
| ----- | ---- | -------- |
| `username` | string | Yes |
| `password` | string | Yes |

## Response — `LoginResponse` (200)

```json
{
  "token": "eyJhbGciOi...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `token` | string | JWT Bearer access token |
| `refresh_token` | string | Opaque refresh credential |

## Migration notes

- Replace `mock-auth-service.authenticate()` with fetch to `/api/token`
- Store `token` instead of demo cookie (or set httpOnly cookie via Route Handler)
- Update `proxy.ts` to validate JWT or session cookie from backend
- Preserve UI contract of `LoginForm` (username/password fields unchanged)
