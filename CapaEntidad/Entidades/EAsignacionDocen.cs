namespace CapaEntidad.Entidades
{
    public class EAsignacionDocen
    {
        //public int IdAsignacion { get; set; }
        public int IdDocente { get; set; }
        public int IdMateria { get; set; }
        public int IdGestion { get; set; }
        public int IdGrupo { get; set; }
        public int IdTipoAsignacion { get; set; }
        public decimal CostoHora { get; set; }
        public int CargaHorariaPeriodo { get; set; }
    }
}
