
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
                    // ===============================================

                    htmlFilas += `
                        <tr data-idhorario="${item.IdHorario}" data-idasistencia="${item.IdAsistenciaDiaria}">
                            
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

// fin