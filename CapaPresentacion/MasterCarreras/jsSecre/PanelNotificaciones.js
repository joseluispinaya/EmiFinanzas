
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

    // 1. Si el DataTable ya existe, lo destruimos y vaciamos el tbody
    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().destroy();
        $('#tbData tbody').empty();
    }

    // 2. Evaluamos qué hacer
    if (idGestion) {
        // Si seleccionó una gestión válida, llamamos a tu función
        listaPlanillas(idGestion);
    } else {
        // Si regresó a la opción vacía, restauramos tu mensaje personalizado
        $('#tbData tbody').html(`
            <tr>
                <td colspan="5" class="text-muted font-italic py-4 text-center">
                    Seleccione una gestión para cargar las planillas.
                </td>
            </tr>
        `);
    }
});

function listaPlanillas(idGestion) {
    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().destroy();
        $('#tbData tbody').empty();
    }

    var request = {
        IdGestion: parseInt(idGestion)
    };

    // Quitamos el 'let' para usar la variable global
    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelNotificaciones.aspx/ListarPlanillasPorGestion',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "beforeSend": function () {
                $("#tbData").closest(".card").LoadingOverlay("show");
            },
            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    MostrarToastZer(json.d.Mensaje, "Atención", "error");
                    return [];
                }
            },
            "complete": function () {
                $("#tbData").closest(".card").LoadingOverlay("hide");
            }
        },
        "columns": [
            {
                "data": "PeriodoPago",
                "className": "align-middle text-left font-weight-bold text-dark",
                render: function (data) {
                    return `<i class="fas fa-calendar-check text-success mr-2"></i>${data}`;
                }
            },
            {
                "data": "SemanasMes",
                "className": "align-middle",
                render: function (data) { return `${data} Semanas`; }
            },
            { "data": "Fecha", "className": "align-middle text-muted font-weight-bold" },
            {
                "data": null,
                "className": "align-middle",
                render: function (data, type, row) {
                    let badgeClass = "badge-secondary";
                    let icon = "";

                    if (row.IdEstadoPlanilla === 1) {
                        badgeClass = "badge-warning text-dark";
                        icon = "fas fa-clock";
                    } else if (row.IdEstadoPlanilla === 2) {
                        badgeClass = "badge-success";
                        icon = "fas fa-check-circle";
                    } else if (row.IdEstadoPlanilla === 3) {
                        badgeClass = "badge-danger";
                        icon = "fas fa-times-circle";
                    }

                    return `<span class="badge ${badgeClass} shadow-sm px-2 py-1" style="font-size: 11px;">
                                <i class="${icon} mr-1"></i>${row.EstadoPlanilla}
                            </span>`;
                }
            },
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "className": "align-middle text-nowrap",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-outline-secondary btn-editar btn-sm shadow-sm mr-1" title="Editar Planilla" data-id="${row.IdPlanilla}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-primary btn-detalle btn-sm shadow-sm font-weight-bold" title="Revisar Detalle" data-id="${row.IdPlanilla}">
                            <i class="fas fa-money-check-alt mr-1"></i> Revisar
                        </button>
                    `;
                }
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// =====================================================================
// EVENTO: CLIC EN BOTÓN "REVISAR DETALLE"
// =====================================================================
$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    // Validación magistral para el modo Responsive de DataTables
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    let idPlanilla = data.IdPlanilla;

    //const textoSms = `Detalle del Id: ${idPlanilla}.`;
    //MostrarAlerta("¡Mensaje!", textoSms, "info");

    // Redirigimos a la nueva página enviando el ID por la URL
    window.location.href = `DetallePlanilla.aspx?id=${idPlanilla}`;
});

// fin