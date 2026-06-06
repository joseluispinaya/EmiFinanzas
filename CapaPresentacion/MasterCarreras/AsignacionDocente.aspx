<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="AsignacionDocente.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.AsignacionDocente" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/pluginzero/select2/select2.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Asignación de Docentes
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-12">
        <div class="card shadow-sm border-0" id="loadinzero">
            
            <div class="card-header card-header-emi py-3 px-4">
                <h3 class="card-title m-0 text-white">
                    <i class="fas fa-chalkboard-teacher mr-2"></i>Panel de Asignación de Docentes
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
                                    <span id="lblDatos" class="badge badge-secondary p-1">Seleccione un docente</span>
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

                    <div class="col-md-4 mb-3">
                        <div class="p-2 h-100">
                            <div class="input-group input-group-sm mb-2 shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white font-weight-bold text-dark" style="width: 100px;">Gestión</span>
                                </div>
                                <select class="custom-select custom-select-sm" id="cboGestion"></select>
                            </div>

                            <div class="input-group input-group-sm mb-2 shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white font-weight-bold text-dark" style="width: 100px;">Materia</span>
                                </div>
                                <select class="custom-select custom-select-sm" id="cboMaterias"></select>
                            </div>

                            <div class="input-group input-group-sm mb-2 shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white font-weight-bold text-dark" style="width: 100px;">Tipo Asig.</span>
                                </div>
                                <select class="custom-select custom-select-sm" id="cboTipoAsignacion">
                                </select>
                            </div>

                            <div class="input-group input-group-sm shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white font-weight-bold text-dark" style="width: 100px;">Grupo</span>
                                </div>
                                <select class="custom-select custom-select-sm" id="cboGrupos"></select>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3 mb-3">
                        <div class="p-2 h-100">
                            <div class="input-group input-group-sm mb-3 shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light font-weight-bold text-dark" style="width: 90px;">
                                        <i class="fas fa-dollar-sign mr-1 text-success"></i>Costo Hr
                                    </span>
                                </div>
                                <input type="number" class="form-control input-sm text-center font-weight-bold text-primary" id="txtCostoHora" min="0" value="0">
                            </div>

                            <div class="input-group input-group-sm mb-3 shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light font-weight-bold text-dark" style="width: 90px;">
                                        <i class="fas fa-clock mr-1 text-info"></i>Hrs Total
                                    </span>
                                </div>
                                <input type="number" class="form-control input-sm text-center font-weight-bold text-primary" id="txtCargaHoraria" min="0" value="0">
                            </div>
                        </div>
                    </div>

                </div>

                <hr>

                <div class="row">
                    <div class="col-12 mb-3">
                        <h5 class="font-weight-bold text-dark m-0"><i class="fas fa-calendar-alt mr-2 text-primary"></i>Programación de Horarios</h5>
                    </div>
                    
                    <div class="col-lg-4 col-md-5 mb-3">
                        <div class="bg-light p-3 rounded border shadow-sm h-100">
                            
                            <div class="form-group mb-3">
                                <label class="small font-weight-bold text-dark">Día de la Semana</label>
                                <select class="custom-select custom-select-sm" id="cboDia">
                                    <option value="1">Lunes</option>
                                    <option value="2">Martes</option>
                                    <option value="3">Miércoles</option>
                                    <option value="4">Jueves</option>
                                    <option value="5">Viernes</option>
                                    <option value="6">Sábado</option>
                                </select>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-4">
                                        <label class="small font-weight-bold text-dark">Hora Inicio</label>
                                        <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary" id="txtHoraInicio">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-4">
                                        <label class="small font-weight-bold text-dark">Hora Fin</label>
                                        <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary" id="txtHoraFin">
                                    </div>
                                </div>
                            </div>
                            
                            <button type="button" id="btnAgregarHorario" class="btn btn-sm btn-outline-primary btn-block font-weight-bold shadow-sm">
                                <i class="fas fa-plus mr-1"></i> Agregar Día
                            </button>
                            
                        </div>
                    </div>

                    <div class="col-lg-8 col-md-7 mb-3">
                        <div class="table-responsive h-100 bg-white p-2 border rounded shadow-sm">
                            <table id="tbHorarios" class="table table-sm table-bordered table-hover text-center align-middle m-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Día</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Fin</th>
                                        <th style="width: 80px;">Quitar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="trVacioHorarios">
                                        <td colspan="4" class="text-muted font-italic py-4">No hay horarios agregados aún.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-4 offset-md-4">
                        <button type="button" id="btnGuardarRegistro" class="btn btn-emi-warning btn-block btn-lg shadow font-weight-bold" disabled>
                            <i class="fas fa-save mr-2"></i>GUARDAR ASIGNACIÓN
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/pluginzero/select2/select2.min.js"></script>
    <script src="../assets/pluginzero/select2/es.min.js"></script>
    <script src="jsSecre/AsignacionDoc.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
