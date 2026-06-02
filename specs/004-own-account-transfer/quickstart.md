# Quickstart: Transferencia entre cuentas propias

**Feature**: 004-own-account-transfer  
**Branch**: `004-own-account-transfer`

## Prerequisites

- **US-001** implementada (login, cookie, proxy)
- **US-002** implementada (cuentas en `/`, atajos y navbar)
- `npm install`

## Run locally

```bash
npm run dev
```

1. Iniciar sesión en `/login` con `demo.user` / `demo1234`
2. Abrir transferencias desde navbar **Transferir** o atajo en resumen → `/transfer`

## API smoke test

```bash
curl -s http://localhost:3000/api/accounts | head
curl -s -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"sourceAccountNumber":"001234567890","targetAccountNumber":"009876543210","routerNumber":"021000021","amount":50,"description":"Prueba"}'
```

**Esperado POST**: `200` con `message`, `receiptNumber`, `executedAt` no vacíos.

## Manual verification checklist

### SC-01 — Tipo «Entre mis cuentas»

1. Autenticado, `/transfer` → «Entre mis cuentas»
2. **Esperado**: `/transfer/own` con pickers de cuentas

### SC-02–SC-04 — Ingreso y validaciones

1. Monto $4.99 → no continuar; mensaje rango $5–$2000
2. Monto $2000.01 → idem
3. Monto $5.00 y $2000.00 → continuar OK
4. Misma cuenta origen/destino → error distintas
5. Monto > saldo origen → saldo insuficiente
6. Cancelar → `/transfer` sin comprobante

### SC-05–SC-06 — Revisión

1. Revisar monto, aviso inmediato, comisión $0.00, destino enmascarado
2. «Transferir» → comprobante
3. Cancelar en revisión → `/transfer` sin transferir

### SC-07–SC-08 — Comprobante

1. Ver número de comprobante y fecha/hora
2. «Nueva transferencia» → `/transfer`
3. «Ir al inicio» → `/`
4. «Compartir» abre share o copia texto

### SC-09 — Acceso desde navegación

1. Desde `/`, atajo Transferencias → `/transfer`
2. Navbar **Transferir** → `/transfer` (activo en flujo)

### SC-10 — Sin sesión

1. Incógnito, `/transfer/own` → redirect `/login`

### SC-11 — A terceros

1. En `/transfer`, «A terceros» → aviso no disponible; no entra a `/transfer/own`

### SC-12 — Fallo de servicio (dev)

1. Si existe `?fail=1` en POST, confirmar mensaje de error y opción reintentar/cancelar

## Automated tests

```bash
npm run test:run
```

Prioridad:

- `src/features/transfer/lib/validate-transfer-draft.test.ts`
- `src/features/transfer/store/transfer-store.test.ts`
- Componentes de pantalla con Testing Library (flujos felices y validaciones **BR-06**–**BR-09**)

## Quality gate

```bash
npm run lint && npm run test:run && npm run build
```

## Key files (post-implementación)

| Archivo | Propósito |
| ------- | --------- |
| `src/app/transfer/**` | Rutas del wizard |
| `src/features/transfer/` | Lógica, store, componentes |
| `src/app/api/transfer/route.ts` | Mock POST |
| `src/shared/routes.ts` | `TRANSFER_PATH` y subrutas |
| `proxy.ts` | Protección `/transfer/*` |

## Design reference

| Paso | Figma |
| ---- | ----- |
| 1 Selección de tipo | [36:1459](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1459&m=dev) |
| 2 Ingreso | [36:1794](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1794&m=dev) |
| 2 Modal CUENTAS | [1:3077](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3077&m=dev) |
| 3 Revisión | [1:2920](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2920&m=dev) |
| 4 Comprobante | [1:2984](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2984&m=dev) |

- Tokens: `DESIGN.md`
