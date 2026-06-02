# Contract: Pantallas UI — transferencia entre cuentas propias

**Reference**: [Figma — Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD)  
**Tokens**: `DESIGN.md`, `src/app/globals.css` (**MEMORY.md**)

## TransferTypeScreen (`/transfer`)

**Figma**: [Paso 1 — Selección de tipo (36:1459)](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1459&m=dev)

| Elemento | Requisito |
| -------- | --------- |
| Opciones | «Entre mis cuentas», «A terceros» visibles (**FR-003**) |
| Entre mis cuentas | Navega a `/transfer/own` (**SC-01**) |
| A terceros | Aviso funcionalidad no disponible; no inicia flujo propio (**SC-11**) |

## TransferEnterScreen (`/transfer/own`)

**Figma**: [Paso 2 — Ingreso (36:1794)](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1794&m=dev)

| Elemento | Requisito |
| -------- | --------- |
| Cuenta origen | Tarjeta «Desde»: nombre, tipo/número, saldo; al pulsar abre modal (**SC-02**) |
| Cuenta destino | Tarjeta «Hacia»: idem |
| Modal «CUENTAS» | [Figma 1:3077](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3077&m=dev): título, X, lista (alias, tipo/número, saldo, «Saldo disponible»), fila seleccionada resaltada; $0.00 no seleccionable |
| Intercambio | Acción invertir origen/destino (**BR-05**) |
| Monto | Input obligatorio; validación rango y saldo |
| Concepto | Opcional |
| Continuar | Avanza si validación OK |
| Cancelar | → `/transfer` sin ejecutar (**BR-14**) |

## TransferReviewScreen (`/transfer/own/review`)

**Figma**: [Paso 3 — Revisión (1:2920)](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2920&m=dev)

| Elemento | Requisito |
| -------- | --------- |
| Monto | Destacado |
| Aviso | Transferencia inmediata |
| Detalle | Origen, destino (número enmascarado), concepto, comisión $0.00 (**SC-05**) |
| Transferir | Ejecuta POST (**BR-11**) |
| Cancelar | → `/transfer` (**BR-14**) |
| Error POST | Mensaje + reintentar/cancelar (**SC-12**) |

## TransferReceiptScreen (`/transfer/own/receipt`)

**Figma**: [Paso 4 — Comprobante (1:2984)](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-2984&m=dev)

| Elemento | Requisito |
| -------- | --------- |
| Éxito | Indicador visual |
| Datos | Monto, `receiptNumber`, fecha/hora, detalle (**SC-07**) |
| Nueva transferencia | → `/transfer` |
| Ir al inicio | → `/` |
| Compartir | Web Share API o clipboard (**SC-08**) |

## Componentes compartidos

Reutilizar cuando aplique: `Button`, `Input`, `Field`, `Navbar`, `Error` (errores de submit).

## Formato

- Moneda: `formatCurrency` — USD, formato en-US (`$1,250.50`)
- Cuenta: `formatAccountNumber` — `****` + últimos 4 dígitos en destino en revisión/comprobante
