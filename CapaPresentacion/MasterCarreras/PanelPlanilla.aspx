<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="PanelPlanilla.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.PanelPlanilla" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Forzar el tamaño de letra en los encabezados de la tabla Planilla */
        #tbData thead th {
            font-size: 11px !important; /* Puedes probar con 11px o 12px según veas mejor */
            vertical-align: middle !important;
            /*padding: 8px 4px;*/
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de Planilla de Pago
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow-sm border-0" id="cargann">
                <div class="card-header card-header-emi py-3 px-4">
                    <h3 class="card-title m-0 text-white">
                        <i class="fas fa-file-invoice-dollar mr-2"></i>Generación Planilla de Pago
                    </h3>
                </div>
                <div class="card-body">

                    <div class="bg-light p-3 rounded border shadow-sm mb-4">
                        <div class="row align-items-end">
                            <div class="col-md-3">
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
                                        <option value="">Seleccione una Gestión primero...</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-2">
                                <label class="small font-weight-bold text-dark mb-1">Semanas</label>
                                <div class="input-group input-group-sm shadow-sm" title="Cantidad de Semanas del Periodo">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-white"><i class="fas fa-hashtag text-info"></i></span>
                                    </div>
                                    <input type="number" class="form-control input-sm text-center font-weight-bold" id="txtSemanas" min="1" value="4">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <button type="button" id="btnBuscar" class="btn btn-sm btn-primary btn-block shadow-sm font-weight-bold">
                                    <i class="fas fa-search mr-2"></i>Calcular Planilla
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive border rounded shadow-sm mt-3">
                        <table id="tbData" class="table table-sm table-striped table-bordered table-hover align-middle w-100" style="font-size: 12px;">
                            <thead class="thead-light text-center">
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
                                <i class="fas fa-save mr-2"></i>GUARDAR PLANILLA
                            </button>
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

    <script src="jsSecre/PanelPlanilla.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
