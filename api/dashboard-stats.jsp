<%@ page contentType="application/json; charset=UTF-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>

<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

String DB_URL = "jdbc:postgresql://localhost:5432/perfumeria_db";
String DB_USER = "postgres";
String DB_PASSWORD = "admin";

Map<String, Object> stats = new HashMap<>();
boolean success = false;
String message = "";

try {
    Class.forName("org.postgresql.Driver");
    
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        
        // 1. Ventas del mes actual
        String ventasMesSQL = "SELECT COALESCE(SUM(total), 0) as ventas_mes FROM ventas " +
                            "WHERE EXTRACT(MONTH FROM fecha_venta) = EXTRACT(MONTH FROM CURRENT_DATE) " +
                            "AND EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE)";
        try (PreparedStatement stmt = conn.prepareStatement(ventasMesSQL);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                stats.put("ventasMes", rs.getDouble("ventas_mes"));
            }
        }

        // 2. Pedidos totales
        String pedidosSQL = "SELECT COUNT(*) as total_pedidos FROM ventas";
        try (PreparedStatement stmt = conn.prepareStatement(pedidosSQL);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                stats.put("pedidosTotales", rs.getInt("total_pedidos"));
            }
        }

        // 3. Total productos 
        String productosSQL = "SELECT COUNT(*) as total_productos FROM perfumes";
        try (PreparedStatement stmt = conn.prepareStatement(productosSQL);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                stats.put("totalProductos", rs.getInt("total_productos"));
            }
        }

        // 4. Productos con stock bajo
        String stockBajoSQL = "SELECT COUNT(*) as stock_bajo FROM perfumes WHERE stock < 10";
        try (PreparedStatement stmt = conn.prepareStatement(stockBajoSQL);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                stats.put("stockBajo", rs.getInt("stock_bajo"));
            }
        }

        // 5. Total usuarios
        String usuariosSQL = "SELECT COUNT(*) as total_usuarios FROM usuarios";
        try (PreparedStatement stmt = conn.prepareStatement(usuariosSQL);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                stats.put("totalUsuarios", rs.getInt("total_usuarios"));
            }
        }

        // 6. Ventas por día (últimos 7 días)
        String ventasDiasSQL = "SELECT DATE(fecha_venta) as fecha, COALESCE(SUM(total), 0) as total " +
                             "FROM ventas " +
                             "WHERE fecha_venta >= CURRENT_DATE - INTERVAL '6 days' " +
                             "GROUP BY DATE(fecha_venta) " +
                             "ORDER BY fecha";
        List<Map<String, Object>> ventasDias = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(ventasDiasSQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> dia = new HashMap<>();
                dia.put("fecha", rs.getString("fecha"));
                dia.put("total", rs.getDouble("total"));
                ventasDias.add(dia);
            }
        }
        stats.put("ventasDias", ventasDias);

        // 7. Ventas por categoría
        String ventasCategoriaSQL = "SELECT p.categoria, COALESCE(SUM(v.total), 0) as total " +
                                  "FROM perfumes p " +
                                  "LEFT JOIN ventas v ON v.perfume_id = p.id " +
                                  "GROUP BY p.categoria " +
                                  "HAVING COALESCE(SUM(v.total), 0) > 0";
        List<Map<String, Object>> ventasCategoria = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(ventasCategoriaSQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> categoria = new HashMap<>();
                categoria.put("categoria", rs.getString("categoria"));
                categoria.put("total", rs.getDouble("total"));
                ventasCategoria.add(categoria);
            }
        }
        stats.put("ventasCategoria", ventasCategoria);

        // 8. Top 5 perfumes más vendidos
        String topPerfumesSQL = "SELECT p.nombre, p.marca, COALESCE(SUM(v.cantidad), 0) as total_vendido, COALESCE(SUM(v.total), 0) as ingresos " +
                              "FROM perfumes p " +
                              "LEFT JOIN ventas v ON v.perfume_id = p.id " +
                              "GROUP BY p.id, p.nombre, p.marca " +
                              "ORDER BY total_vendido DESC " +
                              "LIMIT 5";
        List<Map<String, Object>> topPerfumes = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(topPerfumesSQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> perfume = new HashMap<>();
                perfume.put("nombre", rs.getString("nombre"));
                perfume.put("marca", rs.getString("marca"));
                perfume.put("totalVendido", rs.getInt("total_vendido"));
                perfume.put("ingresos", rs.getDouble("ingresos"));
                topPerfumes.add(perfume);
            }
        }
        stats.put("topPerfumes", topPerfumes);

        // 9. Ventas mensuales del año actual
        String ventasMensualesSQL = "SELECT EXTRACT(MONTH FROM fecha_venta) as mes, COALESCE(SUM(total), 0) as total " +
                                  "FROM ventas " +
                                  "WHERE EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                                  "GROUP BY EXTRACT(MONTH FROM fecha_venta) " +
                                  "ORDER BY mes";
        List<Map<String, Object>> ventasMensuales = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(ventasMensualesSQL);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> mes = new HashMap<>();
                mes.put("mes", rs.getInt("mes"));
                mes.put("total", rs.getDouble("total"));
                ventasMensuales.add(mes);
            }
        }
        stats.put("ventasMensuales", ventasMensuales);

        success = true;
        message = "✅ Conectado a PostgreSQL - Datos actualizados";
        
    }
} catch (ClassNotFoundException e) {
    success = false;
    message = "⚠️ Usando datos de respaldo. Driver PostgreSQL no encontrado";
    // Datos de respaldo basados en ventas reales
    stats.put("ventasMes", 58300.0); // Total de diciembre 2024
    stats.put("pedidosTotales", 38);
    stats.put("totalProductos", 45);
    stats.put("stockBajo", 20);
    stats.put("totalUsuarios", 89);
    
    // Ventas últimos 7 días (datos simulados)
    List<Map<String, Object>> ventasDias = new ArrayList<>();
    String[] fechas = {"2024-12-02", "2024-12-03", "2024-12-04", "2024-12-05", "2024-12-06", "2024-12-07", "2024-12-08"};
    double[] totales = {12050.0, 8700.0, 13600.0, 7300.0, 11800.0, 10400.0, 20300.0};
    for (int i = 0; i < fechas.length; i++) {
        Map<String, Object> dia = new HashMap<>();
        dia.put("fecha", fechas[i]);
        dia.put("total", totales[i]);
        ventasDias.add(dia);
    }
    stats.put("ventasDias", ventasDias);
    
    // Ventas por categoría (datos simulados)
    List<Map<String, Object>> ventasCategoria = new ArrayList<>();
    String[] categorias = {"Hombre", "Mujer", "Unisex"};
    double[] totalesCategoria = {45200.0, 67800.0, 32400.0};
    for (int i = 0; i < categorias.length; i++) {
        Map<String, Object> cat = new HashMap<>();
        cat.put("categoria", categorias[i]);
        cat.put("total", totalesCategoria[i]);
        ventasCategoria.add(cat);
    }
    stats.put("ventasCategoria", ventasCategoria);
    
    // Top perfumes (datos simulados)
    List<Map<String, Object>> topPerfumes = new ArrayList<>();
    String[] nombres = {"Sauvage", "Black Opium", "La Vie Est Belle", "Bleu de Chanel", "Good Girl"};
    String[] marcas = {"Dior", "YSL", "Lancôme", "Chanel", "Carolina Herrera"};
    int[] vendidos = {12, 8, 7, 6, 5};
    double[] ingresos = {50400.0, 29200.0, 25550.0, 25200.0, 17500.0};
    for (int i = 0; i < nombres.length; i++) {
        Map<String, Object> perfume = new HashMap<>();
        perfume.put("nombre", nombres[i]);
        perfume.put("marca", marcas[i]);
        perfume.put("totalVendido", vendidos[i]);
        perfume.put("ingresos", ingresos[i]);
        topPerfumes.add(perfume);
    }
    stats.put("topPerfumes", topPerfumes);
    
    // Ventas mensuales 2024 (datos simulados)
    List<Map<String, Object>> ventasMensuales = new ArrayList<>();
    int[] mesesData = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    double[] ventasMes = {25000.0, 28000.0, 32000.0, 29000.0, 35000.0, 42000.0, 38000.0, 41000.0, 36000.0, 18300.0, 38900.0, 58300.0};
    for (int i = 0; i < mesesData.length; i++) {
        Map<String, Object> mes = new HashMap<>();
        mes.put("mes", mesesData[i]);
        mes.put("total", ventasMes[i]);
        ventasMensuales.add(mes);
    }
    stats.put("ventasMensuales", ventasMensuales);
    
} catch (SQLException e) {
    success = false;
    message = "⚠️ Usando datos de respaldo. Error de conexión: " + e.getMessage();
    // Usar los mismos datos de respaldo
    stats.put("ventasMes", 58300.0);
    stats.put("pedidosTotales", 38);
    stats.put("totalProductos", 45);
    stats.put("stockBajo", 20);
    stats.put("totalUsuarios", 89);
    
    List<Map<String, Object>> ventasDias = new ArrayList<>();
    String[] fechas = {"2024-12-02", "2024-12-03", "2024-12-04", "2024-12-05", "2024-12-06", "2024-12-07", "2024-12-08"};
    double[] totales = {12050.0, 8700.0, 13600.0, 7300.0, 11800.0, 10400.0, 20300.0};
    for (int i = 0; i < fechas.length; i++) {
        Map<String, Object> dia = new HashMap<>();
        dia.put("fecha", fechas[i]);
        dia.put("total", totales[i]);
        ventasDias.add(dia);
    }
    stats.put("ventasDias", ventasDias);
    
    List<Map<String, Object>> ventasCategoria = new ArrayList<>();
    String[] categorias = {"Hombre", "Mujer", "Unisex"};
    double[] totalesCategoria = {45200.0, 67800.0, 32400.0};
    for (int i = 0; i < categorias.length; i++) {
        Map<String, Object> cat = new HashMap<>();
        cat.put("categoria", categorias[i]);
        cat.put("total", totalesCategoria[i]);
        ventasCategoria.add(cat);
    }
    stats.put("ventasCategoria", ventasCategoria);
    
    List<Map<String, Object>> topPerfumes = new ArrayList<>();
    String[] nombres = {"Sauvage", "Black Opium", "La Vie Est Belle", "Bleu de Chanel", "Good Girl"};
    String[] marcas = {"Dior", "YSL", "Lancôme", "Chanel", "Carolina Herrera"};
    int[] vendidos = {12, 8, 7, 6, 5};
    double[] ingresos = {50400.0, 29200.0, 25550.0, 25200.0, 17500.0};
    for (int i = 0; i < nombres.length; i++) {
        Map<String, Object> perfume = new HashMap<>();
        perfume.put("nombre", nombres[i]);
        perfume.put("marca", marcas[i]);
        perfume.put("totalVendido", vendidos[i]);
        perfume.put("ingresos", ingresos[i]);
        topPerfumes.add(perfume);
    }
    stats.put("topPerfumes", topPerfumes);
    
    List<Map<String, Object>> ventasMensuales = new ArrayList<>();
    int[] mesesData = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    double[] ventasMes = {25000.0, 28000.0, 32000.0, 29000.0, 35000.0, 42000.0, 38000.0, 41000.0, 36000.0, 18300.0, 38900.0, 58300.0};
    for (int i = 0; i < mesesData.length; i++) {
        Map<String, Object> mes = new HashMap<>();
        mes.put("mes", mesesData[i]);
        mes.put("total", ventasMes[i]);
        ventasMensuales.add(mes);
    }
    stats.put("ventasMensuales", ventasMensuales);
    
} catch (Exception e) {
    success = false;
    message = "⚠️ Usando datos de respaldo. Error interno del servidor";
    // Usar los mismos datos de respaldo
    stats.put("ventasMes", 58300.0);
    stats.put("pedidosTotales", 38);
    stats.put("totalProductos", 45);
    stats.put("stockBajo", 20);
    stats.put("totalUsuarios", 89);
    stats.put("ventasDias", new ArrayList<>());
    stats.put("ventasCategoria", new ArrayList<>());
    stats.put("topPerfumes", new ArrayList<>());
    stats.put("ventasMensuales", new ArrayList<>());
}

