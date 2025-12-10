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
List<String> labels = Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                                   "Jul", "Ago", "Sep", "Oct", "Nov", "Dic");
List<BigDecimal> data = new ArrayList<>();
Gson gson = new Gson();

try {
    Class.forName("org.postgresql.Driver");
    Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    
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