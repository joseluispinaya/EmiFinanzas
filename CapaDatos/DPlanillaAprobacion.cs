using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DPlanillaAprobacion
    {
        #region PATRON SINGLETON
        private static DPlanillaAprobacion instancia = null;
        private DPlanillaAprobacion() { }
        public static DPlanillaAprobacion GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DPlanillaAprobacion();
            }
            return instancia;
        }
        #endregion

        // 1. LISTAR PLANILLAS POR GESTIÓN (Para la tabla inicial)
        public Respuesta<List<PlanillaListaDTO>> ListarPlanillasPorGestion(int idCarrera, int idGestion)
        {
            try
            {
                List<PlanillaListaDTO> rptLista = new List<PlanillaListaDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarPlanillasPorGestion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@IdGestion", idGestion);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PlanillaListaDTO
                                {
                                    IdPlanilla = Convert.ToInt32(dr["IdPlanilla"]),
                                    PeriodoPago = dr["PeriodoPago"].ToString(),
                                    SemanasMes = Convert.ToInt32(dr["SemanasMes"]),
                                    Fecha = dr["Fecha"].ToString(),
                                    EstadoPlanilla = dr["EstadoPlanilla"].ToString(),
                                    IdEstadoPlanilla = Convert.ToInt32(dr["IdEstadoPlanilla"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PlanillaListaDTO>> { Estado = true, Data = rptLista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<PlanillaListaDTO>> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 2. OBTENER CABECERA DE LA PLANILLA (Página de Detalle)
        public Respuesta<PlanillaCabeceraObtenerDTO> ObtenerPlanillaCabeceraPorId(int idPlanilla)
        {
            try
            {
                PlanillaCabeceraObtenerDTO cabecera = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerPlanillaCabeceraPorId", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPlanilla", idPlanilla);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                cabecera = new PlanillaCabeceraObtenerDTO
                                {
                                    IdPlanilla = Convert.ToInt32(dr["IdPlanilla"]),
                                    NombreGestion = dr["NombreGestion"].ToString(),
                                    PeriodoPago = dr["PeriodoPago"].ToString(),
                                    SemanasMes = Convert.ToInt32(dr["SemanasMes"]),
                                    FechaCreacion = dr["FechaCreacion"].ToString(),
                                    EstadoPlanilla = dr["EstadoPlanilla"].ToString(),
                                    IdEstadoPlanilla = Convert.ToInt32(dr["IdEstadoPlanilla"]),
                                    UsuarioRegistro = dr["UsuarioRegistro"].ToString()
                                };
                            }
                        }
                    }
                }

                if (cabecera != null)
                    return new Respuesta<PlanillaCabeceraObtenerDTO> { Estado = true, Data = cabecera };
                else
                    return new Respuesta<PlanillaCabeceraObtenerDTO> { Estado = false, Mensaje = "No se encontró la planilla." };
            }
            catch (Exception ex)
            {
                return new Respuesta<PlanillaCabeceraObtenerDTO> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 3. OBTENER DETALLE CONGELADO (Página de Detalle)
        public Respuesta<List<PlanillaDetalleObtenerDTO>> ObtenerPlanillaDetallePorId(int idPlanilla)
        {
            try
            {
                List<PlanillaDetalleObtenerDTO> rptLista = new List<PlanillaDetalleObtenerDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerPlanillaDetallePorId", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPlanilla", idPlanilla);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PlanillaDetalleObtenerDTO
                                {
                                    IdDetalle = Convert.ToInt32(dr["IdDetalle"]),
                                    Docente = dr["Docente"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    HT = Convert.ToInt32(dr["HT"]),
                                    HP = Convert.ToInt32(dr["HP"]),
                                    HL = Convert.ToInt32(dr["HL"]),
                                    CostoHora = Convert.ToDecimal(dr["CostoHora"]),
                                    TotalMinutosAtraso = Convert.ToInt32(dr["TotalMinutosAtraso"]),
                                    TotalHorasNoTrabajadas = Convert.ToDecimal(dr["TotalHorasNoTrabajadas"]),
                                    TotalHorasPeriodo = Convert.ToDecimal(dr["TotalHorasPeriodo"]),
                                    TotalHorasTrabajadas = Convert.ToDecimal(dr["TotalHorasTrabajadas"]),
                                    IngresoTotal = Convert.ToDecimal(dr["IngresoTotal"]),
                                    TotalDescuentos = Convert.ToDecimal(dr["TotalDescuentos"]),
                                    TotalAPagar = Convert.ToDecimal(dr["TotalAPagar"]),
                                    Observacion = dr["Observacion"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PlanillaDetalleObtenerDTO>> { Estado = true, Data = rptLista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<PlanillaDetalleObtenerDTO>> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 4. APROBAR O RECHAZAR PLANILLA (Con Auditoría)
        public Respuesta<int> CambiarEstadoPlanilla(int idPlanilla, int idEstadoNuevo, int idUsuarioAccion, string comentario)
        {
            try
            {
                int resultado = 0;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_CambiarEstadoPlanilla", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPlanilla", idPlanilla);
                        cmd.Parameters.AddWithValue("@IdEstadoNuevo", idEstadoNuevo);
                        cmd.Parameters.AddWithValue("@IdUsuarioAccion", idUsuarioAccion);
                        cmd.Parameters.AddWithValue("@Comentario", string.IsNullOrWhiteSpace(comentario) ? (object)DBNull.Value : comentario);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        resultado = Convert.ToInt32(outputParam.Value);
                    }
                }

                if (resultado == 1)
                    return new Respuesta<int> { Estado = true, Valor = "success", Mensaje = "El estado de la planilla fue actualizado correctamente." };
                else
                    return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "No se pudo actualizar el estado de la planilla." };
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error BD: " + ex.Message };
            }
        }

    }
}
