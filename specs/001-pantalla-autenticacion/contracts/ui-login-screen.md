# Contract: UI — Pantalla de login

**Status**: Implementable en US-001  
**Design source**: [Figma nodo 1-3167](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3167&m=dev)  
**Tokens**: `DESIGN.md` (Lexend, teal primario, inputs)

## Required elements (FR-007, MO-004)

| Element          | Role              | Notes                                       |
| ---------------- | ----------------- | ------------------------------------------- |
| Campo usuario    | `textbox` / input | Label o placeholder en español              |
| Campo contraseña | `password` input  | Enmascarado                                 |
| Acción principal | `button` submit   | Texto tipo «Iniciar sesión»                 |
| Formulario       | `<form>`          | Submit nativo + validación HTML5/`required` |

## Optional (Figma-dependent)

- Logo o marca demo
- Título de pantalla
- Mensaje de error inline bajo el formulario

## Accessibility

- Labels asociados a inputs (`htmlFor` / `id`)
- Botón submit focusable; orden de tab lógico
- Mensajes de error anunciados (`role="alert"` o live region)

## Responsive

- Layout usable en viewport móvil (proyecto «exercise-mobile»)
- Touch targets ≥ 44px donde aplique (DESIGN.md botones)

## Out of scope

- Recuperación de contraseña
- SSO / OAuth
- Captcha o MFA
