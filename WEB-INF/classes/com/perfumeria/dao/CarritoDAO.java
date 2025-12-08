package com.perfumeria.dao;

import com.perfumeria.config.DatabaseConnection;
import com.perfumeria.model.Carrito;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CarritoDAO {
    
    public boolean agregarAlCarrito(int usuarioId, int perfumeId, int cantidad) {
        // Primero verificar si el producto ya existe en el carrito
        String checkSql = "SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND perfume_id = ?";
        String insertSql = "INSERT INTO carrito (usuario_id, perfume_id, cantidad) VALUES (?, ?, ?)";
        String updateSql = "UPDATE carrito SET cantidad = cantidad + ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, usuarioId);
            checkStmt.setInt(2, perfumeId);
            
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                // El producto ya existe, actualizar cantidad
                int carritoId = rs.getInt("id");
                PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                updateStmt.setInt(1, cantidad);
                updateStmt.setInt(2, carritoId);
                return updateStmt.executeUpdate() > 0;
            } else {
                // El producto no existe, insertar nuevo
                PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                insertStmt.setInt(1, usuarioId);
                insertStmt.setInt(2, perfumeId);
                insertStmt.setInt(3, cantidad);
                return insertStmt.executeUpdate() > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public List<Carrito> obtenerCarritoUsuario(int usuarioId) {
        List<Carrito> items = new ArrayList<>();
        String sql = "SELECT c.*, p.nombre, p.marca, p.precio, p.imagen_url " +
                    "FROM carrito c " +
                    "JOIN perfumes p ON c.perfume_id = p.id " +
                    "WHERE c.usuario_id = ? " +
                    "ORDER BY c.fecha_agregado DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Carrito item = new Carrito();
                item.setId(rs.getInt("id"));
                item.setUsuarioId(rs.getInt("usuario_id"));
                item.setPerfumeId(rs.getInt("perfume_id"));
                item.setCantidad(rs.getInt("cantidad"));
                item.setFechaAgregado(rs.getTimestamp("fecha_agregado").toLocalDateTime());
                item.setNombrePerfume(rs.getString("nombre"));
                item.setMarcaPerfume(rs.getString("marca"));
                item.setPrecioPerfume(rs.getDouble("precio"));
                item.setImagenPerfume(rs.getString("imagen_url"));
                items.add(item);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }
    
    public boolean actualizarCantidad(int carritoId, int cantidad) {
        String sql = "UPDATE carrito SET cantidad = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, cantidad);
            stmt.setInt(2, carritoId);
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean eliminarDelCarrito(int carritoId) {
        String sql = "DELETE FROM carrito WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, carritoId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean limpiarCarrito(int usuarioId) {
        String sql = "DELETE FROM carrito WHERE usuario_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public int contarItemsCarrito(int usuarioId) {
        String sql = "SELECT COUNT(*) FROM carrito WHERE usuario_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}