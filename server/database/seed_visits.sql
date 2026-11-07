-- OPCIONAL: genera 300 visitas de ejemplo en los últimos 30 días, para que los gráficos
-- no se vean vacíos durante el desarrollo o la exposición. Ejecutar una sola vez.
-- Para borrarlas: DELETE FROM visits WHERE ip = '0.0.0.0';
SET NAMES utf8mb4;
USE portfolio_db;

INSERT INTO visits (user_id, path, ip, created_at)
SELECT
  IF(RAND() < 0.25, (SELECT MIN(id) FROM users WHERE role = 'user'), NULL),  -- ~25% de usuarios registrados
  ELT(1 + FLOOR(RAND() * 4), '/', '/proyectos', '/login', '/registro'),
  '0.0.0.0',
  NOW() - INTERVAL FLOOR(RAND() * 30) DAY - INTERVAL FLOOR(RAND() * 1440) MINUTE
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2) c;
