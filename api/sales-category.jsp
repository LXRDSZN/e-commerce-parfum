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

Map<String, Object> result = new HashMap<>();
List<String> labels = new ArrayList<>();
List<BigDecimal> data = new ArrayList<>();
Gson gson = new Gson();

try {
    Class.forName("org.postgresql.Driver");
    Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    
    String query = "SELECT " +
        "p.categoria, " +
        "COALESCE(SUM(v.total), 0) as total_ventas " +
        "FROM ventas v " +
        "JOIN perfumes p ON v.perfume_id = p.id " +
        "WHERE v.estado = 'completada' " +
        "AND EXTRACT(YEAR FROM v.fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE) " +
        "GROUP BY p.categoria " +
        "ORDER BY total_ventas DESC";
    
    PreparedStatement stmt = conn.prepareStatement(query);
    ResultSet rs = stmt.executeQuery();
    
    while (rs.next()) {
        String categoria = rs.getString("categoria");
        BigDecimal ventas = rs.getBigDecimal("total_ventas");
        
        // Mapear categorías a nombres más amigables
        String label = "Otras Fragancias";
        if (categoria != null) {
            switch (categoria.toUpperCase()) {
                case "MUJER":
                    label = "Perfumes Mujer";
                    break;
                case "HOMBRE":
                case "masculino":
                    label = "Perfumes Hombre";
                    break;
                case "NIÑO":
                case "UNISEX":
                    label = "Fragancias Unisex";
                    break;
            }
        }
        
        labels.add(label);
        data.add(ventas);
    }
    
    rs.close();
    stmt.close();
    conn.close();
    
    result.put("labels", labels);
    result.put("data", data);
    
    out.print(gson.toJson(result));
    
} catch (Exception e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "Database error: " + e.getMessage());
    out.print(gson.toJson(error));
    e.printStackTrace();
}
%>