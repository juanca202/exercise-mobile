# Feature Specification: Transferencia entre cuentas propias

**Feature Branch**: `004-own-account-transfer`

**Created**: 2026-06-01

**Status**: Draft

**Input**: Implementa el flujo de transferencia entre cuentas propias para usuarios ya autenticados. Flujo por pasos. Incluye: selección de tipo de transferencia, ingreso de datos, verificación para confirmar y confirmación de éxito. Reglas de negocio: solo permitir transferencias entre $5 y $2000. Diseño de Figma: [Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD).

**Constitution**: Alineada con `.specify/memory/constitution.md`. Identificadores **BR-XX** y escenarios **SC-XX** definidos en esta feature; dependencias con **US-001** (autenticación) y **US-002** (resumen y atajo a transferencias) documentadas en _Assumptions_.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Seleccionar transferencia entre cuentas propias (Priority: P1)

Como usuario autenticado, quiero elegir el tipo de transferencia «Entre mis cuentas» desde la pantalla de transferencias para iniciar un movimiento inmediato entre mis propias cuentas.

**Why this priority**: Es la puerta de entrada al flujo; sin esta selección no hay transferencia entre cuentas propias.

**Independent Test**: Con sesión activa, navegar a transferencias, elegir «Entre mis cuentas» y verificar que se abre el paso de ingreso de datos con cuentas del usuario.

**Acceptance Scenarios** (**SC-01**):

1. **Given** un usuario autenticado en la pantalla de transferencias, **When** selecciona la opción «Entre mis cuentas», **Then** el sistema lo lleva al paso de ingreso de datos de la transferencia.
2. **Given** un usuario autenticado en la pantalla de transferencias, **When** visualiza las opciones disponibles, **Then** ve al menos «Entre mis cuentas» y «A terceros» con textos descriptivos acordes a la maqueta de referencia.

---

### User Story 2 - Ingresar y validar datos de la transferencia (Priority: P1)

Como usuario autenticado, quiero indicar cuenta origen, cuenta destino, monto y concepto opcional para preparar una transferencia entre mis cuentas, con validaciones claras antes de continuar.

**Why this priority**: Captura la información esencial y aplica las reglas de negocio del monto; bloquea transferencias inválidas antes de la confirmación.

**Independent Test**: En el paso de ingreso, completar origen, destino y un monto válido dentro del rango permitido y verificar avance al paso de revisión; repetir con montos inválidos y verificar que no se permite continuar.

**Acceptance Scenarios** (**SC-02**, **SC-03**, **SC-04**):

1. **Given** un usuario en el paso de ingreso con al menos dos cuentas propias, **When** la pantalla carga, **Then** ve tarjetas de cuenta origen («Desde») y destino («Hacia») con nombre, tipo/número de cuenta y saldo disponible.
2. **Given** un usuario en el paso de ingreso, **When** ingresa un monto entre $5.00 y $2000.00 inclusive, selecciona cuentas distintas y pulsa «Continuar», **Then** avanza al paso de revisión con los datos capturados.
3. **Given** un usuario en el paso de ingreso, **When** ingresa un monto menor a $5.00 o mayor a $2000.00, **Then** el sistema no permite continuar y comunica que el monto debe estar entre $5 y $2000.
4. **Given** un usuario en el paso de ingreso, **When** selecciona la misma cuenta como origen y destino, **Then** el sistema no permite continuar y comunica que origen y destino deben ser distintos.
5. **Given** un usuario en el paso de ingreso, **When** ingresa un monto superior al saldo disponible de la cuenta origen, **Then** el sistema no permite continuar y comunica saldo insuficiente.
6. **Given** un usuario en el paso de ingreso, **When** pulsa «Cancelar», **Then** abandona el flujo de ingreso y vuelve a la pantalla de selección de tipo de transferencia sin ejecutar la operación.

---

### User Story 3 - Revisar y confirmar la transferencia (Priority: P1)

