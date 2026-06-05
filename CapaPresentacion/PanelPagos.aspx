<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true" CodeBehind="PanelPagos.aspx.cs" Inherits="CapaPresentacion.PanelPagos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css" rel="stylesheet">
    <style>
        .modal .modal-dialog .modal-content {
            padding: 0 !important;
            border-radius: 0.3rem !important; /* Mantiene los bordes suavemente redondeados */
        }
        /* Puedes cambiar el código hexadecimal por el color que prefieras */
        /*.sweet-alert {
            background-color: #093374 !important;
        }*/
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Pagos Periodos
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">

        <div class="col-lg-3 col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <div class="card-header card-header-emi py-2 px-3">
                    <h5 class="card-title m-0 text-white"><i class="fas fa-info-circle mr-2"></i>Pagos</h5>
                </div>
                <div class="card-body text-center d-flex flex-column">
                    <div class="mb-2">
                        <i class="fas fa-money-check-alt fa-3x text-muted mb-3 opacity-50"></i>
                        <p class="text-muted text-justify" style="font-size: 0.85rem;">
                            Este módulo administra los periodos de pagos para docentes, incluyendo la creación de nuevos periodos, asignación de pagos a docentes y gestión de estados de pago.
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="cboGestionFiltro">Seleccione Gestion</label>
                        <select class="form-control form-control-sm form-new" id="cboGestionFiltro">
                        </select>
                    </div>

                    <div class="mt-auto">
                        <button type="button" id="btnNewRegistro" class="btn btn-emi-warning btn-block shadow-sm font-weight-bold">
                            <i class="fas fa-plus-circle mr-2"></i>Nuevo Periodo
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-md-8 mb-4">
            <div class="card shadow-sm h-100">
                <div class="card-header card-header-emi py-2 px-4">
                    <h3 class="card-title m-0 text-white"><i class="fas fa-money-check-alt mr-2"></i>Lista de Periodos</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table id="tbPeriodos" class="table table-sm table-striped table-bordered table-hover w-100">
                            <thead class="thead-light">
                                <tr>
                                    <th>Id</th>
                                    <th>Descripcion</th>
                                    <th class="text-center" style="width: 100px;">Inicio</th>
                                    <th class="text-center" style="width: 100px;">Fin</th>
                                    <th class="text-center" style="width: 100px;">Estado</th>
                                    <th class="text-center" style="width: 100px;">Opciones</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="modal fade" id="mdData" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg">

                <div class="modal-header card-header-emi py-2 px-3">
                    <h5 class="modal-title m-0 text-white"><i class="fas fa-calendar-alt mr-2"></i>
                        <span id="lblTituloModal">Periodo Pagos</span>
                    </h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body bg-light p-4">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Fecha Inicio</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="txtFechaInicio" readonly style="cursor: pointer;">
                                        <span class="input-group-addon bg-custom b-0"><i class="mdi mdi-calendar"></i></span>

                                    </div>
                                    <!-- input-group -->
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Fecha Fin</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="txtFechaFin" readonly style="cursor: pointer;">
                                        <span class="input-group-addon bg-custom b-0"><i class="mdi mdi-calendar"></i></span>

                                    </div>
                                    <!-- input-group -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="cboGestion">Gestion</label>
                                <select class="form-control form-control-sm form-new" id="cboGestion">
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="cboEstado">Estado</label>
                                <select class="form-control form-control-sm form-new" id="cboEstado">
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="txtDescripcion">Descripcion</label>
                        <input type="text" class="form-control input-sm form-new" id="txtDescripcion" name="Descripcion">
                    </div>
                </div>

                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-sm btn-warning" data-dismiss="modal"><i class="fas fa-times-circle mr-2"></i>Cerrar</button>
                    <button id="btnGuardarCambios" type="button" class="btn btn-sm btn-primary"><i class="fas fa-save mr-2"></i>Guardar Cambios</button>
                </div>

            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="assets/plugins/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="assets/plugins/datatables/dataTables.buttons.min.js"></script>
    <script src="assets/plugins/datatables/buttons.bootstrap4.min.js"></script>

    <script src="assets/plugins/datatables/jszip.min.js"></script>
    <script src="assets/plugins/datatables/pdfmake.min.js"></script>
    <script src="assets/plugins/datatables/vfs_fonts.js"></script>
    <script src="assets/plugins/datatables/buttons.html5.min.js"></script>
    <script src="assets/plugins/datatables/buttons.print.min.js"></script>
    <script src="assets/plugins/datatables/dataTables.fixedHeader.min.js"></script>
    <script src="assets/plugins/datatables/dataTables.keyTable.min.js"></script>
    <script src="assets/plugins/datatables/dataTables.scroller.min.js"></script>


    <script src="assets/plugins/datatables/dataTables.responsive.min.js"></script>
    <script src="assets/plugins/datatables/responsive.bootstrap4.min.js"></script>

    <script src="assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
    <script src="assets/plugins/bootstrap-datepicker/datepicker-es.js"></script>

    <script src="js/PanelPagos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
