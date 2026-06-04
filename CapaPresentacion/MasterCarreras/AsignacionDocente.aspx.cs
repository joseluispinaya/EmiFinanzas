using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterCarreras
{
    public partial class AsignacionDocente : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EGestiones>> ListaGestiones()
        {
            return NGradoAcademico.GetInstance().ListaGestiones();
        }

        [WebMethod]
        public static Respuesta<List<EGrupos>> ListaGrupos()
        {
            return NGradoAcademico.GetInstance().ListaGrupos();
        }

        [WebMethod]
        public static Respuesta<List<TipoAsignacion>> ListaTipoAsignacion()
        {
            return NAsignacionDocen.GetInstance().ListaTipoAsignacion();
        }

        [WebMethod]
        public static Respuesta<List<EDias>> ListaDias()
        {
            return NAsignacionDocen.GetInstance().ListaDias();
        }

        [WebMethod]
        public static Respuesta<int> RegistroAsignacion(EAsignacionDocen objeto, List<HorarioAsignado> listaHorarios)
        {
            if (listaHorarios == null || listaHorarios.Count == 0)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se registró ningún horario. Por favor, agregue al menos un día."
                };
            }

            try
            {
                // 1. CREAMOS EL DATATABLE CON LA MISMA ESTRUCTURA QUE SQL
                DataTable dtHorarios = new DataTable();
                dtHorarios.Columns.Add("IdDia", typeof(int));
                dtHorarios.Columns.Add("HoraInicio", typeof(TimeSpan));
                dtHorarios.Columns.Add("HoraFin", typeof(TimeSpan));

                // 2. ITERAMOS, VALIDAMOS Y LLENAMOS LA TABLA
                foreach (var item in listaHorarios)
                {
                    // Validamos Hora de Inicio
                    if (!TimeSpan.TryParse(item.HoraInicio, out TimeSpan tInicio))
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"Formato de hora de inicio no válido: {item.HoraInicio}" };
                    }

                    // Validamos Hora de Fin
                    if (!TimeSpan.TryParse(item.HoraFin, out TimeSpan tFin))
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"Formato de hora de fin no válido: {item.HoraFin}" };
                    }

                    // Validamos Lógica (La misma que tienes en JS, pero respaldada en el Backend)
                    if (tInicio >= tFin)
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "La hora de inicio no puede ser mayor o igual a la hora de fin." };
                    }

                    // Si todo está perfecto, agregamos la fila al DataTable
                    dtHorarios.Rows.Add(item.IdDia, tInicio, tFin);
                }

                // 3. ENVIAMOS EL OBJETO Y EL DATATABLE A LA CAPA DE NEGOCIO (BLL -> DAL)
                return NAsignacionDocen.GetInstance().RegistroAsignacion(objeto, dtHorarios);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}