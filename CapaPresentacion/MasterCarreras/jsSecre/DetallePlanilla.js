
// VARIABLES GLOBALES
const { jsPDF } = window.jspdf;
let idPlanillaGlobal = 0;
let estadoAccionGlobal = 0; // 2 = Aprobar, 3 = Rechazar

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
    cargarDetallePlanilla();

});

// FUNCIÓN 1: CARGAR DATOS DE CABECERA (RESUMEN)

function cargarCabeceraPlanilla() {
    $.ajax({
        type: "POST",
        url: "DetallePlanilla.aspx/ObtenerCabecera",
        data: JSON.stringify({ IdPlanilla: idPlanillaGlobal }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let data = response.d.Data;

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
                $("#panelAcciones").hide();
                $("#btnReporteDetalle").hide();
                $("#alertaObservacion").hide();

                let alertaContenedor = $("#alertaObservacion");
                let tituloAlerta = $("#lblTituloAlerta");

                if (data.IdEstadoPlanilla === 1) { // EN REVISIÓN
                    badge.addClass("badge-warning text-dark");

                    // Solo si es el Jefe de Carrera (IdRol 3) mostramos Aprobar/Rechazar
                    if (usuarioGlobal.IdRol === 3) {
                        $("#panelAcciones").show();
                        $("#btnReporteDetalle").show();
                    }

                } else if (data.IdEstadoPlanilla === 2) { // APROBADO
                    badge.addClass("badge-success");

                    // Si ya está aprobado, NADIE puede volver a aprobar/rechazar.
                    // Pero AMBOS (Secretaria y Jefe) pueden imprimir el reporte final.
                    $("#btnReporteDetalle").show();

                    // Opcional: Si el jefe dejó un comentario al aprobar ("Buen trabajo, todo cuadra")
                    if (data.ComentarioAuditoria && data.ComentarioAuditoria !== "Planilla generada en estado En Revisión.") {
                        alertaContenedor.removeClass("alert-danger").addClass("alert-success").css("border-left-color", "#28a745").show();
                        tituloAlerta.removeClass("text-danger").addClass("text-success").html('<i class="fas fa-check-circle mr-2"></i>Nota de Aprobación');
                        $("#lblMotivoAuditoria").text(data.ComentarioAuditoria);
                    }

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

function cargarCabeceraPlanillaOriginal() {
    $.ajax({
        type: "POST",
        url: "DetallePlanilla.aspx/ObtenerCabecera", // Tu WebMethod en el aspx.cs
        data: JSON.stringify({ IdPlanilla: idPlanillaGlobal }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let data = response.d.Data;

                // Llenamos los labels
                $("#lblGestion").text(data.NombreGestion);
                $("#lblPeriodo").text(data.PeriodoPago);
                $("#lblSemanas").text(`${data.SemanasMes} Semanas calculadas`);
                $("#lblUsuarioGenera").text(data.UsuarioRegistro);
                $("#lblFechaGenera").text(data.FechaCreacion);

                // Pintamos el Badge de Estado
                let badge = $("#badgeEstado");
                badge.text(data.EstadoPlanilla).removeClass("badge-secondary");

                if (data.IdEstadoPlanilla === 1) {
                    badge.addClass("badge-warning text-dark");
                    // Solo mostramos los botones de Aprobar/Rechazar si está En Revisión
                    $("#panelAcciones").show();
                } else if (data.IdEstadoPlanilla === 2) {
                    badge.addClass("badge-success");
                } else if (data.IdEstadoPlanilla === 3) {
                    badge.addClass("badge-danger");
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

// FUNCIÓN 2: CARGAR TABLA DE DETALLES
function cargarDetallePlanilla() {
    $("#tbDetallePlanilla").DataTable({
        responsive: true,
        searching: true, // Útil por si la planilla tiene muchos docentes
        paging: false,   // Quitamos la paginación para ver todo el reporte de corrido
        info: false,
        "ajax": {
            "url": 'DetallePlanilla.aspx/ObtenerDetalles', // Tu WebMethod
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "beforeSend": function () {
                $("#tbDetallePlanilla").closest(".card").LoadingOverlay("show");
            },
            "data": function () {
                return JSON.stringify({ IdPlanilla: idPlanillaGlobal });
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
                $("#tbDetallePlanilla").closest(".card").LoadingOverlay("hide");
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
            {
                "data": null,
                "className": "align-middle text-center",
                render: function (data, type, row) {
                    return `${row.HT} - ${row.HP} - ${row.HL}`;
                }
            },
            { "data": "CostoHora", "className": "align-middle text-center", render: $.fn.dataTable.render.number(',', '.', 2, 'Bs. ') },
            { "data": "TotalHorasPeriodo", "className": "align-middle text-center font-weight-bold" },
            { "data": "TotalHorasNoTrabajadas", "className": "text-center align-middle" },
            {
                "data": "TotalMinutosAtraso",
                "className": "align-middle text-center font-weight-bold",
                render: function (data) {
                    return data > 0 ? `<span class="text-danger">${data}</span>` : `<span class="text-success">0</span>`;
                }
            },
            {
                "data": "IngresoTotal",
                "className": "text-right align-middle text-success text-nowrap",
                render: function (data) { return 'Bs. ' + parseFloat(data).toFixed(2); }
            },
            { "data": "TotalDescuentos", "className": "align-middle text-danger", render: $.fn.dataTable.render.number(',', '.', 2, '-Bs. ') },
            { "data": "TotalAPagar", "className": "align-middle text-center text-primary text-nowrap font-weight-bold", render: $.fn.dataTable.render.number(',', '.', 2, 'Bs. ') }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
        // SUMATORIA TOTAL EN EL FOOTER
        "footerCallback": function (row, data, start, end, display) {
            let api = this.api();

            // Sumamos la columna TotalAPagar (Índice 7)
            let total = api.column(8).data().reduce(function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }, 0);

            // Formateamos y actualizamos el footer
            $(api.column(8).footer()).html('Bs. ' + total.toFixed(2));
        }
    });
}

// EVENTOS DE LOS BOTONES APROBAR Y RECHAZAR

$("#btnAbrirRechazar").on("click", function () {
    estadoAccionGlobal = 3; // 3 = Rechazado

    // Configuración visual del Modal para Rechazo
    $("#modalHeaderAuditoria").removeClass("bg-success").addClass("bg-danger");
    $("#modalTituloAuditoria").html('<i class="fas fa-times-circle mr-2"></i>Rechazar Planilla');
    $("#modalMensajeAuditoria").text("¿Está seguro de rechazar esta planilla? Debe indicar el motivo.");
    $("#txtComentarioAuditoria").val("").removeClass("is-invalid");
    $("#errorComentario").addClass("d-none");

    $("#modalAuditoria").modal("show");
});

$("#btnAbrirAprobar").on("click", function () {
    estadoAccionGlobal = 2; // 2 = Aprobado

    // Configuración visual del Modal para Aprobación
    $("#modalHeaderAuditoria").removeClass("bg-danger").addClass("bg-success");
    $("#modalTituloAuditoria").html('<i class="fas fa-check-circle mr-2"></i>Aprobar Planilla');
    $("#modalMensajeAuditoria").text("¿Está seguro de aprobar esta planilla? Puede dejar una nota opcional.");
    $("#txtComentarioAuditoria").val("").removeClass("is-invalid");
    $("#errorComentario").addClass("d-none");

    $("#modalAuditoria").modal("show");
});

// EVENTO: CONFIRMAR ACCIÓN EN EL MODAL
$("#btnConfirmarAccion").on("click", function () {
    let comentario = $("#txtComentarioAuditoria").val().trim();

    // Validar comentario OBLIGATORIO si es Rechazo
    if (estadoAccionGlobal === 3 && comentario === "") {
        $("#txtComentarioAuditoria").addClass("is-invalid");
        $("#errorComentario").removeClass("d-none");
        return;
    }

    $("#btnConfirmarAccion").prop("disabled", true).text("Procesando...");

    $.ajax({
        type: "POST",
        url: "DetallePlanilla.aspx/CambiarEstado", // Tu WebMethod
        data: JSON.stringify({
            idPlanilla: idPlanillaGlobal,
            idEstadoNuevo: estadoAccionGlobal,
            comentario: comentario
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAuditoria").modal("hide");
            $("#btnConfirmarAccion").prop("disabled", false).text("Confirmar");

            if (response.d.Estado) {
                swal({
                    title: "¡Operación Exitosa!",
                    text: response.d.Mensaje,
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                // Ocultamos los botones y refrescamos la cabecera para ver el nuevo estado
                $("#panelAcciones").slideUp();
                cargarCabeceraPlanilla();
            } else {
                swal("Error", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalAuditoria").modal("hide");
            $("#btnConfirmarAccion").prop("disabled", false).text("Confirmar");
            swal("Error", "Ocurrió un problema de conexión al procesar la acción.", "error");
        }
    });
});

$("#btnReporteDetalle").on("click", function () {
    // Extraemos los datos directamente del DataTable para no hacer otra consulta
    if ($.fn.DataTable.isDataTable("#tbDetallePlanilla")) {
        let tabla = $("#tbDetallePlanilla").DataTable();
        let datosTabla = tabla.rows().data().toArray();

        if (datosTabla.length > 0) {
            generarReportePlanillaPDF(datosTabla);
        } else {
            MostrarToastZer("No hay datos en la tabla para imprimir.", "Atención", "warning");
        }
    }
});

function generarReportePlanillaPDF(listaDetalles) {
    // 1. Configuración Inicial (Horizontal / Landscape)
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const fechaActual = new Date().toLocaleDateString("es-BO");

    // Extracción de datos de la interfaz
    const idPlanilla = $("#lblIdPlanilla").text();
    const gestionTexto = $("#lblGestion").text();
    const periodoTexto = $("#lblPeriodo").text();
    const estadoPlanilla = $("#badgeEstado").text();
    const semanasMes = $("#lblSemanas").text();

    // Cálculos de resumen
    const totalDocentes = listaDetalles.length;
    const granTotalPagar = listaDetalles.reduce((suma, item) => suma + parseFloat(item.TotalAPagar), 0);

    // ==========================================
    // 2. ENCABEZADO CORPORATIVO
    // ==========================================

    var img = new Image();
    img.src = "/images/emiss.png";
    try {
        doc.addImage(img, 'PNG', 15, 10, 35, 15);
    } catch (e) {
        console.warn("Logo no disponible");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 79, 159);
    doc.text("PLANILLA DE PAGO DE HONORARIOS", pageWidth - 15, 16, { align: "right" });

    doc.setTextColor(50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Unidad Académica: Riberalta", pageWidth - 15, 21, { align: "right" });
    doc.text(`Fecha de Emisión: ${fechaActual}`, pageWidth - 15, 25, { align: "right" });

    doc.setDrawColor(0, 79, 159);
    doc.setLineWidth(0.5);
    doc.line(15, 28, pageWidth - 15, 28);

    // --- Bloque de Información ---
    doc.setTextColor(0);
    doc.setFontSize(9);

    doc.setFont("helvetica", "bold"); doc.text("NRO. PLANILLA:", 15, 34);
    doc.setFont("helvetica", "normal"); doc.text(idPlanilla.padStart(5, '0'), 45, 34);
    doc.setFont("helvetica", "bold"); doc.text("GESTIÓN:", 15, 39);
    doc.setFont("helvetica", "normal"); doc.text(gestionTexto.toUpperCase(), 45, 39);

    doc.setFont("helvetica", "bold"); doc.text("PERIODO:", 100, 34);
    doc.setFont("helvetica", "normal"); doc.text(periodoTexto.toUpperCase(), 120, 34);
    doc.setFont("helvetica", "bold"); doc.text("CÁLCULO:", 100, 39);
    doc.setFont("helvetica", "normal"); doc.text(semanasMes, 120, 39);

    doc.setFont("helvetica", "bold"); doc.text("ESTADO:", 200, 34);
    if (estadoPlanilla.includes("Aprobado")) doc.setTextColor(40, 167, 69);
    else if (estadoPlanilla.includes("Rechazado")) doc.setTextColor(220, 53, 69);
    else doc.setTextColor(255, 193, 7);
    doc.text(estadoPlanilla.toUpperCase(), 220, 34);

    doc.setTextColor(0);
    doc.setFont("helvetica", "bold"); doc.text("TOTAL PAGO:", 200, 39);
    doc.setFont("helvetica", "normal"); doc.text(`Bs. ${granTotalPagar.toFixed(2)}`, 225, 39);

    // ==========================================
    // 3. TABLA DE DETALLES (ACTUALIZADA CON TODAS LAS COLUMNAS)
    // ==========================================

    // Retiramos los saltos de línea (\n) porque ahora hay espacio de sobra
    const headers = [["NRO", "DOCENTE Y MATERIA", "CARGA", "COSTO/HR", "HRS. MES", "HRS. NO TRAB.", "ATRASO (MIN)", "INGRESO TOTAL", "DESCUENTO", "TOTAL PAGAR"]];

    const data = listaDetalles.map((item, index) => [
        (index + 1).toString().padStart(2, '0'),
        `${item.Docente.toUpperCase()}\n${item.NombreMateria}\nG. ${item.NombreGrupo} | ${item.NombreTipo}`,
        `${item.HT}-${item.HP}-${item.HL}`,
        `Bs. ${item.CostoHora.toFixed(2)}`,
        item.TotalHorasPeriodo,
        item.TotalHorasNoTrabajadas,
        item.TotalMinutosAtraso > 0 ? `${item.TotalMinutosAtraso}` : '0',
        `Bs. ${item.IngresoTotal.toFixed(2)}`,
        `-Bs. ${item.TotalDescuentos.toFixed(2)}`,
        `Bs. ${item.TotalAPagar.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 45,
        head: headers,
        body: data,
        theme: 'grid',
        tableWidth: 'auto', // Forza a ocupar todo el espacio entre márgenes
        styles: { fontSize: 7.5, cellPadding: 2, valign: 'middle' },
        headStyles: {
            fillColor: [0, 79, 159],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            // ELIMINAMOS cellWidth de la columna 1. Así absorberá todo el ancho sobrante de la hoja.
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 22, halign: 'right' },
            4: { cellWidth: 18, halign: 'center' },
            5: { cellWidth: 22, halign: 'center' },
            6: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
            7: { cellWidth: 28, halign: 'right' },
            8: { cellWidth: 25, halign: 'right' }, // Alineado a la derecha por ser moneda
            9: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
        },
        willDrawCell: function (data) {
            if (data.section === 'body') {
                if (data.column.index === 6 && data.cell.raw !== '0') {
                    doc.setTextColor(220, 53, 69);
                }
                if (data.column.index === 7) {
                    doc.setTextColor(40, 167, 69);
                }
                if (data.column.index === 8) {
                    doc.setTextColor(220, 53, 69);
                }
                if (data.column.index === 9) {
                    doc.setTextColor(0, 123, 255);
                }
            }
        },
        foot: [[
            { content: 'GRAN TOTAL A PAGAR:', colSpan: 9, styles: { halign: 'right', fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' } },
            { content: `Bs. ${granTotalPagar.toFixed(2)}`, styles: { halign: 'right', fillColor: [240, 240, 240], textColor: [0, 123, 255], fontStyle: 'bold' } }
        ]],
        margin: { left: 10, right: 10 },
        didDrawPage: function (data) {
            const str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(str, pageWidth - 20, pageHeight - 10);
            doc.text(`Planilla generada desde Sistema Académico - Registros Totales: ${totalDocentes}`, 10, pageHeight - 10);
        }
    });

    // ==========================================
    // 4. FIRMAS
    // ==========================================

    let finalY = doc.lastAutoTable.finalY;

    if (finalY + 40 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    const firmaY = finalY + 40;
    doc.setDrawColor(100);

    // Firma 1 (Izquierda)
    doc.line(40, firmaY, 110, firmaY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let nombreImprime = `${usuarioGlobal.Nombres} ${usuarioGlobal.Apellidos}`.toUpperCase();
    doc.text(nombreImprime, 75, firmaY + 5, { align: "center" });

    doc.setFont("helvetica", "normal");
    let cargoImprime = `${usuarioGlobal.NombreRol} ${usuarioGlobal.NombreCarrera}`.toUpperCase();
    doc.text(cargoImprime, 75, firmaY + 10, { align: "center" });

    // Firma 2 (Derecha)
    doc.line(pageWidth - 110, firmaY, pageWidth - 40, firmaY);
    doc.setFont("helvetica", "bold");
    doc.text("Vº Bº DIRECCIÓN ACADÉMICA / FINANZAS", pageWidth - 75, firmaY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Sello y Firma de Autorización", pageWidth - 75, firmaY + 10, { align: "center" });

    // ==========================================
    // 5. GUARDAR PDF
    // ==========================================
    const nombreArchivo = `Planilla_${gestionTexto}_${periodoTexto.replace(/\s+/g, '')}.pdf`;
    doc.save(nombreArchivo);
}

function generarReportePlanillaPDFOriginal(listaDetalles) {
    // 1. Configuración Inicial (Horizontal / Landscape)
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const fechaActual = new Date().toLocaleDateString("es-BO");

    // Extracción de datos de la interfaz (Las tarjetas de arriba)
    const idPlanilla = $("#lblIdPlanilla").text();
    const gestionTexto = $("#lblGestion").text();
    const periodoTexto = $("#lblPeriodo").text();
    const estadoPlanilla = $("#badgeEstado").text();
    const semanasMes = $("#lblSemanas").text(); // ej: "4 Semanas calculadas"

    // Cálculos de resumen
    const totalDocentes = listaDetalles.length;
    const granTotalPagar = listaDetalles.reduce((suma, item) => suma + parseFloat(item.TotalAPagar), 0);

    // ==========================================
    // 2. ENCABEZADO CORPORATIVO
    // ==========================================

    // Logo (Izquierda)
    var img = new Image();
    img.src = "/images/emiss.png"; // Asegúrate que la ruta sea correcta
    try {
        doc.addImage(img, 'PNG', 15, 10, 35, 15);
    } catch (e) {
        console.warn("Logo no disponible");
    }

    // Título Principal (Derecha)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 79, 159); // Azul corporativo
    doc.text("PLANILLA DE PAGO DE HONORARIOS", pageWidth - 15, 16, { align: "right" });

    doc.setTextColor(50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Unidad Académica: Riberalta", pageWidth - 15, 21, { align: "right" });
    doc.text(`Fecha de Emisión: ${fechaActual}`, pageWidth - 15, 25, { align: "right" });

    // Línea divisoria
    doc.setDrawColor(0, 79, 159);
    doc.setLineWidth(0.5);
    doc.line(15, 28, pageWidth - 15, 28);

    // --- Bloque de Información ---
    doc.setTextColor(0);
    doc.setFontSize(9);

    // Columna 1
    doc.setFont("helvetica", "bold"); doc.text("NRO. PLANILLA:", 15, 34);
    doc.setFont("helvetica", "normal"); doc.text(idPlanilla.padStart(5, '0'), 45, 34);
    doc.setFont("helvetica", "bold"); doc.text("GESTIÓN:", 15, 39);
    doc.setFont("helvetica", "normal"); doc.text(gestionTexto.toUpperCase(), 45, 39);

    // Columna 2
    doc.setFont("helvetica", "bold"); doc.text("PERIODO:", 100, 34);
    doc.setFont("helvetica", "normal"); doc.text(periodoTexto.toUpperCase(), 120, 34);
    doc.setFont("helvetica", "bold"); doc.text("CÁLCULO:", 100, 39);
    doc.setFont("helvetica", "normal"); doc.text(semanasMes, 120, 39);

    // Columna 3
    doc.setFont("helvetica", "bold"); doc.text("ESTADO:", 200, 34);
    // Color según estado
    if (estadoPlanilla.includes("Aprobado")) doc.setTextColor(40, 167, 69); // Verde
    else if (estadoPlanilla.includes("Rechazado")) doc.setTextColor(220, 53, 69); // Rojo
    else doc.setTextColor(255, 193, 7); // Amarillo/Warning
    doc.text(estadoPlanilla.toUpperCase(), 220, 34);

    doc.setTextColor(0);
    doc.setFont("helvetica", "bold"); doc.text("TOTAL PAGO: ", 200, 39);
    doc.setFont("helvetica", "normal"); doc.text(`Bs. ${granTotalPagar.toFixed(2)}`, 220, 39);

    // ==========================================
    // 3. TABLA DE DETALLES
    // ==========================================

    const headers = [["NRO", "DOCENTE Y MATERIA", "CARGA", "COSTO/HR", "HRS. MES", "ATRASO", "DESCUENTO", "TOTAL PAGAR"]];

    // Mapeo adaptado a tu nueva estructura visual
    const data = listaDetalles.map((item, index) => [
        (index + 1).toString().padStart(2, '0'),
        // Concatenamos con saltos de línea (\n) para que autotable lo ponga en varias líneas
        `${item.Docente.toUpperCase()}\n${item.NombreMateria}\nG. ${item.NombreGrupo} | ${item.NombreTipo}`,
        `${item.HT}-${item.HP}-${item.HL}`,
        `Bs. ${item.CostoHora.toFixed(2)}`,
        item.TotalHorasPeriodo,
        item.TotalMinutosAtraso > 0 ? `${item.TotalMinutosAtraso} min` : '0',
        `-Bs. ${item.TotalDescuentos.toFixed(2)}`,
        `Bs. ${item.TotalAPagar.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 45,
        head: headers,
        body: data,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, valign: 'middle' },
        headStyles: {
            fillColor: [0, 79, 159],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 90 }, // Más ancha para albergar Docente + Materia
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            6: { cellWidth: 30, halign: 'right' },
            7: { cellWidth: 35, halign: 'right', fontStyle: 'bold' } // Total a Pagar
        },
        // Colores condicionales en el cuerpo de la tabla
        willDrawCell: function (data) {
            if (data.section === 'body') {
                // Atraso (Rojo si hay)
                if (data.column.index === 5 && data.cell.raw !== '0') {
                    doc.setTextColor(220, 53, 69);
                }
                // Descuento (Siempre Rojo)
                if (data.column.index === 6) {
                    doc.setTextColor(220, 53, 69);
                }
                // Total a Pagar (Verde oscuro)
                if (data.column.index === 7) {
                    doc.setTextColor(40, 167, 69);
                }
            }
        },
        // FOOTER PARA EL GRAN TOTAL
        foot: [[
            { content: 'GRAN TOTAL A PAGAR:', colSpan: 7, styles: { halign: 'right', fillColor: [240, 240, 240], textColor: 0 } },
            { content: `Bs. ${granTotalPagar.toFixed(2)}`, styles: { halign: 'right', fillColor: [240, 240, 240], textColor: [40, 167, 69] } }
        ]],
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
            const str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(str, pageWidth - 25, pageHeight - 10);
            doc.text(`Planilla generada desde Sistema Académico - Registros Totales: ${totalDocentes}`, 15, pageHeight - 10);
        }
    });

    // ==========================================
    // 4. FIRMAS
    // ==========================================

    let finalY = doc.lastAutoTable.finalY;

    if (finalY + 40 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    const firmaY = finalY + 40;
    doc.setDrawColor(100);

    // Firma 1 (Izquierda) - El usuario logueado (Quien elabora o revisa)
    doc.line(40, firmaY, 110, firmaY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let nombreImprime = `${usuarioGlobal.Nombres} ${usuarioGlobal.Apellidos}`.toUpperCase();
    doc.text(nombreImprime, 75, firmaY + 5, { align: "center" });

    doc.setFont("helvetica", "normal");
    let cargoImprime = `${usuarioGlobal.NombreRol} ${usuarioGlobal.NombreCarrera}`.toUpperCase();
    doc.text(cargoImprime, 75, firmaY + 10, { align: "center" });

    // Firma 2 (Derecha) - Autoridad Financiera / Gerencia
    doc.line(pageWidth - 110, firmaY, pageWidth - 40, firmaY);
    doc.setFont("helvetica", "bold");
    doc.text("Vº Bº DIRECCIÓN ACADÉMICA / FINANZAS", pageWidth - 75, firmaY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Sello y Firma de Autorización", pageWidth - 75, firmaY + 10, { align: "center" });

    // ==========================================
    // 5. GUARDAR PDF
    // ==========================================
    const nombreArchivo = `Planilla_${gestionTexto}_${periodoTexto.replace(/\s+/g, '')}.pdf`;
    doc.save(nombreArchivo);
}

// fin