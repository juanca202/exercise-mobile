# Contract: Mock Auth Service (interno — US-001)

**Scope**: Demo mock only. **Not** an HTTP API.

**Module**: `src/features/auth/lib/mock-auth-service.ts`

## authenticate(credentials)

Valida credenciales contra el catálogo demo.

### Input — `LoginCredentials`

```typescript
interface LoginCredentials {
  username: string;
  password: string;
}
```

### Output — `AuthResult`

```typescript
type AuthResult =
  | { success: true; session: { username: string } }
  | { success: false; error: "INVALID_CREDENTIALS" | "VALIDATION_ERROR" };
```

### Rules

| Condición | Resultado |
| --------- | --------- |
| `username` o `password` vacíos (tras trim) | `{ success: false, error: "VALIDATION_ERROR" }` |
| Credenciales coinciden con usuario demo | `{ success: true, session: { username } }` |
| Credenciales no coinciden | `{ success: false, error: "INVALID_CREDENTIALS" }` |

### Error messages (UI layer)

| `error` | Mensaje usuario (es) |
| ------- | ---------------------- |
| `VALIDATION_ERROR` | Campos obligatorios (por campo o resumen) |
| `INVALID_CREDENTIALS` | «Usuario o contraseña incorrectos» |

## Session cookie

**Name**: `auth-demo-session`  
**Set on**: login success (client-side for demo)  
**Clear on**: logout  
**Read by**: `proxy.ts`, `auth-session.ts`, store hydration

**Value** (minimal): username string URL-encoded or JSON `{ "username": "demo.user" }`

## Consumers

- `auth-store.login()` — calls authenticate, sets cookie + state
- `auth-store.logout()` — clears cookie + state
- Unit tests — deterministic with Object Mother
