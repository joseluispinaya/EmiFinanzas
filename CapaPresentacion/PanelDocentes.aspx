<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true" CodeBehind="PanelDocentes.aspx.cs" Inherits="CapaPresentacion.PanelDocentes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/inpfile.css" rel="stylesheet"/>
    <style>
        .est-perfil {
            width: 125px;
            height: 125px;
            object-fit: contain;
            object-position: center; /* Asegura que se vea el centro de la foto */
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel Docentes
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-12">
        <div class="card shadow-sm h-100">
            
            <div class="card-header card-header-emi py-3 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title m-0 text-white">
                    <i class="fas fa-chalkboard-teacher mr-2"></i>Plantel Docente
                </h3>
                
                <button type="button" id="btnRegistro" class="btn btn-emi-warning btn-sm shadow-sm font-weight-bold">
                    <i class="fas fa-user-plus mr-2"></i>Nuevo Docente
                </button>
            </div>
            
            <div class="card-body">
                <div class="table-responsive">
                    <table id="tbDatas" class="table table-sm table-striped table-bordered table-hover w-100">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 50px;">Id</th>
                                <th class="text-center" style="width: 60px;">Foto</th>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th style="width: 100px;">Nro CI</th>
                                <th style="width: 120px;">Nro NIT</th>
                                <th class="text-center" style="width: 90px;">Estado</th>
                                <th class="text-center" style="width: 100px;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    </div>
</div>

        <div class="modal fade" id="mdData" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title m-0" id="myModalLabel">Docentes</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="form-row">
                                <div class="form-group col-sm-6">
                                    <label for="txtNombres">Nombre</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtNombres" name="Nombres">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="txtApellidos">Apellidos</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtApellidos" name="Apellidos">
                                </div>
                                <!-- <div class="form-group col-sm-4">
                                    <label for="txtCorreo">Correo</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtCorreo" name="Correo">
                                </div> -->
                            </div>
                            <div class="form-row">
                                <div class="form-group col-sm-4">
                                    <label for="txtNroci">Nro CI</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtNroci" name="Nro ci">
                                </div>
                                <div class="form-group col-sm-4">
                                    <label for="txtCelular">Celular</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtCelular" name="Celular">
                                </div>
                                <div class="form-group col-sm-4">
                                    <label for="txtNroNit">Nro Nit</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtNroNit" name="Nro Nit">
                                </div>

                            </div>
                            <div class="form-row">
                                <div class="form-group col-sm-4">
                                    <label for="txtProfesion">Profesion</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtProfesion" name="Profesion">
                                </div>
                                <div class="form-group col-sm-4">
                                    <label for="txtCuentaBan">Nro Cuenta</label>
                                    <input type="text" class="form-control input-sm form-new model" id="txtCuentaBan" name="Nro Cuenta">
                                </div>
                                <div class="form-group col-sm-4">
                                    <label for="cboEstado">Estado</label>
                                    <select class="form-control form-control-sm form-new" id="cboEstado">
                                        <option value="1">Activo</option>
                                        <option value="0">No Activo</option>
                                    </select>
                                </div>

                            </div>
                            <div class="form-group">
                                <label for="txtApelocs">Seleccione Foto</label>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="txtFotoUr" accept="image/*">
                                    <label class="custom-file-label" for="txtFotoUr">Ningún archivo seleccionado</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-row h-100 d-flex align-items-center justify-content-center">
                                <div class="form-group col-sm-12 text-center">
                                    <img id="imgDocenReg" src="images/sinImagen.png" alt="Foto usuario" class="rounded-circle est-perfil">
                                </div>
                            </div>
                        </div>
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

    <script src="js/PanelDocentes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
