<%@ Page Title="" Language="C#" MasterPageFile="~/MasterCarreras/CarrerasMaster.Master" AutoEventWireup="true" CodeBehind="PanelInicio.aspx.cs" Inherits="CapaPresentacion.MasterCarreras.PanelInicio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/css/miestiloze.css" rel="stylesheet" type="text/css"/>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="titulo" runat="server">
    Bienvenido....
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-12 m-b-30">
        <div class="hero-emi shadow">
            <div class="hero-overlay p-5 text-center">
                <img src="../images/emiss.png" alt="Logo EMI" class="logo-hero mb-4 shadow-sm">

                <h1 class="text-white font-weight-bold text-uppercase mb-2">Sistema de Gestión de Honorarios Docentes
                </h1>
                <h4 class="text-warning font-weight-light mb-4">Escuela Militar de Ingeniería - Mcal. Antonio José de Sucre
                </h4>

                <hr class="divider-emi">

                <p class="text-white-50 mt-4 mb-4" style="font-size: 1.1rem;">
                    Automatización, control y precisión en el cálculo de planillas académicas.
                </p>

                <button type="button" class="btn btn-emi-warning btn-lg px-5 shadow font-weight-bold">
                    <i class="fas fa-calendar-check mr-2"></i>Ir al Control de Asistencia
                </button>
            </div>
        </div>
    </div>
</div>

<div class="row">

    <div class="col-md-4 m-b-30">
        <div class="card emi-card border-0 shadow-sm h-100">
            <div class="card-body text-center p-4">
                <div class="icon-circle emi-bg-light mx-auto mb-3 shadow-sm">
                    <i class="fas fa-chalkboard-teacher fa-2x emi-text-primary"></i>
                </div>
                <h5 class="font-weight-bold text-dark">Plantel Docente</h5>
                <p class="text-muted small">Administración de perfiles, datos personales y asignaciones de materias.</p>
                <button class="btn btn-outline-emi btn-sm mt-2">Gestionar <i class="fas fa-arrow-right ml-1"></i></button>
            </div>
        </div>
    </div>

    <div class="col-md-4 m-b-30">
        <div class="card emi-card border-0 shadow-sm h-100">
            <div class="card-body text-center p-4">
                <div class="icon-circle emi-bg-light mx-auto mb-3 shadow-sm">
                    <i class="fas fa-clock fa-2x emi-text-primary"></i>
                </div>
                <h5 class="font-weight-bold text-dark">Periodos y Horarios</h5>
                <p class="text-muted small">Configuración de gestiones, cronogramas de pagos y carga horaria semanal.</p>
                <button class="btn btn-outline-emi btn-sm mt-2">Configurar <i class="fas fa-arrow-right ml-1"></i></button>
            </div>
        </div>
    </div>

    <div class="col-md-4 m-b-30">
        <div class="card emi-card border-0 shadow-sm h-100">
            <div class="card-body text-center p-4">
                <div class="icon-circle emi-bg-light mx-auto mb-3 shadow-sm">
                    <i class="fas fa-dollar-sign fa-2x emi-text-primary"></i>
                </div>
                <h5 class="font-weight-bold text-dark">Cálculo de Planillas</h5>
                <p class="text-muted small">Generación de reportes de honorarios, descuentos por atrasos y totales a pagar.</p>
                <button class="btn btn-outline-emi btn-sm mt-2">Generar <i class="fas fa-arrow-right ml-1"></i></button>
            </div>
        </div>
    </div>

</div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="footer" runat="server">
</asp:Content>
