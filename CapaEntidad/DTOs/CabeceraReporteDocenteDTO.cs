namespace CapaEntidad.DTOs
{
    public class CabeceraReporteDocenteDTO
    {
        public string Docente { get; set; }
        public string NroCi { get; set; }
        public string NombreGestion { get; set; }
        public string NombreCarrera { get; set; }
        public string PeriodoPago { get; set; }
        public int SemanasMes { get; set; }
        public int IdEstadoPlanilla { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }
    }
}
