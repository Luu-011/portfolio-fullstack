-- Datos iniciales para desarrollo. Ejecutar DESPUÉS de schema.sql, una sola vez.
USE portfolio_db;

-- Cuentas de prueba (las contraseñas están guardadas con bcrypt, nunca en texto plano)
--   admin@demo.com     / Admin12345   (rol admin)
--   operador@demo.com  / Operador123  (rol operator)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador', 'admin@demo.com',    '$2b$10$NKlQzXXZsJPPOJFqWkY5getvyI0NyuEs4Yt2VtLP0HF0eAdkPUnkG', 'admin'),
  ('Operador',      'operador@demo.com', '$2b$10$FkaXhApXfCssPrOpbggFb.lnX.u2xIm.vKKr0F1ECPTMLYNLQv1ci', 'operator');

INSERT INTO services (title, description) VALUES
  ('Desarrollo frontend',  'Interfaces responsive, accesibles y cuidadas en cada interacción.'),
  ('APIs y backend',       'Servicios REST, autenticación e integración con bases de datos.'),
  ('Soluciones fullstack', 'Acompañamiento desde la idea hasta una experiencia lista para crecer.');

INSERT INTO projects (title, summary, description, stack, repo_url, year) VALUES
  ('Tienda online', 'Catálogo, carrito y panel de pedidos para un comercio local.',
   'Aplicación web con catálogo de productos, carrito de compras y gestión de pedidos. El backend expone una API REST con autenticación y el frontend consume los datos con React.',
   '["React","Node.js","Express","MySQL"]', 'https://github.com/', 2026),
  ('Gestor de tareas', 'Tablero de tareas con arrastrar y soltar y guardado local.',
   'Tablero estilo kanban que usa la API Drag and Drop y Web Storage para recordar el estado entre sesiones.',
   '["React","JavaScript","Web Storage API"]', 'https://github.com/', 2026),
  ('API de reservas', 'Servicio REST para reservar turnos con validaciones.',
   'API para crear, consultar y cancelar reservas, con validación de datos y consultas parametrizadas sobre MySQL.',
   '["Node.js","Express","MySQL","REST API"]', 'https://github.com/', 2025);

INSERT INTO demos (project_id, title, description, url) VALUES
  (1, 'Catálogo de productos', 'Listado con filtros y búsqueda.', 'https://example.com'),
  (1, 'Panel de pedidos', 'Vista del operador con estados de pedido.', 'https://example.com'),
  (2, 'Tablero kanban', 'Mover tareas entre columnas.', 'https://example.com');

INSERT INTO contacts (name, email, type, message, status, created_at) VALUES
  ('Camila Rojas', 'camila@ejemplo.com', 'Cotización de proyecto',
   'Hola, necesito una web con tienda online para mi emprendimiento. ¿Cuánto tiempo llevaría y qué presupuesto aproximado manejás?',
   'pendiente', '2026-11-03 14:20:00'),
  ('Martín Pérez', 'martin@ejemplo.com', 'Asesoría técnica',
   'Estoy dudando entre MySQL y MongoDB para una app de reservas. ¿Me podés orientar?',
   'respondida', '2026-11-01 10:05:00'),
  ('Lucía Gómez', 'lucia@ejemplo.com', 'Consulta general',
   'Vi tu portfolio y me gustó mucho. ¿Trabajás con equipos o solo de forma independiente?',
   'pendiente', '2026-10-30 09:15:00');

INSERT INTO contact_replies (contact_id, user_id, message, created_at) VALUES
  (2, 2, 'Para reservas conviene MySQL, porque hay relaciones claras entre usuarios, turnos y servicios. Si querés, coordinamos una llamada corta.', '2026-11-01 16:40:00');
