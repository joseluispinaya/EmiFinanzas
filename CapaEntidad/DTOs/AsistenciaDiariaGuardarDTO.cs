namespace CapaEntidad.DTOs
{
    public class AsistenciaDiariaGuardarDTO
    {
        public int IdHorario { get; set; }
        public int IdEstado { get; set; }
        public string HoraIngreso { get; set; }
        public string HoraSalida { get; set; }
        public int MinutosAtraso { get; set; }
    }
}
