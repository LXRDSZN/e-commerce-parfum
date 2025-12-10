package com.eliteperfumeria.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;
import java.text.SimpleDateFormat;
import java.math.BigDecimal;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class DashboardServlet extends HttpServlet {
    
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/perfumeria_db";
    private static final String DB_USER = "postgres";
    private static final String DB_PASSWORD = "admin";
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        
        String pathInfo = request.getPathInfo();
        if (pathInfo == null) pathInfo = "";
        
        Gson gson = new Gson();
        
        try {
            Class.forName("org.postgresql.Driver");
            
            switch (pathInfo) {
                case "/stats":
                    response.getWriter().write(gson.toJson(getDashboardStats()));
                    break;
                case "/sales-monthly":
                    response.getWriter().write(gson.toJson(getMonthlySales()));
                    break;
                case "/sales-category":
                    response.getWriter().write(gson.toJson(getCategorySales()));
                    break;
                case "/sales-weekly":
                    response.getWriter().write(gson.toJson(getWeeklySales()));
                    break;
                case "/top-products":
                    response.getWriter().write(gson.toJson(getTopProducts()));
                    break;
                case "/recent-activity":
                    response.getWriter().write(gson.toJson(getRecentActivity()));
                    break;
                default:
                    response.setStatus(404);
                    response.getWriter().write("{\"error\":\"Endpoint not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            JsonObject error = new JsonObject();
            error.addProperty("error", "Database connection failed: " + e.getMessage());
            response.getWriter().write(gson.toJson(error));
        }
    }
    
    private Map<String, Object> getDashboardStats() throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            
            // 1️⃣ Ventas del Mes Actual
            String ventasMesQuery = "SELECT COALESCE(SUM(total), 0) as ventas_mes " +
                "FROM ventas " +
                "WHERE EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                "AND EXTRACT(MONTH FROM fecha_venta) = EXTRACT(MONTH FROM CURRENT_DATE) " +
                "AND estado = 'completada'";
            
            PreparedStatement stmt = conn.prepareStatement(ventasMesQuery);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                stats.put("ventasMes", rs.getBigDecimal("ventas_mes"));
            }
            rs.close();
            stmt.close();
            
            // 2️⃣ Total de Pedidos
            String pedidosQuery = "SELECT COUNT(*) as total_pedidos FROM pedidos";
            stmt = conn.prepareStatement(pedidosQuery);
            rs = stmt.executeQuery();
            if (rs.next()) {
                stats.put("totalPedidos", rs.getInt("total_pedidos"));
            }
            rs.close();
            stmt.close();
            
            // 3️⃣ Total de Productos
            String productosQuery = "SELECT COUNT(*) as total_productos FROM perfumes WHERE activo = true";
            stmt = conn.prepareStatement(productosQuery);
            rs = stmt.executeQuery();
            if (rs.next()) {
                stats.put("totalProductos", rs.getInt("total_productos"));
            }
            rs.close();
            stmt.close();
            
            // 4️⃣ Total de Usuarios
            String usuariosQuery = "SELECT COUNT(*) as total_usuarios FROM usuarios WHERE activo = true";
            stmt = conn.prepareStatement(usuariosQuery);
            rs = stmt.executeQuery();
            if (rs.next()) {
                stats.put("totalUsuarios", rs.getInt("total_usuarios"));
            }
            rs.close();
            stmt.close();
            
            // Stock Bajo (menos de 10 unidades)
            String stockBajoQuery = "SELECT COUNT(*) as stock_bajo FROM perfumes WHERE stock < 10 AND activo = true";
            stmt = conn.prepareStatement(stockBajoQuery);
            rs = stmt.executeQuery();
            if (rs.next()) {
                stats.put("stockBajo", rs.getInt("stock_bajo"));
            }
            rs.close();
            stmt.close();
        }
        
        return stats;
    }
    
    private Map<String, Object> getMonthlySales() throws SQLException {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                                           "Jul", "Ago", "Sep", "Oct", "Nov", "Dic");
        List<BigDecimal> data = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT " +
                "EXTRACT(MONTH FROM fecha_venta) as mes, " +
                "COALESCE(SUM(total), 0) as total_ventas " +
                "FROM ventas " +
                "WHERE EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                "AND estado = 'completada' " +
                "GROUP BY EXTRACT(MONTH FROM fecha_venta) " +
                "ORDER BY mes";
            
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            
            // Inicializar array con ceros
            for (int i = 0; i < 12; i++) {
                data.add(BigDecimal.ZERO);
            }
            
            // Llenar con datos reales
            while (rs.next()) {
                int mes = rs.getInt("mes");
                BigDecimal ventas = rs.getBigDecimal("total_ventas");
                data.set(mes - 1, ventas);
            }
            
            rs.close();
            stmt.close();
        }
        
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }
    
    private Map<String, Object> getCategorySales() throws SQLException {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> data = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT " +
                "p.genero, " +
                "COALESCE(SUM(v.total), 0) as total_ventas " +
                "FROM ventas v " +
                "JOIN perfumes p ON v.perfume_id = p.id " +
                "WHERE v.estado = 'completada' " +
                "AND EXTRACT(YEAR FROM v.fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                "GROUP BY p.genero " +
                "ORDER BY total_ventas DESC";
            
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                String genero = rs.getString("genero");
                BigDecimal ventas = rs.getBigDecimal("total_ventas");
                
                // Mapear géneros a nombres más amigables
                String label;
                if (genero != null) {
                    switch (genero.toLowerCase()) {
                        case "mujer":
                        case "femenino":
                        case "women":
                            label = "Perfumes Mujer";
                            break;
                        case "hombre":
                        case "masculino":
                        case "men":
                            label = "Perfumes Hombre";
                            break;
                        case "unisex":
                        case "mixto":
                            label = "Fragancias Unisex";
                            break;
                        default:
                            label = "Otras Fragancias";
                    }
                } else {
                    label = "Sin Categoría";
                }
                
                labels.add(label);
                data.add(ventas);
            }
            
            rs.close();
            stmt.close();
        }
        
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }
    
    private Map<String, Object> getWeeklySales() throws SQLException {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> data = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT " +
                "DATE(fecha_venta) as fecha, " +
                "COALESCE(SUM(total), 0) as total_ventas " +
                "FROM ventas " +
                "WHERE fecha_venta >= CURRENT_DATE - INTERVAL '7 days' " +
                "AND estado = 'completada' " +
                "GROUP BY DATE(fecha_venta) " +
                "ORDER BY fecha";
            
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM");
            
            while (rs.next()) {
                java.sql.Date fecha = rs.getDate("fecha");
                BigDecimal ventas = rs.getBigDecimal("total_ventas");
                
                labels.add(sdf.format(fecha));
                data.add(ventas);
            }
            
            rs.close();
            stmt.close();
        }
        
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }
    
    private List<Map<String, Object>> getTopProducts() throws SQLException {
        List<Map<String, Object>> products = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT " +
                "p.nombre, " +
                "p.marca, " +
                "p.precio, " +
                "p.imagen_url, " +
                "SUM(v.cantidad) as total_vendido, " +
                "SUM(v.total) as ingresos_totales " +
                "FROM ventas v " +
                "JOIN perfumes p ON v.perfume_id = p.id " +
                "WHERE v.estado = 'completada' " +
                "AND v.fecha_venta >= CURRENT_DATE - INTERVAL '30 days' " +
                "GROUP BY p.id, p.nombre, p.marca, p.precio, p.imagen_url " +
                "ORDER BY total_vendido DESC " +
                "LIMIT 5";
            
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> product = new HashMap<>();
                product.put("nombre", rs.getString("nombre"));
                product.put("marca", rs.getString("marca"));
                product.put("precio", rs.getBigDecimal("precio"));
                product.put("imagenUrl", rs.getString("imagen_url"));
                product.put("totalVendido", rs.getInt("total_vendido"));
                product.put("ingresosTotales", rs.getBigDecimal("ingresos_totales"));
                products.add(product);
            }
            
            rs.close();
            stmt.close();
        }
        
        return products;
    }
    
    private List<Map<String, Object>> getRecentActivity() throws SQLException {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT " +
                "'venta' as tipo, " +
                "v.cliente_nombre, " +
                "p.nombre as producto_nombre, " +
                "v.total, " +
                "v.fecha_venta, " +
                "v.metodo_pago " +
                "FROM ventas v " +
                "JOIN perfumes p ON v.perfume_id = p.id " +
                "WHERE v.fecha_venta >= CURRENT_DATE - INTERVAL '24 hours' " +
                "AND v.estado = 'completada' " +
                "ORDER BY v.fecha_venta DESC " +
                "LIMIT 10";
            
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("tipo", "venta");
                activity.put("icon", "fas fa-shopping-cart text-success");
                
                String productoNombre = rs.getString("producto_nombre");
                BigDecimal total = rs.getBigDecimal("total");
                String texto = String.format("Nueva venta: %s - $%.2f", productoNombre, total);
                
                activity.put("texto", texto);
                activity.put("cliente", rs.getString("cliente_nombre"));
                activity.put("metodoPago", rs.getString("metodo_pago"));
                
                Timestamp fechaVenta = rs.getTimestamp("fecha_venta");
                long minutosTranscurridos = (System.currentTimeMillis() - fechaVenta.getTime()) / (1000 * 60);
                
                String tiempoTexto;
                if (minutosTranscurridos < 60) {
                    tiempoTexto = "Hace " + minutosTranscurridos + " min";
                } else {
                    long horasTranscurridas = minutosTranscurridos / 60;
                    tiempoTexto = "Hace " + horasTranscurridas + " hora" + (horasTranscurridas > 1 ? "s" : "");
                }
                
                activity.put("tiempo", tiempoTexto);
                activities.add(activity);
            }
            
            rs.close();
            stmt.close();
        }
        
        return activities;
    }
}