namespace CapaEntidad.DTOs
{
    public class MateriasDTO
    {
        public int IdMateria { get; set; }
        public int IdCarrera { get; set; }
        public int IdSemestre { get; set; }
        public string NombreMateria { get; set; }
        public string Sigla { get; set; }
        public int HT { get; set; }
        public int HP { get; set; }
        public int HL { get; set; }
        public int HS { get; set; }
        public int IdGradoAcademico { get; set; }
        public string NombreCarrera { get; set; }
        public string NombreSemestre { get; set; }
        public bool Estado { get; set; }
    }
}
