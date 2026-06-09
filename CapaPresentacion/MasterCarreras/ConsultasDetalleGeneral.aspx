<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="ConsultasDetalleGeneral.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.ConsultasDetalleGeneral" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/fixedHeader.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/plugins/datatables/scroller.bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/pluginzero/select2/select2.min.css" rel="stylesheet" type="text/css" />
    <style>
        .card-materia-hover {
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border-left: 4px solid transparent;
        }

            .card-materia-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
                border-left: 4px solid #004F9F;
            }

        .card-materia-active {
            border-left: 4px solid #004F9F !important;
            background-color: #f8f9fa !important;
            box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Panel de consulta General
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-12">
        <div class="card shadow-sm border-0" id="loadinzero">

            <div class="card-header card-header-emi py-3 px-4">
                <h4 class="card-title m-0 text-white font-weight-bold">
                    <i class="fas fa-folder-open mr-2"></i>Consulta General de Asistencia por Asignación
                </h4>
            </div>

            <div class="card-body bg-light">
                <input id="txtIdDocente" value="0" type="hidden" />

                <div class="row mb-4">
                    
                    <div class="col-md-5 mb-3 mb-md-0">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body d-flex align-items-center">
                                <img id="imgDoce" src="../images/sinImagen.png" alt="Perfil" class="rounded-circle shadow-sm mr-3" style="width: 75px; height: 75px; object-fit: cover; border: 3px solid #004F9F;">
                                <div>
                                    <span id="lblDatos" class="badge badge-secondary px-2 py-1 shadow-sm mb-1">Seleccione un docente</span>
                                    <h5 id="lblNombres" class="mb-0 text-dark font-weight-bold">Esperando selección...</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-7">
                        <div class="card border-0 shadow-sm h-100" style="border-top: 4px solid #004F9F;">
                            <div class="card-body p-3">
                                
                                <div class="form-group mb-3">
                                    <label for="cboBuscarDocente" class="small font-weight-bold text-muted mb-1">
                                        <i class="fas fa-search mr-1"></i>Buscador de Docentes
                                    </label>
                                    <select class="form-control form-control-sm shadow-sm" id="cboBuscarDocente" style="width: 100%;">
                                        <option value=""></option>
                                    </select>
                                </div>

                                <div class="row align-items-end">
                                    <div class="col-md-4 form-group mb-0">
                                        <label class="small font-weight-bold text-dark mb-1">Gestión</label>
                                        <div class="input-group input-group-sm shadow-sm">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-white"><i class="fas fa-calendar-alt text-primary"></i></span>
                                            </div>
                                            <select class="custom-select custom-select-sm border-left-0" id="cboGestion"></select>
                                        </div>
                                    </div>

                                    <div class="col-md-4 form-group mb-0">
                                        <label class="small font-weight-bold text-dark mb-1">Periodo de Pago</label>
                                        <div class="input-group input-group-sm shadow-sm">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text bg-white"><i class="fas fa-calendar-check text-success"></i></span>
                                            </div>
                                            <select class="custom-select custom-select-sm border-left-0" id="cboPeriodo" disabled>
                                                <option value="">Seleccione Gestión...</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <button type="button" id="btnBuscar" class="btn btn-sm btn-primary btn-block shadow-sm font-weight-bold">
                                            <i class="fas fa-search mr-2"></i>Cargar Horarios
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <hr class="mb-4">

                <div class="row">
                    
                    <div class="col-lg-4 col-md-5 mb-3">
                        <div class="card border-0 shadow-sm h-100 bg-white">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="font-weight-bold text-dark m-0">
                                    <i class="fas fa-layer-group text-info mr-2"></i>Materias Asignadas
                                </h6>
                            </div>
                            <div class="card-body p-2" id="contenedorHorario" style="max-height: 550px; overflow-y: auto; overflow-x: hidden;">
                                <div class="alert alert-secondary text-center py-4 m-2 shadow-sm" style="font-size: 0.85rem;">
                                    <i class="fas fa-hand-pointer d-block mb-2 text-muted" style="font-size: 1.8rem;"></i>
                                    Realice la búsqueda para visualizar las materias asignadas.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-8 col-md-7 mb-3">
                        <div class="card border-0 shadow-sm h-100 bg-white" style="border-left: 4px solid #E6BC00 !important;">
                            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                <h6 class="font-weight-bold text-dark m-0">
                                    <i class="fas fa-clipboard-list text-primary mr-2"></i>Detalle de Asistencia
                                </h6>
                                <button type="button" id="btnReporte" class="btn btn-warning btn-sm shadow-sm font-weight-bold" disabled>
                                    <i class="fas fa-print mr-1"></i> Exportar
                                </button>
                            </div>
                            
                            <div class="card-body p-2">
                                <div class="table-responsive">
                                    <table id="tbDetalle" class="table table-sm table-striped table-bordered table-hover text-center align-middle m-0 w-100" style="font-size: 0.85rem;">
                                        <thead class="thead-light">
                                            <tr>
                                                <th class="text-left">Fecha</th>
                                                <th title="Hora Oficial de Entrada y Salida">Oficial (E-S)</th>
                                                <th title="Hora Real Marcada por el Docente">Marcado (E-S)</th>
                                                <th title="Minutos Totales de Atrasos">Atrasos</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="5" class="text-muted font-italic py-5">
                                                    Seleccione una materia del panel izquierdo para ver su asistencia.
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
    <script src="jsSecre/ConsultasDetalleGeneral.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
