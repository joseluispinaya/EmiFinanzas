

let tablaData;
let idEditar = 0;

$(document).ready(function () {
    cargarTodosLosSemestres();

    // Inicializamos la tabla UNA SOLA VEZ al cargar la página
    inicializarTablaMaterias();
});

function cargarTodosLosSemestres() {
    // 1. Agrupamos TODOS los IDs de los selects que necesitan Departamentos separados por coma
    let combosSemestres = $("#cboSemestreData, #cboSemestreModal");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosSemestres.html('<option value="">Cargando Semestres...</option>');

    $.ajax({
        url: "PanelMaterias.aspx/ListaSemestres",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Semestre --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdSemestre}">${row.NombreSemestre}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosSemestres.html(opcionesHTML);

            } else {
                combosSemestres.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosSemestres.html('<option value="">Error de conexión</option>');
        }
    });
}

// Evento Change: Solo recargamos los datos, NO destruimos la tabla
$("#cboSemestreData").on("change", function () {
    // Si la tabla ya existe, le decimos que vuelva a consultar al servidor
    if (tablaData) {
        tablaData.ajax.reload();
    }
});

function inicializarTablaMaterias() {
    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelMaterias.aspx/MateriasPorCarreraYSemestre',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                // Esta función se ejecuta CADA VEZ que DataTables hace una petición.
                // Aquí leemos el valor ACTUAL del select en tiempo real.
                let idSemestreSeleccionado = $("#cboSemestreData").val();

                let request = {
                    IdSemestre: parseInt(idSemestreSeleccionado) || 0
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    // Opcional: Si su sesión expiró, podrías mostrar un SweetAlert aquí usando json.d.Mensaje
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdMateria", "visible": false, "searchable": false },
            { "data": "NombreMateria", "className": "align-middle" },
            { "data": "Sigla", "className": "align-middle" },
            { "data": "HT", "className": "align-middle text-center" },
            { "data": "HP", "className": "align-middle text-center" },
            { "data": "HL", "className": "align-middle text-center" },
            { "data": "HS", "className": "align-middle text-center font-weight-bold text-primary" },
            { "data": "NombreSemestre", "className": "align-middle" },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "90px",
                "className": "text-center align-middle"
            }
        ],
        "order": [], // Respetamos el orden que viene desde SQL Server
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdMateria;
    $("#txtNombre").val(data.NombreMateria);
    $("#txtSigla").val(data.Sigla);
    $("#cboSemestreModal").val(data.IdSemestre);

    $("#txtHT").val(data.HT);
    $("#txtHP").val(data.HP);
    $("#txtHL").val(data.HL);

    $("#myModalLabel").text("Editar Registro");
    $("#mdData").modal("show");

});

$('#tbData tbody').on('click', '.btn-eliminar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Eliminar la Materia: ${data.NombreMateria}.`;
    MostrarAlerta("¡Mensaje!", textoSms, "info");

});

$("#btnRegistro").on("click", function () {

    idEditar = 0;
    $("#txtNombre").val("");
    $("#txtSigla").val("");
    $("#cboSemestreModal").val("");

    $("#txtHT").val("0");
    $("#txtHP").val("0");
    $("#txtHL").val("0");

    $("#myModalLabel").text("Nuevo Registro");

    $("#mdData").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    $('#btnGuardarCambios').prop('disabled', true);

    let idSemestre = $("#cboSemestreModal").val();

    // 1. Validación de campos de texto (Excelente uso de serializeArray)
    const inputs = $("#mdData input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        MostrarToastZer(mensaje, "Atención", "warning");
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        habilitarBoton();
        return;
    }

    // 2. Validación del combo
    if (idSemestre === "") {
        MostrarToastZer("Por favor, seleccione un Semestre.", "Atención", "warning");
        $("#cboSemestreModal").focus();
        habilitarBoton();
        return;
    }

    // 3. Armado del objeto con seguro contra NaN
    const objeto = {
        IdMateria: idEditar,
        IdSemestre: parseInt(idSemestre),
        NombreMateria: $("#txtNombre").val().trim(),
        Sigla: $("#txtSigla").val().trim(),
        HT: parseInt($("#txtHT").val()) || 0,
        HP: parseInt($("#txtHP").val()) || 0,
        HL: parseInt($("#txtHL").val()) || 0
    };

    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    // 4. Envío al servidor
    $.ajax({
        type: "POST",
        url: "PanelMaterias.aspx/GuardarOrEditMateria",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");

            AlertaTimerTipo(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdData").modal("hide");

                // LA CORRECCIÓN CRÍTICA: Recargamos la tabla suavemente sin perder la página actual
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }

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
});

// fin codigo