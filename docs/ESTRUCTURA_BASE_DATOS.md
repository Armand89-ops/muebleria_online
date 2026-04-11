# Estructura de Base de Datos - Mueblería Online

## Resumen Ejecutivo
Base de datos para una tienda de muebles con funcionalidades de cliente y administrador. Utiliza Supabase con PostgreSQL.

---

## TABLAS PRINCIPALES

### 1. `usuarios` (Clientes y Administradores)
```
id: INTEGER (PRIMARY KEY)
nombre: VARCHAR
apellido: VARCHAR
email: VARCHAR (UNIQUE)
password_hash: VARCHAR
telefono: VARCHAR
rol: VARCHAR ('cliente', 'admin', 'moderador') - DEFAULT: 'cliente'
email_verificado: BOOLEAN - DEFAULT: false
es_admin: BOOLEAN
notif_email: BOOLEAN - Para notificaciones al cliente
creado_at: TIMESTAMP
actualizado_at: TIMESTAMP
```

### 2. `productos` (Catálogo)
```
id: INTEGER (PRIMARY KEY)
nombre: VARCHAR
descripcion: TEXT
precio: DECIMAL(10, 2)
imagen_url: VARCHAR
categoria_id: UUID (FOREIGN KEY → categorias.id)
stock: INTEGER
sku: VARCHAR (UNIQUE)
peso: DECIMAL(10, 2)
dimensiones: VARCHAR
material: VARCHAR
color: VARCHAR
destacado: BOOLEAN
activo: BOOLEAN
creado_at: TIMESTAMP
actualizado_at: TIMESTAMP
```

### 3. `pedidos` (Órdenes de Compra)
```
id: INTEGER (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
total: DECIMAL(10, 2)
estado: VARCHAR ('procesando', 'enviado', 'entregado', 'cancelado')
metodo_pago: VARCHAR
direccion_entrega: TEXT
fecha_pedido: TIMESTAMP
fecha_entrega_estimada: TIMESTAMP
creado_at: TIMESTAMP
```

### 4. `carrito` (Carrito de Compras)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
producto_id: INTEGER (FOREIGN KEY → productos.id)
cantidad: INTEGER
precio_unitario: DECIMAL(10, 2)
agregado_at: TIMESTAMP
```

### 5. `favoritos` (Lista de Deseos)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
producto_id: INTEGER (FOREIGN KEY → productos.id)
agregado_at: TIMESTAMP
```

