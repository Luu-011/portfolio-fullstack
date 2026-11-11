-- Esquema de la API de reservas. Se puede correr a mano o dejar que la API lo
-- ejecute al arrancar (DB_INIT=true). La base de datos tiene que existir:
--   CREATE DATABASE reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservas (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(80)  NOT NULL,
  email          VARCHAR(120) NOT NULL,
  telefono       VARCHAR(20)  NULL,
  servicio       VARCHAR(30)  NOT NULL,
  fecha          DATE         NOT NULL,
  hora           TIME         NOT NULL,
  notas          VARCHAR(240) NULL,
  estado         ENUM('confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
  creada_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Vale 1 mientras la reserva está confirmada y NULL cuando se cancela.
  -- MySQL no cuenta los NULL en un índice UNIQUE: así un horario no se puede
  -- reservar dos veces a la vez (aunque lleguen dos pedidos simultáneos), pero
  -- vuelve a quedar libre apenas se cancela la reserva.
  turno_activo   TINYINT GENERATED ALWAYS AS (IF(estado = 'confirmada', 1, NULL)) STORED,

  PRIMARY KEY (id),
  UNIQUE KEY uq_turno_activo (fecha, hora, turno_activo),
  KEY idx_email (email),
  KEY idx_fecha (fecha)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
