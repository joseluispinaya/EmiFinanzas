
// Variable global para no perder el periodo al hacer clic en las tarjetas
let periodoSeleccionadoGlobal = 0;

$(document).ready(function () {
    // 1. Cargas iniciales
    cargarGestiones();

    // =====================================================================
    // 2. CONFIGURACIÓN DEL SELECT2 (Buscador de Docentes)
    // =====================================================================
    $("#cboBuscarDocente").select2({
        placeholder: "Escriba el nombre, apellido o CI del docente...",
        allowClear: true,
        ajax: {
            url: "PanelConsultaAsistencia.aspx/BuscarDocentesSelect2", // URL Actualizada a la nueva página
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 300,
            data: function (params) {
                // Recordar que este WebMethod ahora lo obtiene usando la Sesión interna
                return JSON.stringify({ busqueda: params.term || "" });
            },
            processResults: function (data) {
                var items = data.d.Data || [];
                return {
                    results: $.map(items, function (item) {
                        return {
                            id: item.IdDocente,
                            text: item.CI + ' - ' + item.NombreCompleto,
                            imgUrl: item.ImagenUrl,
                            ci: item.CI,
                            nombres: item.NombreCompleto
                        }
                    })
                };
            },
            cache: true
        }
    });

    // =====================================================================
    // EVENTO: AL SELECCIONAR UN DOCENTE
    // =====================================================================
    $('#cboBuscarDocente').on('select2:select', function (e) {
        var data = e.params.data;

        // Asignamos el ID al input oculto
        $("#txtIdDocente").val(data.id);

        // Actualizamos la tarjeta de presentación
        $("#lblNombres").text(data.nombres);
        $("#lblDatos").text("CI: " + data.ci).removeClass("badge-secondary").addClass("badge-info");

        // Actualizamos la foto (si no tiene, mantiene la por defecto)
        let imagenBase = data.imgUrl ? data.imgUrl : "../images/sinImagen.png";
        $("#imgDoce").attr("src", imagenBase);
    });

    // =====================================================================
    // EVENTO: AL LIMPIAR EL SELECT2 (Hacer clic en la 'x')
    // =====================================================================
    $('#cboBuscarDocente').on('select2:unselect', function (e) {

        // 1. Restaurar Perfil
        $("#txtIdDocente").val("0");
        $("#lblNombres").text("Esperando selección...");
        $("#lblDatos").text("Seleccione un docente").removeClass("badge-info").addClass("badge-secondary");
        $("#imgDoce").attr("src", "../images/sinImagen.png");

        // 2. Restaurar Panel Maestro (Tarjetas) con el nuevo diseño
        $("#contenedorHorario").html(`
            <div class="alert alert-secondary text-center py-4 m-2 shadow-sm" style="font-size: 0.85rem;">
                <i class="fas fa-hand-pointer d-block mb-2 text-muted" style="font-size: 1.8rem;"></i>
                Realice la búsqueda para visualizar las materias asignadas.
            </div>
        `);

        // 3. Restaurar Panel Detalle (Tabla)
        if ($.fn.DataTable.isDataTable("#tbDetalle")) {
            $("#tbDetalle").DataTable().clear().draw();
        }

        $("#btnReporte").prop("disabled", true);
    });

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

// PASO 1: BOTÓN BUSCAR -> CARGA LAS TARJETAS (MAESTRO)
// =========================================================
$("#btnBuscar").on("click", function () {
    let idDocente = $("#txtIdDocente").val();
    let idGestion = $("#cboGestion").val();
    let idPeriodo = $("#cboPeriodo").val();

    if (idDocente === "0" || idDocente === "") {
        MostrarToastZer("Seleccione un docente.", "Atención", "warning"); return;
    }
    if (idGestion === "") {
        MostrarToastZer("Seleccione una Gestión.", "Atención", "warning"); return;
    }
    if (idPeriodo === "") {
        MostrarToastZer("Seleccione un Periodo de Pago.", "Atención", "warning"); return;
    }

    // Guardamos el periodo globalmente para cuando el usuario haga clic en una tarjeta
    periodoSeleccionadoGlobal = parseInt(idPeriodo);

    $("#loadinzero").LoadingOverlay("show");

    // NOTA: No enviamos IdCarrera porque el WebMethod lo sacará de la Session
    $.ajax({
        type: "POST",
        url: "ConsultasDetalleGeneral.aspx/ObtenerHorariosAgrupados",
        data: JSON.stringify({ idDocente: parseInt(idDocente), idGestion: parseInt(idGestion) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#loadinzero").LoadingOverlay("hide");

            if (response.d.Estado) {
                renderizarTarjetasMaterias(response.d.Data);
            } else {
                MostrarToastZer(response.d.Mensaje, "Error", "error");
            }
        },
        error: function (xhr) {
            $("#loadinzero").LoadingOverlay("hide");
            MostrarToastZer("Error de comunicación.", "Error", "error");
        }
    });
});

// =========================================================
// PASO 2: RENDERIZAR TARJETAS EN EL PANEL IZQUIERDO
// =========================================================
function renderizarTarjetasMaterias(listaHorarios) {
    let contenedor = $("#contenedorHorario");
    contenedor.empty();

    if (listaHorarios.length === 0) {
        contenedor.html(`
            <div class="alert alert-warning text-center py-4 m-2 shadow-sm" style="font-size: 0.85rem;">
                <i class="fas fa-exclamation-triangle d-block mb-2 text-warning" style="font-size: 1.5rem;"></i> 
                El docente no tiene asignaciones en esta gestión.
            </div>
        `);
        // Limpiar tabla si estaba llena
        if ($.fn.DataTable.isDataTable("#tbDetalle")) {
            $("#tbDetalle").DataTable().clear().draw();
        }
        return;
    }

    // Dibujamos cada tarjeta usando tu DTO HorarioAgrupadoDTO
    listaHorarios.forEach(item => {
        let badgeTipo = item.NombreTipo.includes("Laboratorio") ? "badge-info" : "badge-primary";

        let tarjetaHTML = `
            <div class="card mb-2 shadow-sm border card-materia-hover btn-cargar-detalle" data-id="${item.IdAsignacion}">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="font-weight-bold text-dark m-0" style="line-height: 1.2;">
                            ${item.NombreMateria}
                        </h6>
                        <span class="badge badge-secondary ml-2">G. ${item.NombreGrupo}</span>
                    </div>
                    
                    <span class="badge ${badgeTipo} mb-2 shadow-sm">${item.NombreTipo}</span>
                    
                    <div class="bg-light p-2 rounded border" style="font-size: 0.8rem;">
                        <div class="font-weight-bold text-muted mb-1"><i class="fas fa-calendar-day mr-1"></i>${item.Dias}</div>
                        <div class="text-primary font-weight-bold"><i class="fas fa-clock mr-1"></i>${item.Horarios}</div>
                    </div>
                </div>
            </div>
        `;
        contenedor.append(tarjetaHTML);
    });
}

// PASO 3: CLIC EN LA TARJETA -> CARGA LA TABLA (DETALLE)
// =========================================================
$("#contenedorHorario").on("click", ".btn-cargar-detalle", function () {

    // 1. Efecto visual: Resaltar la tarjeta seleccionada
    $(".btn-cargar-detalle").removeClass("card-materia-active border-primary");
    $(this).addClass("card-materia-active border-primary");

    // 2. Obtener el IdAsignacion oculto en la tarjeta
    let idAsignacion = $(this).attr("data-id");

    // 3. Habilitar botón de reporte
    $("#btnReporte").prop("disabled", false);

    // 4. Bloquear solo el panel derecho
    $("#tbDetalle").closest(".card").LoadingOverlay("show");

    // 5. Cargar DataTables
    cargarTablaAsistencia(idAsignacion, periodoSeleccionadoGlobal);
});

// =========================================================
// PASO 4: DATATABLES DE ASISTENCIA
// =========================================================
function cargarTablaAsistencia(idAsignacion, idPeriodo) {
    if ($.fn.DataTable.isDataTable("#tbDetalle")) {
        $("#tbDetalle").DataTable().destroy();
    }

    $("#tbDetalle").DataTable({
        responsive: true,
        searching: false,
        info: true,
        pageLength: 10,
        "ajax": {
            "url": "ConsultasDetalleGeneral.aspx/ObtenerAsistenciaPorAsignacion",
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify({
                    idAsignacion: parseInt(idAsignacion),
                    idPeriodo: parseInt(idPeriodo)
                });
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    MostrarToastZer(json.d.Mensaje, "Error", "error");
                    return [];
                }
            },
            "complete": function () {
                $("#tbDetalle").closest(".card").LoadingOverlay("hide");
            }
        },
        "columns": [
            // Fecha
            {
                "data": null,
                "className": "align-middle text-left",
                render: function (data, type, row) {
                    return `
                        <div style="line-height: 1.2;">
                            <span class="font-weight-bold text-dark">${row.Fecha}</span><br>
                            <span class="text-muted" style="font-size: 11px;">${row.NombreDia}</span>
                        </div>
                    `;
                }
            },
            // Hora Oficial
            {
                "data": null,
                "className": "text-center align-middle text-nowrap",
                render: function (data, type, row) {
                    return `<span class="text-secondary">${row.EntradaOficial}</span> - <span class="text-secondary">${row.SalidaOficial}</span>`;
                }
            },
            // Hora Marcada
            {
                "data": null,
                "className": "text-center align-middle font-weight-bold text-nowrap",
                render: function (data, type, row) {
                    let colorCode = row.IdEstado === 2 ? "text-danger" : "text-dark";
                    let entrada = row.EntradaMarcada ? row.EntradaMarcada : "--:--";
                    let salida = row.SalidaMarcada ? row.SalidaMarcada : "--:--";
                    return `<span class="${colorCode}">${entrada}</span> - <span class="${colorCode}">${salida}</span>`;
                }
            },
            // Atrasos
            {
                "data": "MinutosAtraso",
                "className": "text-center align-middle font-weight-bold",
                render: function (data) {
                    return data > 0 ? `<span class="text-danger">${data} min</span>` : `<span class="text-success">0 min</span>`;
                }
            },
            // Estado Asistencia
            {
                "data": null,
                "className": "text-center align-middle",
                render: function (data, type, row) {
                    let badgeClass = "badge-secondary";
                    if (row.IdEstado === 1) badgeClass = "badge-success";
                    else if (row.IdEstado === 2) badgeClass = "badge-danger";
                    else if (row.IdEstado === 3) badgeClass = "badge-info";
                    else if (row.IdEstado === 4) badgeClass = "badge-warning text-dark";

                    return `<span class="badge ${badgeClass} shadow-sm px-2 py-1" style="font-size: 11px;">${row.EstadoAsistencia}</span>`;
                }
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// =========================================================