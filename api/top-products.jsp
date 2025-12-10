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

List<Map<String, Object>> products = new ArrayList<>();
Gson gson = new Gson();

try {
    Class.forName("org.postgresql.Driver");
    Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    
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
    conn.close();
    
    out.print(gson.toJson(products));
    
} catch (Exception e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "Database error: " + e.getMessage());
    out.print(gson.toJson(error));
    e.printStackTrace();
}
%>