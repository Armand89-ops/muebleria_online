-- ============================================================
-- MIGRACIÓN: Agregar verificación de email y reset de contraseña
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Agregar campo de verificación de email a usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE;

-- 2. Tabla para tokens de verificación y reset de contraseña
CREATE TABLE IF NOT EXISTS tokens_auth (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('verificacion', 'reset_password')),
    usado BOOLEAN DEFAULT FALSE,
    expira_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tokens_auth_token ON tokens_auth(token);
CREATE INDEX IF NOT EXISTS idx_tokens_auth_usuario ON tokens_auth(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_auth_expira ON tokens_auth(expira_at);

-- 4. Función para limpiar tokens expirados (opcional, ejecutar periódicamente)
CREATE OR REPLACE FUNCTION limpiar_tokens_expirados()
RETURNS void AS $$
BEGIN
    DELETE FROM tokens_auth WHERE expira_at < NOW() OR usado = TRUE;
END;
$$ LANGUAGE plpgsql;
