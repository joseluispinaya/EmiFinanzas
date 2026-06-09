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
    public partial class ConsultasDetalleGeneral : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<HorarioAgrupadoDTO>> ObtenerHorariosAgrupados(int idDocente, int idGestion)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<HorarioAgrupadoDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            return NConsultaAsistencia.GetInstance().ObtenerHorariosAgrupados(idDocente, usuari.IdCarrera, idGestion);
        }

        [WebMethod]
        public static Respuesta<List<AsistenciaDetalleAsignacionDTO>> ObtenerAsistenciaPorAsignacion(int idAsignacion, int idPeriodo)
        {
            return NConsultaAsistencia.GetInstance().ObtenerAsistenciaDetallePorAsignacion(idAsignacion, idPeriodo);
        }

    }
}