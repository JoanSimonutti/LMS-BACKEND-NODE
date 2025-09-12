# LMS Service Technical Interview

### Descripción general:

Esta es una implementación completa de un Sistema de Gestión de Aprendizaje (Learning Management System) que soporta módulos jerárquicos infinitos, autenticación de usuarios, seguimiento de lecciones y finalización de progreso. El sistema demuestra capacidades de desarrollo backend con TypeORM, Express.js y pruebas integrales.

### Arquitectura: implementación de niveles infinitos.

Apliqué el enfoque de niveles infinitos de módulos, que representa la solución avanzada a este desafío técnico. Esto permite un anidamiento ilimitado de módulos dentro de módulos, brindando máxima flexibilidad para estructuras de cursos complejas.

### Ejemplo de estructura soportada:

```
Curso 1:
  ├── Módulo 1
  │   ├── Lección 1.1
  │   ├── Lección 1.2
  │   └── Módulo 1.1
  │       ├── Lección 1.1.1
  │       └── Módulo 1.1.1
  │           └── Lección 1.1.1.1
  ├── Módulo 2
  │   ├── Lección 2.1
  │   └── Lección 2.2
  └── Módulo 3
      └── Lección 3.1
```

## Funcionalidades Implementadas

### Funcionalidad central del LMS

- **Gestión de Cursos**: Operaciones CRUD completas para cursos
- **Jerarquía infinita de Módulos**: Módulos autorreferenciados con anidamiento ilimitado
- **Gestión de Lecciones**: Sistema completo de lecciones dentro de módulos
- **Autenticación de Usuarios**: Autenticación basada en JWT con hash de contraseñas usando bcrypt
- **Seguimiento de Progreso**: Sistema de finalización que rastrea el progreso del usuario a través de las lecciones

### Funcionalidades técnicas

- **Diseño de Base de Datos Relacional**: MySQL con relaciones de claves foráneas
- **Tipado Estricto**: Implementación completa en TypeScript
- **Arquitectura Modular**: Separación clara de responsabilidades con controladores, servicios y modelos
- **Pruebas Completas**: 31 pruebas de integración cubriendo todos los endpoints
- **Configuración con Docker**: Contenerización completa con docker-compose
- **Validación de Datos**: Validación robusta de entradas y manejo de errores

## Stack Tecnológico

### Framework Backend

- **Express.js**: Framework para aplicaciones web
- **TypeORM**: Mapeo objeto-relacional con MySQL
- **TypeScript**: Implementación de JavaScript tipado

### Base de Datos

- **MySQL**: Base de datos relacional para persistencia de datos
- **Restricciones de Claves Foráneas**: Garantizando integridad de datos en las relaciones

### Autenticación y Seguridad

- **JWT (jsonwebtoken)**: Tokens de autenticación sin estado
- **bcrypt**: Hash seguro de contraseñas

### Pruebas

- **Jest**: Framework de testing con pruebas de integración
- **Supertest**: Librería de aserciones HTTP para testear APIs
- **Base de Datos de Pruebas**: Entorno aislado de test usando la misma configuración de MySQL

### DevOps

- **Docker & Docker Compose**: Contenerización y orquestación
- **Makefile**: Ejecución simplificada de comandos

## Esquema de Base de Datos

### Relaciones entre entidades

```
Usuarios (1) ←→ (N) Finalizaciones (N) ←→ (1) Lecciones
↓ (N)
Módulos (autorreferencia para jerarquía)
↓ (N)
Cursos (1)
```

### Decisiones clave de diseño

1. **Módulos autorreferenciados**: Implementados con clave foránea `moduleId` apuntando al módulo padre, habilitando anidamiento infinito
2. **Seguimiento de Finalizaciones**: Restricción única en `(userId, lessonId)` evitando duplicados
3. **Borrado en Cascada**: Limpieza adecuada al eliminar entidades padre
4. **Porcentaje de Progreso**: Seguimiento granular (0-100%) para cada lección completada

## Endpoints de la API

### Autenticación

- `POST /users/register` → Registro de usuario
- `POST /users/login` → Inicio de sesión (retorna token JWT)

### Gestión de Cursos

