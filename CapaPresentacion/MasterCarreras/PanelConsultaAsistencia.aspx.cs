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
    public partial class PanelConsultaAsistencia : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (Session["UsuarioLogueado"] != null)
            //{
            //    EUsuarios usuario = (EUsuarios)Session["UsuarioLogueado"];

            //    if (usuario.IdRol != 3)
            //    {
            //        Response.Redirect("PanelInicio.aspx");
            //        return;
            //    }
            //}
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<FiltroDocenteDTO>> BuscarDocentesSelect2(string busqueda)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<FiltroDocenteDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            // Llamamos a la capa de datos
            return NConsultaAsistencia.GetInstance().ObtenerFiltroDocentesCarrera(usuari.IdCarrera, busqueda);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ConsultaHorarioDocenteDTO>> ObtenerHorario(int idDocente, int idGestion)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<ConsultaHorarioDocenteDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            return NConsultaAsistencia.GetInstance().ObtenerHorarioDocente(idDocente, usuari.IdCarrera, idGestion);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ConsultaAsistenciaDetalleDTO>> ObtenerAsistencia(int idDocente, int idGestion, int idPeriodo)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<ConsultaAsistenciaDetalleDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            return NConsultaAsistencia.GetInstance().ObtenerAsistenciaDetalle(idDocente, usuari.IdCarrera, idGestion, idPeriodo);
        }

    }
}