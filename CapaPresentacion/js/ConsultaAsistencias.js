
// VARIABLES GLOBALES EN MEMORIA
let horariosGlobales = [];
let asistenciasGlobales = [];
let listaEstadosGlobal = [];

$(document).ready(function () {

    cargarGradosAcade();
    cargarGestiones();
    cargarEstadosAsistencia();

    // 1. CONFIGURACIÓN DEL SELECT2 (Buscador de Docentes)
    $("#cboBuscarDocente").select2({
        placeholder: "Escriba el nombre, apellido o CI...",
        allowClear: true,
        ajax: {
            url: "ConsultaAsistencias.aspx/BuscarDocentesSelect2",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 300,
            data: function (params) {
                // Capturamos el IdCarrera dinámicamente en cada tecleo
                let idCarreraSeleccionada = $("#cboCarreras").val();

                return JSON.stringify({
                    idCarrera: parseInt(idCarreraSeleccionada) || 0,
                    busqueda: params.term || ""
                });
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

    // EVENTOS DEL SELECT2 (Seleccionar / Limpiar)
    $('#cboBuscarDocente').on('select2:select', function (e) {
        var data = e.params.data;
        $("#txtIdDocente").val(data.id);
        $("#lblNombres").text(data.nombres);
        $("#lblDatos").text("CI: " + data.ci).removeClass("badge-secondary").addClass("badge-info");
        let imagenBase = data.imgUrl ? data.imgUrl : "images/sinImagen.png";
        $("#imgDoce").attr("src", imagenBase);
    });

    $('#cboBuscarDocente').on('select2:unselect', function (e) {
        limpiarPanelDocente();
    });

    // 2. EVENTO BUSCAR ASISTENCIA
    $("#btnBuscar").on("click", function () {
        let idDocente = $("#txtIdDocente").val();
        let idGestion = $("#cboGestion").val();
        let idPeriodo = $("#cboPeriodo").val();
        let idCarrera = $("#cboCarreras").val();

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

        if (idCarrera === "") {
            MostrarToastZer("Por favor, seleccione una Carrera.", "Atención", "warning");
            return;
        }

        $("#btnReporte").prop("disabled", true); // Bloqueamos reporte temporalmente
        $("#loadinzero").LoadingOverlay("show"); // Bloqueamos el contenedor principal

        // Peticiones AJAX en paralelo
        let reqHorario = $.ajax({
            type: "POST",
            url: "ConsultaAsistencias.aspx/ObtenerHorario",
            data: JSON.stringify({ idDocente: parseInt(idDocente), idCarrera: parseInt(idCarrera), idGestion: parseInt(idGestion) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });

        let reqAsistencia = $.ajax({
            type: "POST",
            url: "ConsultaAsistencias.aspx/ObtenerAsistencia",
            data: JSON.stringify({ idDocente: parseInt(idDocente), idCarrera: parseInt(idCarrera), idGestion: parseInt(idGestion), idPeriodo: parseInt(idPeriodo) }),
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

});

function cargarEstadosAsistencia() {
    $.ajax({
        url: "PanelAsistenciaDiaria.aspx/ListaEstadoAsistencia",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                // Guardamos la lista en la variable global
                listaEstadosGlobal = response.d.Data;
            } else {
                console.log("Error al cargar estados: " + response.d.Mensaje);
            }
        },
        error: function (xhr) {
            console.log("Error de conexión al traer estados.");
        }
    });
}

function cargarGestiones() {

    $("#cboGestion").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "PanelAsistenciaDiaria.aspx/ListaGestiones",
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
        url: "PanelPagos.aspx/ObtenerPeriodosPago",
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

function cargarGradosAcade() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboGrados").html('<option value="">Cargando grados...</option>');

    $.ajax({
        url: "PanelGrados.aspx/ListaGradosAcademicos",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione un Grado --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGradoAcademico}">${row.GradoAcademico}</option>`;
                });
                $("#cboGrados").html(opcionesHTML);

            } else {
                $("#cboGrados").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboGrados").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboGrados").on("change", function () {
    const idGrados = $(this).val();

    $("#cboCarreras").empty().append('<option value="">Seleccione Carrera</option>');
    $("#cboCarreras").prop("disabled", true);

    if (idGrados) {
        cargarCarreras(idGrados);
    }
});

function cargarCarreras(idGrados) {

    $("#cboCarreras").html('<option value="">Cargando...</option>');

    var request = {
        IdGradoAcademico: parseInt(idGrados)
    };

    $.ajax({
        url: "PanelCarreras.aspx/ObtenerCarrerasPorGrado",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCarrera}">${row.NombreCarrera}</option>`;
                });

                $("#cboCarreras").html(opcionesHTML);
                $("#cboCarreras").prop("disabled", false);
            } else {
                $("#cboCarreras").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboCarreras").html('<option value="">Error de conexión</option>');
        }
    });
}

// EVENTO: HABILITAR SELECT2 AL SELECCIONAR CARRERA
$("#cboCarreras").on("change", function () {
    const idCarrera = $(this).val();

    limpiarPanelDocente(); // Si cambia de carrera, borramos al docente anterior

    if (idCarrera && idCarrera !== "") {
        // Habilitamos el buscador de docentes
        $("#cboBuscarDocente").prop("disabled", false);
    } else {
        // Bloqueamos el buscador si vuelve a "Seleccione Carrera"
        $("#cboBuscarDocente").prop("disabled", true);
    }
});

// Función auxiliar para limpiar visualmente al cambiar filtros
function limpiarPanelDocente() {
    $("#cboBuscarDocente").val(null).trigger('change'); // Limpia el Select2 visualmente
    $("#txtIdDocente").val("0");
    $("#lblNombres").text("Esperando selección...");
    $("#lblDatos").text("Seleccione un docente").removeClass("badge-info").addClass("badge-secondary");
    $("#imgDoce").attr("src", "images/sinImagen.png");

    $("#seccionMaterias").hide();
    $("#btnReporte").prop("disabled", true);
    $("#contenedorHorario").html(`
        <div class="alert alert-secondary text-center py-4 mb-0 shadow-sm" style="font-size: 0.85rem;">
            <i class="fas fa-info-circle d-block mb-2" style="font-size: 1.5rem;"></i> 
            Realice la búsqueda para visualizar el horario.
        </div>
    `);

    if ($.fn.DataTable.isDataTable("#tbDetalle")) {
        $("#tbDetalle").DataTable().clear().draw();
    }
}

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
                            <span class="font-weight-bold text-dark" style="font-size: 12px;">${row.Fecha}</span><br>
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
            },
            {
                "data": null,
                "className": "text-center align-middle",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-outline-primary btn-sm btn-editar shadow-sm" title="Corregir Asistencia">
                            <i class="fas fa-pencil-alt"></i>
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

// EVENTO: ABRIR MODAL DE EDICIÓN
$('#tbDetalle tbody').on('click', '.btn-editar', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    // Obtenemos los datos de la fila del DataTable
    let tabla = $("#tbDetalle").DataTable();
    let data = tabla.row(fila).data();

    // 1. Cargar Datos Básicos
    $("#txtIdAsistenciaMod").val(data.IdAsistenciaDiaria);
    $("#txtHoraEntradaOficialMod").val(data.EntradaOficial);
    $("#txtHoraSalidaOficialMod").val(data.SalidaOficial);

    $("#lblFechaMod").text(`Fecha: ${data.Fecha} (${data.NombreDia})`);
    $("#lblMateriaMod").text(`Materia: ${data.NombreMateria}`);

    // 2. Llenar Combo de Estados (usando tu variable global listaEstadosGlobal)
    let opcionesHTML = "";
    $.each(listaEstadosGlobal, function (index, estado) {
        let isSelected = (data.IdEstado === estado.IdEstado) ? "selected" : "";
        opcionesHTML += `<option value="${estado.IdEstado}" ${isSelected}>${estado.Descripcion}</option>`;
    });
    $("#cboEstadoMod").html(opcionesHTML);

    // 3. Cargar Horas y Atraso
    $("#txtIngresoMod").val(data.EntradaMarcada);
    $("#txtSalidaMod").val(data.SalidaMarcada);
    $("#txtAtrasoMod").val(data.MinutosAtraso);

    // 4. FORZAR ACTUALIZACIÓN VISUAL (Colores y bloqueos según el estado)
    $("#cboEstadoMod").trigger("change");

    // 4. Mostrar Modal
    $("#modalEditarAsistencia").modal("show");
});

function convertirAMinutos(horaString) {
    if (!horaString || horaString === "") return 0;
    let partes = horaString.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}

// EVENTO: RECALCULAR ATRASO EN EL MODAL AL CAMBIAR LA HORA
$("#txtIngresoMod, #txtSalidaMod").on("change", function () {
    let horaEntradaOficial = $("#txtHoraEntradaOficialMod").val();
    let horaSalidaOficial = $("#txtHoraSalidaOficialMod").val();

    let horaIngresoMarcada = $("#txtIngresoMod").val();
    let horaSalidaMarcada = $("#txtSalidaMod").val();

    let minutosTotalPenalizacion = 0;

    if (horaEntradaOficial && horaIngresoMarcada) {
        let atraso = convertirAMinutos(horaIngresoMarcada) - convertirAMinutos(horaEntradaOficial);
        if (atraso > 0) minutosTotalPenalizacion += atraso;
    }

    if (horaSalidaOficial && horaSalidaMarcada) {
        let abandono = convertirAMinutos(horaSalidaOficial) - convertirAMinutos(horaSalidaMarcada);
        if (abandono > 0) minutosTotalPenalizacion += abandono;
    }

    $("#txtAtrasoMod").val(minutosTotalPenalizacion);
});

// EVENTO: CONTROL AUTOMÁTICO AL CAMBIAR EL ESTADO EN EL MODAL
$("#cboEstadoMod").on("change", function () {
    let combo = $(this);
    let idEstado = parseInt(combo.val());

    // Referencias a los inputs específicos del Modal
    let inpIngreso = $("#txtIngresoMod");
    let inpSalida = $("#txtSalidaMod");
    let inpAtraso = $("#txtAtrasoMod");

    // Horas oficiales que dejamos ocultas en el Modal al abrirlo
    let horaEntradaOficial = $("#txtHoraEntradaOficialMod").val();
    let horaSalidaOficial = $("#txtHoraSalidaOficialMod").val();

    // 1. Feedback visual en el selector
    combo.removeClass("text-success text-danger text-warning text-dark");
    if (idEstado === 1) combo.addClass("text-success");
    else if (idEstado === 2) combo.addClass("text-danger");
    else combo.addClass("text-warning text-dark");

    // 2. Lógica de negocio según el Estado
    if (idEstado === 2) {
        // ==========================================
        // CASO: FALTA (Descuento total de la clase)
        // ==========================================
        // Limpiamos y bloqueamos las horas
        inpIngreso.val("").prop("readonly", true).addClass("bg-light");
        inpSalida.val("").prop("readonly", true).addClass("bg-light");

        // Calculamos los minutos totales usando las horas oficiales
        let minEntrada = convertirAMinutos(horaEntradaOficial);
        let minSalida = convertirAMinutos(horaSalidaOficial);
        let minutosClaseCompleta = minSalida - minEntrada;

        // Inyectamos la penalización
        inpAtraso.val(minutosClaseCompleta).removeClass("text-success").addClass("text-danger");

    } else if (idEstado === 1) {
        // ==========================================
        // CASO: PRESENTE
        // ==========================================
        // Desbloqueamos los inputs para edición manual
        inpIngreso.prop("readonly", false).removeClass("bg-light");
        inpSalida.prop("readonly", false).removeClass("bg-light");

        // Si regresó a "Presente" desde una Falta, restauramos sus horas base
        if (inpIngreso.val() === "") inpIngreso.val(horaEntradaOficial);
        if (inpSalida.val() === "") inpSalida.val(horaSalidaOficial);

        // Disparamos el evento 'change' (el que suma los atrasos) para que recalcule
        inpIngreso.trigger("change");

    } else {
        // ==========================================
        // CASO: PERMISO / FERIADO (Sin descuento)
        // ==========================================
        inpIngreso.val("").prop("readonly", true).addClass("bg-light");
        inpSalida.val("").prop("readonly", true).addClass("bg-light");

        inpAtraso.val(0).removeClass("text-danger").addClass("text-success");
    }
});

// EVENTO: GUARDAR CORRECCIÓN
// =====================================================================
$("#btnGuardarModificacion").on("click", function () {
    let idAsistencia = $("#txtIdAsistenciaMod").val();
    let idEstado = $("#cboEstadoMod").val();
    let ingreso = $("#txtIngresoMod").val();
    let salida = $("#txtSalidaMod").val();
    let atraso = $("#txtAtrasoMod").val();

    // Bloqueamos botón
    $("#btnGuardarModificacion").prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...');

    $.ajax({
        type: "POST",
        url: "ConsultaAsistencias.aspx/ActualizarAsistenciaIndividual", // Tu nuevo WebMethod
        data: JSON.stringify({
            idAsistencia: parseInt(idAsistencia),
            idEstado: parseInt(idEstado),
            horaIngreso: ingreso,
            horaSalida: salida,
            minutosAtraso: parseInt(atraso) || 0
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#btnGuardarModificacion").prop("disabled", false).html('<i class="fas fa-save mr-2"></i>Guardar Cambios');

            if (response.d.Estado) {
                $("#modalEditarAsistencia").modal("hide");
                MostrarToastZer("Registro actualizado correctamente.", "Éxito", "success");

                // Refrescamos la búsqueda general para actualizar la tabla y variables globales
                $("#btnBuscar").trigger("click");
            } else {
                MostrarToastZer(response.d.Mensaje, "Error", "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#btnGuardarModificacion").prop("disabled", false).html('<i class="fas fa-save mr-2"></i>Guardar Cambios');
            MostrarToastZer("Error de conexión al guardar.", "Error", "error");
        }
    });
});

// fin