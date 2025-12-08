-- =====================================================
-- PRODUCTOS ADICIONALES - PERFUMES DE DISEÑADOR
-- Amplia colección de perfumes premium
-- =====================================================

\c perfumeria_ecommerce;

-- =====================================================
-- AGREGAR MÁS MARCAS DE DISEÑADOR
-- =====================================================
INSERT INTO marcas (nombre, descripcion, pais_origen) VALUES 
('Creed', 'Casa británica de perfumes artesanales de lujo desde 1760', 'Reino Unido'),
('Maison Francis Kurkdjian', 'Perfumista francés creador de fragancias de nicho', 'Francia'),
('Byredo', 'Marca sueca de perfumes de nicho contemporáneos', 'Suecia'),
('Le Labo', 'Perfumes artesanales neoyorquinos de alta calidad', 'Estados Unidos'),
('Diptyque', 'Casa parisina de fragancias y velas de lujo', 'Francia'),
('Hermès', 'Casa francesa de lujo especializada en marroquinería y perfumes', 'Francia'),
('Givenchy', 'Casa francesa de alta costura y perfumería', 'Francia'),
('Lancôme', 'Marca francesa de cosméticos y fragancias', 'Francia'),
('Thierry Mugler', 'Diseñador francés conocido por fragancias innovadoras', 'Francia'),
('Issey Miyake', 'Diseñador japonés famoso por sus fragancias minimalistas', 'Japón'),
('Kenzo', 'Casa japonesa-francesa de moda y perfumes', 'Japón/Francia'),
('Moschino', 'Casa italiana de moda y fragancias divertidas', 'Italia'),
('Burberry', 'Marca británica icónica de moda y fragancias', 'Reino Unido'),
('Marc Jacobs', 'Diseñador estadounidense de moda y perfumes', 'Estados Unidos'),
('Viktor & Rolf', 'Dúo holandés de diseñadores de moda y fragancias', 'Países Bajos'),
('Escada', 'Casa alemana de moda y fragancias femeninas', 'Alemania'),
('Cacharel', 'Marca francesa romántica de moda y perfumes', 'Francia'),
('Narciso Rodriguez', 'Diseñador cubano-americano de fragancias elegantes', 'Estados Unidos'),
('Montblanc', 'Marca alemana de lujo conocida por plumas y fragancias', 'alemania'),
('Davidoff', 'Casa suiza de tabaco y fragancias masculinas', 'Suiza');

-- =====================================================
-- PRODUCTOS PREMIUM - CREED
-- =====================================================
INSERT INTO productos (nombre, descripcion, id_marca, id_categoria, sku, precio_original, precio_descuento, stock, ml_contenido, concentracion, genero, destacado, notas_olfativas) VALUES 

