# Contract: Route Protection (proxy.ts)

**Module**: `proxy.ts` (root) + `src/features/auth/lib/protected-routes.ts`

## proxy(request)

Intercepta peticiones según `config.matcher` y aplica reglas de acceso.

### Inputs

- `NextRequest` con path y cookies

### Behavior

| Condition | Action |
| --------- | ------ |
| Path is protected AND no valid `auth-demo-session` cookie | `NextResponse.redirect('/login')` |
| Path is `/login` AND valid session cookie | `NextResponse.redirect('/')` |
| Otherwise | `NextResponse.next()` |

### Matcher (initial)

```typescript
export const config = {
  matcher: [
    "/",
    "/login",
    // Excluir estáticos vía convención Next matcher
  ],
};
```

Extend matcher when product adds protected routes.

### Public paths (never redirect to login)

- `/login`
- Next.js internals (`/_next/*`, static files)

### Protected paths (demo minimum)

- `/` — resumen placeholder

## Testing strategy

- Unit tests on `protected-routes.ts` helpers (path classification)
- Integration: manual quickstart SC-01, SC-03; optional E2E later
