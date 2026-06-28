# SismoAlerta VE - Plataforma de Emergencia

SismoAlerta VE es una plataforma web de emergencia y registro civil diseñada para situaciones de catástrofe tras el reciente sismo en Venezuela. Su propósito es facilitar el reporte, búsqueda y actualización del estado de personas afectadas (**Desaparecido**, **Rescatado**, **Ubicado**, **Fallecido**).

La arquitectura del sistema está diseñada para ser altamente concurrente, robusta ante caídas, y optimizada para redes móviles de bajo ancho de banda (3G/Edge).

---

## 🛠️ Estructura del Monorepo

El proyecto está organizado en un espacio de trabajo modular (`workspaces` de npm):

```
├── backend/            # API REST en NestJS con Prisma ORM y PostgreSQL
├── frontend/           # SPA en Vue 3 con Vite y Tailwind CSS
├── docker-compose.yml  # Definición del contenedor PostgreSQL de base de datos
├── package.json        # Configuración de workspaces de npm
└── README.md           # Guía de despliegue y uso
```

---

## 📖 Documentación de la API (Swagger)

Una vez que el servidor backend esté en ejecución, puedes consultar e interactuar con todos los endpoints de la API abierta (públicos y protegidos) a través de la interfaz interactiva de Swagger:
*   **Swagger UI:** [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

---

## ✨ Características Destacadas (Resiliencia e Integración)

SismoAlerta VE se diseñó bajo principios de ingeniería de misión crítica para garantizar la máxima disponibilidad e interoperabilidad en escenarios de desastre:

*   **API Totalmente Abierta e Interoperable (CORS Abierto):** Habilitamos CORS globalmente (`Access-Control-Allow-Origin: *`) en el backend. Esto permite que cualquier plataforma aliada, mapas de calor (ej. Mapbox, Google Maps) o widgets informativos puedan consumir los datos directamente desde el navegador sin bloqueos.
*   **Lectura Libre de Datos:** Los endpoints de consulta (`GET /api/v1/afectados` y `GET /api/v1/afectados/:id`) son 100% públicos y no requieren autenticación, facilitando la libre difusión de la información.
*   **Geolocalización GPS Exacta:** Captura precisa de coordenadas de incidentes (Latitud y Longitud) recolectadas a través de la API de Geolocalización HTML5 del navegador con un solo click. Esto permite ubicar en mapas satelitales los últimos avistamientos físicos.
*   **Historial de Auditoría Inmutable:** Cada cambio de estado de una persona afectada genera de manera obligatoria una traza histórica detallada (quién, cuándo, origen y motivo), previniendo la propagación de reportes falsos.
*   **Gestión de Tráfico Adaptativa:** El Rate Limiting global (60 req/min) se expande de forma dinámica al usar API Keys institucionales de ONGs (1000+ req/min) para permitir integraciones masivas y sincronizaciones por lotes.
*   **Resiliencia ante Redes Inestables (Offline-First Fallback):** El frontend está desarrollado para funcionar de forma autónoma. Si la red móvil se degrada (Edge/3G) o el backend se desconecta, la SPA almacena y sincroniza localmente (`localStorage`), asegurando que ningún reporte se pierda.
    > [!IMPORTANT]
    > **Permanencia de la Pestaña Abierta:** Es indispensable **mantener la pestaña del navegador abierta** mientras la conexión esté caída. Esto asegura que la cola interna de sincronización en caliente permanezca activa en memoria y pueda transmitir automáticamente los reportes acumulados al servidor en el instante en que retorne la señal.

---

## 🚀 Guía de Despliegue Local (Paso a Paso)

### Prerrequisitos
*   **Node.js** (v18 o superior recomendado)
*   **Docker** y **Docker Compose**
*   **npm** (incluido con Node.js)

### Paso 1: Instalación de Dependencias
Desde la raíz del proyecto, ejecuta el siguiente comando para instalar automáticamente todas las dependencias del monorepo (backend y frontend):
```bash
npm install
```

---

### Paso 2: Despliegue de la Base de Datos
Para facilitar el despliegue local, se incluye un archivo de Docker Compose configurado con PostgreSQL 16 sobre el puerto **`5433`** (evitando conflictos con bases de datos nativas del sistema).

1. Levanta el contenedor de la base de datos en segundo plano:
   ```bash
   docker compose up -d
   ```
2. Puedes verificar que la base de datos esté corriendo con:
   ```bash
   docker compose ps
   ```

---

### Paso 3: Configuración y Despliegue del Backend
El backend está desarrollado en NestJS y utiliza Prisma como ORM para la comunicación con PostgreSQL.

1. **Configurar el entorno:**
   En la carpeta `/backend` se encuentra el archivo `.env`. Si no existe, puedes crearlo con la siguiente configuración estándar:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sismoalerta_ve?schema=public"
   JWT_SECRET="sismoalerta-ve-secret-key-emergencia-2026"
   PORT=3000
   ```
2. **Sincronizar el esquema de base de datos:**
   Ejecuta el siguiente comando desde la raíz del proyecto para crear las tablas e índices optimizados en PostgreSQL:
   ```bash
   cd backend
   npx prisma db push
   ```
3. **Iniciar el servidor backend (modo desarrollo):**
   Regresa a la raíz del proyecto y ejecuta:
   ```bash
   npm run dev:backend
   ```
   El backend se levantará en: **`http://localhost:3000`**
   *   **Documentación Interactiva (Swagger):** Podrás probar todos los endpoints y ver la firma OpenAPI en: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs).

---

### Paso 4: Despliegue del Frontend
El frontend es una aplicación web de una sola página (SPA) ultra-ligera en Vue 3 y Tailwind CSS.

1. **Iniciar el servidor frontend (modo desarrollo):**
   Desde la raíz del proyecto, ejecuta:
   ```bash
   npm run dev:frontend
   ```
2. **Acceder a la aplicación:**
   Abre tu navegador en: **`http://localhost:5173`**
   
   *   **Nota sobre el Modo Standalone (Mock):** Si el backend no está corriendo, el frontend entrará automáticamente en modo demostración guardando y sincronizando los reportes localmente en el navegador (`localStorage`). Al conectarse la API, se integrará de forma fluida.

---

## ⚡ Comandos Disponibles (Raíz del Proyecto)

*   `npm install` - Instala dependencias en todo el monorepo.
*   `npm run dev:backend` - Inicia el backend de NestJS en modo "watch" (hot-reload).
*   `npm run dev:frontend` - Inicia el dev-server del frontend en Vite.
*   `npm run build:backend` - Compila el backend en NestJS a JavaScript nativo en `/backend/dist`.
*   `npm run build:frontend` - Compila el frontend purgado y optimizado para producción en `/frontend/dist`.

---

## 🔒 Seguridad y Consumo de API
*   **Peticiones Públicas:** Los endpoints de consulta (`GET /api/v1/afectados`) cuentan con Rate Limiting estricto (60 peticiones/minuto) para evitar ataques de denegación de servicio (DoS) durante la emergencia.
*   **Rescatistas en Campo:** Requieren autenticación JWT (cabecera `Authorization: Bearer <token>`) para actualizar estados.
*   **ONGs y Aliados:** Pueden consumir la API mediante cabeceras `x-api-key`. Esto les otorga una mayor cuota de consumo y permite la sincronización masiva de datos. Las llaves de API son generadas por los administradores y almacenadas hasheadas (SHA-256) por seguridad.
