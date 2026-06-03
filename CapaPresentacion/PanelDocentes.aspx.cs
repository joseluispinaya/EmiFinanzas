using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class PanelDocentes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EDocente>> FiltroDocentes(string busqueda)
        {
            return NDocente.GetInstance().FiltroDocentes(busqueda);
        }

        [WebMethod]
        public static Respuesta<List<EDocente>> ListaDocentePaginado(int Omitir, int TamanoPagina, string Buscar)
        {
            return NDocente.GetInstance().ListaDocentePaginado(Omitir, TamanoPagina, Buscar);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditDocentes(EDocente objeto, string base64Image)
        {
            try
            {
                var utilidades = Utilidadesj.GetInstance();

                // 1. Manejo de la foto
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/images/";
                        objeto.ImagenUrl = utilidades.UploadPhoto(stream, folder);
                    }
                }
                else
                {
                    // Si no hay foto nueva, enviamos vacío.
                    // Si es nuevo registro, guardará "". Si es edición, el SP conservará la foto antigua.
                    objeto.ImagenUrl = "";
                }

                return NDocente.GetInstance().GuardarOrEditDocentes(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }
    }
}