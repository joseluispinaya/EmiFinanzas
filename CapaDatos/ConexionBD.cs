using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class ConexionBD
    {
        #region "PATRON SINGLETON"
        private static ConexionBD conexion = null;

        private ConexionBD() { }

        public static ConexionBD GetInstance()
        {
            if (conexion == null)
            {
                conexion = new ConexionBD();
            }
            return conexion;
        }
        #endregion

        public SqlConnection ConexionDB()
        {
            SqlConnection conexion = new SqlConnection
            {
                ConnectionString = "Data Source=.;Initial Catalog=LucasEmiBD;Integrated Security=True"
            };

            return conexion;
        }
    }
}
