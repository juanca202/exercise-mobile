# Contract: HTTP POST `/api/token` (referencia futura)

**Status**: Not implemented in US-001  
**Canonical doc**: [docs/technical-docs/api-token-login.md](../../docs/technical-docs/api-token-login.md)

## Summary

| Method | Path         | Request        | Response        |
| ------ | ------------ | -------------- | --------------- |
| POST   | `/api/token` | `LoginRequest` | `LoginResponse` |

## LoginRequest

```json
{
  "username": "string",
  "password": "string"
}
```

## LoginResponse (200)

```json
{
  "token": "string (JWT)",
  "refresh_token": "string"
}
```

## Migration note

When product replaces mock auth, `validateCredentials` should delegate to this endpoint and persist `token` for `Authorization: Bearer` on subsequent calls. Until then, US-001 uses [mock-auth-service.md](./mock-auth-service.md) only.
