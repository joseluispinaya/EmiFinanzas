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
    public class DMaterias
    {
        #region "PATRON SINGLETON"
        private static DMaterias instancia = null;
        private DMaterias() { }
        public static DMaterias GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DMaterias();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<MateriasDTO>> ListaMateriasIds(int IdCarrera, int IdSemestre)
        {
            try
            {
                List<MateriasDTO> rptLista = new List<MateriasDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_MateriasPorCarreraYSemestre", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdCarrera", IdCarrera);
                        comando.Parameters.AddWithValue("@IdSemestre", IdSemestre);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new MateriasDTO
                                {
                                    IdMateria = Convert.ToInt32(dr["IdMateria"]),
                                    IdCarrera = Convert.ToInt32(dr["IdCarrera"]),
                                    IdSemestre = Convert.ToInt32(dr["IdSemestre"]),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    Sigla = dr["Sigla"].ToString(),

                                    HT = Convert.ToInt32(dr["HT"]),
                                    HP = Convert.ToInt32(dr["HP"]),
                                    HL = Convert.ToInt32(dr["HL"]),
                                    HS = Convert.ToInt32(dr["HS"]),
                                    IdGradoAcademico = Convert.ToInt32(dr["IdGradoAcademico"]),

                                    NombreCarrera = dr["NombreCarrera"].ToString(),
                                    NombreSemestre = dr["NombreSemestre"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<MateriasDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<MateriasDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarOrEditMateria(EMaterias objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarEditarMateria", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de entrada
                        cmd.Parameters.AddWithValue("@IdMateria", objeto.IdMateria);
                        cmd.Parameters.AddWithValue("@IdCarrera", objeto.IdCarrera);
                        cmd.Parameters.AddWithValue("@IdSemestre", objeto.IdSemestre);
                        cmd.Parameters.AddWithValue("@NombreMateria", objeto.NombreMateria);
                        cmd.Parameters.AddWithValue("@Sigla", objeto.Sigla);
                        cmd.Parameters.AddWithValue("@HT", objeto.HT);
                        cmd.Parameters.AddWithValue("@HP", objeto.HP);
                        cmd.Parameters.AddWithValue("@HL", objeto.HL);

                        // Parámetro de salida
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

                // Interpretación de códigos
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning"; // Ícono Amarillo
                        response.Mensaje = "Ya existe una materia con ese nombre asignada a una carrera";
                        break;

                    case 2:
                        response.Estado = true;
                        response.Valor = "success"; // Ícono Verde
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3:
                        response.Estado = true;
                        response.Valor = "success"; // Ícono Verde
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error"; // Ícono Rojo
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

        public Respuesta<int> EliminarMateria(int IdMateria)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_EliminarMateria", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de entrada
                        cmd.Parameters.AddWithValue("@IdMateria", IdMateria);

                        // Parámetro de salida
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

                // Interpretación de códigos
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Materia eliminada correctamente.";
                        break;

                    case 2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "No se puede eliminar la materia debido a relacion existente.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error"; // Ícono Rojo
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

        public Respuesta<List<ESemestres>> ListaSemestres()
        {
            try
            {
                List<ESemestres> rptLista = new List<ESemestres>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaSemestres", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ESemestres
                                {
                                    IdSemestre = Convert.ToInt32(dr["IdSemestre"]),
                                    NombreSemestre = dr["NombreSemestre"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ESemestres>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ESemestres>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

    }
}
