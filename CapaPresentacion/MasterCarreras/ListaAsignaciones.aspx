<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="ListaAsignaciones.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.ListaAsignaciones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <style>
        .modal .modal-dialog .modal-content {
            padding: 0 !important;
            border-radius: 0.3rem !important; /* Mantiene los bordes suavemente redondeados */
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow-sm h-100" id="loadinzero">

                <div class="card-header card-header-emi py-3 px-4 d-flex justify-content-between align-items-center">
                    <h3 class="card-title m-0 text-white">
                        <i class="fas fa-chalkboard-teacher mr-2"></i>Asignaciones de la Gestión Actual
                    </h3>
                    <a href="AsignacionDocente.aspx" class="btn btn-emi-warning btn-sm shadow-sm font-weight-bold">
                        <i class="fas fa-plus-circle mr-2"></i>Nueva Asignación
                    </a>
                </div>

                <div class="card-body">
                    <%--<div class="row justify-content-center mb-4">
                        <button type="button" id="btnRegistro" class="btn btn-emi-warning btn-lg px-5 shadow font-weight-bold"><i class="fas fa-user-plus mr-2"></i>Nuevo Registro</button>
                    </div>--%>

                    <div class="table-responsive">
                        <table id="tbAsignaciones" class="table table-sm table-striped table-bordered table-hover w-100 align-middle">
                            <thead class="thead-light text-center">
                                <tr>
                                    <th>Id</th>
                                    <th class="text-left">Perfil del Docente</th>
                                    <th class="text-left">Datos Académicos</th>
                                    <th style="width: 140px;">Costos y Horas</th>
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

    <div class="modal fade" id="modalHorarios" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg">

                <div class="modal-header card-header-emi py-2 px-3">
                    <h5 class="modal-title m-0 text-white"><i class="fas fa-calendar-alt mr-2"></i>Horarios Programados</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body bg-light p-4">
                    <div class="bg-light text-center mb-4">
                        <h6 id="lblModalDocente" class="font-weight-bold text-dark mb-1" style="font-size: 0.95rem;">Cargando Docente...</h6>
                        <span id="lblModalMateria" class="badge badge-primary px-2 py-1 shadow-sm">Cargando Materia...</span>
                    </div>

                    <div class="table-responsive bg-white rounded border shadow-sm">
                        <table id="tbDetalleHorarios" class="table table-sm table-bordered text-center m-0" width="100%">
                            <thead class="thead-light">
                                <tr>
                                    <th><i class="fas fa-calendar-day mr-1"></i>Día</th>
                                    <th><i class="fas fa-hourglass-start mr-1"></i>Inicio</th>
                                    <th><i class="fas fa-hourglass-end mr-1"></i>Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <%--<tr>
                                    <td colspan="3" class="text-muted">Cargando horarios...</td>
                                </tr>--%>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-sm btn-secondary font-weight-bold shadow-sm" data-dismiss="modal">
                        <i class="fas fa-times-circle mr-1"></i>Cerrar
                    </button>
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

    <script src="jsSecre/ListaAsignacion.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