### 6. `direcciones` (Direcciones de Entrega)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
tipo: VARCHAR ('envio', 'facturacion')
calle: VARCHAR
numero: VARCHAR
apartamento: VARCHAR
ciudad: VARCHAR
estado: VARCHAR
codigo_postal: VARCHAR
pais: VARCHAR
es_principal: BOOLEAN
creado_at: TIMESTAMP
```

### 7. `resenas` (Reseñas de Productos)
```
id: UUID (PRIMARY KEY)
producto_id: INTEGER (FOREIGN KEY → productos.id)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
calificacion: INTEGER (1-5)
titulo: VARCHAR
contenido: TEXT
util_count: INTEGER
creado_at: TIMESTAMP
```

### 8. `newsletter` (Suscriptores)
```
id: UUID (PRIMARY KEY)
email: VARCHAR (UNIQUE)
nombre: VARCHAR
activo: BOOLEAN - DEFAULT: true
suscrito_at: TIMESTAMP
desuscrito_at: TIMESTAMP
```

### 9. `contactos` (Mensajes de Contacto)
```
id: UUID (PRIMARY KEY)
nombre: VARCHAR
email: VARCHAR
telefono: VARCHAR
asunto: VARCHAR
mensaje: TEXT
leido: BOOLEAN - DEFAULT: false
respondido: BOOLEAN - DEFAULT: false
creado_at: TIMESTAMP
```

---

## TABLAS DE ADMINISTRADOR

### 10. `notificaciones_admin` (Alertas para Admin)
```
id: UUID (PRIMARY KEY)
tipo: VARCHAR ('nuevo_pedido', 'pedido_enviado', 'pedido_entregado', 'stock_bajo')
titulo: VARCHAR
mensaje: TEXT
datos: JSONB (Información adicional)
leida: BOOLEAN - DEFAULT: false
creado_at: TIMESTAMP
```

### 11. `historial_pedidos` (Registro de Cambios de Estado)
```
id: UUID (PRIMARY KEY)
pedido_id: INTEGER (FOREIGN KEY → pedidos.id)
estado_anterior: VARCHAR
estado_nuevo: VARCHAR
comentario: TEXT
cambiado_por: INTEGER (FOREIGN KEY → usuarios.id)
creado_at: TIMESTAMP
```

### 12. `cupones` (Sistema de Descuentos)
```
id: UUID (PRIMARY KEY)
codigo: VARCHAR (UNIQUE)
descripcion: TEXT
tipo: VARCHAR ('porcentaje', 'monto_fijo')
valor: DECIMAL(10, 2)
minimo_compra: DECIMAL(10, 2)
usos_maximos: INTEGER
usos_actuales: INTEGER
activo: BOOLEAN - DEFAULT: true
expira_at: TIMESTAMP
creado_at: TIMESTAMP
```

### 13. `cupones_usados` (Registro de Uso)
```
id: UUID (PRIMARY KEY)
cupon_id: UUID (FOREIGN KEY → cupones.id)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
pedido_id: INTEGER (FOREIGN KEY → pedidos.id)
descuento_aplicado: DECIMAL(10, 2)
usado_at: TIMESTAMP
```

### 14. `inventario` (Control de Stock)
```
id: UUID (PRIMARY KEY)
producto_id: INTEGER (FOREIGN KEY → productos.id) UNIQUE
cantidad: INTEGER
stock_minimo: INTEGER
ubicacion: VARCHAR (Ubicación en almacén)
actualizado_at: TIMESTAMP
```

### 15. `movimientos_inventario` (Historial de Stock)
```
id: UUID (PRIMARY KEY)
producto_id: INTEGER (FOREIGN KEY → productos.id)
tipo: VARCHAR ('entrada', 'salida', 'ajuste')
cantidad: INTEGER
cantidad_anterior: INTEGER
cantidad_nueva: INTEGER
razon: VARCHAR ('venta', 'devolucion', 'ajuste_manual', 'restock')
referencia_id: INTEGER (pedido_id si es venta)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
creado_at: TIMESTAMP
```

### 16. `categorias` (Categorías de Productos)
```
id: UUID (PRIMARY KEY)
nombre: VARCHAR
slug: VARCHAR (UNIQUE)
descripcion: TEXT
imagen_url: VARCHAR
categoria_padre_id: UUID (Para subcategorías)
activo: BOOLEAN
creado_at: TIMESTAMP
```

### 17. `sesiones_admin` (Seguridad)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
token_hash: VARCHAR
ip_address: VARCHAR
user_agent: TEXT
expira_at: TIMESTAMP
creado_at: TIMESTAMP
```

