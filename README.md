# 🌱 ROOTBLEND

<p align="center">
  <strong>Arquitectura distribuida base para una plataforma de streaming/contenido</strong>
</p>

<p align="center">
  Microservicios desacoplados · Gateway central · Mensajería · Chat en tiempo real
</p>

<p align="center">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-blue?style=for-the-badge&logo=docker">
  <img alt="Microservices" src="https://img.shields.io/badge/Architecture-Microservices-purple?style=for-the-badge">
  <img alt="RabbitMQ" src="https://img.shields.io/badge/RabbitMQ-Messaging-orange?style=for-the-badge&logo=rabbitmq">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Realtime%20Chat-yellow?style=for-the-badge&logo=firebase">
</p>

---

## ✨ Descripción rápida

**ROOTBLEND** es una arquitectura distribuida base para una plataforma de streaming/contenido, construida con microservicios desacoplados, gateway central, mensajería y chat en tiempo real.

Este proyecto fue diseñado para correr de forma consistente en distintas laptops sin depender de instalaciones manuales de Python, PHP, Composer, MySQL, RabbitMQ o Nginx en el sistema operativo local.

> 🧠 **Idea principal:** que cualquier integrante del equipo pueda levantar el proyecto de forma ordenada, reproducible y sin configurar manualmente todo el stack en su máquina.

---

## 📚 Tabla de contenido

