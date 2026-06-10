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
    public class DPagosPlanilla
    {
        #region "PATRON SINGLETON"
        private static DPagosPlanilla instancia = null;
        private DPagosPlanilla() { }
        public static DPagosPlanilla GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DPagosPlanilla();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EPeriodoPago>> ObtenerPeriodosPago(int IdGestion)
        {
            try
            {
                List<EPeriodoPago> rptLista = new List<EPeriodoPago>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaPeriodosPago", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdGestion", IdGestion);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EPeriodoPago
                                {
                                    IdPeriodo = Convert.ToInt32(dr["IdPeriodo"]),
                                    IdGestion = Convert.ToInt32(dr["IdGestion"]),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    FechaInicio = Convert.ToDateTime(dr["FechaInicio"]).ToString("dd/MM/yyyy"),
                                    FechaFin = Convert.ToDateTime(dr["FechaFin"]).ToString("dd/MM/yyyy"),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EPeriodoPago>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "periodos de pago obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EPeriodoPago>>()
                {
                    Estado = false,
                    Mensaje = $"Error al obtener la lista de periodos de pago: {ex.Message}",
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarOrEditPeriodoPago(EPeriodoPago objeto, DateTime FechaInicio, DateTime FechaFin)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditPeriodoPago", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de entrada
                        cmd.Parameters.AddWithValue("@IdPeriodo", objeto.IdPeriodo);
                        cmd.Parameters.AddWithValue("@IdGestion", objeto.IdGestion);
                        cmd.Parameters.AddWithValue("@Descripcion", objeto.Descripcion);
                        cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                        cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

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
                        response.Mensaje = "Ya existe un periodo de pago con esa descripción en la gestión seleccionada.";
                        break;

                    case 2:
                        response.Estado = true;
                        response.Valor = "success"; // Ícono Verde
                        response.Mensaje = "Periodo de pago registrado correctamente.";
                        break;

                    case 3:
                        response.Estado = true;
                        response.Valor = "success"; // Ícono Verde
                        response.Mensaje = "Periodo de pago actualizado correctamente.";
                        break;

                    case 4:
                        response.Estado = false;
                        response.Valor = "warning"; // Ícono Amarillo
                        response.Mensaje = "Fechas incorrectas: La fecha de inicio debe ser anterior a la fecha de fin.";
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

        public Respuesta<List<DatosParaPlanillaDTO>> ObtenerDatosParaGenerarPlanilla(int idCarrera, int idGestion, int idPeriodo)
        {
            try
            {
                List<DatosParaPlanillaDTO> rptLista = new List<DatosParaPlanillaDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerDatosParaGenerarPlanilla", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        comando.Parameters.AddWithValue("@IdGestion", idGestion);
                        comando.Parameters.AddWithValue("@IdPeriodo", idPeriodo); // Antes era IdMes

                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new DatosParaPlanillaDTO
                                {
                                    IdAsignacion = Convert.ToInt32(dr["IdAsignacion"]),
                                    Docente = dr["Docente"].ToString(),
                                    NombreMateria = dr["NombreMateria"].ToString(),
                                    NombreGrupo = dr["NombreGrupo"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    HT = Convert.ToInt32(dr["HT"]),
                                    HP = Convert.ToInt32(dr["HP"]),
                                    HL = Convert.ToInt32(dr["HL"]),
                                    CostoHora = Convert.ToDecimal(dr["CostoHora"]),
                                    TotalMinutosAtraso = Convert.ToInt32(dr["TotalMinutosAtraso"])
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<DatosParaPlanillaDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Datos obtenidos correctamente para el cálculo."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DatosParaPlanillaDTO>>()
                {
                    Estado = false,
                    Mensaje = "Error en BD al obtener datos: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarPlanillaCompleta(int idCarrera, int idGestion, int idPeriodo, int semanasMes, int idUsuarioRegistro, DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarPlanillaCompleta", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros Cabecera
                        cmd.Parameters.AddWithValue("@IdCarrera", idCarrera);
                        cmd.Parameters.AddWithValue("@IdGestion", idGestion);
                        cmd.Parameters.AddWithValue("@IdPeriodo", idPeriodo);
                        cmd.Parameters.AddWithValue("@SemanasMes", semanasMes);
                        cmd.Parameters.AddWithValue("@IdUsuarioRegistro", idUsuarioRegistro);

                        // Parámetro Detalle (TVP: Table-Valued Parameter)
                        SqlParameter tvpParam = new SqlParameter("@Detalles", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_PlanillaDetalle",
                            Value = dtDetalles
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

                // Interpretamos los códigos de tu SP
                if (resultadoCodigo == 1)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = "La planilla se guardó correctamente y está En Revisión.";
                }
                else if (resultadoCodigo == 2)
                {
                    response.Estado = false;
                    response.Valor = "warning";
                    response.Mensaje = "No se puede guardar. Ya existe una planilla generada para esta Gestión y Periodo.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "Ocurrió un error interno al intentar guardar la planilla.";
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

        // 2. OBTENER CABECERA DE LA PLANILLA (Página de recalcular)
        public Respuesta<PlanillaCabeceraRecalcularDTO> DetallePlanillaCabeceraPorId(int idPlanilla)
        {
            try
            {
                PlanillaCabeceraRecalcularDTO cabecera = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_PlanillaCabeceraPorIdRecalcular", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPlanilla", idPlanilla);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                cabecera = new PlanillaCabeceraRecalcularDTO
                                {
                                    IdPlanilla = Convert.ToInt32(dr["IdPlanilla"]),
                                    IdGestion = Convert.ToInt32(dr["IdGestion"]),
                                    IdPeriodo = Convert.ToInt32(dr["IdPeriodo"]),
                                    NombreGestion = dr["NombreGestion"].ToString(),
                                    PeriodoPago = dr["PeriodoPago"].ToString(),
                                    SemanasMes = Convert.ToInt32(dr["SemanasMes"]),
                                    FechaCreacion = dr["FechaCreacion"].ToString(),
                                    EstadoPlanilla = dr["EstadoPlanilla"].ToString(),
                                    IdEstadoPlanilla = Convert.ToInt32(dr["IdEstadoPlanilla"]),
                                    UsuarioRegistro = dr["UsuarioRegistro"].ToString(),
                                    ComentarioAuditoria = dr["ComentarioAuditoria"].ToString()
                                };
                            }
                        }
                    }
                }

                if (cabecera != null)
                    return new Respuesta<PlanillaCabeceraRecalcularDTO> { Estado = true, Data = cabecera };
                else
                    return new Respuesta<PlanillaCabeceraRecalcularDTO> { Estado = false, Mensaje = "No se encontró la planilla." };
            }
            catch (Exception ex)
            {
                return new Respuesta<PlanillaCabeceraRecalcularDTO> { Estado = false, Mensaje = "Error BD: " + ex.Message };
            }
        }

        public Respuesta<int> RecalcularPlanilla(int idPlanilla, int semanasMes, int idUsuarioRegistro, DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RecalcularPlanilla", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros Cabecera
                        cmd.Parameters.AddWithValue("@IdPlanilla", idPlanilla);
                        cmd.Parameters.AddWithValue("@SemanasMes", semanasMes);
                        cmd.Parameters.AddWithValue("@IdUsuarioRegistro", idUsuarioRegistro);

                        // Parámetro Detalle (TVP: Table-Valued Parameter)
                        SqlParameter tvpParam = new SqlParameter("@Detalles", SqlDbType.Structured)
                        {
                            TypeName = "dbo.typ_PlanillaDetalle",
                            Value = dtDetalles
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

                // Interpretamos los códigos de tu SP
                if (resultadoCodigo == 1)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = "Planilla recalculada y enviada a revisión correctamente.";
                }
                else if (resultadoCodigo == 2)
                {
                    response.Estado = false;
                    response.Valor = "warning";
                    response.Mensaje = "La planilla no se puede recalcular porque no está en estado 'Rechazado'.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "Ocurrió un error en la base de datos al recalcular la planilla.";
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

        public Respuesta<CabeceraReporteDocenteDTO> ObtenerDetallePlanillaCabeceraReporte(int idDetalle)
        {
            var response = new Respuesta<CabeceraReporteDocenteDTO>();

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_DetallePlanillaCabeceraReporte", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdDetalle", idDetalle);

                        con.Open();
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            // Usamos un simple 'if' porque solo esperamos un registro
                            if (dr.Read())
                            {
                                response.Data = new CabeceraReporteDocenteDTO
                                {
                                    Docente = dr["Docente"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    NombreGestion = dr["NombreGestion"].ToString(),
                                    NombreCarrera = dr["NombreCarrera"].ToString(),
                                    PeriodoPago = dr["PeriodoPago"].ToString(),
                                    SemanasMes = Convert.ToInt32(dr["SemanasMes"]),
                                    FechaInicio = dr["FechaInicio"].ToString(),
                                    FechaFin = dr["FechaFin"].ToString()
                                };

                                response.Estado = true;
                                response.Valor = "success";
                                response.Mensaje = "Datos de cabecera obtenidos correctamente.";
                            }
                            else
                            {
                                response.Estado = false;
                                response.Valor = "warning";
                                response.Mensaje = "No se encontraron los datos de la cabecera para este reporte.";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error BD (Reporte Cabecera): " + ex.Message;
            }

            return response;
        }

    }
}
