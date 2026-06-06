namespace CapaEntidad.DTOs
{
    // 1. DTO para el Buscador Select2
    public class FiltroDocenteDTO
    {
        public int IdDocente { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string CI { get; set; }
        public string ImagenUrl { get; set; }

        // Propiedad calculada útil para mostrar en la interfaz
        public string NombreCompleto => $"{Apellidos} {Nombres}";
    }

    // 2. DTO para la Tarjeta Lateral del Horario
    public class ConsultaHorarioDocenteDTO
    {
        public string NombreDia { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFin { get; set; }
        public string NombreMateria { get; set; }
        public string NombreGrupo { get; set; }
        public string NombreTipo { get; set; }
    }

    // 3. DTO para la Tabla Principal de Asistencia
    public class ConsultaAsistenciaDetalleDTO
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
}
