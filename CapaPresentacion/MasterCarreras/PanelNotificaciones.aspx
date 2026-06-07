<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="PanelNotificaciones.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.PanelNotificaciones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Notificaciones
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-3 col-md-4 mb-4">
            <div class="card shadow-sm h-100 border-0">
                <div class="card-header bg-dark py-3 px-3 rounded-top">
                    <h6 class="card-title m-0 text-white font-weight-bold">
                        <i class="fas fa-filter mr-2 text-warning"></i>Filtro de Búsqueda
                    </h6>
                </div>
                <div class="card-body bg-light d-flex flex-column">
                    <div class="text-center mb-4 mt-2">
                        <div class="icon-circle bg-white shadow-sm mx-auto mb-3" style="width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-money-check-alt fa-2x text-primary opacity-75"></i>
                        </div>
                        <p class="text-muted small px-2">
                            Seleccione una gestión académica para visualizar el historial de planillas generadas y su estado de aprobación.
                        </p>
                    </div>

                    <div class="form-group mt-auto mb-2">
                        <label for="cboGestion" class="font-weight-bold text-dark small"><i class="fas fa-calendar-alt mr-1"></i>Gestión Académica</label>
                        <select class="custom-select custom-select-sm shadow-sm border-primary" id="cboGestion">
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-md-8 mb-4">
            <div class="card shadow-sm h-100 border-0">
                <div class="card-header card-header-emi py-3 px-4">
                    <h5 class="card-title m-0 text-white font-weight-bold">
                        <i class="fas fa-folder-open mr-2"></i>Historial de Planillas
                    </h5>
                </div>
                <div class="card-body p-3">
                    <div class="table-responsive">
                        <table id="tbData" class="table table-sm table-striped table-bordered table-hover w-100 text-center align-middle" style="font-size: 0.85rem;">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-left">Nro Pago</th>
                                    <th>Nro Semanas</th>
                                    <th>Generado</th>
                                    <th>Estado Actual</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="5" class="text-muted font-italic py-4">Seleccione una gestión para cargar las planillas.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/plugins/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/plugins/datatables/dataTables.buttons.min.js"></script>
    <script src="../assets/plugins/datatables/buttons.bootstrap4.min.js"></script>

    <script src="../assets/plugins/datatables/jszip.min.js"></script>
    <script src="../assets/plugins/datatables/pdfmake.min.js"></script>
    <script src="../assets/plugins/datatables/vfs_fonts.js"></script>
    <script src="../assets/plugins/datatables/buttons.html5.min.js"></script>
    <script src="../assets/plugins/datatables/buttons.print.min.js"></script>
    <script src="../assets/plugins/datatables/dataTables.fixedHeader.min.js"></script>
    <script src="../assets/plugins/datatables/dataTables.keyTable.min.js"></script>
    <script src="../assets/plugins/datatables/dataTables.scroller.min.js"></script>


    <script src="../assets/plugins/datatables/dataTables.responsive.min.js"></script>
    <script src="../assets/plugins/datatables/responsive.bootstrap4.min.js"></script>

    <script src="jsSecre/PanelNotificaciones.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
