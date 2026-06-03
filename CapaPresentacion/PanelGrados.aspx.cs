using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class PanelGrados : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EGradoAcademico>> ListaGradosAcademicos()
        {
            return NGradoAcademico.GetInstance().ListaGradosAcademicos();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditGradoAcademicos(EGradoAcademico objeto)
        {
            return NGradoAcademico.GetInstance().GuardarOrEditGradoAcademicos(objeto);
        }
    }
}