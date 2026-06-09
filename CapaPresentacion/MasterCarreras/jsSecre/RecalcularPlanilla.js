
// VARIABLES GLOBALES
let idPlanillaGlobal = 0;
let estadoAccionGlobal = 0; // 2 = Aprobar, 3 = Rechazar
let tablaData;

$(document).ready(function () {

    // 1. EXTRAER Y VALIDAR EL PARÁMETRO 'id' DE LA URL
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam || isNaN(idParam)) {
        swal({
            title: "Acceso Denegado",
            text: "No se seleccionó ninguna planilla válida. Redirigiendo...",
            type: "warning",
            showConfirmButton: false,
            timer: 2000
        });

        setTimeout(function () {
            window.location.replace("PanelNotificaciones.aspx"); // Ajusta a tu página de lista
        }, 2000);
        return;
    }

    // Si todo está bien, guardamos el ID en la variable global
    idPlanillaGlobal = parseInt(idParam);
    $("#lblIdPlanilla").text(idPlanillaGlobal);

    // 2. LLAMAR A LAS FUNCIONES DE CARGA
    cargarCabeceraPlanilla();

});

function cargarCabeceraPlanilla() {
    $.ajax({
        type: "POST",
        url: "RecalcularPlanilla.aspx/ObtenerCabeceraDetalle",
        data: JSON.stringify({ IdPlanilla: idPlanillaGlobal }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let data = response.d.Data;

                $("#txtIdGestion").val(data.IdGestion);
                $("#txtIdPeriodo").val(data.IdPeriodo);
                $("#txtSemanas").val(data.SemanasMes);

                // Llenamos los labels...
                $("#lblGestion").text(data.NombreGestion);
                $("#lblPeriodo").text(data.PeriodoPago);
                $("#lblSemanas").text(`${data.SemanasMes} Semanas calculadas`);
                $("#lblUsuarioGenera").text(data.UsuarioRegistro);
                $("#lblFechaGenera").text(data.FechaCreacion);

                // Pintamos el Badge de Estado
                let badge = $("#badgeEstado");
                badge.text(data.EstadoPlanilla).removeClass("badge-secondary");

                // =========================================================
                // LÓGICA DE NEGOCIO Y AUTORIZACIÓN DE BOTONES
                // =========================================================

                // Por defecto, ocultamos acciones críticas y la alerta
                $("#alertaObservacion").hide();

                let alertaContenedor = $("#alertaObservacion");
                let tituloAlerta = $("#lblTituloAlerta");

                if (data.IdEstadoPlanilla === 1) { // EN REVISIÓN
                    badge.addClass("badge-warning text-dark");

                } else if (data.IdEstadoPlanilla === 2) { // APROBADO
                    badge.addClass("badge-success");

                } else if (data.IdEstadoPlanilla === 3) { // RECHAZADO
                    badge.addClass("badge-danger");

                    // Si está rechazada, mostramos obligatoriamente el motivo del rechazo en rojo
                    alertaContenedor.removeClass("alert-success").addClass("alert-danger").css("border-left-color", "#dc3545").show();
                    tituloAlerta.removeClass("text-success").addClass("text-danger").html('<i class="fas fa-times-circle mr-2"></i>Planilla Rechazada');
                    $("#lblMotivoAuditoria").text(data.ComentarioAuditoria);
                }

            } else {
                MostrarToastZer(response.d.Mensaje, "Error", "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            MostrarToastZer("Error al cargar la cabecera.", "Error", "error");
        }
    });
}

$("#btnBuscar").on("click", function () {

    let idGestion = $("#txtIdGestion").val().trim();
    let idPeriodo = $("#txtIdPeriodo").val().trim();
    let semanas = $("#txtSemanas").val().trim();

    if (idGestion === "0" || idGestion === "") {
        MostrarToastZer("Ocurrio un error en Gestión intente nuevamente.", "Atención", "warning");
        return;
    }

    if (idPeriodo === "0" || idPeriodo === "") {
        MostrarToastZer("Ocurrio un error en Periodo de Pago intente nuevamente.", "Atención", "warning");
        return;
    }

    if (semanas === "" || isNaN(semanas) || parseInt(semanas) <= 0) {
        MostrarToastZer("El número de semanas debe ser un número válido mayor a 0.", "Atención", "warning");
        return;
    }

    // Deshabilitamos el botón de guardar por seguridad hasta que se carguen los datos
    $("#btnGuardarRegistro").prop("disabled", true);

    cargarDatosNewPlanilla(idGestion, idPeriodo, semanas);

});

let listaDatosPlanilla = [];

function cargarDatosNewPlanilla(idGestion, idPeriodo, semanas) {
    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().destroy();
        $('#tbData tbody').empty();
    }

    // Actualizamos el objeto request para enviar IdPeriodo al WebMethod
    var request = {
        idGestion: parseInt(idGestion),
        idPeriodo: parseInt(idPeriodo),
        semanas: parseInt(semanas)
    };

    tablaData = $("#tbData").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'PanelPlanilla.aspx/ObtenerDatosParaGenerarPlanilla',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",

            "beforeSend": function () {
                $("#cargann").LoadingOverlay("show");
            },

            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    listaDatosPlanilla = json.d.Data;
                    // Habilitamos el botón de guardar si hay datos exitosos
                    if (listaDatosPlanilla.length > 0) {
                        $("#btnGuardarRegistro").prop("disabled", false);
                    }
                    return json.d.Data;
                } else {
                    MostrarAlerta("¡Advertencia!", json.d.Mensaje, "warning");
                    return [];
                }
            },

            "error": function (xhr, error, thrown) {
                console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrown);
                MostrarToastZer("Ocurrió un error al cargar la planilla.", "Atención", "error");
            },

            "complete": function () {
                $("#cargann").LoadingOverlay("hide");
            }
        },
        "columns": [
            // 1. Docente + Materia + Tipo (Fusión de datos)
            {
                "data": null,
                "className": "align-middle text-left",
                render: function (data, type, row) {
                    return `
                        <div style="line-height: 1.2;">
                            <span class="font-weight-bold text-dark" style="font-size: 12px;">
                                <i class="fas fa-user-tie text-secondary mr-1"></i>${row.Docente}
                            </span><br>
                            <span class="text-primary" style="font-size: 11px;">${row.NombreMateria}</span>
                            <span class="badge badge-warning text-dark ml-1" style="font-size: 10px;">${row.NombreTipo}</span>
                        </div>
                    `;
                }
            },

            // 2. Horas (T/P/L) - Usamos text-nowrap para que no se separen de renglón
            {
                "data": null,
                "className": "text-center align-middle text-nowrap",
                render: function (data, type, row) {
                    return `<span class="text-info font-weight-bold">${row.HT}</span> / 
                            <span class="text-success font-weight-bold">${row.HP}</span> / 
                            <span class="text-secondary font-weight-bold">${row.HL}</span>`;
                }
            },

            // 3. Minutos Atraso
            { "data": "TotalMinutosAtraso", "className": "text-center align-middle text-danger font-weight-bold" },

            // 4. Hrs N/T (No Trabajadas)
            { "data": "TotalHorasNoTrabajadas", "className": "text-center align-middle" },

            // 5. Hrs Per. (Periodo)
            { "data": "TotalHorasPeriodo", "className": "text-center align-middle" },

            // 6. Hrs Trab. (Trabajadas)
            { "data": "TotalHorasTrabajadas", "className": "text-center align-middle font-weight-bold" },

            // 7. Bs/Hr (Costo Hora)
            {
                "data": "CostoHora",
                "className": "text-right align-middle text-nowrap",
                render: function (data) { return 'Bs. ' + parseFloat(data).toFixed(2); }
            },

            // 8. Bruto (Ingreso Bruto)
            {
                "data": "IngresoTotal",
                "className": "text-right align-middle text-success text-nowrap",
                render: function (data) { return 'Bs. ' + parseFloat(data).toFixed(2); }
            },

            // 9. Dsctos (Descuentos)
            {
                "data": "TotalDescuentos",
                "className": "text-right align-middle text-danger text-nowrap",
                render: function (data) { return 'Bs. ' + parseFloat(data).toFixed(2); }
            },

            // 10. Total Pago (Líquido Pagable)
            {
                "data": "TotalAPagar",
                "className": "text-right align-middle font-weight-bold text-primary text-nowrap",
                render: function (data) { return 'Bs. ' + parseFloat(data).toFixed(2); }
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$("#btnGuardarRegistro").on("click", function () {

    // Validamos que haya datos en la variable global
    if (listaDatosPlanilla.length === 0) {
        MostrarToastZer("No hay datos calculados para guardar.", "Atención", "warning");
        return;
    }

    let semanasMes = $("#txtSemanas").val().trim();

    // Alerta de Confirmación (SweetAlert v1)
    swal({
        title: "¿Actualizar Planilla?",
        text: "Se reemplazará la planilla anterior con estos nuevos cálculos y se devolverá a estado 'En Revisión'.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#004F9F",
        confirmButtonText: "Sí, Recalcular",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false // Mantenemos el modal abierto
    },
        function (isConfirm) {
            // Solo procesamos si el usuario confirmó
            if (isConfirm) {

                // 1. Bloqueos visuales
                $("#btnGuardarRegistro").prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i>PROCESANDO...');
                swal.close(); // Cerramos la alerta de confirmación manualmente
                $("#cargann").LoadingOverlay("show"); // Mostramos el overlay en la tabla

                // =========================================================================
                // 1.5 LIMPIEZA DE DATOS: Mapeamos exactamente a PlanillaDetalleGuardarDTO
                // =========================================================================
                let listaLimpiaParaCsharp = listaDatosPlanilla.map(function (item) {
                    return {
                        IdAsignacion: item.IdAsignacion,
                        CostoHora: item.CostoHora,
                        TotalMinutosAtraso: item.TotalMinutosAtraso,
                        TotalHorasPeriodo: item.TotalHorasPeriodo,
                        TotalHorasNoTrabajadas: item.TotalHorasNoTrabajadas,
                        TotalHorasTrabajadas: item.TotalHorasTrabajadas,
                        IngresoTotal: item.IngresoTotal,
                        TotalDescuentos: item.TotalDescuentos,
                        TotalAPagar: item.TotalAPagar,
                        Observacion: item.Observacion || ""
                    };
                });

                // 2. Petición AJAX
                $.ajax({
                    type: "POST",
                    url: "RecalcularPlanilla.aspx/ActualizarPlanilla",
                    data: JSON.stringify({
                        idPlanilla: idPlanillaGlobal,
                        semanasMes: parseInt(semanasMes),
                        listaDetalles: listaLimpiaParaCsharp // Enviamos la lista limpia
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {

                        $("#cargann").LoadingOverlay("hide");

                        // 3. Evaluamos la respuesta
                        if (response.d.Estado) {

                            // Mostramos alerta de éxito usando tu función personalizada
                            AlertaTimerTipo('¡Operación Exitosa!', response.d.Mensaje, response.d.Valor);

                            // Redirigimos de vuelta a la bandeja del Jefe de Carrera después de 2 segundos
                            setTimeout(function () {
                                window.location.replace("PanelNotificaciones.aspx");
                            }, 2200);

                        } else {
                            // Si falló en la BD, restauramos el botón
                            $("#btnGuardarRegistro").prop("disabled", false).html('<i class="fas fa-save mr-2"></i>ACTUALIZAR PLANILLA');
                            swal("Atención", response.d.Mensaje, response.d.Valor);
                        }
                    },
                    error: function (xhr) {
                        console.log(xhr.responseText);
                        $("#cargann").LoadingOverlay("hide");
                        $("#btnGuardarRegistro").prop("disabled", false).html('<i class="fas fa-save mr-2"></i>ACTUALIZAR PLANILLA');
                        swal("Error Crítico", "Ocurrió un problema de conexión con el servidor.", "error");
                    }
                });
            }
        });
});

// fin