# Data Model: Pantalla de autenticación (US-001)

**Date**: 2026-05-30  
**Branch**: `002-pantalla-autenticacion`

## Overview

Modelo de datos **cliente-side mock** para sesión demo. No hay persistencia en servidor ni entidades de backend en esta entrega (**FR-006**).

## Entities

### AuthSession

Representa la sesión demo del visitante autenticado.

| Field             | Type             | Required | Description                                                  |
| ----------------- | ---------------- | -------- | ------------------------------------------------------------ |
| `isAuthenticated` | `boolean`        | Sí       | Indica si el usuario tiene sesión válida en la demo          |
| `username`        | `string \| null` | Sí       | Identificador introducido en login; `null` si no autenticado |

**Validation rules**:

- `isAuthenticated === true` implica `username` non-empty string.
- Tras `logout`, `isAuthenticated` es `false` y `username` es `null`.

**Persistence**:

- `localStorage` clave `auth:demo:v1` (Zustand persist).
- Cookie `demo-auth-session` (valor opaco o flag) sincronizada para el proxy.

**State transitions**:

```text
[anonymous]
  │ login(credentials válidas)
  ▼
[authenticated] ──logout()──► [anonymous]

[authenticated] + navega a /login ──redirect──► / (resumen)
[anonymous] + navega a ruta protegida ──redirect──► /login
```

### LoginCredentials

Par enviado desde el formulario (**BR-01**).

| Field      | Type     | Required | Validation              |
| ---------- | -------- | -------- | ----------------------- |
| `username` | `string` | Sí       | Tras trim, longitud > 0 |
| `password` | `string` | Sí       | Tras trim, longitud > 0 |

**Business rules**:

- Formulario no se considera enviable si algún campo falla validación.
- En fase mock, credenciales válidas = ambos campos pasan validación (sin verificación remota).

### ProtectedRouteConfig

Metadatos de una ruta que exige sesión (**BR-04**).

| Field   | Type     | Required | Description                                       |
| ------- | -------- | -------- | ------------------------------------------------- |
| `path`  | `string` | Sí       | Pathname exacto o patrón (p. ej. `/`, `/cuentas`) |
| `label` | `string` | No       | Nombre legible para documentación/tests           |

**Initial catalog** (demo mínima):

| path | label                 |
| ---- | --------------------- |
| `/`  | Resumen (stub US-002) |

Catálogo extensible por producto sin cambiar contrato de entidad.

### AuthError (UI)

Mensaje presentado al usuario cuando el login mock falla validación local.

| Field     | Type                        | Description                                            |
| --------- | --------------------------- | ------------------------------------------------------ |
| `code`    | `'VALIDATION' \| 'UNKNOWN'` | Clasificación interna                                  |
| `message` | `string`                    | Texto en español, sin detalles de seguridad productiva |

## Relationships

```text
LoginCredentials ──(validates to)──► AuthSession
AuthSession ──(grants access to)──► ProtectedRouteConfig[]
ProtectedRouteConfig ──(redirect if no session)──► /login
```

## Future entities (out of scope)

Referencia para integración posterior; **no** implementar en US-001:

### LoginResponse (API)

| Field           | Type     | Source                                                             |
| --------------- | -------- | ------------------------------------------------------------------ |
| `token`         | `string` | [api-token-login.md](../../docs/technical-docs/api-token-login.md) |
| `refresh_token` | `string` | idem                                                               |

### Settings (API)

| Field            | Type     | Source                                                       |
| ---------------- | -------- | ------------------------------------------------------------ |
| `user.username`  | `string` | [api-settings.md](../../docs/technical-docs/api-settings.md) |
| `user.firstName` | `string` | idem                                                         |
| `user.lastName`  | `string` | idem                                                         |
| `user.email`     | `string` | idem                                                         |

## TypeScript sketches (implementation hint)

```typescript
type AuthSession = {
  isAuthenticated: boolean;
  username: string | null;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type ProtectedRouteConfig = {
  path: string;
  label?: string;
};
```
