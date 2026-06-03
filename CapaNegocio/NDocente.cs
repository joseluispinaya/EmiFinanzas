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
    public class NDocente
    {
        #region "PATRON SINGLETON"
        private static NDocente instancia = null;
        private NDocente() { }
        public static NDocente GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NDocente();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditDocentes(EDocente oModel)
        {
            return DDocente.GetInstance().GuardarOrEditDocentes(oModel);
        }

        public Respuesta<List<EDocente>> ListaDocentePaginado(int Omitir, int TamanoPagina, string Buscar)
        {
            return DDocente.GetInstance().ListaDocentePaginado(Omitir, TamanoPagina, Buscar);
        }

        public Respuesta<List<EDocente>> FiltroDocentes(string Busqueda)
        {
            return DDocente.GetInstance().FiltroDocentes(Busqueda);
        }
    }
}
