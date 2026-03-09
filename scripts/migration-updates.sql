-- ============================================================
-- MIGRACIÓN: Nuevas tablas y columnas
-- Ejecutar: Get-Content scripts\migration-updates.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
-- ============================================================

USE muebleria_online;

-- ============================================================
-- 1. Agregar columna de preferencia de notificaciones
-- ============================================================
DELIMITER //
CREATE PROCEDURE add_notif_column_if_not_exists()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'muebleria_online' AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'notif_email'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN notif_email BOOLEAN DEFAULT TRUE;
    END IF;
END //
DELIMITER ;

CALL add_notif_column_if_not_exists();
DROP PROCEDURE IF EXISTS add_notif_column_if_not_exists;

-- ============================================================
-- 2. Tabla de mensajes de contacto
-- ============================================================
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(200) NOT NULL,
    numero_pedido VARCHAR(50),
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Migración completada exitosamente' AS resultado;
