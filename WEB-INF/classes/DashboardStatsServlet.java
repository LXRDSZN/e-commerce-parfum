import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/api/dashboard-stats")
public class DashboardStatsServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/perfumeria_db";
    private static final String DB_USER = "postgres";
    private static final String DB_PASSWORD = "12345";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        PrintWriter out = response.getWriter();
        ObjectMapper mapper = new ObjectMapper();

        try {
            Class.forName("org.postgresql.Driver");
            
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                Map<String, Object> stats = new HashMap<>();
                
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

                // 2. Pedidos totales (usando ventas como referencia de pedidos)
                String pedidosSQL = "SELECT COUNT(*) as total_pedidos FROM ventas";
                try (PreparedStatement stmt = conn.prepareStatement(pedidosSQL);
                     ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        stats.put("pedidosTotales", rs.getInt("total_pedidos"));
                    }
                }

                // 3. Total productos (desde perfumes)
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
                String ventasDiasSQL = "SELECT DATE(fecha_venta) as fecha, SUM(total) as total " +
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

                // 7. Ventas por categoría (usando perfumes)
                String ventasCategoriaSQL = "SELECT p.categoria, SUM(v.total) as total " +
                                          "FROM ventas v " +
                                          "JOIN perfumes p ON v.perfume_id = p.id " +
                                          "GROUP BY p.categoria";
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
                String topPerfumesSQL = "SELECT p.nombre, p.marca, SUM(v.cantidad) as total_vendido, SUM(v.total) as ingresos " +
                                      "FROM ventas v " +
                                      "JOIN perfumes p ON v.perfume_id = p.id " +
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
                String ventasMensualesSQL = "SELECT EXTRACT(MONTH FROM fecha_venta) as mes, SUM(total) as total " +
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

                stats.put("success", true);
                stats.put("message", "Datos cargados exitosamente");
                
                out.print(mapper.writeValueAsString(stats));

            }
        } catch (ClassNotFoundException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Driver PostgreSQL no encontrado");
            error.put("error", e.getMessage());
            out.print(mapper.writeValueAsString(error));
        } catch (SQLException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error de conexión a PostgreSQL");
            error.put("error", e.getMessage());
            out.print(mapper.writeValueAsString(error));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error interno del servidor");
            error.put("error", e.getMessage());
            out.print(mapper.writeValueAsString(error));
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}