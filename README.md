# 🚨 SismoAlerta VE — Plataforma de Emergencia e Interconexión Civil

> **Una red resiliente, descentralizada y de código abierto para el registro y consulta de personas afectadas por desastres naturales en Venezuela.**

SismoAlerta VE nace como respuesta de ingeniería de software a situaciones de desastre (terremotos, inundaciones, deslaves). La plataforma permite registrar y consultar en tiempo real el estado de personas afectadas (**Desaparecido**, **Rescatado**, **Ubicado**, **Fallecido**), ofreciendo un modelo robusto que prioriza la interoperabilidad de datos, la resiliencia en redes inestables (Edge/3G) y la seguridad de la información para mitigar la propagación de noticias falsas.

---

## 🎯 Nuestra Visión: La Red Interconectada de Registro

Este repositorio no es solo una aplicación aislada, está diseñado como un **Nodo de Red de Emergencia**. El objetivo es que cualquier desarrollador, organización o comunidad pueda clonar, desplegar su propio nodo local de SismoAlerta VE y:
*   Conectar su frontend o aplicaciones móviles directamente a la API gracias a su política de **CORS abierto (`*`)**.
*   Interconectar bases de datos y sincronizar registros masivos mediante el sistema de **API Keys federado**.
*   Alimentar mapas interactivos de calor en tiempo real, sistemas GIS, o bots de mensajería (Telegram/WhatsApp) utilizando endpoints públicos sin restricciones de autenticación para lectura.

---

## ✨ Características Destacadas (Misión Crítica)

*   **API Totalmente Abierta e Interoperable (CORS Abierto):** Habilitamos CORS globalmente (`Access-Control-Allow-Origin: *`) en el backend. Esto permite que cualquier plataforma de emergencia aliada consuma los datos directamente desde el navegador sin bloqueos.
*   **Geolocalización GPS de Incidentes:** Captura de coordenadas físicas de precisión (Latitud y Longitud) mediante un solo clic usando la API de Geolocalización HTML5. Esencial para situar los últimos avistamientos en mapas satelitales.
*   **Historial de Auditoría Inmutable:** Cada cambio de estado de una persona afectada genera de manera obligatoria una traza histórica detallada (quién, cuándo, origen y motivo), previniendo la propagación de reportes falsos y de desinformación.
*   **Optimización para Redes Inestables (3G/Edge):** La SPA de Vue 3 purga el 100% de estilos no usados. El bundle total de producción pesa apenas **123 kB (JS)** y **26 kB (CSS)**, cargándose en menos de un segundo en conexiones móviles degradadas.
*   **Resiliencia ante Caídas (Offline-First Fallback):** El frontend puede funcionar de forma autónoma. Si la red móvil se cae o el backend pierde conexión, la SPA almacena temporalmente los reportes en local storage.
    > [!IMPORTANT]
    > **Permanencia de la Pestaña Abierta:** Es indispensable **mantener la pestaña del navegador abierta** mientras la conexión esté caída. Esto asegura que la cola interna de sincronización en caliente permanezca activa en memoria y pueda transmitir automáticamente los reportes acumulados al servidor en el instante en que retorne la señal.

---

## 🔒 Arquitectura de Seguridad y Roles

Para salvaguardar la integridad de los datos en situaciones de alta tensión, la plataforma implementa una estrategia de seguridad de capas:

```
[Cliente Anónimo (Web)] ──────> Lectura Pública y Reportes (Rate limit: 60 req/min)
[ONG / App Aliada] ───────────> API Key Hashed (x-api-key) (Rate limit: 1000+ req/min)
[Rescatista de Campo] ────────> Token JWT (Rol: RESCATISTA) (Cambio de Estado 2-clicks)
[Superadministrador] ─────────> Token JWT (Rol: SUPERADMIN) (Gestión de usuarios y Hard-delete)
```

### 1. Sistema de API Keys (Para Aplicaciones de Terceros)
*   Las aplicaciones aliadas, ONGs o bots de sincronización se autentican enviando la cabecera `x-api-key`.
*   Por seguridad, las claves **no se almacenan en texto plano** en la base de datos. Se utiliza un algoritmo hashing criptográfico **SHA-256** de un solo sentido.
*   El backend valida la cabecera hasheando la llave entrante y comparándola con los registros activos.
*   Cada API Key cuenta con su propio límite de rate limiting configurable para permitir escrituras y lecturas masivas.

