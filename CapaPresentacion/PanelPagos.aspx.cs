using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class PanelPagos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EPeriodoPago>> ObtenerPeriodosPago(int IdGestion)
        {
            return NPagosPlanilla.GetInstance().ObtenerPeriodosPago(IdGestion);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditPeriodoPago(EPeriodoPago objeto)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.FechaInicio, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaInicio))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                if (!DateTime.TryParseExact(objeto.FechaFin, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaFin))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 3. Si todo está perfecto, enviamos a la capa de datos
                return NPagosPlanilla.GetInstance().GuardarOrEditPeriodoPago(objeto, fechaInicio, fechaFin);
            }
            catch (Exception ex)
            {
                // Esto solo saltará si se cae la base de datos o hay un error grave en la memoria
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}