- `GET /courses` → Listar todos los cursos
- `GET /courses/:id` → Obtener curso específico
- `POST /courses` → Crear nuevo curso
- `PUT /courses/:id` → Actualizar curso
- `DELETE /courses/:id` → Eliminar curso

### Gestión de Módulos (Jerárquico)

- `GET /modules` → Listar módulos (filtrado por curso/padre)
- `GET /modules/:id` → Obtener módulo específico
- `POST /modules` → Crear nuevo módulo (raíz o hijo)
- `PUT /modules/:id` → Actualizar módulo
- `DELETE /modules/:id` → Eliminar módulo

### Gestión de Lecciones

- `GET /lessons` → Listar lecciones (filtrado por módulo)
- `GET /lessons/:id` → Obtener lección específica
- `POST /lessons` → Crear nueva lección
- `PUT /lessons/:id` → Actualizar lección
- `DELETE /lessons/:id` → Eliminar lección

### Seguimiento de Progreso

- `GET /completions` → Listar finalizaciones (filtrado)
- `GET /completions/:id` → Obtener finalización específica
- `POST /completions` → Marcar lección como completada
- `PUT /completions/:id` → Actualizar progreso
- `DELETE /completions/:id` → Eliminar finalización
- `GET /completions/user/:userId/progress` → Obtener resumen completo del progreso de un usuario

---

## Ejecución del Proyecto

### Requisitos previos

- Docker y Docker Compose instalados

### Comandos de configuración

Iniciar los servicios:

````bash
# MacOS/Linux
make

# Windows
docker compose up -d --build

Instalar dependencias:

```bash
# MacOS/Linux
make install

# Windows
docker-compose exec node npm install
````

Ejecutar el servidor de desarrollo:

```bash
# MacOS/Linux
make run

# Windows
docker-compose exec node npm run dev
```

Ejecutar la suite de pruebas:

```bash
# MacOS/Linux
make test

# Windows
docker-compose exec node npm run test
```

## Testing

### Enfoque de pruebas de integración

- **31 pruebas completas** cubriendo toda la funcionalidad principal
- **Pruebas con base de datos real** usando MySQL en Docker
- **Cobertura CRUD completa** para todas las entidades
- **Pruebas de relaciones** incluyendo estructuras jerárquicas de módulos
- **Flujo de autenticación** con JWT
- **Manejo de errores** con códigos de estado adecuados

### Categorías de pruebas

- Endpoint de health check
- Registro y autenticación de usuarios
- Operaciones CRUD de cursos
- Operaciones de jerarquía de módulos (raíz y anidados)
- Gestión de lecciones dentro de módulos
- Seguimiento de finalizaciones y cálculo de progreso

---

## Código y Arquitectura

### Patrones de diseño

- **Repository Pattern**: Capa de acceso a datos limpia mediante TypeORM
- **Service Layer**: Lógica de negocio separada en la autenticación de usuarios
- **Controller Pattern**: Manejo de request/response con gestión adecuada de errores
- **Estructura Modular**: Organización basada en funcionalidades que promueve la mantenibilidad

### Manejo de errores

- Respuestas de error estandarizadas en todos los endpoints
- Validación de entradas con mensajes significativos
- Códigos HTTP correctos para cada escenario
- Manejo de violaciones de restricciones de base de datos

### Consideraciones de seguridad

- Hash de contraseñas con bcrypt
- Autenticación basada en tokens JWT
- Sanitización y validación de entradas
- Restricciones de claves foráneas evitando registros huérfanos

### Consideraciones de Rendimiento

La implementación actual prioriza la corrección y la mantenibilidad. Para escalar en producción se recomienda considerar:

- **Cacheo**: Redis para datos de cursos/módulos accedidos frecuentemente
- **Indexación en la base de datos**: Consultas optimizadas para recorrer módulos jerárquicos
- **Paginación**: Para listados grandes de cursos o módulos
- **Pooling de conexiones**: Optimización de conexiones a la base de datos

---

<div align="end">

Realizado por [Joan Simonutti](https://www.linkedin.com/in/joansimonutti/) | Creada por @daviddionis | 2025

</div>
