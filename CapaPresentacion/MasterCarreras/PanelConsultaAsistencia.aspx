<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="PanelConsultaAsistencia.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.PanelConsultaAsistencia" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/pluginzero/select2/select2.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Consulta de Asistencias
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow-sm border-0" id="loadinzero">

                <div class="card-header card-header-emi py-3 px-4">
                    <h3 class="card-title m-0 text-white">
                        <i class="fas fa-chalkboard-teacher mr-2"></i>Panel de Consulta de asistencia de docentes
                    </h3>
                </div>

                <div class="card-body">
                    <input id="txtIdDocente" value="0" type="hidden" />

                    <div class="row mb-4">

                        <div class="col-md-5 mb-3">
                            <div class="border rounded bg-light p-3 h-100 shadow-sm">
                                <div class="d-flex align-items-center mb-3">
                                    <img id="imgDoce" src="../images/sinImagen.png" alt="Perfil" class="rounded-circle shadow mr-3" style="width: 65px; height: 65px; object-fit: cover; border: 2px solid #004F9F;">
                                    <div>
                                        <h5 id="lblNombres" class="mb-1 text-dark font-weight-bold" style="font-size: 1.1rem;">Esperando..</h5>
                                        <span id="lblDatos" class="badge badge-secondary p-1 shadow-sm">Seleccione un docente</span>
                                    </div>
                                </div>
                                <hr class="mt-0">
                                <div class="form-group mb-0">
                                    <label for="cboBuscarDocente" class="small font-weight-bold text-muted mb-1">
                                        <i class="fas fa-search mr-1"></i>Buscar Docente
                                    </label>
                                    <select class="form-control form-control-sm" id="cboBuscarDocente" style="width: 100%;">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-7 mb-3">

                            <div class="bg-light p-3 rounded border shadow-sm mb-3">
                                <div class="row align-items-end">
                                    <div class="col-md-4">
                                        <label class="small font-weight-bold text-dark mb-1">Gestión</label>
                                        <div class="input-group input-group-sm shadow-sm">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-white"><i class="fas fa-calendar-alt text-primary"></i></span>
                                            </div>
                                            <select class="custom-select custom-select-sm" id="cboGestion"></select>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <label class="small font-weight-bold text-dark mb-1">Periodo de Pago</label>
                                        <div class="input-group input-group-sm shadow-sm">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-white"><i class="fas fa-calendar-check text-success"></i></span>
                                            </div>
                                            <select class="custom-select custom-select-sm" id="cboPeriodo" disabled>
                                                <option value="">Seleccione Gestión...</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <button type="button" id="btnBuscar" class="btn btn-sm btn-primary btn-block shadow-sm font-weight-bold">
                                            <i class="fas fa-search mr-2"></i>Buscar Asistencia
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="border rounded p-3 shadow-sm bg-white" style="border-left: 4px solid #ffc107 !important;">
                                <div class="d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="mb-2 mb-md-0">
                                        <h6 class="font-weight-bold text-dark m-0"><i class="fas fa-file-pdf text-danger mr-2"></i>Exportar Documento</h6>
                                        <small class="text-muted">Genera el reporte detallado del periodo para revisión o firma.</small>
                                    </div>
                                    <div>
                                        <button type="button" id="btnReporte" class="btn btn-emi-warning btn-sm shadow-sm font-weight-bold px-3" disabled>
                                            <i class="fas fa-print mr-2"></i>IMPRIMIR REPORTE
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr>

                    <div class="row mb-3" id="seccionMaterias" style="display: none;">
                        <div class="col-12">
                            <h6 class="font-weight-bold text-muted mb-2"><i class="fas fa-filter mr-2"></i>Filtrar por Materia:</h6>
                            <div id="contenedorMaterias" class="d-flex flex-wrap gap-2">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 mb-3">
                            <h5 class="font-weight-bold text-dark m-0 text-left border-bottom pb-2">
                                <i class="fas fa-clipboard-check mr-2 text-primary"></i>Resultados de la Búsqueda
                            </h5>
                        </div>

                        <div class="col-lg-3 col-md-4 mb-3">
                            <div class="bg-light p-3 rounded border shadow-sm h-100">
                                <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                                    <i class="fas fa-clock text-info mr-2"></i>Horario Base
                                </h6>

                                <div id="contenedorHorario" style="max-height: 450px; overflow-y: auto; overflow-x: hidden;">
                                    <div class="alert alert-secondary text-center py-4 mb-0 shadow-sm" style="font-size: 0.85rem;">
                                        <i class="fas fa-info-circle d-block mb-2" style="font-size: 1.5rem;"></i>
                                        Realice la búsqueda para visualizar el horario asignado.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-9 col-md-8 mb-3">
                            <div class="table-responsive h-100 bg-white p-2 border rounded shadow-sm">
                                <table id="tbDetalle" class="table table-sm table-striped table-bordered table-hover text-center align-middle m-0 w-100" style="font-size: 0.85rem;">
                                    <thead class="thead-light">
                                        <tr>
                                            <th class="text-left">Fecha</th>
                                            <th class="text-left">Materia</th>
                                            <th title="Hora Oficial de Entrada y Salida">Oficial (E - S)</th>
                                            <th title="Hora Real Marcada por el Docente">Marcado (E - S)</th>
                                            <th title="Minutos Totales de Atrasos">Atrasos</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="6" class="text-muted font-italic py-4">Sin datos para mostrar. Seleccione un periodo y presione "Buscar Asistencia".
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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

    <script src="../assets/pluginzero/select2/select2.min.js"></script>
    <script src="../assets/pluginzero/select2/es.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <script src="jsSecre/ConsultaAsistencia.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
