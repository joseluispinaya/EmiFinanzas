using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class PanelAsistenciaDiaria : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EstadoAsistencia>> ListaEstadoAsistencia()
        {
            return NAsistencia.GetInstance().ListaEstadoAsistencia();
        }

        [WebMethod]
        public static Respuesta<List<EGestiones>> ListaGestiones()
        {
            return NGradoAcademico.GetInstance().ListaGestiones();
        }

        [WebMethod]
        public static Respuesta<List<AsistenciaDiariaObtenerDTO>> ListarAsistenciaPorFecha(int idCarrera, int idGestion, string fechaAsistencia)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(fechaAsistencia, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaAsistenciaConvertida))
                {
                    return new Respuesta<List<AsistenciaDiariaObtenerDTO>> { Estado = false, Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // Llamas a tu capa de negocio para obtener la lista de horarios 
                // usando el usp_ListarHorariosPorAsignacion
                return NAsistencia.GetInstance().ListarAsistenciaPorFecha(idCarrera, idGestion, fechaAsistenciaConvertida);
            }
            catch (Exception ex)
            {
                return new Respuesta<List<AsistenciaDiariaObtenerDTO>>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error inesperado: " + ex.Message
                };
            }
        }

    }
}