Como usuario autenticado, quiero revisar un resumen de la transferencia antes de ejecutarla para confirmar monto, cuentas, concepto y comisión.

**Why this priority**: Paso de control obligatorio antes de mover fondos; reduce errores del usuario.

**Independent Test**: Llegar al paso de revisión con datos válidos, verificar el resumen mostrado y confirmar con «Transferir» para obtener comprobante de éxito.

**Acceptance Scenarios** (**SC-05**, **SC-06**):

1. **Given** un usuario que completó el ingreso con datos válidos, **When** llega al paso de revisión, **Then** ve el monto a enviar destacado, un aviso de que la transferencia se realizará de inmediato, y el detalle de origen, destino (con número enmascarado), concepto (si lo ingresó) y comisión ($0.00 para transferencias entre cuentas propias).
2. **Given** un usuario en el paso de revisión, **When** pulsa «Transferir», **Then** el sistema ejecuta la transferencia y lo lleva al comprobante de éxito.
3. **Given** un usuario en el paso de revisión, **When** pulsa «Cancelar», **Then** abandona la confirmación y vuelve a la pantalla de selección de tipo de transferencia sin ejecutar la operación.

---

### User Story 4 - Recibir comprobante de transferencia exitosa (Priority: P1)

Como usuario autenticado, quiero ver un comprobante claro tras una transferencia exitosa para conservar constancia de la operación y decidir los siguientes pasos.

**Why this priority**: Cierra el flujo con confirmación tangible y acciones post-operación definidas en la maqueta.

**Independent Test**: Tras confirmar una transferencia válida, verificar comprobante con monto, fecha/hora, número de comprobante y detalle de la operación; probar acciones «Nueva transferencia» e «Ir al inicio».

**Acceptance Scenarios** (**SC-07**, **SC-08**):

1. **Given** una transferencia ejecutada con éxito, **When** el usuario llega al comprobante, **Then** ve indicador de éxito, monto transferido, número de comprobante, fecha y hora de la operación, y el detalle de origen, destino, concepto y comisión.
2. **Given** un usuario en el comprobante de éxito, **When** pulsa «Nueva transferencia», **Then** reinicia el flujo en la pantalla de selección de tipo de transferencia.
3. **Given** un usuario en el comprobante de éxito, **When** pulsa «Ir al inicio», **Then** navega al resumen de cuentas (inicio autenticado).
4. **Given** un usuario en el comprobante de éxito, **When** pulsa «Compartir», **Then** el sistema ofrece compartir la información del comprobante mediante el mecanismo de compartir disponible en el dispositivo o navegador.

---

### User Story 5 - Acceder al flujo desde la navegación autenticada (Priority: P2)

Como usuario autenticado, quiero llegar al flujo de transferencias desde la navegación principal o desde el atajo del resumen para operar sin buscar la funcionalidad.

**Why this priority**: Integra el flujo con el resto de la demo; depende de US-002 para el atajo desde resumen.

**Independent Test**: Desde resumen o barra de navegación, abrir transferencias y verificar pantalla de selección de tipo.

**Acceptance Scenarios** (**SC-09**):

1. **Given** un usuario autenticado en el resumen, **When** usa el atajo de transferencias definido en US-002, **Then** llega a la pantalla de selección de tipo de transferencia.
2. **Given** un usuario autenticado, **When** selecciona la sección «Transferir» en la navegación inferior, **Then** llega a la pantalla de selección de tipo de transferencia.

---

### Edge Cases

