namespace CapaEntidad.DTOs
{
    // 1. DTO para la tabla principal (Listado de Planillas)
    public class PlanillaListaDTO
    {
        public int IdPlanilla { get; set; }
        public string PeriodoPago { get; set; }
        public int SemanasMes { get; set; }
        public string Fecha { get; set; }
        public string EstadoPlanilla { get; set; }
        public int IdEstadoPlanilla { get; set; }
    }

    // 2. DTO para la tarjeta superior de la Página de Detalles (Resumen)
    public class PlanillaCabeceraObtenerDTO
    {
        public int IdPlanilla { get; set; }
        public string NombreGestion { get; set; }
        public string PeriodoPago { get; set; }
        public int SemanasMes { get; set; }
        public string FechaCreacion { get; set; }
        public string EstadoPlanilla { get; set; }
        public int IdEstadoPlanilla { get; set; }
        public string UsuarioRegistro { get; set; }
        public string ComentarioAuditoria { get; set; } // ¡Nueva propiedad!
    }

    // 3. DTO para la tabla de Detalles Congelados
    public class PlanillaDetalleObtenerDTO
    {
        public int IdDetalle { get; set; }
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
        public string Observacion { get; set; }
    }
}
