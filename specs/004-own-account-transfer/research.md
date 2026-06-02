# Research: Transferencia entre cuentas propias (004-own-account-transfer)

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## R1 — Navegación del flujo por pasos

**Decision**: Rutas anidadas bajo `src/app/transfer/` con cuatro segmentos perceptibles, más estado de borrador en Zustand (`transfer-store`).

| Paso (spec) | Ruta | Pantalla |
| ----------- | ---- | -------- |
| Selección de tipo | `/transfer` | `TransferTypeScreen` |
| Ingreso de datos | `/transfer/own` | `TransferEnterScreen` |
| Revisión | `/transfer/own/review` | `TransferReviewScreen` |
| Comprobante | `/transfer/own/receipt` | `TransferReceiptScreen` |

**Rationale**: Cumple **FR-002** (cuatro etapas perceptibles) y facilita **SC-10** (proxy por prefijo), navegación atrás del navegador y guards («receipt» solo si hay `lastReceipt` en store tras POST exitoso). La lógica de negocio vive en `src/features/transfer/` ([ADR-004](../../docs/adr/ADR-004-feature-based-architecture.md)).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Wizard de un solo `page.tsx` con `useState(step)` | Menos claro en URL; atrás del navegador ambiguo frente al edge case de la spec |
| Cuatro rutas planas sin layout compartido | Duplica chrome (navbar, cancelar) y estilos |
| React Router / librería de steps | Fuera de stack Next App Router |

## R2 — Persistencia del borrador y guards

**Decision**: Store Zustand con `TransferFormDraft` (origen, destino, monto, concepto), `step` derivado de la ruta, y `lastReceipt` tras POST exitoso. Guards en `layout.tsx` o componentes de página: sin borrador válido → redirect a `/transfer/own`; sin `lastReceipt` → redirect desde `/transfer/own/receipt` a `/transfer`.

**Rationale**: **BR-11** (ejecución solo en revisión), edge case de comprobante sin confirmación explícita, y **BR-14** (cancelar limpia borrador y vuelve a `/transfer`). No persistir en `localStorage` salvo que la spec lo pida (no aplica).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Query string con monto/cuentas | Expone datos en URL; peor UX |
| Session storage | YAGNI para demo de sesión corta |

## R3 — Origen de cuentas y saldos

**Decision**: Reutilizar `GET /api/accounts` y tipos `Account` de landing; en el picker de transferencia filtrar a `type` ∈ `saving` | `checking` (excluir `credit-card` en demo).

**Rationale**: **FR-004**, **BR-15**, coherencia con US-002 y un solo dataset mock. Validación **BR-09** contra `balance` del origen seleccionado.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Endpoint dedicado `/api/transfer/accounts` | Duplica mock sin beneficio en demo |
| Estado embebido solo en transfer | Desincroniza saldos respecto al resumen |

## R4 — Ejecución de transferencia (mock)

**Decision**: `POST /api/transfer` con cuerpo alineado a `TransferRequest` en [api-transfer.md](../../docs/technical-docs/api-transfer.md); respuesta ampliada en mock con `receiptNumber`, `executedAt` (ISO) además de `message` para **BR-12** / **SC-005**.

**Rationale**: Convención del repo (`/api/*`). La spec exige comprobante con número y marca temporal no vacíos. Validaciones servidor mock refuerzan **BR-06**–**BR-09** (rango monto, cuentas distintas, saldo).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Solo validación cliente | No modela **SC-12** (fallo de servicio) |
| Ruta literal `/transfer` POST | Inconsistente con `GET /api/accounts` |

## R5 — «A terceros» y placeholders

**Decision**: En `/transfer`, opción «A terceros» navega a mensaje en la misma pantalla o reutiliza patrón US-002: navegación a `/demo-unavailable` con copy específico (**SC-11**, **FR-003**). Preferencia: **pantalla inline** en `TransferTypeScreen` (modal o panel) para no abandonar el hub de transferencias — alineado con «informa que no está disponible» sin iniciar flujo propio.

**Rationale**: **BR-03** exige opción visible; no implementar flujo terceros. Evita 404; coherente con **BR-06** de landing.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Ocultar «A terceros» | Viola **FR-003** y maqueta |
| Implementar flujo terceros | Fuera de alcance |

## R6 — Integración con navegación (US-002)

**Decision**: Actualizar `TRANSFER_PATH` en `src/shared/routes.ts` a `/transfer`; `Shortcuts` y `Navbar` apuntan a `/transfer`. Layout de transferencias incluye `Navbar` con ítem **Transferir** activo (**SC-09**).

**Rationale**: **US Story 5**, sustituye placeholder `DEMO_UNAVAILABLE_PATH` solo para transferencias.

## R7 — Formato y copy UI

**Decision**: Reutilizar `formatCurrency` y `formatAccountNumber` de `src/features/landing/lib/` (mover a `src/shared/lib/` o importar desde landing hasta extracción — en implementación preferir `src/shared/lib/format-*` si se tocan ambos features). Concepto vacío → «Sin concepto» en revisión/comprobante. Moneda USD, español en UI (**constitution**).

**Rationale**: **MEMORY.md**, **FR-016**, clarificaciones de spec (límites $5–$2000 inclusive, decimales).

## R8 — Compartir comprobante

**Decision**: `navigator.share` cuando exista; fallback `navigator.clipboard.writeText` con texto plano del comprobante (**SC-08**).

**Rationale**: **Assumptions** de spec; sin dependencias.

## R9 — Actualización de saldos post-transferencia

**Decision**: Mock puede decrementar saldo en memoria del handler `POST /api/transfer` (mutación del dataset en proceso) o dejar saldos estáticos si la validación previa ya usó el saldo mostrado — **preferido**: actualizar balances en el mock en memoria para coherencia en la misma sesión de demo.

**Rationale**: Assumption spec: «pueden actualizarse en memoria»; mejora demo sin backend.

## R10 — Protección de rutas

**Decision**: Extender `proxy.ts` matcher y `PROTECTED_ROUTES` para `/transfer` y subrutas (`/transfer/:path*`).

**Rationale**: **FR-001**, **SC-10**, [ADR-008](../../docs/adr/ADR-008-proxy-instead-of-middleware.md); contrato ya previsto en US-002.

## R11 — Figma y UI

**Decision**: Implementar cuatro frames de la maqueta [Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD): TRANSFERENCIAS, TRANSFERIR, REVISAR TRANSFERENCIA, COMPROBANTE; tokens `DESIGN.md` / `globals.css` vía `ui-specialist`.

**Rationale**: **FR-016**, **SC-004**.
