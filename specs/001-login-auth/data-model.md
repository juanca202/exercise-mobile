# Data Model: Pantalla de autenticación

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## Overview

Modelo conceptual para la demo mock de autenticación. No hay persistencia en servidor ni base de datos.

## Entities

### AuthSession

Representa el estado autenticado del visitante durante la demo.

| Campo | Tipo | Obligatorio | Descripción |
| ----- | ---- | ----------- | ----------- |
| `username` | `string` | Sí (si autenticado) | Identificador reconocido tras login exitoso |
| `isAuthenticated` | `boolean` | Sí | Indica si la sesión mock es válida |

**Validación**:

- `isAuthenticated === true` implica `username` no vacío
- Tras `logout`, ambos se resetean (`isAuthenticated: false`, `username: ''`)

**Persistencia**:

- Cookie `auth-demo-session`: valor serializado mínimo (p. ej. username codificado)
- Zustand store espeja el estado en cliente para UI reactiva

### LoginCredentials

Par introducido en el formulario de login.

| Campo | Tipo | Obligatorio | Reglas |
| ----- | ---- | ----------- | ------ |
| `username` | `string` | Sí | Trim; no vacío para enviar (**FR-002**, **BR-01**) |
| `password` | `string` | Sí | No vacío para enviar (**FR-002**, **BR-01**) |

**Validación en cliente**:

- Envío bloqueado si algún campo está vacío; mensaje por campo o resumen accesible
- No validar formato de email; el campo es «usuario» genérico

### MockUser (demo)

Usuario predefinido aceptado por la simulación.

| Campo | Tipo | Valor demo (propuesto) |
| ----- | ---- | ---------------------- |
| `username` | `string` | `demo.user` |
| `password` | `string` | `demo1234` |
| `displayName` | `string` | `María Pérez` (opcional, para placeholder resumen) |

> Valores finales se fijan en implementación; deben documentarse en `quickstart.md`.

### ProtectedRouteConfig

Configuración del mecanismo de rutas (**FR-005**).

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `path` | `string` | Patrón de ruta (p. ej. `/`, `/transfer`) |
| `access` | `'public' \| 'protected'` | Nivel de acceso |

**Catálogo inicial (US-001)**:

| path | access |
| ---- | ------ |
| `/login` | public |
| `/` | protected |

Rutas estáticas de Next (`/_next`, favicon, etc.) excluidas del matcher del proxy.

## State Transitions

```text
[Anonymous]
    │ submit valid credentials
    ▼
[Authenticated] ── logout ──► [Anonymous]
    │                              │
    │ visit /login                 │ visit protected route
    ▼                              ▼
 redirect to /                 redirect to /login
```

### Transition Rules

| From | Event | To | Side effects |
| ---- | ----- | -- | ------------ |
| Anonymous | Login success | Authenticated | Set cookie; update store; navigate to `/` |
| Anonymous | Login failure | Anonymous | Show generic error; no cookie |
| Anonymous | Access protected route | Anonymous | Proxy redirect to `/login` |
| Authenticated | Access protected route | Authenticated | Render content |
| Authenticated | Access `/login` | Authenticated | Redirect to `/` |
| Authenticated | Logout | Anonymous | Clear cookie; reset store; navigate to `/login` |
| Authenticated | Session cookie missing/invalid | Anonymous | Treat as anonymous on next navigation |

## Relationships

```text
LoginCredentials ──validates against──► MockUser
       │
       │ success
       ▼
  AuthSession ◄──sync──► Cookie (auth-demo-session)
       │
       │ governs access to
       ▼
  ProtectedRouteConfig (via proxy + client guards)
```

## Future Entities (out of scope)

Referencia para migración a API real (no implementar en US-001):

- **LoginRequest** / **LoginResponse** — ver [contracts/future-api-token.md](./contracts/future-api-token.md)
- **Settings** / **UserProfile** — ver [contracts/future-api-settings.md](./contracts/future-api-settings.md)
