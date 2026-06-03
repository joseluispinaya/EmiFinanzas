<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true" CodeBehind="PanelGrados.aspx.cs" Inherits="CapaPresentacion.PanelGrados" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Grados Academicos
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    
    <div class="col-lg-3 col-md-4 mb-4">
        <div class="card shadow-sm h-100">
            <div class="card-header card-header-emi py-2 px-3">
                <h5 class="card-title m-0 text-white"><i class="fas fa-info-circle mr-2"></i>Módulo</h5>
            </div>
            <div class="card-body text-center d-flex flex-column">
                <div class="mb-4">
                    <i class="fas fa-graduation-cap fa-3x text-muted mb-3 opacity-50"></i>
                    <p class="text-muted text-justify" style="font-size: 0.9rem;">
                        Este módulo administra los niveles de formación de la institución (Ej: Licenciatura, Técnico Superior). Cada carrera registrada posteriormente deberá pertenecer a uno de estos grados.
                    </p>
                </div>
                
                <div class="mt-auto">
                    <button type="button" id="btnRegistro" class="btn btn-emi-warning btn-block shadow-sm font-weight-bold">
                        <i class="fas fa-plus-circle mr-2"></i>Nuevo Grado
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-9 col-md-8 mb-4">
        <div class="card shadow-sm h-100">
            <div class="card-header card-header-emi py-2 px-4">
                <h3 class="card-title m-0 text-white"><i class="fas fa-bookmark mr-2"></i>Lista de Grados Académicos</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table id="tbGrados" class="table table-sm table-striped table-bordered table-hover w-100">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 50px;">Id</th>
                                <th>Nombre del Grado</th>
                                <th class="text-center" style="width: 120px;">Nro Carreras</th>
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

    <div class="modal fade" id="mdData" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title m-0" id="myModalLabel">Grados</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="txtNombre">Nombre Grado</label>
                        <input type="text" class="form-control input-sm form-new" id="txtNombre" name="Nombre Grado">
                    </div>
                    <div class="form-group">
                        <label for="cboEstado">Estado</label>
                        <select class="form-control form-control-sm form-new" id="cboEstado">
                            <option value="1">Activo</option>
                            <option value="0">No Activo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
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

    <script src="js/PanelGrados.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
