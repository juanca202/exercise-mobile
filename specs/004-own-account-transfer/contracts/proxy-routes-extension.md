# Contract: Extensión de protección de rutas (US-004)

**Modules**: `proxy.ts`, `src/features/auth/lib/protected-routes.ts`, `src/shared/routes.ts`

## Rutas protegidas añadidas

| Path | Acceso | Notas |
| ---- | ------ | ----- |
| `/transfer` | protected | Hub selección tipo |
| `/transfer/own` | protected | Ingreso |
| `/transfer/own/review` | protected | Revisión |
| `/transfer/own/receipt` | protected | Comprobante |

## Matcher propuesto

```typescript
export const config = {
  matcher: [
    "/",
    "/login",
    "/demo-unavailable",
    "/transfer",
    "/transfer/:path*",
  ],
};
```

## `PROTECTED_ROUTES`

Añadir entrada con `path: "/transfer"` y helper `isProtectedPath` que trate prefijo `/transfer` (o listar subrutas explícitamente).

## Comportamiento

Sin cambio respecto a US-001: visitante sin cookie válida en ruta protegida → redirect `/login` (**SC-10**).

## API routes

`POST /api/transfer` no requiere matcher; validación de cookie opcional en handler en iteración posterior.
