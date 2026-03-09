-- ============================================
-- Script de configuración de BD: muebleria_online
-- Ejecutar: mysql -u root < scripts/setup-db.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS muebleria_online;
USE muebleria_online;

-- Tabla principal de productos (ya debería existir)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    image VARCHAR(500),
    rating DECIMAL(2, 1),
    reviews INT DEFAULT 0,
    inStock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    dim_width DECIMAL(10, 2) NULL,
    dim_height DECIMAL(10, 2) NULL,
    dim_depth DECIMAL(10, 2) NULL
);

-- Agregar columnas de dimensiones si no existen (para tablas ya creadas)
-- MySQL no soporta IF NOT EXISTS en ALTER TABLE, así que usamos procedimiento
DELIMITER //
CREATE PROCEDURE add_column_if_not_exists()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'muebleria_online' AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'dim_width'
    ) THEN
        ALTER TABLE productos ADD COLUMN dim_width DECIMAL(10, 2) NULL;
    END IF;

    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'muebleria_online' AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'dim_height'
    ) THEN
        ALTER TABLE productos ADD COLUMN dim_height DECIMAL(10, 2) NULL;
    END IF;

    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'muebleria_online' AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'dim_depth'
    ) THEN
        ALTER TABLE productos ADD COLUMN dim_depth DECIMAL(10, 2) NULL;
    END IF;
END //
DELIMITER ;

CALL add_column_if_not_exists();
DROP PROCEDURE IF EXISTS add_column_if_not_exists;

-- ============================================
-- Tablas adicionales
-- ============================================

-- Colores de productos
CREATE TABLE IF NOT EXISTS producto_colores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    color VARCHAR(100) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Imágenes adicionales de productos
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Materiales de productos
CREATE TABLE IF NOT EXISTS producto_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    material VARCHAR(100) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ============================================
-- Datos de ejemplo (solo si la tabla está vacía)
-- ============================================

INSERT INTO productos (name, description, price, originalPrice, category, subcategory, image, rating, reviews, inStock, featured, is_new, dim_width, dim_height, dim_depth)
SELECT * FROM (SELECT
    'Sofá Milano' AS name,
    'Sofá de tres plazas tapizado en terciopelo de alta calidad. Diseño elegante con líneas limpias y patas de madera de roble.' AS description,
    24999.00 AS price, 29999.00 AS originalPrice,
    'living' AS category, 'Sofás' AS subcategory,
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop' AS image,
    4.8 AS rating, 124 AS reviews, TRUE AS inStock, TRUE AS featured, FALSE AS is_new,
    220.00 AS dim_width, 85.00 AS dim_height, 95.00 AS dim_depth
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);

INSERT INTO productos (name, description, price, originalPrice, category, subcategory, image, rating, reviews, inStock, featured, is_new, dim_width, dim_height, dim_depth)
SELECT * FROM (SELECT
    'Mesa de Comedor Nórdica' AS name,
    'Mesa de comedor extensible de madera maciza de roble con acabado natural. Capacidad para 6-8 personas.' AS description,
    18999.00 AS price, NULL AS originalPrice,
    'dining' AS category, 'Mesas' AS subcategory,
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop' AS image,
    4.9 AS rating, 89 AS reviews, TRUE AS inStock, TRUE AS featured, TRUE AS is_new,
    180.00 AS dim_width, 75.00 AS dim_height, 90.00 AS dim_depth
) AS tmp WHERE (SELECT COUNT(*) FROM productos) < 2;

INSERT INTO productos (name, description, price, originalPrice, category, subcategory, image, rating, reviews, inStock, featured, is_new, dim_width, dim_height, dim_depth)
SELECT * FROM (SELECT
    'Cama King Oslo' AS name,
    'Cama king size con cabecero tapizado en lino natural. Base de madera de pino con acabado blanco mate.' AS description,
    32999.00 AS price, NULL AS originalPrice,
    'bedroom' AS category, 'Camas' AS subcategory,
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop' AS image,
    4.9 AS rating, 67 AS reviews, TRUE AS inStock, TRUE AS featured, FALSE AS is_new,
    200.00 AS dim_width, 120.00 AS dim_height, 210.00 AS dim_depth
) AS tmp WHERE (SELECT COUNT(*) FROM productos) < 3;

INSERT INTO productos (name, description, price, originalPrice, category, subcategory, image, rating, reviews, inStock, featured, is_new, dim_width, dim_height, dim_depth)
SELECT * FROM (SELECT
    'Escritorio Ejecutivo' AS name,
    'Escritorio de diseño contemporáneo con amplia superficie de trabajo. Fabricado en MDF con chapa de nogal natural.' AS description,
    15999.00 AS price, 18999.00 AS originalPrice,
    'office' AS category, 'Escritorios' AS subcategory,
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop' AS image,
    4.6 AS rating, 156 AS reviews, TRUE AS inStock, FALSE AS featured, TRUE AS is_new,
    160.00 AS dim_width, 75.00 AS dim_height, 80.00 AS dim_depth
) AS tmp WHERE (SELECT COUNT(*) FROM productos) < 4;

-- Colores de ejemplo (solo si la tabla está vacía)
INSERT INTO producto_colores (producto_id, color)
SELECT * FROM (SELECT 1, 'Gris' UNION SELECT 1, 'Beige' UNION SELECT 1, 'Verde Olivo'
UNION SELECT 2, 'Natural' UNION SELECT 2, 'Nogal'
UNION SELECT 3, 'Blanco' UNION SELECT 3, 'Gris Claro'
UNION SELECT 4, 'Nogal' UNION SELECT 4, 'Blanco') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM producto_colores LIMIT 1);

-- Materiales de ejemplo
INSERT INTO producto_materiales (producto_id, material)
SELECT * FROM (SELECT 1, 'Terciopelo' UNION SELECT 1, 'Roble'
UNION SELECT 2, 'Roble Macizo'
UNION SELECT 3, 'Lino' UNION SELECT 3, 'Pino'
UNION SELECT 4, 'MDF' UNION SELECT 4, 'Nogal') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM producto_materiales LIMIT 1);

-- Imágenes adicionales de ejemplo
INSERT INTO producto_imagenes (producto_id, image_url, sort_order)
SELECT * FROM (
SELECT 1, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop', 1
UNION SELECT 1, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop', 2
UNION SELECT 2, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop', 1
UNION SELECT 3, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', 1
UNION SELECT 4, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=600&fit=crop', 1
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM producto_imagenes LIMIT 1);
