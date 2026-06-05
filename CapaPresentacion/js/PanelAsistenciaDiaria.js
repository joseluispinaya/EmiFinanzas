
// Variable global para guardar los estados en memoria
let listaEstadosGlobal = [];

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

$(document).ready(function () {

    cargarGestiones();
    cargarGradosAcadeTable();
    cargarEstadosAsistencia();

    $("#txtFecha").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFecha").val(ObtenerFecha());
});

function cargarEstadosAsistencia() {
    $.ajax({
        url: "PanelAsistenciaDiaria.aspx/ListaEstadoAsistencia", // Tu WebMethod que llame al SP
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

function cargarGradosAcadeTable() {

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

$("#btnBuscar").on("click", function () {

    // 1. OBTENEMOS LOS VALORES DE LOS FILTROS
    let idCarrera = $("#cboCarreras").val();
    let idGestion = $("#cboGestion").val();
    let fecha = $("#txtFecha").val().trim();

    // 2. VALIDACIONES
    if (idCarrera === "" || idCarrera === null) {
        MostrarToastZer("Por favor, seleccione una Carrera.", "Atención", "warning");
        $("#cboCarreras").focus();
        return;
    }
    if (idGestion === "" || idGestion === null) {
        MostrarToastZer("Por favor, seleccione una Gestión.", "Atención", "warning");
        $("#cboGestion").focus();
        return;
    }
    if (fecha === "") {
        MostrarToastZer("Por favor, seleccione la Fecha de Asistencia.", "Atención", "warning");
        return;
    }

    // Bloqueamos UI
    $("#btnBuscar").prop("disabled", true);
    $("#loadinzero").LoadingOverlay("show");

    // 3. PETICIÓN AJAX AL SERVIDOR
    $.ajax({
        type: "POST",
        url: "PanelAsistenciaDiaria.aspx/ListarAsistenciaPorFecha", // Verifica que el nombre de tu aspx sea el correcto
        data: JSON.stringify({
            idCarrera: parseInt(idCarrera),
            idGestion: parseInt(idGestion),
            fechaAsistencia: fecha
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#loadinzero").LoadingOverlay("hide");
            $("#btnBuscar").prop("disabled", false);

            let tbody = $("#tbAsistencia tbody");
            tbody.empty(); // Limpiamos la tabla anterior

            if (response.d.Estado) {
                let datos = response.d.Data;

                // Validamos si no hay clases programadas ese día
                if (datos.length === 0) {
                    tbody.html(`<tr><td colspan="7" class="text-danger font-weight-bold py-4"><i class="fas fa-exclamation-circle mr-2"></i>No hay clases programadas para esta fecha.</td></tr>`);
                    $("#btnGuardarAsistencia").prop("disabled", true);
                    return;
                }

                // Variable para almacenar todo el HTML de las filas
                let htmlFilas = "";

                // 4. DIBUJAMOS LA TABLA DINÁMICAMENTE

                $.each(datos, function (i, item) {

                    let badgeTipo = item.NombreTipo.includes("Laboratorio") ? "badge-info" : "badge-primary";

                    // === NUEVO: ARMAMOS LOS OPTION DINÁMICAMENTE ===
                    let opcionesEstadoHTML = "";

                    $.each(listaEstadosGlobal, function (index, estado) {
                        // Verificamos si este es el estado que el docente ya tiene guardado
                        let isSelected = (item.IdEstadoAsistencia === estado.IdEstado) ? "selected" : "";

                        // Le damos colorcitos para que se vea bien (1=Verde, 2=Rojo, Otros=Amarillo/Azul)
                        let colorTexto = "";
                        if (estado.IdEstado === 1) colorTexto = "text-success";
                        else if (estado.IdEstado === 2) colorTexto = "text-danger";
                        else colorTexto = "text-warning";

                        opcionesEstadoHTML += `<option value="${estado.IdEstado}" ${isSelected} class="${colorTexto} font-weight-bold">${estado.Descripcion}</option>`;
                    });

                    htmlFilas += `
                        <tr data-idhorario="${item.IdHorario}" 
                            data-idasistencia="${item.IdAsistenciaDiaria}"
                            data-entrada="${item.HoraEntradaProgramada}" 
                            data-salida="${item.HoraSalidaProgramada}">
                            
                            <td class="d-none">${item.IdHorario}</td>
                            <td class="d-none">${item.IdAsistenciaDiaria}</td>
                            
                            <td class="text-left align-middle font-weight-bold text-dark" style="font-size: 0.95rem;">
                                <i class="fas fa-user-tie text-primary mr-2"></i>${item.Docente}
                            </td>
                            
                            <td class="text-left align-middle">
                                <div class="font-weight-bold mb-1" style="font-size: 0.85rem;">${item.NombreMateria}</div>
                                <span class="badge ${badgeTipo} shadow-sm mr-1">${item.NombreTipo}</span>
                                <span class="badge badge-secondary shadow-sm">Grupo: ${item.NombreGrupo}</span>
                            </td>
                            
                            <td class="align-middle">
                                <span class="badge badge-light border border-secondary text-dark p-2 w-100 shadow-sm" style="font-size: 0.9rem;">
                                    <i class="fas fa-clock text-warning mr-1"></i> ${item.HoraEntradaProgramada} - ${item.HoraSalidaProgramada}
                                </span>
                            </td>
                            
                            <td class="align-middle">
                                <select class="custom-select custom-select-sm cbo-estado shadow-sm font-weight-bold">
                                    ${opcionesEstadoHTML}
                                </select>
                            </td>
                            <td class="align-middle">
                                <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary inp-ingreso shadow-sm" value="${item.HoraIngreso}">
                            </td>
                            
                            <td class="align-middle">
                                <input type="time" class="form-control form-control-sm text-center font-weight-bold text-primary inp-salida shadow-sm" value="${item.HoraSalida}">
                            </td>
                            
                            <td class="align-middle">
                                <input type="number" class="form-control form-control-sm text-center bg-light font-weight-bold text-danger inp-atraso" value="${item.MinutosAtraso}" readonly>
                            </td>

                        </tr>
                    `;
                });

                // Inyectamos todas las filas a la vez (mejor rendimiento)
                tbody.html(htmlFilas);

                // Habilitamos el botón de guardar
                $("#btnGuardarAsistencia").prop("disabled", false);

            } else {
                MostrarToastZer(response.d.Mensaje, "Error del Servidor", "error");
                tbody.html(`<tr><td colspan="7" class="text-danger py-4">Ocurrió un error al cargar la información.</td></tr>`);
                $("#btnGuardarAsistencia").prop("disabled", true);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#loadinzero").LoadingOverlay("hide");
            $("#btnBuscar").prop("disabled", false);
            MostrarToastZer("No se pudo conectar con el servidor.", "Error Crítico", "error");
        }
    });

});

// EVENTO: LLENADO RÁPIDO (ASISTENCIA PERFECTA)
$("#btnLlenadoRapido").on("click", function () {

    // Verificamos si hay filas válidas en la tabla (ignoramos la fila de "No hay clases")
    if ($("#tbAsistencia tbody tr").length === 0 || $("#tbAsistencia tbody tr td").length === 1) {
        MostrarToastZer("No hay datos en la tabla para rellenar.", "Atención", "warning");
        return;
    }

    // Preguntamos para evitar clics por accidente usando tu formato de SweetAlert
    swal({
        title: "¿Llenado Automático?",
        text: "Esto marcará a todos como Presentes, con 0 minutos de atraso y en su horario oficial. ¿Desea continuar?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#004F9F",
        confirmButtonText: "Sí, autocompletar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true
    }, function () {

        // Esta función se ejecuta solo si el usuario hizo clic en "Sí, autocompletar"

        // Recorremos cada fila de la tabla
        $("#tbAsistencia tbody tr").each(function () {
            let fila = $(this);

            // Extraemos el horario oficial que guardamos en el tr
            let horaEntrada = fila.attr("data-entrada");
            let horaSalida = fila.attr("data-salida");

            // Asignamos los valores a los inputs de esta fila
            fila.find(".cbo-estado").val("1"); // 1 = Presente
            fila.find(".inp-ingreso").val(horaEntrada);
            fila.find(".inp-salida").val(horaSalida);
            fila.find(".inp-atraso").val("0");
        });

        MostrarToastZer("Autocompletado exitoso.", "¡Listo!", "success");
    });
});

// FUNCIÓN AUXILIAR: Convierte "HH:mm" a minutos totales
function convertirAMinutos(horaString) {
    if (!horaString) return 0;
    let partes = horaString.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}

// EVENTO: CÁLCULO AUTOMÁTICO AL CAMBIAR LA HORA DE INGRESO
$("#tbAsistencia tbody").on("change", ".inp-ingreso", function () {

    let inputIngreso = $(this);
    let fila = inputIngreso.closest("tr");

    // Obtenemos la hora oficial y la que acaba de ingresar la secretaria
    let horaOficialString = fila.attr("data-entrada");
    let horaMarcadaString = inputIngreso.val();

    // Validamos que ambas existan
    if (horaOficialString && horaMarcadaString) {

        let minOficial = convertirAMinutos(horaOficialString);
        let minMarcado = convertirAMinutos(horaMarcadaString);

        let minutosAtraso = minMarcado - minOficial;

        // Si llegó temprano o a tiempo, el atraso es 0
        if (minutosAtraso < 0) {
            minutosAtraso = 0;
        }

        // Asignamos el valor al input de atraso
        fila.find(".inp-atraso").val(minutosAtraso);

        // Opcional: Cambiamos visualmente el color si hay atraso para llamar la atención
        if (minutosAtraso > 0) {
            fila.find(".inp-atraso").removeClass("text-danger text-success").addClass("text-danger");
        } else {
            fila.find(".inp-atraso").removeClass("text-danger text-success").addClass("text-success");
        }
    }
});

// FUNCIÓN AUXILIAR: Convierte "HH:mm" a minutos totales (Entero)
function convertirAMinutos(horaString) {
    if (!horaString || horaString === "") return 0;
    let partes = horaString.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}

// EVENTO: CÁLCULO AUTOMÁTICO DE ATRASO AL CAMBIAR LA HORA DE INGRESO
$("#tbAsistencia tbody").on("change", ".inp-ingreso, .inp-salida", function () {

    let fila = $(this).closest("tr");

    // 1. Extraemos las horas oficiales (ocultas en el tr)
    let horaEntradaOficial = fila.attr("data-entrada");
    let horaSalidaOficial = fila.attr("data-salida");

    // 2. Extraemos las horas que la secretaria acaba de teclear
    let horaIngresoMarcada = fila.find(".inp-ingreso").val();
    let horaSalidaMarcada = fila.find(".inp-salida").val();

    let minutosTotalPenalizacion = 0;

    // --- CÁLCULO 1: ATRASO AL INGRESAR ---
    if (horaEntradaOficial && horaIngresoMarcada) {
        let minEntradaOficial = convertirAMinutos(horaEntradaOficial);
        let minIngresoMarcado = convertirAMinutos(horaIngresoMarcada);

        let atraso = minIngresoMarcado - minEntradaOficial;

        // Solo sumamos si llegó después de la hora oficial
        if (atraso > 0) {
            minutosTotalPenalizacion += atraso;
        }
    }

    // --- CÁLCULO 2: ABANDONO AL SALIR (Se fue antes de tiempo) ---
    if (horaSalidaOficial && horaSalidaMarcada) {
        let minSalidaOficial = convertirAMinutos(horaSalidaOficial);
        let minSalidaMarcada = convertirAMinutos(horaSalidaMarcada);

        let abandono = minSalidaOficial - minSalidaMarcada;

        // Solo sumamos si se fue ANTES de su hora oficial
        if (abandono > 0) {
            minutosTotalPenalizacion += abandono;
        }
    }

    // 3. Inyectamos el resultado sumado en el input de atraso
    let inpAtraso = fila.find(".inp-atraso");
    inpAtraso.val(minutosTotalPenalizacion);

    // 4. Mejoramos los colores para dar aviso visual a la secretaria
    if (minutosTotalPenalizacion > 0) {
        inpAtraso.removeClass("text-success").addClass("text-danger");
    } else {
        inpAtraso.removeClass("text-danger").addClass("text-success");
    }
});

$("#btnGuardarAsistencia").on("click", function () {

    $('#btnGuardarAsistencia').prop('disabled', true);

    // 1. Obtenemos la fecha del filtro superior
    let fecha = $("#txtFecha").val().trim();

    if (fecha === "") {
        MostrarToastZer("La fecha de asistencia no puede estar vacía.", "Atención", "warning");
        habilitarBoton();
        return;
    }

    // 2. Preparamos el arreglo que enviaremos a C#
    let listaAsistenciaExtraida = [];

    // 3. Recorremos cada fila de la tabla
    // Nos aseguramos de seleccionar solo las filas que tengan data-idhorario (ignorando la de "tabla vacía")
    let filasValidas = $("#tbAsistencia tbody tr[data-idhorario]");

    if (filasValidas.length === 0) {
        MostrarToastZer("No hay registros de asistencia en la tabla para guardar.", "Atención", "warning");
        habilitarBoton();
        return;
    }

    filasValidas.each(function () {
        let fila = $(this);

        // Extraemos los valores usando las clases dinámicas que definimos al dibujar la tabla
        let idHorario = fila.attr("data-idhorario");
        let idEstado = fila.find(".cbo-estado").val();
        let horaIngreso = fila.find(".inp-ingreso").val();
        let horaSalida = fila.find(".inp-salida").val();
        let minAtraso = fila.find(".inp-atraso").val();

        // Armamos el objeto tal cual lo espera tu DTO en C# (AsistenciaDiariaGuardarDTO)
        listaAsistenciaExtraida.push({
            IdHorario: parseInt(idHorario),
            IdEstado: parseInt(idEstado),
            HoraIngreso: horaIngreso,
            HoraSalida: horaSalida,
            MinutosAtraso: parseInt(minAtraso) || 0
        });
    });

    $("#loadinzero").LoadingOverlay("show");

    // 5. Enviamos la petición AJAX
    $.ajax({
        type: "POST",
        url: "PanelAsistenciaDiaria.aspx/GuardarAsistenciaMasiva",
        data: JSON.stringify({
            fechaAsistencia: fecha,
            listaAsistencia: listaAsistenciaExtraida
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#loadinzero").LoadingOverlay("hide");

            // Mostramos tu alerta global personalizada con SweetAlert
            AlertaTimerTipo(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            // Si se guardó correctamente, recargamos la página a los 2 segundos
            if (response.d.Estado) {
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                // Si hubo un error validado por el servidor, volvemos a habilitar el botón
                habilitarBoton();
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#loadinzero").LoadingOverlay("hide");
            habilitarBoton();
            MostrarToastZer("No se pudo conectar con el servidor.", "Error Crítico", "error");
        }
    });

});

function habilitarBoton() {
    $('#btnGuardarAsistencia').prop('disabled', false);
}

// fin