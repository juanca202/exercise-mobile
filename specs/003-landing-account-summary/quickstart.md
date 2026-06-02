# Quickstart: Landing — resumen de cuentas y atajos

**Feature**: 003-landing-account-summary  
**Branch**: `003-landing-account-summary`

## Prerequisites

- **US-001** implementada (login, cookie, proxy)
- `npm install`

## Run locally

```bash
npm run dev
```

1. Iniciar sesión en `/login` con `demo.user` / `demo1234`
2. Tras login, debe mostrarse la landing en `/` (no el placeholder US-001)

## API smoke test

```bash
curl -s http://localhost:3000/api/accounts | head
curl -s http://localhost:3000/api/activity | head
```

**Esperado**: JSON arrays con ≥2 cuentas y ≥3 movimientos respectivamente.

## Manual verification checklist

### SC-01 — Resumen de cuentas

1. Autenticado, abrir `/`
2. **Esperado**: ≥2 cuentas con número enmascarado (`****` + 4 dígitos) y monto con `$` formato `1,250.50`

### SC-02 — Últimos movimientos

1. En `/`, revisar sección movimientos
2. **Esperado**: ≥3 filas con descripción, fecha relativa en español, importe con signo

### SC-03 — Atajo transferencias

1. Pulsar atajo Transferencias
2. **Esperado**: `/demo-unavailable` con mensaje en español (esta feature no incluye `/transfer`)

### SC-04 — Sin sesión

1. Incógnito, abrir `/`
2. **Esperado**: redirect `/login` sin datos de cuentas visibles

### BR-06 — Servicios / Pagos QR

1. Pulsar cada atajo secundario
2. **Esperado**: `/demo-unavailable`, no 404 genérico

### Navbar (FR-017–FR-019)

1. En `/`, comprobar barra inferior con Inicio, Transferir, Retirar, Pagos, Otros
2. **Esperado**: **Inicio** activo (teal + fondo resaltado)
3. Pulsar **Transferir** → `/demo-unavailable`
4. Pulsar **Retirar**, **Pagos** u **Otros** → `/demo-unavailable` en demo

### FR-014 — Error por sección (opcional dev)

1. Si existe flag de fallo simulado (`?fail=1` en API), provocar error en una sección
2. **Esperado**: mensaje en español + «Reintentar» solo en esa sección; la otra sigue visible si cargó

### Formato moneda (clarificación)

- Importes con coma de miles y punto decimal + `$` (p. ej. `$1,250.50`)

## Automated tests

```bash
npm run test:run
```

Prioridad:

- `src/features/landing/lib/format-*.test.ts`
- `src/features/landing/store/landing-data-store.test.ts`
- Tests de `AccountsCarousel`, `MovementsList`, `Shortcuts` (landing); `Error` y `Navbar` en `src/components/ui/`

## Quality gate

```bash
npm run lint && npm run test:run && npm run build
```

## Key files (post-implementación)

| Archivo | Propósito |
| ------- | --------- |
| `src/app/page.tsx` | Ruta landing `/` |
| `src/features/landing/components/LandingScreen.tsx` | Composición UI |
| `src/app/api/accounts/route.ts` | Mock cuentas |
| `src/app/api/activity/route.ts` | Mock movimientos |
| `src/app/demo-unavailable/page.tsx` | Placeholder atajos |
| `src/features/landing/store/landing-data-store.ts` | Carga y retry |

## Design reference

- Figma: [Landing resumen — frame Home, nodo 36:1699](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1699&m=dev)
- Tokens: `DESIGN.md`
