-- SCRIPT DE COMPLETITUD: Tablas faltantes para e-commerce funcional
-- ==================================================================
-- Este script agrega las tablas críticas que faltaban para producción

-- 1. ITEMS DEL PEDIDO (MUY IMPORTANTE)
-- =============================================
-- Tabla que relaciona cada pedido con los productos que contiene
CREATE TABLE IF NOT EXISTS pedido_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL, -- Precio al momento de compra
  subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_items_producto ON pedido_items(producto_id);


-- 2. TABLA DE MÉTODOS DE PAGO
-- =============================================
CREATE TABLE IF NOT EXISTS metodos_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('tarjeta', 'transferencia', 'paypal', 'mercadopago')),
  nombre VARCHAR(100), -- Nombre que le da el usuario
  datos_encriptados VARCHAR(500), -- Datos sensibles encriptados
  es_predeterminado BOOLEAN DEFAULT FALSE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metodos_pago_usuario ON metodos_pago(usuario_id);


-- 3. TABLA DE TRANSACCIONES/PAGOS
-- =============================================
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  monto DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
  referencia_externa VARCHAR(255), -- ID de Stripe, MercadoPago, etc.
  razon_fallo TEXT,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transacciones_pedido ON transacciones(pedido_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_estado ON transacciones(estado);


-- 4. TABLA DE ENVÍOS / TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS envios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  empresa_envio VARCHAR(100), -- DHL, FedEx, etc.
  numero_seguimiento VARCHAR(100) UNIQUE,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('preparando', 'recogido', 'en_transito', 'entregado', 'devuelto')),
  direccion_envio TEXT NOT NULL,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  fecha_entrega_estimada TIMESTAMP WITH TIME ZONE,
  fecha_entrega_real TIMESTAMP WITH TIME ZONE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_envios_pedido ON envios(pedido_id);
CREATE INDEX IF NOT EXISTS idx_envios_numero_seguimiento ON envios(numero_seguimiento);


-- 5. TABLA DE DEVOLUCIONES
-- =============================================
CREATE TABLE IF NOT EXISTS devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  motivo TEXT NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('solicitada', 'aprobada', 'rechazada', 'en_transito', 'recibida', 'completada')),
  monto_reembolso DECIMAL(10, 2),
  numero_seguimiento_devolucion VARCHAR(100),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  fecha_completacion TIMESTAMP WITH TIME ZONE,
  notas TEXT
);

CREATE INDEX IF NOT EXISTS idx_devoluciones_pedido ON devoluciones(pedido_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_usuario ON devoluciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_estado ON devoluciones(estado);


-- 6. TABLA DE OFERTAS/PROMOCIONES
-- =============================================
CREATE TABLE IF NOT EXISTS promociones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('porcentaje', 'monto_fijo', 'compra_lleva')),
  valor DECIMAL(10, 2) NOT NULL,
  minimo_compra DECIMAL(10, 2),
  maxximo_descuento DECIMAL(10, 2),
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  usos_maximos INT,
  usos_actuales INT DEFAULT 0,
  aplica_a VARCHAR(50) CHECK (aplica_a IN ('todos', 'categoria', 'producto')), -- Qué afecta
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promociones_activa ON promociones(activa);
CREATE INDEX IF NOT EXISTS idx_promociones_fechas ON promociones(fecha_inicio, fecha_fin);


-- 7. TABLA DE CALIFICACIONES/PUNTUACIÓN
-- =============================================
-- Nota: Asume que ya existe la tabla 'resenas' o 'reviews'
-- Si no existe, descomentar:
-- CREATE TABLE IF NOT EXISTS resenas (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
--   usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
--   calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
--   titulo VARCHAR(200),
--   contenido TEXT,
--   fotos_urls TEXT[], -- Array de URLs de fotos
--   verificado_comprador BOOLEAN DEFAULT FALSE,
--   utiles INT DEFAULT 0,
--   no_utiles INT DEFAULT 0,
--   creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(producto_id, usuario_id)
-- );


-- 8. TABLA DE AYUDA/TICKETS DE SOPORTE
-- =============================================
CREATE TABLE IF NOT EXISTS tickets_soporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pedido_id INT REFERENCES pedidos(id) ON DELETE SET NULL,
  asunto VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('envio', 'producto', 'pago', 'devolucion', 'otra')),
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')) DEFAULT 'media',
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('abierto', 'respondido', 'en_progreso', 'resuelto', 'cerrado')) DEFAULT 'abierto',
  admin_asignado_a INT REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_usuario ON tickets_soporte(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets_soporte(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_admin ON tickets_soporte(admin_asignado_a);


-- 9. TABLA DE MENSAJES EN TICKETS (CONVERSACIÓN)
-- =============================================
CREATE TABLE IF NOT EXISTS mensajes_soporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets_soporte(id) ON DELETE CASCADE,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  adjuntos_urls TEXT[], -- Array de URLs de archivos
  es_admin BOOLEAN DEFAULT FALSE,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensajes_ticket ON mensajes_soporte(ticket_id);


-- 10. TABLA DE AUDITORÍA GENERAL
-- =============================================
CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(100) NOT NULL, -- login, crear_pedido, editar_producto, etc.
  tabla VARCHAR(50),
  registro_id VARCHAR(100),
  valores_anteriores JSONB,
  valores_nuevos JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(creado_at DESC);


-- 11. FUNCIÓN: Actualizar inventario cuando se crea pedido
-- =============================================
CREATE OR REPLACE FUNCTION actualizar_inventario_en_pedido()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar inventario para cada item del pedido
  UPDATE inventario
  SET cantidad = cantidad - NEW.cantidad
  WHERE producto_id = NEW.producto_id AND cantidad >= NEW.cantidad;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_inventario ON pedido_items;
CREATE TRIGGER trigger_actualizar_inventario
AFTER INSERT ON pedido_items
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_en_pedido();


-- 12. FUNCIÓN: Calcular total del pedido
-- =============================================
CREATE OR REPLACE FUNCTION calcular_total_pedido()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pedidos
  SET total = (
    SELECT COALESCE(SUM(subtotal), 0) FROM pedido_items WHERE pedido_id = NEW.pedido_id
  )
  WHERE id = NEW.pedido_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calcular_total ON pedido_items;
CREATE TRIGGER trigger_calcular_total
AFTER INSERT OR UPDATE OR DELETE ON pedido_items
FOR EACH ROW
EXECUTE FUNCTION calcular_total_pedido();


-- 13. FUNCIÓN: Registrar auditoría en transacciones
-- =============================================
CREATE OR REPLACE FUNCTION auditoria_transacciones()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria (usuario_id, accion, tabla, registro_id, valores_nuevos, creado_at)
  VALUES (
    NEW.usuario_id,
    'transaccion_' || NEW.estado,
    'transacciones',
    NEW.id::text,
    row_to_json(NEW),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auditoria_transacciones ON transacciones;
CREATE TRIGGER trigger_auditoria_transacciones
AFTER INSERT OR UPDATE ON transacciones
FOR EACH ROW
EXECUTE FUNCTION auditoria_transacciones();
