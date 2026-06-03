using CapaDatos;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NCarrera
    {
        #region "PATRON SINGLETON"
        private static NCarrera instancia = null;
        private NCarrera() { }
        public static NCarrera GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NCarrera();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ECarreras>> ObtenerCarrerasPorGrado(int idGradoAcademico)
        {
            return DCarrera.GetInstance().ObtenerCarrerasPorGrado(idGradoAcademico);
        }

        public Respuesta<int> GuardarOrEditCarrera(ECarreras oCarrera)
        {
            return DCarrera.GetInstance().GuardarOrEditCarrera(oCarrera);
        }
    }
}
