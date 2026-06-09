namespace CapaEntidad.DTOs
{
    public class PlanillaCabeceraRecalcularDTO
    {
        public int IdPlanilla { get; set; }
        public int IdGestion { get; set; }
        public int IdPeriodo { get; set; }
        public string NombreGestion { get; set; }
        public string PeriodoPago { get; set; }
        public int SemanasMes { get; set; }
        public string FechaCreacion { get; set; }
        public string EstadoPlanilla { get; set; }
        public int IdEstadoPlanilla { get; set; }
        public string UsuarioRegistro { get; set; }
        public string ComentarioAuditoria { get; set; }
    }
}
