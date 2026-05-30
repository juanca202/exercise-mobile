# Contract: Route Guard

**Status**: Implementable en US-001  
**Implementation**: `proxy.ts` + `protected-routes.ts` + redirects en páginas login/resumen

## Public routes

| Path     | Behavior                                                           |
| -------- | ------------------------------------------------------------------ |
| `/login` | Si sesión válida → redirect `307` a `/`. Si no → render formulario |

## Protected routes (initial catalog)

| Path | Behavior without session  |
| ---- | ------------------------- |
| `/`  | Redirect `307` a `/login` |

## Redirect contract

| Trigger | From                   | To       | HTTP              |
| ------- | ---------------------- | -------- | ----------------- |
| SC-01   | Protected route        | `/login` | 307               |
| SC-02   | Login success (client) | `/`      | client navigation |
| SC-03   | `/login` with session  | `/`      | 307 or client     |
| SC-04   | Logout action          | `/login` | client navigation |

**Invariant (BR-05)**: Todo logout explícito usa destino `/login` sin query params de retorno variables.

## Session signal for proxy

| Signal                     | When set           | When cleared   |
| -------------------------- | ------------------ | -------------- |
| Cookie `demo-auth-session` | `establishSession` | `clearSession` |

**Matcher sugerido** (proxy config):

```typescript
matcher: ["/", "/login"];
```

Excluir estáticos (`_next`, assets) según convención Next.js.

## Extensibility

Añadir entrada a `PROTECTED_ROUTES` debe activar el mismo comportamiento SC-01 sin modificar reglas de redirect.
