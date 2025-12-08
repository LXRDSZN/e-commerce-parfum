package com.perfumeria.servlet;

import com.perfumeria.dao.UsuarioDAO;
import com.perfumeria.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/registro")
public class RegistroServlet extends HttpServlet {
    
    private UsuarioDAO usuarioDAO;
    
    @Override
    public void init() throws ServletException {
        usuarioDAO = new UsuarioDAO();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String nombre = request.getParameter("nombre");
        String apellido = request.getParameter("apellido");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String telefono = request.getParameter("telefono");
        String direccion = request.getParameter("direccion");
        String ciudad = request.getParameter("ciudad");
        String codigoPostal = request.getParameter("codigoPostal");
        String pais = request.getParameter("pais");
        
        // Verificar si el email ya existe
        if (usuarioDAO.emailExiste(email)) {
            request.setAttribute("error", "Ya existe una cuenta con este email");
            request.getRequestDispatcher("registro.html").forward(request, response);
            return;
        }
        
        Usuario usuario = new Usuario(nombre, apellido, email, password);
        usuario.setTelefono(telefono);
        usuario.setDireccion(direccion);
        usuario.setCiudad(ciudad);
        usuario.setCodigoPostal(codigoPostal);
        usuario.setPais(pais);
        
        boolean registrado = usuarioDAO.registrarUsuario(usuario);
        
        if (registrado) {
            request.setAttribute("mensaje", "Registro exitoso. Por favor, inicia sesión.");
            request.getRequestDispatcher("login.html").forward(request, response);
        } else {
            request.setAttribute("error", "Error en el registro. Inténtalo de nuevo.");
            request.getRequestDispatcher("registro.html").forward(request, response);
        }
    }
}