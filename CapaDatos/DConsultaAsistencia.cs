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
    public class DConsultaAsistencia
    {
        #region PATRON SINGLETON
        private static DConsultaAsistencia instancia = null;
        private DConsultaAsistencia() { }
        public static DConsultaAsistencia GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DConsultaAsistencia();
            }
            return instancia;
        }
        #endregion

        // 1. OBTENER FILTRO PARA EL SELECT2
        public Respuesta<List<FiltroDocenteDTO>> ObtenerFiltroDocentesCarrera(int idCarrera, string busqueda)
        {
            try
            {
                List<FiltroDocenteDTO> rptLista = new List<FiltroDocenteDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_Consulta_FiltroDocentesCarrera", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@Busqueda", busqueda);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new FiltroDocenteDTO
                                {
                                    IdDocente = Convert.ToInt32(dr["IdDocente"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<FiltroDocenteDTO>> { Estado = true, Data = rptLista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<FiltroDocenteDTO>> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 2. OBTENER HORARIO DEL DOCENTE
        public Respuesta<List<ConsultaHorarioDocenteDTO>> ObtenerHorarioDocente(int idDocente, int idCarrera, int idGestion)
        {
            try
            {
                List<ConsultaHorarioDocenteDTO> rptLista = new List<ConsultaHorarioDocenteDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_Consulta_HorarioDocente", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdDocente", idDocente);
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@IdGestion", idGestion);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ConsultaHorarioDocenteDTO
                                {
                                    NombreDia = dr["NombreDia"].ToString(),
                                    HoraInicio = ((TimeSpan)dr["HoraInicio"]).ToString(@"hh\:mm"),
                                    HoraFin = ((TimeSpan)dr["HoraFin"]).ToString(@"hh\:mm"),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ConsultaHorarioDocenteDTO>> { Estado = true, Data = rptLista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ConsultaHorarioDocenteDTO>> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 3. OBTENER DETALLE DE ASISTENCIAS
        public Respuesta<List<ConsultaAsistenciaDetalleDTO>> ObtenerAsistenciaDetalle(int idDocente, int idCarrera, int idGestion, int idPeriodo)
        {
            try
            {
                List<ConsultaAsistenciaDetalleDTO> rptLista = new List<ConsultaAsistenciaDetalleDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_Consulta_AsistenciaDetalle", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdDocente", idDocente);
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@IdGestion", idGestion);
                        cmd.Parameters.AddWithValue("@IdPeriodo", idPeriodo);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ConsultaAsistenciaDetalleDTO
                                {
                                    IdAsistenciaDiaria = Convert.ToInt32(dr["IdAsistenciaDiaria"]),
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    NombreDia = dr["NombreDia"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),

                                    // Formateamos las horas oficiales
                                    EntradaOficial = ((TimeSpan)dr["EntradaOficial"]).ToString(@"hh\:mm"),
                                    SalidaOficial = ((TimeSpan)dr["SalidaOficial"]).ToString(@"hh\:mm"),

                                    // Validación segura para horas que podrían ser NULAS (DBNull.Value)
                                    EntradaMarcada = dr["EntradaMarcada"] != DBNull.Value ? ((TimeSpan)dr["EntradaMarcada"]).ToString(@"hh\:mm") : "--:--",
                                    SalidaMarcada = dr["SalidaMarcada"] != DBNull.Value ? ((TimeSpan)dr["SalidaMarcada"]).ToString(@"hh\:mm") : "--:--",

                                    MinutosAtraso = Convert.ToInt32(dr["MinutosAtraso"]),
                                    EstadoAsistencia = dr["EstadoAsistencia"].ToString(),
                                    IdEstado = Convert.ToInt32(dr["IdEstado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ConsultaAsistenciaDetalleDTO>> { Estado = true, Data = rptLista };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ConsultaAsistenciaDetalleDTO>> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        // 1. OBTENER HORARIOS AGRUPADOS
        public Respuesta<List<HorarioAgrupadoDTO>> ObtenerHorariosAgrupados(int idDocente, int idCarrera, int idGestion)
        {
            var response = new Respuesta<List<HorarioAgrupadoDTO>> { Data = new List<HorarioAgrupadoDTO>() };
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerHorariosAgrupados", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdDocente", idDocente);
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@IdGestion", idGestion);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                response.Data.Add(new HorarioAgrupadoDTO
                                {
                                    IdAsignacion = Convert.ToInt32(dr["IdAsignacion"]),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    Dias = dr["Dias"].ToString(),
                                    Horarios = dr["Horarios"].ToString()
                                });
                            }
                        }
                    }
                }
                response.Estado = true;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = "Error BD (Horarios): " + ex.Message;
            }
            return response;
        }

        // 2. OBTENER DETALLE DE ASISTENCIA POR ASIGNACIÓN
        public Respuesta<List<AsistenciaDetalleAsignacionDTO>> ObtenerAsistenciaDetallePorAsignacion(int idAsignacion, int idPeriodo)
        {
            var response = new Respuesta<List<AsistenciaDetalleAsignacionDTO>> { Data = new List<AsistenciaDetalleAsignacionDTO>() };
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_Consulta_AsistenciaDetalle_PorAsignacion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdAsignacion", idAsignacion);
                        cmd.Parameters.AddWithValue("@IdPeriodo", idPeriodo);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                response.Data.Add(new AsistenciaDetalleAsignacionDTO
                                {
                                    IdAsistenciaDiaria = Convert.ToInt32(dr["IdAsistenciaDiaria"]),
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    NombreDia = dr["NombreDia"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),

                                    EntradaOficial = ((TimeSpan)dr["EntradaOficial"]).ToString(@"hh\:mm"),
                                    SalidaOficial = ((TimeSpan)dr["SalidaOficial"]).ToString(@"hh\:mm"),

                                    // Las marcadas pueden ser nulas si hay falta o permiso
                                    EntradaMarcada = dr["EntradaMarcada"] != DBNull.Value ? ((TimeSpan)dr["EntradaMarcada"]).ToString(@"hh\:mm") : "",
                                    SalidaMarcada = dr["SalidaMarcada"] != DBNull.Value ? ((TimeSpan)dr["SalidaMarcada"]).ToString(@"hh\:mm") : "",

                                    MinutosAtraso = Convert.ToInt32(dr["MinutosAtraso"]),
                                    EstadoAsistencia = dr["EstadoAsistencia"].ToString(),
                                    IdEstado = Convert.ToInt32(dr["IdEstado"])
                                });
                            }
                        }
                    }
                }
                response.Estado = true;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = "Error BD (Asistencia): " + ex.Message;
            }
            return response;
        }

        // 3. OBTENER HISTORIAL FINANCIERO (PLANILLA) POR ASIGNACIÓN
        public Respuesta<List<PlanillaDetalleAsignacionDTO>> ObtenerPlanillaDetallePorAsignacion(int idAsignacion)
        {
            var response = new Respuesta<List<PlanillaDetalleAsignacionDTO>> { Data = new List<PlanillaDetalleAsignacionDTO>() };
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ObtenerPlanillaDetalle_PorAsignacion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdAsignacion", idAsignacion);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                response.Data.Add(new PlanillaDetalleAsignacionDTO
                                {
                                    IdDetalle = Convert.ToInt32(dr["IdDetalle"]),
                                    IdPlanilla = Convert.ToInt32(dr["IdPlanilla"]),
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
                                    TotalAPagar = Convert.ToDecimal(dr["TotalAPagar"])
                                });
                            }
                        }
                    }
                }
                response.Estado = true;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = "Error BD (Detalle Planilla): " + ex.Message;
            }
            return response;
        }

        public Respuesta<List<ReporteAsistenciaDTO>> AsistenciaPorAsignacionRpt(int idAsignacion, int idPeriodo)
        {
            var response = new Respuesta<List<ReporteAsistenciaDTO>> { Data = new List<ReporteAsistenciaDTO>() };
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_AsistenciaMatrizRpt", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdAsignacion", idAsignacion);
                        cmd.Parameters.AddWithValue("@IdPeriodo", idPeriodo);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                response.Data.Add(new ReporteAsistenciaDTO
                                {
                                    NombreMes = dr["NombreMes"].ToString(),
                                    MesNumero = Convert.ToInt32(dr["MesNumero"]),
                                    Dia = Convert.ToInt32(dr["Dia"]),
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),

                                    EstadoLetra = dr["EstadoLetra"].ToString(),
                                    MinutosAtraso = Convert.ToInt32(dr["MinutosAtraso"])
                                });
                            }
                        }
                    }
                }
                response.Estado = true;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = "Error BD (Asistencia): " + ex.Message;
            }
            return response;
        }

    }
}
