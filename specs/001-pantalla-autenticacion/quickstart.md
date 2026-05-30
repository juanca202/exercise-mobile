# Quickstart: Pantalla de autenticación (US-001)

**Branch**: `002-pantalla-autenticacion`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Prerequisites

- Node.js 20+
- Dependencias instaladas: `npm install`

## Run locally

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Manual verification (US-001 scenarios)

### SC-01 — Ruta protegida sin sesión

1. Abrir ventana privada o borrar `localStorage` clave `auth:demo:v1` y cookie `demo-auth-session`.
2. Navegar a `http://localhost:3000/`.
3. **Esperado**: redirección a `/login`.

### SC-02 — Login exitoso

1. En `/login`, introducir cualquier usuario y contraseña no vacíos (p. ej. `demo.user` / `demo123`).
2. Enviar formulario.
3. **Esperado**: redirección a `/` y sesión activa (contenido autenticado / stub resumen).

### SC-03 — Login estando autenticado

1. Con sesión activa, navegar a `/login`.
2. **Esperado**: redirección a `/` sin mostrar formulario.

### SC-04 — Cierre de sesión

1. Con sesión activa, usar logout desde el layout autenticado.
2. Repetir desde el segundo punto de logout (stub resumen si aplica).
3. **Esperado**: en ambos casos destino `/login` y sin acceso a `/` sin volver a autenticarse.

## Automated tests

```bash
npm run test:run
```

Cobertura mínima planificada: `auth-store`, `validateCredentials`, redirects logic (≥ 80 % ramas en `lib/` y `store/` según constitución).

## Quality gate (pre-merge)

```bash
npm run lint
npm run test:run
npm run build
```

## Design references

- Login UI: [Figma 1-3167](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3167&m=dev)
- Post-login resumen (US-002): [Figma 1-1605](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-1605&m=dev)

## Suggested demo credentials

Cualquier par no vacío es válido en mock. Sugerido para demos: `demo.user` / `password`.
