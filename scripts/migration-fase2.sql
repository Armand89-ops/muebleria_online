-- ============================================================
-- MIGRACION FASE 2: Resenas, Inventario, Newsletter
-- Ejecutar: Get-Content scripts\migration-fase2.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
-- ============================================================

USE muebleria_online;

-- ============================================================
-- 1. Tabla de resenas de productos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion TINYINT NOT NULL,
    titulo VARCHAR(200),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (producto_id, usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. Columna de stock en productos
-- ============================================================
DELIMITER //
CREATE PROCEDURE add_stock_column_if_not_exists()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'muebleria_online' AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'stock'
    ) THEN
        ALTER TABLE productos ADD COLUMN stock INT DEFAULT 100;
    END IF;
END //
DELIMITER ;

CALL add_stock_column_if_not_exists();
DROP PROCEDURE IF EXISTS add_stock_column_if_not_exists;

-- ============================================================
-- 3. Tabla de suscriptores del newsletter
-- ============================================================
CREATE TABLE IF NOT EXISTS suscriptores_newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Migracion Fase 2 completada exitosamente' AS resultado;
