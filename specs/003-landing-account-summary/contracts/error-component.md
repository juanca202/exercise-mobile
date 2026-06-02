# Contract: Componente compartido `Error`

**Implementation**: `src/components/ui/Error.tsx`  
**Scope**: Reutilizable por cualquier sección con carga asíncrona (landing u otros features).

## Props

| Prop | Tipo | Obligatorio | Descripción |
| ---- | ---- | ----------- | ----------- |
| `message` | `string` | Sí | Texto del error mostrado al usuario (español en demo) |
| `onRetry` | `() => void` | Sí | Callback invocado al activar «Reintentar» |
| `retryLabel` | `string` | No | Etiqueta del botón; default `"Reintentar"` |

## Behavior

| Acción | Resultado |
| ------ | --------- |
| Render con `message` | Muestra el mensaje de error de forma legible |
| Click en reintentar | Invoca `onRetry()` una vez por activación |
| Sin `onRetry` | No aplica — prop obligatorio en tipo |

## Usage (landing)

```tsx
<Error
  message={accounts.errorMessage ?? "No se pudieron cargar las cuentas."}
  onRetry={() => retryAccounts()}
/>
```

El padre (`AccountsCarousel`, `MovementsList`) obtiene `message` del store o mensaje fijo y enlaza `onRetry` al método `retry*` del `landing-data-store`.

## Import note

En implementación, importar con alias si colisiona con el tipo global `Error`, p. ej. `import { Error as ErrorState } from "@/components/ui/Error"`.

## Styling

- Coherente con `DESIGN.md` (tipografía Lexend, color texto/error accesible)
- Botón de reintento puede reutilizar `Button` de `src/components/ui/Button.tsx`

## Must NOT

- Vivir bajo `src/features/landing/` (debe ser compartido)
- Incluir lógica de fetch ni conocer `landing-data-store` internamente
- Sustituir toda la página por error global (**FR-014**)
