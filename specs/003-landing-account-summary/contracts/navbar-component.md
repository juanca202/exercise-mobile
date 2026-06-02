# Contract: Componente compartido `Navbar`

**Implementation**: `src/components/ui/Navbar.tsx`  
**Scope**: Reutilizable en landing y otras pantallas autenticadas de la demo.

## Layout

| Aspecto | Regla |
| ------- | ----- |
| Posición | Fijo en parte inferior de la landing |
| Contenedor | Fondo blanco, bordes muy redondeados (pill), según Figma |
| Ítems | 5 columnas: icono centrado + etiqueta debajo |

## Ítems (orden izquierda → derecha)

| Ítem | Etiqueta UI | Ruta demo | Estado en `/` |
| ---- | ----------- | --------- | ------------- |
| home | Inicio | `/` | **Activo** |
| transfer | Transferir | `/transfer` o `/demo-unavailable` | Inactivo |
| withdraw | Retirar | `/demo-unavailable` | Inactivo |
| payments | Pagos | `/demo-unavailable` | Inactivo |
| more | Otros | `/demo-unavailable` | Inactivo |

## Estados visuales

| Estado | Regla |
| ------ | ----- |
| Activo | Icono y texto color primario (teal `#008392`); fondo de ítem resaltado según Figma |
| Inactivo | Icono y texto gris |

## Props sugeridas

```typescript
type NavbarProps = {
  activeItem: "home" | "transfer" | "withdraw" | "payments" | "more";
};
```

## Must NOT

- Vivir bajo `src/features/landing/` (debe ser compartido en `src/components/ui/`)
- Implementar la navegación inferior como enlaces sueltos sin componente `Navbar`
- Usar 404 genérico para ítems sin ruta (**FR-009**)
