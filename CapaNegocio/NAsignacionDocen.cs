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
    public class NAsignacionDocen
    {
        #region "PATRON SINGLETON"
        private static NAsignacionDocen instancia = null;
        private NAsignacionDocen() { }
        public static NAsignacionDocen GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NAsignacionDocen();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<TipoAsignacion>> ListaTipoAsignacion()
        {
            return DAsignacionDocen.GetInstance().ListaTipoAsignacion();
        }

        public Respuesta<List<EDias>> ListaDias()
        {
            return DAsignacionDocen.GetInstance().ListaDias();
        }

        public Respuesta<int> RegistroAsignacion(EAsignacionDocen oAsignacion, DataTable dtHorarios)
        {
            return DAsignacionDocen.GetInstance().RegistroAsignacion(oAsignacion, dtHorarios);
        }

        public Respuesta<List<ObtenerAsigDocDTO>> ObtenerAsignacioneDocente(int IdCarrera)
        {
            return DAsignacionDocen.GetInstance().ObtenerAsignacioneDocente(IdCarrera);
        }

        public Respuesta<List<DetalleHorarioDTO>> ObtenerDetalleHorarios(int IdAsignacion)
        {
            return DAsignacionDocen.GetInstance().ObtenerDetalleHorarios(IdAsignacion);
        }
    }
}
