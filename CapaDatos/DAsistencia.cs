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
    public class DAsistencia
    {
        #region "PATRON SINGLETON"
        private static DAsistencia instancia = null;
        private DAsistencia() { }
        public static DAsistencia GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DAsistencia();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<AsistenciaDiariaObtenerDTO>> ListarAsistenciaPorFecha(int idCarrera, int idGestion, DateTime fechaAsistencia)
        {
            List<AsistenciaDiariaObtenerDTO> rptLista = new List<AsistenciaDiariaObtenerDTO>();

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarAsistenciaPorFecha", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;

                        // Agregamos los parámetros requeridos por tu SP
                        comando.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        comando.Parameters.AddWithValue("@IdGestion", idGestion);
                        // Aseguramos que solo envíe la fecha (sin horas) para evitar desajustes en el SQL
                        comando.Parameters.AddWithValue("@FechaAsistencia", fechaAsistencia.Date);

                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new AsistenciaDiariaObtenerDTO
                                {
                                    IdHorario = Convert.ToInt32(dr["IdHorario"]),
                                    IdAsistenciaDiaria = Convert.ToInt32(dr["IdAsistenciaDiaria"]),

                                    Docente = dr["Docente"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString(),

                                    // Horas Programadas (Garantizadas por el INNER JOIN)
                                    HoraEntradaProgramada = ((TimeSpan)dr["HoraEntradaProgramada"]).ToString(@"hh\:mm"),
                                    HoraSalidaProgramada = ((TimeSpan)dr["HoraSalidaProgramada"]).ToString(@"hh\:mm"),

                                    // Estado (El ISNULL en SQL ya garantiza que por defecto vendrá un 1)
                                    IdEstadoAsistencia = Convert.ToInt32(dr["IdEstadoAsistencia"]),

                                    // Horas de Marca (Pueden venir nulas por el LEFT JOIN)
                                    HoraIngreso = dr["HoraIngreso"] != DBNull.Value
                                                  ? ((TimeSpan)dr["HoraIngreso"]).ToString(@"hh\:mm")
                                                  : "",

                                    HoraSalida = dr["HoraSalida"] != DBNull.Value
                                                 ? ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm")
                                                 : "",

                                    MinutosAtraso = Convert.ToInt32(dr["MinutosAtraso"])
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<AsistenciaDiariaObtenerDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista de asistencia obtenida correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<AsistenciaDiariaObtenerDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = "Error al listar la asistencia: " + ex.Message
                };
            }
        }

        public Respuesta<List<EstadoAsistencia>> ListaEstadoAsistencia()
        {
            try
            {
                List<EstadoAsistencia> rptLista = new List<EstadoAsistencia>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaEstadosAsis", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EstadoAsistencia()
                                {
                                    IdEstado = Convert.ToInt32(dr["IdEstado"]),
                                    Descripcion = dr["Descripcion"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EstadoAsistencia>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EstadoAsistencia>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> GuardarAsistenciaMasiva(DateTime fecha, int idUsuarioRegistro, DataTable dtDatos)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarAsistenciaDiariaMasiva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Fecha", fecha.Date);
                        cmd.Parameters.AddWithValue("@IdUsuarioRegistro", idUsuarioRegistro);

                        // El parámetro mágico DataTable (TVP)
                        SqlParameter tvpParam = new SqlParameter("@Datos", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_AsistenciaDiaria",
                            Value = dtDatos
                        };
                        cmd.Parameters.Add(tvpParam);

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
                if (resultadoCodigo == 1)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = "Asistencia guardada correctamente.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "No se pudo guardar la asistencia. Es posible que los datos estén corruptos.";
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

    }
}
