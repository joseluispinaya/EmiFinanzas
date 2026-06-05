using System.Collections.Generic;

namespace CapaEntidad.DTOs
{
    public class GuardarPlanillaRequestDTO
    {
        public int IdGestion { get; set; }
        public int IdPeriodo { get; set; }
        public int SemanasMes { get; set; }
        public List<PlanillaCalculadaDTO> Detalles { get; set; }
    }
}
