

let tablaData;
let idEditar = 0;

$(document).ready(function () {

    cargarGradosAcadeTable();
    cargarGradosModal();
});

function cargarGradosAcadeTable() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboGradosData").html('<option value="">Cargando grados...</option>');

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

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGradoAcademico}">${row.Nombre}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboGradosData").html(opcionesHTML);

            } else {
                $("#cboGradosData").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboGradosData").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarGradosModal() {

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

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGradoAcademico}">${row.Nombre}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
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

$("#cboGradosData").on("change", function () {
    const idGrados = $(this).val();

    // 3. LIMPIAR TABLA VISUALMENTE
    if ($.fn.DataTable.isDataTable("#tbGrados")) {
        $("#tbGrados").DataTable().clear().draw();
    }

    if (idGrados) {
        listaCarreras(idGrados);
    }
});

function listaCarreras(idGrados) {
    if ($.fn.DataTable.isDataTable("#tbGrados")) {
        $("#tbGrados").DataTable().destroy();
        $('#tbGrados tbody').empty();
    }

    var request = {
        IdGradoAcademico: parseInt(idGrados)
    };

    tablaData = $("#tbGrados").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelCarreras.aspx/ObtenerCarrerasPorGrado',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdCarrera", "visible": false, "searchable": false },
            { "data": "NombreCarrera", "className": "align-middle" },
            { "data": "Sigla", "className": "align-middle" },
            { "data": "NombreGrado", "className": "align-middle" },
            {
                "data": "Estado", "className": "text-center align-middle", render: function (data) {
                    if (data === true)
                        return '<span class="badge badge-primary">Activo</span>';
                    else
                        return '<span class="badge badge-danger">No Activo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-success btn-detalle btn-sm"><i class="fas fa-address-book"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbGrados tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdCarrera;
    $("#txtNombre").val(data.NombreCarrera);
    $("#txtSigla").val(data.Sigla);
    $("#cboGrados").val(data.IdGradoAcademico);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);
    $("#myModalLabel").text("Editar Registro");
    $("#mdData").modal("show");

});

$("#btnRegistro").on("click", function () {

    idEditar = 0;
    $("#txtNombre").val("");
    $("#txtSigla").val("");
    $("#cboGrados").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $("#myModalLabel").text("Nuevo Registro");

    $("#mdData").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {

    $('#btnGuardarCambios').prop('disabled', true);
    let idGrados = $("#cboGrados").val();

    if ($("#txtNombre").val().trim() === "") {
        MostrarToastZer("Por favor, ingrese el nombre de la carrera.", "Atención", "warning");
        $("#txtNombre").focus();
        habilitarBoton();
        return;
    }

    if ($("#txtSigla").val().trim() === "") {
        MostrarToastZer("Por favor, ingrese la sigla", "Atención", "warning");
        $("#txtSigla").focus();
        habilitarBoton();
        return;
    }

    if ($("#cboGrados").val() === "") {
        MostrarToastZer("Por favor, seleccionar un Grado Académico.", "Atención", "warning");
        $("#cboGrados").focus();
        habilitarBoton();
        return;
    }

    const objeto = {
        IdCarrera: idEditar,
        IdGradoAcademico: parseInt($("#cboGrados").val()),
        NombreCarrera: $("#txtNombre").val().trim(),
        Sigla: $("#txtSigla").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    }

    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    // 2. Enviar al Servidor
    $.ajax({
        type: "POST",
        url: "PanelCarreras.aspx/GuardarOrEditCarrera",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");
            AlertaTimerTipo(
                response.d.Estado ? '¡Excelente!' : 'Atención', // Título dinámico
                response.d.Mensaje, // Texto del servidor
                response.d.Valor // Icono (success/error/warning)
            );

            if (response.d.Estado) {
                $("#mdData").modal("hide");
                $("#cboGradosData").val(idGrados);
                listaCarreras(idGrados);
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");
            MostrarToastZer("No se pudo conectar con el servidor.", "Atención", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });

})

// fin