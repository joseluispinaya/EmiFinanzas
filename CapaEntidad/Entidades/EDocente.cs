namespace CapaEntidad.Entidades
{
    public class EDocente
    {
        public int IdDocente { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string CI { get; set; }
        public string Celular { get; set; }
        public string Profesion { get; set; }
        public string NroNit { get; set; }
        public string ImagenUrl { get; set; }
        public string CuentaBancaria { get; set; }
        public bool Estado { get; set; }
        // --- Propiedades extra para DataTables Server-Side ---
        public int TotalRegistros { get; set; }
        public int TotalFiltrados { get; set; }
        //public string NombreCompleto => $"{Nombres} {Apellidos}";
    }
}
