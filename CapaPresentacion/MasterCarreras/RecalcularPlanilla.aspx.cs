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
    public partial class RecalcularPlanilla : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<PlanillaCabeceraRecalcularDTO> ObtenerCabeceraDetalle(int IdPlanilla)
        {
            return NPagosPlanilla.GetInstance().DetallePlanillaCabeceraPorId(IdPlanilla);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> ActualizarPlanilla(int idPlanilla, int semanasMes, List<PlanillaDetalleGuardarDTO> listaDetalles)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            if (listaDetalles == null || listaDetalles.Count == 0)
            {
                return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "No hay datos calculados para actualizar la planilla." };
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

                // 2. Llenar el DataTable iterando la lista
                foreach (var item in listaDetalles)
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
                return NPagosPlanilla.GetInstance().RecalcularPlanilla(
                    idPlanilla,
                    semanasMes,
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