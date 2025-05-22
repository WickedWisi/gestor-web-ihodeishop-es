# 🧩 Extensión de Gestión Web – iHodeiShop

Extensión de Google Chrome diseñada para gestionar de forma rápida y segura los contenidos de las webs **ihodeishop.com** e **ihodeishop.es**. Permite realizar operaciones sobre productos, paquetes de horas y entradas a eventos directamente conectadas con la base de datos remota.

---

## 🚀 Funcionalidades principales

### 📦 Gestión de productos (bonos)
- `anadir.html` → Añadir nuevo producto con título, imagen, descripción, precio y enlace de compra.
- `editar.html` → Seleccionar un producto ya existente para editar.
- `modificar.html` → Modificar campos individuales del producto.
- `gestionar.html` → Activar o desactivar productos visualmente mediante drag & drop.

### 🍽 Gestión de entradas para la Cena de Chistes
- `anadir.html` → Crear una nueva cena con fecha, hora, lugar, stock y precio.
- `editar.html` → Seleccionar una cena ya existente.
- `modificar.html` → Editar todos los datos asociados al evento.
- `index.html` → Panel principal de acceso a todas las acciones de esta sección.

### ⏱ Gestión de paquetes de horas
- `anadir.html` → Alta de nuevos paquetes con número de horas y precio.
- `editar.html` → Selección de paquetes ya creados.
- `modificar.html` → Edición detallada de cada campo.
- `gestionar.html` → Activar o desactivar bonos disponibles para venta.

---

## 🌐 Conexión con la web

Toda la lógica de la extensión se comunica mediante **peticiones POST** a scripts PHP ubicados en el servidor web. Algunas funcionalidades clave:

- Inserción y modificación de productos, eventos y paquetes.
- Actualización de stock y visibilidad.
- Generación automática de enlaces de pago en Stripe.
- Sincronización con temporizadores, mapas y frontend público.

> ⚠️ **Importante**: si se modifica la estructura del servidor o sus URLs, es necesario actualizar las rutas correspondientes en los archivos JS de la extensión.

---

## 📁 Estructura de archivos

```
/GESTION_WEB/
├── assets/               → Icono e imágenes compartidas
├── bonos/                → Gestión de productos
├── cena/                 → Gestión de entradas
├── paquetes/             → Gestión de paquetes de horas
├── css/
│   └── style.css         → Estilos generales unificados
├── js/
│   └── scripts/          → Lógica por sección
├── index.html            → Menú principal de la extensión
└── manifest.json         → Configuración de la extensión
```

---

## ⚙️ Instalación en Google Chrome

1. Abre Google Chrome.
2. Ve a `chrome://extensions`.
3. Activa el **modo desarrollador** (arriba a la derecha).
4. Pulsa en **“Cargar descomprimida”**.
5. Selecciona la carpeta raíz (`GESTION_WEB`) según el dominio.

---

## ✅ Consideraciones importantes

- Los formularios están validados por JavaScript antes del envío.
- Las eliminaciones son lógicas (se marcan como inactivos).
- Las imágenes deben subirse previamente a la web o servidor público.
- Los estilos están centralizados en `css/style.css` para coherencia visual.

---

## 📌 Uso previsto

Esta herramienta está pensada para **usuarios no técnicos**, facilitando al equipo de iHodei la **gestión diaria de contenidos web sin tocar código**.