### 18. `logs_admin` (Auditoría)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
accion: VARCHAR ('crear_producto', 'editar_pedido', 'eliminar_usuario', etc.)
entidad: VARCHAR ('producto', 'pedido', 'usuario')
entidad_id: UUID
datos_anteriores: JSONB
datos_nuevos: JSONB
ip_address: VARCHAR
creado_at: TIMESTAMP
```

### 19. `banners` (Promociones)
```
id: UUID (PRIMARY KEY)
titulo: VARCHAR
descripcion: TEXT
imagen_url: VARCHAR
enlace: VARCHAR
posicion: INTEGER
activo: BOOLEAN
creado_at: TIMESTAMP
```

### 20. `configuracion_tienda` (Configuración Global)
```
id: UUID (PRIMARY KEY)
nombre_tienda: VARCHAR
email_contacto: VARCHAR
telefono: VARCHAR
direccion: TEXT
iva: DECIMAL(5, 2)
costo_envio_base: DECIMAL(10, 2)
envio_gratis_minimo: DECIMAL(10, 2)
actualizado_at: TIMESTAMP
```

### 21. `tokens_auth` (Verificación de Email y Reset)
```
id: UUID (PRIMARY KEY)
usuario_id: INTEGER (FOREIGN KEY → usuarios.id)
token: VARCHAR (UNIQUE)
tipo: VARCHAR ('verificacion', 'reset_password')
usado: BOOLEAN - DEFAULT: false
expira_at: TIMESTAMP
creado_at: TIMESTAMP
```

---

## FUNCIONALIDADES PRINCIPALES

### Para Clientes:
- ✓ Registro y login
- ✓ Verificación de email
- ✓ Recuperación de contraseña
- ✓ Cambio de contraseña
- ✓ Ver catálogo de productos
- ✓ Carrito de compras
- ✓ Crear pedidos
- ✓ Ver historial de pedidos
- ✓ Agregar a favoritos
- ✓ Dejar reseñas
- ✓ Gestionar direcciones de entrega
- ✓ Usar cupones de descuento

### Para Administradores:
- ✓ Dashboard con estadísticas
- ✓ Gestionar productos (crear, editar, eliminar)
- ✓ Control de inventario y stock
- ✓ Gestionar pedidos (cambiar estado, cancelar)
- ✓ Historial de cambios de pedidos
- ✓ Ver notificaciones automáticas
- ✓ Gestionar cupones de descuento
- ✓ Gestionar categorías
- ✓ Gestionar banners/promociones
- ✓ Ver logs de actividad
- ✓ Gestionar usuarios
- ✓ Configurar tienda
- ✓ Newsletter

---

## RELACIONES PRINCIPALES

```
usuarios
├── pedidos (1:N)
├── carrito (1:N)
├── favoritos (1:N)
├── direcciones (1:N)
├── resenas (1:N)
├── cupones_usados (1:N)
├── movimientos_inventario (1:N)
├── sesiones_admin (1:N)
└── logs_admin (1:N)

productos
├── carrito (1:N)
├── favoritos (1:N)
├── resenas (1:N)
├── inventario (1:1)
└── movimientos_inventario (1:N)

pedidos
├── historial_pedidos (1:N)
└── cupones_usados (1:N)

categorias
└── productos (1:N)
└── categorias (1:N) - Para subcategorías

cupones
└── cupones_usados (1:N)
```

---

## SCRIPTS SQL A EJECUTAR

Ejecutar en este orden:

1. `supabase-schema.sql` - Tablas base (si no las tienes)
2. `add-email-verification.sql` - Verificación de email y tokens
3. `add-admin-features.sql` - Tablas y funcionalidades de admin

---

## NOTAS TÉCNICAS

- **Base de datos:** Supabase (PostgreSQL)
- **Tipos de datos:** Mezcla de INTEGER (para IDs de usuarios y productos) y UUID (para otras tablas)
- **Autenticación:** Sistema personalizado con JWT (no usa auth.users de Supabase)
- **RLS:** Deshabilitado (la autorización se maneja en la aplicación)
- **Triggers:** Automáticos para notificaciones de nuevo pedido y cambios de estado
- **Indices:** Creados en campos de búsqueda frecuente

---

## PARA CREAR EL PANEL DE ADMINISTRADOR

Necesitarás:
1. Tablas: `usuarios`, `productos`, `pedidos`, `notificaciones_admin`, `historial_pedidos`, `cupones`, `inventario`, `categorias`, `logs_admin`, `configuracion_tienda`, `banners`
2. Campos clave: `usuarios.rol`, `usuarios.es_admin`, `pedidos.estado`, `productos.stock`
3. Relaciones: usuario → pedidos, productos → inventario, pedidos → historial
4. Funcionalidades: Autenticación de admin, cambiar estado pedidos, gestionar productos, ver notificaciones, logs de auditoría
