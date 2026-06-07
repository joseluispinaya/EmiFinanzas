using CapaEntidad.DTOs;
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
    }
}