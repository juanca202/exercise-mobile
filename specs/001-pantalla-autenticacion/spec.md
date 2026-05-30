# Feature Specification: Pantalla de autenticación (US-001)

**Feature Branch**: `002-pantalla-autenticacion`

**Created**: 2026-05-30

**Status**: Draft

**Input**: Historia de usuario [US-001](../../docs/user-stories/US-001-pantalla-autenticacion/README.md), contratos de referencia [api-token-login](../../docs/technical-docs/api-token-login.md) y [api-settings](../../docs/technical-docs/api-settings.md), e interfaces Figma del taller SDD.

**Constitution**: Alineada con `.specify/memory/constitution.md`. Identificadores **BR-XX** y escenarios **SC-XX** provienen de US-001; desviaciones documentadas en _Assumptions_.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Iniciar sesión y acceder al resumen (Priority: P1)

Como visitante de la demostración de banca web, quiero enviar usuario y contraseña en un formulario de inicio de sesión para identificarme y llegar al resumen (inicio autenticado) cuando las credenciales cumplan las reglas del producto en esta fase.

**Why this priority**: Sin autenticación no hay acceso al flujo protegido; es el núcleo de valor de la historia.

**Independent Test**: Un visitante sin sesión completa el formulario con ambos campos obligatorios y verifica redirección al resumen y tratamiento como usuario autenticado en el resto del flujo permitido.

**Acceptance Scenarios** (US-001 **SC-02**):

1. **Given** un visitante sin sesión válida, **When** envía el formulario de login con usuario y contraseña no vacíos, **Then** el sistema lo reconoce como autenticado y lo redirige al resumen.

---

### User Story 2 - Proteger rutas y redirigir al login (Priority: P1)

Como visitante sin sesión, quiero que el sistema me impida usar contenido reservado a usuarios autenticados y me lleve a la pantalla de login, para entender qué áreas requieren identificación.

**Why this priority**: Demuestra el mecanismo de rutas protegidas exigido por producto y habilita el resto de la demo.

**Independent Test**: Sin sesión, al solicitar al menos una ruta que producto haya marcado como protegida, el usuario solo ve la pantalla de login (o es redirigido a ella).

**Acceptance Scenarios** (US-001 **SC-01**):

1. **Given** un visitante sin sesión válida, **When** solicita una ruta definida como protegida mediante el mecanismo acordado, **Then** el sistema lo redirige a la pantalla de login.

---

### User Story 3 - Evitar login duplicado (Priority: P2)

Como usuario ya autenticado, quiero no volver a ver el formulario de login si intento abrir esa pantalla, para continuar mi flujo en el resumen.

**Why this priority**: Mejora la experiencia y evita estados incoherentes; depende de tener sesión (P1).

**Independent Test**: Con sesión activa, navegar a la pantalla de login redirige al resumen sin mostrar el formulario.

**Acceptance Scenarios** (US-001 **SC-03**):

1. **Given** un usuario autenticado, **When** solicita la pantalla de login, **Then** el sistema lo redirige al resumen.

---

### User Story 4 - Cerrar sesión con destino único (Priority: P2)

Como usuario autenticado, quiero cerrar sesión desde cualquier punto de la aplicación que ofrezca esa acción y volver siempre a la misma pantalla de login, para salir del área autenticada de forma predecible.

**Why this priority**: Cierra el ciclo de autenticación y valida coherencia de navegación.

**Independent Test**: Tras cerrar sesión desde encabezado, configuración u otro flujo que lo exponga, el usuario no se considera autenticado y llega a la pantalla de login, con el mismo destino sin importar el origen de la acción.

**Acceptance Scenarios** (US-001 **SC-04**):

1. **Given** un usuario autenticado, **When** ejecuta una acción de cierre de sesión desde cualquier parte de la aplicación que la ofrezca, **Then** el sistema deja de considerarlo autenticado y lo redirige a la pantalla de login.

---

### Edge Cases

