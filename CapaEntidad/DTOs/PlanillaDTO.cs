namespace CapaEntidad.DTOs
{
    // 1. La clase base (Lo que viene de la Base de Datos)
    public class DatosParaPlanillaDTO
    {
        public int IdAsignacion { get; set; }
        public string Docente { get; set; }
        public string NombreMateria { get; set; }
        public string NombreGrupo { get; set; }
        public string NombreTipo { get; set; }
        public int HT { get; set; }
        public int HP { get; set; }
        public int HL { get; set; }
        public decimal CostoHora { get; set; }
        public int TotalMinutosAtraso { get; set; }
    }

    // 2. La clase extendida (Lo que calculamos en C# para enviar al Frontend)
    // Al usar : DatosParaPlanillaDTO, esta clase ya tiene los campos de arriba heredados
    public class PlanillaCalculadaDTO : DatosParaPlanillaDTO
    {
        public decimal TotalHorasPeriodo { get; set; }
        public decimal TotalHorasNoTrabajadas { get; set; }
        public decimal TotalHorasTrabajadas { get; set; }
        public decimal IngresoTotal { get; set; }
        public decimal TotalDescuentos { get; set; }
        public decimal TotalAPagar { get; set; }
        public string Observacion { get; set; }
    }
}
