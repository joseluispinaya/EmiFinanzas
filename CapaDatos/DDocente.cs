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
    public class DDocente
    {
        #region "PATRON SINGLETON"
        private static DDocente instancia = null;
        private DDocente() { }
        public static DDocente GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DDocente();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditDocentes(EDocente oModel)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditDocente", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdDocente", oModel.IdDocente);
                        cmd.Parameters.AddWithValue("@Nombres", oModel.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", oModel.Apellidos);
                        cmd.Parameters.AddWithValue("@CI", oModel.CI);
                        cmd.Parameters.AddWithValue("@Celular", oModel.Celular);
                        cmd.Parameters.AddWithValue("@Profesion", oModel.Profesion);
                        cmd.Parameters.AddWithValue("@NroNit", oModel.NroNit);
                        cmd.Parameters.AddWithValue("@ImagenUrl", string.IsNullOrEmpty(oModel.ImagenUrl) ? "" : oModel.ImagenUrl);
                        cmd.Parameters.AddWithValue("@CuentaBancaria", oModel.CuentaBancaria);
                        cmd.Parameters.AddWithValue("@Estado", oModel.Estado);

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
                switch (resultadoCodigo)
                {
                    case 1: // Duplicado
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El nro de CI o el Nro Nit ya existe.";
                        break;

                    case 2: // Registro Nuevo
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3: // Actualización
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0: // Error
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = $"Error al guardar o editar: {ex.Message}";
            }
            return response;
        }

        public Respuesta<List<EDocente>> ListaDocentePaginado(int Omitir, int TamanoPagina, string Buscar)
        {
            try
            {
                List<EDocente> rptLista = new List<EDocente>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarDocentesPaginado", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Omitir", Omitir);
                        cmd.Parameters.AddWithValue("@TamanoPagina", TamanoPagina);
                        // Si Buscar es null, mandamos cadena vacía para evitar errores en SQL
                        cmd.Parameters.AddWithValue("@Buscar", Buscar ?? "");

                        //cmd.Parameters.AddWithValue("@Buscar", Buscar);
                        con.Open();

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EDocente
                                {
                                    IdDocente = Convert.ToInt32(dr["IdDocente"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    CI = dr["CI"].ToString(),

                                    // Validación para campos NULL en la base de datos
                                    //Celular = dr["Celular"] != DBNull.Value ? dr["Celular"].ToString() : "",

                                    Celular = dr["Celular"].ToString(),
                                    Profesion = dr["Profesion"].ToString(),
                                    NroNit = dr["NroNit"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString(),
                                    CuentaBancaria = dr["CuentaBancaria"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    // Mapeo de los campos de paginación
                                    TotalRegistros = Convert.ToInt32(dr["TotalRegistros"]),
                                    TotalFiltrados = Convert.ToInt32(dr["TotalFiltrados"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EDocente>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EDocente>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<EDocente>> FiltroDocentes(string Busqueda)
        {
            try
            {
                List<EDocente> rptLista = new List<EDocente>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_FiltroDocentes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@Busqueda", Busqueda);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EDocente
                                {
                                    IdDocente = Convert.ToInt32(dr["IdDocente"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    ImagenUrl = dr["ImagenUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EDocente>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EDocente>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
