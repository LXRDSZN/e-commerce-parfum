# 🗄️ Base de Datos - Perfumería E-Commerce

## 📋 Descripción
Base de datos PostgreSQL completa para un e-commerce de perfumería tipo MercadoLibre con todas las funcionalidades modernas.

## 🏗️ Estructura de Tablas

### 👥 **Gestión de Usuarios**
- `roles` - Roles del sistema (Admin, Vendedor, Cliente, Premium)
- `usuarios` - Información completa de usuarios con puntos de fidelidad
- `direcciones` - Direcciones de envío y facturación

### 🛍️ **Catálogo de Productos**
- `marcas` - Marcas de perfumes (Chanel, Dior, Versace, etc.)
- `categorias` - Categorías jerárquicas (Hombre, Mujer, Niños, Unisex)
- `productos` - Productos con precios, stock, notas olfativas
- `imagenes_producto` - Múltiples imágenes por producto

### 🛒 **E-Commerce**
- `carrito` - Carrito de compras temporal
- `pedidos` - Órdenes con estados y tracking
- `detalles_pedido` - Items específicos de cada pedido
- `cupones` - Sistema de descuentos y promociones

### 💳 **Pagos**
- `metodos_pago` - Tarjetas y métodos de pago encriptados
- `transacciones` - Historial de transacciones

### ⭐ **Interacción**
- `reseñas` - Calificaciones y comentarios de productos
- `wishlist` - Lista de deseos por usuario
- `notificaciones` - Sistema de notificaciones

## 📊 **Marcas Incluidas**
- **Valentino** (Italia)
- **Jean Paul Gaultier** (Francia) 
- **Azzaro** (Francia)
- **Carolina Herrera** (Venezuela)
- **Versace** (Italia)
- **Chanel** (Francia)
- **Dior** (Francia)
- **Tom Ford** (Estados Unidos)
- **Paco Rabanne** (España)
- **Dolce & Gabbana** (Italia)
- **Hugo Boss** (Alemania)
- **Calvin Klein** (Estados Unidos)
- **Armani** (Italia)
- **Yves Saint Laurent** (Francia)
- **Bulgari** (Italia)

## 🎯 **Productos de Ejemplo**
- **12 perfumes premium** con datos reales
- **Categorizado por género:** Hombre, Mujer, Niños, Unisex
- **Información detallada:** Notas olfativas, concentración, contenido
- **Precios realistas** en pesos mexicanos
- **Sistema de descuentos** implementado

## 🔧 **Funcionalidades Técnicas**

### **Índices Optimizados**
- Búsqueda rápida por marca, categoría, género
- Filtros por precio, popularidad, fecha
- Optimización para consultas de carrito y pedidos

### **Triggers Automatizados**
- Actualización automática de fechas de modificación
- Generación automática de números de pedido
- Validaciones de integridad de datos

### **Vistas Preparadas**
- `v_productos_completo` - Productos con información de marca y categoría
- `v_pedidos_detalle` - Pedidos con información del cliente

## 🚀 **Instalación**

```bash
# 1. Conectar a PostgreSQL
psql -U postgres

# 2. Ejecutar el script
\i perfumeria_ecommerce.sql

# 3. Verificar instalación
\c perfumeria_ecommerce
\dt
```

## 📈 **Configuraciones del Sistema**
- Envío gratis desde $500 MXN
- IVA 16%
- 12 productos por página
- Soporte técnico incluido

## 🔐 **Usuarios de Prueba**
- **Admin:** admin@perfumeria.com
- **Cliente:** maria@ejemplo.com  
- **Cliente:** carlos@ejemplo.com

## 🎟️ **Cupones Activos**
- **BIENVENIDO20** - 20% descuento primera compra
- **ENVIOGRATIS** - Envío gratis +$800
- **NAVIDAD2024** - 25% descuento especial

---
*Base de datos lista para producción con datos realistas y estructura escalable*