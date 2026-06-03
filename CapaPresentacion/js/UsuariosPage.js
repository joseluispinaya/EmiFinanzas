

let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listarUsuarios();
    cargarRoles();
    cargarGradosAcadeTable();
});

function listarUsuarios() {
    tablaData = $("#tbDatas").DataTable({
        responsive: true,
        "ajax": {
            "url": 'UsuariosPage.aspx/ListaUsuarios',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            // 1. Columna Imagen
            {
                "data": "FotoUrl",
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle",
                render: function (data) {
                    const src = data ? data : 'images/sinImagen.png'; // Asegúrate que la ruta sea correcta
                    // Agregamos shadow-sm a la foto para que resalte
                    return `<img src="${src}" alt="Perfil" class="rounded-circle shadow-sm" style="width: 45px; height: 45px; object-fit: cover; border: 2px solid #fff;">`;
                }
            },
            // 2. Columna Nombre y Carrera combinados (El toque Senior)
            {
                "data": null,
                "className": "align-middle",
                render: function (data) {
                    // data.FullName viene de tu propiedad de solo lectura
                    // data.NombreCarrera viene de tu SP
                    return `<div>
                                <span class="font-weight-bold text-dark" style="font-size: 1.05rem;">${data.FullName}</span><br>
                                <small class="text-muted"><i class="fas fa-graduation-cap mr-1"></i>${data.NombreCarrera || 'Asignación Global'}</small>
                            </div>`;
                }
            },
            // 3. Columna Rol
            {
                "data": "NombreRol",
                "className": "align-middle font-weight-bold text-info"
            },
            // 4. Columna CI
            { "data": "NroCi", "className": "align-middle" },
            // 5. Columna Correo
            { "data": "Correo", "className": "align-middle text-muted" },
            // 6. Columna Estado
            {
                "data": "Estado",
                "className": "text-center align-middle",
                render: function (data) {
                    // Badges con un padding un poco más amplio (px-2 py-1)
                    if (data === true)
                        return '<span class="badge badge-success px-2 py-1 shadow-sm">Activo</span>';
                    else
                        return '<span class="badge badge-secondary px-2 py-1 shadow-sm">Inactivo</span>';
                }
            },
            // 7. Acciones
            {
                "defaultContent": '<button class="btn btn-outline-primary btn-editar btn-sm mr-2 shadow-sm" title="Editar Usuario"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-outline-info btn-detalle btn-sm shadow-sm" title="Ver Detalles"><i class="fas fa-address-book"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

function cargarRoles() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboRoles").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "UsuariosPage.aspx/ListaRoles",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">Seleccione Rol</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRol}">${row.NombreRol}</option>`;
                });

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboRoles").html(opcionesHTML);

            } else {
                $("#cboRoles").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboRoles").html('<option value="">Error de conexión</option>');
        }
    });
}

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

$("#cboGradosData").on("change", function () {
    const idGrados = $(this).val();

    $("#cboCarreras").empty().append('<option value="">Seleccione Carrera</option>');
    $("#cboCarreras").prop("disabled", true);

    if (idGrados) {
        cargarCarreras(idGrados, null);
    }
});

function cargarCarreras(idGrados, carreraPreseleccionada) {

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

                if (carreraPreseleccionada) {
                    $("#cboCarreras").val(carreraPreseleccionada);
                }

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

$("#btnRegistro").on("click", function () {

    idEditar = 0;

    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCorreo").val("");
    $("#txtNroci").val("");
    $("#cboRoles").val("");

    $("#cboGradosData").val("");
    $("#cboCarreras").empty().append('<option value="">-- Seleccione --</option>');
    $("#cboCarreras").prop("disabled", true);

    $("#cboEstado").val(1).prop("disabled", true);

    $('#imgDirectReg').attr('src', "images/sinImagen.png");
    $("#txtFotoUr").val("");
    $(".custom-file-label").text('Ningún archivo seleccionado');

    $("#myModalLabel").text("Nuevo Registro");

    $("#mdData").modal("show");

})

$('#tbDatas tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdUsuario;

    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtCorreo").val(data.Correo);
    $("#txtNroci").val(data.NroCi);
    $("#cboRoles").val(data.IdRol);

    $("#cboGradosData").val(data.IdGradoAcademico);
    cargarCarreras(data.IdGradoAcademico, data.IdCarrera);
    //$("#cboCarreras").val("");

    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#imgDirectReg").attr("src", data.FotoUrl || "images/sinImagen.png");
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
    const textoSms = `Detalles del Usuario: ${data.Nombres}.`;
    MostrarAlerta("¡Mensaje!", textoSms, "info");

});

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
    reader.onload = (e) => $('#imgDirectReg').attr('src', e.target.result);
    reader.readAsDataURL(file);

    // Mostrar nombre del archivo
    $(input).next('.custom-file-label').text(file.name);
}

// Función auxiliar para limpiar (DRY - Don't Repeat Yourself)
function resetearVistaFoto(input) {
    $('#imgDirectReg').attr('src', "images/sinImagen.png");
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

    let idRol = $("#cboRoles").val();
    let idCarrera = $("#cboCarreras").val();

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

    if (idRol === "") {
        MostrarToastZer("Por favor, seleccione un Rol.", "Atención", "warning");
        $("#cboRoles").focus();
        habilitarBoton();
        return;
    }

    if (idCarrera === "") {
        MostrarToastZer("Por favor, seleccione una Carrera.", "Atención", "warning");
        $("#cboCarreras").focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdUsuario: idEditar,
        IdRol: parseInt(idRol),
        IdCarrera: parseInt(idCarrera),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        Correo: $("#txtCorreo").val().trim(),
        NroCi: $("#txtNroci").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false),
        FotoUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
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
            enviarAjaxUsuarios(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxUsuarios(objeto, "");
    }

});

function enviarAjaxUsuarios(objeto, base64String) {
    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "UsuariosPage.aspx/GuardarOrEditUsuarios",
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
                // RECARGA OPTIMIZADA (No destruye la tabla)
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }

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

// fin