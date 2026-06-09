using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NPagosPlanilla
    {
        #region "PATRON SINGLETON"
        private static NPagosPlanilla instancia = null;
        private NPagosPlanilla() { }
        public static NPagosPlanilla GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NPagosPlanilla();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditPeriodoPago(EPeriodoPago objeto, DateTime FechaInicio, DateTime FechaFin)
        {
            return DPagosPlanilla.GetInstance().GuardarOrEditPeriodoPago(objeto, FechaInicio, FechaFin);
        }

        public Respuesta<List<EPeriodoPago>> ObtenerPeriodosPago(int IdGestion)
        {
            return DPagosPlanilla.GetInstance().ObtenerPeriodosPago(IdGestion);
        }

        public Respuesta<List<DatosParaPlanillaDTO>> ObtenerDatosParaGenerarPlanilla(int idCarrera, int idGestion, int idPeriodo)
        {
            return DPagosPlanilla.GetInstance().ObtenerDatosParaGenerarPlanilla(idCarrera, idGestion, idPeriodo);
        }

        public Respuesta<int> GuardarPlanillaCompleta(int idCarrera, int idGestion, int idPeriodo, int semanasMes, int idUsuarioRegistro, DataTable dtDetalles)
        {
            return DPagosPlanilla.GetInstance().GuardarPlanillaCompleta(idCarrera, idGestion, idPeriodo, semanasMes, idUsuarioRegistro, dtDetalles);
        }

        public Respuesta<PlanillaCabeceraRecalcularDTO> DetallePlanillaCabeceraPorId(int idPlanilla)
        {
            return DPagosPlanilla.GetInstance().DetallePlanillaCabeceraPorId(idPlanilla);
        }

        public Respuesta<int> RecalcularPlanilla(int idPlanilla, int semanasMes, int idUsuarioRegistro, DataTable dtDetalles)
        {
            return DPagosPlanilla.GetInstance().RecalcularPlanilla(idPlanilla, semanasMes, idUsuarioRegistro, dtDetalles);
        }

    }
}
