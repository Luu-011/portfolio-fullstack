-- Consultas parametrizadas de analytics (las usa src/models/Analytics.js).
-- Cada ? es un parámetro: el valor se pasa aparte, nunca se concatena en el SQL.
USE portfolio_db;

-- 1. Contadores de visitas: total, visitantes generales y usuarios registrados
SELECT COUNT(*)                                   AS total,
       SUM(user_id IS NULL)                       AS anonymous,   -- visitas generales
       SUM(user_id IS NOT NULL)                   AS registered   -- accesos de usuarios autenticados
  FROM visits;

-- 2. Tráfico por día de los últimos N días      (? = N - 1)
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS total, SUM(user_id IS NOT NULL) AS registered
  FROM visits
 WHERE created_at >= (CURDATE() - INTERVAL ? DAY)
 GROUP BY day ORDER BY day;

-- 3. Flujo de registros por mes                 (? = cantidad de meses - 1)
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
  FROM users
 WHERE role = 'user'
   AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)
 GROUP BY month ORDER BY month;

-- 4. Tipos de consulta más frecuentes (opcional: solo los últimos N días)
SELECT type, COUNT(*) AS count FROM contacts
 WHERE created_at >= (CURDATE() - INTERVAL ? DAY)
 GROUP BY type ORDER BY count DESC;

-- 5. Páginas por las que más entra la gente     (? = cuántas mostrar)
SELECT path, COUNT(*) AS count FROM visits GROUP BY path ORDER BY count DESC, path LIMIT ?;
