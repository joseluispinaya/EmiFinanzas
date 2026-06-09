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
    public class NConsultaAsistencia
    {
        #region PATRON SINGLETON
        private static NConsultaAsistencia instancia = null;
        private NConsultaAsistencia() { }
        public static NConsultaAsistencia GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NConsultaAsistencia();
            }
            return instancia;
        }
        #endregion

        // 1. OBTENER FILTRO PARA EL SELECT2
        public Respuesta<List<FiltroDocenteDTO>> ObtenerFiltroDocentesCarrera(int idCarrera, string busqueda)
        {
            return DConsultaAsistencia.GetInstance().ObtenerFiltroDocentesCarrera(idCarrera, busqueda);
        }

        // 2. OBTENER HORARIO DEL DOCENTE
        public Respuesta<List<ConsultaHorarioDocenteDTO>> ObtenerHorarioDocente(int idDocente, int idCarrera, int idGestion)
        {
            return DConsultaAsistencia.GetInstance().ObtenerHorarioDocente(idDocente, idCarrera, idGestion);
        }

        // 3. OBTENER DETALLE DE ASISTENCIAS
        public Respuesta<List<ConsultaAsistenciaDetalleDTO>> ObtenerAsistenciaDetalle(int idDocente, int idCarrera, int idGestion, int idPeriodo)
        {
            return DConsultaAsistencia.GetInstance().ObtenerAsistenciaDetalle(idDocente, idCarrera, idGestion, idPeriodo);
        }

        public Respuesta<List<HorarioAgrupadoDTO>> ObtenerHorariosAgrupados(int idDocente, int idCarrera, int idGestion)
        {
            return DConsultaAsistencia.GetInstance().ObtenerHorariosAgrupados(idDocente, idCarrera, idGestion);
        }

        public Respuesta<List<AsistenciaDetalleAsignacionDTO>> ObtenerAsistenciaDetallePorAsignacion(int idAsignacion, int idPeriodo)
        {
            return DConsultaAsistencia.GetInstance().ObtenerAsistenciaDetallePorAsignacion(idAsignacion, idPeriodo);
        }

        public Respuesta<List<PlanillaDetalleAsignacionDTO>> ObtenerPlanillaDetallePorAsignacion(int idAsignacion)
        {
            return DConsultaAsistencia.GetInstance().ObtenerPlanillaDetallePorAsignacion(idAsignacion);
        }

    }
}
