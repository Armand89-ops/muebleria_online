-- =============================================
-- SCRIPT: Funcionalidades de Administrador
-- Para: Mueblería Online
-- =============================================

-- 1. AGREGAR ROL A USUARIOS
-- =============================================
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin', 'moderador'));

-- Índice para búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);


-- 2. TABLA DE NOTIFICACIONES ADMIN
-- =============================================
CREATE TABLE IF NOT EXISTS notificaciones_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50) NOT NULL, -- 'nuevo_pedido', 'pedido_enviado', 'pedido_entregado', 'nuevo_usuario', 'nuevo_mensaje', 'stock_bajo', 'nueva_resena'
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  datos JSONB, -- Datos adicionales (pedido_id, usuario_id, producto_id, etc.)
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_admin_leida ON notificaciones_admin(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_admin_tipo ON notificaciones_admin(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_admin_creado ON notificaciones_admin(creado_at DESC);


-- 3. HISTORIAL DE ESTADOS DE PEDIDOS
-- =============================================
CREATE TABLE IF NOT EXISTS historial_pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50) NOT NULL,
  comentario TEXT,
  cambiado_por INT REFERENCES usuarios(id), -- Admin que hizo el cambio
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_pedidos_pedido ON historial_pedidos(pedido_id);


-- 4. CONFIGURACIÓN DE LA TIENDA
-- =============================================
CREATE TABLE IF NOT EXISTS configuracion_tienda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT,
  descripcion TEXT,
  tipo VARCHAR(20) DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO configuracion_tienda (clave, valor, descripcion, tipo) VALUES
  ('nombre_tienda', 'Mueblería Online', 'Nombre de la tienda', 'text'),
  ('email_contacto', 'contacto@muebleria.com', 'Email de contacto principal', 'text'),
  ('telefono', '+52 55 1234 5678', 'Teléfono de contacto', 'text'),
  ('direccion', 'Ciudad de México, México', 'Dirección física', 'text'),
  ('moneda', 'MXN', 'Moneda de la tienda', 'text'),
  ('iva_porcentaje', '16', 'Porcentaje de IVA', 'number'),
  ('costo_envio_base', '150', 'Costo base de envío', 'number'),
  ('envio_gratis_minimo', '0', 'Mínimo para envío gratis (0 = desactivado)', 'number'),
  ('horario_atencion', 'Lun-Vie: 9am-6pm', 'Horario de atención', 'text'),
  ('redes_sociales', '{"facebook": "", "instagram": "", "whatsapp": ""}', 'Redes sociales', 'json'),
  ('notif_nuevo_pedido', 'true', 'Notificar nuevos pedidos', 'boolean'),
  ('notif_stock_bajo', 'true', 'Notificar stock bajo', 'boolean'),
  ('stock_bajo_limite', '5', 'Límite para alerta de stock bajo', 'number')
ON CONFLICT (clave) DO NOTHING;


-- 5. CUPONES Y DESCUENTOS
-- =============================================
CREATE TABLE IF NOT EXISTS cupones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('porcentaje', 'monto_fijo')),
  valor DECIMAL(10, 2) NOT NULL, -- Porcentaje o monto fijo
  minimo_compra DECIMAL(10, 2) DEFAULT 0,
  maximo_descuento DECIMAL(10, 2), -- Solo para porcentaje
  usos_maximos INT,
  usos_actuales INT DEFAULT 0,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_activo ON cupones(activo);


-- 6. USO DE CUPONES (Registro)
-- =============================================
CREATE TABLE IF NOT EXISTS cupones_usados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cupon_id UUID NOT NULL REFERENCES cupones(id) ON DELETE CASCADE,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pedido_id INT REFERENCES pedidos(id) ON DELETE SET NULL,
  descuento_aplicado DECIMAL(10, 2) NOT NULL,
  usado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cupon_id, usuario_id, pedido_id)
);


-- 7. INVENTARIO / STOCK
-- =============================================
CREATE TABLE IF NOT EXISTS inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INT NOT NULL DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  ubicacion VARCHAR(100), -- Ubicacion en almacen
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(producto_id)
);

CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario(producto_id);


