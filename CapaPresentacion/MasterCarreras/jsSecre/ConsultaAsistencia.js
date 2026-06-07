
const { jsPDF } = window.jspdf;
// VARIABLES GLOBALES EN MEMORIA
let horariosGlobales = [];
let asistenciasGlobales = [];

$(document).ready(function () {
    cargarGestiones();

    // 1. CONFIGURACIÓN DEL SELECT2 (Buscador de Docentes)
    $("#cboBuscarDocente").select2({
        placeholder: "Escriba el nombre, apellido o CI del docente...",
        allowClear: true,
        ajax: {
            url: "PanelConsultaAsistencia.aspx/BuscarDocentesSelect2",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 300, // Espera 300ms después de que el usuario deja de escribir
            data: function (params) {
                return JSON.stringify({ busqueda: params.term || "" });
            },
            processResults: function (data) {
                var items = data.d.Data || [];
                return {
                    results: $.map(items, function (item) {
                        return {
                            id: item.IdDocente,
                            text: item.CI + ' - ' + item.NombreCompleto,
                            // Guardamos datos extra para usarlos al seleccionar
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

    // EVENTO: Al seleccionar un docente del Select2
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

    // EVENTO: Al limpiar el Select2
    $('#cboBuscarDocente').on('select2:unselect', function (e) {
        $("#txtIdDocente").val("0");
        $("#lblNombres").text("Esperando..");
        $("#lblDatos").text("Seleccione un docente").removeClass("badge-info").addClass("badge-secondary");
        $("#imgDoce").attr("src", "../images/sinImagen.png");

        // Limpiamos los paneles y ocultamos las materias
        $("#seccionMaterias").hide();
        $("#contenedorHorario").html(`
            <div class="alert alert-secondary text-center py-4 mb-0 shadow-sm" style="font-size: 0.85rem;">
                <i class="fas fa-info-circle d-block mb-2" style="font-size: 1.5rem;"></i> 
                Realice la búsqueda para visualizar el horario asignado.
            </div>
        `);
        if ($.fn.DataTable.isDataTable("#tbDetalle")) {
            $("#tbDetalle").DataTable().clear().draw();
        }
        $("#btnReporte").prop("disabled", true);
    });

    // =====================================================================
    // 2. EVENTO BUSCAR ASISTENCIA
    // =====================================================================
    $("#btnBuscar").on("click", function () {
        let idDocente = $("#txtIdDocente").val();
        let idGestion = $("#cboGestion").val();
        let idPeriodo = $("#cboPeriodo").val();

        if (idDocente === "0" || idDocente === "") {
            MostrarToastZer("Por favor, seleccione un docente del buscador.", "Atención", "warning");
            $("#cboBuscarDocente").focus();
            return;
        }
        if (idGestion === "") {
            MostrarToastZer("Por favor, seleccione una Gestión.", "Atención", "warning");
            return;
        }
        if (idPeriodo === "") {
            MostrarToastZer("Por favor, seleccione un Periodo de Pago.", "Atención", "warning");
            return;
        }

        $("#btnReporte").prop("disabled", true); // Bloqueamos reporte temporalmente
        $("#loadinzero").LoadingOverlay("show"); // Bloqueamos el contenedor principal

        // Peticiones AJAX en paralelo
        let reqHorario = $.ajax({
            type: "POST",
            url: "PanelConsultaAsistencia.aspx/ObtenerHorario",
            data: JSON.stringify({ idDocente: parseInt(idDocente), idGestion: parseInt(idGestion) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });

        let reqAsistencia = $.ajax({
            type: "POST",
            url: "PanelConsultaAsistencia.aspx/ObtenerAsistencia",
            data: JSON.stringify({ idDocente: parseInt(idDocente), idGestion: parseInt(idGestion), idPeriodo: parseInt(idPeriodo) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });

        // Esperamos a que ambas terminen
        $.when(reqHorario, reqAsistencia).done(function (resH, resA) {
            $("#loadinzero").LoadingOverlay("hide");

            let dataH = resH[0].d;
            let dataA = resA[0].d;

            if (dataH.Estado && dataA.Estado) {
                // Guardamos en las variables globales
                horariosGlobales = dataH.Data;
                asistenciasGlobales = dataA.Data;

                // Disparamos la creación de las tarjetas de materia
                procesarTarjetasMateria();
            } else {
                MostrarToastZer("Ocurrió un error al cargar los datos.", "Error", "error");
            }
        }).fail(function () {
            $("#loadinzero").LoadingOverlay("hide");
            MostrarToastZer("Error de comunicación con el servidor.", "Error", "error");
        });

    });

}); // Fin document.ready

// 3. GENERAR TARJETAS DE MATERIA (Filtro Dinámico)
function procesarTarjetasMateria() {
    let contenedor = $("#contenedorMaterias");
    contenedor.empty();

    // Extraemos las materias únicas (sin duplicados)
    let materiasUnicas = [...new Set(horariosGlobales.map(item => item.NombreMateria))];

    if (materiasUnicas.length === 0) {
        $("#seccionMaterias").hide();
        $("#contenedorHorario").html(`
            <div class="alert alert-warning text-center py-3 mb-0" style="font-size: 0.85rem;">
                <i class="fas fa-exclamation-triangle d-block mb-2 text-warning" style="font-size: 1.5rem;"></i> 
                El docente no tiene horarios asignados activos en esta Gestión.
            </div>
        `);
        if ($.fn.DataTable.isDataTable("#tbDetalle")) {
            $("#tbDetalle").DataTable().clear().draw();
        }
        return;
    }

    $("#seccionMaterias").show();
    $("#btnReporte").prop("disabled", false);

    // Creamos los botones
    materiasUnicas.forEach((materia, index) => {
        let btn = $(`<button type="button" class="btn btn-outline-primary font-weight-bold mr-2 mb-2 btn-materia shadow-sm" style="border-radius: 20px;">
                        ${materia}
                     </button>`);

        btn.on("click", function () {
            // Efecto visual activo/inactivo
            $(".btn-materia").removeClass("btn-primary text-white").addClass("btn-outline-primary");
            $(this).removeClass("btn-outline-primary").addClass("btn-primary text-white");

            // Filtramos la vista
            filtrarYRenderizarVista(materia);
        });

        contenedor.append(btn);

        // Auto-clic en la primera materia por defecto
        if (index === 0) {
            btn.click();
        }
    });
}

// 4. RENDERIZAR HORARIO LATERAL Y TABLA SEGÚN MATERIA SELECCIONADA
function filtrarYRenderizarVista(nombreMateria) {

    // Filtramos las variables globales
    let horarioFiltrado = horariosGlobales.filter(h => h.NombreMateria === nombreMateria);
    let asistenciaFiltrada = asistenciasGlobales.filter(a => a.NombreMateria === nombreMateria);

    // --- 1. Renderizar Horario Lateral ---
    let divHorario = $("#contenedorHorario");
    divHorario.empty();

    let htmlHorario = "";
    horarioFiltrado.forEach(item => {
        htmlHorario += `
            <div class="border rounded p-2 mb-2 bg-white shadow-sm" style="border-left: 3px solid #004F9F !important;">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge badge-dark">${item.NombreDia}</span>
                    <small class="font-weight-bold text-success"><i class="far fa-clock mr-1"></i>${item.HoraInicio} - ${item.HoraFin}</small>
                </div>
                <div class="mt-1" style="font-size: 0.75rem;">
                    <span class="text-muted mr-2"><i class="fas fa-users mr-1"></i>G. ${item.NombreGrupo}</span>
                    <span class="text-muted"><i class="fas fa-tag mr-1"></i>${item.NombreTipo}</span>
                </div>
            </div>`;
    });
    divHorario.html(htmlHorario);

    // --- 2. Renderizar Tabla DataTables ---
    if ($.fn.DataTable.isDataTable("#tbDetalle")) {
        $("#tbDetalle").DataTable().destroy();
    }

    $("#tbDetalle").DataTable({
        data: asistenciaFiltrada,
        responsive: true,
        searching: false,
        info: true,
        pageLength: 15,
        "columns": [
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
            { "data": "NombreMateria", "className": "align-middle text-primary font-weight-bold text-left" },
            {
                "data": null,
                "className": "text-center align-middle text-nowrap",
                render: function (data, type, row) {
                    return `<span class="text-secondary">${row.EntradaOficial}</span> - <span class="text-secondary">${row.SalidaOficial}</span>`;
                }
            },
            {
                "data": null,
                "className": "text-center align-middle font-weight-bold text-nowrap",
                render: function (data, type, row) {
                    // Pinto de rojo si IdEstado == 2 (Falta)
                    let colorCode = row.IdEstado === 2 ? "text-danger" : "text-dark";
                    return `<span class="${colorCode}">${row.EntradaMarcada}</span> - <span class="${colorCode}">${row.SalidaMarcada}</span>`;
                }
            },
            {
                "data": "MinutosAtraso",
                "className": "text-center align-middle font-weight-bold",
                render: function (data) {
                    return data > 0 ? `<span class="text-danger">${data} min</span>` : `<span class="text-success">0 min</span>`;
                }
            },
            {
                "data": null,
                "className": "text-center align-middle",
                render: function (data, type, row) {
                    let badgeClass = "badge-secondary";

                    // Asigna colores según tu catálogo ESTADOS_ASISTENCIA
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

$("#btnReporte").on("click", function () {
    // Obtenemos la materia que está seleccionada actualmente (el botón azul)
    let materiaActiva = $(".btn-materia.btn-primary").text().trim();

    // Filtramos de la variable global solo los registros de esta materia
    let asistenciaFiltrada = asistenciasGlobales.filter(a => a.NombreMateria === materiaActiva);

    if (asistenciaFiltrada.length > 0) {
        generarReporteAsistenciaPDF(materiaActiva, asistenciaFiltrada);
    } else {
        MostrarToastZer("No hay datos para imprimir.", "Atención", "warning");
    }
});

function generarReporteAsistenciaPDF(materiaTexto, listaAsistencia) {
    // 1. Configuración Inicial (Horizontal / Landscape)
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;  // Aprox 297mm
    const pageHeight = doc.internal.pageSize.height; // Aprox 210mm
    const fechaActual = new Date().toLocaleDateString("es-BO");

    // Extracción de datos directamente de la interfaz
    const nombreDocente = $("#lblNombres").text();
    const ciDocente = $("#lblDatos").text().replace("CI: ", "");
    const gestionTexto = $("#cboGestion option:selected").text();
    const periodoTexto = $("#cboPeriodo option:selected").text();

    // Cálculos de resumen
    const totalRegistros = listaAsistencia.length;
    const totalMinutosAtraso = listaAsistencia.reduce((suma, item) => suma + item.MinutosAtraso, 0);

    // ==========================================
    // 2. ENCABEZADO CORPORATIVO COMPACTO
    // ==========================================

    // Logo (Izquierda) - Cambia la ruta por la de tu logo real
    var img = new Image();
    img.src = "/images/emiss.png"; // Ajusta tu ruta
    try {
        doc.addImage(img, 'PNG', 15, 10, 35, 15); // Más pequeño y discreto
    } catch (e) {
        console.warn("Logo no disponible");
    }

    // Título Principal (Derecha)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 79, 159); // Azul corporativo (#004F9F)
    doc.text("REPORTE DETALLADO DE ASISTENCIA ACADÉMICA", pageWidth - 15, 16, { align: "right" });

    doc.setTextColor(50); // Gris oscuro
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Unidad Academica: Riberalta", pageWidth - 15, 21, { align: "right" });
    doc.text(`Fecha de Emisión: ${fechaActual}`, pageWidth - 15, 25, { align: "right" });

    // Línea divisoria decorativa
    doc.setDrawColor(0, 79, 159);
    doc.setLineWidth(0.5);
    doc.line(15, 28, pageWidth - 15, 28);

    // --- Bloque de Información (3 Columnas para aprovechar el ancho) ---
    doc.setTextColor(0);
    doc.setFontSize(9); // Fuente pequeña y limpia

    // Columna 1: Docente
    doc.setFont("helvetica", "bold"); doc.text("DOCENTE:", 15, 34);
    doc.setFont("helvetica", "normal"); doc.text(nombreDocente.toUpperCase(), 35, 34);
    doc.setFont("helvetica", "bold"); doc.text("C.I.:", 15, 39);
    doc.setFont("helvetica", "normal"); doc.text(ciDocente, 35, 39);

    // Columna 2: Periodo Académico
    doc.setFont("helvetica", "bold"); doc.text("GESTIÓN:", 110, 34);
    doc.setFont("helvetica", "normal"); doc.text(gestionTexto.toUpperCase(), 130, 34);
    doc.setFont("helvetica", "bold"); doc.text("PERIODO:", 110, 39);
    doc.setFont("helvetica", "normal"); doc.text(periodoTexto.toUpperCase(), 130, 39);

    // Columna 3: Materia y Resumen
    doc.setFont("helvetica", "bold"); doc.text("MATERIA:", 200, 34);
    doc.setFont("helvetica", "normal"); doc.text(materiaTexto.toUpperCase(), 220, 34, { maxWidth: 60 });
    doc.setFont("helvetica", "bold"); doc.text("T. ATRASO:", 200, 39);
    doc.setTextColor(212, 63, 58); // Rojo para destacar atrasos
    doc.text(`${totalMinutosAtraso} Minutos`, 220, 39);
    doc.setTextColor(0);

    // ==========================================
    // 3. TABLA DE ASISTENCIA
    // ==========================================

    const headers = [["NRO", "FECHA", "DÍA", "HORARIO OFICIAL (E - S)", "MARCADO REAL (E - S)", "PENALIZACIÓN", "ESTADO"]];

    const data = listaAsistencia.map((item, index) => [
        (index + 1).toString().padStart(2, '0'),
        item.Fecha,
        item.NombreDia.toUpperCase(),
        `${item.EntradaOficial} - ${item.SalidaOficial}`,
        `${item.EntradaMarcada} - ${item.SalidaMarcada}`,
        item.MinutosAtraso > 0 ? `${item.MinutosAtraso} min` : '0 min',
        item.EstadoAsistencia.toUpperCase()
    ]);

    doc.autoTable({
        startY: 45,
        head: headers,
        body: data,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, valign: 'middle' },
        headStyles: {
            fillColor: [0, 79, 159], // Azul corporativo
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 45, halign: 'center' },
            4: { cellWidth: 45, halign: 'center' },
            5: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }, // Penalización destacada
            6: { halign: 'center' }
        },
        // Pintar de rojo los registros con Falta o penalización
        willDrawCell: function (data) {
            if (data.section === 'body' && data.column.index === 5) {
                if (data.cell.raw !== '0 min') {
                    doc.setTextColor(212, 63, 58); // Letra roja si hay atraso
                }
            }
            if (data.section === 'body' && data.column.index === 6) {
                if (data.cell.raw === 'FALTA') {
                    doc.setTextColor(255, 255, 255);
                    doc.setFillColor(212, 63, 58); // Fondo rojo para FALTAS
                }
            }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
            const str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(str, pageWidth - 25, pageHeight - 10);
            doc.text(`Generado desde Sistema Académico - Registros Totales: ${totalRegistros}`, 15, pageHeight - 10);
        }
    });

    // ==========================================
    // 4. FIRMAS
    // ==========================================

    let finalY = doc.lastAutoTable.finalY;

    // Verificamos si hay espacio para las firmas, sino creamos nueva página
    if (finalY + 40 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    const firmaY = finalY + 40;
    doc.setDrawColor(100);

    // Firma 1 (Izquierda) - Docente
    doc.line(40, firmaY, 110, firmaY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("FIRMA DEL DOCENTE", 75, firmaY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(nombreDocente.toUpperCase(), 75, firmaY + 10, { align: "center" });

    // Firma 2 (Derecha) - Jefe de Carrera / RRHH
    doc.line(pageWidth - 110, firmaY, pageWidth - 40, firmaY);

    doc.setFont("helvetica", "bold");
    let nombreImprime = `${usuarioGlobal.Nombres} ${usuarioGlobal.Apellidos}`.toUpperCase();
    doc.text(nombreImprime, pageWidth - 75, firmaY + 5, { align: "center" });

    /*doc.text("JEFE DE CARRERA / RECURSOS HUMANOS", pageWidth - 75, firmaY + 5, { align: "center" });*/
    doc.setFont("helvetica", "normal");
    let cargoImprime = `${usuarioGlobal.NombreRol} ${usuarioGlobal.NombreCarrera}`.toUpperCase();
    doc.text(cargoImprime, pageWidth - 75, firmaY + 10, { align: "center" });

    /*doc.text("Sello y Firma", pageWidth - 75, firmaY + 10, { align: "center" });*/

    // ==========================================
    // 5. GUARDAR PDF
    // ==========================================
    // Formateamos el nombre del archivo para que sea profesional (Ej: Asistencia_I-2026_CI.pdf)
    const nombreArchivo = `Asistencia_${gestionTexto}_${ciDocente}.pdf`;
    doc.save(nombreArchivo);
}

// fin