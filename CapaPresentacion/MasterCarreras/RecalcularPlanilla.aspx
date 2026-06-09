<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="RecalcularPlanilla.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.RecalcularPlanilla" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <style>
        #tbData thead th {
            font-size: 11px !important; /* Puedes probar con 11px o 12px según veas mejor */
            vertical-align: middle !important;
            /*padding: 8px 4px;*/
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Modificar Planilla de Pago
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="card shadow-sm mb-4 border-0" style="border-top: 4px solid #E6BC00 !important;">
        <div class="card-body bg-light">
            <input type="hidden" id="txtIdGestion" value="0" />
            <input type="hidden" id="txtIdPeriodo" value="0" />
            <%--<input type="hidden" id="txtSemanas" value="" />--%>
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

            <div class="row align-items-end">
                <div class="col-md-8 mb-3 mb-md-0">
                    <div id="alertaObservacion" class="alert shadow-sm m-0" style="display: none; border-left: 5px solid transparent;">
                        <h6 class="font-weight-bold mb-1" id="lblTituloAlerta">
                            <i class="fas fa-exclamation-triangle mr-2"></i>Atención
                        </h6>
                        <p class="m-0 small text-dark">
                            <strong>Comentario de Auditoría: </strong>
                            <span id="lblMotivoAuditoria">Cargando...</span>
                        </p>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="form-group mb-2 bg-white p-2 border rounded shadow-sm">
                        <label class="small font-weight-bold text-dark mb-1 d-block text-center">Nro. de Semanas (Cálculo)</label>
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-light"><i class="fas fa-calendar-plus text-primary"></i></span>
                            </div>
                            <input type="number" id="txtSemanas" class="form-control input-sm text-center font-weight-bold text-primary" min="1" max="5">
                        </div>
                    </div>

                    <button type="button" id="btnBuscar" class="btn btn-sm btn-primary btn-block shadow-sm font-weight-bold">
                        <i class="fas fa-calculator mr-2"></i>Recalcular Planilla
                    </button>
                </div>
            </div>

        </div>
    </div>

    <div class="card shadow-sm mb-4 border-0" style="border-top: 4px solid #004F9F !important;" id="cargann">
        <%--<div class="card-header card-header-emi py-3 px-4">
            <h3 class="card-title m-0 text-white">
                <i class="fas fa-money-check mr-2"></i>Recalcular Planilla de Pago
            </h3>
        </div>--%>
        <div class="card-body p-3">
            <div class="table-responsive">
                <table id="tbData" class="table table-sm table-striped table-bordered table-hover w-100 align-middle" style="font-size: 0.8rem;">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-left">Docente / Materia</th>
                            <th title="Horas Teóricas / Prácticas / Laboratorio">Hrs(T/P/L)</th>
                            <th title="Minutos de Atraso">Atraso</th>
                            <th title="Horas No Trabajadas">Hrs N/T</th>
                            <th title="Horas del Periodo">Hrs Per.</th>
                            <th title="Horas Trabajadas">Hrs Trab.</th>
                            <th title="Costo por Hora">Bs/Hr</th>
                            <th title="Ingreso Bruto">Bruto</th>
                            <th title="Descuentos por Atraso">Dsctos.</th>
                            <th title="Líquido Pagable">Tot. Pago</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr>
                            <td colspan="10" class="text-muted font-italic py-4">Seleccione los filtros y presione "Calcular Planilla" para visualizar los datos.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row justify-content-center mt-4">
                <div class="col-md-4">
                    <button type="button" id="btnGuardarRegistro" class="btn btn-emi-warning btn-block btn-lg shadow font-weight-bold" disabled>
                        <i class="fas fa-save mr-2"></i>ACTUALIZAR PLANILLA
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

    <script src="jsSecre/RecalcularPlanilla.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
