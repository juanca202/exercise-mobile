# Contract: Rutas App Router — flujo de transferencia

**Implementation**: `src/app/transfer/**`  
**Feature**: `src/features/transfer/components/*`

## Rutas

| Ruta | Componente | Spec / SC |
| ---- | ------------ | --------- |
| `/transfer` | `TransferTypeScreen` | **SC-01**, **SC-11** |
| `/transfer/own` | `TransferEnterScreen` | **SC-02**–**SC-04** |
| `/transfer/own/review` | `TransferReviewScreen` | **SC-05**, **SC-06** |
| `/transfer/own/receipt` | `TransferReceiptScreen` | **SC-07**, **SC-08** |

## Layout

`src/app/transfer/layout.tsx`:

- Incluye `Navbar` con `activeItem="transfer"`
- Opcional: título de paso / breadcrumb según Figma

## Guards

| Ruta | Condición de acceso | Redirect si falla |
| ---- | ------------------- | ----------------- |
| `/transfer/own` | Sesión autenticada | `/login` (proxy) |
| `/transfer/own/review` | `draft` válido (validación cliente) | `/transfer/own` |
| `/transfer/own/receipt` | `lastReceipt` presente en store | `/transfer` |

## Acciones de navegación

| Acción | Origen | Destino | Efecto |
| ------ | ------ | ------- | ------ |
| «Entre mis cuentas» | `/transfer` | `/transfer/own` | — |
| «Continuar» | `/transfer/own` | `/transfer/own/review` | Valida draft |
| «Cancelar» | ingreso / revisión | `/transfer` | `resetDraft()` (**BR-14**) |
| «Transferir» | revisión | POST → `/transfer/own/receipt` | `executeTransfer` |
| «Nueva transferencia» | comprobante | `/transfer` | `clearReceipt()` |
| «Ir al inicio» | comprobante | `/` | — |
| «A terceros» | `/transfer` | Aviso no disponible (sin `/transfer/own`) | **SC-11** |

## Constantes

`src/shared/routes.ts`:

```typescript
export const TRANSFER_PATH = "/transfer";
export const TRANSFER_OWN_PATH = "/transfer/own";
export const TRANSFER_REVIEW_PATH = "/transfer/own/review";
export const TRANSFER_RECEIPT_PATH = "/transfer/own/receipt";
```
