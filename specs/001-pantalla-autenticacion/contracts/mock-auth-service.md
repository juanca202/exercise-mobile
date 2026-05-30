# Contract: Mock Auth Service (cliente)

**Status**: Implementable en US-001  
**Consumers**: `LoginForm`, auth store, tests unitarios

## Operations

### `validateCredentials(credentials: LoginCredentials): AuthResult`

**Input** (`LoginCredentials`):

```json
{
  "username": "demo.user",
  "password": "secret"
}
```

**Output** (`AuthResult`):

```typescript
type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: AuthError };
```

**Rules**:

- `ok: true` solo si `username` y `password` tienen contenido tras `trim`.
- `ok: false` con `code: 'VALIDATION'` y mensaje en español si falla validación.
- No realiza llamadas HTTP.

### `establishSession(session: AuthSession): void`

**Side effects**:

- Actualiza store Zustand.
- Escribe cookie `demo-auth-session` para el proxy.

### `clearSession(): void`

**Side effects**:

- Resetea store a estado anónimo.
- Elimina cookie `demo-auth-session`.
- Idempotente.

## AuthSession shape

```json
{
  "isAuthenticated": true,
  "username": "demo.user"
}
```

## Test matrix (minimum)

| username | password | Expected                |
| -------- | -------- | ----------------------- |
| `"a"`    | `"b"`    | `ok: true`              |
| `""`     | `"b"`    | `ok: false`, VALIDATION |
| `"a"`    | `"   "`  | `ok: false`, VALIDATION |
