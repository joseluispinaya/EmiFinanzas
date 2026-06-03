using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NUsuarios
    {
        #region "PATRON SINGLETON"
        private static NUsuarios conexion = null;
        private NUsuarios() { }
        public static NUsuarios GetInstance()
        {
            if (conexion == null)
            {
                conexion = new NUsuarios();
            }
            return conexion;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuarios objeto)
        {
            return DUsuarios.GetInstance().GuardarOrEditUsuarios(objeto);
        }

        public Respuesta<EUsuarios> LoginUsuarioEmi(string Correo)
        {
            return DUsuarios.GetInstance().LoginUsuarioEmi(Correo);
        }

        public Respuesta<List<ERoles>> ListaRoles()
        {
            return DUsuarios.GetInstance().ListaRoles();
        }

        public Respuesta<List<UsuarioDTO>> ListaUsuarios()
        {
            return DUsuarios.GetInstance().ListaUsuarios();
        }

        public Respuesta<EUsuarios> LoginUsuario(string Correo)
        {
            var correoPrueba = "joseluisdev@yopmail.com";

            if (correoPrueba.ToLower() != Correo.Trim().ToLower())
            {
                return new Respuesta<EUsuarios>
                {
                    Estado = false,
                    Data = null,
                    Mensaje = "Usuario o Contraseña incorrectos."
                };
            }


            EUsuarios obj = new EUsuarios
            {
                IdUsuario = 1,
                IdRol = 1,
                IdCarrera = 1,
                Nombres = "Jose Dev",
                Apellidos = "Pinaya Seo",
                Correo = "joseluisdev@yopmail.com",
                Clave = "123456789",
                FotoUrl = "/images/adminemi.png",
                Estado = true
            };

            return new Respuesta<EUsuarios>
            {
                Estado = true,
                Data = obj,
                Mensaje = "Bienvenido al sistema"
            };

        }

    }
}