stats.put("success", success);
stats.put("message", message);

// Convertir a JSON manualmente
StringBuilder json = new StringBuilder();
json.append("{");

// Agregar propiedades simples
json.append("\"ventasMes\":").append(stats.get("ventasMes")).append(",");
json.append("\"pedidosTotales\":").append(stats.get("pedidosTotales")).append(",");
json.append("\"totalProductos\":").append(stats.get("totalProductos")).append(",");
json.append("\"stockBajo\":").append(stats.get("stockBajo")).append(",");
json.append("\"totalUsuarios\":").append(stats.get("totalUsuarios")).append(",");

// Ventas por días
json.append("\"ventasDias\":[");
List<Map<String, Object>> dias = (List<Map<String, Object>>) stats.get("ventasDias");
if (dias != null) {
    for (int i = 0; i < dias.size(); i++) {
        Map<String, Object> dia = dias.get(i);
        json.append("{\"fecha\":\"").append(dia.get("fecha")).append("\",\"total\":").append(dia.get("total")).append("}");
        if (i < dias.size() - 1) json.append(",");
    }
}
json.append("],");

// Ventas por categoría
json.append("\"ventasCategoria\":[");
List<Map<String, Object>> categorias = (List<Map<String, Object>>) stats.get("ventasCategoria");
if (categorias != null) {
    for (int i = 0; i < categorias.size(); i++) {
        Map<String, Object> cat = categorias.get(i);
        json.append("{\"categoria\":\"").append(cat.get("categoria")).append("\",\"total\":").append(cat.get("total")).append("}");
        if (i < categorias.size() - 1) json.append(",");
    }
}
json.append("],");

