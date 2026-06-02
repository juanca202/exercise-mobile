# Contract: Pantalla placeholder `/demo-unavailable`

**Implementation**: `src/app/demo-unavailable/page.tsx`  
**Spec**: **FR-009**, **FR-004** (transferencias sin ruta)

## Route

| Aspecto | Valor |
| ------- | ----- |
| Path | `/demo-unavailable` |
| Access | `protected` (requiere sesión US-001) |
| Matcher | Incluir en `proxy.ts` |

## UI requirements

| Elemento | Regla |
| -------- | ----- |
| Título o mensaje principal | Español; indica funcionalidad no disponible en la demo |
| Acción secundaria | Enlace o botón «Volver al inicio» → `/` |
| Estilo | Coherente con `DESIGN.md` (fondo `#EBF5F6`, tipografía Lexend) |

## Triggers

Cualquier atajo configurado con `href: DEMO_UNAVAILABLE_PATH`:

- Servicios
- Pagos QR
- Transferencias (mientras `/transfer` no esté implementada)

## Must NOT

- Mostrar plantilla 404 genérica de Next
- Dejar atajos no clicables (**clarificación 2026-06-01**)
