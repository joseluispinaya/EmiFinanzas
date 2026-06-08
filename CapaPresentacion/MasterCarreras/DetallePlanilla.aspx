<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="DetallePlanilla.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.DetallePlanilla" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Forzar el tamaño de letra en los encabezados de la tabla Planilla */
        #tbDetallePlanilla thead th {
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
    Detalle de Planilla de Pago
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <%--<div class="card shadow-sm mb-3 border-0">
        <div class="card-body py-2 px-3">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <button type="button" class="btn btn-outline-secondary btn-sm font-weight-bold shadow-sm" onclick="window.history.back();">
                        <i class="fas fa-arrow-left mr-2"></i>Volver al Listado
                    </button>
                </div>
                <div class="col-md-6 text-md-right mt-2 mt-md-0">
                    <h5 class="font-weight-bold text-dark m-0">Detalle de Planilla #<span id="lblIdPlanilla" class="text-primary">--</span></h5>
                </div>
            </div>
        </div>
    </div>--%>

    <div class="card shadow-sm mb-4 border-0" style="border-top: 4px solid #004F9F !important;">
        <div class="card-body bg-light">
            <div class="row align-items-center mb-3">
                <div class="col-md-6">
                    <button type="button" class="btn btn-outline-secondary btn-sm font-weight-bold shadow-sm" onclick="window.history.back();">
                        <i class="fas fa-arrow-left mr-2"></i>Volver al Listado
                    </button>
                </div>
                <div class="col-md-6 text-md-right mt-2 mt-md-0">
                    <h5 class="font-weight-bold text-dark m-0">Detalle de Planilla #<span id="lblIdPlanilla" class="text-primary">--</span></h5>
                </div>
            </div>
            <hr>
            <div class="row mb-3">
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                    <label class="small text-muted font-weight-bold mb-1"><i class="fas fa-calendar-alt mr-1"></i>Gestión Académica</label>
                    <h6 class="font-weight-bold text-dark m-0" id="lblGestion">Cargando...</h6>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0 border-left">
                    <label class="small text-muted font-weight-bold mb-1"><i class="fas fa-calendar-check mr-1"></i>Periodo de Pago</label>
                    <h6 class="font-weight-bold text-primary m-0" id="lblPeriodo">Cargando...</h6>
                    <small class="text-muted" id="lblSemanas">-- Semanas</small>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0 border-left">
                    <label class="small text-muted font-weight-bold mb-1"><i class="fas fa-user-edit mr-1"></i>Generado Por</label>
                    <h6 class="font-weight-bold text-dark m-0" id="lblUsuarioGenera">Cargando...</h6>
                    <small class="text-muted" id="lblFechaGenera">--/--/----</small>
                </div>
                <div class="col-md-3 col-sm-6 text-md-center border-left">
                    <label class="small text-muted font-weight-bold d-block mb-2">Estado Actual</label>
                    <span id="badgeEstado" class="badge badge-secondary shadow-sm px-3 py-2" style="font-size: 0.9rem;">Cargando...</span>
                </div>
            </div>

            <div id="alertaObservacion" class="alert shadow-sm mb-4" style="display: none; border-left: 5px solid transparent;">
                <h6 class="font-weight-bold mb-1" id="lblTituloAlerta">
                    <i class="fas fa-exclamation-triangle mr-2"></i>Atención
                </h6>
                <p class="m-0 small text-dark">
                    <strong>Comentario de Auditoría: </strong>
                    <span id="lblMotivoAuditoria">Cargando...</span>
                </p>
            </div>

        </div>
    </div>

    <div class="card shadow-sm mb-4 border-0">
        <div class="card-header card-header-emi py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 class="card-title m-0 text-white font-weight-bold">
                <i class="fas fa-users mr-2"></i>Desglose de Honorarios
            </h5>
            <button type="button" id="btnReporteDetalle" class="btn btn-sm btn-light font-weight-bold text-primary shadow-sm">
                <i class="fas fa-print mr-1"></i>Imprimir Detalle
            </button>
        </div>
        <div class="card-body p-3">
            <div class="table-responsive">
                <table id="tbDetallePlanilla" class="table table-sm table-striped table-bordered table-hover w-100 text-center align-middle" style="font-size: 0.8rem;">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-left">Docente / Materia</th>
                            <th title="Horas Teóricas / Prácticas / Laboratorio">Hrs(T/P/L)</th>
                            <%--<th>Carga (HT-HP-HL)</th>--%>
                            <th>Costo/Hr</th>
                            <th>Hrs. Mes</th>
                            <th title="Horas No Trabajadas">Hrs N/T</th>
                            <th class="text-danger" title="Minutos de Atraso">Atraso</th>
                            <th title="Ingreso Bruto">Bruto</th>
                            <th class="text-danger">Descuento</th>
                            <th title="Líquido Pagable">Tot. Pago</th>
                            <%--<th class="text-success font-weight-bold">Total Pagar</th>--%>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot class="bg-light font-weight-bold">
                        <tr>
                            <td colspan="8" class="text-right">GRAN TOTAL A PAGAR:</td>
                            <td class="text-success text-center" id="lblGranTotal">Bs. 0.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div id="panelAcciones" class="mt-4 pt-3 border-top text-right" style="display: none;">
                <p class="text-muted small text-left float-left mt-2"><i class="fas fa-info-circle mr-1"></i>Verifique los montos antes de emitir una decisión.</p>

                <button type="button" class="btn btn-outline-danger font-weight-bold shadow-sm mr-2 px-4" id="btnAbrirRechazar">
                    <i class="fas fa-times-circle mr-2"></i>Rechazar Planilla
                </button>

                <button type="button" class="btn btn-success font-weight-bold shadow-sm px-4" id="btnAbrirAprobar">
                    <i class="fas fa-check-circle mr-2"></i>Aprobar Planilla
                </button>
            </div>

        </div>
    </div>

    <div class="modal fade" id="modalAuditoria" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow">
                <div class="modal-header text-white py-2 px-3" id="modalHeaderAuditoria">
                    <h5 class="modal-title m-0 font-weight-bold text-white" id="modalTituloAuditoria"><i class="fas fa-gavel mr-2"></i>Decisión de Planilla</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body bg-light p-4">
                    <p id="modalMensajeAuditoria" class="font-weight-bold text-dark text-center mb-3">¿Está seguro de procesar esta acción?</p>

                    <div class="form-group">
                        <label class="font-weight-bold text-muted small">Comentario de Auditoría (Obligatorio)</label>
                        <textarea class="form-control shadow-sm" id="txtComentarioAuditoria" rows="3" placeholder="Escriba el motivo del rechazo o nota de aprobación..."></textarea>
                        <small class="text-danger d-none" id="errorComentario">Debe ingresar un comentario.</small>
                    </div>
                </div>
                <div class="modal-footer bg-white">
                    <button type="button" class="btn btn-secondary font-weight-bold" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary font-weight-bold" id="btnConfirmarAccion">Confirmar</button>
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

    <script src="jsSecre/DetallePlanilla.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