// Top perfumes
json.append("\"topPerfumes\":[");
List<Map<String, Object>> perfumes = (List<Map<String, Object>>) stats.get("topPerfumes");
if (perfumes != null) {
    for (int i = 0; i < perfumes.size(); i++) {
        Map<String, Object> perfume = perfumes.get(i);
        json.append("{\"nombre\":\"").append(perfume.get("nombre")).append("\",");
        json.append("\"marca\":\"").append(perfume.get("marca")).append("\",");
        json.append("\"totalVendido\":").append(perfume.get("totalVendido")).append(",");
        json.append("\"ingresos\":").append(perfume.get("ingresos")).append("}");
        if (i < perfumes.size() - 1) json.append(",");
    }
}
json.append("],");

// Ventas mensuales
json.append("\"ventasMensuales\":[");
List<Map<String, Object>> meses = (List<Map<String, Object>>) stats.get("ventasMensuales");
if (meses != null) {
    for (int i = 0; i < meses.size(); i++) {
        Map<String, Object> mes = meses.get(i);
        json.append("{\"mes\":").append(mes.get("mes")).append(",\"total\":").append(mes.get("total")).append("}");
        if (i < meses.size() - 1) json.append(",");
    }
}
json.append("],");

json.append("\"success\":").append(success).append(",");
json.append("\"message\":\"").append(message).append("\"");
json.append("}");

out.print(json.toString());
%>