-- Añade una columna created_at a la tabla productos y asigna la fecha actual a todos los productos existentes.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
