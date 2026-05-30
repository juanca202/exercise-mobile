# Contract: HTTP GET `/api/settings` (referencia futura)

**Status**: Not implemented in US-001  
**Canonical doc**: [docs/technical-docs/api-settings.md](../../docs/technical-docs/api-settings.md)

## Summary

| Method | Path            | Auth       | Response   |
| ------ | --------------- | ---------- | ---------- |
| GET    | `/api/settings` | Bearer JWT | `Settings` |

## Settings (200)

```json
{
  "user": {
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

## Migration note

Consumable after real token login (US-001 successor stories). Not required for login screen or route guard in mock phase.
