namespace CapaEntidad.DTOs
{
    public class ObtenerAsigDocDTO
    {
        public int IdAsignacion { get; set; }
        public int IdDocente { get; set; }
        public int IdMateria { get; set; }
        public int IdGestion { get; set; }
        public int IdGrupo { get; set; }
        public int IdTipoAsignacion { get; set; }
        public string NombreTipo { get; set; }

        public string CI { get; set; }
        public string Celular { get; set; }
        public string ImagenUrl { get; set; }
        public string NomDocente { get; set; }
        public string NombreMateria { get; set; }
        public string NombreGrupo { get; set; }
        public decimal CostoHora { get; set; }
        public int CargaHorariaPeriodo { get; set; }
    }
}
