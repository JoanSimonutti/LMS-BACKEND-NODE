# Learning Management System | Backend en Node.js + TypeORM

### Descripción

Este es un backend completo para un **Sistema de Gestión de Aprendizaje (LMS)**.  
Soporta jerarquías infinitas de módulos, gestión de cursos y lecciones, autenticación de usuarios, seguimiento de progreso y finalización de contenidos.

El sistema está desarrollado con **Node.js, Express, TypeORM y TypeScript**, con una arquitectura modular, validación robusta y pruebas integrales.

### Arquitectura: Jerarquía infinita de módulos

Se implementó un modelo de datos que permite anidar módulos de forma ilimitada, lo que habilita la construcción de cursos complejos con múltiples niveles de profundidad.

### Ejemplo de estructura soportada

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

---

## Funcionalidades Implementadas

### Core del LMS

- **Gestión de Cursos**: CRUD completo
- **Módulos jerárquicos infinitos**: autorreferencia con anidamiento ilimitado
- **Gestión de Lecciones**: CRUD completo dentro de módulos
- **Autenticación de Usuarios**: JWT + contraseñas hasheadas con bcrypt
- **Seguimiento de Progreso**: sistema de finalización con tracking granular

### Funcionalidades técnicas

- **Base de datos relacional con MySQL** y claves foráneas
- **TypeScript con tipado estricto**
- **Arquitectura modular** (controladores, servicios, repositorios)
- **Pruebas integrales** con Jest + Supertest (31 tests)
- **Contenerización con Docker** (docker-compose + Makefile)
- **Validación de datos y manejo de errores estandarizado**

---

## Stack Tecnológico

- **Backend**: Node.js, Express.js, TypeORM, TypeScript
- **Base de Datos**: MySQL (relaciones + restricciones de integridad)
- **Autenticación**: JWT + bcrypt
- **Testing**: Jest, Supertest, MySQL aislado en entorno de test
- **DevOps**: Docker, Docker Compose, Makefile

---

## Esquema de Base de Datos

```
Usuarios (1) ←→ (N) Finalizaciones (N) ←→ (1) Lecciones
↓ (N)
Módulos (autorreferencia para jerarquía)
↓ (N)
Cursos (1)
```

### Decisiones diseño

1. **Módulos autorreferenciados** con clave foránea `moduleId`
2. **Finalizaciones únicas** por `(userId, lessonId)` evitando duplicados
3. **Borrado en Cascada** para mantener integridad
4. **Porcentaje de Progreso** granular (0-100%)

---

## Endpoints de la API

### Autenticación

- `POST /users/register` → Registro de usuario
- `POST /users/login` → Inicio de sesión (JWT)

### Cursos

- `GET /courses` → Listar todos los cursos
- `GET /courses/:id` → Obtener curso específico
- `POST /courses` → Crear nuevo curso
- `PUT /courses/:id` → Actualizar curso
- `DELETE /courses/:id` → Eliminar curso

### Módulos (Jerárquico)

- `GET /modules` → Listar módulos (filtrado por curso/padre)
- `GET /modules/:id` → Obtener módulo específico
- `POST /modules` → Crear nuevo módulo (raíz o hijo)
- `PUT /modules/:id` → Actualizar módulo
- `DELETE /modules/:id` → Eliminar módulo

### Lecciones

- `GET /lessons` → Listar lecciones (filtrado por módulo)
- `GET /lessons/:id` → Obtener lección específica
- `POST /lessons` → Crear nueva lección
- `PUT /lessons/:id` → Actualizar lección
- `DELETE /lessons/:id` → Eliminar lección

### Progreso

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

Ejecutar la suite de pruebas (ver testing):

```bash
# MacOS/Linux
make test

# Windows
docker-compose exec node npm run test
```

---

## Testing

- **31 pruebas completas** (CRUD + autenticación + jerarquía)
- **Pruebas con base de datos real** en Docker
- **Validación de relaciones jerárquicas**
- **Manejo de errores y códigos de estado**

## Código y Arquitectura

- **Repository Pattern** (acceso a datos con TypeORM)
- **Service Layer** (lógica de negocio desacoplada)
- **Controller Pattern** (request/response + validaciones)
- **Estructura modular por funcionalidades**

## Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Validación y sanitización de inputs
- Integridad de datos con claves foráneas

## Rendimiento futuro

- **Cache con Redis**
- **Indexación en la base de datos**
- **Paginación en listados grandes**
- **Pooling de conexiones**

---

<div align="end">

Realizado por [Joan Simonutti](https://www.linkedin.com/in/joansimonutti/) | 2025

</div>