-- CREED (Marca 16)
('Creed Aventus', 'La fragancia masculina más codiciada del mundo', 16, 2, 'CRE-AV-100', 8500.00, 7650.00, 8, 100, 'Eau de Parfum', 'HOMBRE', true, 'Notas altas: Piña, Bergamota, Manzana negra, Grosella negra. Notas medias: Rosa, Abedul seco, Jazmín marroquí, Pachulí. Notas bajas: Roble, Almizcle, Ámbar gris, Vainilla'),
('Creed Silver Mountain Water', 'Frescura alpina cristalina', 16, 5, 'CRE-SMW-100', 7800.00, NULL, 12, 100, 'Eau de Parfum', 'UNISEX', true, 'Notas altas: Bergamota, Mandarina. Notas medias: Té verde, Grosella negra. Notas bajas: Almizcle, Madera de sándalo'),
('Creed Love in White', 'Elegancia femenina pura', 16, 3, 'CRE-LIW-75', 7200.00, 6480.00, 6, 75, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Limón, Naranja, Arroz. Notas medias: Azahar, Datura, Magnolia. Notas bajas: Almizcle blanco, Cedro, Sándalo'),

-- MAISON FRANCIS KURKDJIAN (Marca 17)
('MFK Baccarat Rouge 540', 'La fragancia más viral del siglo XXI', 17, 5, 'MFK-BR540-70', 6800.00, NULL, 15, 70, 'Eau de Parfum', 'UNISEX', true, 'Notas altas: Azafrán, Jazmín. Notas medias: Amberwood, Resina de abeto. Notas bajas: Almizcle, Cedro'),
('MFK Aqua Celestia', 'Frescura celestial mimosa', 17, 3, 'MFK-AC-70', 5200.00, 4680.00, 20, 70, 'Eau de Toilette', 'MUJER', false, 'Notas altas: Pimienta rosa, Mimosa. Notas medias: Jazmín, Magnolia. Notas bajas: Almizcle, Madera de cachemira'),

-- BYREDO (Marca 18)
('Byredo Gypsy Water', 'Espíritu bohemio en una botella', 18, 5, 'BYR-GW-100', 4800.00, 4320.00, 25, 100, 'Eau de Parfum', 'UNISEX', true, 'Notas altas: Bergamota, Limón, Pimienta, Enebro. Notas medias: Incienso, Pino, Orris. Notas bajas: Vainilla, Almizcle, Sándalo'),
('Byredo Black Saffron', 'Lujo oriental especiado', 18, 5, 'BYR-BS-100', 4800.00, NULL, 18, 100, 'Eau de Parfum', 'UNISEX', false, 'Notas altas: Azafrán, Bayas de enebro, Cuero. Notas medias: Violeta negra, Terciopelo. Notas bajas: Raspberry, Chalky'),

-- =====================================================
-- PRODUCTOS CLÁSICOS MODERNOS
-- =====================================================

-- HERMÈS (Marca 22)
('Hermès Terre dHermès', 'Conexión entre la tierra y el cielo', 22, 2, 'HER-TH-100', 3400.00, 3060.00, 30, 100, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Naranja, Pomelo. Notas medias: Pimienta, Pelargonio, Sílex. Notas bajas: Vetiver, Cedro, Bencoin'),
('Hermès Twilly dHermès', 'Espíritu joven y audaz', 22, 3, 'HER-TW-85', 3200.00, NULL, 22, 85, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Jengibre, Bergamota, Tuberosa. Notas medias: Tuberosa. Notas bajas: Sándalo'),
('Hermès Un Jardin Sur Le Toit', 'Jardín secreto en las alturas', 22, 5, 'HER-JST-100', 2980.00, 2682.00, 28, 100, 'Eau de Toilette', 'UNISEX', false, 'Notas altas: Hierba, Pera, Rosa. Notas medias: Petitgrain, Rosa, Manzana. Notas bajas: Hierba, Pera'),

-- GIVENCHY (Marca 23)
('Givenchy LInterdit', 'Elegancia francesa prohibida', 23, 3, 'GIV-LI-80', 2850.00, 2565.00, 35, 80, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Pera, Bergamota. Notas medias: Tuberosa, Azahar, Jazmín sambac. Notas bajas: Pachulí, Vetiver, Vainilla, Ambroxan'),
('Givenchy Gentleman Boisée', 'Elegancia masculina con carácter', 23, 2, 'GIV-GB-100', 2750.00, NULL, 28, 100, 'Eau de Parfum', 'HOMBRE', true, 'Notas altas: Pimienta negra, Geranio. Notas medias: Cedro, Sándalo. Notas bajas: Cacao, Almizcle'),
('Givenchy Irresistible', 'Irresistiblemente francesa', 23, 3, 'GIV-IRR-80', 2680.00, 2412.00, 40, 80, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Pera jugosa. Notas medias: Rosa damasco, Amapola. Notas bajas: Iris, Almizcle blanco'),

-- LANCÔME (Marca 24)
('Lancôme La Vie Est Belle', 'La vida es bella', 24, 3, 'LAN-LVEB-100', 2950.00, 2360.00, 45, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Grosella negra, Pera. Notas medias: Iris, Jazmín, Azahar. Notas bajas: Pachulí, Vainilla, Haba tonka, Praliné'),
('Lancôme Idôle', 'Nueva generación de mujeres', 24, 3, 'LAN-ID-75', 2750.00, NULL, 38, 75, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Pera, Bergamota, Pimienta rosa. Notas medias: Rosa damascena, Jazmín sambac. Notas bajas: Almizcle blanco, Vainilla, Cedro'),

-- THIERRY MUGLER (Marca 25)
('Thierry Mugler Angel', 'Revolución olfativa gourmand', 25, 3, 'MUG-ANG-100', 2450.00, 1960.00, 50, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Coco, Algodón de azúcar, Melón, Jazmín, Bergamota, Piña. Notas medias: Miel, Frutos rojos, Albaricoque, Jazmín, Lirio de los valles, Orquídea, Rosa. Notas bajas: Pachulí, Chocolate, Caramelo, Vainilla, Ámbar, Almizcle'),
('Thierry Mugler A*Men', 'Poder masculino gourmand', 25, 2, 'MUG-AMEN-100', 2350.00, NULL, 32, 100, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Café, Lavanda, Bergamota. Notas medias: Miel, Heliotropo, Canela. Notas bajas: Pachulí, Vainilla, Chocolate, Ámbar, Cedro'),

-- ISSEY MIYAKE (Marca 26)
('Issey Miyake LEau dIssey', 'Pureza acuática minimalista', 26, 3, 'ISS-EDI-100', 1980.00, 1782.00, 55, 100, 'Eau de Toilette', 'MUJER', false, 'Notas altas: Loto, Calone, Ciclamen, Melón, Freesia, Agua de rosas, Rosa. Notas medias: Peonia, Lirio de los valles, Jazmín. Notas bajas: Osmanthus, Tuberosa, Ámbar, Almizcle, Madera de cedro'),
('Issey Miyake LEau dIssey Pour Homme', 'Frescura japonesa masculina', 26, 2, 'ISS-EDIPH-125', 1850.00, NULL, 48, 125, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Cilantro, Ciprés, Calone, Mandarina, Bergamota, Limón, Tarragon, Yuzu. Notas medias: Nuez moscada, Lirio de los valles, Mignonette, Azafrán, Geranio, Iris azul. Notas bajas: Vetiver, Almizcle, Ámbar, Tabaco, Sándalo, Cedro'),

-- =====================================================
-- PERFUMES CONTEMPORÁNEOS POPULARES
-- =====================================================

-- KENZO (Marca 27)
('Kenzo Flower By Kenzo', 'Flor de amapola icónica', 27, 3, 'KEN-FBK-100', 2180.00, 1962.00, 42, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Grosella negra, Mandarina. Notas medias: Jazmín búlgaro, Rosa, Opoponax, Amapola. Notas bajas: Vainilla, Almizcle blanco'),
('Kenzo LEau Kenzo Intense', 'Intensidad masculina zen', 27, 2, 'KEN-LEKI-100', 1950.00, NULL, 35, 100, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Bergamota. Notas medias: Té verde, Menta. Notas bajas: Cedro blanco'),

-- MOSCHINO (Marca 28)
('Moschino Toy 2', 'Diversión femenina en frasco de osito', 28, 3, 'MOS-TOY2-100', 1750.00, 1575.00, 60, 100, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Manzana, Mandarina, Magnolia. Notas medias: Jazmín, Peonia, Gengibre. Notas bajas: Madera blanca, Ámbar, Almizcle'),
('Moschino Uomo', 'Elegancia italiana casual', 28, 2, 'MOS-UOMO-125', 1650.00, NULL, 38, 125, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Cilantro, Kumquat. Notas medias: Clavel, Violeta. Notas bajas: Ládano, Madera'),

-- BURBERRY (Marca 29)
('Burberry Her', 'Espíritu londinense moderno', 29, 3, 'BUR-HER-100', 2680.00, 2412.00, 48, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Fresa, Frambuesa, Grosella negra, Mandarina. Notas medias: Violeta, Jazmín. Notas bajas: Almizcle, Ámbar, Madera seca'),
('Burberry Mr. Burberry', 'Caballero británico contemporáneo', 29, 2, 'BUR-MRB-100', 2580.00, NULL, 32, 100, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Menta, Cardamomo, Pomelo, Tarragon. Notas medias: Abedul, Nuez moscada, Lavanda, Cedro. Notas bajas: Vetiver, Guayaco, Sándalo, Ámbar, Benzoín'),

-- MARC JACOBS (Marca 30)
('Marc Jacobs Daisy', 'Juventud y frescura neoyorquina', 30, 3, 'MAR-DAI-100', 2350.00, 2115.00, 65, 100, 'Eau de Toilette', 'MUJER', true, 'Notas altas: Pomelo, Violeta, Fresa salvaje. Notas medias: Gardenia, Violeta, Jazmín. Notas bajas: Almizcle, Vainilla, Madera blanca'),
('Marc Jacobs Perfect', 'Perfección femenina moderna', 30, 3, 'MAR-PER-100', 2480.00, NULL, 40, 100, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Ruibarbo, Narciso. Notas medias: Leche de almendras, Magnolia. Notas bajas: Cedro, Almizcle de cachemira'),

-- =====================================================
-- PERFUMES DE NICHO Y ESPECIALES
-- =====================================================

-- VIKTOR & ROLF (Marca 31)
('Viktor & Rolf Flowerbomb', 'Explosión floral adictiva', 31, 3, 'VR-FB-100', 3150.00, 2835.00, 28, 100, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Té verde, Bergamota, Freesia, Osmanthus. Notas medias: Rosa, Orquídea Cattleya, Jazmín, Iris, Rosa sambac. Notas bajas: Pachulí, Almizcle, Vainilla'),
('Viktor & Rolf Spicebomb', 'Explosión especiada masculina', 31, 2, 'VR-SB-90', 2950.00, NULL, 22, 90, 'Eau de Toilette', 'HOMBRE', true, 'Notas altas: Bergamota, Pomelo, Elemi, Pimienta rosa. Notas medias: Canela, Azafrán, Paprika. Notas bajas: Tabaco, Vetiver, Cuero blanco'),

-- ESCADA (Marca 32)
('Escada Magnetism', 'Magnetismo femenino seductor', 32, 3, 'ESC-MAG-75', 1580.00, 1422.00, 45, 75, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Melón, Lichi, Grosella negra. Notas medias: Magnolia, Jazmín, Lirio de los valles, Rosa, Heliotropo. Notas bajas: Ámbar, Vainilla, Madera blanca'),

-- CACHAREL (Marca 33)
('Cacharel Anaïs Anaïs', 'Romanticismo eterno francés', 33, 3, 'CAC-AA-100', 1350.00, 1215.00, 55, 100, 'Eau de Toilette', 'MUJER', false, 'Notas altas: Limón, Bergamota, Naranja, Grosella negra. Notas medias: Lirio de los valles, Rosa, Jazmín, Ylang-ylang, Iris, Clavel. Notas bajas: Ámbar, Incienso, Sándalo, Cedro, Vetiver'),
('Cacharel Amor Amor', 'Pasión juvenil ardiente', 33, 3, 'CAC-AMOR-100', 1450.00, NULL, 48, 100, 'Eau de Toilette', 'MUJER', false, 'Notas altas: Grosella negra, Mandarina, Cássia, Bergamota. Notas medias: Lirio de los valles, Jazmín, Rosa, Apricot. Notas bajas: Vainilla, Almizcle, Ámbar, Cedro'),

-- =====================================================
-- PERFUMES MASCULINOS ADICIONALES
-- =====================================================

-- NARCISO RODRIGUEZ (Marca 34)
('Narciso Rodriguez For Him', 'Sensualidad masculina refinada', 34, 2, 'NAR-FH-100', 2180.00, 1962.00, 30, 100, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Violeta, Pachulí. Notas medias: Almizcle. Notas bajas: Ámbar, Cedro'),
('Narciso Rodriguez Pure Musc', 'Pureza almizclada femenina', 34, 3, 'NAR-PM-90', 2680.00, NULL, 25, 90, 'Eau de Parfum', 'MUJER', true, 'Notas altas: Flor de naranjo, Jazmín. Notas medias: Almizcle. Notas bajas: Madera de cachemira, Ámbar'),

-- MONTBLANC (Marca 35)
('Montblanc Explorer', 'Aventura masculina elegante', 35, 2, 'MON-EXP-100', 1850.00, 1665.00, 40, 100, 'Eau de Parfum', 'HOMBRE', false, 'Notas altas: Bergamota, Pimienta rosa, Salvia clary. Notas medias: Vetiver, Cuero, Cacao. Notas bajas: Pachouli, Amberwood, Akigalawood'),
('Montblanc Signature', 'Firma de elegancia absoluta', 35, 3, 'MON-SIG-90', 2150.00, NULL, 18, 90, 'Eau de Parfum', 'MUJER', false, 'Notas altas: Clementina, Pimienta rosa. Notas medias: Magnolia, Ylang-ylang, Pachulí dorado. Notas bajas: Vainilla, Benzoin, Almizcle blanco'),

-- DAVIDOFF (Marca 36)
('Davidoff Cool Water', 'Clásico acuático atemporal', 36, 2, 'DAV-CW-125', 1250.00, 1125.00, 70, 125, 'Eau de Toilette', 'HOMBRE', false, 'Notas altas: Menta, Lavanda, Cilantro, Romero. Notas medias: Geranio, Neroli, Jazmín, Sándalo. Notas bajas: Cedro, Almizcle, Ámbar, Tabaco'),
('Davidoff Cool Water Woman', 'Frescura acuática femenina', 36, 3, 'DAV-CWW-100', 1180.00, NULL, 60, 100, 'Eau de Toilette', 'MUJER', false, 'Notas altas: Quillay, Calone, Limón, Piña, Grosella negra. Notas medias: Jazmín, Lirio de los valles, Melón, Rosa, Geranio. Notas bajas: Almizcle, Vainilla, Frambuesa, Melocotón');

-- =====================================================
-- IMÁGENES PARA PRODUCTOS ADICIONALES
-- =====================================================
INSERT INTO imagenes_producto (id_producto, url_imagen, alt_text, es_principal, orden_mostrar) VALUES 
-- Creed
(13, '/images/productos/creed-aventus-1.jpg', 'Creed Aventus', true, 1),
(14, '/images/productos/creed-silver-mountain-1.jpg', 'Creed Silver Mountain Water', true, 1),
(15, '/images/productos/creed-love-white-1.jpg', 'Creed Love in White', true, 1),
-- MFK
(16, '/images/productos/mfk-baccarat-rouge-1.jpg', 'MFK Baccarat Rouge 540', true, 1),
(17, '/images/productos/mfk-aqua-celestia-1.jpg', 'MFK Aqua Celestia', true, 1),
-- Byredo
(18, '/images/productos/byredo-gypsy-water-1.jpg', 'Byredo Gypsy Water', true, 1),
(19, '/images/productos/byredo-black-saffron-1.jpg', 'Byredo Black Saffron', true, 1),
-- Hermès
(20, '/images/productos/hermes-terre-1.jpg', 'Hermès Terre dHermès', true, 1),
(21, '/images/productos/hermes-twilly-1.jpg', 'Hermès Twilly dHermès', true, 1),
(22, '/images/productos/hermes-jardin-toit-1.jpg', 'Hermès Un Jardin Sur Le Toit', true, 1),
-- Givenchy
(23, '/images/productos/givenchy-interdit-1.jpg', 'Givenchy LInterdit', true, 1),
(24, '/images/productos/givenchy-gentleman-1.jpg', 'Givenchy Gentleman Boisée', true, 1),
(25, '/images/productos/givenchy-irresistible-1.jpg', 'Givenchy Irresistible', true, 1),
-- Lancôme
(26, '/images/productos/lancome-vie-belle-1.jpg', 'Lancôme La Vie Est Belle', true, 1),
(27, '/images/productos/lancome-idole-1.jpg', 'Lancôme Idôle', true, 1),
-- Thierry Mugler
(28, '/images/productos/mugler-angel-1.jpg', 'Thierry Mugler Angel', true, 1),
(29, '/images/productos/mugler-amen-1.jpg', 'Thierry Mugler A*Men', true, 1),
-- Issey Miyake
(30, '/images/productos/issey-eau-dissey-f-1.jpg', 'Issey Miyake LEau dIssey', true, 1),
(31, '/images/productos/issey-eau-dissey-m-1.jpg', 'Issey Miyake LEau dIssey Pour Homme', true, 1),
-- Resto de productos (32-50)
(32, '/images/productos/kenzo-flower-1.jpg', 'Kenzo Flower By Kenzo', true, 1),
(33, '/images/productos/kenzo-eau-intense-1.jpg', 'Kenzo LEau Kenzo Intense', true, 1),
(34, '/images/productos/moschino-toy2-1.jpg', 'Moschino Toy 2', true, 1),
(35, '/images/productos/moschino-uomo-1.jpg', 'Moschino Uomo', true, 1),
(36, '/images/productos/burberry-her-1.jpg', 'Burberry Her', true, 1),
(37, '/images/productos/burberry-mr-1.jpg', 'Burberry Mr. Burberry', true, 1),
(38, '/images/productos/marc-jacobs-daisy-1.jpg', 'Marc Jacobs Daisy', true, 1),
(39, '/images/productos/marc-jacobs-perfect-1.jpg', 'Marc Jacobs Perfect', true, 1),
(40, '/images/productos/viktor-rolf-flowerbomb-1.jpg', 'Viktor & Rolf Flowerbomb', true, 1),
(41, '/images/productos/viktor-rolf-spicebomb-1.jpg', 'Viktor & Rolf Spicebomb', true, 1),
(42, '/images/productos/escada-magnetism-1.jpg', 'Escada Magnetism', true, 1),
(43, '/images/productos/cacharel-anais-1.jpg', 'Cacharel Anaïs Anaïs', true, 1),
(44, '/images/productos/cacharel-amor-1.jpg', 'Cacharel Amor Amor', true, 1),
(45, '/images/productos/narciso-for-him-1.jpg', 'Narciso Rodriguez For Him', true, 1),
(46, '/images/productos/narciso-pure-musc-1.jpg', 'Narciso Rodriguez Pure Musc', true, 1),
(47, '/images/productos/montblanc-explorer-1.jpg', 'Montblanc Explorer', true, 1),
(48, '/images/productos/montblanc-signature-1.jpg', 'Montblanc Signature', true, 1),
(49, '/images/productos/davidoff-cool-water-m-1.jpg', 'Davidoff Cool Water', true, 1),
(50, '/images/productos/davidoff-cool-water-f-1.jpg', 'Davidoff Cool Water Woman', true, 1);

-- =====================================================
-- ACTUALIZAR ESTADÍSTICAS DE PRODUCTOS
-- =====================================================
UPDATE productos SET 
    vistas = FLOOR(RANDOM() * 10000 + 500),
    ventas_totales = FLOOR(RANDOM() * 500 + 10),
    calificacion_promedio = ROUND((RANDOM() * 2 + 3)::numeric, 1),
    total_reseñas = FLOOR(RANDOM() * 200 + 5)
WHERE id_producto BETWEEN 13 AND 50;

-- Marcar algunos como nuevos
UPDATE productos SET nuevo = true WHERE id_producto IN (16, 17, 23, 26, 40, 46);

-- Marcar algunos en oferta
UPDATE productos SET en_oferta = true WHERE precio_descuento IS NOT NULL;

COMMIT;

-- =====================================================
-- RESUMEN: +38 PERFUMES DE DISEÑADOR AGREGADOS
-- Total: 50 productos premium en el catálogo
-- =====================================================