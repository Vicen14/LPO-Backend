# Le Petit Olivier Chile - Backend & Catálogo Web

Backend desarrollado en **FastAPI (Python)** con base de datos **PostgreSQL alojada en Supabase**, junto con el catálogo web para **Le Petit Olivier Chile**.

---

## Requisitos Previos

Antes de comenzar, asegúrate de contar con lo siguiente en tu sistema:

* **Python** (versión 3.9 o superior)
* **pip** (gestor de paquetes de Python)
* **Node.js** (opcional, necesario únicamente si ejecutas el script de generación estática de productos en `scripts/`)
* **Cuenta en Supabase** con un proyecto PostgreSQL creado

Verifica tus versiones instaladas:

```bash
python --version
pip --version
```

---

## Componentes y Dependencias a Instalar

El backend está construido con Python y FastAPI. A continuación se detallan los componentes principales:

### Dependencias Principales

* **fastapi**: Framework web moderno, rápido y asíncrono para construir la API REST.
* **uvicorn[standard]**: Servidor ASGI de alto rendimiento para correr la aplicación FastAPI.
* **pydantic**: Validación y tipado estricto de datos para los modelos y esquemas de entrada/salida.
* **pydantic-settings**: Manejo robusto de configuraciones y variables de entorno.
* **supabase**: SDK oficial de Supabase para Python, facilitando la interacción con la base de datos, autenticación y storage.
* **sqlalchemy**: ORM SQL para modelar y consultar las tablas de PostgreSQL (opcional si se utiliza conexión directa/ORM).
* **psycopg2-binary**: Adaptador de base de datos PostgreSQL para Python.
* **python-dotenv**: Carga de credenciales y variables de entorno desde el archivo `.env`.

---

## Instalación Paso a Paso

### 1. Crear y activar el entorno virtual

En la raíz del proyecto:

**En Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**En Windows (Git Bash) / Linux / macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

### 2. Instalar las dependencias de Python

Puedes instalar los paquetes directamente:

```bash
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings supabase sqlalchemy psycopg2-binary python-dotenv
```

O si utilizas el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o dentro del directorio del servidor) con las credenciales de tu proyecto en Supabase:

```env
# Configuración Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-anon-o-service-role
SUPABASE_DB_PASSWORD=tu-contraseña-de-base-de-datos

# Conexión directa a PostgreSQL (Database URI de Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Configuración del Servidor
PORT=8000
HOST=0.0.0.0
```

---

## Uso y Ejecución

### Iniciar el Servidor FastAPI

Con el entorno virtual activado, ejecuta:

```bash
# Modo desarrollo con recarga automática
uvicorn server.main:app --reload --port 8000
```

La API estará disponible en:
* API Base: `http://localhost:8000`
* Documentación interactiva (Swagger UI): `http://localhost:8000/docs`
* Documentación alternativa (ReDoc): `http://localhost:8000/redoc`

### Generador de Páginas de Productos (Opcional)

Si requieres regenerar las páginas estáticas HTML del catálogo a partir de los datos locales:

```bash
node scripts/generate-products.js
```

### Visualizar el Frontend

Puedes abrir los archivos `.html` (como `index.html` o `products.html`) directamente en el navegador o mediante un servidor estático local:

```bash
npx live-server
```

---

## Endpoints Principales de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Obtiene la lista completa de productos desde Supabase/PostgreSQL |
| `GET` | `/api/products/{id}` | Obtiene el detalle de un producto por su ID |
| `POST` | `/api/products` | Crea un nuevo producto en la base de datos |
| `PUT` | `/api/products/{id}` | Actualiza los datos de un producto existente |
| `DELETE` | `/api/products/{id}` | Elimina un producto por su ID |
| `GET` | `/docs` | Documentación interactiva Swagger UI |

---

## Estructura del Proyecto

```text
LPO-Backend/
├── css/                   # Hojas de estilo personalizadas y responsivas
├── images/                # Recursos multimedia, logos y fotos de productos
├── js/                    # Lógica frontend y scripts de catálogo
├── productos/             # Páginas HTML generadas por categoría de producto
├── scripts/               # Scripts auxiliares de generación estática
│   ├── generate-products.js
│   └── template-producto.html
├── server/                # Backend API REST con FastAPI
│   ├── main.py            # Punto de entrada de la aplicación FastAPI
│   ├── database.py        # Conexión con Supabase / PostgreSQL
│   ├── models.py          # Modelos de base de datos
│   ├── schemas.py         # Esquemas de validación Pydantic
│   └── routes/            # Rutas y controladores de la API
├── .env                   # Variables de entorno (no subir a git)
├── requirements.txt       # Lista de dependencias de Python
├── blog.html              # Vista de Blog
├── faq.html               # Vista de Preguntas Frecuentes
├── history.html           # Vista Nosotros / Historia
├── index.html             # Página principal
├── products.html          # Catálogo interactivo de productos
└── README.md              # Documentación del proyecto
```

---

## Librerías Frontend (vía CDN)

El frontend web interactúa con la API y utiliza los siguientes recursos vía CDN:

* **Bootstrap 5.3**: Framework CSS para layout y componentes de interfaz.
* **Font Awesome 6.4**: Iconografía.
* **Google Fonts**: Familias tipográficas *Playfair Display* y *Montserrat*.
