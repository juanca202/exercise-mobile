# Contract: Extensión de protección de rutas (US-002)

**Modules**: `proxy.ts`, `src/features/auth/lib/protected-routes.ts`, `src/shared/routes.ts`

## Rutas añadidas (US-002)

| Path | access | Notas |
| ---- | ------ | ----- |
| `/` | protected | Landing (ya existente) |
| `/login` | public | Ya existente |
| `/demo-unavailable` | protected | Placeholder atajos |
| `/transfer` | protected | Opcional cuando exista stub US futura |

## Matcher actualizado (propuesto)

```typescript
export const config = {
  matcher: ["/", "/login", "/demo-unavailable", "/transfer"],
};
```

Ajustar si `/transfer` no se crea en esta entrega (omitir del matcher).

## Comportamiento

Sin cambios respecto a [001-login-auth/contracts/proxy-routes.md](../../001-login-auth/contracts/proxy-routes.md): visitante sin cookie `auth-demo-session` en ruta protegida → redirect `/login`.

## API routes

`GET /api/accounts` y `GET /api/activity` **no** requieren entrada en matcher del proxy si se consumen solo desde cliente autenticado en `/`; opcionalmente validar cookie en Route Handler en iteración posterior.