- [1. Descripción general](#1-descripción-general)
- [2. Arquitectura](#2-arquitectura)
  - [2.1 Servicios backend](#21-servicios-backend)
  - [2.2 Infraestructura](#22-infraestructura)
  - [2.3 Servicios externos](#23-servicios-externos)
- [3. Tecnologías usadas](#3-tecnologías-usadas)
- [4. Estructura del proyecto](#4-estructura-del-proyecto)
- [5. Requisitos para correr el proyecto](#5-requisitos-para-correr-el-proyecto)
- [6. Variables de entorno](#6-variables-de-entorno)
- [7. Cómo levantar el proyecto](#7-cómo-levantar-el-proyecto)
- [8. Cómo probar que todo está bien](#8-cómo-probar-que-todo-está-bien)
- [9. RabbitMQ](#9-rabbitmq)
- [10. Resiliencia básica](#10-resiliencia-básica)
- [11. Flujo de trabajo diario](#11-flujo-de-trabajo-diario)
- [12. Si hago cambios de código, qué tengo que hacer](#12-si-hago-cambios-de-código-qué-tengo-que-hacer)
- [13. Si agrego librerías o dependencias, qué tengo que hacer](#13-si-agrego-librerías-o-dependencias-qué-tengo-que-hacer)
- [14. Git y trabajo en equipo](#14-git-y-trabajo-en-equipo)
- [15. Comandos útiles](#15-comandos-útiles)
- [16. Problemas comunes y soluciones](#16-problemas-comunes-y-soluciones)
- [17. Recomendaciones importantes](#17-recomendaciones-importantes)
- [18. Estado actual del proyecto](#18-estado-actual-del-proyecto)

---

# 1. 🧩 Descripción general

ROOTBLEND está compuesto por varios servicios independientes que se comunican mediante HTTP a través de un gateway y, a nivel de mensajería, por RabbitMQ.

Además, el chat del sistema utiliza Firebase Realtime Database.

La idea principal del proyecto es:

- 🧱 separar responsabilidades por microservicio
- 🚪 centralizar el acceso HTTP con Nginx
- 🛡️ permitir degradación parcial si un servicio falla
- 🐳 facilitar el arranque del proyecto en distintas máquinas usando Docker Compose

---

# 2. 🏗️ Arquitectura

La arquitectura de ROOTBLEND está pensada para separar responsabilidades, facilitar el mantenimiento y permitir que cada parte del sistema evolucione de forma independiente.

## 2.1 ⚙️ Servicios backend

| Servicio | Responsabilidad |
|---|---|
| `usuarios-service` | autenticación, perfil y preferencias |
| `canales-streaming-service` | canales y streaming |
| `estadisticas-service` | estadísticas y métricas |
| `podcasts-service` | podcasts |
| `interacciones-service` | interacciones |

## 2.2 🧰 Infraestructura

| Componente | Descripción |
|---|---|
| `gateway` | Nginx como punto de entrada único |
| `rabbitmq` | mensajería entre servicios |
| `frontend` | interfaz web React + Vite |
| `chat-service` | documentación/configuración del chat en Firebase |

## 2.3 ☁️ Servicios externos

- Firebase Realtime Database
- Railway MySQL

---

# 3. 🛠️ Tecnologías usadas

## 🎨 Frontend

- React
- Vite
- TypeScript

## 🧠 Backend

- Django 5.2.6
- Laravel 13
- MySQL en Railway

## 🐳 Infraestructura

- Docker
- Docker Compose
- Nginx
- RabbitMQ

## 💬 Chat en tiempo real

- Firebase Realtime Database

---

# 4. 🗂️ Estructura del proyecto

```text
rootblend/
  frontend/
  gateway/
  infra/
    rabbitmq/
  services/
    usuarios-service/
    canales-streaming-service/
    estadisticas-service/
    podcasts-service/
    interacciones-service/
    chat-service/
  docker-compose.yml
  README.md
```

---

# 5. ✅ Requisitos para correr el proyecto

## 💻 Instalar en la máquina local

Solo necesitas instalar:

- Git
- Docker Desktop
- Node.js LTS

## 🚫 No necesitas instalar aparte

Si vas a correr el proyecto con Docker Compose, no hace falta instalar manualmente:

- Python
- entornos virtuales de Python
- PHP
- Composer
- MySQL
- RabbitMQ
- Nginx

Todo eso ya corre dentro de Docker.

> 🐳 **Docker se encarga del entorno completo.**  
> Esto evita diferencias entre máquinas y reduce errores de configuración.

---

# 6. 🔐 Variables de entorno

Antes de levantar el proyecto, deben existir los archivos `.env` necesarios.

## 📄 Archivos requeridos

```text
services/usuarios-service/.env
services/canales-streaming-service/.env
services/estadisticas-service/.env
services/podcasts-service/.env
services/interacciones-service/.env
frontend/.env
```

## ⭐ Recomendación

Guardar ejemplos en:

```text
.env.example
```

y copiar a `.env` cuando se prepare una nueva máquina.

## 🔥 Variables del frontend

El frontend usa Firebase. Ejemplo:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

# 7. 🚀 Cómo levantar el proyecto

## Paso 1 — clonar el repositorio

```bash
git clone TU_URL_DEL_REPO
cd rootblend
```

## Paso 2 — abrir Docker Desktop

Muy importante: Docker Desktop debe estar abierto antes de usar `docker compose`.

## Paso 3 — verificar `.env`

Asegúrate de que existan los `.env` de cada servicio y del frontend.

## Paso 4 — levantar todo el sistema

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

Esto levantará:

- `usuarios-service`
- `canales-streaming-service`
- `estadisticas-service`
- `podcasts-service`
- `interacciones-service`
- `gateway`
- `rabbitmq`
- `frontend`

## Paso 5 — revisar estado

```bash
docker compose ps
```

Todos los servicios deben aparecer como `Up`.

---

# 8. 🧪 Cómo probar que todo está bien

## 🌐 Probar health checks por gateway

Abrir en el navegador:

```text
http://localhost:8080/api/usuarios-health/
http://localhost:8080/api/streams-health/
http://localhost:8080/api/stats-health/
http://localhost:8080/api/podcasts-health/
http://localhost:8080/api/interactions-health/
```

Cada endpoint debe responder con un JSON similar a:

```json
{
  "status": "ok",
  "service": "usuarios-service"
}
```

## 🖥️ Probar frontend

```text
http://localhost:5173
```

---

# 9. 🐇 RabbitMQ

## 📊 Panel web

Abrir:

```text
http://localhost:15672
```

## 🔑 Credenciales

| Campo | Valor |
|---|---|
| usuario | `rootblend` |
| contraseña | `rootblend123` |

## 📬 Colas esperadas

```text
usuarios.events
canales.events
estadisticas.events
podcasts.events
interacciones.events
```

---

# 10. 🛡️ Resiliencia básica

El sistema está preparado para que, si un servicio cae, los demás sigan funcionando.

## 💥 Probar caída de un servicio

Ejemplo: detener estadísticas.

```bash
docker stop rootblend-estadisticas-service
```

## ❌ Probar que falló solo ese servicio

```text
http://localhost:8080/api/stats-health/
```

Debe fallar.

## ✅ Probar que otro servicio sigue vivo

```text
http://localhost:8080/api/podcasts-health/
```

Debe seguir funcionando.

## 🔁 Volver a levantar el servicio caído

```bash
docker compose up -d estadisticas-service
```

---

# 11. 🧑‍💻 Flujo de trabajo diario

## 🌅 Para empezar a trabajar

1. abrir Docker Desktop
2. entrar al proyecto
3. correr:

```bash
docker compose up --build -d
```

4. verificar:

```bash
docker compose ps
```

5. abrir:

```text
frontend  → http://localhost:5173
gateway   → http://localhost:8080
RabbitMQ  → http://localhost:15672
```

## 🌙 Para terminar de trabajar

```bash
docker compose down
```

---

# 12. 🔄 Si hago cambios de código, qué tengo que hacer

Depende del tipo de cambio.

## Caso A — solo cambias código fuente

Ejemplos:

- cambias vistas de Django
- cambias controladores de Laravel
- cambias componentes React
- cambias rutas
- cambias estilos

## 💡 Recomendación

Reconstruir el servicio afectado o reconstruir todo.

### Un servicio específico

```bash
docker compose up --build -d usuarios-service
```

### Todo el proyecto

```bash
docker compose up --build -d
```

## Caso B — solo cambias frontend

```bash
docker compose up --build -d frontend
```

---

# 13. 📦 Si agrego librerías o dependencias, qué tengo que hacer

Cuando agregas dependencias nuevas, Docker no las instala automáticamente en contenedores ya existentes.

Tienes que reconstruir.

## 🐍 Django

Si cambias `requirements.txt`, por ejemplo:

```txt
djangorestframework==...
```

entonces debes reconstruir el servicio:

```bash
docker compose up --build -d usuarios-service
```

o todo:

```bash
docker compose up --build -d
```

## 🧬 Laravel

Si cambias:

```text
composer.json
composer.lock
```

entonces debes reconstruir:

```bash
docker compose up --build -d podcasts-service
```

o:

```bash
docker compose up --build -d interacciones-service
```

## ⚛️ Frontend

Si cambias:

```text
package.json
package-lock.json
```

por ejemplo al hacer:

```bash
npm install axios
```

entonces debes reconstruir:

```bash
docker compose up --build -d frontend
```

## 🧠 Regla simple

Si cambias dependencias:

> 🚨 **siempre rebuild**

```bash
docker compose up --build -d
```

---

# 14. 🤝 Git y trabajo en equipo

## 🔎 Ver estado del repositorio

```bash
git status
```

## ➕ Agregar cambios

```bash
git add .
```

## 💬 Hacer commit

```bash
git commit -m "mensaje descriptivo"
```

## ⬆️ Subir cambios al remoto

```bash
git push
```

## ⬇️ Jalar cambios del remoto

```bash
git pull
```

## 🌱 Flujo recomendado antes de trabajar

Antes de empezar cambios nuevos:

```bash
git pull
docker compose up --build -d
```

## 🚢 Flujo recomendado antes de subir cambios

```bash
git status
git add .
git commit -m "mensaje descriptivo"
git push
```

---

# 15. 🧾 Comandos útiles

## 🚀 Levantar todo

```bash
docker compose up --build -d
```

## 📌 Ver estado

```bash
docker compose ps
```

## 📜 Ver logs de todo

```bash
docker compose logs -f
```

## 🔍 Ver logs de un servicio

```bash
docker compose logs -f usuarios-service
docker compose logs -f gateway
docker compose logs -f podcasts-service
```

## 🛑 Bajar todo

```bash
docker compose down
```

## 🔁 Reiniciar un servicio

```bash
docker compose restart usuarios-service
```

## ▶️ Levantar un solo servicio

```bash
docker compose up -d estadisticas-service
```

## ✅ Validar `docker-compose.yml`

```bash
docker compose config
```

---

# 16. 🧯 Problemas comunes y soluciones

## ❌ Error: Docker no responde

Ejemplo:

```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

### ✅ Solución

1. abrir Docker Desktop
2. esperar a que inicie
3. volver a correr el comando

---

## ❌ Error: puerto ocupado

Ejemplo:

```text
Bind for 0.0.0.0:8003 failed: port is already allocated
```

### ✅ Solución en Windows

```bat
netstat -ano | findstr :8003
taskkill /PID TU_PID /F
```

Luego volver a levantar:

```bash
docker compose up --build -d
```

---

## ❌ Error: 502 Bad Gateway

Significa que Nginx está vivo, pero el servicio de esa ruta está caído.

### 🔎 Revisar estado

```bash
docker compose ps
```

### 🔧 Levantar servicio específico

```bash
docker compose up -d estadisticas-service
```

---

## ❌ Error en YAML / docker-compose

Validar con:

```bash
docker compose config
```

Si falla, el problema está en la indentación o estructura del `docker-compose.yml`.

---

## ❌ Error al agregar dependencias

Si agregaste paquetes y el contenedor no los reconoce, faltó reconstruir.

Usar:

```bash
docker compose up --build -d
```

---

# 17. ⭐ Recomendaciones importantes

## 🔐 Seguridad

No subir credenciales reales a un repositorio público.

Lo recomendado es:

- usar `.env.example`
- mantener `.env` reales fuera del repo
- compartir secretos por un canal privado

## 👥 Trabajo en equipo

Para evitar conflictos:

- todos usen Docker Desktop
- todos usen Node.js LTS
- correr backend siempre con Docker Compose
- evitar levantar servicios manualmente fuera de Docker si ya están en Compose

---

# 18. 📌 Estado actual del proyecto

Actualmente ROOTBLEND ya cuenta con:

- frontend en Docker
- microservicios Django
- microservicios Laravel
- gateway Nginx
- RabbitMQ
- Firebase para chat
- Docker Compose funcional
- endpoints `/health`
- resiliencia básica validada

## 🧭 Próximos pasos sugeridos

- integración real de RabbitMQ entre servicios
- documentación por microservicio
- observabilidad y logs
- entornos dev/staging/prod
- automatización de despliegue

---

<p align="center">
  <strong>🌱 ROOTBLEND — listo para crecer como arquitectura base de streaming y contenido.</strong>
</p>
