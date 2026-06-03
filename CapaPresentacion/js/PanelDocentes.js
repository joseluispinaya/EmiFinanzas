

let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listaDocentes();
});

function listaDocentes() {
    if ($.fn.DataTable.isDataTable("#tbDatas")) {
        $("#tbDatas").DataTable().destroy();
        $('#tbDatas tbody').empty();
    }

    tablaData = $("#tbDatas").DataTable({
        "processing": true,  // Muestra el mensaje "Procesando..." nativo de DataTables
        "serverSide": true,  // ACTIVA EL MODO PAGINACIÓN EN EL SERVIDOR
        "responsive": true,
        "ajax": {
            "url": 'PanelDocentes.aspx/ListaDocentePaginado',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                // 'd' es el objeto gigante que DataTables intenta enviar por defecto.
                // Aquí lo transformamos para que encaje EXACTAMENTE con los parámetros de tu WebMethod en C#
                var parametros = {
                    Omitir: d.start,               // Cuántos registros saltar (Página actual)
                    TamanoPagina: d.length,        // Cuántos registros mostrar (Ej: 10, 25, 50)
                    Buscar: d.search.value || ""   // Lo que el usuario escribió en la caja de búsqueda
                };
                return JSON.stringify(parametros);
            },
            "dataFilter": function (data) {
                // Aquí interceptamos la respuesta cruda de tu WebMethod antes de que DataTables la lea
                var json = JSON.parse(data);

                // Extraemos los totales de la primera fila (si hay datos)
                var totalRecords = 0;
                var totalFiltered = 0;

                if (json.d.Estado && json.d.Data.length > 0) {
                    totalRecords = json.d.Data[0].TotalRegistros;
                    totalFiltered = json.d.Data[0].TotalFiltrados;
                }

                // Transformamos tu objeto "Respuesta" al formato que DataTables exige
                var respuestaDataTables = {
                    draw: 0, // No es estrictamente necesario en WebForms, pero es buena práctica
                    recordsTotal: totalRecords,       // Total real en BD
                    recordsFiltered: totalFiltered,   // Total después de aplicar el buscador
                    data: json.d.Estado ? json.d.Data : [] // La lista de docentes real
                };

                return JSON.stringify(respuestaDataTables);
            }
        },
        "columns": [
            { "data": "IdDocente", "visible": false, "searchable": false, "orderable": false },
            {
                "data": "ImagenUrl",
                "orderable": false,
                "searchable": false,
                "className": "text-center",
                render: function (data) {
                    if (!data) return '<img src="images/sinImagen.png" alt="imagen" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">';
                    return `<img src="${data}" alt="imagen" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">`;
                }
            },
            { "data": "Nombres", "className": "align-middle", "orderable": false },
            { "data": "Apellidos", "className": "align-middle", "orderable": false },
            { "data": "CI", "className": "align-middle", "orderable": false },
            { "data": "NroNit", "className": "align-middle", "orderable": false },
            {
                "data": "Estado", "className": "text-center align-middle", "orderable": false, render: function (data) {
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
        // IMPORTANTE: En modo Server-Side con tu SP actual, no estamos manejando ordenamiento dinámico por columnas,
        // así que desactivamos el ordenamiento inicial para que no choque con el ORDER BY DESC de tu SP.
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbDatas tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdDocente;

    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtNroci").val(data.CI);
    $("#txtCelular").val(data.Celular);
    $("#txtNroNit").val(data.NroNit);
    $("#txtProfesion").val(data.Profesion);
    $("#txtCuentaBan").val(data.CuentaBancaria);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#imgDocenReg").attr("src", data.ImagenUrl || "images/sinImagen.png");
    $("#txtFotoUr").val("");
    $(".custom-file-label").text('Ningún archivo seleccionado');

    $("#myModalLabel").text("Editar Registro");
    $("#mdData").modal("show");
});

$('#tbDatas tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Detalles del Docente: ${data.Nombres}.`;
    MostrarAlerta("¡Mensaje!", textoSms, "info");

});

$("#btnRegistro").on("click", function () {

    idEditar = 0;

    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtNroci").val("");
    $("#txtCelular").val("");
    $("#txtNroNit").val("");
    $("#txtProfesion").val("");
    $("#txtCuentaBan").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $('#imgDocenReg').attr('src', "images/sinImagen.png");
    $("#txtFotoUr").val("");
    $(".custom-file-label").text('Ningún archivo seleccionado');

    $("#myModalLabel").text("Nuevo Registro");

    $("#mdData").modal("show");

})

const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB en bytes

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function mostrarImagenSeleccionada(input) {
    let file = input.files[0];
    let reader = new FileReader();

    // Si NO se seleccionó archivo (ej: presionaron "Cancelar")
    if (!file) {
        resetearVistaFoto(input);
        //$('#imgDirectReg').attr('src', "images/sinFoto.png");
        //$(input).next('.custom-file-label').text('Ningún archivo seleccionado');
        return;
    }

    // Validación: si no es imagen, mostramos error
    if (!esImagen(file)) {
        MostrarToastZer("El archivo seleccionado no es una imagen válida.", "Atención", "error");
        //toastr.error("El archivo seleccionado no es una imagen válida.");
        resetearVistaFoto(input);
        //$('#imgDirectReg').attr('src', "images/sinFoto.png");
        //$(input).next('.custom-file-label').text('Ningún archivo seleccionado');
        //input.value = "";
        return;
    }

    // 3. Validación: Tamaño máximo
    if (file.size > TAMANO_MAXIMO) {
        toastr.error("La imagen supera el tamaño máximo permitido de 2 MB.");
        resetearVistaFoto(input);
        return;
    }

    // Si todo es válido → mostrar vista previa
    reader.onload = (e) => $('#imgDocenReg').attr('src', e.target.result);
    reader.readAsDataURL(file);

    // Mostrar nombre del archivo
    $(input).next('.custom-file-label').text(file.name);
}

// Función auxiliar para limpiar (DRY - Don't Repeat Yourself)
function resetearVistaFoto(input) {
    $('#imgDocenReg').attr('src', "images/sinImagen.png");
    $(input).next('.custom-file-label').text('Ningún archivo seleccionado');
    input.value = ""; // Limpia el input file
}

$('#txtFotoUr').change(function () {
    mostrarImagenSeleccionada(this);
});

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    const inputs = $("#mdData input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        MostrarToastZer(mensaje, "Atención", "warning");
        //toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdDocente: idEditar,
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        CI: $("#txtNroci").val().trim(),
        Celular: $("#txtCelular").val().trim(),
        Profesion: $("#txtProfesion").val().trim(),
        NroNit: $("#txtNroNit").val().trim(),
        CuentaBancaria: $("#txtCuentaBan").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false),
        ImagenUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
    };

    // 3. PROCESAR EL INPUT FILE
    const fileInput = document.getElementById('txtFotoUr');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Extraemos solo el texto Base64, quitando la cabecera (data:image/jpeg;base64,)
            const base64String = e.target.result.split(',')[1];

            // Disparamos el AJAX enviando la imagen
            enviarAjaxDocente(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxDocente(objeto, "");
    }

});

function enviarAjaxDocente(objeto, base64String) {
    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "PanelDocentes.aspx/GuardarOrEditDocentes",
        data: JSON.stringify({ objeto: objeto, base64Image: base64String }),
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
                listaDocentes();
                idEditar = 0;
            }
        },
        error: function () {
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");
            MostrarToastZer("No se pudo conectar con el servidor.", "Atención", "error");
            //toastr.error("No se pudo conectar con el servidor.");
        },
        complete: function () {
            habilitarBoton();
        }
    });
}

$("#btnSwaler").on("click", function () {
    MostrarAlertaZeo("¡Guardado!", "El registro se guardó correctamente.", "info");
})

$("#btnTimerau").on("click", function () {
    AlertaTimerTipo("¡Guardado automático!", "Tus respuestas se han guardado.", "warning", 3000);
    //MostrarToastZer("El registro se actualizó correctamente.", "Éxito", "success");
    //MostrarToastZer("Debe seleccionar Und Educativa.", "Atención", "warning");
    //MostrarToastFijo("No se pudo conectar con el servidor. Intente más tarde.", "Error de Conexión");
    //MostrarAlertaTimer("¡Guardado automático!", "Tus respuestas se han guardado.", 3000);
})

// fin