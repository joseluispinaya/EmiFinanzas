using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NAsistencia
    {
        #region "PATRON SINGLETON"
        private static NAsistencia instancia = null;
        private NAsistencia() { }
        public static NAsistencia GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NAsistencia();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<AsistenciaDiariaObtenerDTO>> ListarAsistenciaPorFecha(int idCarrera, int idGestion, DateTime fechaAsistencia)
        {
            return DAsistencia.GetInstance().ListarAsistenciaPorFecha(idCarrera, idGestion, fechaAsistencia);
        }

        public Respuesta<List<EstadoAsistencia>> ListaEstadoAsistencia()
        {
            return DAsistencia.GetInstance().ListaEstadoAsistencia();
        }
    }
}
