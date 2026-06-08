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

namespace CapaPresentacion
{
    public partial class ConsultaAsistencias : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<FiltroDocenteDTO>> BuscarDocentesSelect2(int idCarrera, string busqueda)
        {
            return NConsultaAsistencia.GetInstance().ObtenerFiltroDocentesCarrera(idCarrera, busqueda);
        }

        [WebMethod]
        public static Respuesta<List<ConsultaHorarioDocenteDTO>> ObtenerHorario(int idDocente, int idCarrera, int idGestion)
        {

            return NConsultaAsistencia.GetInstance().ObtenerHorarioDocente(idDocente, idCarrera, idGestion);
        }

        [WebMethod]
        public static Respuesta<List<ConsultaAsistenciaDetalleDTO>> ObtenerAsistencia(int idDocente, int idCarrera, int idGestion, int idPeriodo)
        {

            return NConsultaAsistencia.GetInstance().ObtenerAsistenciaDetalle(idDocente, idCarrera, idGestion, idPeriodo);
        }

        [WebMethod]
        public static Respuesta<int> ActualizarAsistenciaIndividual(int idAsistencia, int idEstado, string horaIngreso, string horaSalida, int minutosAtraso)
        {
            // Usamos TimeSpan? (Nullable) para aceptar nulos cuando hay Falta o Permiso
            TimeSpan? timeIngreso = null;
            TimeSpan? timeSalida = null;

            // 1. Validar Hora de Ingreso (Solo si no viene vacía)
            if (!string.IsNullOrWhiteSpace(horaIngreso))
            {
                if (TimeSpan.TryParse(horaIngreso, out TimeSpan parsedIngreso))
                {
                    timeIngreso = parsedIngreso; // Guardamos la hora válida
                }
                else
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora de ingreso no es válido. Debe ser HH:mm." };
                }
            }

            // 2. Validar Hora de Salida (Solo si no viene vacía)
            if (!string.IsNullOrWhiteSpace(horaSalida))
            {
                if (TimeSpan.TryParse(horaSalida, out TimeSpan parsedSalida))
                {
                    timeSalida = parsedSalida;
                }
                else
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora de salida no es válido. Debe ser HH:mm." };
                }
            }

            // Pasamos las variables tipadas (TimeSpan?) a la capa de negocio
            return NAsistencia.GetInstance().ActualizarAsistenciaIndividualNew(idAsistencia, idEstado, timeIngreso, timeSalida, minutosAtraso);
        }

    }
}