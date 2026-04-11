# Prompt para crear Panel de Administrador

## ARCHIVOS QUE DEBES SUBIR AL NUEVO CHAT:

1. `docs/ESTRUCTURA_BASE_DATOS.md` - Estructura completa de la BD
2. `scripts/add-admin-features.sql` - SQL de tablas admin
3. `scripts/add-production-features.sql` - SQL de tablas de produccion

---

## PROMPT (Copia y pega esto en el nuevo chat):

---

Necesito crear un **Panel de Administrador** para mi tienda de muebles online "Muebleria Online".

## Contexto:
- Ya tengo la tienda principal funcionando en Next.js 15 con App Router
- Base de datos: **Supabase** (PostgreSQL)
- Todos los IDs de usuarios, productos y pedidos son tipo **INTEGER** (no UUID)
- Ya tengo las tablas creadas (adjunto los SQL y estructura)

## Lo que necesito en el panel admin:

### 1. DASHBOARD PRINCIPAL
- Resumen de ventas del dia/semana/mes
- Pedidos pendientes de procesar
- Productos con stock bajo (alerta)
- Notificaciones nuevas sin leer
- Graficas de ventas

### 2. GESTION DE PEDIDOS
- Lista de todos los pedidos con filtros (estado, fecha, cliente)
- Ver detalle de pedido (productos, direccion, cliente)
- Cambiar estado del pedido (procesando -> enviado -> entregado)
- Agregar numero de tracking/guia de envio
- Ver historial de cambios del pedido
- Procesar devoluciones

### 3. GESTION DE PRODUCTOS
- CRUD completo de productos
- Subir/eliminar imagenes
- Gestionar colores y materiales
- Control de inventario (stock)
- Marcar productos como destacados
- Activar/desactivar productos
- Gestionar categorias

### 4. GESTION DE USUARIOS
- Lista de usuarios con busqueda
- Ver detalle de usuario (pedidos, direcciones)
- Cambiar rol (cliente/admin/moderador)
- Desactivar cuentas

### 5. CUPONES Y PROMOCIONES
- Crear/editar/eliminar cupones
- Ver uso de cupones
- Crear promociones (descuentos por categoria, etc.)
- Gestionar banners promocionales

### 6. REPORTES
- Ventas por periodo
- Productos mas vendidos
- Clientes frecuentes
- Exportar a CSV/Excel

### 7. CONFIGURACION
- Configuracion general de la tienda (nombre, email, telefono)
- Configurar IVA y costos de envio
- Configurar metodos de pago activos

### 8. SOPORTE
- Ver tickets de soporte
- Responder mensajes
- Ver mensajes de contacto

### 9. NOTIFICACIONES
- Centro de notificaciones
- Marcar como leidas
- Configurar alertas

## Requisitos tecnicos:
- Next.js 15 con App Router
- Supabase para base de datos
- TailwindCSS para estilos
- shadcn/ui para componentes
- Graficas con Recharts
- Autenticacion: verificar que el usuario tenga rol 'admin' o 'moderador'
- Responsive (aunque principalmente se usara en desktop)

## Tablas principales que usaras:
- `usuarios` (id INT, email, nombre, apellido, rol)
- `productos` (id INT, nombre, precio, stock, activo, destacado)
- `pedidos` (id INT, usuario_id, estado, total)
- `pedido_items` (id, pedido_id, producto_id, cantidad, precio)
- `notificaciones_admin` (tipo, titulo, mensaje, leido)
- `cupones` (codigo, tipo_descuento, valor, activo)
- `inventario` (producto_id, cantidad, stock_minimo)
- `configuracion_tienda` (clave, valor)
- `tickets_soporte` (usuario_id, asunto, estado)
- `logs_admin` (usuario_id, accion, entidad)

Adjunto los archivos SQL con la estructura completa de la base de datos.

El panel debe estar en **/admin** y tener su propio layout con sidebar de navegacion.

---

## NOTAS ADICIONALES PARA EL CHAT:

- Si te pide mas detalles de alguna tabla, comparte el contenido de `ESTRUCTURA_BASE_DATOS.md`
- La conexion a Supabase ya esta configurada, solo necesita usar el cliente existente
- Los endpoints de API deben ir en `/app/api/admin/...`
- Middleware para proteger rutas admin verificando el rol del usuario

---

## Estructura de carpetas sugerida:

```
/app
  /admin
    /layout.tsx          <- Layout con sidebar
    /page.tsx            <- Dashboard
    /pedidos
      /page.tsx          <- Lista de pedidos
      /[id]/page.tsx     <- Detalle de pedido
    /productos
      /page.tsx          <- Lista de productos
      /nuevo/page.tsx    <- Crear producto
      /[id]/page.tsx     <- Editar producto
    /usuarios
      /page.tsx
    /cupones
      /page.tsx
    /reportes
      /page.tsx
    /configuracion
      /page.tsx
    /soporte
      /page.tsx
    /notificaciones
      /page.tsx
  /api
    /admin
      /dashboard/route.ts
      /pedidos/route.ts
      /productos/route.ts
      /usuarios/route.ts
      /cupones/route.ts
      /reportes/route.ts
      /notificaciones/route.ts
/components
  /admin
    /sidebar.tsx
    /stats-card.tsx
    /data-table.tsx
    /charts.tsx
```