-- 8. MOVIMIENTOS DE INVENTARIO
-- =============================================
CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
  cantidad INT NOT NULL,
  cantidad_anterior INT,
  cantidad_nueva INT,
  razon TEXT, -- 'venta', 'devolucion', 'ajuste_manual', 'restock'
  referencia_id INT, -- pedido_id si es venta
  usuario_id INT REFERENCES usuarios(id), -- Quien hizo el movimiento
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos_inventario(producto_id);


-- 9. CATEGORÍAS (Si no existe)
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  padre_id UUID REFERENCES categorias(id), -- Para subcategorías
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_padre ON categorias(padre_id);

-- Insertar categorías base
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
  ('Sala', 'living', 'Muebles para sala y estar', 1),
  ('Comedor', 'dining', 'Mesas, sillas y muebles de comedor', 2),
  ('Dormitorio', 'bedroom', 'Camas, burós y muebles de recámara', 3),
  ('Oficina', 'office', 'Escritorios, sillas y muebles de oficina', 4),
  ('Exterior', 'outdoor', 'Muebles para jardín y terraza', 5)
ON CONFLICT (slug) DO NOTHING;


-- 10. SESIONES DE ADMIN (Para seguridad)
-- =============================================
CREATE TABLE IF NOT EXISTS sesiones_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expira_at TIMESTAMP WITH TIME ZONE NOT NULL,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones_admin(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_expira ON sesiones_admin(expira_at);


-- 11. LOGS DE ACTIVIDAD ADMIN
-- =============================================
CREATE TABLE IF NOT EXISTS logs_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(100) NOT NULL, -- 'crear_producto', 'editar_pedido', 'eliminar_usuario', etc.
  entidad VARCHAR(50), -- 'producto', 'pedido', 'usuario', etc.
  entidad_id UUID,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  ip_address VARCHAR(45),
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_admin(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_admin(accion);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_admin(creado_at DESC);


-- 12. BANNERS Y PROMOCIONES
-- =============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  subtitulo TEXT,
  imagen_url TEXT NOT NULL,
  link_url TEXT,
  posicion VARCHAR(50) DEFAULT 'home_hero', -- 'home_hero', 'home_secondary', 'catalogo', etc.
  orden INT DEFAULT 0,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_activo ON banners(activo);
CREATE INDEX IF NOT EXISTS idx_banners_posicion ON banners(posicion);


-- 13. AGREGAR CAMPO STOCK A PRODUCTOS (Si no existe)
-- =============================================
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0;

ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS sku VARCHAR(50);

ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS peso DECIMAL(10, 2); -- En kg, para cálculo de envío

ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT FALSE;

ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);


-- 14. FUNCIÓN: Crear notificación automática en nuevo pedido
-- =============================================
CREATE OR REPLACE FUNCTION notificar_nuevo_pedido()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notificaciones_admin (tipo, titulo, mensaje, datos)
  VALUES (
    'nuevo_pedido',
    'Nuevo pedido recibido',
    'Se ha recibido un nuevo pedido por $' || NEW.total,
    jsonb_build_object(
      'pedido_id', NEW.id,
      'usuario_id', NEW.usuario_id,
      'total', NEW.total
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para nuevo pedido
DROP TRIGGER IF EXISTS trigger_nuevo_pedido ON pedidos;
CREATE TRIGGER trigger_nuevo_pedido
AFTER INSERT ON pedidos
FOR EACH ROW
EXECUTE FUNCTION notificar_nuevo_pedido();


-- 15. FUNCIÓN: Notificar cambio de estado de pedido
-- =============================================
CREATE OR REPLACE FUNCTION notificar_cambio_estado_pedido()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si el estado cambió
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    -- Registrar en historial
    INSERT INTO historial_pedidos (pedido_id, estado_anterior, estado_nuevo)
    VALUES (NEW.id, OLD.estado, NEW.estado);
    
    -- Crear notificación según el nuevo estado
    IF NEW.estado = 'enviado' THEN
      INSERT INTO notificaciones_admin (tipo, titulo, mensaje, datos)
      VALUES (
        'pedido_enviado',
        'Pedido enviado',
        'El pedido ha sido marcado como enviado',
        jsonb_build_object('pedido_id', NEW.id, 'estado', NEW.estado)
      );
    ELSIF NEW.estado = 'entregado' THEN
      INSERT INTO notificaciones_admin (tipo, titulo, mensaje, datos)
      VALUES (
        'pedido_entregado',
        'Pedido entregado',
        'El pedido ha sido entregado exitosamente',
        jsonb_build_object('pedido_id', NEW.id, 'estado', NEW.estado)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para cambio de estado
DROP TRIGGER IF EXISTS trigger_cambio_estado_pedido ON pedidos;
CREATE TRIGGER trigger_cambio_estado_pedido
AFTER UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION notificar_cambio_estado_pedido();


-- 16. FUNCIÓN: Notificar stock bajo
-- =============================================
CREATE OR REPLACE FUNCTION notificar_stock_bajo()
RETURNS TRIGGER AS $$
DECLARE
  limite_stock INT;
  nombre_producto VARCHAR;
BEGIN
  -- Obtener límite de configuración
  SELECT COALESCE(valor::INT, 5) INTO limite_stock 
  FROM configuracion_tienda 
  WHERE clave = 'stock_bajo_limite';
  
  -- Verificar si el stock cayó por debajo del límite
  IF NEW.stock <= limite_stock AND (OLD.stock IS NULL OR OLD.stock > limite_stock) THEN
    SELECT nombre INTO nombre_producto FROM productos WHERE id = NEW.id;
    
    INSERT INTO notificaciones_admin (tipo, titulo, mensaje, datos)
    VALUES (
      'stock_bajo',
      'Stock bajo: ' || nombre_producto,
      'El producto tiene solo ' || NEW.stock || ' unidades en stock',
      jsonb_build_object('producto_id', NEW.id, 'stock', NEW.stock)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para stock bajo
DROP TRIGGER IF EXISTS trigger_stock_bajo ON productos;
CREATE TRIGGER trigger_stock_bajo
AFTER UPDATE OF stock ON productos
FOR EACH ROW
EXECUTE FUNCTION notificar_stock_bajo();


-- 17. FUNCIÓN: Limpiar notificaciones antiguas (más de 30 días)
-- =============================================
CREATE OR REPLACE FUNCTION limpiar_notificaciones_antiguas()
RETURNS void AS $$
BEGIN
  DELETE FROM notificaciones_admin 
  WHERE leida = TRUE 
  AND creado_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;


-- 18. RLS (Row Level Security) para notificaciones admin
-- =============================================
ALTER TABLE notificaciones_admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notifications" ON notificaciones_admin
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.rol IN ('admin', 'moderador')
    )
  );

CREATE POLICY "Admins can update notifications" ON notificaciones_admin
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.rol IN ('admin', 'moderador')
    )
  );


-- =============================================
-- FIN DEL SCRIPT
-- =============================================
-- 
-- RESUMEN DE TABLAS CREADAS/MODIFICADAS:
-- 
-- MODIFICACIONES:
-- - usuarios: agregado campo 'rol' (cliente/admin/moderador)
-- - productos: agregados campos 'stock', 'sku', 'peso', 'destacado', 'activo'
--
-- NUEVAS TABLAS:
-- 1. notificaciones_admin - Notificaciones para administradores
-- 2. historial_pedidos - Registro de cambios de estado de pedidos
-- 3. configuracion_tienda - Configuración general de la tienda
-- 4. cupones - Sistema de cupones de descuento
-- 5. cupones_usados - Registro de uso de cupones
-- 6. inventario - Control de stock por producto
-- 7. movimientos_inventario - Historial de entradas/salidas
-- 8. categorias - Categorías de productos
-- 9. sesiones_admin - Seguridad de sesiones admin
-- 10. logs_admin - Registro de actividad admin
-- 11. banners - Banners y promociones
--
-- FUNCIONES AUTOMÁTICAS (TRIGGERS):
-- - Notificación automática en nuevo pedido
-- - Notificación automática en cambio de estado de pedido
-- - Notificación automática de stock bajo
-- - Limpieza automática de notificaciones antiguas
-- =============================================
