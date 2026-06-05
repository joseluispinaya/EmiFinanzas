using CapaEntidad.DTOs;
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
    public partial class PanelPlanilla : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<PlanillaCalculadaDTO>> ObtenerDatosParaGenerarPlanilla(int idGestion, int idPeriodo, int semanas)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<PlanillaCalculadaDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                // Pasamos el idPeriodo en lugar del idMes
                var resp = NPagosPlanilla.GetInstance().ObtenerDatosParaGenerarPlanilla(usuari.IdCarrera, idGestion, idPeriodo);

                if (!resp.Estado || resp.Data == null || !resp.Data.Any())
                {
                    return new Respuesta<List<PlanillaCalculadaDTO>> { Estado = false, Mensaje = "No se encontraron asignaciones activas para generar la planilla en este periodo." };
                }

                List<PlanillaCalculadaDTO> listaCalculada = new List<PlanillaCalculadaDTO>();

                foreach (var item in resp.Data)
                {
                    // 1. Horas del Periodo (HT + HP + HL) * SemanasMes
                    decimal horasSemanales = item.HT + item.HP + item.HL;
                    decimal totalHorasPeriodo = horasSemanales * semanas;

                    // 2. Horas No Trabajadas (TotalMinutosAtraso / 45.0)
                    decimal totalHorasNoTrabajadas = Math.Round(item.TotalMinutosAtraso / 45.0m, 2);

                    // 3. Horas Trabajadas (TotalHorasPeriodo - TotalHorasNoTrabajadas)
                    decimal totalHorasTrabajadas = totalHorasPeriodo - totalHorasNoTrabajadas;

                    // 4. Ingreso Total (TotalHorasPeriodo * CostoHora)
                    decimal ingresoTotal = Math.Round(totalHorasPeriodo * item.CostoHora, 2);

                    // 5. Total Descuentos ((CostoHora * TotalMinutosAtraso) / 45.0)
                    decimal totalDescuentos = Math.Round((item.CostoHora * item.TotalMinutosAtraso) / 45.0m, 2);

                    // 6. Total a Pagar (IngresoTotal - TotalDescuentos)
                    decimal totalAPagar = ingresoTotal - totalDescuentos;

                    listaCalculada.Add(new PlanillaCalculadaDTO
                    {
                        // Datos informativos y base
                        IdAsignacion = item.IdAsignacion,
                        Docente = item.Docente,
                        NombreMateria = item.NombreMateria,
                        NombreGrupo = item.NombreGrupo,
                        NombreTipo = item.NombreTipo,
                        HT = item.HT,
                        HP = item.HP,
                        HL = item.HL,
                        CostoHora = item.CostoHora,
                        TotalMinutosAtraso = item.TotalMinutosAtraso,

                        // Datos Calculados
                        TotalHorasPeriodo = totalHorasPeriodo,
                        TotalHorasNoTrabajadas = totalHorasNoTrabajadas,
                        TotalHorasTrabajadas = totalHorasTrabajadas,
                        IngresoTotal = ingresoTotal,
                        TotalDescuentos = totalDescuentos,
                        TotalAPagar = totalAPagar,
                        Observacion = ""
                    });
                }

                return new Respuesta<List<PlanillaCalculadaDTO>>
                {
                    Estado = true,
                    Data = listaCalculada,
                    Mensaje = "Planilla calculada exitosamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<PlanillaCalculadaDTO>> { Estado = false, Mensaje = "Error en el cálculo: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarPlanillaCompleta(GuardarPlanillaRequestDTO request)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            if (request == null || request.Detalles == null || request.Detalles.Count == 0)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "No hay datos calculados para guardar la planilla." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                // 1. Armar el DataTable exactamente con la misma estructura del TYPE en SQL
                DataTable dtDetalles = new DataTable();
                dtDetalles.Columns.Add("IdAsignacion", typeof(int));
                dtDetalles.Columns.Add("CostoHora", typeof(decimal));
                dtDetalles.Columns.Add("TotalMinutosAtraso", typeof(int));
                dtDetalles.Columns.Add("TotalHorasPeriodo", typeof(decimal));
                dtDetalles.Columns.Add("TotalHorasNoTrabajadas", typeof(decimal));
                dtDetalles.Columns.Add("TotalHorasTrabajadas", typeof(decimal));
                dtDetalles.Columns.Add("IngresoTotal", typeof(decimal));
                dtDetalles.Columns.Add("TotalDescuentos", typeof(decimal));
                dtDetalles.Columns.Add("TotalAPagar", typeof(decimal));
                dtDetalles.Columns.Add("Observacion", typeof(string));

                // 2. Llenar el DataTable iterando la lista de detalles
                foreach (var item in request.Detalles)
                {
                    // Enviamos vacío en la observación por defecto, tal como pediste
                    dtDetalles.Rows.Add(
                        item.IdAsignacion,
                        item.CostoHora,
                        item.TotalMinutosAtraso,
                        item.TotalHorasPeriodo,
                        item.TotalHorasNoTrabajadas,
                        item.TotalHorasTrabajadas,
                        item.IngresoTotal,
                        item.TotalDescuentos,
                        item.TotalAPagar,
                        "" // Observación vacía
                    );
                }

                // 3. Enviar todo a la Capa de Negocio (El IdCarrera lo sacamos del usuario logueado)
                return NPagosPlanilla.GetInstance().GuardarPlanillaCompleta(
                    usuari.IdCarrera,
                    request.IdGestion,
                    request.IdPeriodo,
                    request.SemanasMes,
                    usuari.IdUsuario,
                    dtDetalles
                );
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}