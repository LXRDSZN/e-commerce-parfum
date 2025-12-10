<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.math.BigDecimal" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="java.util.*" %>

<%
response.setHeader("Access-Control-Allow-Origin", "*");
response.setContentType("application/json");

String DB_URL = "jdbc:postgresql://localhost:5432/perfumeria_db";
String DB_USER = "postgres";
String DB_PASSWORD = "admin";

List<Map<String, Object>> activities = new ArrayList<>();
Gson gson = new Gson();

try {
    Class.forName("org.postgresql.Driver");
    Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    
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
    conn.close();
    
    out.print(gson.toJson(activities));
    
} catch (Exception e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "Database error: " + e.getMessage());
    out.print(gson.toJson(error));
    e.printStackTrace();
}
%>