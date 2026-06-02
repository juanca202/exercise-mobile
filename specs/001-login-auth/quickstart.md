# Quickstart: Pantalla de autenticación

**Feature**: 001-login-auth  
**Branch**: `002-login-auth`

## Prerequisites

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Demo credentials (mock)

| Campo | Valor |
| ----- | ----- |
| Usuario | `demo.user` |
| Contraseña | `demo1234` |

## Manual verification checklist

### SC-01 — Ruta protegida sin sesión

1. Abrir ventana de incógnito o borrar cookie `auth-demo-session`
2. Navegar a `http://localhost:3000/`
3. **Esperado**: redirección a `/login`

### SC-02 — Login exitoso

1. En `/login`, introducir `demo.user` / `demo1234`
2. Enviar formulario
3. **Esperado**: llegada a `/` (resumen placeholder) con indicación de sesión activa

### SC-03 — Login estando autenticado

1. Con sesión activa, navegar a `/login`
2. **Esperado**: redirección automática a `/` sin mostrar formulario

### Campos obligatorios

1. En `/login`, dejar usuario o contraseña vacíos
2. Intentar enviar
3. **Esperado**: validación visible; no hay login ni redirección

### Credenciales inválidas

1. Introducir credenciales incorrectas (p. ej. `wrong` / `wrong`)
2. **Esperado**: mensaje genérico de error; permanece en `/login`

### SC-04 — Cierre de sesión

1. Autenticado en `/`, pulsar acción de cerrar sesión
2. **Esperado**: redirección a `/login`; `/` vuelve a redirigir al login

### Persistencia tras recarga

1. Tras login exitoso, recargar `/`
2. **Esperado**: sesión mantenida (cookie); no redirige a login

## Automated tests

```bash
npm run test:run
```

Tests prioritarios (co-located):

- `src/features/auth/lib/auth-session.test.ts`
- `src/features/auth/lib/mock-auth-service.test.ts`
- `src/features/auth/store/auth-store.test.ts`
- Tests de componente `LoginForm` (validación y submit)

## Quality gate

```bash
npm run lint && npm run test:run && npm run build
```

## Key files (post-implementación)

| Archivo | Propósito |
| ------- | --------- |
| `proxy.ts` | Interceptación rutas protegidas |
| `src/app/login/page.tsx` | Ruta login |
| `src/app/page.tsx` | Resumen protegido (placeholder) |
| `src/features/auth/store/auth-store.ts` | Estado sesión |
| `src/features/auth/lib/protected-routes.ts` | Catálogo rutas |

## Design reference

- Figma: [Pantalla autenticación — nodo 36-1533](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1533&m=dev)
- Tokens: `DESIGN.md` (Primary Teal `#008392`, Lexend)
