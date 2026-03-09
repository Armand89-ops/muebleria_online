-- ============================================================
-- SCHEMA COMPLETO PARA SUPABASE (PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. Tabla principal de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    "originalPrice" DECIMAL(10, 2),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    image VARCHAR(500),
    rating DECIMAL(2, 1),
    reviews INT DEFAULT 0,
    "inStock" BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    dim_width DECIMAL(10, 2),
    dim_height DECIMAL(10, 2),
    dim_depth DECIMAL(10, 2),
    stock INT DEFAULT 100
);

-- ============================================================
-- 2. Colores de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_colores (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    color VARCHAR(100) NOT NULL
);

-- ============================================================
-- 3. Imágenes adicionales de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0
);

-- ============================================================
-- 4. Materiales de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_materiales (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    material VARCHAR(100) NOT NULL
);

-- ============================================================
-- 5. Usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    notif_email BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. Direcciones de envío
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_direcciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    etiqueta VARCHAR(50) NOT NULL DEFAULT 'Casa',
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(500) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. Carrito persistente
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL DEFAULT 1,
    color VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (usuario_id, producto_id, color)
);

-- ============================================================
-- 8. Pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    subtotal DECIMAL(10, 2) NOT NULL,
    envio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    impuesto DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'procesando' CHECK (estado IN ('procesando', 'enviado', 'entregado', 'cancelado')),
    tracking_number VARCHAR(50),
    envio_nombre VARCHAR(200),
    envio_direccion VARCHAR(500),
    envio_ciudad VARCHAR(100),
    envio_estado VARCHAR(100),
    envio_codigo_postal VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. Items del pedido
-- ============================================================
CREATE TABLE IF NOT EXISTS pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id) ON DELETE SET NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    color VARCHAR(50),
    imagen VARCHAR(500)
);

-- ============================================================
-- 10. Favoritos / Wishlist
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (usuario_id, producto_id)
);

-- ============================================================
-- 11. Reseñas de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_resenas (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    calificacion SMALLINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(200),
    comentario TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (producto_id, usuario_id)
);

-- ============================================================
-- 12. Suscriptores del newsletter
-- ============================================================
CREATE TABLE IF NOT EXISTS suscriptores_newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. Mensajes de contacto
-- ============================================================
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(200) NOT NULL,
    numero_pedido VARCHAR(50),
    mensaje TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DATOS DE EJEMPLO (Seed)
-- ============================================================

-- Productos
INSERT INTO productos (name, description, price, "originalPrice", category, subcategory, image, rating, reviews, "inStock", featured, is_new, dim_width, dim_height, dim_depth, stock)
VALUES
    ('Sofá Milano', 'Sofá de tres plazas tapizado en terciopelo de alta calidad. Diseño elegante con líneas limpias y patas de madera de roble.', 24999.00, 29999.00, 'living', 'Sofás', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', 4.8, 124, TRUE, TRUE, FALSE, 220.00, 85.00, 95.00, 100),
    ('Mesa de Comedor Nórdica', 'Mesa de comedor extensible de madera maciza de roble con acabado natural. Capacidad para 6-8 personas.', 18999.00, NULL, 'dining', 'Mesas', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop', 4.9, 89, TRUE, TRUE, TRUE, 180.00, 75.00, 90.00, 100),
    ('Cama King Oslo', 'Cama king size con cabecero tapizado en lino natural. Base de madera de pino con acabado blanco mate.', 32999.00, NULL, 'bedroom', 'Camas', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop', 4.9, 67, TRUE, TRUE, FALSE, 200.00, 120.00, 210.00, 100),
    ('Escritorio Ejecutivo', 'Escritorio de diseño contemporáneo con amplia superficie de trabajo. Fabricado en MDF con chapa de nogal natural.', 15999.00, 18999.00, 'office', 'Escritorios', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop', 4.6, 156, TRUE, FALSE, TRUE, 160.00, 75.00, 80.00, 100);

-- Colores
INSERT INTO producto_colores (producto_id, color) VALUES
    (1, 'Gris'), (1, 'Beige'), (1, 'Verde Olivo'),
    (2, 'Natural'), (2, 'Nogal'),
    (3, 'Blanco'), (3, 'Gris Claro'),
    (4, 'Nogal'), (4, 'Blanco');

-- Materiales
INSERT INTO producto_materiales (producto_id, material) VALUES
    (1, 'Terciopelo'), (1, 'Roble'),
    (2, 'Roble Macizo'),
    (3, 'Lino'), (3, 'Pino'),
    (4, 'MDF'), (4, 'Nogal');

-- Imágenes adicionales
INSERT INTO producto_imagenes (producto_id, image_url, sort_order) VALUES
    (1, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop', 1),
    (1, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop', 2),
    (2, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop', 1),
    (3, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', 1),
    (4, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=600&fit=crop', 1);
