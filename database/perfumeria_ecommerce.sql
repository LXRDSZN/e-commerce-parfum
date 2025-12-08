-- =====================================================
-- BASE DE DATOS E-COMMERCE PERFUMERÍA
-- Sistema completo tipo MercadoLibre para perfumes
-- =====================================================

-- Crear base de datos
CREATE DATABASE perfumeria_ecommerce;
\c perfumeria_ecommerce;

-- =====================================================
-- TABLA DE ROLES DE USUARIO
-- =====================================================
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles básicos
INSERT INTO roles (nombre_rol, descripcion) VALUES 
('ADMIN', 'Administrador del sistema'),
('VENDEDOR', 'Vendedor con permisos de gestión'),
('CLIENTE', 'Cliente regular'),
('PREMIUM', 'Cliente premium con beneficios especiales');

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    genero CHAR(1) CHECK (genero IN ('M', 'F', 'O')),
    id_rol INTEGER REFERENCES roles(id_rol) DEFAULT 3,
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP,
    avatar_url VARCHAR(500),
    puntos_fidelidad INTEGER DEFAULT 0
);

-- =====================================================
-- TABLA DE DIRECCIONES
-- =====================================================
CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    tipo_direccion VARCHAR(20) CHECK (tipo_direccion IN ('ENVIO', 'FACTURACION', 'AMBAS')),
    nombre_contacto VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    calle VARCHAR(200) NOT NULL,
    numero_exterior VARCHAR(20),
    numero_interior VARCHAR(20),
    colonia VARCHAR(100),
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    pais VARCHAR(50) DEFAULT 'México',
    referencia TEXT,
    es_principal BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE MARCAS
-- =====================================================
CREATE TABLE marcas (
    id_marca SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    pais_origen VARCHAR(50),
    logo_url VARCHAR(500),
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar marcas de perfumes famosos
INSERT INTO marcas (nombre, descripcion, pais_origen) VALUES 
('Valentino', 'Casa de moda italiana fundada por Valentino Garavani', 'Italia'),
('Jean Paul Gaultier', 'Diseñador francés conocido por su estilo vanguardista', 'Francia'),
('Azzaro', 'Casa francesa de perfumes de lujo', 'Francia'),
('Carolina Herrera', 'Diseñadora venezolana radicada en Nueva York', 'Venezuela'),
('Versace', 'Casa de moda italiana de lujo', 'Italia'),
('Chanel', 'Casa francesa de moda y perfumes de alta costura', 'Francia'),
('Dior', 'Casa francesa de moda y perfumes de lujo', 'Francia'),
('Tom Ford', 'Diseñador estadounidense de lujo', 'Estados Unidos'),
('Paco Rabanne', 'Diseñador español-francés', 'España'),
('Dolce & Gabbana', 'Dúo de diseñadores italianos', 'Italia'),
('Hugo Boss', 'Marca alemana de moda y fragancias', 'Alemania'),
('Calvin Klein', 'Marca estadounidense de moda y fragancias', 'Estados Unidos'),
('Armani', 'Casa italiana de moda y perfumes', 'Italia'),
('Yves Saint Laurent', 'Casa francesa de moda de lujo', 'Francia'),
('Bulgari', 'Joyería y perfumería italiana de lujo', 'Italia');

-- =====================================================
-- TABLA DE CATEGORÍAS
-- =====================================================
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_padre INTEGER REFERENCES categorias(id_categoria),
    imagen_url VARCHAR(500),
    activa BOOLEAN DEFAULT true,
    orden_mostrar INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías principales y subcategorías
INSERT INTO categorias (nombre, descripcion, categoria_padre) VALUES 
('Perfumes', 'Categoría principal de perfumes', NULL),
('Hombre', 'Perfumes para hombre', 1),
('Mujer', 'Perfumes para mujer', 1),
('Niños', 'Perfumes para niños', 1),
('Unisex', 'Perfumes unisex', 1),
('Eau de Parfum', 'Perfumes con alta concentración', 2),
('Eau de Toilette', 'Perfumes con concentración media', 2),
('Colonia', 'Fragancias ligeras', 2),
('Eau de Parfum Mujer', 'Perfumes intensos para mujer', 3),
('Eau de Toilette Mujer', 'Fragancias suaves para mujer', 3),
('Perfumes Infantiles', 'Fragancias especiales para niños', 4),
('Sets y Regalos', 'Conjuntos de perfumes y accesorios', 1);

-- =====================================================
-- TABLA DE PRODUCTOS
-- =====================================================
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    id_marca INTEGER REFERENCES marcas(id_marca),
    id_categoria INTEGER REFERENCES categorias(id_categoria),
    sku VARCHAR(50) UNIQUE NOT NULL,
    precio_original DECIMAL(10,2) NOT NULL,
    precio_descuento DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    ml_contenido INTEGER, -- mililitros
    concentracion VARCHAR(50), -- EDP, EDT, Colonia, etc.
    notas_olfativas TEXT, -- Notas altas, medias y bajas
    genero VARCHAR(20) CHECK (genero IN ('HOMBRE', 'MUJER', 'NIÑOS', 'UNISEX')),
    activo BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    nuevo BOOLEAN DEFAULT false,
    en_oferta BOOLEAN DEFAULT false,
    peso DECIMAL(5,2), -- en gramos
    dimensiones VARCHAR(50), -- LxWxH en cm
    fecha_lanzamiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vistas INTEGER DEFAULT 0,
    ventas_totales INTEGER DEFAULT 0,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    total_reseñas INTEGER DEFAULT 0
);

