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
    public class NGradoAcademico
    {
        #region "PATRON SINGLETON"
        private static NGradoAcademico instancia = null;
        private NGradoAcademico() { }
        public static NGradoAcademico GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NGradoAcademico();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EGradoAcademico>> ListaGradosAcademicos()
        {
            return DGradoAcademico.GetInstance().ListaGradosAcademicos();
        }

        public Respuesta<int> GuardarOrEditGradoAcademicos(EGradoAcademico oGradoAcademico)
        {
            return DGradoAcademico.GetInstance().GuardarOrEditGradoAcademicos(oGradoAcademico);
        }

        public Respuesta<List<EGestiones>> ListaGestiones()
        {
            return DGradoAcademico.GetInstance().ListaGestiones();
        }

        public Respuesta<List<EGrupos>> ListaGrupos()
        {
            return DGradoAcademico.GetInstance().ListaGrupos();
        }
    }
}
