USE portfolio_db;

UPDATE demos
SET title = 'Tienda "Empachadito"',
    description = 'Tienda online con catálogo de productos y carrito.',
    url = '/demos/Empachadito.html'
WHERE id = 1;

UPDATE demos SET url = '/demos/panel-pedidos.html' WHERE id = 2;
UPDATE demos SET url = '/demos/gestor-tareas/index.html' WHERE id = 3;

INSERT INTO demos (project_id, title, description, url)
SELECT 3, 'Reservas de turnos',
    'Elegí un día y un horario, reservá y cancelá turnos contra la API.',
    '/demos/reservas.html'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM demos WHERE url = '/demos/reservas.html');

SELECT id, project_id, title, url FROM demos;