-- =====================================================
-- TABLA DE IMÁGENES DE PRODUCTOS
-- =====================================================
CREATE TABLE imagenes_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
    url_imagen VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    es_principal BOOLEAN DEFAULT false,
    orden_mostrar INTEGER DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE RESEÑAS Y CALIFICACIONES
-- =====================================================
CREATE TABLE reseñas (
    id_reseña SERIAL PRIMARY KEY,
    id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(200),
    comentario TEXT,
    verificada BOOLEAN DEFAULT false, -- si compró el producto
    util_positivo INTEGER DEFAULT 0,
    util_negativo INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_producto, id_usuario)
);

-- =====================================================
-- TABLA DE CARRITO DE COMPRAS
-- =====================================================
CREATE TABLE carrito (
    id_carrito SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_producto)
);

-- =====================================================
-- TABLA DE CUPONES Y DESCUENTOS
-- =====================================================
CREATE TABLE cupones (
    id_cupon SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(200),
    tipo_descuento VARCHAR(20) CHECK (tipo_descuento IN ('PORCENTAJE', 'FIJO')),
    valor_descuento DECIMAL(10,2) NOT NULL,
    monto_minimo DECIMAL(10,2) DEFAULT 0,
    usos_maximos INTEGER,
    usos_actuales INTEGER DEFAULT 0,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT true,
    solo_primera_compra BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE PEDIDOS
-- =====================================================
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    id_direccion_envio INTEGER REFERENCES direcciones(id_direccion),
    id_direccion_facturacion INTEGER REFERENCES direcciones(id_direccion),
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0,
    costo_envio DECIMAL(10,2) DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    id_cupon INTEGER REFERENCES cupones(id_cupon),
    metodo_pago VARCHAR(50) NOT NULL,
    estado_pedido VARCHAR(30) DEFAULT 'PENDIENTE' CHECK (
        estado_pedido IN ('PENDIENTE', 'CONFIRMADO', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO', 'DEVUELTO')
    ),
    estado_pago VARCHAR(30) DEFAULT 'PENDIENTE' CHECK (
        estado_pago IN ('PENDIENTE', 'PROCESANDO', 'PAGADO', 'FALLIDO', 'REEMBOLSADO')
    ),
    notas_pedido TEXT,
    tracking_number VARCHAR(100),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    fecha_envio TIMESTAMP,
    fecha_entrega TIMESTAMP,
    fecha_cancelacion TIMESTAMP
);

-- =====================================================
-- TABLA DE DETALLES DE PEDIDOS
-- =====================================================
CREATE TABLE detalles_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INTEGER REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INTEGER REFERENCES productos(id_producto),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE MÉTODOS DE PAGO
-- =====================================================
CREATE TABLE metodos_pago (
    id_metodo SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    tipo_metodo VARCHAR(30) CHECK (tipo_metodo IN ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'PAYPAL', 'TRANSFERENCIA')),
    numero_tarjeta_encriptado VARCHAR(255), -- Solo últimos 4 dígitos visibles
    nombre_titular VARCHAR(100),
    mes_expiracion INTEGER,
    año_expiracion INTEGER,
    es_principal BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE TRANSACCIONES
-- =====================================================
CREATE TABLE transacciones (
    id_transaccion SERIAL PRIMARY KEY,
    id_pedido INTEGER REFERENCES pedidos(id_pedido),
    id_metodo_pago INTEGER REFERENCES metodos_pago(id_metodo),
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'MXN',
    estado_transaccion VARCHAR(30) CHECK (
        estado_transaccion IN ('PENDIENTE', 'PROCESANDO', 'EXITOSA', 'FALLIDA', 'CANCELADA', 'REEMBOLSADA')
    ),
    referencia_externa VARCHAR(100), -- ID del procesador de pago
    codigo_autorizacion VARCHAR(50),
    mensaje_respuesta TEXT,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE WISHLIST (LISTA DE DESEOS)
-- =====================================================
CREATE TABLE wishlist (
    id_wishlist SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_producto)
);

-- =====================================================
-- TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('INFO', 'PEDIDO', 'PROMOCION', 'SISTEMA', 'ENVIO')),
    leida BOOLEAN DEFAULT false,
    url_accion VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP
);

