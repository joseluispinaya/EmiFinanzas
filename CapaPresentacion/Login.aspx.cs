using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.AppendHeader("Cache-Control", "no-store");
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<EUsuarios> InicioSesion(string Correo, string Clave)
        {
            try
            {
                var resp = NUsuarios.GetInstance().LoginUsuarioEmi(Correo);

                if (!resp.Estado || resp.Data == null)
                {
                    return new Respuesta<EUsuarios> { Estado = false, Mensaje = resp.Mensaje };
                }

                var objUser = resp.Data;

                // Validar Estado
                if (!objUser.Estado)
                {
                    return new Respuesta<EUsuarios> { Estado = false, Mensaje = "Su cuenta se encuentra inactiva." };
                }

                // Verificamos la contraseña (BCrypt)
                bool passCorrecta = Utilidadesj.GetInstance().Verify(Clave, objUser.Clave);

                if (!passCorrecta)
                {
                    return new Respuesta<EUsuarios> { Estado = false, Valor = "", Mensaje = "Usuario o Contraseña incorrectos." };
                }

                // Seguridad: Limpiamos la clave antes de guardarla en sesión
                objUser.Clave = "";

                // Guardamos en sesión el objeto limpio
                HttpContext.Current.Session["UsuarioLogueado"] = objUser;

                // ==============================================================
                // TU LÓGICA OPTIMIZADA: Operador Ternario basado en IdCarrera
                // Si es 0 (Sistemas) -> "Inicio.aspx"
                // Si es distinto de 0 (Secretaria/Jefe) -> "MasterCarrera/PanelInicio.aspx"
                // ==============================================================
                //string rutaUrl = (objUser.IdCarrera == 0) ? "Inicio.aspx" : "MasterCarrera/PanelInicio.aspx";

                string rutaUrl;

                // Tu nueva lógica de Autorización
                if (objUser.IdCarrera == 0)
                {
                    rutaUrl = "Inicio.aspx";
                    HttpContext.Current.Session["TipoUsuario"] = "EncargadoSis";
                }
                else
                {
                    rutaUrl = "MasterCarreras/PanelInicio.aspx";
                    HttpContext.Current.Session["TipoUsuario"] = "UsuarioCarrera";
                }

                return new Respuesta<EUsuarios>
                {
                    Estado = true,
                    Data = objUser,
                    Valor = rutaUrl, // Mandamos la ruta al JS
                    Mensaje = "Bienvenido al sistema"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<EUsuarios> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }
    }
}