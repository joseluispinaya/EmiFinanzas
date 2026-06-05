<%@ Page Title="" Language="C#" MasterPageFile="~/HomeMaster.Master" AutoEventWireup="true" CodeBehind="PanelAsistenciaDiaria.aspx.cs" Inherits="CapaPresentacion.PanelAsistenciaDiaria" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css" rel="stylesheet">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Asistencia Diaria
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow-sm border-0" id="loadinzero">

                <div class="card-header card-header-emi py-3 px-4">
                    <h3 class="card-title m-0 text-white">
                        <i class="fas fa-clipboard-list mr-2"></i>Control de Asistencia Diaria
                    </h3>
                </div>

                <div class="card-body">

                    <div class="bg-light p-3 rounded border shadow-sm mb-4">
                        <div class="form-row align-items-end">

                            <div class="form-group col-md-3 mb-0">
                                <label class="small font-weight-bold text-dark mb-1">Grado Académico</label>
                                <select class="custom-select custom-select-sm shadow-sm" id="cboGrados">
                                </select>
                            </div>

                            <div class="form-group col-md-3 mb-0">
                                <label class="small font-weight-bold text-dark mb-1">Carrera</label>
                                <select class="custom-select custom-select-sm shadow-sm" id="cboCarreras" disabled>
                                </select>
                            </div>

                            <div class="form-group col-md-2 mb-0">
                                <label class="small font-weight-bold text-dark mb-1">Gestión</label>
                                <select class="custom-select custom-select-sm shadow-sm" id="cboGestion">
                                </select>
                            </div>

                            <div class="form-group col-md-2 mb-0">
                                <label class="small font-weight-bold text-dark mb-1">Fecha de Asistencia</label>
                                <div class="input-group input-group-sm shadow-sm">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-white border-right-0">
                                            <i class="fas fa-calendar-plus text-primary"></i>
                                        </span>
                                    </div>
                                    <input type="text" class="form-control input-sm border-left-0 text-center font-weight-bold" id="txtFecha" readonly style="cursor: pointer;">
                                </div>
                            </div>

                            <div class="form-group col-md-2 mb-0">
                                <button type="button" id="btnBuscar" class="btn btn-sm btn-primary btn-block shadow-sm font-weight-bold">
                                    <i class="fas fa-search mr-1"></i>Buscar Clases
                                </button>
                            </div>

                        </div>
                    </div>

                    <div class="d-flex justify-content-end mb-2">
                        <button type="button" id="btnLlenadoRapido" class="btn btn-sm btn-success shadow-sm font-weight-bold">
                            <i class="fas fa-bolt mr-1"></i>Asistencia Perfecta (Feriados/Parciales)
                        </button>
                    </div>

                    <div class="table-responsive border rounded shadow-sm mb-4">
                        <table id="tbAsistencia" class="table table-sm table-striped table-bordered table-hover text-center align-middle w-100" style="min-width: 1000px;">
                            <thead class="thead-light">
                                <tr>
                                    <th class="d-none">IdHorario</th>
                                    <th class="d-none">IdAsistenciaDiaria</th>

                                    <th class="text-left" style="width: 20%;">Docente</th>
                                    <th class="text-left" style="width: 20%;">Datos Académicos</th>
                                    <th style="width: 12%;">Horario Oficial</th>

                                    <th style="width: 13%;">Estado</th>
                                    <th style="width: 12%;">Hora Ingreso</th>
                                    <th style="width: 12%;">Hora Salida</th>
                                    <th style="width: 11%;">Min. Atraso</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="7" class="text-muted font-italic py-4">Seleccione los filtros y presione "Buscar Clases" para cargar los horarios de hoy.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="row">
                        <div class="col-md-4 offset-md-4">
                            <button type="button" id="btnGuardarAsistencia" class="btn btn-emi-warning btn-block btn-lg shadow font-weight-bold" disabled>
                                <i class="fas fa-save mr-2"></i>GUARDAR ASISTENCIA DIARIA
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
    <script src="assets/plugins/bootstrap-datepicker/datepicker-es.js"></script>
    <script src="js/PanelAsistenciaDiaria.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