### 2. Autenticación y Autorización por JWT Nativo
*   El backend no utiliza librerías de firmas pesadas que incrementen la superficie de ataque o el tamaño de la app. Implementa una utilidad nativa de firma y verificación JWT usando `crypto.createHmac` (HS256).
*   Los roles del sistema son:
    *   `RESCATISTA`: Personal autenticado de Protección Civil, Bomberos o Cruz Roja. Pueden cambiar el estado de las personas afectadas (`DESAPARECIDO` -> `RESCATADO`, etc.).
    *   `SUPERADMIN`: Administrador de TI. Capacidad de dar de alta nuevos usuarios, revocar API Keys y realizar eliminaciones físicas en base de datos.

### 3. Rate Limiting Inteligente y Adaptativo
*   **Usuarios Públicos/Anónimos:** 60 peticiones/minuto por dirección IP.
*   **Rescatistas Autenticados por JWT:** 500 peticiones/minuto por sesión.
*   **ONGs/Integraciones de Terceros:** 1000+ peticiones/minuto (configurable por API Key).

---

## 👥 Registro y Gestión de Usuarios (Paso a Paso)

En una plataforma de emergencia, **no debe existir el registro público de rescatistas**, ya que esto abriría la puerta a la manipulación malintencionada de información sobre sobrevivientes o fallecidos. El registro de usuarios sigue un modelo piramidal jerárquico controlado.

### Fase 1: Inicialización del Sistema (Bootstrap)
Cuando levantas el backend por primera vez, la base de datos está completamente vacía de usuarios. Para crear el primer superusuario (Bootstrap), el backend expone una vía de emergencia temporal:

*   **Endpoint:** `POST /api/v1/auth/bootstrap-admin`
*   **Descripción:** Registra al primer administrador general. **Este endpoint se bloquea automáticamente** en el instante en que el conteo de usuarios en base de datos sea mayor a `0`.
*   **Payload (JSON):**
    ```json
    {
      "nombre": "Administrador de Emergencia",
      "email": "admin@sismoalerta.ve",
      "password": "ClaveSuperSegura2026*"
    }
    ```
*   **Ejemplo cURL:**
    ```bash
    curl -X POST http://localhost:3000/api/v1/auth/bootstrap-admin \
      -H "Content-Type: application/json" \
      -d '{"nombre": "Admin Principal", "email": "admin@sismoalerta.ve", "password": "ClaveSuperSegura2026*"}'
    ```

### Fase 2: Registro de Nuevos Rescatistas (Por un Administrador)
Una vez que el Administrador Principal ha iniciado sesión (y obtenido su token JWT), es su responsabilidad registrar a los rescatistas autorizados (miembros de Protección Civil, Bomberos, etc.):

*   **Endpoint:** `POST /api/v1/auth/register`
*   **Acceso:** Privado (Solo accesible para usuarios con rol `SUPERADMIN` mediante token JWT).
*   **Payload (JSON):**
    ```json
    {
      "nombre": "Sgto. José Valero",
      "email": "jvalero@bomberos.ve",
      "password": "PasswordRescatista2026",
      "rol": "RESCATISTA"
    }
    ```
*   **Ejemplo cURL:**
    ```bash
    curl -X POST http://localhost:3000/api/v1/auth/register \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <TOKEN_JWT_DEL_ADMIN>" \
      -d '{"nombre": "Sgto. José Valero", "email": "jvalero@bomberos.ve", "password": "PasswordRescatista2026", "rol": "RESCATISTA"}'
    ```

---

## 🚀 Guía de Despliegue Local del Nodo

### Prerrequisitos
*   **Node.js** (v18 o superior)
*   **Docker** y **Docker Compose**
*   **npm**

### Paso 1: Clonar e Instalar Workspaces
```bash
git clone git@github.com:bigmario/sismoalertaVE.git
cd sismoalertaVE
npm install
```

### Paso 2: Iniciar Base de Datos PostgreSQL
Se incluye una configuración de PostgreSQL que utiliza el puerto alternativo **`5433`** para evitar conflictos con bases de datos nativas locales:
```bash
docker compose up -d
```

