package com.perfumeria.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Perfume {
    private int id;
    private String nombre;
    private String marca;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private String categoria; // HOMBRE, MUJER, NIÑO
    private String tamaño; // 30ml, 50ml, 100ml, etc.
    private String imagenUrl;
    private String tipo; // EDT, EDP, Parfum
    private String notas; // Notas olfativas
    private LocalDateTime fechaCreacion;
    private boolean activo;
    private int vendidos;
    
    public Perfume() {
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
        this.vendidos = 0;
    }
    
    public Perfume(String nombre, String marca, String descripcion, BigDecimal precio, int stock, String categoria) {
        this();
        this.nombre = nombre;
        this.marca = marca;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }
    
    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public String getTamaño() { return tamaño; }
    public void setTamaño(String tamaño) { this.tamaño = tamaño; }
    
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    
    public int getVendidos() { return vendidos; }
    public void setVendidos(int vendidos) { this.vendidos = vendidos; }
}