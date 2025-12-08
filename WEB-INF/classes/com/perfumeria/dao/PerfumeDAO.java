package com.perfumeria.dao;

import com.perfumeria.config.DatabaseConnection;
import com.perfumeria.model.Perfume;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PerfumeDAO {
    
    public List<Perfume> obtenerTodosPerfumes() {
        List<Perfume> perfumes = new ArrayList<>();
        String sql = "SELECT * FROM perfumes WHERE activo = true ORDER BY nombre";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                perfumes.add(mapearPerfume(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return perfumes;
    }
    
    public List<Perfume> obtenerPerfumesPorCategoria(String categoria) {
        List<Perfume> perfumes = new ArrayList<>();
        String sql = "SELECT * FROM perfumes WHERE categoria = ? AND activo = true ORDER BY nombre";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, categoria);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                perfumes.add(mapearPerfume(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return perfumes;
    }
    
    public List<Perfume> buscarPerfumes(String busqueda) {
        List<Perfume> perfumes = new ArrayList<>();
        String sql = "SELECT * FROM perfumes WHERE (LOWER(nombre) LIKE LOWER(?) OR LOWER(marca) LIKE LOWER(?)) AND activo = true ORDER BY nombre";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            String searchTerm = "%" + busqueda + "%";
            stmt.setString(1, searchTerm);
            stmt.setString(2, searchTerm);
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                perfumes.add(mapearPerfume(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return perfumes;
    }
    
    public Perfume obtenerPerfumePorId(int id) {
        String sql = "SELECT * FROM perfumes WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapearPerfume(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public List<Perfume> obtenerPerfumesDestacados(int limit) {
        List<Perfume> perfumes = new ArrayList<>();
        String sql = "SELECT * FROM perfumes WHERE activo = true ORDER BY vendidos DESC LIMIT ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, limit);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                perfumes.add(mapearPerfume(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return perfumes;
    }
    
    public boolean actualizarStock(int perfumeId, int cantidad) {
        String sql = "UPDATE perfumes SET stock = stock - ?, vendidos = vendidos + ? WHERE id = ? AND stock >= ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, cantidad);
            stmt.setInt(2, cantidad);
            stmt.setInt(3, perfumeId);
            stmt.setInt(4, cantidad);
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private Perfume mapearPerfume(ResultSet rs) throws SQLException {
        Perfume perfume = new Perfume();
        perfume.setId(rs.getInt("id"));
        perfume.setNombre(rs.getString("nombre"));
        perfume.setMarca(rs.getString("marca"));
        perfume.setDescripcion(rs.getString("descripcion"));
        perfume.setPrecio(rs.getBigDecimal("precio"));
        perfume.setStock(rs.getInt("stock"));
        perfume.setCategoria(rs.getString("categoria"));
        perfume.setTamaño(rs.getString("tamaño"));
        perfume.setImagenUrl(rs.getString("imagen_url"));
        perfume.setTipo(rs.getString("tipo"));
        perfume.setNotas(rs.getString("notas"));
        perfume.setFechaCreacion(rs.getTimestamp("fecha_creacion").toLocalDateTime());
        perfume.setActivo(rs.getBoolean("activo"));
        perfume.setVendidos(rs.getInt("vendidos"));
        return perfume;
    }
}