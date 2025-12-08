-- Crear base de datos
CREATE DATABASE perfumeria_db;

\c perfumeria_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    pais VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Tabla de perfumes
CREATE TABLE perfumes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('HOMBRE', 'MUJER', 'NIÑO')),
    tamaño VARCHAR(20),
    imagen_url VARCHAR(500),
    tipo VARCHAR(20),
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    vendidos INTEGER DEFAULT 0
);

-- Tabla del carrito de compras
CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    perfume_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfumes(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, perfume_id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion_envio TEXT,
    metodo_pago VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalles de pedido
CREATE TABLE detalle_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    perfume_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfumes(id)
);

-- Insertar datos de ejemplo para perfumes
INSERT INTO perfumes (nombre, marca, descripcion, precio, stock, categoria, tamaño, imagen_url, tipo, notas) VALUES

-- ⭐ CHANEL - Perfumes Populares
('Bleu de Chanel', 'Chanel', 'Un aromático-amaderado de carácter decidido', 109.99, 25, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'EDP', 'Pomelo, Limón, Menta, Pimienta rosa'),
('Bleu de Chanel Parfum', 'Chanel', 'Versión más intensa de Bleu de Chanel', 129.99, 20, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 'Parfum', 'Cedro, Sándalo, Aloe Vera'),
('Bleu de Chanel Eau de Toilette', 'Chanel', 'La versión más fresca', 89.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 'EDT', 'Bergamota, Pomelo rosa, Jengibre'),
('Chance Eau de Toilette', 'Chanel', 'Una fragancia chispeante', 95.99, 35, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400', 'EDT', 'Pomelo rosa, Jacintos, Jazmín'),
('Chance Eau de Parfum', 'Chanel', 'Más intensa y sensual', 115.99, 28, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 'EDP', 'Pimienta rosa, Jazmín, Ámbar'),
('Chance Eau Vive', 'Chanel', 'Energía y vitalidad', 99.99, 32, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400', 'EDT', 'Pomelo, Naranjo dulce, Jazmín'),
('Coco Mademoiselle Eau de Parfum', 'Chanel', 'Un oriental fresco y voluptuoso', 119.99, 25, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400', 'EDP', 'Naranja, Bergamota, Pomelo'),
('Coco Mademoiselle Intense', 'Chanel', 'La versión más intensa', 139.99, 18, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'EDP Intense', 'Rosa, Jazmín, Pachulí'),

-- ⭐ DIOR - Perfumes Populares  
('Sauvage Eau de Toilette', 'Dior', 'Un acto de creación inspirado por espacios abiertos', 95.99, 60, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400', 'EDT', 'Bergamota de Calabria, Pimienta de Sichuan'),
('Sauvage Eau de Parfum', 'Dior', 'Más intenso y sofisticado', 115.99, 45, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1565170544803-1142719fec83?w=400', 'EDP', 'Bergamota, Lavanda, Nuez moscada'),
('Sauvage Parfum', 'Dior', 'La concentración más alta', 135.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'Parfum', 'Mandarina, Sándalo, Vainilla'),
('Sauvage Elixir', 'Dior', 'Extremadamente concentrado', 159.99, 20, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1627388678394-7046d5b58c4a?w=400', 'Elixir', 'Canela, Cardamomo, Lavanda'),
('Dior Homme Eau de Toilette', 'Dior', 'Elegancia masculina contemporánea', 89.99, 40, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'EDT', 'Bergamota, Salvia, Cacao'),
('Dior Homme Intense', 'Dior', 'Intensidad y sofisticación', 109.99, 35, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1557170334-94af5aae6902?w=400', 'EDP', 'Lavanda, Ámbar, Vainilla'),
('Miss Dior Eau de Parfum', 'Dior', 'Un homenaje al amor y a la feminidad', 104.99, 30, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'EDP', 'Mandarina sangrienta, Hoja de violeta'),
('Miss Dior Blooming Bouquet', 'Dior', 'Frescura floral delicada', 94.99, 38, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 'EDT', 'Peonía, Rosa, Musgo blanco'),

-- ⭐ TOM FORD - Perfumes Populares
('Black Orchid Parfum', 'Tom Ford', 'Lujuria, romance y seducción', 149.99, 25, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 'Parfum', 'Trufa negra, Orquídea negra, Chocolate'),
('Black Orchid Eau de Parfum', 'Tom Ford', 'Opulencia y sensualidad', 129.99, 30, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400', 'EDP', 'Bergamota, Ylang-ylang, Pachulí'),
('Oud Wood Eau de Parfum', 'Tom Ford', 'Madera de oud exótica', 179.99, 20, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 'EDP', 'Oud, Palisandro, Sándalo'),
('Oud Wood Intense', 'Tom Ford', 'Intensidad aromática', 199.99, 15, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400', 'EDP Intense', 'Oud ahumado, Ámbar, Incienso'),
('Ombre Leather Parfum', 'Tom Ford', 'Cuero y especias', 159.99, 22, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400', 'Parfum', 'Cuero, Cardamomo, Jazmín sambac'),
('Ombre Leather Eau de Parfum', 'Tom Ford', 'Cuero occidental americano', 139.99, 28, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'EDP', 'Cuero, Salvia, Pachulí'),

-- ⭐ CREED - Perfumes Populares
('Aventus Eau de Parfum', 'Creed', 'El perfume de los triunfadores', 299.99, 18, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400', 'EDP', 'Piña, Bergamota, Manzana negra'),
('Aventus Cologne', 'Creed', 'Versión más fresca de Aventus', 269.99, 20, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1565170544803-1142719fec83?w=400', 'Cologne', 'Jengibre, Mandarina, Sándalo'),
('Aventus for Her', 'Creed', 'La versión femenina del icono', 289.99, 16, 'MUJER', '75ml', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'EDP', 'Bergamota, Rosa, Almizcle'),
('Green Irish Tweed EDP', 'Creed', 'Elegancia verde y fresca', 249.99, 25, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1627388678394-7046d5b58c4a?w=400', 'EDP', 'Limón, Menta, Violeta'),
('Silver Mountain Water EDP', 'Creed', 'Frescura de montaña', 229.99, 22, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'EDP', 'Bergamota, Mandarina, Almizcle'),

-- ⭐ VERSACE - Perfumes Populares
('Eros Eau de Toilette', 'Versace', 'Pasión, deseo y seducción', 82.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1557170334-94af5aae6902?w=400', 'EDT', 'Menta, Manzana verde, Limón italiano'),
('Eros Eau de Parfum', 'Versace', 'Más intenso y duradero', 102.99, 25, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'EDP', 'Vainilla, Cedro, Sándalo'),
('Eros Flame', 'Versace', 'Pasión ardiente', 89.99, 28, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 'EDP', 'Mandarina, Geranio, Vainilla'),
('Dylan Blue Eau de Toilette', 'Versace', 'Mediterráneo contemporáneo', 79.99, 35, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 'EDT', 'Pomelo, Higo, Papiro'),
('Dylan Blue Pour Femme', 'Versace', 'Versión femenina sensual', 84.99, 30, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400', 'EDP', 'Grosella negra, Manzana, Rosa'),
('Bright Crystal EDT', 'Versace', 'Cristalina y luminosa', 76.99, 40, 'MUJER', '90ml', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 'EDT', 'Granada, Yuzu, Loto'),
('Bright Crystal Absolu', 'Versace', 'Versión más concentrada', 89.99, 32, 'MUJER', '90ml', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400', 'EDP', 'Granada, Frambuesa, Peonía'),

-- ⭐ VALENTINO - Perfumes Populares
('Born in Roma Uomo', 'Valentino', 'Modernidad y tradición romana', 94.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400', 'EDT', 'Jengibre, Violeta, Vetiver'),
('Born in Roma Uomo Intense', 'Valentino', 'Intensidad aromática', 109.99, 25, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'EDP', 'Lavanda, Jengibre, Vainilla'),
('Born in Roma Donna', 'Valentino', 'Feminidad moderna', 99.99, 28, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400', 'EDP', 'Grosella negra, Jazmín, Vainilla'),
('Uomo Eau de Toilette', 'Valentino', 'Elegancia italiana', 79.99, 35, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1565170544803-1142719fec83?w=400', 'EDT', 'Bergamota, Mirto, Cedro'),
('Uomo Intense', 'Valentino', 'Carácter decidido', 89.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'EDP', 'Clavo, Castañas, Chocolate'),
('Voce Viva EDP', 'Valentino', 'Voz de la feminidad', 94.99, 32, 'MUJER', '100ml', 'https://images.unsplash.com/photo-1627388678394-7046d5b58c4a?w=400', 'EDP', 'Mandarina, Gardenia, Vainilla'),

-- ⭐ AZZARO - Perfumes Populares
('Wanted EDT', 'Azzaro', 'Una fragancia rebelde y carismática', 74.99, 35, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'EDT', 'Cardamomo, Jengibre, Limón'),
('Wanted EDP', 'Azzaro', 'Más intenso y sofisticado', 84.99, 30, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1557170334-94af5aae6902?w=400', 'EDP', 'Bergamota, Cardamomo, Vetiver'),
('Wanted by Night', 'Azzaro', 'Seducción nocturna', 79.99, 28, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'EDP', 'Canela, Cacao, Tabaco'),
('Chrome Eau de Toilette', 'Azzaro', 'Frescura acuática', 59.99, 40, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 'EDT', 'Bergamota, Aguamarina, Musgo'),
('Chrome Pure', 'Azzaro', 'Pureza cristalina', 64.99, 38, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 'EDT', 'Bergamota, Jengibre, Mate'),
('The Most Wanted EDP', 'Azzaro', 'El más deseado', 89.99, 25, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400', 'EDP', 'Cardamomo, Tequila, Vainilla'),
('Wanted Girl', 'Azzaro', 'Rebeldía femenina', 74.99, 32, 'MUJER', '80ml', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 'EDP', 'Pomelo rosa, Dulzaina, Haba tonka'),

-- Perfumes adicionales de otras marcas premium
('Le Male', 'Jean Paul Gaultier', 'La fragancia masculina icónica', 69.99, 40, 'HOMBRE', '125ml', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400', 'EDT', 'Menta, Lavanda, Bergamota, Cardamomo'),
('Scandal', 'Jean Paul Gaultier', 'Escandalosamente adictiva', 79.99, 38, 'MUJER', '80ml', 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400', 'EDP', 'Miel, Gardenia, Nota sanguínea'),
('Good Girl', 'Carolina Herrera', 'Es bueno ser malo', 94.99, 45, 'MUJER', '80ml', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'EDP', 'Almendra, Café, Bergamota'),
('212 VIP', 'Carolina Herrera', 'Exclusividad y glamour', 79.99, 35, 'HOMBRE', '100ml', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400', 'EDT', 'Lima, Jengibre, Vodka'),

-- Perfumes para Niños
('Baby Dior', 'Dior', 'Frescura y dulzura para bebés', 39.99, 25, 'NIÑO', '50ml', 'https://images.unsplash.com/photo-1565170544803-1142719fec83?w=400', 'Agua de colonia', 'Rosa, miel, vainilla'),
('Petit Guerlain', 'Guerlain', 'Suavidad para los pequeños', 45.99, 20, 'NIÑO', '50ml', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'EDT', 'Mandarina, miel, vainilla'),
('Kids Lacoste', 'Lacoste', 'Aventura y diversión', 35.99, 22, 'NIÑO', '50ml', 'https://images.unsplash.com/photo-1627388678394-7046d5b58c4a?w=400', 'EDT', 'Notas frutales y florales suaves');
