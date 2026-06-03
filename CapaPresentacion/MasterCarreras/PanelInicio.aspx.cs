using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterCarreras
{
    public partial class PanelInicio : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)] // <--- OBLIGATORIO para poder borrarla
        public static Respuesta<bool> CerrarSesion()
        {
            try
            {
                HttpContext.Current.Session.Clear();

                HttpContext.Current.Session.Abandon();

                if (HttpContext.Current.Request.Cookies["ASP.NET_SessionId"] != null)
                {
                    HttpCookie myCookie = new HttpCookie("ASP.NET_SessionId")
                    {
                        Expires = DateTime.Now.AddDays(-1d)
                    };
                    HttpContext.Current.Response.Cookies.Add(myCookie);
                }

                return new Respuesta<bool>
                {
                    Estado = true,
                    Mensaje = "Sesión cerrada correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = ex.Message };
            }
        }
    }
}