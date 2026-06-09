<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="CapaPresentacion.Login" %>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso - Sistema de Honorarios EMI</title>

    <link rel="shortcut icon" href="assets/images/favicon.ico">
<link href="assets/plugins/bootstrap-sweetalert/sweet-alert.css" rel="stylesheet" type="text/css"/>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link href="assets/css/loginvoca.css" rel="stylesheet" type="text/css">
</head>
<body>

    <div class="container-fluid p-0">
        <div class="row no-gutters">

            <div class="col-md-6 col-lg-7 d-none d-md-block login-image-section shadow-lg">
                <div class="login-overlay">
                    <img src="assets/images/emiblanco.png" alt="EMI Logo Blanco" style="max-width: 280px; margin-bottom: 2rem;">
                    
                    <h1 class="text-white font-weight-bold mb-3">Sistema de Honorarios</h1>
                    <p class="text-white-50" style="font-size: 1.2rem; max-width: 500px;">
                        Automatización y control de planillas docentes de la Escuela Militar de Ingeniería.
                    </p>
                </div>
            </div>

            <div class="col-md-6 col-lg-5 login-form-section">
                <div class="login-card">
                    
                    <div class="text-center mb-5">
                        <img src="images/emiss.png" alt="EMI Logo Color" style="max-width: 180px;" class="mb-4">
                        <h4 class="text-dark font-weight-bold">Iniciar Sesión</h4>
                        <p class="text-muted">Ingresa tus credenciales para acceder</p>
                    </div>

                    <div class="form-group mb-4">
                            <div class="input-group shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="fas fa-user"></i>
                                    </span>
                                </div>
                                <input type="text" id="inputCorreo" class="form-control" placeholder="Usuario o Correo Institucional" value="carmeloleme@yopmail.com">
                            </div>
                        </div>

                        <div class="form-group mb-4">
                            <div class="input-group shadow-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="fas fa-lock"></i>
                                    </span>
                                </div>
                                <input type="password" id="inputPassword" class="form-control" placeholder="Contraseña" value="21222324">
                            </div>
                        </div>

                        <button type="button" id="btnIngresar" class="btn btn-emi-warning btn-block shadow-sm mb-4">
                            INGRESAR <i class="fas fa-sign-in-alt ml-2"></i>
                        </button>

                        <div class="text-center">
                            <a href="#" class="forgot-password" data-toggle="modal" data-target="#modalOlvido">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                </div>
            </div>

        </div>
    </div>

    <div class="modal fade" id="modalOlvido" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header" style="background-color: #02264D;">
                    <h5 class="modal-title text-white"><i class="fas fa-key mr-2"></i>Recuperar Acceso</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-4">
                    <p class="text-muted mb-4">Ingresa tu correo institucional y te enviaremos las instrucciones para restablecer tu contraseña.</p>
                    <div class="form-group">
                        <div class="input-group shadow-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </div>
                            <input type="email" id="emailRecuperacion" class="form-control" placeholder="correo@emi.edu.bo">
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-emi-warning font-weight-bold">Enviar Correo</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/plugins/bootstrap-sweetalert/sweet-alert.min.js"></script>
<script src="assets/plugins/loadingoverlay/loadingoverlay.js"></script>
<script src="js/Login.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</body>
</html>
