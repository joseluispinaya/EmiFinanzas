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
    public partial class ListaAsignaciones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ObtenerAsigDocDTO>> ListaAsignacioneDocente()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<ObtenerAsigDocDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // Obtener el IdCarrera de Secretaria de la sesión (Seguro)
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NAsignacionDocen.GetInstance().ObtenerAsignacioneDocente(usuari.IdCarrera);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<ObtenerAsigDocDTO>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<List<DetalleHorarioDTO>> ObtenerDetalleHorarios(int idAsignacion)
        {
            try
            {
                // Llamas a tu capa de negocio para obtener la lista de horarios 
                // usando el usp_ListarHorariosPorAsignacion
                return NAsignacionDocen.GetInstance().ObtenerDetalleHorarios(idAsignacion);
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DetalleHorarioDTO>>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error inesperado: " + ex.Message
                };
            }
        }

    }
}