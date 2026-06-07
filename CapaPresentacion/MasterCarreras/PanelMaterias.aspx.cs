using CapaEntidad.DTOs;
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

namespace CapaPresentacion.MasterCarreras
{
    public partial class PanelMaterias : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Verificamos que la sesión no sea nula antes de intentar leerla
            //if (Session["UsuarioLogueado"] != null)
            //{
            //    EUsuarios usuario = (EUsuarios)Session["UsuarioLogueado"];

            //    if (usuario.IdRol != 2)
            //    {
            //        Response.Redirect("PanelInicio.aspx");
            //        return;
            //    }
            //}
        }

        [WebMethod]
        public static Respuesta<List<ESemestres>> ListaSemestres()
        {
            return NMaterias.GetInstance().ListaSemestres();
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<MateriasDTO>> MateriasPorCarreraYSemestre(int IdSemestre)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<MateriasDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // Obtener el IdCarrera de Secretaria de la sesión (Seguro)
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NMaterias.GetInstance().ListaMateriasIds(usuari.IdCarrera, IdSemestre);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<MateriasDTO>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<MateriasDTO>> MateriasPorCarreraYSemestreAsi()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<MateriasDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // Obtener el IdCarrera de Secretaria de la sesión (Seguro)
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NMaterias.GetInstance().ListaMateriasIds(usuari.IdCarrera, 0);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<MateriasDTO>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditMateria(EMaterias objeto)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                objeto.IdCarrera = usuari.IdCarrera;

                return NMaterias.GetInstance().GuardarOrEditMateria(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }
    }
}