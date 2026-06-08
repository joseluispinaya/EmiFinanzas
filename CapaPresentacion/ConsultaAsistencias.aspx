<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true" CodeBehind="ConsultaAsistencias.aspx.cs" Inherits="CapaPresentacion.ConsultaAsistencias" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/pluginzero/select2/select2.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Forzar el tamaño de letra en los encabezados de la tabla Planilla */
        #tbDetalle thead th {
            font-size: 12px !important; /* Puedes probar con 11px o 12px según veas mejor */
            vertical-align: middle !important;
            /*padding: 8px 4px;*/
        }
        .modal .modal-dialog .modal-content {
            padding: 0 !important;
            border-radius: 0.3rem !important; /* Mantiene los bordes suavemente redondeados */
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Consultas
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-12">
        <div class="card shadow-sm border-0" id="loadinzero">

            <div class="card-header card-header-emi py-3 px-4">
                <h4 class="card-title m-0 text-white font-weight-bold">
                    <i class="fas fa-chalkboard-teacher mr-2"></i>Consulta y Corrección de Asistencia
                </h4>
            </div>

            <div class="card-body">
                <input id="txtIdDocente" value="0" type="hidden" />

                <div class="row mb-4">
                    <div class="col-md-5 mb-3">
                        <div class="card border-0 shadow-sm h-100 bg-light">
                            <div class="card-body p-3">
                                <%--<h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                                    <i class="fas fa-filter text-primary mr-2"></i>Criterios de Búsqueda
                                </h6>--%>

                                <div class="row">
                                    <div class="col-md-6 form-group mb-2">
                                        <label class="small font-weight-bold text-muted mb-1">Grado Académico</label>
                                        <select class="custom-select custom-select-sm shadow-sm border-0" id="cboGrados"></select>
                                    </div>
                                    <div class="col-md-6 form-group mb-2">
                                        <label class="small font-weight-bold text-muted mb-1">Carrera</label>
                                        <select class="custom-select custom-select-sm shadow-sm border-0" id="cboCarreras" disabled>
                                            <option value="">Seleccione Grado...</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group mb-3">
                                    <label for="cboBuscarDocente" class="small font-weight-bold text-muted mb-1">
                                        <i class="fas fa-search mr-1"></i>Buscar Docente
                                    </label>
                                    <select class="form-control form-control-sm shadow-sm" id="cboBuscarDocente" style="width: 100%;" disabled>
                                        <option value=""></option>
                                    </select>
                                </div>

                                <div class="row align-items-end">
                                    <div class="col-md-6 form-group mb-0">
                                        <label class="small font-weight-bold text-muted mb-1">Gestión</label>
                                        <select class="custom-select custom-select-sm shadow-sm border-0" id="cboGestion"></select>
                                    </div>
                                    <div class="col-md-6 form-group mb-0">
                                        <label class="small font-weight-bold text-muted mb-1">Periodo de Pago</label>
                                        <select class="custom-select custom-select-sm shadow-sm border-0" id="cboPeriodo" disabled>
                                            <option value="">Seleccione Gestión...</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="button" id="btnBuscar" class="btn btn-primary btn-block shadow-sm font-weight-bold mt-3">
                                    <i class="fas fa-search mr-2"></i>Consultar Asistencia
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-7 mb-3">
                        <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #004F9F !important;">
                            <div class="card-body d-flex flex-column justify-content-center p-4">
                                
                                <div class="d-flex align-items-center mb-4">
                                    <img id="imgDoce" src="images/sinImagen.png" alt="Perfil" class="rounded-circle shadow-sm mr-4" style="width: 90px; height: 90px; object-fit: cover; border: 3px solid #e9ecef;">
                                    <div>
                                        <span id="lblDatos" class="badge badge-secondary px-2 py-1 shadow-sm mb-1">Seleccione un docente</span>
                                        <h4 id="lblNombres" class="mb-1 text-dark font-weight-bold">Esperando selección...</h4>
                                        <p class="text-muted small m-0"><i class="fas fa-id-card mr-1"></i>Información del perfil docente.</p>
                                    </div>
                                </div>

                                <div class="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="font-weight-bold text-dark m-0"><i class="fas fa-file-pdf text-danger mr-2"></i>Exportar Documento</h6>
                                        <small class="text-muted">Genera el reporte detallado del periodo.</small>
                                    </div>
                                    <button type="button" id="btnReporte" class="btn btn-warning btn-sm shadow-sm font-weight-bold text-dark px-4" disabled>
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
                        <div id="contenedorMaterias" class="d-flex flex-wrap gap-2"></div>
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
                                    Realice la búsqueda para visualizar el horario.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-9 col-md-8 mb-3">
                        <div class="table-responsive h-100 bg-white p-2 border rounded shadow-sm">
                            <table id="tbDetalle" class="table table-sm table-striped table-bordered table-hover text-center align-middle m-0 w-100" style="font-size: 0.8rem;">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="text-left">Fecha</th>
                                        <th class="text-left">Materia</th>
                                        <th title="Hora Oficial">Oficial (E - S)</th>
                                        <th title="Hora Real Marcada">Marcado (E - S)</th>
                                        <th>Atrasos</th>
                                        <th>Estado</th>
                                        <th>Opción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="7" class="text-muted font-italic py-4">Sin datos para mostrar. Seleccione un periodo y presione "Consultar Asistencia".</td>
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

    <div class="modal fade" id="modalEditarAsistencia" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-primary text-white py-2 px-3">
                    <h5 class="modal-title m-0 font-weight-bold text-white"><i class="fas fa-edit mr-2"></i>Corregir Registro de Asistencia</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body bg-light p-4">

                    <input type="hidden" id="txtIdAsistenciaMod" value="0" />
                    <input type="hidden" id="txtHoraEntradaOficialMod" value="" />
                    <input type="hidden" id="txtHoraSalidaOficialMod" value="" />

                    <div class="alert alert-info py-2 shadow-sm mb-3">
                        <strong id="lblFechaMod" class="d-block mb-1">Fecha: --/--/----</strong>
                        <span id="lblMateriaMod" class="small">Materia...</span>
                    </div>

                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label class="font-weight-bold small text-muted">Estado Actual</label>
                            <select class="custom-select custom-select-sm shadow-sm font-weight-bold" id="cboEstadoMod">
                            </select>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="font-weight-bold small text-muted">Hora Marcada (Ingreso)</label>
                            <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary shadow-sm" id="txtIngresoMod">
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="font-weight-bold small text-muted">Hora Marcada (Salida)</label>
                            <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary shadow-sm" id="txtSalidaMod">
                        </div>

                        <div class="col-md-12">
                            <label class="font-weight-bold small text-danger">Total Atraso / Penalización (Min)</label>
                            <input type="number" class="form-control form-control-sm text-center font-weight-bold text-danger bg-white shadow-sm" id="txtAtrasoMod" readonly>
                        </div>
                    </div>

                </div>
                <div class="modal-footer bg-white">
                    <button type="button" class="btn btn-secondary font-weight-bold" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success font-weight-bold" id="btnGuardarModificacion"><i class="fas fa-save mr-2"></i>Guardar Cambios</button>
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
    <script src="assets/pluginzero/select2/select2.min.js"></script>
    <script src="assets/pluginzero/select2/es.min.js"></script>

    <script src="js/ConsultaAsistencias.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