### Paso 3: Configurar y Desplegar API Backend
1. Crea el archivo `.env` en la carpeta `/backend` (puedes tomar el ejemplo provisto):
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sismoalerta_ve?schema=public"
   JWT_SECRET="sismoalerta-ve-secret-key-emergencia-2026"
   PORT=3000
   ```
2. Ejecuta las migraciones rápidas para inyectar la estructura de tablas e índices en PostgreSQL:
   ```bash
   cd backend
   npx prisma db push
   ```
3. Opcional: Si deseas poblar tu base de datos local con datos de prueba realistas (rescatistas demo, reportantes y afectados simulados), corre el sembrador:
   ```bash
   npx prisma db seed
   ```
4. Arranca el backend en modo desarrollo:
   ```bash
   cd ..
   npm run dev:backend
   ```
   *Acceso Swagger:* Abre [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs) para ver y probar la API.

### Paso 4: Iniciar Aplicación Web Frontend
Desde la raíz del proyecto, arranca el servidor de desarrollo del cliente:
```bash
npm run dev:frontend
```
*Acceso Web:* Entra a [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🔗 Cómo Conectar tu Propia App a este Nodo (Interconexión)

Cualquier aplicación externa (móvil, bots de alerta, tableros interactivos) puede leer la data de este nodo libremente:

### Consultar directorio de personas afectadas (Ejemplo en JavaScript/Fetch)
```javascript
fetch('http://localhost:3000/api/v1/afectados?q=Juan&limit=10')
  .then(res => res.json())
  .then(data => console.log("Personas encontradas:", data));
```

### Registrar avistamientos masivos (Usando API Key para ONGs)
```javascript
fetch('http://localhost:3000/api/v1/afectados', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'tu_api_key_cruda_provista_por_el_admin'
  },
  body: JSON.stringify({
    cedula: "V-12345678",
    nombre: "Juan",
    apellido: "Pérez",
    ultimo_avistamiento_direccion: "Chacao, Caracas",
    ultimo_avistamiento_lat: 10.4806,
    ultimo_avistamiento_lng: -66.9036,
    reportante: {
      nombre: "Representante de ONG",
      telefono: "04120000000",
      parentesco: "ONG Rescate"
    }
  })
});
```

---

## 📢 Licencia, Forks y Red de Nodos Abierta

¡Esta plataforma pertenece a la comunidad! Animamos activamente a desarrolladores, ONGs, universidades y entusiastas de la tecnología a hacer **Fork** de este repositorio, modificar el código y desplegar su propio nodo (sea público, privado o comunitario). 

### La Única Premisa: Mantener la Interconexión

Eres completamente libre de alterar la interfaz gráfica, cambiar los colores de advertencia, añadir filtros específicos de tu región o ajustar las tecnologías del frontend. Sin embargo, solicitamos que cualquier versión o derivado que desarrolles y pongas en producción **mantenga la premisa de la Red Interconectada**:

1.  **CORS Abierto y Endpoints Públicos:** Conservar los endpoints de consulta de personas (`GET /api/v1/afectados`) 100% abiertos (CORS a `*`) y sin tokens de acceso requeridos para lectura. Esto asegura que la información pueda ser mapeada por cualquier nodo vecino.
2.  **Facilitar la Integración:** Respetar los contratos de la API y el sistema de API Keys para que otros desarrolladores u ONGs puedan enganchar sus bots de rescate o sincronizadores de datos sin barreras cerradas.

*El impacto humanitario de esta herramienta crece exponencialmente con cada nodo interconectado. ¡Ayúdanos a evitar los silos de información en momentos de crisis!*

---

## 🤝 Contribuciones y Apoyo
Buscamos desarrolladores que deseen ayudar a mejorar la resiliencia de la plataforma:
*   Creación de adaptadores para sincronización P2P offline entre navegadores (WebRTC).
*   Integraciones con redes de radio digital para envío de coordenadas comprimidas.
*   Despliegue de nodos públicos en la nube (AWS / GCP / Vercel).

*¡Clona, despliega y comparte! Ayúdanos a preparar y proteger a las comunidades a través de la tecnología.*