- Usuario intenta enviar el formulario con usuario o contraseña vacíos: el envío no debe considerarse válido hasta que ambos campos estén completos (**BR-01**).
- Usuario autenticado marca favorito o enlaza directamente a la URL de login: redirección al resumen, no doble sesión (**SC-03**).
- Tras cierre de sesión, el usuario intenta volver atrás al resumen o a una ruta protegida: debe tratarse como no autenticado y redirigirse al login (**SC-04**, **SC-01**).
- Catálogo de rutas protegidas aún no cerrado por producto: debe existir al menos una ruta de demostración del mecanismo (**BR-04**); el resto se define después sin bloquear esta entrega.
- Credenciales no reconocidas en fase mock: el producto debe comunicar el fallo de forma comprensible sin exponer detalles de seguridad de un entorno productivo (**BR-06**).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001** (**BR-01**): El sistema MUST ofrecer un formulario de inicio de sesión con campos de usuario y contraseña; ambos MUST ser obligatorios para enviar el formulario.
- **FR-002** (**BR-02**): Tras un inicio de sesión exitoso, el sistema MUST redirigir al usuario al resumen (inicio autenticado) y MUST tratarlo como autenticado en el resto del flujo permitido.
- **FR-003** (**BR-03**): Si el usuario ya está autenticado e intenta abrir la pantalla de login, el sistema MUST redirigirlo al resumen en lugar de mostrar el formulario.
- **FR-004** (**BR-04**): El producto MUST implementar un mecanismo para marcar rutas protegidas accesibles solo con sesión válida; MUST existir al menos una ruta protegida de demostración que redirija a login a quien no haya iniciado sesión.
- **FR-005** (**BR-05**): Toda acción explícita de cierre de sesión expuesta en la aplicación MUST dejar al usuario fuera del área autenticada y MUST redirigirlo siempre a la misma pantalla de inicio de sesión, con destino independiente del punto desde el que cerró.
- **FR-006** (**BR-06**): La verificación de sesión y la identidad en esta entrega MUST implementarse con datos y comportamiento simulados (sin backend ni proveedor de identidad real); las obligaciones de rutas protegidas y redirecciones MUST cumplirse en ese alcance y MUST NOT interpretarse como garantías de seguridad de producción.
- **FR-007**: La pantalla de login MUST alinearse visualmente con la referencia de diseño Figma indicada en _Design & References_ (estructura, campos y jerarquía perceptible de usuario/contraseña y acción de envío).

### Key Entities

- **Sesión de usuario**: Representa si el visitante está autenticado en la demo; determina acceso a rutas protegidas y redirecciones login ↔ resumen.
- **Credenciales de acceso**: Par usuario + contraseña introducido en el formulario; en esta fase se validan contra reglas mock acordadas en implementación.
- **Ruta protegida**: Destino de navegación que exige sesión válida; el catálogo completo queda abierto a producto, con al menos una ruta de demostración obligatoria.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **MO-001**: El 100 % de los escenarios de aceptación US-001 (**SC-01** a **SC-04**) pueden ejecutarse manualmente o con pruebas automatizadas y obtener el resultado descrito en una sola pasada por escenario en entorno de demo.
- **MO-002**: Un evaluador sin sesión alcanza el resumen tras completar login válido en menos de 1 minuto desde la pantalla de login (flujo principal).
- **MO-003**: Tras cierre de sesión desde al menos dos puntos distintos de la UI que expongan la acción, el destino es siempre la misma pantalla de login (0 variaciones de destino).
- **MO-004**: Revisión de la pantalla de login frente al nodo Figma de referencia: campos usuario/contraseña y acción principal identificables sin ambigüedad por un revisor de producto.

## Design & References

Referencias para planificación, diseño y trazabilidad; no sustituyen los requisitos funcionales anteriores.

| Tipo                  | Referencia                                                                                                                          | Uso en esta feature                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Historia de usuario   | [US-001 Pantalla de autenticación](../../docs/user-stories/US-001-pantalla-autenticacion/README.md)                                 | Fuente de **BR-01**–**BR-06** y escenarios **SC-01**–**SC-04**                                                   |
| Figma (login)         | [Pantallas taller SDD — nodo 1-3167](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-3167&m=dev) | Archivo `7pt2W7JSic4ZoAVcgvQ5qD`, nodo `1-3167`, modo Dev — maqueta de la pantalla de inicio de sesión           |
| Figma (archivo)       | [Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD)                                    | Contexto del sistema de pantallas del taller; el resumen post-login se documenta en US-002 (nodo `1-1605`)       |
| Contrato API (futuro) | [POST `/api/token` — LoginRequest / LoginResponse](../../docs/technical-docs/api-token-login.md)                                    | Intercambio usuario/contraseña por token de acceso y renovación; **fuera del alcance** de FR-006 en esta entrega |
| Contrato API (futuro) | [GET `/api/settings` — Settings](../../docs/technical-docs/api-settings.md)                                                         | Perfil del usuario autenticado; consumo posterior a sesión real con token; **fuera del alcance** de FR-006       |

## Assumptions

- El actor principal es un usuario de la demostración de banca web en navegador; no se exigen apps nativas ni MFA en esta historia.
- «Resumen» e «inicio autenticado» son la misma experiencia de destino tras login exitoso, alineada con US-002 cuando esté disponible.
- La validación de credenciales en mocks acepta cualquier par no vacío salvo que producto defina credenciales demo concretas en planificación o tareas.
- Los contratos `LoginRequest`/`LoginResponse` y `Settings` en documentación técnica orientan historias posteriores de integración con backend; esta spec no exige JWT ni cabecera Bearer hasta nueva definición de producto.
- Amenazas de seguridad de producción (fuerza bruta, almacenamiento de secretos, revocación de tokens) quedan fuera del alcance (**BR-06**).
- El catálogo definitivo de rutas protegidas se negocia con producto; la entrega actual solo exige el mecanismo y una ruta de demostración (**BR-04**).
