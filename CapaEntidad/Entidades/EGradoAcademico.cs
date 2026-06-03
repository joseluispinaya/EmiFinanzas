namespace CapaEntidad.Entidades
{
    public class EGradoAcademico
    {
        public int IdGradoAcademico { get; set; }
        public string GradoAcademico { get; set; }
        public bool Estado { get; set; }
        public int NroCarreras { get; set; }

        public string CantiCarreras =>
            NroCarreras == 0
            ? "0 Carreras"
            : NroCarreras == 1
                ? "1 Carrera"
                : $"{NroCarreras} Carreras";
    }
}
