package com.perfumeria.servlet;

import com.perfumeria.dao.CarritoDAO;
import com.perfumeria.model.Carrito;
import com.perfumeria.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.google.gson.Gson;

@WebServlet("/carrito")
public class CarritoServlet extends HttpServlet {
    
    private CarritoDAO carritoDAO;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        carritoDAO = new CarritoDAO();
        gson = new Gson();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        
        if ("count".equals(action)) {
            int count = carritoDAO.contarItemsCarrito(usuario.getId());
            out.print("{\"count\": " + count + "}");
        } else {
            List<Carrito> items = carritoDAO.obtenerCarritoUsuario(usuario.getId());
            out.print(gson.toJson(items));
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        String action = request.getParameter("action");
        
        if ("agregar".equals(action)) {
            int perfumeId = Integer.parseInt(request.getParameter("perfumeId"));
            int cantidad = Integer.parseInt(request.getParameter("cantidad"));
            
            boolean agregado = carritoDAO.agregarAlCarrito(usuario.getId(), perfumeId, cantidad);
            
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print("{\"success\": " + agregado + "}");
            
        } else if ("actualizar".equals(action)) {
            int carritoId = Integer.parseInt(request.getParameter("carritoId"));
            int cantidad = Integer.parseInt(request.getParameter("cantidad"));
            
            boolean actualizado = carritoDAO.actualizarCantidad(carritoId, cantidad);
            
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print("{\"success\": " + actualizado + "}");
            
        } else if ("eliminar".equals(action)) {
            int carritoId = Integer.parseInt(request.getParameter("carritoId"));
            
            boolean eliminado = carritoDAO.eliminarDelCarrito(carritoId);
            
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print("{\"success\": " + eliminado + "}");
            
        } else if ("limpiar".equals(action)) {
            boolean limpiado = carritoDAO.limpiarCarrito(usuario.getId());
            
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print("{\"success\": " + limpiado + "}");
        }
    }
}