- Visitante sin sesión intenta abrir cualquier paso del flujo de transferencias: redirección según reglas de US-001 (**SC-10**).
- Usuario selecciona «A terceros» en la pantalla de tipo: el sistema informa que la funcionalidad no está disponible en esta entrega y no inicia el flujo entre cuentas propias (**SC-11**).
- Monto en el límite inferior ($5.00) o superior ($2000.00): debe aceptarse como válido.
- Monto con decimales (p. ej. $10.50): debe aceptarse si está dentro del rango y no supera el saldo.
- Concepto vacío u omitido: la transferencia puede continuar; en revisión y comprobante se muestra vacío o texto acordado de «Sin concepto».
- Fallo al ejecutar la transferencia (error simulado o de servicio): el usuario permanece fuera del comprobante de éxito y recibe un mensaje comprensible con opción de reintentar o cancelar (**SC-12**).
- Usuario interrumpe el flujo con navegación atrás del navegador: debe poder retomar o salir sin ejecutar transferencia parcial ni mostrar comprobante de éxito sin confirmación explícita.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001** (**BR-01**): El flujo de transferencia entre cuentas propias MUST estar disponible únicamente para usuarios autenticados según las reglas de US-001.
- **FR-002** (**BR-02**): El sistema MUST presentar un flujo por pasos con cuatro etapas perceptibles: (1) selección de tipo de transferencia, (2) ingreso de datos, (3) revisión y confirmación, (4) comprobante de éxito.
- **FR-003** (**BR-03**): En la selección de tipo, el sistema MUST mostrar la opción «Entre mis cuentas» como entrada al flujo de esta feature y MUST mostrar «A terceros» como opción visible acorde a la maqueta; la opción «A terceros» MUST quedar fuera del alcance funcional de esta entrega.
- **FR-004** (**BR-04**): En el paso de ingreso, el usuario MUST poder ver y seleccionar cuenta origen y cuenta destino entre sus cuentas propias, con nombre, identificador de cuenta y saldo disponible.
- **FR-005** (**BR-05**): El usuario MUST poder intercambiar cuenta origen y destino desde el paso de ingreso cuando la maqueta lo prevea (acción de invertir cuentas).
- **FR-006** (**BR-06**): El monto a transferir MUST ser obligatorio y MUST aceptarse solo si está entre $5.00 y $2000.00 inclusive; fuera de ese rango el sistema MUST impedir continuar y MUST informar el rango permitido.
- **FR-007** (**BR-07**): El concepto MUST ser opcional; si el usuario no lo ingresa, la transferencia puede completarse.
- **FR-008** (**BR-08**): El sistema MUST impedir continuar si origen y destino son la misma cuenta.
- **FR-009** (**BR-09**): El sistema MUST impedir continuar si el monto supera el saldo disponible de la cuenta origen.
- **FR-010** (**BR-10**): En el paso de revisión, el sistema MUST mostrar monto, cuentas (destino con número enmascarado), concepto, comisión ($0.00 para transferencias entre cuentas propias) y aviso de ejecución inmediata antes de la confirmación explícita.
- **FR-011** (**BR-11**): La transferencia MUST ejecutarse solo tras la acción explícita «Transferir» en el paso de revisión.
- **FR-012** (**BR-12**): Tras ejecución exitosa, el sistema MUST mostrar un comprobante con indicador de éxito, monto, número de comprobante, fecha y hora, y detalle de la operación.
- **FR-013** (**BR-13**): Desde el comprobante, el usuario MUST poder iniciar una nueva transferencia, ir al resumen (inicio autenticado) o compartir la información del comprobante.
- **FR-014** (**BR-14**): Las acciones «Cancelar» en ingreso y revisión MUST abandonar el flujo sin ejecutar la transferencia y MUST devolver al usuario a la selección de tipo de transferencia.
- **FR-015** (**BR-15**): Los datos de cuentas, saldos y ejecución de transferencia en esta entrega MAY ser simulados o mock; las reglas de validación y el flujo por pasos MUST cumplirse en ese alcance de demo.
- **FR-016**: Las pantallas del flujo MUST alinearse visualmente con la referencia Figma indicada en _Design & References_ (estructura, jerarquía de información, acciones principales y secundarias).

### Key Entities