-- =====================================================
-- TABLA DE CONFIGURACIONES DEL SISTEMA
-- =====================================================
CREATE TABLE configuraciones (
    id_config SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo_dato VARCHAR(20) DEFAULT 'STRING',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuraciones básicas
INSERT INTO configuraciones (clave, valor, descripcion) VALUES 
('ENVIO_GRATIS_MINIMO', '500.00', 'Monto mínimo para envío gratuito'),
('IVA_PORCENTAJE', '16.00', 'Porcentaje de IVA aplicable'),
('MONEDA_PRINCIPAL', 'MXN', 'Moneda principal del sitio'),
('PRODUCTOS_POR_PAGINA', '12', 'Productos mostrados por página'),
('EMAIL_SOPORTE', 'soporte@perfumeria.com', 'Email de soporte al cliente'),
('TELEFONO_SOPORTE', '+52-55-1234-5678', 'Teléfono de soporte');

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_productos_marca ON productos(id_marca);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_genero ON productos(genero);
CREATE INDEX idx_productos_precio ON productos(precio_original);
CREATE INDEX idx_productos_destacado ON productos(destacado);
CREATE INDEX idx_productos_fecha ON productos(fecha_creacion);

CREATE INDEX idx_pedidos_usuario ON pedidos(id_usuario);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado ON pedidos(estado_pedido);

CREATE INDEX idx_carrito_usuario ON carrito(id_usuario);
CREATE INDEX idx_reseñas_producto ON reseñas(id_producto);
CREATE INDEX idx_imagenes_producto ON imagenes_producto(id_producto);

-- =====================================================
-- TRIGGERS Y FUNCIONES
-- =====================================================

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para productos
CREATE TRIGGER trigger_productos_actualizacion
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Función para generar número de pedido único
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numero_pedido = 'PED-' || LPAD(NEW.id_pedido::TEXT, 8, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de pedido
CREATE TRIGGER trigger_generar_numero_pedido
    BEFORE INSERT ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION generar_numero_pedido();

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de productos con información completa
CREATE VIEW v_productos_completo AS
SELECT 
    p.*,
    m.nombre as marca_nombre,
    c.nombre as categoria_nombre,
    CASE 
        WHEN p.precio_descuento IS NOT NULL AND p.precio_descuento > 0 
        THEN p.precio_descuento 
        ELSE p.precio_original 
    END as precio_final,
    CASE 
        WHEN p.precio_descuento IS NOT NULL AND p.precio_descuento > 0 
        THEN ROUND(((p.precio_original - p.precio_descuento) / p.precio_original * 100), 0)
        ELSE 0 
    END as porcentaje_descuento
FROM productos p
LEFT JOIN marcas m ON p.id_marca = m.id_marca
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria;

-- Vista de pedidos con detalles
CREATE VIEW v_pedidos_detalle AS
SELECT 
    p.*,
    u.nombre || ' ' || u.apellidos as cliente_nombre,
    u.email as cliente_email,
    COUNT(dp.id_detalle) as total_items,
    SUM(dp.cantidad) as total_productos
FROM pedidos p
JOIN usuarios u ON p.id_usuario = u.id_usuario
LEFT JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
GROUP BY p.id_pedido, u.id_usuario;

-- =====================================================
-- DATOS DE PRUEBA - PERFUMES POPULARES
-- =====================================================

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, id_marca, id_categoria, sku, precio_original, precio_descuento, stock, ml_contenido, concentracion, genero, destacado, notas_olfativas) VALUES 

-- VALENTINO
('Valentino Born In Roma Yellow Dream', 'Fragancia floral frutal llena de energía y vitalidad', 1, 3, 'VAL-BIRY-50', 2890.00, 2312.00, 25, 50, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Pera, Limón. Notas medias: Gardenia, Jazmín. Notas bajas: Vainilla, Madera blanca'),
('Valentino Uomo Born In Roma', 'Elegancia urbana moderna para el hombre contemporáneo', 1, 2, 'VAL-UBIR-100', 3250.00, NULL, 18, 100, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Jengibre, Violeta. Notas medias: Artemisia, Salvia. Notas bajas: Vetiver, Madera de cachemira'),

-- JEAN PAUL GAULTIER  
('Jean Paul Gaultier La Belle', 'La esencia de la feminidad parisina', 2, 3, 'JPG-LB-100', 2750.00, 2200.00, 30, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Pera, Bergamota. Notas medias: Datura, Jazmín sambac. Notas bajas: Vainilla, Sándalo'),
('Jean Paul Gaultier Le Male', 'El icónico perfume masculino en frasco de marinero', 2, 2, 'JPG-LM-125', 2450.00, NULL, 22, 125, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Menta, Lavanda, Bergamota. Notas medias: Canela, Naranja, Comino. Notas bajas: Vainilla, Cedro, Sándalo'),

-- AZZARO
('Azzaro Wanted By Night', 'Seducción nocturna irresistible', 3, 2, 'AZZ-WBN-100', 2180.00, 1744.00, 35, 100, 'Eau de Parfum', 'HOMBRE', false, 'Notas altas: Canela, Limón. Notas medias: Lavanda, Tabaco. Notas bajas: Vainilla, Madera de cedro'),
('Azzaro Wanted Girl', 'Dulce rebeldía femenina', 3, 3, 'AZZ-WG-80', 1980.00, NULL, 28, 80, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Granada, Jengibre rosa. Notas medias: Flor de naranjo, Datura. Notas bajas: Haba tonka, Pachulí'),

-- CAROLINA HERRERA
('Carolina Herrera Good Girl', 'Dulce y rebelde, para la mujer moderna', 4, 3, 'CH-GG-80', 3150.00, 2520.00, 20, 80, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Almendra, Café. Notas medias: Jazmín sambac, Tuberosa. Notas bajas: Haba tonka, Cacao, Vainilla'),
('Carolina Herrera Bad Boy', 'Elegante rebeldía masculina', 4, 2, 'CH-BB-100', 2890.00, NULL, 15, 100, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Pimienta negra, Bergamota. Notas medias: Cedro, Salvia. Notas bajas: Haba tonka, Cacao, Amberwood'),

-- VERSACE
('Versace Dylan Blue Femme', 'Sensualidad mediterránea', 5, 3, 'VER-DBF-100', 2650.00, 2120.00, 25, 100, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Grosella negra, Manzana Granny Smith. Notas medias: Petalia, Rosa, Jazmín. Notas bajas: Almizcle blanco, Madera, Estirax'),
('Versace Dylan Blue', 'Frescura masculina mediterránea', 5, 2, 'VER-DB-100', 2580.00, NULL, 30, 100, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Bergamota, Pomelo, Hojas de higuera. Notas medias: Violeta, Papirus, Pimienta negra. Notas bajas: Pachulí, Incienso, Almizcle'),

-- CHANEL
('Chanel Coco Mademoiselle', 'Elegancia atemporal francesa', 6, 3, 'CHA-CM-100', 3850.00, NULL, 12, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Naranja, Bergamota, Pomelo. Notas medias: Rosa, Jazmín, Lichi. Notas bajas: Pachulí, Vainilla, Madera blanca'),
('Chanel Bleu de Chanel', 'Sofisticación masculina sin límites', 6, 2, 'CHA-BC-100', 3650.00, 3285.00, 18, 100, 'Eau de Parfum', 'HOMBRE', true, 'Notas altas: Limón, Bergamota, Menta. Notas medias: Jengibre, Nuez moscada, Jazmín. Notas bajas: Incienso, Cedro, Sándalo'),

-- Perfumes para niños
('Hugo Boss Bottled Tonic', 'Frescura juvenil para adolescentes', 11, 4, 'HB-BT-100', 1850.00, 1480.00, 40, 100, 'Eau de Toilette', 'NIÑOS', false, 'Notas altas: Limón, Manzana, Jengibre. Notas medias: Geranio. Notas bajas: Madera de cedro'),
('Calvin Klein CK One', 'Fragancia unisex icónica', 12, 5, 'CK-ONE-200', 1650.00, NULL, 50, 200, 'Eau de Toilette', 'UNISEX', false, 'Notas altas: Bergamota, Cardamomo, Piña. Notas medias: Jazmín, Violeta, Rosa. Notas bajas: Almizcle, Cedro, Ámbar');

-- Insertar imágenes de productos (URLs de ejemplo)
INSERT INTO imagenes_producto (id_producto, url_imagen, alt_text, es_principal, orden_mostrar) VALUES 
(1, '/images/productos/valentino-born-roma-yellow-1.jpg', 'Valentino Born In Roma Yellow Dream', true, 1),
(1, '/images/productos/valentino-born-roma-yellow-2.jpg', 'Valentino Born In Roma Yellow Dream vista lateral', false, 2),
(2, '/images/productos/valentino-uomo-born-roma-1.jpg', 'Valentino Uomo Born In Roma', true, 1),
(3, '/images/productos/jpg-la-belle-1.jpg', 'Jean Paul Gaultier La Belle', true, 1),
(4, '/images/productos/jpg-le-male-1.jpg', 'Jean Paul Gaultier Le Male', true, 1),
(5, '/images/productos/azzaro-wanted-night-1.jpg', 'Azzaro Wanted By Night', true, 1),
(6, '/images/productos/azzaro-wanted-girl-1.jpg', 'Azzaro Wanted Girl', true, 1),
(7, '/images/productos/ch-good-girl-1.jpg', 'Carolina Herrera Good Girl', true, 1),
(8, '/images/productos/ch-bad-boy-1.jpg', 'Carolina Herrera Bad Boy', true, 1),
(9, '/images/productos/versace-dylan-blue-f-1.jpg', 'Versace Dylan Blue Femme', true, 1),
(10, '/images/productos/versace-dylan-blue-1.jpg', 'Versace Dylan Blue', true, 1),
(11, '/images/productos/chanel-coco-mad-1.jpg', 'Chanel Coco Mademoiselle', true, 1),
(12, '/images/productos/chanel-bleu-1.jpg', 'Chanel Bleu de Chanel', true, 1);

-- Usuario administrador de prueba
INSERT INTO usuarios (nombre, apellidos, email, password, telefono, genero, id_rol, activo, email_verificado) VALUES 
('Administrador', 'Sistema', 'admin@perfumeria.com', '$2b$10$XYZ123...', '+52-55-1234-5678', 'M', 1, true, true),
('María', 'González', 'maria@ejemplo.com', '$2b$10$ABC123...', '+52-55-9876-5432', 'F', 3, true, true),
('Carlos', 'Rodríguez', 'carlos@ejemplo.com', '$2b$10$DEF456...', '+52-55-5555-1234', 'M', 3, true, true);

-- Cupones de ejemplo
INSERT INTO cupones (codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, usos_maximos, fecha_inicio, fecha_expiracion) VALUES 
('BIENVENIDO20', '20% de descuento en tu primera compra', 'PORCENTAJE', 20.00, 500.00, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('ENVIOGRATIS', 'Envío gratis en compras mayores a $800', 'FIJO', 150.00, 800.00, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('NAVIDAD2024', 'Descuento especial de Navidad', 'PORCENTAJE', 25.00, 1000.00, 200, CURRENT_TIMESTAMP, '2024-12-31 23:59:59');

COMMIT;

-- =====================================================
-- SCRIPT COMPLETADO
-- Base de datos lista para E-commerce de Perfumería
-- =====================================================