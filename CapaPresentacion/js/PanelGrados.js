

let tablaData;
let idEditar = 0;

$(document).ready(function () {

    listaGrados();
});

function listaGrados() {
    if ($.fn.DataTable.isDataTable("#tbGrados")) {
        $("#tbGrados").DataTable().destroy();
        $('#tbGrados tbody').empty();
    }

    tablaData = $("#tbGrados").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelGrados.aspx/ListaGradosAcademicos',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
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
            { "data": "IdGradoAcademico", "visible": false, "searchable": false },
            { "data": "GradoAcademico", "className": "align-middle" },
            { "data": "CantiCarreras", "className": "align-middle" },
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
                "width": "100px",
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
    idEditar = data.IdGradoAcademico;
    $("#txtNombre").val(data.GradoAcademico);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);
    $("#myModalLabel").text("Editar Registro");
    $("#mdData").modal("show");

});


$('#tbGrados tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Carreras de: ${data.GradoAcademico}.`;
    //detalleCarreras(data.IdGradoAcademico);
    //$("#modalLabeldetalleCar").text(textoSms);
    //$("#modalDetalles").modal("show");
    MostrarAlerta("¡Mensaje!", textoSms, "info");

});

$("#btnRegistro").on("click", function () {

    idEditar = 0;
    $("#txtNombre").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $("#myModalLabel").text("Nuevo Registro");

    $("#mdData").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {

    $('#btnGuardarCambios').prop('disabled', true);

    if ($("#txtNombre").val().trim() === "") {
        MostrarToastZer("Por favor, ingrese el nombre del grado.", "Atención", "warning");
        $("#txtNombre").focus();
        habilitarBoton();
        return;
    }

    const objeto = {
        IdGradoAcademico: idEditar,
        GradoAcademico: $("#txtNombre").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    }

    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    // 2. Enviar al Servidor
    $.ajax({
        type: "POST",
        url: "PanelGrados.aspx/GuardarOrEditGradoAcademicos",
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
                listaGrados(); // Recargar el DataTable
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

// fin codigo