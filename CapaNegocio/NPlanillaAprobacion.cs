using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NPlanillaAprobacion
    {
        #region PATRON SINGLETON
        private static NPlanillaAprobacion instancia = null;
        private NPlanillaAprobacion() { }
        public static NPlanillaAprobacion GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NPlanillaAprobacion();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<PlanillaListaDTO>> ListarPlanillasPorGestion(int idCarrera, int idGestion)
        {
            return DPlanillaAprobacion.GetInstance().ListarPlanillasPorGestion(idCarrera, idGestion);
        }

        public Respuesta<PlanillaCabeceraObtenerDTO> ObtenerPlanillaCabeceraPorId(int idPlanilla)
        {
            return DPlanillaAprobacion.GetInstance().ObtenerPlanillaCabeceraPorId(idPlanilla);
        }

        public Respuesta<List<PlanillaDetalleObtenerDTO>> ObtenerPlanillaDetallePorId(int idPlanilla)
        {
            return DPlanillaAprobacion.GetInstance().ObtenerPlanillaDetallePorId(idPlanilla);
        }

        public Respuesta<int> CambiarEstadoPlanilla(int idPlanilla, int idEstadoNuevo, int idUsuarioAccion, string comentario)
        {
            return DPlanillaAprobacion.GetInstance().CambiarEstadoPlanilla(idPlanilla, idEstadoNuevo, idUsuarioAccion, comentario);
        }

    }
}
