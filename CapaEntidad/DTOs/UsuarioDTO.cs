namespace CapaEntidad.DTOs
{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; }
        public int IdCarrera { get; set; }
        public int IdGradoAcademico { get; set; }
        public string NombreCarrera { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NroCi { get; set; }
        public string Correo { get; set; }
        public string FotoUrl { get; set; }
        public bool Estado { get; set; }
        public string FechaRegistro { get; set; }
        public string FullName => $"{Apellidos} {Nombres}";
    }
}
