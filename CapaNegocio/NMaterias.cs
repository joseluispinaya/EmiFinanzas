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
    public class NMaterias
    {
        #region "PATRON SINGLETON"
        private static NMaterias instancia = null;
        private NMaterias() { }
        public static NMaterias GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NMaterias();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditMateria(EMaterias oModel)
        {
            return DMaterias.GetInstance().GuardarOrEditMateria(oModel);
        }
        public Respuesta<List<MateriasDTO>> ListaMateriasIds(int IdCarrera, int IdSemestre)
        {
            return DMaterias.GetInstance().ListaMateriasIds(IdCarrera, IdSemestre);
        }

        public Respuesta<int> EliminarMateria(int IdMateria)
        {
            return DMaterias.GetInstance().EliminarMateria(IdMateria);
        }

        public Respuesta<List<ESemestres>> ListaSemestres()
        {
            return DMaterias.GetInstance().ListaSemestres();
        }
    }
}
