namespace CapaEntidad.Entidades
{
    public class EMaterias
    {
        public int IdMateria { get; set; }
        public int IdCarrera { get; set; }
        public int IdSemestre { get; set; }
        public string NombreMateria { get; set; }
        public string Sigla { get; set; }
        public int HT { get; set; }
        public int HP { get; set; }
        public int HL { get; set; }
    }
}
