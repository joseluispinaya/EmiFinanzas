<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="PanelMaterias.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.PanelMaterias" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Materias
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-12">
        <div class="card shadow-sm h-100">
            
            <div class="card-header card-header-emi py-3 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title m-0 text-white">
                    <i class="fas fa-book-open mr-2"></i>Lista de Materias
                </h3>
                <button type="button" id="btnRegistro" class="btn btn-emi-warning btn-sm shadow-sm font-weight-bold">
                    <i class="fas fa-plus-circle mr-2"></i>Nueva Materia
                </button>
            </div>
            
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4 col-sm-6">
                        <div class="input-group input-group-sm shadow-sm">
                            <div class="input-group-prepend">
                                <label class="input-group-text bg-light font-weight-bold text-dark" for="cboSemestreData">
                                    <i class="fas fa-filter mr-1"></i> Semestre
                                </label>
                            </div>
                            <select class="custom-select custom-select-sm" id="cboSemestreData">
                                </select>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table id="tbData" class="table table-sm table-striped table-bordered table-hover w-100 align-middle">
                        <thead class="thead-light text-center">
                            <tr>
                                <th style="width: 50px;">Id</th>
                                <th class="text-left">Materia</th>
                                <th style="width: 80px;">Sigla</th>
                                <th style="width: 60px;" title="Horas Teóricas">Hrs. T</th>
                                <th style="width: 60px;" title="Horas Prácticas">Hrs. P</th>
                                <th style="width: 60px;" title="Horas Laboratorio">Hrs. L</th>
                                <th style="width: 60px;" title="Horas Semestre">Hrs. S</th>
                                <th style="width: 120px;">Semestre</th>
                                <th style="width: 100px;">Opciones</th>
                            </tr>
                        </thead>
                        <tbody class="text-center">
                            </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    </div>
</div>

    <div class="modal fade" id="mdData" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title m-0" id="myModalLabel">Materias</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">

                    <div class="form-row">
                        <div class="form-group col-sm-4">
                            <label for="txtNombre">Nombre Materia</label>
                            <input type="text" class="form-control input-sm form-new model" id="txtNombre" name="Nombre Materia">
                        </div>
                        <div class="form-group col-sm-4">
                            <label for="txtSigla">Siglas</label>
                            <input type="text" class="form-control input-sm form-new model" id="txtSigla" name="Sigla">
                        </div>
                        <div class="form-group col-sm-4">
                            <label for="cboSemestreModal">Semestre</label>
                            <select class="form-control form-control-sm form-new" id="cboSemestreModal">
                            </select>
                        </div>
                    </div>

                    <div class="row mt-2">
                        <div class="col-sm-4">
                            <div class="input-group input-group-sm mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="addon-ht" title="Horas Teóricas">HT</span>
                                </div>
                                <input type="number" class="form-control form-new model" id="txtHT" name="HT" min="0" value="0" aria-describedby="addon-ht">
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="input-group input-group-sm mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="addon-hp" title="Horas Prácticas">HP</span>
                                </div>
                                <input type="number" class="form-control form-new model" id="txtHP" name="HP" min="0" value="0" aria-describedby="addon-hp">
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="input-group input-group-sm mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="addon-hl" title="Horas de Laboratorio">HL</span>
                                </div>
                                <input type="number" class="form-control form-new model" id="txtHL" name="HL" min="0" value="0" aria-describedby="addon-hl">
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

    <script src="jsSecre/PanelMaterias.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
