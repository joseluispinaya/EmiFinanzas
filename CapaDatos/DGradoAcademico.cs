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
    public class DGradoAcademico
    {
        #region "PATRON SINGLETON"
        private static DGradoAcademico instancia = null;
        private DGradoAcademico() { }
        public static DGradoAcademico GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DGradoAcademico();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EGradoAcademico>> ListaGradosAcademicos()
        {
            try
            {
                List<EGradoAcademico> rptLista = new List<EGradoAcademico>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerGradoAcadConteo", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EGradoAcademico()
                                {
                                    IdGradoAcademico = Convert.ToInt32(dr["IdGradoAcademico"]),
                                    GradoAcademico = dr["GradoAcademico"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    NroCarreras = Convert.ToInt32(dr["NroCarreras"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EGradoAcademico>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EGradoAcademico>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista de grados académicos: {ex.Message}"
                };
            }
        }

        public Respuesta<int> GuardarOrEditGradoAcademicos(EGradoAcademico oGradoAcademico)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditGradoAcademicos", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdGradoAcademico", oGradoAcademico.IdGradoAcademico);
                        cmd.Parameters.AddWithValue("@GradoAcademico", oGradoAcademico.GradoAcademico);
                        cmd.Parameters.AddWithValue("@Estado", oGradoAcademico.Estado);

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

                // Asignamos el código numérico a Data (por si se necesita lógica extra)
                response.Data = resultadoCodigo;

                switch (resultadoCodigo)
                {
                    case 1: // Duplicado
                        response.Estado = false;
                        response.Valor = "warning"; // <--- Usamos Valor para el icono AMARILLO
                        response.Mensaje = "El nombre del Grado Académico ya existe.";
                        break;

                    case 2: // Registro Nuevo
                        response.Estado = true;
                        response.Valor = "success"; // <--- Usamos Valor para el icono VERDE
                        response.Mensaje = "Grado Académico registrado correctamente.";
                        break;

                    case 3: // Actualización
                        response.Estado = true;
                        response.Valor = "success"; // <--- Usamos Valor para el icono VERDE
                        response.Mensaje = "Grado Académico actualizado correctamente.";
                        break;

                    case 0: // Error
                    default:
                        response.Estado = false;
                        response.Valor = "error"; // <--- Usamos Valor para el icono ROJO
                        response.Mensaje = "No se pudo completar la operación.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Data = 0;
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<EGestiones>> ListaGestiones()
        {
            try
            {
                List<EGestiones> rptLista = new List<EGestiones>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaGestiones", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EGestiones()
                                {
                                    IdGestion = Convert.ToInt32(dr["IdGestion"]),
                                    NombreGestion = dr["NombreGestion"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EGestiones>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EGestiones>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista de grados académicos: {ex.Message}"
                };
            }
        }

        public Respuesta<List<EGrupos>> ListaGrupos()
        {
            try
            {
                List<EGrupos> rptLista = new List<EGrupos>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaGrupos", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EGrupos()
                                {
                                    IdGrupo = Convert.ToInt32(dr["IdGrupo"]),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EGrupos>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EGrupos>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }
    }
}
