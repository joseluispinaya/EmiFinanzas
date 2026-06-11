namespace CapaEntidad.DTOs
{
    public class ReporteAsistenciaDTO
    {
        public string NombreMes { get; set; }
        public int MesNumero { get; set; }
        public int Dia { get; set; }
        public string Fecha { get; set; } // Formateada si lo deseas
        public string EstadoLetra { get; set; }
        public int MinutosAtraso { get; set; }
    }
}
