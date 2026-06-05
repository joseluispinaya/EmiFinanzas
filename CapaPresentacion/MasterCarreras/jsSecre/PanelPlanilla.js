
let tablaData;

$(document).ready(function () {
    cargarGestiones();
});
function cargarGestiones() {

    $("#cboGestion").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaGestiones",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Gestion</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                });

                $("#cboGestion").html(opcionesHTML);

            } else {
                $("#cboGestion").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboGestion").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboGestion").on("change", function () {
    const idGestion = $(this).val();

    $("#cboPeriodo").empty().append('<option value="">Seleccione Periodo</option>');
    $("#cboPeriodo").prop("disabled", true);

    if (idGestion) {
        cargarPeriodos(idGestion);
    }
});

function cargarPeriodos(idGestion) {

    $("#cboPeriodo").html('<option value="">Cargando...</option>');

    var request = {
        IdGestion: parseInt(idGestion)
    };

    $.ajax({
        url: "/PanelPagos.aspx/ObtenerPeriodosPago",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdPeriodo}">${row.Descripcion}</option>`;
                });

                $("#cboPeriodo").html(opcionesHTML);
                $("#cboPeriodo").prop("disabled", false);
            } else {
                $("#cboPeriodo").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboPeriodo").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#btnBuscar").on("click", function () {

    let idGestion = $("#cboGestion").val();
    let idPeriodo = $("#cboPeriodo").val(); // Reemplazo de idMes
    let semanas = $("#txtSemanas").val().trim();

    if (idGestion === "") {
        MostrarToastZer("Por favor, seleccione una Gestión.", "Atención", "warning");
        $("#cboGestion").focus();
        return;
    }

    if (idPeriodo === "") {
        MostrarToastZer("Por favor, seleccione un Periodo de Pago.", "Atención", "warning");
        $("#cboPeriodo").focus();
        return;
    }

    if (semanas === "") {
        MostrarToastZer("Por favor, ingrese las semanas.", "Atención", "warning");
        $("#txtSemanas").focus();
        return;
    }

    if (parseInt(semanas) <= 0) {
        MostrarToastZer("El número de semanas debe ser mayor a cero.", "Atención", "warning");
        $("#txtSemanas").focus();
        return;
    }

    // Deshabilitamos el botón de guardar por seguridad hasta que se carguen los datos
    $("#btnGuardarRegistro").prop("disabled", true);

    cargarDatosPlanilla(idGestion, idPeriodo, semanas);

});

let listaDatosPlanilla = [];

function cargarDatosPlanilla(idGestion, idPeriodo, semanas) {
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

    // 1. Validamos que haya datos en nuestro arreglo global
    if (listaDatosPlanilla.length === 0) {
        MostrarToastZer("No hay datos de planilla calculados para guardar.", "Atención", "warning");
        return;
    }

    let idGestion = $("#cboGestion").val();
    let idPeriodo = $("#cboPeriodo").val();
    let semanas = $("#txtSemanas").val().trim();

    // 2. Alerta de Confirmación (SweetAlert v1)
    swal({
        title: "¿Guardar Planilla?",
        text: `Se guardará la planilla con ${listaDatosPlanilla.length} registros y pasará al estado "En Revisión". Esta acción generará el historial de auditoría.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // Color verde para confirmar
        confirmButtonText: "Sí, Guardar Planilla",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false // Mantenemos el modal abierto para mostrar el "loading"
    },
        function (isConfirm) {
            if (isConfirm) {

                // 3. Bloqueamos la interfaz para evitar dobles envíos
                $("#btnGuardarRegistro").prop("disabled", true);
                swal.close(); // Cerramos la confirmación
                $("#cargann").LoadingOverlay("show"); // Mostramos el overlay en la tarjeta

                // 4. Preparamos el objeto tal cual lo espera el DTO GuardarPlanillaRequestDTO en C#
                const requestPayload = {
                    IdGestion: parseInt(idGestion),
                    IdPeriodo: parseInt(idPeriodo),
                    SemanasMes: parseInt(semanas),
                    Detalles: listaDatosPlanilla
                };

                // 5. Petición AJAX
                $.ajax({
                    type: "POST",
                    url: "PanelPlanilla.aspx/GuardarPlanillaCompleta",
                    data: JSON.stringify({ request: requestPayload }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {

                        $("#cargann").LoadingOverlay("hide");

                        // Utilizamos tu función global para mostrar la alerta
                        AlertaTimerTipo(
                            response.d.Estado ? '¡Excelente!' : 'Atención',
                            response.d.Mensaje,
                            response.d.Valor
                        );

                        // 6. Si se guardó correctamente, recargamos la página a los 2 segundos
                        if (response.d.Estado) {
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        } else {
                            // Si el servidor rechazó el guardado (Ej: Ya existía la planilla), habilitamos el botón
                            $("#btnGuardarRegistro").prop("disabled", false);
                        }
                    },
                    error: function (xhr) {
                        console.log(xhr.responseText);
                        $("#cargann").LoadingOverlay("hide");
                        $("#btnGuardarRegistro").prop("disabled", false);
                        MostrarToastZer("No se pudo conectar con el servidor.", "Error Crítico", "error");
                    }
                });
            }
        });

});

$("#btnGuardarRegistroPruebas").on("click", function () {

    // 1. Validamos que haya datos en nuestro arreglo global
    if (listaDatosPlanilla.length === 0) {
        MostrarToastZer("No hay datos de planilla calculados para guardar.", "Atención", "warning");
        return;
    }

    let idGestion = $("#cboGestion").val();
    let idPeriodo = $("#cboPeriodo").val();
    let semanas = $("#txtSemanas").val().trim();

    swal({
        title: "¿Guardar Planilla?",
        text: `Se guardará la planilla con ${listaDatosPlanilla.length} registros y pasará al estado "En Revisión". Esta acción generará el historial de auditoría.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // Color verde para confirmar
        confirmButtonText: "Sí, Guardar Planilla",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false // Mantenemos el modal abierto para mostrar el "loading"
    },
        function (isConfirm) {
            if (isConfirm) {

                // 3. Bloqueamos la interfaz para evitar dobles envíos
                $("#btnGuardarRegistro").prop("disabled", true);
                swal.close(); // Cerramos la confirmación
                $("#cargann").LoadingOverlay("show"); // Mostramos el overlay en la tarjeta

                // 4. Preparamos el objeto tal cual lo espera el DTO GuardarPlanillaRequestDTO en C#
                const requestPayload = {
                    IdGestion: parseInt(idGestion),
                    IdPeriodo: parseInt(idPeriodo),
                    SemanasMes: parseInt(semanas),
                    Detalles: listaDatosPlanilla
                };

                console.log("Payload a enviar:", requestPayload); // Log para verificar el payload

                setTimeout(function () {
                    $("#cargann").LoadingOverlay("hide");
                    MostrarToastZer("Prueba con éxito", "Éxito", "success");
                    $("#btnGuardarRegistro").prop("disabled", false);
                }, 2000);

            }
        });
});

// fin