- **Transferencia entre cuentas propias**: Operación de movimiento de fondos de una cuenta del usuario hacia otra cuenta del mismo usuario; atributos: monto, concepto opcional, comisión, estado (borrador, confirmada, fallida).
- **Cuenta propia**: Cuenta perteneciente al usuario autenticado; atributos: nombre alias, tipo/número de cuenta, saldo disponible.
- **Borrador de transferencia**: Datos capturados en ingreso antes de confirmación (origen, destino, monto, concepto).
- **Comprobante**: Constancia post-éxito con monto, identificador de operación, fecha/hora y detalle replicado de la revisión.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100 % de los escenarios de aceptación **SC-01** a **SC-12** pueden ejecutarse manualmente o con pruebas automatizadas y obtener el resultado descrito en una sola pasada por escenario en entorno de demo.
- **SC-002**: Un usuario autenticado completa una transferencia válida entre cuentas propias (desde selección de tipo hasta comprobante) en menos de 3 minutos.
- **SC-003**: El 100 % de los intentos con monto fuera de [$5, $2000], misma cuenta origen/destino o saldo insuficiente son rechazados antes del paso de revisión, con mensaje comprensible al usuario.
- **SC-004**: Revisión de las cuatro pantallas del flujo frente a la maqueta Figma: un revisor de producto identifica selección de tipo, ingreso, revisión y comprobante sin ambigüedad estructural.
- **SC-005**: Tras una transferencia exitosa simulada, el comprobante muestra número de operación y marca temporal verificables (no vacíos) en el 100 % de las ejecuciones exitosas de prueba.

## Design & References

Referencias para planificación, diseño y trazabilidad; no sustituyen los requisitos funcionales anteriores.

| Tipo                | Referencia                                                                                                    | Uso en esta feature                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Figma (archivo)     | [Pantallas taller SDD](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD)              | Maqueta de las cuatro pantallas: TRANSFERENCIAS, TRANSFERIR, REVISAR TRANSFERENCIA y COMPROBANTE             |
| Historia previa     | [US-001 Pantalla de autenticación](../../docs/user-stories/US-001-pantalla-autenticacion/README.md)            | Sesión obligatoria y redirección de visitantes sin sesión                                                    |
| Historia previa     | [US-002 Landing — resumen de cuentas](../../docs/user-stories/US-002-landing-resumen-cuentas/README.md)       | Atajo desde resumen (**SC-09**) y contexto de cuentas del usuario                                          |
| Contrato de dominio | [POST `/transfer` — TransferRequest / TransferResponse](../../docs/technical-docs/api-transfer.md)            | Referencia de campos de transferencia para planificación; detalle de implementación fuera del alcance de esta spec |

## Assumptions

- **US-001** está implementada: solo usuarios autenticados acceden al flujo; visitantes sin sesión son redirigidos al login.
- **US-002** está implementada o en curso: el resumen expone cuentas del usuario y un atajo hacia transferencias coherente con **SC-09**.
- La opción «A terceros» se muestra por fidelidad a la maqueta pero no se implementa en esta entrega; al seleccionarla el usuario ve un aviso de funcionalidad no disponible (patrón alineado con placeholders de US-002 **BR-06**).
- La comisión para transferencias entre cuentas propias es $0.00 según la maqueta de revisión y comprobante.
- Las transferencias entre cuentas propias del mismo titular se procesan de forma inmediata en la demo (sin programación ni autorización adicional).
- Los saldos mostrados pueden ser mock; tras una transferencia exitosa simulada, los saldos pueden actualizarse en memoria o permanecer estáticos según acuerde la implementación, siempre que el flujo y las validaciones de monto frente al saldo mostrado sean coherentes en la sesión de demo.
- Moneda única: dólares estadounidenses ($), consistente con la maqueta.
- El intercambio de cuentas origen/destino es una acción de conveniencia en ingreso; no altera las reglas de validación.
- Compartir comprobante usa las capacidades nativas del navegador o dispositivo (sin integración con apps externas específicas).
