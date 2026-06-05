using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Data;
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

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarAsistenciaMasiva(string fechaAsistencia, List<AsistenciaDiariaGuardarDTO> listaAsistencia)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            if (listaAsistencia == null || listaAsistencia.Count == 0)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "No hay datos de asistencia para guardar." };
            }

            try
            {
                // Extraemos el usuario de la sesión
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                // 2. Validar y convertir Fecha
                if (!DateTime.TryParseExact(fechaAsistencia, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaAsistenciaConvertida))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido." };
                }

                // 3. Crear el DataTable con la misma estructura del TYPE en SQL
                DataTable dtDatos = new DataTable();
                dtDatos.Columns.Add("IdHorario", typeof(int));
                dtDatos.Columns.Add("IdEstado", typeof(int));
                dtDatos.Columns.Add("HoraIngreso", typeof(TimeSpan));
                dtDatos.Columns.Add("HoraSalida", typeof(TimeSpan));
                dtDatos.Columns.Add("MinutosAtraso", typeof(int));

                // 4. Llenar el DataTable iterando la lista
                foreach (var item in listaAsistencia)
                {
                    // Manejo seguro para que si viene vacío, pase un NULL a SQL Server
                    object valIngreso = DBNull.Value;
                    if (!string.IsNullOrWhiteSpace(item.HoraIngreso) && TimeSpan.TryParse(item.HoraIngreso, out TimeSpan tIngreso))
                    {
                        valIngreso = tIngreso;
                    }

                    object valSalida = DBNull.Value;
                    if (!string.IsNullOrWhiteSpace(item.HoraSalida) && TimeSpan.TryParse(item.HoraSalida, out TimeSpan tSalida))
                    {
                        valSalida = tSalida;
                    }

                    dtDatos.Rows.Add(item.IdHorario, item.IdEstado, valIngreso, valSalida, item.MinutosAtraso);
                }

                // 5. Enviar todo a la Capa de Negocio
                return NAsistencia.GetInstance().GuardarAsistenciaMasiva(fechaAsistenciaConvertida, usuari.IdUsuario, dtDatos);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}