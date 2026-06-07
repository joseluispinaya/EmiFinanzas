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
    public class DUsuarios
    {
        #region "PATRON SINGLETON"
        private static DUsuarios conexion = null;

        private DUsuarios() { }

        public static DUsuarios GetInstance()
        {
            if (conexion == null)
            {
                conexion = new DUsuarios();
            }
            return conexion;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuarios oModel)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditUsuarios", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdUsuario", oModel.IdUsuario);
                        cmd.Parameters.AddWithValue("@IdRol", oModel.IdRol);
                        cmd.Parameters.AddWithValue("@IdCarrera", oModel.IdCarrera);
                        cmd.Parameters.AddWithValue("@Nombres", oModel.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", oModel.Apellidos);
                        cmd.Parameters.AddWithValue("@Correo", oModel.Correo);
                        // Usamos el operador de coalescencia nula (??) para simplificar
                        // cmd.Parameters.AddWithValue("@Clave", oModel.Clave ?? "");
                        // Blindaje contra nulos en la Clave (Si es Update, puede que venga nula. La mandamos vacía para que el SP la ignore)
                        cmd.Parameters.AddWithValue("@Clave", string.IsNullOrEmpty(oModel.Clave) ? "" : oModel.Clave);
                        cmd.Parameters.AddWithValue("@FotoUrl", string.IsNullOrEmpty(oModel.FotoUrl) ? "" : oModel.FotoUrl);
                        cmd.Parameters.AddWithValue("@Estado", oModel.Estado);
                        cmd.Parameters.AddWithValue("@NroCi", oModel.NroCi);

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
                        response.Mensaje = "El correo electrónico ya se encuentra registrado por otro usuario.";
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
                response.Mensaje = $"Error interno: {ex.Message}";
            }
            return response;
        }


        public Respuesta<EUsuarios> LoginUsuarioEmi(string Correo)
        {
            try
            {
                EUsuarios obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_LoginUsuario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@Correo", Correo);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new EUsuarios
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    IdCarrera = Convert.ToInt32(dr["IdCarrera"]),
                                    NombreCarrera = dr["NombreCarrera"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    Clave = dr["Clave"].ToString(),
                                    FotoUrl = dr["FotoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    NroCi = dr["NroCi"].ToString(),
                                    NombreRol = dr["NombreRol"].ToString()
                                };
                            }
                        }
                    }
                }

                return new Respuesta<EUsuarios>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Bienvenido usuario" : "Usuario o Contraseña incorrectos."
                };
            }
            catch (Exception)
            {
                return new Respuesta<EUsuarios>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error en el servidor. Intente más tarde.",
                    Data = null
                };
            }
        }

        public Respuesta<List<ERoles>> ListaRoles()
        {
            try
            {
                List<ERoles> rptLista = new List<ERoles>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaRoles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ERoles
                                {
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ERoles>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ERoles>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<UsuarioDTO>> ListaUsuarios()
        {
            try
            {
                List<UsuarioDTO> rptLista = new List<UsuarioDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaUsuarios", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new UsuarioDTO
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    IdCarrera = Convert.ToInt32(dr["IdCarrera"]),
                                    IdGradoAcademico = Convert.ToInt32(dr["IdGradoAcademico"]),
                                    NombreCarrera = dr["NombreCarrera"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    FotoUrl = dr["FotoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"]).ToString("dd/MM/yyyy")
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<UsuarioDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<UsuarioDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
