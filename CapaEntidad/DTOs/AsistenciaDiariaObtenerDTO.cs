namespace CapaEntidad.DTOs
{
    public class AsistenciaDiariaObtenerDTO
    {
        public int IdHorario { get; set; }
        public int IdAsistenciaDiaria { get; set; }

        // Datos Informativos
        public string Docente { get; set; }
        public string NombreMateria { get; set; }
        public string NombreGrupo { get; set; }
        public string NombreTipo { get; set; }

        // Horario Oficial (Viene de HORARIOS_ASIGNACION)
        public string HoraEntradaProgramada { get; set; }
        public string HoraSalidaProgramada { get; set; }

        // Datos de Interacción (Viene de ASISTENCIA_DIARIA - Pueden ser nulos en BD)
        public int IdEstadoAsistencia { get; set; }
        public string HoraIngreso { get; set; }
        public string HoraSalida { get; set; }
        public int MinutosAtraso { get; set; }
    }
}
