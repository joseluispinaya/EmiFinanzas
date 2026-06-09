namespace CapaEntidad.DTOs
{
    // 1. DTO para los Horarios Agrupados
    public class HorarioAgrupadoDTO
    {
        public int IdAsignacion { get; set; }
        public string NombreMateria { get; set; }
        public string NombreGrupo { get; set; }
        public string NombreTipo { get; set; }
        public string Dias { get; set; }
        public string Horarios { get; set; }
    }

    // 2. DTO para el Detalle de Asistencia por Asignación
    public class AsistenciaDetalleAsignacionDTO
    {
        public int IdAsistenciaDiaria { get; set; }
        public string Fecha { get; set; }
        public string NombreDia { get; set; }
        public string NombreMateria { get; set; }
        public string EntradaOficial { get; set; }
        public string SalidaOficial { get; set; }
        public string EntradaMarcada { get; set; }
        public string SalidaMarcada { get; set; }
        public int MinutosAtraso { get; set; }
        public string EstadoAsistencia { get; set; }
        public int IdEstado { get; set; }
    }

    // 3. DTO para el Historial Financiero (Planilla) por Asignación
    public class PlanillaDetalleAsignacionDTO
    {
        public int IdDetalle { get; set; }
        public int IdPlanilla { get; set; }
        public string Docente { get; set; }
        public string NombreMateria { get; set; }
        public string NombreTipo { get; set; }
        public string NombreGrupo { get; set; }
        public int HT { get; set; }
        public int HP { get; set; }
        public int HL { get; set; }
        public decimal CostoHora { get; set; }
        public int TotalMinutosAtraso { get; set; }
        public decimal TotalHorasNoTrabajadas { get; set; }
        public decimal TotalHorasPeriodo { get; set; }
        public decimal TotalHorasTrabajadas { get; set; }
        public decimal IngresoTotal { get; set; }
        public decimal TotalDescuentos { get; set; }
        public decimal TotalAPagar { get; set; }
    }
}
