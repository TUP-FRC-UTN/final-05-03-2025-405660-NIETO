[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/eY76ATs2)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18545406&assignment_repo_type=AssignmentRepo)

**Objetivo:**
Desarrollar una aplicación en Angular que permita a los usuarios buscar y reservar pasajes de transporte utilizando formularios reactivos. La aplicación debe incluir validaciones, navegación fluida y estilos con Bootstrap. Además, debe integrarse con APIs proporcionadas para obtener ciudades, servicios y gestionar reservas.

---

### Requisitos:

#### 1. Barra de Navegación:
- Implementar una barra de navegación con enlaces a las siguientes páginas:
    - **Reservar Pasaje** (Buscar servicios y reservar pasajes).
    - **Listado de Reservas** (Ver todas las reservas).

---

#### 2. Página de Reserva de Pasajes:

##### **Formulario de Búsqueda de Servicios:**
- **Campo Origen** (Requerido, selección desplegable).
- **Campo Destino** (Requerido, selección desplegable).
- **Campo Fecha** (Requerido, seleccionar fecha de viaje).
- **Botón Buscar** (Deshabilitado hasta que el formulario sea válido. Al hacer clic, busca servicios disponibles en la API).

##### **Formulario de Reserva:**
- **Desplegable de Servicios Disponibles** (Se llena con los servicios obtenidos de la API. Muestra: Fecha y Hora de Salida - Fecha y Hora de Llegada).
- **Campo Documento** (Requerido, mínimo 6 caracteres, numérico, validación asíncrona para verificar si el documento ya tiene una reserva para el servicio seleccionado).
- **Campo Nombre** (Requerido, mínimo 2 caracteres).
- **Campo Apellido** (Requerido, mínimo 2 caracteres).
- **FormArray de Pasajeros**:
    - Permitir la adición dinámica de pasajeros. Cada pasajero debe tener:
        - Documento (Requerido, mínimo 6 caracteres, numérico).
        - Nombre (Requerido, mínimo 2 caracteres).
        - Apellido (Requerido, mínimo 2 caracteres).
    - Agregar un botón para añadir más pasajeros dinámicamente.
- **Botón Confirmar Reserva** (Deshabilitado hasta que el formulario sea válido. Al hacer clic, envía una solicitud POST a la API con los datos de la reserva).

##### **Generación del Código de Reserva:**
- Al confirmar la reserva, generar un código de reserva con el siguiente formato:
    - `<Iniciales del Nombre y Apellido><Últimos 3 Dígitos del Documento>--<Identificador Único>`.
    - Ejemplo: Para Carlos Pérez (Documento: 1234567), el código podría ser: `CP567-XYZ987`.

---

#### 3. Página de Listado de Reservas:
- Mostrar una tabla con las siguientes columnas:
    - Código de Reserva.
    - Documento.
    - Nombre.
    - Apellido.
    - Fecha y Hora de Salida.

---

#### 4. APIs y Endpoints:

##### **API de Ciudades**:
- **Endpoint**: `https://679b8dc433d31684632448c9.mockapi.io/cities`
- **Respuesta**:
  ```json
  [
    { "city": "Buenos Aires", "id": "1" },
    { "city": "Córdoba", "id": "2" },
    { "city": "Rosario", "id": "3" },
    { "city": "Mendoza", "id": "4" },
    { "city": "Santa Fe", "id": "5" }
  ]
  ```
- **Uso**: Llenar los desplegables de **Origen** y **Destino**. Cuando se selecciona un origen, el desplegable de destino debe excluir la ciudad seleccionada como origen.

##### **API de Servicios**:
- **Endpoint**: `https://679b8dc433d31684632448c9.mockapi.io/services`
- **Respuesta**:
  ```json
  [
    {
      "id": "1",
      "origin": 1,
      "destination": 2,
      "departureDate": "2025-03-10",
      "departureTime": "10:00",
      "arrivalDate": "2025-03-11",
      "arrivalTime": "12:00"
    },
    {
      "id": "2",
      "origin": 2,
      "destination": 3,
      "departureDate": "2025-03-10",
      "departureTime": "08:00",
      "arrivalDate": "2025-03-11",
      "arrivalTime": "09:00"
    }
  ]
  ```
- **Uso**: Obtener servicios disponibles según el origen, destino y fecha seleccionados.

##### **API de Reservas**:
- **Endpoint**: `https://671fe287e7a5792f052fdf93.mockapi.io/reservations`
- **Respuesta GET**:
  ```json
  [
    {
      "id": "d19b",
      "document": "1231234",
      "firstName": "Juan",
      "lastName": "Perez",
      "service": "1",
      "reservationCode": "JP234-7QY1NL",
      "passengers": [
        {
          "document": "1231234",
          "firstName": "Juan",
          "lastName": "Perez"
        },
        {
          "document": "4567890",
          "firstName": "Maria",
          "lastName": "Gomez"
        }
      ]
    }
  ]
  ```
- **Ejemplo de Solicitud POST**:
  ```json
  {
    "document": "1231234",
    "firstName": "Juan",
    "lastName": "Perez",
    "service": "1",
    "passengers": [
      {
        "document": "1231234",
        "firstName": "Juan",
        "lastName": "Perez"
      },
      {
        "document": "4567890",
        "firstName": "Maria",
        "lastName": "Gomez"
      }
    ]
  }
  ```

---

#### 5. Funcionalidades Adicionales:
- Usar **Bootstrap** para estilos y diseño responsivo.
- Implementar **formularios reactivos** con validaciones síncronas y asíncronas.
- Manejar errores en los formularios y mostrar mensajes claros al usuario.
- Asegurar una navegación fluida entre páginas usando la barra de navegación.

---

### Ejemplo de Flujo de Trabajo:
1. **Buscar Servicios**:
    - El usuario selecciona origen, destino y fecha.
    - Hace clic en "Buscar" para obtener servicios disponibles.
2. **Reservar Pasaje**:
    - El usuario selecciona un servicio del desplegable.
    - Añade detalles de los pasajeros usando el `FormArray` dinámico.
    - Hace clic en "Confirmar Reserva" para reservar el pasaje.
3. **Ver Reservas**:

    - El usuario navega a la página de listado de reservas para ver todas las reservas.

---
---
### Mockups:
![WhatsApp Image 2025-03-04 at 10 33 47](https://github.com/user-attachments/assets/2b8f1930-1a06-4299-938d-2986de77adef)
![WhatsApp Image 2025-03-04 at 10 33 38](https://github.com/user-attachments/assets/2bc5a814-8c5d-4be1-90a5-46bdb9bb7a0d)

---
### Puntajes:
- Navegación y Rutas: **5 puntos**
- Estilos con Bootstrap: **10 puntos**
- Listado de Reservas: **15 puntos**
- Formulario de Búsqueda: **20 puntos**
- Formulario de Reserva con `FormArray`: **30 puntos**
- Validación Asíncrona: **10 puntos**
- Generación de Código de Reserva: **10 puntos**

---
