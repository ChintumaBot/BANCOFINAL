

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Guardar la configuración de caracteres actual
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
-- Establecer la codificación de caracteres a utf8mb4
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `banca_movil`
-- --------------------------------------------------------

-- Estructura de tabla para la tabla `cuentas`
CREATE TABLE `cuentas` (
  `id` int(11) NOT NULL, -- Identificador único de la cuenta
  `nombre` varchar(100) NOT NULL, -- Nombre del titular de la cuenta
  `apellido_paterno` varchar(50) NOT NULL, -- Apellido paterno del titular
  `apellido_materno` varchar(50) NOT NULL, -- Apellido materno del titular
  `correo` varchar(100) NOT NULL, -- Correo electrónico del titular
  `saldo` decimal(10,2) NOT NULL DEFAULT 0.00, -- Saldo de la cuenta
  `fecha_apertura` timestamp NOT NULL DEFAULT current_timestamp(), -- Fecha de apertura de la cuenta
  `password` varchar(255) NOT NULL -- Contraseña de la cuenta
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Estructura de tabla para la tabla `movimientos`
CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL, -- Identificador único del movimiento
  `id_cuenta` int(11) NOT NULL, -- Identificador de la cuenta origen
  `id_destino` int(11) DEFAULT NULL, -- Identificador de la cuenta destino
  `monto` decimal(10,2) NOT NULL, -- Monto del movimiento
  `descripcion` varchar(15) DEFAULT NULL, -- Descripción del movimiento
  `concepto` varchar(255) DEFAULT NULL, -- Concepto del movimiento
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(), -- Fecha del movimiento
  `estado` enum('pendiente','completada') DEFAULT 'pendiente' -- Estado del movimiento
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Indices de la tabla `cuentas`
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`id`), -- Establecer `id` como clave primaria
  ADD UNIQUE KEY `correo` (`correo`); -- Establecer `correo` como clave única

-- Indices de la tabla `movimientos`
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`), -- Establecer `id` como clave primaria
  ADD KEY `id_cuenta` (`id_cuenta`), -- Índice para `id_cuenta`
  ADD KEY `id_destino` (`id_destino`); -- Índice para `id_destino`

-- AUTO_INCREMENT de las tablas volcadas
-- AUTO_INCREMENT de la tabla `cuentas`
ALTER TABLE `cuentas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT; -- Habilitar AUTO_INCREMENT para `id`

-- AUTO_INCREMENT de la tabla `movimientos`
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT; -- Habilitar AUTO_INCREMENT para `id`

-- Restricciones para tablas volcadas
-- Filtros para la tabla `movimientos`
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`id_destino`) REFERENCES `cuentas` (`id`); -- Establecer clave foránea para `id_destino`

-- Confirmar la transacción
COMMIT;

-- Restaurar la configuración de caracteres original
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
