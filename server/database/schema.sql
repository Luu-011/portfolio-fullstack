-- Esquema de la base de datos del portfolio (MySQL 8)
-- Ejecutar una vez. Si las tablas ya existen, no se pisan (CREATE ... IF NOT EXISTS).

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Personas con cuenta: visitantes registrados, operadores y administradores
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(60)  NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'operator', 'admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Servicios que ofrece el desarrollador
CREATE TABLE IF NOT EXISTS services (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  ref_price   DECIMAL(10, 2) NULL,
  active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trabajos que se muestran en el portfolio
CREATE TABLE IF NOT EXISTS projects (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  summary     VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  stack       JSON NOT NULL,              -- lista de tecnologías, ej. ["React","MySQL"]
  repo_url    VARCHAR(255) NULL,
  image       VARCHAR(255) NULL,
  year        SMALLINT UNSIGNED NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Un proyecto tiene varias demos (relación 1:N)
CREATE TABLE IF NOT EXISTS demos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id  INT UNSIGNED NOT NULL,
  title       VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  url         VARCHAR(255) NOT NULL,
  CONSTRAINT fk_demos_project FOREIGN KEY (project_id)
    REFERENCES projects (id) ON DELETE CASCADE
);

-- Mensajes del formulario de contacto
CREATE TABLE IF NOT EXISTS contacts (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id INT UNSIGNED NULL,           -- opcional: cotización de un servicio puntual
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(120) NOT NULL,
  type       ENUM('Consulta general', 'Cotización de proyecto', 'Asesoría técnica') NOT NULL,
  message    TEXT NOT NULL,
  status     ENUM('pendiente', 'respondida') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contacts_service FOREIGN KEY (service_id)
    REFERENCES services (id) ON DELETE SET NULL
);

-- Historial de respuestas y seguimiento de cada consulta (1:N)
CREATE TABLE IF NOT EXISTS contact_replies (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contact_id INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NULL,           -- quién respondió (operador o admin)
  message    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_replies_contact FOREIGN KEY (contact_id)
    REFERENCES contacts (id) ON DELETE CASCADE,
  CONSTRAINT fk_replies_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL
);

-- Visitas al sitio. user_id NULL = visita general; con valor = acceso de usuario registrado
CREATE TABLE IF NOT EXISTS visits (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NULL,
  path       VARCHAR(255) NOT NULL,
  ip         VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_visits_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_visits_created (created_at)
);
