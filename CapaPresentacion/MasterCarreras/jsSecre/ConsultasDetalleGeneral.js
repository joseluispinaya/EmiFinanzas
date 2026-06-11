
const { jsPDF } = window.jspdf;
// Variable global para no perder el periodo al hacer clic en las tarjetas
let periodoSeleccionadoGlobal = 0;

let listaHorariosGlobal = [];
let materiaSelect = null;

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

        $("#lblTotalMin").text("Detalle de asistencias");

        // para la nueva table dinamica
        $("#contenedorMatrizAsistencia").html(`<div class="alert alert-warning text-center">Realice la búsqueda para visualizar.</div>`);

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
        url: "PanelNotificaciones.aspx/ListarPlanillasPorGestion",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdPeriodo}">${row.PeriodoPago}</option>`;
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

// PASO 2: RENDERIZAR TARJETAS EN EL PANEL IZQUIERDO

function renderizarTarjetasMaterias(listaHorarios) {

    // Guardar la lista completa globalmente
    listaHorariosGlobal = listaHorarios;

    let contenedor = $("#contenedorHorario");
    contenedor.empty();

    if (listaHorarios.length === 0) {
        contenedor.html(`
            <div class="alert alert-warning text-center py-4 m-2 shadow-sm" style="font-size: 0.85rem;">
                <i class="fas fa-exclamation-triangle d-block mb-2 text-warning" style="font-size: 1.5rem;"></i> 
                El docente no tiene asignaciones en esta gestión.
            </div>
        `);

        $("#lblTotalMin").text("Detalle de asistencias");
        // para la nueva table dinamica
        $("#contenedorMatrizAsistencia").html(`<div class="alert alert-warning text-center">Realice la búsqueda para visualizar.</div>`);

        // Limpiar tabla si estaba llena
        if ($.fn.DataTable.isDataTable("#tbDetalle")) {
            $("#tbDetalle").DataTable().clear().draw();
        }
        return;
    }

    listaHorarios.forEach((item, index) => {
        let badgeTipo = item.NombreTipo.includes("Laboratorio") ? "badge-info" : "badge-primary";

        let tarjetaHTML = `
            <div class="card mb-2 shadow-sm border card-materia-hover btn-cargar-detalle" data-index="${index}">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="font-weight-bold text-dark m-0" style="line-height: 1.2;">
                            ${item.NombreMateria}
                        </h6>
                        <span class="badge badge-secondary ml-2">G. ${item.NombreGrupo}</span>
                    </div>
                    
                    <span class="badge ${badgeTipo} mb-2 shadow-sm">${item.NombreTipo}</span>
                    
                    <div class="bg-light p-2 rounded border" style="font-size: 0.8rem;">
                        <div class="font-weight-bold text-muted mb-1"><i class="fas fa-calendar-alt mr-1"></i>${item.Dias}</div>
                        <div class="text-primary font-weight-bold"><i class="fas fa-clock mr-1"></i>${item.Horarios}</div>
                    </div>
                </div>
            </div>
        `;
        contenedor.append(tarjetaHTML);
    });
}

function renderizarTarjetasMateriasOriginal(listaHorarios) {
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
                        <div class="font-weight-bold text-muted mb-1"><i class="fas fa-calendar-alt mr-1"></i>${item.Dias}</div>
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

    materiaSelect = listaHorariosGlobal[$(this).data("index")];

    //console.log(materiaSelect);

    // 2. Obtener el IdAsignacion oculto en la tarjeta
    //let idAsignacion = $(this).attr("data-id");

    // 3. Habilitar botón de reporte
    $("#btnReporte").prop("disabled", false);

    // 4. Bloquear solo el panel
    $("#tbDetalle").closest(".card").LoadingOverlay("show");


    cargarDetalleListAsistencia(materiaSelect.IdAsignacion, periodoSeleccionadoGlobal);
    detalleListAsistenciaRpt(materiaSelect.IdAsignacion, periodoSeleccionadoGlobal);

    // 5. Cargar DataTables
    detallePlanillaAsignacion(materiaSelect.IdAsignacion);
});

