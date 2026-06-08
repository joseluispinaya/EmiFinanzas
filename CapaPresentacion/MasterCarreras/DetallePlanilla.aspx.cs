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
    public partial class DetallePlanilla : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<PlanillaCabeceraObtenerDTO> ObtenerCabecera(int IdPlanilla)
        {
            return NPlanillaAprobacion.GetInstance().ObtenerPlanillaCabeceraPorId(IdPlanilla);
        }

        [WebMethod]
        public static Respuesta<List<PlanillaDetalleObtenerDTO>> ObtenerDetalles(int IdPlanilla)
        {
            return NPlanillaAprobacion.GetInstance().ObtenerPlanillaDetallePorId(IdPlanilla);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> CambiarEstado(int idPlanilla, int idEstadoNuevo, string comentario)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // Obtener el IdCarrera de Secretaria de la sesión (Seguro)
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NPlanillaAprobacion.GetInstance().CambiarEstadoPlanilla(idPlanilla, idEstadoNuevo, usuari.IdUsuario, comentario);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}