namespace CapaEntidad.Entidades
{
    public class EPeriodoPago
    {
        public int IdPeriodo { get; set; }
        public int IdGestion { get; set; }
        public string Descripcion { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }
        public bool Estado { get; set; }
    }
}