// =========================================================
// PASO 4: DATATABLES DE ASISTENCIA
// =========================================================

let listAsistenciaRpt = [];
function detalleListAsistenciaRpt(idAsignacion, idPeriodo) {

    var request = {
        idAsignacion: parseInt(idAsignacion),
        idPeriodo: parseInt(idPeriodo)
    };

    $.ajax({
        url: "ConsultasDetalleGeneral.aspx/AsistenciaPorAsignacionRpt",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                listAsistenciaRpt = response.d.Data;
                renderizarMatrizAsistencia(listAsistenciaRpt);
            } else {
                MostrarAlerta("¡Advertencia!", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

// Suponiendo que 'datos' es lo que te devuelve response.d.Data
function renderizarMatrizAsistencia(datos) {

    //let totalMin = 0;

    let contenedor = $("#contenedorMatrizAsistencia");
    contenedor.empty();
    $("#lblTotalMin").text("Detalle de asistencias");

    if (!datos || datos.length === 0) {
        contenedor.html('<div class="alert alert-warning text-center">No hay registros de asistencia para mostrar.</div>');
        return;
    }

    let totalMinutos = datos.reduce((acc, item) => acc + parseInt(item.MinutosAtraso), 0);
    $("#lblTotalMin").text(`Total Atrasos: ${totalMinutos} Minutos`);

    // 1. Agrupamos los datos por Mes
    // Resultado esperado: { "ENERO": [{Dia: 26, Letra: 'P'}, ...], "FEBRERO": [...] }
    let mesesAgrupados = {};

    datos.forEach(item => {

        //totalMin = totalMin + parseInt(item.MinutosAtraso)

        if (!mesesAgrupados[item.NombreMes]) {
            mesesAgrupados[item.NombreMes] = [];
        }
        mesesAgrupados[item.NombreMes].push(item);
    });

    // 2. Construimos las 3 filas de la tabla (Encabezado de Meses, Fila de Fechas, Fila de Asistencia)
    let trMeses = `<tr><th class="align-middle text-center bg-primary text-white" style="width: 120px;">DETALLE</th>`;
    let trFechas = `<tr><td class="font-weight-bold text-left bg-light">FECHAS</td>`;
    let trAsistencia = `<tr><td class="font-weight-bold text-left bg-light">ASISTENCIA</td>`;

    // 3. Iteramos sobre los grupos para armar las columnas
    for (const mes in mesesAgrupados) {
        let diasDelMes = mesesAgrupados[mes];

        // El colspan del mes es la cantidad de días que tuvo clases en ese mes
        trMeses += `<th colspan="${diasDelMes.length}" class="text-center bg-primary text-white border-left border-right">${mes}</th>`;

        diasDelMes.forEach(d => {
            trFechas += `<td class="text-center font-weight-bold border">${d.Dia}</td>`;

            // Pintamos de rojo si es Falta (F), verde si es Presente (P)
            let colorLetra = "text-dark";
            if (d.EstadoLetra === 'P') colorLetra = "text-success";
            if (d.EstadoLetra === 'F') colorLetra = "text-danger";
            if (d.EstadoLetra === 'L') colorLetra = "text-warning";

            trAsistencia += `<td class="text-center font-weight-bold border ${colorLetra}">${d.EstadoLetra}</td>`;
        });
    }

    trMeses += `</tr>`;
    trFechas += `</tr>`;
    trAsistencia += `</tr>`;

    // 4. Armamos la tabla final y la inyectamos
    let tablaHTML = `
        <table class="table table-sm table-bordered shadow-sm" style="font-size: 0.85rem;">
            <thead>
                ${trMeses}
            </thead>
            <tbody>
                ${trFechas}
                ${trAsistencia}
            </tbody>
        </table>
    `;

    contenedor.html(tablaHTML);
}

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

let listaDetalleAsistencia = [];

function cargarDetalleListAsistencia(idAsignacion, idPeriodo) {

    var request = {
        idAsignacion: parseInt(idAsignacion),
        idPeriodo: parseInt(idPeriodo)
    };

    $.ajax({
        url: "ConsultasDetalleGeneral.aspx/ObtenerAsistenciaPorAsignacion",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                listaDetalleAsistencia = response.d.Data;
                //console.log(listaDetalleAsistencia);
            } else {
                MostrarAlerta("¡Advertencia!", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

let listaDetallePlanilla = [];

function detallePlanillaAsignacion(idAsignacion) {
    if ($.fn.DataTable.isDataTable("#tbDetalle")) {
        $("#tbDetalle").DataTable().destroy();
    }

    $("#tbDetalle").DataTable({
        responsive: true,
        searching: false,
        paging: false,
        info: false,
        "ajax": {
            "url": 'ConsultasDetalleGeneral.aspx/ObtenerPlanillaDetallePorAsignacion',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify({ idAsignacion: parseInt(idAsignacion) });
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    listaDetallePlanilla = json.d.Data;
                    //console.log(listaDetallePlanilla);
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
                $("#tbDetalle").closest(".card").LoadingOverlay("hide");
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

$("#btnReporte").on("click", function () {

    if (listaDetallePlanilla.length === 0) {
        MostrarToastZer("No existe detalle para generar el reporte.", "Advertencia", "warning");
        return;
    }

    let primeraFila = listaDetallePlanilla[0];

    $.ajax({
        url: "ConsultasDetalleGeneral.aspx/DetallePlanillaCabeceraReporte",
        type: "POST",
        data: JSON.stringify({ idDetalle: parseInt(primeraFila.IdDetalle) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let data = response.d.Data;

                if (data.IdEstadoPlanilla === 2) { // APROBADO

                    reportePagoyAsistenciaPDF(data);
                } else {
                    MostrarAlerta("¡Advertencia!", "La planilla no se encuentra APROBADO no puede generar reporte aun", "warning");
                }
            } else {
                MostrarAlerta("¡Advertencia!", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });

});

function reportePagoyAsistenciaPDF(cabecera) {

    // 1. Inicializamos el documento en formato Horizontal (Landscape), milímetros, tamaño A4
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Configuración de colores corporativos
    const colorAzulEMI = [0, 79, 159]; // #004F9F

    // =========================================================================
    // SECCIÓN 1: ENCABEZADO INSTITUCIONAL
    // =========================================================================
    let imgLogo = new Image();
    imgLogo.src = '/images/emiss.png';

    try {
        doc.addImage(imgLogo, 'PNG', 14, 10, 35, 15);
    } catch (e) {
        console.log("No se pudo cargar el logo, se omitirá en el PDF.");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ESCUELA MILITAR DE INGENIERÍA", 283, 14, { align: "right" });
    doc.text('"Mcal. ANTONIO JOSÉ DE SUCRE"', 283, 19, { align: "right" });
    doc.text("BOLIVIA", 259, 24, { align: "right" });

    // Línea separadora azul
    doc.setDrawColor(colorAzulEMI[0], colorAzulEMI[1], colorAzulEMI[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // =========================================================================
    // SECCIÓN 2: DATOS DEL DOCENTE, CARRERA Y PERIODO (MEJORADO)
    // =========================================================================
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    // --- FILA 1 (Y: 35) ---
    doc.setFont("helvetica", "bold"); doc.text("DOCENTE:", 14, 35);
    doc.setFont("helvetica", "normal"); doc.text(cabecera.Docente, 35, 35);

    doc.setFont("helvetica", "bold"); doc.text("CARRERA:", 120, 35);
    doc.setFont("helvetica", "normal"); doc.text(cabecera.NombreCarrera.toUpperCase(), 140, 35);

    doc.setFont("helvetica", "bold"); doc.text("MATERIA:", 200, 35);
    doc.setFont("helvetica", "normal"); doc.text(materiaSelect.NombreMateria, 220, 35);

    // --- FILA 2 (Y: 41) ---
    doc.setFont("helvetica", "bold"); doc.text("C.I.:", 14, 41);
    doc.setFont("helvetica", "normal"); doc.text(cabecera.NroCi, 35, 41);

    doc.setFont("helvetica", "bold"); doc.text("GESTIÓN:", 120, 41);
    doc.setFont("helvetica", "normal"); doc.text(cabecera.NombreGestion, 140, 41);

    doc.setFont("helvetica", "bold"); doc.text("DIAS:", 200, 41);
    doc.setFont("helvetica", "normal"); doc.text(materiaSelect.Dias, 220, 41);

    // --- FILA 3 (Y: 47) ---
    doc.setFont("helvetica", "bold"); doc.text("PERIODO:", 14, 47);
    doc.setFont("helvetica", "normal"); doc.text(cabecera.PeriodoPago.toUpperCase(), 35, 47);

    doc.setFont("helvetica", "bold"); doc.text("SEMANAS:", 120, 47);
    doc.setFont("helvetica", "normal"); doc.text(`${cabecera.SemanasMes} Semanas calculadas`, 140, 47);

    doc.setFont("helvetica", "bold"); doc.text("FECHAS:", 200, 47);
    doc.setFont("helvetica", "normal"); doc.text(`${cabecera.FechaInicio} al ${cabecera.FechaFin}`, 220, 47);


    // =========================================================================
    // SECCIÓN 3: PRIMERA TABLA - DETALLE DE PAGO DE HONORARIOS
    // =========================================================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`DETALLE DE PAGO DE HONORARIOS DEL ${cabecera.PeriodoPago.toUpperCase()}`, 148, 57, { align: "center" });

    let filaPlanilla = listaDetallePlanilla[0];
    let datosPlanilla = [[
        `${filaPlanilla.HT} / ${filaPlanilla.HP} / ${filaPlanilla.HL}`,
        `${filaPlanilla.TotalMinutosAtraso}`,
        `${filaPlanilla.TotalHorasNoTrabajadas}`,
        `${filaPlanilla.TotalHorasPeriodo}`,
        `${filaPlanilla.TotalHorasTrabajadas}`,
        `Bs. ${parseFloat(filaPlanilla.CostoHora).toFixed(2)}`,
        `Bs. ${parseFloat(filaPlanilla.IngresoTotal).toFixed(2)}`,
        `-Bs. ${parseFloat(filaPlanilla.TotalDescuentos).toFixed(2)}`,
        `Bs. ${parseFloat(filaPlanilla.TotalAPagar).toFixed(2)}`,
        "", // Columna Firma (Para espacio físico)
        ""  // Columna Nro CI (Para espacio físico)
    ]];

    doc.autoTable({
        startY: 62,
        head: [['Hrs(T/P/L)', 'Atraso(Min)', 'Hrs N/T', 'Hrs Per.', 'Hrs Trab.', 'Bs/Hr', 'Tot. Ingreso.', 'Dsctos.', 'Tot. Pago', 'Firma', 'Nro. CI']],
        body: datosPlanilla,
        theme: 'grid',
        headStyles: {
            fillColor: colorAzulEMI,
            textColor: 255,
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        bodyStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 9,
            minCellHeight: 14
        },
        // AMPLIAMOS EL ANCHO DE LAS COLUMNAS DE FIRMA Y CI
        columnStyles: {
            9: { cellWidth: 36 },  // Espacio amplio para Firma del Docente en la tabla
            10: { cellWidth: 24 }  // Espacio para registrar su CI manual si se requiere
        },
        didParseCell: function (data) {
            if (data.section === 'body') {
                if (data.column.index === 6) data.cell.styles.textColor = [40, 167, 69];
                if (data.column.index === 7) data.cell.styles.textColor = [220, 53, 69];
                if (data.column.index === 8) {
                    data.cell.styles.textColor = colorAzulEMI;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    // =========================================================================
    // SECCIÓN 4: SEGUNDA TABLA - DETALLE DE ASISTENCIAS
    // =========================================================================
    let finalY = doc.lastAutoTable.finalY + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`DETALLE DE ASISTENCIAS DE LA MATERIA`, 148, finalY, { align: "center" });

    let datosAsistencia = listaDetalleAsistencia.map((row, index) => {
        let entradaM = row.EntradaMarcada ? row.EntradaMarcada : '--:--';
        let salidaM = row.SalidaMarcada ? row.SalidaMarcada : '--:--';

        return [
            (index + 1).toString().padStart(2, '0'),
            row.Fecha,
            row.NombreDia.toUpperCase(),
            `${row.EntradaOficial} - ${row.SalidaOficial}`,
            `${entradaM} - ${salidaM}`,
            `${row.MinutosAtraso} min`,
            row.EstadoAsistencia.toUpperCase()
        ];
    });

    doc.autoTable({
        startY: finalY + 5,
        head: [['NRO', 'FECHA', 'DÍA', 'HORARIO OFICIAL (E - S)', 'MARCADO REAL (E - S)', 'PENALIZACIÓN', 'ESTADO']],
        body: datosAsistencia,
        theme: 'grid',
        headStyles: {
            fillColor: colorAzulEMI,
            textColor: 255,
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        bodyStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        didParseCell: function (data) {
            if (data.section === 'body') {
                if (data.column.index === 5) {
                    let minutos = parseInt(data.cell.raw.split(' ')[0]);
                    if (minutos > 0) {
                        data.cell.styles.textColor = [220, 53, 69];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
                if (data.column.index === 6) {
                    let estado = data.cell.raw;
                    if (estado === "FALTA") data.cell.styles.textColor = [220, 53, 69];
                    if (estado === "PRESENTE") data.cell.styles.textColor = [40, 167, 69];
                }
            }
        }
    });

    // =========================================================================
    // SECCIÓN 5: RECUADRO DE FIRMAS INFERIORES (SIDE-BY-SIDE)
    // =========================================================================
    let yFirmas = doc.lastAutoTable.finalY + 30; // Posicionamos 30mm abajo de la última tabla

    // Control de desborde: Si las firmas quedan muy abajo, las mandamos a una nueva página limpia
    if (yFirmas > 185) {
        doc.addPage();
        yFirmas = 50;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setDrawColor(160, 160, 160); // Gris formal para la línea
    doc.setLineWidth(0.3);

    // --- FIRMA IZQUIERDA: DOCENTE ---
    // Línea de 70mm de ancho (desde X:30 hasta X:100)
    doc.line(30, yFirmas, 100, yFirmas);
    doc.text("FIRMA DEL DOCENTE", 65, yFirmas + 5, { align: "center" });

    // --- FIRMA DERECHA: JEFE DE CARRERA ---
    // Línea de 70mm de ancho (desde X:195 hasta X:265)
    doc.line(195, yFirmas, 265, yFirmas);
    doc.text("FIRMA JEFE DE CARRERA", 230, yFirmas + 5, { align: "center" });


    // =========================================================================
    // SECCIÓN 6: PIE DE PÁGINA HISTÓRICO (PAGINACIÓN)
    // =========================================================================
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, 283, 202, { align: "right" });

        let fechaImpresion = new Date().toLocaleDateString('es-ES') + " " + new Date().toLocaleTimeString('es-ES');
        doc.text(`Impreso por Sistema: ${fechaImpresion}`, 14, 202);
    }

    // =========================================================================
    // DESCARGAR EL ARCHIVO PDF
    // =========================================================================
    let nombreArchivo = `Reporte_Honorarios_${cabecera.Docente.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
}

function reportePagoyAsistenciaPDFOriginal(cabecera) {

    // 1. Inicializamos el documento en formato Horizontal (Landscape), milímetros, tamaño A4
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Configuración de colores
    const colorAzulEMI = [0, 79, 159]; // #004F9F

    // =========================================================================
    // SECCIÓN 1: ENCABEZADO INSTITUCIONAL
    // =========================================================================

    // A) LOGO (Reemplaza la URL por la ruta real de tu logo o usa Base64)
    // Para jsPDF puro a veces es mejor usar un string en Base64 de tu logo.
    // Si usas una URL directa, asegúrate de que no haya problemas de CORS.
    let imgLogo = new Image();
    imgLogo.src = '/images/emiss.png'; // <-- AJUSTA TU RUTA AQUÍ

    // Usamos try/catch por si la imagen no carga rápido, no rompa el PDF
    try {
        doc.addImage(imgLogo, 'PNG', 14, 10, 35, 15);
    } catch (e) {
        console.log("No se pudo cargar el logo, se omitirá en el PDF.");
    }

    // B) TEXTO INSTITUCIONAL DERECHO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ESCUELA MILITAR DE INGENIERÍA", 283, 14, { align: "right" });
    doc.text('"Mcal. ANTONIO JOSÉ DE SUCRE"', 283, 19, { align: "right" });
    doc.text("BOLIVIA", 283, 24, { align: "center" });

    // Línea separadora azul
    doc.setDrawColor(colorAzulEMI[0], colorAzulEMI[1], colorAzulEMI[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // =========================================================================
    // SECCIÓN 2: DATOS DEL DOCENTE Y MATERIA
    // =========================================================================
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // Negro

    // Columna Izquierda (Docente y CI)
    doc.setFont("helvetica", "bold");
    doc.text("DOCENTE:", 14, 35);
    doc.setFont("helvetica", "normal");
    doc.text(cabecera.Docente, 35, 35);

    doc.setFont("helvetica", "bold");
    doc.text("C.I.:", 14, 41);
    doc.setFont("helvetica", "normal");
    doc.text(cabecera.NroCi, 35, 41);

    // Columna Central (Gestión y Periodo)
    doc.setFont("helvetica", "bold");
    doc.text("GESTIÓN:", 120, 35);
    doc.setFont("helvetica", "normal");
    doc.text(cabecera.NombreGestion, 140, 35);

    doc.setFont("helvetica", "bold");
    doc.text("PERIODO:", 120, 41);
    doc.setFont("helvetica", "normal");
    doc.text(cabecera.PeriodoPago.toUpperCase(), 140, 41);

    // Columna Derecha (Materia)
    doc.setFont("helvetica", "bold");
    doc.text("MATERIA:", 200, 35);
    doc.setFont("helvetica", "normal");
    // Usamos el nombre de la materia y le agregamos si es Laboratorio o Teoría
    let nombreMateriaCompleto = `${materiaSelect.NombreMateria} (${materiaSelect.NombreTipo})`;
    doc.text(nombreMateriaCompleto, 220, 35);


    // =========================================================================
    // SECCIÓN 3: PRIMERA TABLA - DETALLE DE PAGO DE HONORARIOS
    // =========================================================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`DETALLE DE PAGO DE HONORARIOS DEL ${cabecera.PeriodoPago.toUpperCase()}`, 148, 55, { align: "center" });

    // Preparamos los datos extrayéndolos de tu variable global listaDetallePlanilla[0]
    let filaPlanilla = listaDetallePlanilla[0];

    let datosPlanilla = [[
        `${filaPlanilla.HT} / ${filaPlanilla.HP} / ${filaPlanilla.HL}`, // Hrs(T/P/L)
        `${filaPlanilla.TotalMinutosAtraso}`,                           // Atraso
        `${filaPlanilla.TotalHorasNoTrabajadas}`,                       // Hrs N/T
        `${filaPlanilla.TotalHorasPeriodo}`,                            // Hrs Per.
        `${filaPlanilla.TotalHorasTrabajadas}`,                         // Hrs Trab.
        `Bs. ${parseFloat(filaPlanilla.CostoHora).toFixed(2)}`,         // Bs/Hr
        `Bs. ${parseFloat(filaPlanilla.IngresoTotal).toFixed(2)}`,      // Bruto
        `-Bs. ${parseFloat(filaPlanilla.TotalDescuentos).toFixed(2)}`,  // Descuentos
        `Bs. ${parseFloat(filaPlanilla.TotalAPagar).toFixed(2)}`,       // Total Pago
        "",                                                             // Firma (Vacío)
        ""                                                              // Nro CI (Vacío)
    ]];

    doc.autoTable({
        startY: 60,
        head: [['Hrs(T/P/L)', 'Atraso(Min)', 'Hrs N/T', 'Hrs Per.', 'Hrs Trab.', 'Bs/Hr', 'Bruto', 'Dsctos.', 'Tot. Pago', 'Firma', 'Nro. CI']],
        body: datosPlanilla,
        theme: 'grid',
        headStyles: {
            fillColor: colorAzulEMI,
            textColor: 255,
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        bodyStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 9,
            minCellHeight: 15 // Le damos altura para que el docente pueda firmar
        },
        didParseCell: function (data) {
            // Colores dinámicos para los montos financieros en el cuerpo de la tabla
            if (data.section === 'body') {
                if (data.column.index === 6) data.cell.styles.textColor = [40, 167, 69]; // Bruto (Verde)
                if (data.column.index === 7) data.cell.styles.textColor = [220, 53, 69]; // Descuento (Rojo)
                if (data.column.index === 8) {
                    data.cell.styles.textColor = colorAzulEMI; // Total Pagar (Azul EMI)
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    // =========================================================================
    // SECCIÓN 4: SEGUNDA TABLA - DETALLE DE ASISTENCIAS
    // =========================================================================
    // Obtenemos la posición Y donde terminó la primera tabla para dibujar debajo
    let finalY = doc.lastAutoTable.finalY + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`DETALLE DE ASISTENCIAS DEL ${cabecera.PeriodoPago.toUpperCase()}`, 148, finalY, { align: "center" });

    // Mapeamos los datos de la variable global listaDetalleAsistencia
    let datosAsistencia = listaDetalleAsistencia.map((row, index) => {
        let entradaM = row.EntradaMarcada ? row.EntradaMarcada : '--:--';
        let salidaM = row.SalidaMarcada ? row.SalidaMarcada : '--:--';

        return [
            (index + 1).toString().padStart(2, '0'), // NRO (ej. 01, 02)
            row.Fecha,                               // FECHA
            row.NombreDia.toUpperCase(),             // DÍA
            `${row.EntradaOficial} - ${row.SalidaOficial}`, // HORARIO OFICIAL
            `${entradaM} - ${salidaM}`,              // MARCADO REAL
            `${row.MinutosAtraso} min`,              // PENALIZACIÓN
            row.EstadoAsistencia.toUpperCase()       // ESTADO
        ];
    });

    doc.autoTable({
        startY: finalY + 5,
        head: [['NRO', 'FECHA', 'DÍA', 'HORARIO OFICIAL (E - S)', 'MARCADO REAL (E - S)', 'PENALIZACIÓN', 'ESTADO']],
        body: datosAsistencia,
        theme: 'grid',
        headStyles: {
            fillColor: colorAzulEMI,
            textColor: 255,
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        bodyStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 8
        },
        didParseCell: function (data) {
            // Colores dinámicos para la asistencia
            if (data.section === 'body') {
                // Columna Penalización (Rojo si hay atraso, negro si es 0)
                if (data.column.index === 5) {
                    let minutos = parseInt(data.cell.raw.split(' ')[0]);
                    if (minutos > 0) {
                        data.cell.styles.textColor = [220, 53, 69]; // Rojo
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
                // Columna Estado
                if (data.column.index === 6) {
                    let estado = data.cell.raw;
                    if (estado === "FALTA") data.cell.styles.textColor = [220, 53, 69]; // Rojo
                    if (estado === "PRESENTE") data.cell.styles.textColor = [40, 167, 69]; // Verde
                }
            }
        }
    });

    // =========================================================================
    // SECCIÓN 5: PIE DE PÁGINA (PAGINACIÓN Y FECHA IMPRESIÓN)
    // =========================================================================
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, 283, 200, { align: "right" });

        let fechaImpresion = new Date().toLocaleDateString('es-ES') + " " + new Date().toLocaleTimeString('es-ES');
        doc.text(`Impreso por Sistema: ${fechaImpresion}`, 14, 200);
    }

    // =========================================================================
    // DESCARGAR EL ARCHIVO
    // =========================================================================
    // Limpiamos el nombre para que el archivo PDF se guarde con un nombre bonito
    let nombreArchivo = `Reporte_${cabecera.Docente.replace(/\s+/g, '_')}_${materiaSelect.NombreMateria.replace(/\s+/g, '_')}.pdf`;

    // Abre el PDF en una nueva pestaña (o lo descarga automáticamente según el navegador)
    doc.save(nombreArchivo);
}

// =========================================================