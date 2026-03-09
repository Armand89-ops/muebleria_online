-- ============================================================
-- SETUP DE TABLAS DE USUARIO - Muebleria Online
-- Ejecutar: Get-Content scripts\setup-users.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
-- ============================================================

USE muebleria_online;

-- ============================================================
-- 1. Tabla de usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. Direcciones de envío
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    etiqueta VARCHAR(50) NOT NULL DEFAULT 'Casa',
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(500) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. Carrito persistente
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (usuario_id, producto_id, color)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. Pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    subtotal DECIMAL(10, 2) NOT NULL,
    envio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    impuesto DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'procesando',
    tracking_number VARCHAR(50),
    -- Dirección de envío copiada (no referencia, para historial)
    envio_nombre VARCHAR(200),
    envio_direccion VARCHAR(500),
    envio_ciudad VARCHAR(100),
    envio_estado VARCHAR(100),
    envio_codigo_postal VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. Items del pedido
-- ============================================================
CREATE TABLE IF NOT EXISTS pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT,
    nombre_producto VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    color VARCHAR(50),
    imagen VARCHAR(500),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. Favoritos / Wishlist
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario_favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Tablas de usuario creadas exitosamente' AS resultado;
