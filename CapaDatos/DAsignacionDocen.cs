using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
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
    public class DAsignacionDocen
    {
        #region "PATRON SINGLETON"
        private static DAsignacionDocen instancia = null;
        private DAsignacionDocen() { }
        public static DAsignacionDocen GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DAsignacionDocen();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<TipoAsignacion>> ListaTipoAsignacion()
        {
            try
            {
                List<TipoAsignacion> rptLista = new List<TipoAsignacion>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaTipoAsignacion", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new TipoAsignacion()
                                {
                                    IdTipoAsignacion = Convert.ToInt32(dr["IdTipoAsignacion"]),
                                    NombreTipo = dr["NombreTipo"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<TipoAsignacion>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<TipoAsignacion>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<EDias>> ListaDias()
        {
            try
            {
                List<EDias> rptLista = new List<EDias>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaDias", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EDias()
                                {
                                    IdDia = Convert.ToInt32(dr["IdDia"]),
                                    NombreDia = dr["NombreDia"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EDias>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EDias>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> RegistroAsignacion(EAsignacionDocen oAsignacion, DataTable dtHorarios)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarAsignacionDocente", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de la Cabecera (Maestro)
                        cmd.Parameters.AddWithValue("@IdDocente", oAsignacion.IdDocente);
                        cmd.Parameters.AddWithValue("@IdMateria", oAsignacion.IdMateria);
                        cmd.Parameters.AddWithValue("@IdGestion", oAsignacion.IdGestion);
                        cmd.Parameters.AddWithValue("@IdGrupo", oAsignacion.IdGrupo);
                        cmd.Parameters.AddWithValue("@IdTipoAsignacion", oAsignacion.IdTipoAsignacion);
                        cmd.Parameters.AddWithValue("@CostoHora", oAsignacion.CostoHora);
                        cmd.Parameters.AddWithValue("@CargaHorariaPeriodo", oAsignacion.CargaHorariaPeriodo);

                        // ====================================================================
                        // Parámetro del Detalle (El DataTable mágico estructurado)
                        // ====================================================================
                        SqlParameter tvpParam = new SqlParameter("@Horarios", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_HorarioAsignacion", // El nombre exacto de tu TYPE en SQL
                            Value = dtHorarios
                        };
                        cmd.Parameters.Add(tvpParam);

                        // Parámetro de Salida
                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        resultadoCodigo = Convert.ToInt32(outputParam.Value);
                    }
                }

                response.Data = resultadoCodigo;

                // Interpretamos el código que devuelve tu SP
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Asignación de docente registrada correctamente con sus horarios.";
                        break;

                    case 2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Asignación Duplicada. El docente ya está asignado a ese Grupo y Tipo en esta Gestión.";
                        break;

                    case 3:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Operación denegada. La Gestión seleccionada se encuentra cerrada/inactiva.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar el registro de la asignación debido a un error interno.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error en Base de Datos: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<ObtenerAsigDocDTO>> ObtenerAsignacioneDocente(int IdCarrera)
        {
            try
            {
                List<ObtenerAsigDocDTO> rptLista = new List<ObtenerAsigDocDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerAsignacioneDocente", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdCarrera", IdCarrera);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ObtenerAsigDocDTO
                                {
                                    IdAsignacion = Convert.ToInt32(dr["IdAsignacion"]),
                                    IdDocente = Convert.ToInt32(dr["IdDocente"]),
                                    IdMateria = Convert.ToInt32(dr["IdMateria"]),
                                    IdGestion = Convert.ToInt32(dr["IdGestion"]),
                                    IdGrupo = Convert.ToInt32(dr["IdGrupo"]),
                                    IdTipoAsignacion = Convert.ToInt32(dr["IdTipoAsignacion"]),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString(),
                                    NomDocente = dr["Docente"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    CostoHora = Convert.ToDecimal(dr["CostoHora"]),
                                    CargaHorariaPeriodo = Convert.ToInt32(dr["CargaHorariaPeriodo"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ObtenerAsigDocDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ObtenerAsigDocDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<DetalleHorarioDTO>> ObtenerDetalleHorarios(int IdAsignacion)
        {
            try
            {
                List<DetalleHorarioDTO> rptLista = new List<DetalleHorarioDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarHorariosPorAsignacion", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdAsignacion", IdAsignacion);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new DetalleHorarioDTO
                                {
                                    IdDia = Convert.ToInt32(dr["IdDia"]),
                                    Dia = dr["Dia"].ToString(),
                                    HoraInicio = ((TimeSpan)dr["HoraInicio"]).ToString(@"hh\:mm"),
                                    HoraFin = ((TimeSpan)dr["HoraFin"]).ToString(@"hh\:mm")
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<DetalleHorarioDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DetalleHorarioDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

    }
}
