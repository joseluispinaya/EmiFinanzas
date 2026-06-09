namespace CapaEntidad.DTOs
{
    public class PlanillaDetalleGuardarDTO
    {
        public int IdAsignacion { get; set; }
        public decimal CostoHora { get; set; }
        public int TotalMinutosAtraso { get; set; }
        public decimal TotalHorasPeriodo { get; set; }
        public decimal TotalHorasNoTrabajadas { get; set; }
        public decimal TotalHorasTrabajadas { get; set; }
        public decimal IngresoTotal { get; set; }
        public decimal TotalDescuentos { get; set; }
        public decimal TotalAPagar { get; set; }
        public string Observacion { get; set; }
    }
}
