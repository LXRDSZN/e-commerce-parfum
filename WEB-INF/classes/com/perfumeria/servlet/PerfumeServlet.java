package com.perfumeria.servlet;

import com.perfumeria.dao.PerfumeDAO;
import com.perfumeria.model.Perfume;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.google.gson.Gson;

@WebServlet("/perfumes")
public class PerfumeServlet extends HttpServlet {
    
    private PerfumeDAO perfumeDAO;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        perfumeDAO = new PerfumeDAO();
        gson = new Gson();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        String categoria = request.getParameter("categoria");
        String busqueda = request.getParameter("busqueda");
        String idStr = request.getParameter("id");
        
        PrintWriter out = response.getWriter();
        
        try {
            if ("destacados".equals(action)) {
                List<Perfume> perfumes = perfumeDAO.obtenerPerfumesDestacados(8);
                out.print(gson.toJson(perfumes));
            } else if (idStr != null) {
                int id = Integer.parseInt(idStr);
                Perfume perfume = perfumeDAO.obtenerPerfumePorId(id);
                if (perfume != null) {
                    out.print(gson.toJson(perfume));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                }
            } else if (busqueda != null && !busqueda.trim().isEmpty()) {
                List<Perfume> perfumes = perfumeDAO.buscarPerfumes(busqueda);
                out.print(gson.toJson(perfumes));
            } else if (categoria != null && !categoria.trim().isEmpty()) {
                List<Perfume> perfumes = perfumeDAO.obtenerPerfumesPorCategoria(categoria.toUpperCase());
                out.print(gson.toJson(perfumes));
            } else {
                List<Perfume> perfumes = perfumeDAO.obtenerTodosPerfumes();
                out.print(gson.toJson(perfumes));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error interno del servidor\"}");
            e.printStackTrace();
        }
    }
}